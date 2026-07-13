import { expect } from 'chai'
import { describe, it, before, after } from 'mocha'
import { Queue, Job } from '../src/lib'
describe('Queue Tests', function () {
  
  before(async function () {
    this.timeout(30000)
    // Initialize Queue with flush to clean up previous test data
    await Queue.start({ 
      inspect: false, 
      flush: true 
    })
  })

  after(async function () {
    this.timeout(10000)
    await Queue.end()
  })

  /* ##################################################### */
  describe('Queue Initialization', function () {
    
    it('should initialize Queue successfully', async function () {
      // Queue is already initialized in before hook
      const names = await Queue.getNames()

      expect(Array.isArray(names)).to.be.true
    })

    it('should throw error when Queue is not initialized', async function () {
      // End the queue
      await Queue.end()
      
      try {
        await Queue.add('test', { data: 'test' })
        expect.fail('Should have thrown an error')
      } catch (err: any) {
        expect(err.message).to.include('Queue is not initialized')
      }
      
      // Re-initialize for other tests
      await Queue.start({ 
        inspect: false, 
        flush: true 
      })
    })

    it('should flush all jobs when flush option is true', async function () {
      // Add some jobs first
      await Queue.add('flush-test', { data: 'test1' })
      await Queue.add('flush-test', { data: 'test2' })
      
      const stats = await Queue.getJobOverallStats()
      expect(stats.pending).to.be.greaterThan(0)
      
      // Flush the queue
      await Queue.flush()
      
      const statsAfterFlush = await Queue.getJobOverallStats()
      expect(statsAfterFlush.total).to.be.equal(0)
    })
  })

  /* ##################################################### */
  describe('Queue.add - Adding Jobs', function () {
    
    it('should add a job with minimal options', async function () {
      await Queue.add('minimal-job', { 
        email: 'test@gmail.com',
        name: 'Test User'
      })
      
      const stats = await Queue.getJobOverallStats('minimal-job')
      expect(stats.pending).to.be.equal(1)
    })

    it('should add a job with maxAttempts option', async function () {
      await Queue.add('retry-job', { 
        email: 'retry@gmail.com'
      }, {
        maxAttempts: 5
      })
      
      const stats = await Queue.getJobOverallStats('retry-job')
      expect(stats.pending).to.be.equal(1)
    })

    it('should add a job with metadata', async function () {
      await Queue.add('metadata-job', { 
        email: 'meta@gmail.com'
      }, {
        metadata: {
          userId: 123,
          category: 'notification'
        }
      })
      
      const stats = await Queue.getJobOverallStats('metadata-job')
      expect(stats.pending).to.be.equal(1)
    })

    it('should add a job with priority', async function () {
      await Queue.add('priority-job', { 
        email: 'priority@gmail.com'
      }, {
        priority: 999
      })
      
      const stats = await Queue.getJobOverallStats('priority-job')
      expect(stats.pending).to.be.equal(1)
    })

    it('should add a job with delayMs', async function () {
      this.timeout(10000)
      
      await Queue.add('delayed-job', { 
        email: 'delayed@gmail.com'
      }, {
        delayMs: 3000
      })
      
      const stats = await Queue.getJobOverallStats('delayed-job')
      expect(stats.pending).to.be.equal(1)
      
      // Wait for delay to pass
      await new Promise(r => setTimeout(r, 4000))
    })

    it('should add multiple jobs with different priorities', async function () {
      const priorities = [100, 50, 200, 10, 500]
      
      for (const p of priorities) {
        await Queue.add('multi-priority', { priority: p }, { priority: p })
      }
      
      const stats = await Queue.getJobOverallStats('multi-priority')
      expect(stats.pending).to.be.equal(priorities.length)
    })
  })

  /* ##################################################### */
  describe('Queue.on / Queue.process - Processing Jobs', function () {
    
    it('should process a job successfully', async function () {
      this.timeout(15000)
      
      const jobName = 'process-success'
      let processedJob: Job | null = null
      
      await Queue.add(jobName, { email: 'success@gmail.com' })
      
      Queue.on(jobName, async (job: Job) => {
        processedJob = job
        return 'processed!'
      }, { concurrency: 1 })
      
      // Wait for processing
      await new Promise(r => setTimeout(r, 3000))
      
      expect(processedJob).to.not.be.null
  
      expect(processedJob!?.payload.email).to.be.equal('success@gmail.com')
    })

    it('should process jobs with specified concurrency', async function () {
      this.timeout(30000)
      
      const jobName = 'concurrent-job'
      const processedJobs: any[] = []
      const maxConcurrent = 5
      let currentConcurrent = 0
      let maxObservedConcurrent = 0
      
      // Add jobs
      for (let i = 0; i < 10; i++) {
        await Queue.add(jobName, { index: i })
      }
      
      Queue.on(jobName, async (job: Job) => {
        currentConcurrent++
        maxObservedConcurrent = Math.max(maxObservedConcurrent, currentConcurrent)
        processedJobs.push(job)
        await new Promise(r => setTimeout(r, 100))
        currentConcurrent--
        return 'done'
      }, { concurrency: maxConcurrent })
      
      // Wait for processing
      await new Promise(r => setTimeout(r, 5000))
      
      expect(processedJobs.length).to.be.equal(10)
      expect(maxObservedConcurrent).to.be.lessThanOrEqual(maxConcurrent)
    })

    it('should handle job failure and retry', async function () {
      this.timeout(30000)
      
      const jobName = 'retry-test'
      let attemptCount = 0
      
      await Queue.add(jobName, { test: 'retry' }, {
        maxAttempts: 3
      })
      
      Queue.on(jobName, async (job) => {
        attemptCount++
        if (attemptCount < 3) {
          throw new Error(`Intentional failure ${attemptCount}`)
        }
        return 'finally done'
      }, { concurrency: 1 })
      
      // Wait for retries
      await new Promise(r => setTimeout(r, 5000))
      
      expect(attemptCount).to.be.equal(3)
    })

    it('should mark job as failed after maxAttempts exceeded', async function () {
      this.timeout(30000)
      
      const jobName = 'fail-max'
      let attemptCount = 0
      
      await Queue.add(jobName, { test: 'fail' }, {
        maxAttempts: 2
      })

      const tryErrorHandler = async (job: Job) => {
        attemptCount++
        throw new Error('Always fail')
      }
      
      Queue.on(jobName, async (job: Job) => {
        await tryErrorHandler(job)
      }, { concurrency: 1 })
      
      // Wait for all retries
      await new Promise(r => setTimeout(r, 5000));
      
      const stats = await Queue.getJobOverallStats(jobName)
      expect(stats.failed).to.be.equal(1)
      // The job should have been attempted 2 times (maxAttempts) + 1
      expect(attemptCount).to.be.equal(3)
    })
  })

  /* ##################################################### */
  describe('Queue Statistics', function () {
    
    it('should get overall job statistics', async function () {
      const stats = await Queue.getJobOverallStats()
      
      expect(stats).to.have.property('total')
      expect(stats).to.have.property('completed')
      expect(stats).to.have.property('active')
      expect(stats).to.have.property('pending')
      expect(stats).to.have.property('failed')
      
      expect(typeof stats.total).to.be.equal('number')
      expect(stats.total).to.be.greaterThanOrEqual(0)
    })

    it('should get job statistics by name', async function () {
      const stats = await Queue.getJobStats()
      
      expect(Array.isArray(stats)).to.be.true
      
      if (stats.length > 0) {
        const firstStat = stats[0]
        expect(firstStat).to.have.property('name')
        expect(firstStat).to.have.property('completed')
        expect(firstStat).to.have.property('active')
        expect(firstStat).to.have.property('pending')
        expect(firstStat).to.have.property('failed')
      }
    })

    it('should get filtered statistics by job name', async function () {
      const jobName = 'stats-filter-test'
      
      await Queue.add(jobName, { test: 'stats' })
      
      const allStats = await Queue.getJobOverallStats()
      const filteredStats = await Queue.getJobOverallStats(jobName)
      
      expect(filteredStats.total).to.be.lessThanOrEqual(allStats.total)
    })

    it('should get all unique queue names', async function () {
      const names = await Queue.getNames()
      
      expect(Array.isArray(names)).to.be.true
      
      // Should include previously added job names
      expect(names.length).to.be.greaterThan(0)
    })
  })

  // /* ##################################################### */
  describe('Queue Worker Access', function () {
    
    it('should access raw Worker instance safely', async function () {
      const worker = await Queue.worker(async (w) => {
        return w
      })
      
      expect(worker).to.not.be.null
      expect(typeof worker.flush).to.be.equal('function')
      expect(typeof worker.getJobOverallStats).to.be.equal('function')
    })
  })

  /* ##################################################### */
  describe('Queue Edge Cases', function () {
    
    it('should handle null payload', async function () {
      await Queue.add('null-payload', null)
      
      const stats = await Queue.getJobOverallStats('null-payload')
      expect(stats.pending).to.be.equal(1)
    })

    it('should handle complex payload objects', async function () {
      const complexPayload = {
        nested: {
          data: [1, 2, 3],
          obj: { key: 'value' }
        },
        date: new Date().toISOString(),
        bigint: BigInt(123456789)
      }

      const jobName = 'complex-payload'
      
      await Queue.add(jobName, complexPayload)
      
      const stats = await Queue.getJobOverallStats(jobName)
      expect(stats.pending).to.be.equal(1)
    })

    it('should handle special characters in job name', async function () {
      const specialName = 'job-with-special-chars-@#$%'
      
      await Queue.add(specialName, { test: 'special' })
      
      const stats = await Queue.getJobOverallStats(specialName)
      expect(stats.pending).to.be.equal(1)
    })

    it('should process jobs in priority order', async function () {
      this.timeout(20000)
      
      const jobName = 'priority-order'
      const processedOrder: number[] = []
      
      await Queue.flush();

      // Add jobs with different priorities (higher number = higher priority)
      Queue.add(jobName, { priority: 1 }, { priority: 1 })
      Queue.add(jobName, { priority: 100 }, { priority: 100 })
      Queue.add(jobName, { priority: 50 }, { priority: 50 })
      Queue.add(jobName, { priority: 10 }, { priority: 10 })
      
      Queue.on(jobName, async (job) => {
        processedOrder.push(job.payload.priority)
        return 'done'
      }, { concurrency: 1 })
      
      await new Promise(r => setTimeout(r, 3000))
      
      // priorities (higher number = higher priority)
      expect(processedOrder[0]).to.be.equal(100)
      expect(processedOrder[1]).to.be.equal(50)
      expect(processedOrder[2]).to.be.equal(10)
      expect(processedOrder[3]).to.be.equal(1)
    })

    it('should handle delayed jobs correctly', async function () {
      this.timeout(20000)
      
      const jobName = 'delayed-process'
      let processedTime: number | null = null
      let addedTime: number | null = null
      
      addedTime = Date.now()
      
      await Queue.add(jobName, { test: 'delay' }, {
        delayMs: 2000
      })
      
      Queue.on(jobName, async (job) => {
        processedTime = Date.now()
        return 'delayed done'
      }, { concurrency: 1 })
      
      // Wait for delay + processing
      await new Promise(r => setTimeout(r, 4000))

      expect(processedTime).to.not.be.null
      expect(processedTime! - addedTime!).to.be.greaterThanOrEqual(2000)
    })
  })

  /* ##################################################### */
  describe('Queue Shutdown', function () {
    
    it('should shutdown queue gracefully', async function () {
      this.timeout(15000)
      
      const jobName = 'shutdown-test'
      let processedCount = 0
      
      // Add jobs
      for (let i = 0; i < 5; i++) {
        await Queue.add(jobName, { index: i })
      }
      
      Queue.on(jobName, async (job) => {
        processedCount++
        await new Promise(r => setTimeout(r, 200))
        return 'done'
      }, { concurrency: 1 })
      
      // Wait a bit for some processing
      await new Promise(r => setTimeout(r, 500))
      
      // Shutdown should wait for active jobs
      await Queue.end()
      
      // Verify shutdown completed
      expect(processedCount).to.be.greaterThan(0)
      
      // Re-initialize for any subsequent tests
      await Queue.start({ flush: false })
    })
  })

  /* ##################################################### */
})