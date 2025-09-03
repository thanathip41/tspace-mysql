# Database Transactions

Within a database transaction, you can utilize the following:

```js
const trx = await new DB().beginTransaction();

try {
  /**
   *
   * @startTransaction start transaction in scopes function
   */
  await trx.startTransaction();

  const user = await new User()
    .create({
      name: `tspace`,
      email: "tspace@example.com",
    })
    /**
     *
     * bind method for make sure this trx has same transaction in trx
     * @params {Function} trx
     */
    .bind(trx)
    .save();

  const posts = await new Post()
    .createMultiple([
      {
        user_id: user.id,
        title: `tspace-post1`,
      },
      {
        user_id: user.id,
        title: `tspace-post2`,
      },
      {
        user_id: user.id,
        title: `tspace-post3`,
      },
    ])
    .bind(trx) // don't forget this
    .save();

  /**
   *
   * @commit commit transaction to database
   */
  // After your use commit if use same trx for actions this transction will auto commit
  await trx.commit();

  // If you need to start a new transaction again, just use wait trx.startTransaction();

  const postsAfterCommited = await new Post()
    .createMultiple([
      {
        user_id: user.id,
        title: `tspace-post1`,
      },
      {
        user_id: user.id,
        title: `tspace-post2`,
      },
      {
        user_id: user.id,
        title: `tspace-post3`,
      },
    ])
    // Using this trx now will auto-commit to the database.
    .bind(trx) // If you need to perform additional operations, use await trx.startTransaction(); again.
    .save();

   
    // Do not perform any operations with this trx.
    // The transaction has already been committed, and the trx is closed.
    // Just ensure everything is handled at the end of the transaction.
    await trx.end();
  
} catch (err) {
  /**
   *
   * @rollback rollback transaction
   */
  await trx.rollback();
}
```

<div class="page-nav-cards">
  <a href="#/query-builder" class="prev-card">
    <div class="nav-label"> 
        <span style="color:#fff; font-size:16px;">←</span> 
        Previous
    </div>
    <div class="nav-title"> Query Builder </div>
  </a>

  <a href="#/race-condition" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title">Race Condition</div>
  </a>
</div>