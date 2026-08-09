# tspace-mysql - Database Transactions Guide

## Overview

tspace-mysql provides robust transaction support for maintaining data integrity. Transactions allow you to group multiple database operations into a single unit of work that either completes entirely or rolls back on failure.

## Basic Transaction Usage

### Using DB.beginTransaction()

```typescript
import { DB } from 'tspace-mysql'

// Start a transaction
const trx = await DB.beginTransaction()

try {
  // Execute queries within transaction
  await trx.query('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com'])
  await trx.query('UPDATE accounts SET balance = balance - 100 WHERE user_id = ?', [1])
  await trx.query('UPDATE accounts SET balance = balance + 100 WHERE user_id = ?', [2])
  
  // Commit if all successful
  await trx.commit()
} catch (error) {
  // Rollback on error
  await trx.rollback()
  throw error
} finally {
  // Always end the transaction
  await trx.end()
}
```

### Using DB.transaction() Helper

The `transaction()` method automatically handles commit/rollback:

```typescript
import { DB } from 'tspace-mysql'

const result = await DB.transaction(async (conn) => {
  // All queries must use the provided connection
  await conn.query('INSERT INTO users (name) VALUES (?)', ['John'])
  const userId = await conn.query('SELECT LAST_INSERT_ID() as id').then(r => r[0].id)
  
  await conn.query('INSERT INTO profiles (user_id, bio) VALUES (?, ?)', [userId, 'Hello'])
  
  return userId // Return value from transaction
})

console.log('Created user with ID:', result)
```

## Transaction with Models

### Binding Model to Transaction

```typescript
import { Model, Blueprint, DB } from 'tspace-mysql'

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).null(),
      email: Blueprint.varchar(255).null(),
    })
  }
}

// Using transaction with model
const trx = await DB.beginTransaction()

try {
  // Bind model instance to transaction
  const user = await new User()
    .bind(trx)
    .create({ name: 'John', email: 'john@example.com' })
    .save()
  
  // Use same transaction for related operations
  await new DB('profiles')
    .bind(trx)
    .create({ user_id: user.id, bio: 'Hello' })
    .save()
  
  await trx.commit()
} catch (error) {
  await trx.rollback()
  throw error
} finally {
  await trx.end()
}
```

### Using with() Method

```typescript
const trx = await DB.beginTransaction()

try {
  await new User()
    .with(trx)  // Alternative to bind()
    .create({ name: 'John' })
    .save()
  
  await trx.commit()
} catch (error) {
  await trx.rollback()
} finally {
  await trx.end()
}
```

## Transaction with Repository

```typescript
import { Repository, Model, Blueprint, DB } from 'tspace-mysql'

class User extends Model { /* ... */ }
class Order extends Model { /* ... */ }

const userRepository = Repository(User)
const orderRepository = Repository(Order)

const trx = await DB.beginTransaction()

try {
  // Create user
  const user = await userRepository.create({
    data: { name: 'John', email: 'john@example.com' },
    transaction: trx
  })
  
  // Create order for user
  await orderRepository.create({
    data: { user_id: user.id, total: 100 },
    transaction: trx
  })
  
  await trx.commit()
} catch (error) {
  await trx.rollback()
  throw error
} finally {
  await trx.end()
}
```

## Cluster Transaction Support

For clustered databases, you can specify which node to use:

```typescript
import { DB } from 'tspace-mysql'

// Transaction on specific node
const trx = await DB.beginTransaction({
  nodeId: 1  // Use node 1 as writer
})

// Or based on primary ID (hash-based selection)
const trx2 = await DB.beginTransaction({
  primaryId: 123  // Node selected based on ID % nodeCount
})
```

## Lock Table

Lock tables for read or write operations within a transaction:

### Write Lock

```typescript
import { Model, Blueprint } from 'tspace-mysql'

class User extends Model { /* ... */ }

// Lock table for write (exclusive lock)
await User.lockTable('WRITE', async (query) => {
  // Other sessions must wait before reading or writing
  
  const user = await query
    .where('id', 1)
    .update({ balance: DB.raw('balance - 100') })
    .save()
  
  return user
})
```

### Read Lock

```typescript
// Lock table for read (shared lock)
await User.lockTable('READ', async (query) => {
  // Other sessions can read but must wait before writing
  
  const users = await query.findMany()
  
  // Process users...
  return users
})
```

### Lock Behavior

| Lock Type | SELECT | INSERT | UPDATE | DELETE |
|-----------|--------|--------|--------|--------|
| READ      | OK     | Waits  | Waits  | Waits  |
| WRITE     | Waits  | Waits  | Waits  | Waits  |

> **Note**: Table locking is not recommended in clustered or load-balanced environments because locks are session-bound.

## Race Condition Handling

### Using Optimistic Locking

```typescript
import { Model, Blueprint } from 'tspace-mysql'

class Account extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      balance: Blueprint.decimal(10, 2).default(0),
      version: Blueprint.int().default(0),  // Optimistic lock version
    })
  }
}

// Update with version check
async function transfer(fromId: number, toId: number, amount: number) {
  const trx = await DB.beginTransaction()
  
  try {
    const fromAccount = await new Account().bind(trx).find(fromId)
    
    if (!fromAccount) throw new Error('Account not found')
    
    // Check version for optimistic locking
    const updated = await new Account()
      .bind(trx)
      .where('id', fromId)
      .where('version', fromAccount.version)
      .update({
        balance: DB.raw(`balance - ${amount}`),
        version: DB.raw('version + 1')
      })
      .save()
    
    if (!updated) throw new Error('Concurrent modification detected')
    
    await trx.commit()
  } catch (error) {
    await trx.rollback()
    throw error
  } finally {
    await trx.end()
  }
}
```

