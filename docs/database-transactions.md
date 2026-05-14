# Database Transactions

Within a database transaction, you can utilize the following:

```js
import { DB } from 'tspace-mysql';
import { User } from '../Models/User';
import { Post } from '../Models/Post';

const trx = await DB.beginTransaction();

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

  console.error(err);
}
```
Or you can use transaction method for auto commit and rollback, you can utilize the following:
```js
import { DB } from 'tspace-mysql';
import { User } from '../Models/User';
import { Post } from '../Models/Post';

try {
  
  const { user, posts } = await DB.transaction(async (trx) => {
    
    const user = await new User()
    .create({
      name: `tspace`,
      email: "tspace@example.com",
    })
    .bind(trx) // don't forget this
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

    return { user, posts };

  });
} catch (err) {
  // error here is from transaction method, you don't need to worry about rollback, just catch error and handle it.
  console.error(err);
}
```

<div class="page-nav-cards">
  <a href="#/query-builder" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Query Builder </div>
  </a>

  <a href="#/race-condition" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title">Race Condition</div>
  </a>
</div>