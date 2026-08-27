import { Job, QueueContract, T } from "..";
import { Worker } from "./worker";

export type JobInternal = Job & {
    __job : T.Result<Worker>;
}

export type Handler = (job: Job) => any | Promise<any>;

export type State = {
    handler     : Handler;
    idle        : number;
    sleeping    : boolean;
    running     : number;
    opts        : Required<QueueProcessOptions>
}

export type QueueAddOptions = {
  delayMs     ?: number  // default 0 
  priority    ?: number // default 0
  metadata    ?: Record<string, any> // default null
  maxAttempts ?: number // default 3
}

export type QueueProcessOptions = { 
    interval    ?: number; 
    concurrency ?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 20 | 25 | 30;
}

export type BufferedJob = {
  jobData : T.Result<Worker>;
  resolve : (value: any) => void;
  reject  : (reason?: any) => void;
}

export type EventName =
    keyof QueueContract['events'] extends never
        ? string
        : keyof QueueContract['events'] & string;


export type EventJobName<
    E extends EventName
> =
    keyof QueueContract['events'] extends never
        ? string
        : E extends keyof QueueContract['events']
            ? QueueContract['events'][E][number]
            : never;


export type JobName =
    QueueContract['jobs'] extends readonly []
        ? string
        : QueueContract['jobs'][number];