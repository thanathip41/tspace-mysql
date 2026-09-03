# tspace-mysql - Repository Pattern Guide

## Overview

The Repository pattern provides a clean separation between business logic and data access. In tspace-mysql, the `Repository` function creates a repository instance for a given model, offering a consistent API for CRUD operations.

## Creating a Repository

```js
import { Repository, Model, Blueprint, T } from 'tspace-mysql'

// Define model
const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).null(),
  email: Blueprint.varchar(255).null(),
}

type UserSchema = T.Schema<typeof userSchema>

class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
  }
}

// Create repository
const userRepository = Repository(User)
```

## Find Operations

### Find by Primary Key

```js
// Find by ID
const user = await userRepository.find(1)

// Find with options
const user = await userRepository.find(1, {
  select: { id: true, name: true, email: true }
})

// Find with relations
const user = await userRepository.find(1, {
  relations: { posts: true, profile: true }
})
```

### Find One

```js
// Find first record
const user = await userRepository.findOne()

// Find with where condition
const user = await userRepository.findOne({
  where: { email: 'test@example.com' }
})

// Find with select
const user = await userRepository.findOne({
  select: { id: true, name: true },
  where: { status: 'active' }
})

// Find with ordering
const user = await userRepository.findOne({
  orderBy: [['created_at', 'desc']]
})
```

### Find Many

```js
// Get all records
const users = await userRepository.findMany()

// Get with where conditions
const users = await userRepository.findMany({
  where: { status: 'active' }
})

// Get with pagination-like options
const users = await userRepository.findMany({
  where: { status: 'active' },
  limit: 10,
  offset: 20,
  orderBy: [['created_at', 'desc']]
})

// Get with relations
const users = await userRepository.findMany({
  relations: { posts: true }
})
```

### Paginate

```js
// Default pagination (15 per page)
const result = await userRepository.paginate()

// Custom pagination
const result = await userRepository.paginate({
  page: 2,
  limit: 25
})

// With conditions
const result = await userRepository.paginate({
  page: 1,
  limit: 10,
  where: { status: 'active' },
  orderBy: [['created_at', 'desc']]
})

/*
Result structure:
{
  meta: {
    total: 100,
    limit: 10,
    total_page: 10,
    current_page: 1,
    last_page: 10,
    next_page: 2,
    prev_page: null
  },
  data: [...] // array of users
}
*/
```

### Exists Check

```js
// Check if any record exists
const exists = await userRepository.exists()

// Check with conditions
const exists = await userRepository.exists({
  where: { email: 'test@example.com' }
})
```

### Count

```js
// Count all records
const total = await userRepository.count('id')

// Count with conditions
const activeCount = await userRepository.count('id', {
  where: { status: 'active' }
})
```

### Aggregate Functions

```js
// Sum
const totalAmount = await userRepository.sum('amount')

// Average
const avgAge = await userRepository.avg('age')

// Max
const maxScore = await userRepository.max('score')

// Min
const minScore = await userRepository.min('score')
```

## Create Operations

### Create Single Record

```js
// Basic create
const user = await userRepository.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  }
})

// Create with transaction
const trx = await DB.beginTransaction()
const user = await userRepository.create({
  data: { name: 'John', email: 'john@example.com' },
  transaction: trx
})
await trx.commit()

// Create without return (noReturn = true)
await userRepository.create({
  data: { name: 'John', email: 'john@example.com' },
  noReturn: true  // Returns undefined instead of created record
})
```

### Create Multiple Records

```js
// Create many records
const users = await userRepository.createMany({
  data: [
    { name: 'User 1', email: 'user1@example.com' },
    { name: 'User 2', email: 'user2@example.com' },
    { name: 'User 3', email: 'user3@example.com' }
  ]
})

// With transaction
const users = await userRepository.createMany({
  data: [...],
  transaction: trx
})
```

### Create or Update (Upsert)

```js
// Update if exists, create if not
const user = await userRepository.createOrUpdate({
  data: { name: 'Updated Name', email: 'test@example.com' },
  where: { email: 'test@example.com' }
})
```

### Create If Not Exists

```js
// Insert only if not exists (ignores duplicates)
const user = await userRepository.createNotExists({
  data: { name: 'John', email: 'john@example.com' },
  where: { email: 'john@example.com' }
})
// Returns null if already exists
```

