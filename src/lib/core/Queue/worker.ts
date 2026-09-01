import type { T }       from "../UtilityTypes";
import { Blueprint }    from "../Blueprint";
import { DB }           from "../DB";;
import { Model }        from "../Model";
import type { 
    BufferedJob, 
    Handler, 
    JobInternal, 
    QueueAddOptions, 
    QueueProcessOptions, 
    State 
} from "./types";

const QUEUE_STATUS = {
    dispatch    : 'Dispatch',
    receive     : 'Receive',
    processing  : 'Processing',
    completed   : 'Completed',
    idle        : 'Idle',
    wokeUp      : 'Woke up',
    failed      : 'Failed',
    waiting     : 'Waiting',
    retry       : {
        attempts  : 'Attempts',
        failed    : 'Retry Failed',
        completed : 'Retry Completed',
    }
} as const;

const STATUS = {
    'pending' : 'pending',
    'active' : 'active',
    'completed': 'completed',
    'failed': 'failed'
} as const

const schema = {
    id    : Blueprint.int().primary().autoIncrement(),
    uuid  : Blueprint.varchar(36).null(),
    name  : Blueprint.varchar(255).notNull()
    .index()
    .compositeIndex([
        "status", "available_at", "priority", "id"
    ]),
   
    status : Blueprint
    .enum(...Object.values(STATUS))
    .notNull()
    .default(STATUS.pending)
    .index(),

    priority     : Blueprint.int().default(0),
    payload      : Blueprint.mediumtext().null(),
    result       : Blueprint.text().null(),
    error        : Blueprint.text().null(),
    metadata     : Blueprint.text().null(),

    attempts     : Blueprint.int().default(0),
    max_attempts : Blueprint.int().default(3),
    delay_ms     : Blueprint.int().default(0),

    locked_by    : Blueprint.text().null(),
    locked_at    : Blueprint.datetime().null(),

    available_at : Blueprint.datetime().notNull(),
    completed_at : Blueprint.datetime().null(),
    created_at   : Blueprint.datetime().null(),
    updated_at   : Blueprint.datetime().null()
};

export class Worker extends Model<T.Schema<typeof schema>> {

    private HOSTNAME          = String(process.env?.hostname ?? 'unknown');
    private INSPECT_EXEC      = false;
    private STOPPING          = false;
    private IS_FLUSHING       = false;
    private ACTIVE_JOBS       = 0;

    private MAX_IDLE_RETRIES  = 3;
    private BATCH_SIZE        = 1000;
    private MAX_WAIT_MS       = 50;

    private POLL = {
        interval : null,
        timeout : 1000 * 60
    } as {
        interval : NodeJS.Timeout | null,
        timeout : number
    }

    private BUFFER = {
        jobs : [],
        timeout : null
    } as { 
        jobs: BufferedJob[]; 
        timeout: NodeJS.Timeout | null 
    };

    private WORKER_STATE = new Map<string, {
        handler     : Handler;
        idle        : number;
        sleeping    : boolean;
        running     : number;
        opts        : Required<QueueProcessOptions>
    }>();

    private EVENT_SUBSCRIBERS = new Map<
        string,
        Set<string>
    >();

    protected boot(): void {
        this.useUUID();
        this.useTimestamp();
        this.useSchema(schema);
        this.useTable(this.$state.get("TABLE_JOB"));
    }

    public async initialize (opts: { 
        inspect          ?: boolean;
        flush            ?: boolean;
        hostname         ?: string;
        maxIdleRetries   ?: number;
        poll           ?: {
            enabled ?: boolean;
            timeout ?: number;
        };
    } = {}) {

        const driver = DB.driver();

        if(driver === 'mongodb') {
            throw new Error('Queue is not supported for MongoDB. Use a different driver or disable queue features.');
        }

        await this.sync({ force : true, index: true }).catch(() => null);

        await this._initializeWorkerJobs();

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

        if (opts.poll?.enabled) {
            this.POLL.timeout = opts.poll?.timeout ?? this.POLL.timeout;

            this.POLL.interval = setInterval(() => {
                this._pollWorkerJobs();
            }, this.POLL.timeout);
        }

        return this;
    }

    public async shutdown() {

        while (this.ACTIVE_JOBS > 0) {
            if(this.INSPECT_EXEC) {
               console.log(`\x1b[34mQueue:\x1b[0m Currently processing ${this.ACTIVE_JOBS} job(s)`)
            }
                
            await this._sleep(200);
        }

        await this._sleep(2000);

        if (this.POLL.interval) {
            clearInterval(this.POLL.timeout);
            this.POLL.interval = null;
        }

        this.STOPPING = true;

        if(this.INSPECT_EXEC) {
            console.log("\x1b[34mQueue:\x1b[0m \x1b[31mJob processing stopped\x1b[0m")
        }
    }

