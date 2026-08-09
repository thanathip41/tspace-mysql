# tspace-mysql - Query Builder Guide

## Overview

The `DB` class provides a fluent query builder for constructing and executing SQL queries. It supports all common SQL operations with type safety.

## Basic Usage

```typescript
import { DB } from 'tspace-mysql'

// Select all from table
const users = await new DB('users').findMany()

// Select single record by ID
const user = await new DB('users').find(1)

// Select first record matching conditions
const user = await new DB('users').where('email', 'test@example.com').findOne()
```

## Table Selection

### From / Table
```typescript
await new DB().from('users').findMany()
await new DB().table('users').findMany()
await new DB('users').findMany()  // Shorthand
```

### Alias
```typescript
await new DB('users').alias('u').find(1)
// SELECT * FROM `users` AS `u` WHERE `u`.`id` = '1' LIMIT 1

await new DB().alias('u', new DB('users').select('*').limit(1).toString()).find(1)
// SELECT * FROM (SELECT * FROM `users` LIMIT 1) AS `u` WHERE `u`.`id` = '1' LIMIT 1
```

### Subquery as Table
```typescript
await new DB()
  .fromRaw('u', new DB('users').select('*').limit(1).toString())
  .find(1)
```

## Select Statements

### Basic Select
```typescript
// Select specific columns
await new DB('users').select('id', 'name', 'email').findMany()
// SELECT `users`.`id`, `users`.`name`, `users`.`email` FROM `users`

// Select all (default)
await new DB('users').select('*').findMany()
```

### Select Except
```typescript
// Select all except specific columns
await new DB('users').except('password', 'deleted_at').findMany()
// SELECT all columns EXCEPT password, deleted_at
```

### Select Raw
```typescript
import { DB } from 'tspace-mysql'

await new DB('users').selectRaw('COUNT(id) as total').findOne()
// SELECT COUNT(id) as total FROM `users`

await new DB('users').select(DB.raw('COUNT(id) as total')).findOne()
```

### Select Object (JSON)
```typescript
// Create JSON object from joined table
const post = await new DB('posts')
  .join('posts.user_id', 'users.id')
  .select('posts.*')
  .selectObject(
    { id: 'users.id', name: 'users.name', email: 'users.email' },
    'user'
  )
  .findOne()

/*
SELECT 
  posts.*, 
  JSON_OBJECT('id', `users`.`id`, 'name', `users`.`name`, 'email', `users`.`email`) AS `user`
FROM `posts`
INNER JOIN `users` ON `posts`.`user_id` = `users`.`id`
LIMIT 1
*/
```

### Select Array (JSON Array)
```typescript
const user = await new DB('users')
  .select('id', 'name', 'email')
  .join('users.id', 'posts.user_id')
  .select('posts.*')
  .selectArray(
    { id: 'posts.id', user_id: 'posts.user_id', title: 'posts.title' },
    'posts'
  )
  .findOne()

/*
SELECT 
  `users`.`id`, `users`.`name`, `users`.`email`,
  CASE 
    WHEN COUNT(`posts`.`id`) = 0 THEN JSON_ARRAY()
    ELSE JSON_ARRAYAGG(JSON_OBJECT('id', `posts`.`id`, ...))
  END AS `posts`
FROM `users`
INNER JOIN `posts` ON `users`.`id` = `posts`.`user_id`
GROUP BY `users`.`id`
LIMIT 1
*/
```

### Distinct
```typescript
await new DB('users').distinct().select('email').findMany()
// SELECT DISTINCT `users`.`email` FROM `users`
```

## Where Clauses

### Basic Where
```typescript
// Equality
await new DB('users').where('id', 1).findMany()
// WHERE `users`.`id` = '1'

// With operator
await new DB('users').where('id', '>', 1).findMany()
// WHERE `users`.`id` > '1'

// Chaining multiple conditions
await new DB('users')
  .where('id', '>', 1)
  .where('status', 'active')
  .findMany()
```

### Where Operators (OP)
```typescript
import { OP } from 'tspace-mysql'

await new DB('users').whereObject({
  id: OP.notEq(1),
  status: OP.in(['active', 'pending']),
  name: OP.like('%john%'),
  age: OP.between(18, 65),
  role: OP.notIn(['banned']),
  email: OP.startsWith('test'),
  phone: OP.endsWith('1234'),
}).findMany()
```

