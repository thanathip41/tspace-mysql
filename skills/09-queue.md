# tspace-mysql - Queue System Guide

## Overview

tspace-mysql includes a built-in job queue system designed for background and async processing. The queue runs on top of the database using a Worker model, making it easy to use without additional infrastructure like Redis.

## Queue Basics

### Creating and Initializing a Queue

```typescript
import { Queue, DB } from 'tspace-mysql'

// The Queue uses an internal Worker model
// First, ensure database is connected
await Queue.start({ 
  inspect  : true,    // @default false, enable queue workflow inspection
  flush    : false,   // @default false, true -> remove all jobs
  hostname : 'pod1',  // @default null, worker hostname
  maxIdleRetries : 8, // @default 5, maximum retries when no jobs are available
  poll : {            
    enabled : true,   // @default false, enable periodic job checking
    timeout : 10_000  // @default 60_000, polling interval
  };
}); 

// Queue operations use the Worker model internally
// The table is auto-created when needed
```

### Queue Options

```typescript
// Options for adding jobs
type QueueAddOptions = {
  delayMs     ?: number   // Delay in milliseconds (default: 0)
  priority    ?: number   // Higher = higher priority (default: 0)
  metadata    ?: Record<string, any>
  maxAttempts ?: number   // Default: 3
}

// Options for processing
type QueueProcessOptions = { 
  interval    ?: number   // Polling interval in ms (default: 1000)
  concurrency ?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 20 | 25 | 30
}
```

## Adding Jobs

### Basic Job Adding

```typescript
import { DB } from 'tspace-mysql'

// Jobs are added using the Worker model internally
// The queue name is the 'name' field in the job

async function addJob(name: string, payload: any) {
  // Using internal queue mechanism
  // Jobs are buffered and flushed in batches for efficiency
}
```

### Job with Options

```typescript
// Add job with delay (will be available after delayMs)
await queue.add('send-email', {
  to: 'user@example.com',
  subject: 'Welcome!'
}, {
  priority: 10,        // Higher priority
  delayMs: 5000,       // Available after 5 seconds
  maxAttempts: 5       // Retry up to 5 times
})
```

### Job with Metadata

```typescript
await queue.add('process-order', {
  orderId: 123
}, {
  priority: 5,
  metadata: {
    userId: 456,
    source: 'web'
  }
})
```

## Processing Jobs

### Basic Job Processor

```typescript
import { DB } from 'tspace-mysql'
import { Worker } from './Worker' // Internal model

// Define job handler
async function processEmailJob(job: Job) {
  const { to, subject, body } = job.payload
  
  // Send email logic
  await sendEmail(to, subject, body)
  
  console.log(`Email sent to ${to}`)
}

// Start processing jobs for a specific queue name
await queue.process('send-email', processEmailJob, {
  interval: 1000,      // Check every 1 second
  concurrency: 5       // Process 5 jobs concurrently
})
```

### Multiple Job Types

```typescript
// Process different job types
await queue.process('send-email', async (job) => {
  await sendEmail(job.payload.to, job.payload.subject, job.payload.body)
}, { interval: 1000, concurrency: 5 })

await queue.process('send-sms', async (job) => {
  await sendSMS(job.payload.phone, job.payload.message)
}, { interval: 1000, concurrency: 3 })

await queue.process('push-notification', async (job) => {
  await sendPush(job.payload.userId, job.payload.title, job.payload.body)
}, { interval: 1000, concurrency: 10 })
```

### Job Object Structure

```typescript
type Job<T = any> = {
  id        : number
  name      : string        // Queue/job name
  status    : 'pending' | 'active' | 'completed' | 'failed'
  payload   : T             // Job data
  attempts  : number        // Current attempt count
  max_attempts : number     // Maximum retry attempts
  priority  : number        // Job priority
  metadata  : Record<string, any> | null
  result    : string | null // JSON stringified result
  error     : string | null // JSON stringified error
  available_at : Date       // When job becomes available
  locked_by : string | null // Worker hostname
  locked_at : Date | null   // When locked
  created_at : Date
  updated_at : Date
  completed_at : Date | null
}
```

## Job Lifecycle

### Job States

```
pending → active → completed
              ↓
           failed (with retry if attempts < max_attempts)
```

### Automatic Retry

The queue automatically retries failed jobs:

```typescript
// When a job fails:
// 1. Status set to 'failed'
// 2. Error stored in error field
// 3. If attempts < max_attempts, job is retried
// 4. Retry continues until max_attempts reached
```

### Job Processing Flow

```typescript
await queue.process('my-job', async (job) => {
  // Job starts as 'pending'
  // Worker picks up job, status becomes 'active'
  
  try {
    // Process the job
    await doWork(job.payload)
    
    // On success: status = 'completed', result stored
    return { success: true }
  } catch (error) {
    // On failure: status = 'failed', error stored
    // Automatic retry if attempts < max_attempts
    throw error
  }
}, { interval: 1000, concurrency: 5 })
```

## Queue Management

### Getting Job Stats

```typescript
// Get overall stats for all jobs
const stats = await queue.getJobOverallStats()
// Returns: { total, completed, active, pending, failed }

// Get stats for specific job type
const emailStats = await queue.getJobOverallStats('send-email')

// Get detailed stats by job name
const detailedStats = await queue.getJobStats()
// Returns array of: { name, completed, active, pending, failed }[]
```

