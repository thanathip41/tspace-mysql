import type { T }       from "./UtilityTypes"
import { Blueprint }    from "./Blueprint"
import { DB }           from "./DB"
import { Model }        from "./Model"
import { utils }        from "../utils"

export type Job<T = any> = {
  id      : number;
  name    : string;
  status  : 'pending' | 'active' |'completed' | 'failed'
  payload : T;
}

type JobInternal = Job & {
    __job : T.Result<Worker>;
}

type Handler = (job: Job) => any | Promise<any>;

type State = {
    handler     : Handler;
    idle        : number;
    sleeping    : boolean;
    running     : number;
    opts        : Required<QueueProcessOptions>
}

type QueueAddOptions = {
  delayMs     ?: number  // default now   
  priority    ?: number // default 0
  metadata    ?: Record<string, any> // default null
  maxAttempts ?: number // default 3
}

type QueueProcessOptions = { 
    interval    ?: number; 
    concurrency ?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 20 | 25 | 30; 
}

type BufferedJob = {
  jobData : T.Result<Worker>;
  resolve : (value: any) => void;
  reject  : (reason?: any) => void;
}

const QUEUE_STATUS = {
    dispatch    : 'Dispatch',
    receive     : 'Receive',
    processing  : 'Processing',
    completed   : 'Completed',
    idle        : 'Idle',
    wake        : 'Wake',
    failed      : 'Failed',
    waiting     : 'Waiting',
    retry       : {
        attempts  : 'Attempts',
        failed    : 'Retry Failed',
        completed : 'Retry Completed',
    }
} as const;

const schema = {
    id    : Blueprint.int().primary().autoIncrement(),
    uuid  : Blueprint.varchar(36).notNull(),
    name  : Blueprint.varchar(255).notNull()
    .index()
    .compositeIndex([
        "status", "available_at", "priority", "id"
    ]),
   
    status : Blueprint.enum(
        'pending',
        'active',
        'completed',
        'failed'
    ).notNull().default('pending').index(),

    priority     : Blueprint.int().notNull().default(0),
    payload      : Blueprint.mediumtext().null(),
    result       : Blueprint.text().null(),
    error        : Blueprint.text().null(),
    metadata     : Blueprint.text().null(),

    attempts     : Blueprint.int().notNull().default(0),
    max_attempts : Blueprint.int().notNull().default(3),

    locked_by    : Blueprint.text().null(),
    locked_at    : Blueprint.timestamp().null(),

    available_at : Blueprint.timestamp().notNull(),
    completed_at : Blueprint.timestamp().null(),
    created_at   : Blueprint.timestamp().null(),
    updated_at   : Blueprint.timestamp().null()
};

type TS = T.Schema<typeof schema>
class Worker extends Model<TS> {

    private HOSTNAME          = String(process.env.hostname ?? 'unknown');
    private INSPECT_EXEC      = false;
    private STOPPING          = false;
    private IS_FLUSHING       = false;

    private LIMIT_CONNECTIONS = 41;
    private MAX_IDLE_RETRIES  = 15;
    private ACTIVE_JOBS       = 0;
    private BATCH_SIZE        = 1000;
    private MAX_WAIT_MS       = 50;
  
    private BUFFER            = {
        jobs : [],
        timeout : null
    } as { 
        jobs: BufferedJob[]; 
        timeout: NodeJS.Timeout | null 
    };

    private WORKER_STATE     = new Map<string, {
        handler     : Handler;
        idle        : number;
        sleeping    : boolean;
        running     : number;
        opts        : Required<QueueProcessOptions>
    }>();

    protected boot(): void {
        this.useSchema(schema);
        this.useTimestamp();
        this.useUUID();
        this.useTable(this.$state.get("TABLE_JOB"));
    }

