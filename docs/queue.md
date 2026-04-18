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
import { Queue, Job } from 'tspace-mysql';

const fakeSendEmail = async (job: Job) => {
  if(Math.random() < 0.5) throw new Error(`Failed job ${job.id}`)
  await new Promise<void>((ok) => setTimeout(ok, 2000));
  return `Send email Completed job ${job.id}`;
}

// start the Queue
await Queue.start({ 
  inspect : true, 
  flush : false, // flush = true -> remove all jobs
  hostname: 'pod1'
}); 

const worker = 20;

// register process send email 20
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