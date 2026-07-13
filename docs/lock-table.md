# Lock Table

Within a lock table, you can utilize the following:

This approach is not recommended in clustered or load-balance environments,
because locks are session-bound and requests may be routed to different database connections.

READ:
- Other sessions can read.
- Other sessions must wait before writing.
- SELECT: allowed
- INSERT: waits
- UPDATE: waits
- DELETE: waits

WRITE:
- Other sessions must wait before reading or writing.
- SELECT: waits
- INSERT: waits
- UPDATE: waits
- DELETE: waits

The lock is released automatically after the callback completes.

```js
import { Model, Blueprint }  from 'tspace-mysql'

class User extends Model {
  protected boot() {
    this.useSchema({
      id     : Blueprint.int().notNull().primary().autoIncrement(),
      email   : Blueprint.varchar(20).notNull()
    });
  }
}

async function requestA() {
  
  try {
   
    console.log("A: locking table...");

   // READ | WRITE
  await User.lockTable('WRITE', async (query) => {
    console.log("A: table LOCKED");

    // Simulate a long-running write transaction.
    // WRITE operations from other sessions will wait
    // until the table lock is released.
    //
    // READ behavior depends on the selected lock mode:
    // - READ  lock: other readers are allowed
    // - WRITE lock: readers/writers may be blocked
    await new Promise((r) => setTimeout(r, 1000 * 10));

    // IMPORTANT:
    // While the table is locked, all database operations
    // must use the provided `query` instance.
    //
    // This guarantees the operation runs on the same
    // database session/connection that owns the lock.
    //
    // ❌ May fail because it can use a different connection:
    // await new User().insert({...}).save();
    //
    // ✅ Uses the lock owner session:
    await query.insert({...}).save();

    // In READ mode this write operation will throw,
    // because writes are not permitted under a READ lock.
    // In WRITE mode it executes successfully.

    console.log("A: unlocking table...");
  });
  
    console.log("A: done");

  } catch (err:any) {

    console.error('❌ SHOULD NOT FAIL:', err.message);
  }
}

async function requestB(n: number = 1) {
    console.log(`B(${n}): waiting 1s before query...`);
    await new Promise((r) => setTimeout(r, 1000));

    console.log(`B(${n}): trying SELECT...`);

    const start = Date.now();

    try {

      const users = await new User().select('id').get();
      console.log(`B(${n}): result`, users.length);

      console.log(`B(${n}): finished in`, Date.now() - start, "ms");
    } catch (err:any) {
      console.error(`B(${n}): ERROR`, err.message);
    }  
}

async function requestC(n: number = 1) {
    console.log(`C(${n}): waiting 1s before query...`);
    await new Promise((r) => setTimeout(r, 1000));

    console.log(`C(${n}): trying Insert...Select`);

    const start = Date.now();

    try {

      await new User().faker(1);

      const users = await new User().select('id').get();
      console.log(`C(${n}): result`, users.length);

      console.log(`C(${n}): finished in`, Date.now() - start, "ms");
    } catch (err:any) {
      console.error(`C(${n}): ERROR`, err.message);
    }
}

(async () => {
    
  // Test scenario:
  //
  // 1. Request  A acquires a table lock.
  // 2. Requests B perform concurrent reads.
  // 3. Request  C performs a concurrent write.
  // 4. Observe whether operations are blocked, queued, or rejected
  //    according to the selected lock mode.
  await Promise.all([
    requestA(), 
    requestB(1),
    requestB(2),
    requestC(3)
  ])
  .then(r => process.exit(1))
    
})()

```

<div class="page-nav-cards">
  <a href="#/race-condition" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Race Condition </div>
  </a>

  <a href="#/connection" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Connection </div>
  </a>
</div>