import type { T }       from "./UtilityTypes"
import { Blueprint }    from "./Blueprint"
import { DB }           from "./DB"
import { Model }        from "./Model"
import { utils }        from "../utils"

type Job<T = any> = {
  id      : number;
  name    : string;
  payload : T;
}

type JobInternal = Job & {
    __job : T.Result<Worker>;
}

type Handler = (job: Job) => any | Promise<any>;

type QueueAddOptions = {
  delayMs?: number          
  priority?: number       
  metadata?: Record<string, any>
  maxAttempts ?: number
}

type QueueWorkOptions = { 
    interval ?: number; 
    concurrency ?: number; 
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
    completed_at : Blueprint.timestamp().null(),
    created_at   : Blueprint.timestamp().null(),
    updated_at   : Blueprint.timestamp().null()
};

type TS = T.Schema<typeof schema>
class Worker extends Model<TS> {

    private buffer: BufferedJob[] = [];
    private bufferTimeout: NodeJS.Timeout | null = null;
    private isFlushing   = false;

    private BATCH_SIZE   = 1000;
    private MAX_WAIT_MS  = 50;

    private MAX_IDLE     = 10;
    private STOPPING     = false;
    private ACTIVE_JOBS  = 0;
    
    private WORKER_STATE = new Map<string, {
        handler     : Handler;
        idle        : number;
        sleeping    : boolean;
        running     : number;
        concurrency : number;
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

    private DEBUG_LIFECYCLE = false;

    protected boot(): void {
        this.useUUID();
        this.useSchema(schema);
        this.useTimestamp();
        this.useTable(this.$state.get("TABLE_JOB"));
    }

    public debugLifeCycle () {
        this.DEBUG_LIFECYCLE = true
        return this;
    }

    public async initialize () {
        await this.sync({ force : true , index: true });
        return this;
    }

    public async shutdown() {

        this.STOPPING = true

        while (this.ACTIVE_JOBS > 0) {
            console.log(`\x1b[32m[Queue] waiting active jobs total '${this.ACTIVE_JOBS}'\x1b[0m`)
            await new Promise(r => setTimeout(r, 200))
        }

        console.log("\x1b[32m[Queue] shutdown complete\x1b[0m")
    }

    public async overall(name?: string) {

        const where = (q: Worker) => {
            if (name) q.where('name', name)
            return q
        }

        return {
            completed : await where(new Worker()).where('state', 'completed').count(),
            active    : await where(new Worker()).where('state', 'active').count(),
            pending   : await where(new Worker()).where('state', 'pending').count(),
            failed    : await where(new Worker()).where('state', 'failed').count(),
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
        return new Promise<Promise<T.Result<Worker>>>((resolve, reject) => {
        
            const jobData = {
                name,
                payload: payload == null ? null : this.safeJsonStringify(payload),
                state: 'pending',
                available_at: opts.delayMs ? new Date(Date.now() + opts.delayMs) : new Date(),
                priority: opts.priority ?? 0,
                attempts: 0,
                max_attempts: opts.maxAttempts ?? 3,
                metadata: opts.metadata ? this.safeJsonStringify(opts.metadata) : null
            };

            this.buffer.push({ jobData, resolve, reject });

            if (this.buffer.length >= this.BATCH_SIZE) {
                this._flushBuffer();
            } else if (!this.bufferTimeout) {
                this.bufferTimeout = setTimeout(() => this._flushBuffer(), this.MAX_WAIT_MS);
            }
        });
    }

    public async process(name: string, handler: Handler, opts : QueueWorkOptions = { interval : 1_000, concurrency : 1 } ) {
        
        this.WORKER_STATE.set(name , {
            handler   : handler,
            idle      : 0,
            sleeping  : false,
            running   : 0,   
            concurrency  : opts.concurrency!
        })

        if(this.DEBUG_LIFECYCLE) {
            console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.dispatch}\x1b[0m`)
        }

        const findJobs = async () => {

        if (this.STOPPING) return;

            const state = this.WORKER_STATE.get(name);

            if (!state) return;

            if (state.running >= state.concurrency) {
                return setTimeout(findJobs, opts.interval)
            }

            const capacity = state.concurrency - state.running;

            const jobs = await this._dequeueMany(name, capacity);

            if (!jobs || jobs.length === 0) {
                state.idle++

                if (state.idle >= this.MAX_IDLE) {
                    state.sleeping = true

                    if(this.DEBUG_LIFECYCLE) {
                        console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.idle}\x1b[0m`)
                    }
                    return
                }
                return setTimeout(findJobs, opts.interval);
            }

            state.idle = 0;

            const promises: Function[] = [];

            for (const job of jobs) {
                promises.push(() => this._runJob(name, job, state));
            }

            await Promise.all(promises.map(v => v()));

            await new Promise((r) => setTimeout(r, 200 * jobs.length));