### Where Object
```typescript
await new DB('users').whereObject({
  id: 1,
  status: 'active',
  name: 'John'
}).findMany()
// WHERE `id` = 1 AND `status` = 'active' AND `name` = 'John'
```

### Or Where
```typescript
await new DB('users')
  .where('id', 1)
  .orWhere('email', 'test@example.com')
  .findMany()
// WHERE `id` = 1 OR `email` = 'test@example.com'
```

### Where In / Not In
```typescript
await new DB('users').whereIn('id', [1, 2, 3]).findMany()
// WHERE `id` IN ('1','2','3')

await new DB('users').whereNotIn('id', [1, 2, 3]).findMany()
// WHERE `id` NOT IN ('1','2','3')
```

### Where Between / Not Between
```typescript
await new DB('users').whereBetween('age', [18, 65]).findMany()
// WHERE `age` BETWEEN '18' AND '65'

await new DB('users').whereNotBetween('age', [18, 65]).findMany()
```

### Where Null / Not Null
```typescript
await new DB('users').whereNull('deleted_at').findMany()
// WHERE `deleted_at` IS NULL

await new DB('users').whereNotNull('deleted_at').findMany()
// WHERE `deleted_at` IS NOT NULL
```

### Where JSON
```typescript
await new DB('users')
  .whereJSON('metadata', { key: 'status', value: 'active' })
  .findMany()
// WHERE `metadata`->>'$.status' = 'active'
```

### Where Exists / Not Exists
```typescript
const subQuery = new DB('posts').select('id').where('user_id', DB.raw('users.id')).toString()

await new DB('users')
  .whereExists(subQuery)
  .findMany()
// WHERE EXISTS (SELECT `id` FROM `posts` WHERE `user_id` = `users`.`id`)

await new DB('users')
  .whereNotExists(subQuery)
  .findMany()
```

### Where Subquery
```typescript
await new DB('users')
  .whereSubQuery('id', new DB('posts').select('user_id').toString())
  .findMany()
// WHERE `id` IN (SELECT `user_id` FROM `posts`)
```

### Conditional Where (when)
```typescript
const shouldFilter = true

await new DB('users')
  .where('status', 'active')
  .when(shouldFilter, (query) => query.where('verified', true))
  .findMany()
// Only adds WHERE `verified` = true when shouldFilter is true
```

### Where Cases (CASE WHEN)
```typescript
await new DB('payments')
  .whereCases([
    { when: "payment_type = 'credit'", then: "status = 'approved'" },
    { when: "payment_type = 'paypal'", then: "status = 'pending'" }
  ], 'FALSE')
  .findMany()

/*
WHERE (
  CASE 
    WHEN payment_type = 'credit' THEN status = 'approved'
    WHEN payment_type = 'paypal' THEN status = 'pending'
    ELSE FALSE
  END
)
*/
```

### Logical Grouping (whereQuery)
```typescript
await new DB('users')
  .where('id', '>', 1)
  .whereQuery((query) => {
    return query
      .where('status', 'active')
      .orWhere('status', 'pending')
  })
  .findMany()

// WHERE `id` > 1 AND (`status` = 'active' OR `status` = 'pending')
```

### Where Any / Where All
```typescript
// Match any of the columns
await new DB('users')
  .whereAny(['name', 'email', 'username'], 'like', '%search%')
  .findMany()
// WHERE (`name` LIKE '%search%' OR `email` LIKE '%search%' OR `username` LIKE '%search%')

// Match all of the columns
await new DB('users')
  .whereAll(['status', 'verified'], '=', true)
  .findMany()
// WHERE (`status` = true AND `verified` = true)
```

## Ordering

### Basic Order By
```typescript
await new DB('users').orderBy('id', 'asc').findMany()
// ORDER BY `id` ASC

await new DB('users').orderBy('id', 'desc').findMany()
// ORDER BY `id` DESC

// Multiple order by
await new DB('users')
  .orderBy('status', 'asc')
  .orderBy('created_at', 'desc')
  .findMany()
```

