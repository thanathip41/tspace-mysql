import { T } from "..";
import { Worker } from "./worker";
import type { EventJobName, EventName, Handler, JobName, QueueAddOptions, QueueProcessOptions } from "./types";


export type Job<T = any> = {
  id      : number;
  name    : string;
  status  : 'pending' | 'active' |'completed' | 'failed'
  payload : T;
}

export interface QueueContract {
    events: Record<string,string[]>;
    jobs: string[];
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
     * 
     * @param {Object} [opts] - options (inspect, flush)
     * @property {boolean?} opts.inspect queue work flow
     * @property {boolean?} opts.flush  remove all queue
     * @property {number?} opts.maxIdleRetries - Maximum idle time () when no jobs are available
     * @property {boolean} [opts.poll.enabled] - Enable or disable worker job polling.
     * @property {number} [opts.poll.timeout] - Polling interval in milliseconds.
     * @returns {Promise<void>}
     */
    static async start(opts: { 
        inspect          ?: boolean; 
        flush            ?: boolean; 
        hostname         ?: string;
        maxIdleRetries   ?: number;
        poll           ?: {
            enabled ?: boolean;
            timeout ?: number;
        };
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
     * @returns {Promise<any>}
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
     * The 'getJobs' method is used to Get jobs.
     * 
     * @param {string} [name] - Optional queue name filter.
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<T.Result<Worker>[]>}
     */
    static async getJobs(name?: string): Promise<T.Result<Worker>[]> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.getJobs(name);
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
     * @returns {Promise<Work>}
     */
    static async worker(cb: (worker: Worker) => any): Promise<Worker> {
        
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
        name    : JobName, 
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
        name    : JobName, 
        handler : Handler, 
        opts    : QueueProcessOptions = { interval : 1_000, concurrency : 1 }
    ): Promise<void> {
        return await this.process(name, handler, opts);
    }

    /**
     * Add a new job into the queue.
     *
     * @param {string} name - Queue name / job type.
     * @param {any} payload - Job payload data, send to process
     * @param {QueueAddOptions} [opts] - Job options (delay, priority, retry, etc.)
     * @throws {Error} If Queue is not initialized.
     * @returns {Promise<T.Result<Worker>>}
     * 
     * @example
     * ```ts
     * Queue.add("send-email", { email: "test@gmail.com" });
     * Queue.add("send-email", { email: "test2@gmail.com" }, {
     *     metadata    : 'first priority',
     *     priority    : 9999
     *     delayMs     : 100 
     *     maxAttempts : 1
     * });
     * ```
     */
    static async add(
        name    : JobName, 
        payload : any, 
        opts    : QueueAddOptions = {}
    ): Promise<void> {
        
        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.add(name, payload, opts);
    }

    /**
     * Publishes an event to all registered subscribers.
     *
     * Each subscriber receives the event payload as an individual job.
     *
     * @param event - The event name to publish.
     * @param payload - The data associated with the event.
     * @param {QueueAddOptions} [opts] - Job options (delay, priority, retry, etc.)
     * @throws {Error} If the queue worker has not been initialized.
     *
     * @example
     * ```ts
     * Queue.publish('user.created', {
     *   userId: 123,
     *   email: 'user@example.com',
     * });
     * 
     * Queue.publish('user.created', {
     *   userId: 123,
     *   email: 'user@example.com',
     * }, {
     *     metadata    : 'first priority',
     *     priority    : 9999
     *     delayMs     : 100 
     *     maxAttempts : 1
     * });
     * ```
     */
    static async publish<
        E extends EventName
    >(
        event   : E, 
        payload : any,
        opts    : QueueAddOptions = {}
    ): Promise<void> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.publish(event,payload,opts);
    }

    /**
     * Subscribes a handler to an event.
     *
     * The subscriber name is combined with the event name to create
     * a unique job name in the format `{event}.{name}`.
     *
     * @param event - The event name to subscribe to.
     * @param name - The unique name of the subscriber.
     * @param handler - The function executed when the event is received.
     * @param opts - Options controlling job processing behavior.
     *
     * @throws {Error} If the queue worker has not been initialized.
     *
     * @example
     * ```ts
     * await Queue.subscribe(
     *   'user.created',
     *   'email',
     *   async (job) => {
     *     await sendEmail(job.payload);
     *   },
     *   {
     *     concurrency: 5,
     *   }
     * );
     * ```
     *
     * @remarks
     * A subscription to `user.created` with the name `email`
     * creates the job queue `user.created.email`.
     */
    static async subscribe<
        E extends EventName
    >(
        event   : E,
        name    : EventJobName<E>, 
        handler : Handler, 
        opts    : QueueProcessOptions = { interval : 1_000, concurrency : 1 }
    ): Promise<void> {

        if (this.WORKER == null) {
            throw new Error(this.MESSAGE.INIT_ERROR);
        }

        return await this.WORKER.subscribe(event,name,handler,opts);
    }
}

export { Queue }
export default Queue