    public async initialize (opts: { 
        inspect          ?: boolean;
        flush            ?: boolean;
        hostname         ?: string;
        maxIdleRetries   ?: number;
        limitConnections ?: number;
    } = {}) {

        await this.sync({ force : true, index: true }).catch(() => null);

        if(opts.inspect) {
            this.INSPECT_EXEC = true;
            console.log(`\x1b[34mQueue:\x1b[0m \x1b[32mJob processing started\x1b[0m`);
        }

        if(opts.flush) {
            await this.flush();
        }

        if(opts.hostname) {
            this.HOSTNAME = opts.hostname;
        }

        if(opts.maxIdleRetries) {
            this.MAX_IDLE_RETRIES = opts.maxIdleRetries;
        }

        if(opts.limitConnections) {
            this.LIMIT_CONNECTIONS = opts.limitConnections;
        } 
        else {
            const maxConnections = await DB.getMaxConnections().catch(() => null);

            this.LIMIT_CONNECTIONS = maxConnections
            ? Math.max(10, Math.floor(maxConnections / 3))
            : this.LIMIT_CONNECTIONS;
        }

        return this;
    }

    public async shutdown() {

        this.STOPPING = true

        while (this.ACTIVE_JOBS > 0) {
            if(this.INSPECT_EXEC) {
                console.log(`\x1b[34mQueue:\x1b[0m waiting active jobs total '${this.ACTIVE_JOBS}'`)
            }
                
            await new Promise(r => setTimeout(r, 200))
        }

        if(this.INSPECT_EXEC) {
            console.log("\x1b[34mQueue:\x1b[0m \x1b[32mJob processing stopped\x1b[0m")
        }
    }

    public async flush() {
        await this.truncate({ force: true });
        return;
    }

    public async getJobOverallStats(name?: string) {

        const where = (q: Worker) => {
            if(name)  q.where('name','LIKE',`%${name}%`)
            return q;
        }

        const completed = await where(new Worker()).where('status', 'completed').count();
        const active    = await where(new Worker()).where('status', 'active').count();
        const pending   = await where(new Worker()).where('status', 'pending').count();
        const failed    = await where(new Worker()).where('status', 'failed').count();
        const total     = await where(new Worker()).count();

        return {
            total,
            completed,
            active,
            pending,
            failed,
        }
    }

    public async getJobStats(name?: string) {

        const rows = await new Worker()
        .select('name', 'status')
        .selectRaw('COUNT(1) AS total')
        .when(name, (q) => q.where('name', 'LIKE' , `%${name}%`))
        .groupBy('name', 'status')
        .orderBy('name')
        .get()

        const map = new Map<string, {
            name: string;
            completed: number;
            active: number;
            pending: number;
            failed: number;
        }>();

        for (const row of rows) {
            const name   = row.name;
            const status = row.status;
            const total  = Number(row.total);

            if (!map.has(name)) {
                map.set(name, {
                name,
                completed: 0,
                active: 0,
                pending: 0,
                failed: 0,
                });
            }

            const stats = map.get(name)!;

            if (status === 'completed') stats.completed = total;

            else if (status === 'active') stats.active = total;

            else if (status === 'pending') stats.pending = total;
            
            else if (status === 'failed') stats.failed = total;

        }

        return Array.from(map.values());
    }

    public async getNames() {
        return await new Worker().select('name').toArray('name');
    }
    public async add(name: string, payload: any, opts: QueueAddOptions = {}) {
        return new Promise<Promise<void>>((resolve, reject) => {
        
            const jobData = {
                name,
                payload: payload == null ? null : this.safeJsonStringify(payload),
                status: 'pending',
                available_at: opts.delayMs ? new Date(Date.now() + opts.delayMs) : new Date(),
                priority: opts.priority ?? 0,
                attempts: 0,
                max_attempts: opts.maxAttempts ?? 3,
                metadata: opts.metadata ? this.safeJsonStringify(opts.metadata) : null
            } as T.Result<Worker>;

            this.BUFFER.jobs.push({ jobData, resolve, reject });

            if (this.BUFFER.jobs.length >= this.BATCH_SIZE) {
                this._flushBuffer(name);
            } else if (!this.BUFFER.timeout) {
                this.BUFFER.timeout = setTimeout(() => this._flushBuffer(name), this.MAX_WAIT_MS);
            }
        });
    }