            setImmediate(findJobs);
        }

        findJobs();

        return;
    }

    private async _runJob (name: string, job: JobInternal, state: any) {
        state.running++
        this.ACTIVE_JOBS++
        const handler = state.handler;

        try {

            if (this.DEBUG_LIFECYCLE) {
                console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.processing} job ${job.id}\x1b[0m`)
            }

            const result = await handler(job)

            await new Worker()
            .where('id', job.id)
            .update({
                state: 'completed',
                result: this.safeJsonStringify(result),
                completed_at: utils.timestamp()
            })
            .void()
            .save()

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
            state.running--
            this.ACTIVE_JOBS--
        }
    }

    private async _dequeueMany(name: string, limit: number) {

        if (this.STOPPING) return []

        const trx = await DB.beginTransaction()

        try {

            await trx.startTransaction();

            const jobs = await new Worker()
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
            .limit(limit)
            .forUpdate({ skipLocked : true })
            .bind(trx)
            .get()

            if (!jobs.length) {
                await trx.rollback()
                return [];
            }

            await new Worker()
            .whereIn('id',jobs.map(v => v.id))
            .updateMany({
                state : 'active',
                locked_at: utils.timestamp(),
                locked_by : process?.env?.HOSTNAME ?? 'unknown'
            })
            .void()
            .bind(trx)
            .limit(limit)
            .save()

            await trx.commit();

            return (jobs ?? []).map((job) => ({
                id: job.id,
                name: job.name,
                payload: this.safeJsonParse(job.payload),
                __job: job
            }))

        } catch (err) {
            await trx.rollback();
            throw err
        }
    }

    private async _flushBuffer() {

        if (this.isFlushing || this.buffer.length === 0) return;

        if (this.bufferTimeout) {
            clearTimeout(this.bufferTimeout);
            this.bufferTimeout = null;
        }

        const currentBatch = this.buffer;

        this.isFlushing = true;

        this.buffer = [];
    
        this.isFlushing = false; 
    
        try {
            const jobsToInsert = currentBatch.map(b => b.jobData);

            const insertedJobs = await new Worker()
            .insertMany(jobsToInsert)
            .save() as T.InsertManyResult<Worker>
    
            for (let i = 0; i < currentBatch.length; i++) {
                currentBatch[i].resolve(insertedJobs[i]);
            }

            const uniqueNames = [...new Set(currentBatch.map(b => b.jobData.name))];

            uniqueNames.forEach(name => this._wakeWorker(name));

        } catch (error) {

            currentBatch.forEach(b => b.reject(error));

        } finally {
            if (this.buffer.length > 0) {
                this._flushBuffer();
            }
        }
    }

    private _wakeWorker(name: string) {
        const state = this.WORKER_STATE.get(name);

        if (!state || !state.sleeping || !state.handler) return;

        state.sleeping = false;
        state.idle = 0;

        if (this.DEBUG_LIFECYCLE) {
            console.log(`\x1b[32m[Queue] name: '${name}' ${this.QUEUE_LOG.wake}\x1b[0m`);
        }

        this.process(name, state.handler);
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
 * const sendEmail = (job) => console.log('send mail :' + job.payload.email)
 * 
 * await Queue.start();
 * 
 * // await Queue.flush(); **remove all jobs
 *
 * // register
 * Queue.progress("send-email", async (job) => {
 *     return await sendEmail(job);
 * }, { concurrency : 3 });
 *
 * // add
 * Queue.add("send-email", { email: "test@gmail.com" });
 * 
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

    /**
     * Shutdown the Queue system.
     *
     * @returns {Promise<void>}
     */
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
    static async overall(name?: string): Promise<{
      completed : number;
      active    : number;
      pending   : number;
      failed    : number;
    }> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.overall(name);
    }

    /**
     * Get jobs statistics grouped by name.
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
     * Start a worker for processing jobs of a specific name.
     *
     * @param {string} name - Queue name to process.
     * @param {Handler} handler - Job handler function.
     * @param {QueueWorkOptions} [opts] - Job options (interval, concurrency)
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     * 
     * @example
     * const helloWorld = (job) => console.log('hello world :' + job.id);
     * 
     * Queue.progress("hello", async (job) => {
     *  return await helloWorld(job)
     * }, { concurrency : 3 });
     */
    static async process(name: string, handler: Handler, opts: QueueWorkOptions = { interval : 1_000, concurrency : 1 }): Promise<void> {
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.process(name, handler, opts);
    }

    /**
     * Add a new job into the queue.
     *
     * @param {string} name - Queue name / job type.
     * @param {any} payload - Job payload data.
     * @param {QueueAddOptions} [opts] - Job options (delay, priority, retry, etc.)
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<T.Result<Worker>>}
     * 
     * @example
     * ```ts
     * Queue.add("send-email", { email: "test@gmail.com" });
     * ```
     */
    static async add(name: string, payload: any, opts: QueueAddOptions = {}): Promise<T.Result<Worker>> {
        
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.add(name, payload, opts);
    }

    /**
     * debug life cycle queue
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {void}
     */
    static debugLifeCycle (): void {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        this.WORKER.debugLifeCycle();

        return;
    }
}

export { Queue }
export default Queue