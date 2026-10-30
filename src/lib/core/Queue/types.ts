import { Worker }  from "./worker";
import type { T }  from "..";
import type { 
    Job, 
    QueueContract 
}  from ".";
import { TDriver } from "../../types";

export type JobInternal = Job & {
    __job : T.Result<Worker>;
}

export type Handler = (job: Job) => any | Promise<any>;

export type State = {
    handler     : Handler;
    idle        : number;
    sleeping    : boolean;
    running     : number;
    opts        : QueueProcessOptions
}

export type QueueConnection = {
    driver   ?: TDriver; 
    host     : string;
    port     : number;
    database : string;
    username : string;
    password : string;
}

type AssertDriver<T extends TDriver> = T;

type ConnectionConfig =
    | {
        driver: AssertDriver<'sqlite'>;
        database: string;
    }
    | {
        driver: Exclude<TDriver, AssertDriver<'sqlite'>>;
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };

export type QueueInit = { 
    inspect          ?: boolean; 
    flush            ?: boolean; 
    hostname         ?: string;
    maxIdleRetries   ?: number;
    poll             ?: {
        enabled  ?: boolean;
        interval ?: number;
    };
    cleanup          ?: {
        enabled  ?: boolean;
        interval ?: number;
        statuses ?: JobStatus[];
    };
    connection       ?: ConnectionConfig
}

export type QueueAddOptions = {
  delayMs     ?: number  // default 0 
  priority    ?: number // default 0
  metadata    ?: Record<string, any> // default null
  maxAttempts ?: number // default 3

  uniqueKey   ?: string
}

export type QueueProcessOptions = { 
    interval    ?: number; // default 1000
    concurrency ?: 
        | 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8 | 9 | 10
        | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55
        | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 100; // default 1

    onSuccess   ?: (job: Job) => Promise<void> | void;
    onError     ?: (error : unknown, job: Job) => Promise<void> | void;
}

export type BufferedJob = {
  jobData : T.Result<Worker>;
  resolve : (value: any) => void;
  reject  : (reason?: any) => void;
}

export type JobStatus = 'pending' | 'active' |'completed' | 'failed'

type QueueEvents = QueueContract extends {
    events: infer E;
}
    ? E
    : never;

type QueueJobs = QueueContract extends {
    jobs: infer J;
}
    ? J
    : never;

export type EventName =
    QueueEvents extends Record<string, readonly string[]>
        ? keyof QueueEvents & string
        : string;


export type EventJobName<E extends EventName> =
    QueueEvents extends Record<string, readonly string[]>
        ? E extends keyof QueueEvents
            ? QueueEvents[E][number] extends never 
                ? string 
                : QueueEvents[E][number]
            : string
        : string;


export type JobName =
    QueueJobs extends readonly string[]
        ? QueueJobs[number] extends never 
            ? string
            : QueueJobs[number]
        : string;