### Using Pessimistic Locking (SELECT FOR UPDATE)

```typescript
import { DB } from 'tspace-mysql'

async function safeTransfer(fromId: number, toId: number, amount: number) {
  return await DB.transaction(async (conn) => {
    // Lock the row for update
    const fromAccount = await conn.query(
      'SELECT * FROM accounts WHERE id = ? FOR UPDATE',
      [fromId]
    )
    
    if (fromAccount[0].balance < amount) {
      throw new Error('Insufficient balance')
    }
    
    // Perform transfer
    await conn.query(
      'UPDATE accounts SET balance = balance - ? WHERE id = ?',
      [amount, fromId]
    )
    
    await conn.query(
      'UPDATE accounts SET balance = balance + ? WHERE id = ?',
      [amount, toId]
    )
    
    return true
  })
}
```

## Transaction Best Practices

### Keep Transactions Short

```typescript
// ❌ Bad: Long-running transaction
const trx = await DB.beginTransaction()
await new User().bind(trx).create({...}).save()
await doSlowExternalAPI()  // Don't do this!
await new Order().bind(trx).create({...}).save()
await trx.commit()

// ✅ Good: Short transaction
const user = await new User().create({...}).save()
await doSlowExternalAPI()  // Outside transaction
await new Order().create({ user_id: user.id, ...}).save()
```

### Proper Error Handling

```typescript
async function safeTransaction() {
  const trx = await DB.beginTransaction()
  
  try {
    // Operations...
    await trx.commit()
  } catch (error) {
    await trx.rollback()
    throw error  // Re-throw or handle
  } finally {
    await trx.end()  // Always clean up
  }
}
```

### Using the Helper Pattern

```typescript
// Recommended: Use transaction helper for automatic cleanup
async function createUserWithProfile(data: UserData) {
  return await DB.transaction(async (conn) => {
    const userResult = await conn.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [data.name, data.email]
    )
    
    const userId = userResult.insertId
    
    await conn.query(
      'INSERT INTO profiles (user_id, bio) VALUES (?, ?)',
      [userId, data.bio]
    )
    
    return { id: userId, ...data }
  })
}
```

## Transaction Isolation

tspace-mysql uses the default isolation level of the underlying database:

| Database   | Default Isolation     |
|------------|----------------------|
| MySQL      | REPEATABLE READ      |
| PostgreSQL | READ COMMITTED       |
| SQLite     | SERIALIZABLE         |
| MariaDB    | REPEATABLE READ      |

To change isolation level:

```typescript
const trx = await DB.beginTransaction()
await trx.query('SET TRANSACTION ISOLATION LEVEL READ COMMITTED')
await trx.query('START TRANSACTION')
// ... operations
```

## Complete Example: E-commerce Order

```typescript
import { Model, Blueprint, DB, Repository } from 'tspace-mysql'

// Models
class Product extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).notNull(),
      price: Blueprint.decimal(10, 2).notNull(),
      stock: Blueprint.int().default(0),
    })
  }
}

class Order extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      user_id: Blueprint.int().notNull(),
      total: Blueprint.decimal(10, 2).notNull(),
      status: Blueprint.enum('pending', 'confirmed', 'shipped').default('pending'),
      created_at: Blueprint.timestamp().currentTimestamp(),
    })
    this.hasMany({ model: OrderItem, name: 'items' })
  }
}

class OrderItem extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      order_id: Blueprint.int().foreign({ on: Order }).notNull(),
      product_id: Blueprint.int().foreign({ on: Product }).notNull(),
      quantity: Blueprint.int().notNull(),
      price: Blueprint.decimal(10, 2).notNull(),
    })
  }
}

// Service with transaction
class OrderService {
  async createOrder(userId: number, items: { productId: number; quantity: number }[]) {
    return await DB.transaction(async (conn) => {
      let total = 0
      
      // Check stock and calculate total
      for (const item of items) {
        const product = await conn.query(
          'SELECT * FROM products WHERE id = ? FOR UPDATE',
          [item.productId]
        )
        
        if (!product.length) {
          throw new Error(`Product ${item.productId} not found`)
        }
        
        if (product[0].stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`)
        }
        
        total += product[0].price * item.quantity
      }
      
      // Create order
      const orderResult = await conn.query(
        'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
        [userId, total, 'confirmed']
      )
      
      const orderId = orderResult.insertId
      
      // Create order items and update stock
      for (const item of items) {
        const product = await conn.query(
          'SELECT * FROM products WHERE id = ?',
          [item.productId]
        )
        
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, product[0].price]
        )
        
        await conn.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.productId]
        )
      }
      
      return { orderId, total, status: 'confirmed' }
    })
  }
}
```

## Related Documents

- `00-overview.md` - Library overview
- `02-query-builder.md` - Query builder usage
- `04-repository.md` - Repository pattern
- `11-race-condition.md` - Race condition handling