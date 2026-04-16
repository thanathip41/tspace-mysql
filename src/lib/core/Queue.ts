import { utils } from "../utils"
import { Blueprint } from "./Blueprint"
import { DB } from "./DB"
import { Model } from "./Model"
import { T } from "./UtilityTypes"

type Job = {
  id: number;
  name: string;
  payload: any;
}

type Handler = (job: Job) => any | Promise<any>;

type QueueAddOptions = {
  delayMs?: number          
  priority?: number       
  metadata?: Record<string, any>
  maxAttempts ?: number
}

type BufferedJob = {
  jobData: any;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

const schema = {
    id    : Blueprint.int().primary().autoIncrement(),
    uuid  : Blueprint.varchar(36).null(),

    name  : Blueprint.varchar(255).notNull().compositeIndex([
        "state", "available_at", "priority", "id"
    ]),
   
    state : Blueprint.enum(
        'pending',
        'active',
        'completed',
        'failed'
    ).notNull().default('pending'),

    priority : Blueprint.int().notNull().default(0),

    payload  : Blueprint.mediumtext().null(),
    result   : Blueprint.text().null(),
    error    : Blueprint.text().null(),
    metadata : Blueprint.text().null(),

    attempts: Blueprint.int().notNull().default(0),
    max_attempts: Blueprint.int().notNull().default(3),

    locked_by: Blueprint.text().null(),
    locked_at: Blueprint.timestamp().null(),
    
    available_at : Blueprint.timestamp().notNull(),
    created_at   : Blueprint.timestamp().null(),
    updated_at   : Blueprint.timestamp().null()
};

type TS = T.Schema<typeof schema>

class Worker extends Model<TS> {

  private buffer: BufferedJob[] = [];
  private bufferTimeout: NodeJS.Timeout | null = null;
  private isFlushing = false;

  // ตั้งค่า Tuning
  private readonly BATCH_SIZE  = 1000; // ครบ 1,000 อันยิงทันที
  private readonly MAX_WAIT_MS = 10;  // หรือถ้ารอนานเกิน 100ms ก็ยิงเลย

  private MAX_IDLE     = 10;
  private STOPPING     = false;
  private ACTIVE_JOBS  = 0;
  
  private WORKER_STATE = new Map<string, {
    handler    : Handler;
    idle       : number;
    sleeping   : boolean;
  }>

  private QUEUE_LOG = {
    dispatch: 'dispatch',
    receive: 'receive',
    processing: 'processing',
    done: 'done',
    idle: 'idle',
    wake: 'wake',
    fail: 'fail',
    retry : {
      try      : 'try',
      attempts : 'attempts',
      fail     : 'retry fail'
    }
  }

  private DEBUG_LIFECYCLE = true;

  protected boot(): void {
    this.useUUID();
    this.useSchema(schema);
    this.useTimestamp();
    this.useTable(this.$state.get("TABLE_JOB"));
  }

  public async initialize () {
      await this.sync({ force : true , index: true });
      return this;
  }

  public async getStats(name?: string) {

      const where = (q: Worker) => {
          if (name) q.where('name', name)
          return q
      }

      return {
          completed: await where(new Worker()).where('state', 'completed').count(),
          active: await where(new Worker()).where('state', 'active').count(),
          pending: await where(new Worker()).where('state', 'created').count(),
          failed: await where(new Worker()).where('state', 'failed').count(),
      }
  }

  public async getStatsByName() {

    const rows = await new Worker()
    .select('name', 'state')
    .selectRaw('count(id) AS total')
    .groupBy('name', 'state')
    .get()

    const stats = rows.reduce((acc, row) => {

        const name = row.name
        const state = row.state
        const total = Number(row.total)

        if (!acc[name]) {

            acc[name] = {
                completed: 0,
                active: 0,
                pending: 0,
                failed: 0
            }
        }

        if (state === 'completed') acc[name].completed = total
        else if (state === 'active') acc[name].active = total
        else if (state === 'pending') acc[name].pending = total
        else if (state === 'failed') acc[name].failed = total

        return acc
    },{} as Record<string, {
            completed : number
            active    : number
            pending   : number
            failed    : number
        }>
    )

    return stats;
  }

  public async getNames() {
    return await new Worker().select('name').toArray('name');
  }

  public async add(name: string, payload: any, opts: QueueAddOptions = {}) {

    const job = await new Worker()
    .insert({
        name,
        payload: payload == null ? null : this.safeJsonStringify(payload),
        state: 'pending',
        available_at: opts.delayMs
        ? new Date(Date.now() + opts.delayMs)
        : new Date(),

        priority: opts.priority ?? 0,

        attempts     : 0,
        max_attempts : opts.maxAttempts ?? 3,

        metadata: opts.metadata
        ? this.safeJsonStringify(opts.metadata)
        : null
    })
    .save() as T.Result<Worker>

    if(this.DEBUG_LIFECYCLE) {
      console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.receive} job ${job.id}\x1b[0m`)
    }

    const state = this.WORKER_STATE.get(name);

    if(!state) return;

    state.idle = 0;

    if (state.sleeping) {

        const { handler } = state;

        if(handler) {
          state.sleeping = false;
          if(this.DEBUG_LIFECYCLE) {
            console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.wake}\x1b[0m`)
          }
          await this.work(name , handler);
        }
          
    }
    
    return;
  }

  // public async add(name: string, payload: any, opts: QueueAddOptions = {}) {
  //   return new Promise<T.Result<Worker>>((resolve, reject) => {
      
  //     const jobData = {
  //       name,
  //       payload: payload == null ? null : this.safeJsonStringify(payload),
  //       state: 'pending',
  //       available_at: opts.delayMs ? new Date(Date.now() + opts.delayMs) : new Date(),
  //       priority: opts.priority ?? 0,
  //       attempts: 0,
  //       max_attempts: opts.maxAttempts ?? 3,
  //       metadata: opts.metadata ? this.safeJsonStringify(opts.metadata) : null
  //     };

  //     this.buffer.push({ jobData, resolve, reject });

  //     if (this.buffer.length >= this.BATCH_SIZE) {
  //       this.flushBuffer();
  //     } else if (!this.bufferTimeout) {
  //       this.bufferTimeout = setTimeout(() => this.flushBuffer(), this.MAX_WAIT_MS);
  //     }
  //   });
  // }

  private async flushBuffer() {

    if (this.isFlushing || this.buffer.length === 0) return;

    if (this.bufferTimeout) {
      clearTimeout(this.bufferTimeout);
      this.bufferTimeout = null;
    }

    this.isFlushing = true;

    const currentBatch = this.buffer;
   
    this.buffer = [];
   
    this.isFlushing = false; 
   
    try {
      const jobsToInsert = currentBatch.map(b => b.jobData);

      const insertedJobs = await new Worker()
      .insertMany(jobsToInsert)
      .save() as T.InsertManyResult<Worker>
  
      console.log('job length '+ jobsToInsert.length)
      for (let i = 0; i < currentBatch.length; i++) {
        currentBatch[i].resolve(insertedJobs[i]);
      }

      const uniqueNames = [...new Set(currentBatch.map(b => b.jobData.name))];

      uniqueNames.forEach(name => this.wakeWorker(name));

    } catch (error) {
      currentBatch.forEach(b => b.reject(error));
    } finally {
      if (this.buffer.length > 0) {
        this.flushBuffer();
      }
    }
  }

  private wakeWorker(name: string) {
    const state = this.WORKER_STATE.get(name);
    if (!state || !state.sleeping || !state.handler) return;

    state.sleeping = false;
    state.idle = 0;

    if (this.DEBUG_LIFECYCLE) {
      console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.wake}\x1b[0m`);
    }

    // ห้าม await ฟังก์ชัน work ตรงนี้! ให้มันรันเป็น Background ไปเลย
    this.work(name, state.handler).catch(err => {
      console.error(`[Queue Error] ${name}:`, err);
      state.sleeping = true;
    });
  }

  public async work(name: string, handler: Handler, interval = 1_000) {
      
      this.WORKER_STATE.set(name , {
        handler   : handler,
        idle      : 0,
        sleeping  : false
      })

      if(this.DEBUG_LIFECYCLE) {
        console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.dispatch}\x1b[0m`)
      }

      const findJobs = async () => {
          
          if (this.STOPPING) {
            if (this.ACTIVE_JOBS > 0) {
              this.ACTIVE_JOBS--
            }
            return;
          }

          const state = this.WORKER_STATE.get(name);

          const job = await this._dequeue(name) as (Job & { __job: T.Result<Worker, unknown> }) | null

          if (job == null) {

            if(state) {

              state.idle++

              if (state.idle >= this.MAX_IDLE) {
                state.sleeping = true

                if(this.DEBUG_LIFECYCLE) {
                  console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.idle}\x1b[0m`)
                }
                return
              }
            }

            return setTimeout(findJobs, interval)
          }

          if(state) state.idle = 0

          this.ACTIVE_JOBS++

          try {

            if(this.DEBUG_LIFECYCLE) {
              console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.processing} job ${job.id}\x1b[0m`)
            }

            const result = await handler(job);

            await new Worker()
            .where('id',job.id)
            .update({
                state : 'completed',
                result : this.safeJsonStringify(result),
            })
            .void()
            .save()

            if(this.DEBUG_LIFECYCLE) {
              console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.done} job ${job.id}\x1b[0m`)
            }
          
          } catch (err:any) {
            
            if(this.DEBUG_LIFECYCLE) {
              console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.fail} job ${job.id}\x1b[0m`)
            }

            await new Worker()
              .where('id',job.id)
              .update({
                  state : 'failed',
                  error : this.safeJsonStringify({
                      message: err.message,
                      name: err.name,
                      stack: err.stack,
                      code: err.code,
                  })
              })
              .void()
              .save()

              const maxAttempts = job.__job.max_attempts;

              let attempts = job.__job.attempts;

              while (attempts < maxAttempts) {

                attempts++;

                try {

                  const result = await handler(job);

                  await new Worker()
                    .where('id', job.id)
                    .update({
                      state: 'completed',
                      attempts,
                      result: this.safeJsonStringify(result),
                    })
                    .void()
                    .save();

                  if (this.DEBUG_LIFECYCLE) {
                    console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.done} job ${job.id}\x1b[0m`);
                  }

                  break;

                } catch (err: any) {

                  if (this.DEBUG_LIFECYCLE) {
                    console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.retry.attempts} job ${job.id} (${attempts}/${maxAttempts})\x1b[0m`);
                  }

                  if (attempts >= maxAttempts) {

                    await new Worker()
                      .where('id', job.id)
                      .update({
                        state: 'failed',
                        attempts,
                        error: this.safeJsonStringify({
                          retry  : true,
                          message: err?.message,
                          name: err?.name,
                          stack: err?.stack,
                          code: err?.code,
                        }),
                      })
                      .void()
                      .save();

                    if (this.DEBUG_LIFECYCLE) {
                      console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.retry.fail} job ${job.id} (max attempts reached)\x1b[0m`);
                    }

                    break;
                  }

                  await new Promise((r) => setTimeout(r, 1_000 * 2));
                }
              }

          } finally {
            if (this.ACTIVE_JOBS > 0) {
                this.ACTIVE_JOBS--
            }
          }

          setImmediate(findJobs)
      }

      findJobs();

      return;
  }

  public async shutdown() {

      this.STOPPING = true

      while (this.ACTIVE_JOBS > 0) {
        console.log(`\x1b[32m[Queue] waiting active jobs total '${this.ACTIVE_JOBS}'\x1b[0m`)
        await new Promise(r => setTimeout(r, 200))
      }

      console.log("\x1b[32m[Queue] shutdown complete\x1b[0m")
  }

  private async _dequeue(name : string) {

    if (this.STOPPING) return null

    const jobEx = await new Worker()
    .select('id')
    .where('name',name)
    .whereQuery(q => {
        return q
        .where('state','pending')
        .where('available_at', '<=', utils.timestamp())
        .orWhereQuery((q) => {
          return q
          .where('state', 'active')
          .where('locked_at', '<', utils.timestamp(new Date(Date.now() - 60 * 1000)))
        })
    })
    .latest('priority')
    .oldest('id')
    .first()

    if(jobEx == null) return null;

    const trx = await DB.beginTransaction()

    try {

        await trx.startTransaction()

        const job = await new Worker()
        .where('id',jobEx.id)
        .forUpdate({ skipLocked : true })
        .bind(trx)
        .first()

        if (!job) {
          await trx.rollback()
          return null
        }

        await new Worker()
        .where('id',job.id)
        .update({
          state : 'active',
          locked_at: utils.timestamp(),
          locked_by : process?.env?.HOSTNAME ?? 'unknown'
        })
        .void()
        .bind(trx)
        .save()

        await trx.commit();

        return {
          id: job.id,
          name: job.name,
          payload: this.safeJsonParse(job.payload),
          __job : job
        }

    } catch (err) {
        await trx.rollback();
        throw err
    }
  }

  private safeJsonParse(payload:any){
      try {
          return JSON.parse(payload);
      } catch (err) {
          return payload;
      }
  }

  private safeJsonStringify(payload: any) {

      if(payload == null) return null;

      try {
          
          return JSON.stringify(payload, (_, value) => {
              if (typeof value === 'bigint') {
                  return value.toString()
              }
              
              if (value instanceof Map) {
                  return Object.fromEntries(value)
              }

              if (value instanceof Set) {
                  return Array.from(value)
              }

              return value
          })

      } catch (err) {
          return payload
      }
  }

}

/**
 * Queue facade class (static API wrapper)
 *
 * This class provides a singleton-style interface over the underlying Worker instance.
 * It must be initialized before use via `Queue.start()`.
 *
 * @example
 * ```ts
 * const sendEmail = (job) => console.log('send mail :' + job.id)
 * 
 * await Queue.start();
 *
 * // register worker
 * Queue.work("send-email", async (job) => {
 *     return await sendEmail(job);
 * });
 *
 * // add job
 * Queue.add("send-email", { email: "test@gmail.com" });
 * ```
 */
class Queue {
    /**
     * Internal Worker instance used for all queue operations.
     * @type {Worker | undefined}
     */
    private static WORKER: Worker;


    private static MESSAGE = {
        INIT_ERROR: `Queue is not initialized. Please call 'await Queue.start()' before using it.`
    };

    /**
     * Initialize the Queue system.
     * Creates and prepares the underlying Worker instance.
     *
     * @returns {Promise<void>}
     */
    static async start(): Promise<void> {
      this.WORKER = await new Worker().initialize();
    }

    static async end(): Promise<void> {
      if (this.WORKER == null) {
        throw new Error(this.MESSAGE.INIT_ERROR);
      }

      await this.WORKER.shutdown();
    }

    /**
     * Flush all jobs in the queue (dangerous operation).
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     */
    static async flush(): Promise<void> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        await this.WORKER.truncate({ force: true });
    }

    /**
     * Get aggregated queue statistics.
     *
     * @param {string} [name] - Optional queue name filter.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async getStats(name?: string): Promise<{
      completed : number;
      active    : number;
      pending   : number;
      failed    : number;
    }> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.getStats(name);
    }

    /**
     * Get queue statistics grouped by name.
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<Record<string,any>>}}
     */
    static async getStatsByName(): Promise<Record<string, {
      completed : number;
      active    : number;
      pending   : number;
      failed    : number;
    }>> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.getStatsByName();
    }

    /**
     * Get all unique queue names.
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<string[]>}
     */
    static async getNames(): Promise<string[]> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.getNames();
    }

    /**
     * Access raw Worker instance safely.
     *
     * @param {(worker: Worker) => any} cb - Callback with Worker instance.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async worker(cb: (worker: Worker) => any): Promise<any> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await cb(this.WORKER);
    }

    /**
     * Add a new job into the queue.
     *
     * @param {string} name - Queue name / job type.
     * @param {any} payload - Job payload data.
     * @param {QueueAddOptions} [opts] - Job options (delay, priority, retry, etc.)
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async add(name: string, payload: any, opts: QueueAddOptions = {}): Promise<any> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.add(name, payload, opts);
    }

    /**
     * Start a worker for processing jobs of a specific name.
     *
     * @param {string} name - Queue name to process.
     * @param {Handler} handler - Job handler function.
     * @param {number} [interval] - Polling interval in ms.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async work(name: string, handler: Handler, interval?: number): Promise<any> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.work(name, handler, interval);
    }

    /**
     * Gracefully shutdown the queue system.
     * Waits for active jobs to finish before closing.
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     */
    static async shutdown(): Promise<void> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.shutdown();
    }
}

export { Queue }
export default Queue