### Getting Jobs

```typescript
// Get all jobs
const allJobs = await queue.getJobs()

// Get jobs by name pattern
const emailJobs = await queue.getJobs('send-email')
```

### Get Job Names

```typescript
// Get all unique job names
const names = await queue.getNames()
// Returns: ['send-email', 'send-sms', ...]
```

### Flush Queue

```typescript
// Remove all jobs from queue
await queue.flush()
```

### Shutdown

```typescript
// Graceful shutdown - waits for active jobs to complete
await queue.shutdown()
```

## Advanced Features

### Delayed Jobs

```typescript
// Job available after 5 minutes
await queue.add('send-reminder', {
  userId: 123
}, {
  delayMs: 5 * 60 * 1000
})
```

### Priority Jobs

```typescript
// Higher priority processed first
await queue.add('send-alert', { message: 'Urgent!' }, {
  priority: 100
})

await queue.add('send-newsletter', { userId: 123 }, {
  priority: 1
})
```

### Job Metadata

```typescript
// Store additional info with job
await queue.add('process-payment', {
  orderId: 456,
  amount: 99.99
}, {
  metadata: {
    userId: 123,
    source: 'mobile-app',
    campaign: 'summer-sale'
  }
})
```

### Inspect Mode

```typescript
// Enable detailed logging
await queue.initialize({
  inspect: true    // Log job processing details
})

// Output shows:
// - Queue name and job ID being processed
// - Processing time
// - Completion/failure status
```

### Custom Hostname

```typescript
// For distributed systems, identify workers
await queue.initialize({
  hostname: 'worker-1'
})
```

### Connection Limits

```typescript
// Limit concurrent connections
await queue.initialize({
  limitConnections: 20  // Default: calculated from max_connections / 3
})
```

## Complete Example: Email Queue

```typescript
import { DB } from 'tspace-mysql'

// Email job payload type
interface EmailPayload {
  to: string
  subject: string
  body: string
  html?: string
}

// Initialize database
await DB.initialize()

// Start email processor
await queue.process('send-email', async (job: Job<EmailPayload>) => {
  const { to, subject, body, html } = job.payload
  
  console.log(`Processing email job ${job.id} to ${to}`)
  
  // Send email
  await sendEmail({
    to,
    subject,
    text: body,
    html
  })
  
  console.log(`Email sent to ${to}`)
  
  return { sent: true, to }
}, {
  interval: 1000,
  concurrency: 10
})

// Add jobs
async function queueWelcomeEmail(user: { email: string; name: string }) {
  await queue.add('send-email', {
    to: user.email,
    subject: 'Welcome!',
    body: `Hello ${user.name}, welcome!`
  }, {
    priority: 5
  })
}

async function queuePasswordReset(user: { email: string; token: string }) {
  await queue.add('send-email', {
    to: user.email,
    subject: 'Password Reset',
    body: `Reset link: https://example.com/reset/${user.token}`
  }, {
    priority: 10,  // Higher priority
    maxAttempts: 5
  })
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await queue.shutdown()
  process.exit(0)
})
```

## Database Table Structure

The Worker model uses this schema:

```sql
CREATE TABLE IF NOT EXISTS workers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uuid VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  status ENUM('pending', 'active', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  priority INT DEFAULT 0,
  payload MEDIUMTEXT,
  result TEXT,
  error TEXT,
  metadata TEXT,
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  delay_ms INT DEFAULT 0,
  locked_by TEXT,
  locked_at TIMESTAMP,
  available_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX idx_name_status (name, status),
  INDEX idx_available (status, available_at, priority, id)
)
```

## Job Status Values

| Status | Description |
|--------|-------------|
| `pending` | Job waiting to be processed |
| `active` | Job currently being processed |
| `completed` | Job finished successfully |
| `failed` | Job failed (may retry) |

## Best Practices

1. **Use meaningful job names**: The 'name' field identifies job types
2. **Set appropriate priorities**: Higher numbers = higher priority
3. **Use delayMs for scheduled jobs**: Jobs become available after delay
4. **Set maxAttempts appropriately**: Balance between reliability and resources
5. **Monitor job stats**: Use getJobOverallStats() to track queue health
6. **Use metadata for tracking**: Store userId, source, etc. for debugging
7. **Graceful shutdown**: Always call shutdown() to complete active jobs
8. **Enable inspect mode in development**: Helps debug job processing

## Internal Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  queue.add() → Buffer → Batch Insert                    │
│  queue.process() → Poll → Execute → Update Status       │
├─────────────────────────────────────────────────────────┤
│                    Worker Model                          │
│  - Manages job table                                     │
│  - Handles status transitions                            │
│  - Automatic retry on failure                            │
├─────────────────────────────────────────────────────────┤
│                    Database Layer                        │
│  MySQL / MariaDB / PostgreSQL / SQLite                  │
└─────────────────────────────────────────────────────────┘
```

## Notes

- Jobs are buffered and flushed in batches (default: 1000 jobs, 50ms timeout)
- Failed jobs automatically retry up to max_attempts
- Priority ordering: Higher priority jobs processed first
- Delayed jobs: Only available after available_at timestamp
- Concurrency: Controls how many jobs process simultaneously per worker

## Related Documents

- `00-overview.md` - Library overview
- `07-transactions.md` - Database transactions
- `08-caching.md` - Caching strategies