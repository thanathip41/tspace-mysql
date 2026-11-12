# Queue
A lightweight, high-performance job queue built for ORM-based systems, <br>
designed to run on top of database layers with support for concurrency, 
retries, priorities, and job inspection.

- Concurrency Each worker can process multiple jobs at the same time.

- Priority Higher priority jobs are executed first.

- Retry Failed jobs are automatically retried up to maxAttempts.

- Delay Jobs can be scheduled for future execution using delayMs.

- Idle / Wake Workers automatically go idle when no jobs are available, and wake up instantly when new jobs arrive.

```js
import { Queue, Job , DB } from 'tspace-mysql';

// Start the Queue worker
await Queue.start({
  inspect: true, // @default false - Enable queue workflow inspection
  flush: true, // @default false - Remove all existing jobs before starting

  hostname: 'pod1', // @default env.hostname - Worker hostname

  maxIdleRetries: 5, // @default 5 - Maximum retries when no jobs are available

  lockRecoveryMs: 300_000, // @default 300_000 (5 minutes) - Time before recovering jobs with expired locks

  poll: {
    enabled: true, // @default false - Enable periodic job polling
    interval: 60_000, // @default 60_000 - Polling interval in milliseconds
  },

  cleanup: {
    enabled: true, // @default false - Enable automatic job cleanup
    interval: 60_000, // @default 60_000 - Cleanup interval in milliseconds
    statuses: ['completed', 'failed'], // @default ['completed'] - Job statuses to delete
  },

  // By default, Queue uses the same database connection as your application.
  // You can optionally provide a separate connection for Queue.

  // Using a separate connection configuration:
  connection: {
    driver: 'sqlite',
    database: 'app.db',
  },

  // Or reuse an existing database connection:
  // connection: DB.getConnection({
  //   driver: 'sqlite',
  //   database: 'app.db',
  // }),
});

const worker = 20;

// register process send email 20
const fakeSendEmail = async (job: Job) => {
  if(Math.random() < 0.5) throw new Error(`Failed job ${job.id}`)
  await new Promise<void>((ok) => setTimeout(ok, 2000));
  return `Send email Completed job ${job.id}`;
}

for(let i = 1; i <= worker; i++) {

  Queue.process(`send-email-(${i})`, async(job) => {
    return await fakeSendEmail(job)
  } , { concurrency : 10 })

}

// add jobs 10_000 records
for(let j = 1; j <= worker * 500; j++) {

    const i = Math.floor((Math.random() * worker) + 1);

    Queue.add(`send-email-(${i})`, {
        email: `John-${i}@gmail.com`,
        name: `John-${i}`
    }, {
        // Prevent duplicate jobs when triggered by cron jobs.
        // uniqueKey : `uq:${i}`, 
        delayMs : 1000 * Math.random() * 10,
        priority : i % 2 ? 9999 + Math.floor((Math.random() * 9999) + 1) : 0,
        maxAttempts : 3,
        metadata : {
            userId : j,
            name   : `John-${i}`
        }
    })
}

// for view stats Jobs
// await Queue.getJobOverallStats()
// await Queue.getJobStats()

// if you want to end the Queue
// await Queue.end()

```

## Queue Events

Queue also supports an event-based publish/subscribe pattern.

One event can have multiple subscribers.
Use Queue.subscribe() to subscribe a job handler to an event
```js
// user.created
//   │
//   ├── email
//   ├── notify
//   └── analytics

Queue.subscribe(
  'user.created',
  'email',
  async (job) => {
    await new Promise(r => setTimeout(r, 1000));
    console.log('Send e-mail : ' + job.payload.email)
    return  'Done!';
  },
  { concurrency: 2 }
);

Queue.subscribe(
  'user.created',
  'notify',
  async (job) => {
    await new Promise(r => setTimeout(r, 1000));
    console.log('notify : ' + job.payload.email)
    return  'Done!';
  },
  { concurrency: 3 }
);
```

Use Queue.publish() to publish an event.
```js
for (let i = 1; i <= 5; i++) {
  // will send to jobs ['email','notify'];
  Queue.publish(
    'user.created', 
    { id : i , email : `user${i}@gmail.com` },
    {
      priority: i
    }
  );
}

```
## Queue Type-safe Events and Jobs
Queue optionally supports type-safe event and job names through `QueueContract`.

The feature is optional.

If the application does not define a contract, the Queue API can continue to accept normal string names.

Create a `types.d.ts` file in your application:
```js
import { QueueContract } from 'tspace-mysql';

declare module 'tspace-mysql' {
    interface QueueContract {
        events: {
            'user.created': [
                'email',
                'notify',
            ];
        };

        jobs: [
            'resize-video',
            'cleanup',
        ];
    }
}

```