    public async flush() {
        const jobs = await new Worker().count('id');
        
        await this.truncate({ force: true })

        if(this.INSPECT_EXEC) {
          console.log(`\x1b[34mQueue:\x1b[0m \x1b[31mFlush all jobs (${jobs} jobs)\x1b[0m`);
        }

        return;
    }

    public async getJobOverallStats(name?: string) {

        const where = (q: Worker) => {
            if(name)  q.where('name','LIKE',`%${DB.escape(name!)}%`)
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
        .when(name, (q) => q.where('name', 'LIKE' , `%${DB.escape(name!)}%`))
        .groupBy('name', 'status')
        .orderBy('name')
        .findMany()

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

    public async getJobs(name?: string) {

        const jobs = await new Worker()
        .when(name != null, (q) => q.where('name','LIKE',`%${DB.escape(name!)}%`))
        .findMany();
      
        return jobs;
    }

    public async getNames() {
        return await new Worker().select('name').toArray('name');
    }

    public async add(
        name: string, 
        payload: any, 
        opts: QueueAddOptions = {}
    ) {
        return new Promise<void>((resolve, reject) => {
        
            const jobData = {
                name,
                payload: payload == null ? null : this._safeJsonStringify(payload),
                status: 'pending',
                priority: opts.priority ?? 0,
                attempts: 0,
                max_attempts: opts.maxAttempts ?? 3,
                metadata: opts.metadata ? this._safeJsonStringify(opts.metadata) : null,
                delay_ms: opts.delayMs ?? 0,
                available_at: opts.delayMs ? new Date(Date.now() + opts.delayMs) : new Date(),
                created_at: new Date(),
                updated_at : new Date()
            } as T.Result<Worker>;

            this.BUFFER.jobs.push({ jobData, resolve, reject });

            if (this.BUFFER.jobs.length >= this.BATCH_SIZE) {
                this._flushBuffer();
            } else if (!this.BUFFER.timeout) {
                this.BUFFER.timeout = setTimeout(() => this._flushBuffer(), this.MAX_WAIT_MS);
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

        const dispatch = async () => {

            if (this.STOPPING) return;

            const state = this.WORKER_STATE.get(name);

            if (!state) return;

            if (state.running >= state.opts.concurrency) {
                const jitter = Math.floor(Math.random() * 2000) + 500
                const delayMs = (state.opts.interval! ?? 0) + jitter
                state.running--
                setTimeout(dispatch, delayMs);
                return;
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

                const jitter = Math.floor(Math.random() * 4000) + 1000
                const delayMs = (opts.interval! ?? 0) + jitter;

                setTimeout(dispatch, delayMs);
                return;
            }

            state.idle = 0;
            
            await Promise.all(
                jobs.map(job => this._runJob(name, job, state))
            );
           
            setImmediate(dispatch);

            return;
        }

        return dispatch();
    }

    public async publish(
        event: string,
        payload: any,
        opts: QueueAddOptions = {}
    ): Promise<void> {

        const subscribers = this.EVENT_SUBSCRIBERS.get(event);

        if (!subscribers || subscribers.size === 0) {
            return;
        }

        await Promise.all(
            [...subscribers].map(name =>
                this.add(name, payload, opts)
            )
        );
    }

    public async subscribe(
        event: string,
        name: string,
        handler: Handler,
        opts: QueueProcessOptions = {
            interval: 1_000,
            concurrency: 1
        }
    ): Promise<void> {

        const jobName = `${event}.${name}`;

        if (!this.EVENT_SUBSCRIBERS.has(event)) {
            this.EVENT_SUBSCRIBERS.set(
                event,
                new Set()
            );
        }

        this.EVENT_SUBSCRIBERS
            .get(event)!
            .add(jobName);

        await this.process(
            jobName,
            handler,
            opts
        );
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

            if(job.__job.delay_ms) {
                await this._sleep(job.__job.delay_ms);
            }

            const result = await handler({
                id      : job.id,
                name    : job.name,
                status  : job.status,
                payload : job.payload
            });

            await new Worker()
            .where('id', job.id)
            .update({
                status: 'completed',
                result: this._safeJsonStringify(result),
                completed_at: this.$utils.timestamp(),
                attempts : 0
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
                error : this._safeJsonStringify({
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
                        result: this._safeJsonStringify(result),
                        completed_at: this.$utils.timestamp(),
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
                            error: this._safeJsonStringify({
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
            state.running--
            this.ACTIVE_JOBS--
        }
    }

    private async _dequeueMany(name: string, limit: number) {

        if (this.STOPPING) return [];
    
        const findJobs = await new Worker()
        .select('id')
        .where('name', name)
        .whereQuery(query => {
            return query
            .whereIn('status',['pending'])
            .where('created_at', '<=', this.$utils.timestamp())
            .orWhereQuery((q) => {
                return q
                .where('status', '=', 'active')
                .where('locked_at', '<', this.$utils.timestamp(new Date(Date.now() - 60 * 1000)))
            })
        })
        .latest('priority')
        .oldest('id')
        .limit(limit)
        .findMany()

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
            .findMany()

            if (!jobs.length) {
                return [];
            }

            await new Worker()
            .whereIn('id',jobs.map(v => v.id))
            .updateMany({
                status : 'active',
                locked_at: this.$utils.timestamp(),
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
                payload : this._safeJsonParse(job.payload),
                __job   : job
            }))
        })
    }

    private async _flushBuffer() {

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
            .select('id','name')
            .insertMany(jobsToInsert)
            .save() as T.InsertManyResult<Worker>

            if (this.INSPECT_EXEC) {
               
                const names = [...new Set(insertedJobds.map(job => job.name))];

                for(const name of names) {

                    const ids = insertedJobds.filter(v => v.name === name).map(v => v.id);

                    const preview = [
                        ...ids.slice(0, 3),
                        ...(ids.length > 3 ? ['...', ...ids.slice(-2)] : []),
                    ].join(', ');

                    if(ids.length === 1) {
                        
                        console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.receive}\x1b[0m job \x1b[38;5;208m${ids}\x1b[0m`);
                    } else {
                        console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[32m${QUEUE_STATUS.receive}\x1b[0m jobs [\x1b[38;5;208m${preview}\x1b[0m] total=(\x1b[38;5;208m${ids.length}\x1b[0m)`);
                    }

                }
            }
    
            for (let i = 0; i < currentBatch.length; i++) {
                currentBatch[i].resolve(undefined);
            }

            const uniqueNames = [...new Set(currentBatch.map(b => b.jobData.name))];

            for(const name of uniqueNames) {
                this._wakeWorker(name);
            }

        } catch (error) {

            currentBatch.forEach(b => b.reject(error));

        } finally {
            if (this.BUFFER.jobs.length) {
                this._flushBuffer();
            }
        }
    }

    private async _wakeWorker(name: string) {

        const state = this.WORKER_STATE.get(name);
        if (!state || !state.sleeping || !state.handler) return;

        const isSleeping = state.sleeping;

        state.sleeping = false;

        state.idle = 0;

        if (this.INSPECT_EXEC) {
            console.log(`\x1b[34mQueue:\x1b[0m \x1b[35m'${name}'\x1b[0m \x1b[36m${QUEUE_STATUS.wokeUp}\x1b[0m`);
        }

        if(isSleeping) {
            await this.process(name, state.handler, state.opts);
        }
        
        return;
    }

    private async _pollWorkerJobs () {

        const jobs = await this._getPendingOrFailedJobs();

        for(const job of jobs) {
            this._wakeWorker(job)
        }

        return;
    }

    private async _initializeWorkerJobs () {

        const jobs = await this._getPendingOrFailedJobs();

        await Promise.all(
            jobs.map(job => this._wakeWorker(job))
        );

        return;
    }

    private async _getPendingOrFailedJobs () {

        const jobsToProcess = await new Worker()
        .select('id')
        .whereIn('status',['pending','failed'])
        .where('available_at', '<=', this.$utils.timestamp())
        .findMany();

        await new Worker()
        .updateMany({
            status : 'pending',
            attempts : 0
        })
        .whereIn('id',jobsToProcess.map(f => f.id))
        .void()
        .save();

        const jobs = await new Worker()
        .select('name')
        .where('status','pending')
        .where('available_at', '<=', this.$utils.timestamp())
        .groupBy('name')
        .toArray('name');

        if (this.INSPECT_EXEC) {
            console.log(`\x1b[34mQueue:\x1b[0m \x1b[32mPoll checked\x1b[0m (${jobs.length} jobs)`);
        };

        return jobs as string[];
    }

    private _safeJsonParse(payload:any){
        try {
            return JSON.parse(payload);
        } catch (err) {
            return payload;
        }
    }

    private _safeJsonStringify(payload: any) {

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

    private async _sleep (ms: number){
        return  await new Promise(r => setTimeout(r,ms));
    }
}