### Create Or Select

```js
// Insert or return existing
const user = await userRepository.createOrSelect({
  data: { name: 'John', email: 'john@example.com' },
  where: { email: 'john@example.com' }
})
// Returns existing record if duplicate found
```

## Update Operations

### Update Single Record

```js
// Update with where condition
const user = await userRepository.update({
  data: { name: 'Updated Name' },
  where: { id: 1 }
})

// Update with multiple conditions
const user = await userRepository.update({
  data: { status: 'inactive' },
  where: { id: 1, status: 'active' }
})
```

### Update Multiple Records

```js
// Update all matching records
const users = await userRepository.updateMany({
  data: { status: 'active' },
  where: { status: 'pending' }
})

// Update with complex conditions
const users = await userRepository.updateMany({
  data: { verified: true },
  where: {
    verified: false,
    created_at: new Date('2024-01-01')
  }
})
```

### Update Cases (Conditional Update)

```js
// Update different values based on conditions
const result = await userRepository.updateCases({
  cases: [
    {
      when: { id: 1 },
      columns: { name: 'Name One' }
    },
    {
      when: { id: 2 },
      columns: { name: 'Name Two' }
    }
  ],
  where: { id: [1, 2] }
})

/*
UPDATE `users` SET `name` = CASE
  WHEN `id` = 1 THEN 'Name One'
  WHEN `id` = 2 THEN 'Name Two'
END
WHERE `id` IN (1, 2)
*/
```

## Delete Operations

### Delete Single Record

```js
// Delete by ID
const deleted = await userRepository.delete(1)

// Delete with conditions
const deleted = await userRepository.delete({
  where: { id: 1 }
})
```

### Delete Multiple Records

```js
// Delete all matching records
const deleted = await userRepository.deleteMany({
  where: { status: 'inactive' }
})
```

### Force Delete (Bypass Soft Delete)

```js
// Permanently delete even with soft delete enabled
const deleted = await userRepository.forceDelete({
  where: { id: 1 }
})
```

## Query Options

### Select Columns

```js
const user = await userRepository.findOne({
  select: { id: true, name: true, email: true }
})
// SELECT id, name, email FROM users
```

### Except Columns

```js
const user = await userRepository.findOne({
  except: { password: true, deleted_at: true }
})
// SELECT all EXCEPT password, deleted_at
```

### Order By

```js
const users = await userRepository.findMany({
  orderBy: [
    ['status', 'asc'],
    ['created_at', 'desc']
  ]
})
```

### Group By

```js
const grouped = await userRepository.findMany({
  groupBy: ['status', 'role']
})
```

### Having

```js
const result = await userRepository.findMany({
  groupBy: ['status'],
  having: 'COUNT(id) > 1'
})
```

### Limit and Offset

```js
const users = await userRepository.findMany({
  limit: 10,
  offset: 20
})
```

### Where Conditions

```js
import { OP } from 'tspace-mysql'

const users = await userRepository.findMany({
  where: {
    id: OP.gt(1),                    // id > 1
    status: OP.in(['active', 'pending']),
    name: OP.like('%john%'),
    age: OP.between(18, 65),
    email: OP.notNull()
  }
})
```

### Where Raw

```js
const users = await userRepository.findMany({
  whereRaw: [
    'CONCAT(first_name, " ", last_name) LIKE ?',
    ['%John%']
  ]
})
```

### Conditional Query (when)

```js
const users = await userRepository.findMany({
  where: { status: 'active' },
  when: {
    condition: shouldFilter,
    callback: (query) => query.where('verified', true)
  }
})
```

### Join Clauses

```js
// Inner join
const users = await userRepository.findMany({
  join: [
    { localKey: 'users.id', referenceKey: 'posts.user_id' }
  ]
})

// Left join
const users = await userRepository.findMany({
  leftJoin: [
    { localKey: 'users.id', referenceKey: 'profiles.user_id' }
  ]
})

// Right join
const users = await userRepository.findMany({
  rightJoin: [
    { localKey: 'users.id', referenceKey: 'orders.user_id' }
  ]
})
```

### Relations