    public async process(
        name    : string, 
        handler : Handler, 
        opts    : QueueProcessOptions = { 
            interval : 1_000, 
            concurrency : 1 
        } 
    ) {
        this.WORKER_STATE.set(name , {
            handler      : handler,
            idle         : 0,
            sleeping     : false,
            running      : 0,   
            opts         : {
                concurrency : opts.concurrency!,
                interval    : opts.interval!
            }
        })

        if(this.INSPECT_EXEC) {
            console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.dispatch}\x1b[0m`)
        }

        const findJobs = async () => {

            if (this.STOPPING) return;

            const state = this.WORKER_STATE.get(name);

            if (!state) return;

            if (state.running >= state.opts.concurrency) {
                const jitter = Math.random() * 200;
                state.running--
                return setTimeout(findJobs, state.opts.interval + jitter);
            }

            const capacity = state.opts.concurrency - state.running;

            const jobs = await this._dequeueMany(name, capacity);

            if (!jobs || jobs.length === 0) {
                state.idle++

                if (state.idle >= this.MAX_IDLE_RETRIES) {
                    state.sleeping = true

                    if(this.INSPECT_EXEC) {
                        console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[90m${QUEUE_STATUS.idle} (no jobs available)\x1b[0m`)
                    }

                    return
                }

                const backoff = Math.min(1000, 50 * state.idle);
                const jitter = Math.random() * 200;
                return setTimeout(findJobs, opts.interval! + backoff + jitter);
            }

            state.idle = 0;

            for (const job of jobs) {
                this._runJob(name, job, state)
            }

            return setImmediate(findJobs);
        }

        findJobs();

        return;
    }

    private async _runJob (name: string, job: JobInternal, state: State) {
        state.running++
        this.ACTIVE_JOBS++
        const handler = state.handler;

        try {

            if (this.INSPECT_EXEC) {
                console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[38;2;77;215;240m${QUEUE_STATUS.processing}\x1b[0m job \x1b[38;5;208m${job.id}\x1b[0m`)
            }

            const startTime = +new Date();

            const result = await handler(job);

            await new Worker()
            .where('id', job.id)
            .update({
                status: 'completed',
                result: this.safeJsonStringify(result),
                completed_at: utils.timestamp()
            })
            .void()
            .save()

            const endTime = +new Date();

            if (this.INSPECT_EXEC) {
                console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.completed}\x1b[0m job \x1b[38;5;208m${job.id}\x1b[0m (${endTime - startTime}ms)`);
            }

        } catch (err:any) {

            if(this.INSPECT_EXEC) {
                console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[31m${QUEUE_STATUS.failed}\x1b[0m job \x1b[38;5;208m${job.id}\x1b[0m`)
            }

            await new Worker()
            .where('id',job.id)
            .update({
                status : 'failed',
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

                    const startTime = +new Date();

                    const result = await handler(job);

                    const endTime = +new Date();

                    await new Worker()
                    .where('id', job.id)
                    .update({
                        status: 'completed',
                        attempts,
                        result: this.safeJsonStringify(result),
                        completed_at: utils.timestamp()
                    })
                    .void()
                    .save();

                    if (this.INSPECT_EXEC) {
                        console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.retry.completed}\x1b[0m job \x1b[38;5;208m${job.id}\x1b[0m (${endTime - startTime}ms ${attempts}/${maxAttempts})`);
                    }

                    break;

                } catch (err: any) {

                    if (this.INSPECT_EXEC) {
                        console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[31m${QUEUE_STATUS.retry.attempts}\x1b[0m job \x1b[38;5;208m${job.id}\x1b[0m (${attempts}/${maxAttempts})`);
                    }

                    if (attempts >= maxAttempts) {

                        await new Worker()
                        .where('id', job.id)
                        .update({
                            status: 'failed',
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

                        if (this.INSPECT_EXEC) {
                            console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[31m${QUEUE_STATUS.retry.failed}\x1b[0m job \x1b[38;5;208m${job.id}\x1b[0m (\x1b[33mmax attempts reached\x1b[0m)`);
                        }

                        break;
                    }

                    await new Promise((r) => setTimeout(r, 1_000 * 2));
                }
            }
         
        } finally {
            // state.running--
            this.ACTIVE_JOBS--
        }
    }

    private async _waitForSafeConnections (name: string) {
        let activeConnections = 0;

        while (true) {
            
            activeConnections = await DB.getActiveConnections();
        
            if (activeConnections <= this.LIMIT_CONNECTIONS) {
                break;
            }

            if (this.INSPECT_EXEC) {
                console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[31m${QUEUE_STATUS.waiting}\x1b[0m DB connections high \x1b[33m (${activeConnections}/${this.LIMIT_CONNECTIONS})\x1b[0m`);
            }

            await new Promise(resolve => setTimeout(resolve, 1000 * 5));
        }
        return;
    }

    private async _dequeueMany(name: string, limit: number) {

        if (this.STOPPING) return [];
       
        await this._waitForSafeConnections(name);

        const findJobs = await new Worker()
        .select('id')
        .where('name',name)
        .whereQuery(q => {
            return q
            .where('status','pending')
            .where('available_at', '<=', utils.timestamp())
            .orWhereQuery((q) => {
                return q
                .where('status', 'active')
                .where('locked_at', '<', utils.timestamp(new Date(Date.now() - 60 * 1000)))
            })
        })
        .limit(limit)
        .get()

        if(!findJobs.length) {
            return [];
        }

        return await DB.transaction(async (trx) => {

            const jobs = await new Worker()
            .whereIn('id',findJobs.map(v => v.id))
            .latest('priority')
            .oldest('id')
            .limit(limit)
            .forUpdate({ skipLocked : true })
            .bind(trx)
            .get()

            if (!jobs.length) {
                return [];
            }

            await new Worker()
            .whereIn('id',jobs.map(v => v.id))
            .updateMany({
                status : 'active',
                locked_at: utils.timestamp(),
                locked_by : this.HOSTNAME
            })
            .void()
            .bind(trx)
            .limit(limit)
            .save()

            return (jobs ?? []).map((job) => ({
                id      : job.id,
                name    : job.name,
                status  : job.status,
                payload : this.safeJsonParse(job.payload),
                __job   : job
            }))
        })
    }

    private async _flushBuffer(name : string) {

        if (this.IS_FLUSHING || this.BUFFER.jobs.length === 0) return;

        if (this.BUFFER.timeout) {
            clearTimeout(this.BUFFER.timeout);
            this.BUFFER.timeout = null;
        }

        const currentBatch = this.BUFFER.jobs;

        this.IS_FLUSHING = true;

        this.BUFFER.jobs = [];
    
        this.IS_FLUSHING = false; 
    
        try {
            const jobsToInsert = currentBatch.map(b => b.jobData);

            const insertedJobds = await new Worker()
            .select('id')
            .insertMany(jobsToInsert)
            .save() as T.InsertManyResult<Worker>

            if (this.INSPECT_EXEC) {
                const ids = insertedJobds.map(v => v.id);

                const preview = [
                    ...ids.slice(0, 3),
                    "...",
                    ...ids.slice(-2),
                ].join(', ');

                if(ids.length === 1) {
                    
                    console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.receive}\x1b[0m job \x1b[38;5;208m${ids}\x1b[0m`);
                } else {
                    
                    console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.receive}\x1b[0m jobs [\x1b[38;5;208m${preview}\x1b[0m] total=(\x1b[38;5;208m${ids.length}\x1b[0m)`);
                }

            }
    
            for (let i = 0; i < currentBatch.length; i++) {
                currentBatch[i].resolve(undefined);
            }

            const uniqueNames = [...new Set(currentBatch.map(b => b.jobData.name))];

            uniqueNames.forEach(name => this._wakeWorker(name));

        } catch (error) {

            currentBatch.forEach(b => b.reject(error));

        } finally {
            if (this.BUFFER.jobs.length) {
                this._flushBuffer(name);
            }
        }
    }

    private _wakeWorker(name: string) {
        const state = this.WORKER_STATE.get(name);

        if (!state || !state.sleeping || !state.handler) return;

        state.sleeping = false;
        state.idle = 0;

        if (this.INSPECT_EXEC) {
            console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[36m${QUEUE_STATUS.wake}\x1b[0m`);
        }

        this.process(name, state.handler, { concurrency : state.opts.concurrency });
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
 * await Queue.start({ inspect : true, flush : true // **remove all jobs });
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
     * @type {Worker | null}
     */
    private static WORKER: Worker | null;

    private static MESSAGE = {
        INIT_ERROR: `Queue is not initialized. Please call 'await Queue.start()' before using it.`
    };

    /**
     * The 'start' method is used to initialize the Queue system.
     * Creates and prepares the underlying Worker instance.
     * @param {Object} [opts] - options (inspect, flush)
     * @property {boolean} opts.inspect queue work flow
     * @property {boolean} opts.flush  remove all queue
     * @property {number} opts.maxIdleRetries - Maximum idle time () when no jobs are available
     * @property {number} opts.limitConnections - Allowed DB connections limit before pausing
     * @returns {Promise<void>}
     */
    static async start(opts: { 
        inspect          ?: boolean; 
        flush            ?: boolean; 
        hostname         ?: string;
        maxIdleRetries   ?: number;
        limitConnections ?: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 | 150 | 200;
    } = {}): Promise<void> {

      this.WORKER = await new Worker().initialize(opts);

      return;
    }

    /**
     * The 'end' method is used to shutdown the Queue system.
     *
     * @returns {Promise<void>}
     */
    static async end(): Promise<void> {

      if (this.WORKER == null) {
        throw new Error(this.MESSAGE.INIT_ERROR);
      }

      await this.WORKER.shutdown();

      this.WORKER = null;

      return;
    }

    /**
     * The 'flush' method is used to flush all jobs in the queue (dangerous operation).
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     */
    static async flush(): Promise<void> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        await this.WORKER.flush();
    }

    /**
     * The 'getJobOverallStats' method is used to get aggregated queue statistics.
     * 
     * @param {string} [name] - Optional queue name filter.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async getJobOverallStats(name?: string): Promise<{
      total     : number;
      completed : number;
      active    : number;
      pending   : number;
      failed    : number;
    }> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.getJobOverallStats(name);
    }

    /**
     * The 'getJobStats' method is used to Get jobs statistics grouped by name.
     * 
     * @param {string} [name] - Optional queue name filter.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<Record<string,any>>}
     */
    static async getJobStats(name?: string): Promise<{
      completed : number;
      active    : number;
      pending   : number;
      failed    : number;
    }[]> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.getJobStats(name);
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
     * @param {QueueProcessOptions} [opts] - Job options (interval, concurrency)
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
    static async process(
        name    : string, 
        handler : Handler, 
        opts    : QueueProcessOptions = { interval : 1_000, concurrency : 1 }
    ): Promise<void> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.process(name, handler, opts);
    }

    /**
     * Start a worker for processing jobs of a specific name.
     *
     * @param {string} name - Queue name to process.
     * @param {Handler} handler - Job handler function.
     * @param {QueueProcessOptions} [opts] - Job options (interval, concurrency)
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     * 
     * @example
     * const helloWorld = (job) => console.log('hello world :' + job.id);
     * 
     * Queue.on("hello", async (job) => {
     *  return await helloWorld(job)
     * }, { concurrency : 3 });
     */
    static async on(
        name    : string, 
        handler : Handler, 
        opts    : QueueProcessOptions = { interval : 1_000, concurrency : 1 }
    ): Promise<void> {
        
        return await this.process(name, handler, opts);
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
    static async add(
        name    : string, 
        payload : any, 
        opts    : QueueAddOptions = {}
    ): Promise<void> {
        
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.add(name, payload, opts);
    }
}

export { Queue }
export default Queue