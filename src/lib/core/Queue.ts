import { utils } from "../utils"
import { Blueprint } from "./Blueprint"
import { DB } from "./DB"
import { Model } from "./Model"
import { T } from "./UtilityTypes"

type Job = {
  id: number
  name: string
  payload: any
}

type Handler = (job: Job) => Promise<any>;

type QueueAddOptions = {
  delayMs?: number          
  priority?: number       
  metadata?: Record<string, any>
}

const schema = {
    id: Blueprint.bigint().unsigned().primary().autoIncrement(),
    uuid: Blueprint.varchar(36).null(),

    name: Blueprint.varchar(255).notNull().compositeIndex([
        "state", "available_at", "priority", "id"
    ]),
   
    state: Blueprint.enum(
        'pending',
        'active',
        'completed',
        'failed'
    ).notNull().default('pending'),

    priority: Blueprint.int().notNull().default(0),

    payload: Blueprint.mediumtext().null(),
    result: Blueprint.text().null(),
    error: Blueprint.text().null(),
    metadata: Blueprint.text().null(),

    locked_by: Blueprint.text().null(),
    locked_at: Blueprint.timestamp().null(),
    
    available_at: Blueprint.timestamp().notNull(),
    created_at: Blueprint.timestamp().null(),
    updated_at: Blueprint.timestamp().null()
};

type TS = T.Schema<typeof schema>

class Worker extends Model<TS> {

    private MAX_IDLE = 8
    private stopping = false;
    private sleeping = false;
    private activeJobs = 0
    private idleCount = 0

    private handlers = new Map<string, Handler>()
    protected boot(): void {
        this.useUUID();
        this.useSchema(schema);
        this.useTimestamp();
        this.useTable('$jobs');
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

            metadata: opts.metadata
            ? this.safeJsonStringify(opts.metadata)
            : null
        })
        .save() as T.Result<Worker>

        this.idleCount = 0

        if (this.sleeping) {

            const handler = this.handlers.get(name);

            if(handler) {
                this.sleeping = false
                this.work(name , handler);
            }
               
        }

        return job;
    }

    public async work(name: string, handler: Handler, interval = 1_000) {
       
        this.handlers.set(name, handler);

        const loop = async () => {
           
            if (this.stopping) return;

            const job = await this._dequeue(name);

            if (job == null) {

                this.idleCount++

                if (this.idleCount >= this.MAX_IDLE) {
                    this.sleeping = true
                    return
                }

                return setTimeout(loop, interval)
            }

            this.idleCount = 0

            this.activeJobs++

            try {

                const result = await handler(job);

                await new Worker()
                .where('id',job.id)
                .update({
                    state : 'completed',
                    result : this.safeJsonStringify(result),
                })
                .void()
                .save()
            
            } catch (err:any) {
              
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

            } finally {
                if (this.activeJobs > 0) {
                    this.activeJobs--
                }
            }

            setImmediate(loop)
        }

        loop()
    }

    public async shutdown() {

        this.stopping = true

        while (this.activeJobs > 0) {
            console.log(`[Queue] waiting jobs: ${this.activeJobs}`)
            await new Promise(r => setTimeout(r, 100))
        }

        console.log("[Queue] shutdown complete")
    }

    private async _dequeue(name : string) {

        if (this.stopping) return null

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
            .select('*')
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
                payload: this.safeJsonParse(job.payload)
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
 * It must be initialized before use via `Queue.initialize()`.
 *
 * @example
 * ```ts
 * const sendEmail = (job) => console.log('send mail :' + job.id)
 * 
 * await Queue.initialize();
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
    static q: Worker;


    static MESSAGE = {
        INIT_ERROR: `Queue is not initialized. Please call 'await Queue.initialize()' before using it.`
    };

    /**
     * Initialize the Queue system.
     * Creates and prepares the underlying Worker instance.
     *
     * @returns {Promise<void>}
     */
    static async initialize(): Promise<void> {
        this.q = await new Worker().initialize();
    }

    /**
     * Flush all jobs in the queue (dangerous operation).
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     */
    static async flush(): Promise<void> {
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        await this.q.truncate({ force: true });
    }

    /**
     * Get aggregated queue statistics.
     *
     * @param {string} [name] - Optional queue name filter.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async getStats(name?: string): Promise<any> {
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.q.getStats(name);
    }

    /**
     * Get queue statistics grouped by name.
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async getStatsByName(): Promise<any> {
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.q.getStatsByName();
    }

    /**
     * Get all unique queue names.
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<string[]>}
     */
    static async getNames(): Promise<string[]> {
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.q.getNames();
    }

    /**
     * Access raw Worker instance safely.
     *
     * @param {(worker: Worker) => any} cb - Callback with Worker instance.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<any>}
     */
    static async worker(cb: (worker: Worker) => any): Promise<any> {
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await cb(this.q);
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
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.q.add(name, payload, opts);
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
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.q.work(name, handler, interval);
    }

    /**
     * Gracefully shutdown the queue system.
     * Waits for active jobs to finish before closing.
     *
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<void>}
     */
    static async shutdown(): Promise<void> {
        if (this.q == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.q.shutdown();
    }
}

export { Queue }
export default Queue