### Latest / Oldest
```typescript
await new DB('users').latest('created_at').findMany()
// ORDER BY `created_at` DESC

await new DB('users').oldest('created_at').findMany()
// ORDER BY `created_at` ASC
```

### Random
```typescript
await new DB('users').random().findMany()
// ORDER BY RAND()
```

## Grouping

### Group By
```typescript
await new DB('users').groupBy('status').findMany()
// GROUP BY `status`

await new DB('users').groupBy('status', 'role').findMany()
// GROUP BY `status`, `role`
```

### Having
```typescript
await new DB('users')
  .select(DB.raw('COUNT(id) as count'), 'status')
  .groupBy('status')
  .having('count > 1')
  .findMany()
// GROUP BY `status` HAVING count > 1
```

### Get Grouped Results (Map)
```typescript
const grouped = await new DB('posts').getGroupBy('user_id')
// Returns Map<user_id, Post[]>

const user1Posts = grouped.get(1)
```

## Limit and Offset

```typescript
await new DB('users').limit(10).findMany()
// LIMIT 10

await new DB('users').offset(20).limit(10).findMany()
// LIMIT 10 OFFSET 20

// Negative limit returns max int
await new DB('users').limit(-1).findMany()
// LIMIT 2147483647
```

## Joins

### Inner Join
```typescript
await new DB('posts')
  .join('posts.user_id', 'users.id')
  .findMany()
// INNER JOIN `users` ON `posts`.`user_id` = `users`.`id`
```

### Left / Right Join
```typescript
await new DB('posts').leftJoin('posts.user_id', 'users.id').findMany()
// LEFT JOIN `users` ON `posts`.`user_id` = `users`.`id`

await new DB('posts').rightJoin('posts.user_id', 'users.id').findMany()
// RIGHT JOIN `users` ON `posts`.`user_id` = `users`.`id`
```

### Cross Join
```typescript
await new DB('posts').crossJoin('categories').findMany()
// CROSS JOIN `categories`
```

### Join with Callback (Complex)
```typescript
await new DB('posts')
  .join((join) => {
    return join
      .on('posts.user_id', 'users.id')
      .on('users.id', 'post_user.user_id')
      .and('users.id', 'posts.user_id')
  })
  .findMany()

/*
INNER JOIN `users` ON `posts`.`user_id` = `users`.`id`
INNER JOIN `post_user` ON `users`.`id` = `post_user`.`user_id`
AND `users`.`id` = `posts`.`user_id`
*/
```

## Pagination

```typescript
const result = await new DB('users').paginate({ page: 2, limit: 15 })

/*
{
  meta: {
    total: 100,
    limit: 15,
    total_page: 7,
    current_page: 2,
    last_page: 7,
    next_page: 3,
    prev_page: 1
  },
  data: [...] // array of users
}
*/
```

## Aggregate Functions

```typescript
const count = await new DB('users').count('id')
const sum = await new DB('orders').sum('amount')
const avg = await new DB('orders').avg('amount')
const max = await new DB('products').max('price')
const min = await new DB('products').min('price')
```

## Insert Statements

### Single Insert
```typescript
const user = await new DB('users')
  .create({
    name: 'John Doe',
    email: 'john@example.com'
  })
  .save()

// INSERT INTO `users` (`name`, `email`) VALUES ('John Doe', 'john@example.com')
// Returns inserted record
```

### Multiple Insert
```typescript
const users = await new DB('users')
  .createMultiple([
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' }
  ])
  .save()
```

### Insert or Ignore
```typescript
const user = await new DB('users')
  .createNotExists({ name: 'John', email: 'john@example.com' })
  .where({ email: 'john@example.com' })
  .save()
// Ignores duplicate key violations
```

### Insert or Select (Upsert)
```typescript
const user = await new DB('users')
  .createOrSelect({ name: 'John', email: 'john@example.com' })
  .where({ email: 'john@example.com' })
  .save()
// Returns existing record if duplicate, otherwise inserts
```

### Insert or Update
```typescript
const user = await new DB('users')
  .createOrUpdate({ name: 'John Updated', email: 'john@example.com' })
  .where({ email: 'john@example.com' })
  .save()
// Updates if exists, inserts if not
```