```js
// Load relations
const user = await userRepository.find(1, {
  relations: { posts: true, profile: true }
})

// Nested relations
const user = await userRepository.find(1, {
  relations: {
    posts: {
      relations: {
        comments: {
          relations: {
            author: true
          }
        }
      }
    }
  }
})

// Relation with conditions
const user = await userRepository.find(1, {
  relations: { posts: true },
  relationQuery: {
    posts: (query) => query.where('status', 'published')
  }
})

// Check relation exists
const user = await userRepository.findOne({
  relationExists: ['posts']
})

// Include relation count
const user = await userRepository.find(1, {
  relationCount: ['posts', 'comments']
})
```

### Debug Mode

```js
// Log the generated SQL
const user = await userRepository.findOne({
  where: { id: 1 },
  debug: true  // Prints SQL to console
})
```

## Advanced Features

### To String (Get SQL)

```js
// Get the SQL query without executing
const sql = userRepository.toString({
  where: { id: 1 },
  select: { id: true, name: true }
})
// Returns: SELECT `id`, `name` FROM `users` WHERE `id` = 1
```

### To JSON

```js
// Get results as JSON string
const json = await userRepository.toJSON({
  where: { status: 'active' }
})
```

### To Array

```js
// Get single column as array
const emails = await userRepository.toArray('email', {
  where: { status: 'active' }
})
// Returns: ['a@b.com', 'c@d.com', ...]
```

### Raw String Query

```js
import { sql } from 'tspace-mysql'

const users = await userRepository.findMany({
  selectRaw: {
    full_name: sql`CONCAT(first_name, ' ', last_name)`
  }
})
```

### Generic Type Extension

```js
import { T } from 'tspace-mysql'

// Add custom properties to result type
const user = await userRepository.find(1, {
  // ... options
  // Result type can be extended with generic parameter G
})
```

## Transaction Support

```js
// Using repository with transaction
const trx = await DB.beginTransaction()

try {
  await userRepository.create({
    data: { name: 'John', email: 'john@example.com' },
    transaction: trx
  })
  
  await userRepository.update({
    data: { last_login: new Date() },
    where: { email: 'john@example.com' },
    transaction: trx
  })
  
  await trx.commit()
} catch (error) {
  await trx.rollback()
  throw error
}
```

## Complete Example

```js
import { Repository, Model, Blueprint, T, DB, OP } from 'tspace-mysql'

// Model definition
const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).null(),
  email: Blueprint.varchar(255).unique().notNull(),
  status: Blueprint.enum('active', 'inactive', 'pending').default('pending'),
  created_at: Blueprint.timestamp().null(),
  updated_at: Blueprint.timestamp().null(),
}

type UserSchema = T.Schema<typeof userSchema>

class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.useTimestamp()
    this.hasMany({ model: Post, name: 'posts' })
  }
}

// Repository usage
class UserService {
  private userRepository = Repository(User)
  
  async getUserById(id: number) {
    return await this.userRepository.find(id, {
      relations: { posts: true }
    })
  }
  
  async getActiveUsers(page: number = 1, limit: number = 15) {
    return await this.userRepository.paginate({
      page,
      limit,
      where: { status: 'active' },
      orderBy: [['created_at', 'desc']]
    })
  }
  
  async createUser(data: { name: string; email: string }) {
    return await this.userRepository.create({ data })
  }
  
  async updateUser(id: number, data: Partial<UserSchema>) {
    return await this.userRepository.update({
      data,
      where: { id }
    })
  }
  
  async deleteUser(id: number) {
    return await this.userRepository.delete(id)
  }
  
  async searchUsers(searchTerm: string) {
    return await this.userRepository.findMany({
      where: {
        name: OP.like(`%${searchTerm}%`)
      },
      orderBy: [['name', 'asc']]
    })
  }
  
  async bulkActivate(userIds: number[]) {
    return await this.userRepository.updateMany({
      data: { status: 'active' },
      where: { id: OP.in(userIds) }
    })
  }
}

// Usage
const userService = new UserService()
const users = await userService.getActiveUsers(1, 10)
```

## Related Documents

- `00-overview.md` - Library overview
- `01-model-setup.md` - Model definitions
- `02-query-builder.md` - Query builder usage
- `03-relations.md` - Model relationships
- `07-transactions.md` - Database transactions
- `08-caching.md` - Caching strategies
- `99-quickstart.md` - Complete example