## Update Statements

### Single Update
```typescript
const user = await new DB('users')
  .where('id', 1)
  .update({ name: 'Updated Name' })
  .save()

// UPDATE `users` SET `name` = 'Updated Name' WHERE `id` = 1
```

### Multiple Update
```typescript
const users = await new DB('users')
  .where('status', 'inactive')
  .updateMany({ status: 'active' })
  .save()
```

### Update with Cases
```typescript
await new DB('users')
  .updateCases({
    cases: [
      { when: { id: 1 }, columns: { name: 'Name One' } },
      { when: { id: 2 }, columns: { name: 'Name Two' } }
    ],
    where: { id: [1, 2] }
  })
  .save()

/*
UPDATE `users` SET `name` = CASE
  WHEN `id` = 1 THEN 'Name One'
  WHEN `id` = 2 THEN 'Name Two'
END
WHERE `id` IN (1, 2)
*/
```

## Delete Statements

### Single Delete
```typescript
const deleted = await new DB('users').where('id', 1).delete()
// Returns true if deleted, false otherwise
```

### Force Delete (Bypass Soft Delete)
```typescript
const deleted = await new DB('users').where('id', 1).forceDelete()
// Permanently deletes even with soft delete enabled
```

### Disable Soft Delete for Query
```typescript
const deleted = await new DB('users')
  .where('id', 1)
  .disableSoftDelete()
  .delete()
```

## Raw SQL

### Raw Expressions
```typescript
import { DB } from 'tspace-mysql'

await new DB('users')
  .select(DB.raw('CONCAT(first_name, " ", last_name) AS full_name'))
  .findMany()
```

### Raw Where
```typescript
await new DB('users')
  .whereRaw('CONCAT(first_name, " ", last_name) LIKE ?', ['%John%'])
  .findMany()
```

### Raw Query Execution
```typescript
const results = await DB.query(
  'SELECT * FROM users WHERE id = :id AND email = :email',
  { id: 1, email: 'test@example.com' }
)
```

## Freeze (Bypass Pattern Conversion)

```typescript
import { DB } from 'tspace-mysql'

// Freeze prevents column name transformation
await new DB('users')
  .select(DB.freeze('firstName'))  // Won't convert to first_name
  .findMany()
```

## Utility Methods

### Exists Check
```typescript
const exists = await new DB('users').where('email', 'test@example.com').exists()
// Returns boolean
```

### Count
```typescript
const count = await new DB('users').count('id')
// Returns number
```

### To JSON / Array
```typescript
const json = await new DB('users').toJSON()
// Returns JSON string

const array = await new DB('users').toArray('email')
// Returns array of email values: ['a@b.com', 'c@d.com']
```

### To SQL String (Debug)
```typescript
const sql = await new DB('users')
  .where('id', 1)
  .select('id', 'name')
  .toString()
// Returns: SELECT `id`, `name` FROM `users` WHERE `id` = 1
```

### First or Error
```typescript
const user = await new DB('users').where('id', 1).firstOrError('User not found')
// Throws error if not found
```

## Common Table Expressions (CTE)

```typescript
await new DB()
  .with('active_users', new DB('users').where('active', true).toString())
  .from('active_users')
  .select('*')
  .findMany()

// WITH active_users AS (SELECT * FROM users WHERE active = true)
// SELECT * FROM active_users
```

## Union

```typescript
const query1 = new DB('users').select('id', 'name')
const query2 = new DB('admins').select('id', 'name')

await new DB('users').union([query1.toString(), query2.toString()]).findMany()
// SELECT * FROM users UNION SELECT * FROM admins
```

## Raw SQL Query Execution

```typescript
import { DB } from 'tspace-mysql'

// Execute raw SQL
const results = await DB.query('SELECT * FROM users WHERE id = :id', { id: 1 })

// With transaction
const trx = await DB.beginTransaction()
await DB.query('UPDATE users SET status = 1 WHERE id = :id', { id: 1 }, trx)
await trx.commit()
```

## Related Documents

- `00-overview.md` - Library overview
- `01-model-setup.md` - Model definitions
- `03-relations.md` - Model relationships
- `04-repository.md` - Repository pattern
- `07-transactions.md` - Database transactions