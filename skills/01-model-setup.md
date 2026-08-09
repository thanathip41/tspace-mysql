# tspace-mysql - Model Setup Guide

## Overview

The `Model` class is the foundation of tspace-mysql's ORM functionality. It provides a way to interact with database tables as TypeScript objects with full type safety.

## Basic Model Definition

### Method 1: Using `useSchema` in Constructor

```typescript
import { Model, Blueprint, DB } from 'tspace-mysql'

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      uuid: Blueprint.varchar(50).null(),
      email: Blueprint.varchar(50).null(),
      name: Blueprint.varchar(255).null(),
      created_at: Blueprint.timestamp().null(),
      updated_at: Blueprint.timestamp().null(),
    })
  }
}

// Usage
const user = await new User().find(1)
console.log(user?.name)
```

### Method 2: Using Decorators

```typescript
import { Model, Column, Table, Blueprint } from 'tspace-mysql'

@Table('users')
class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(50).null())
  public uuid!: string

  @Column(() => Blueprint.varchar(50).null())
  public email!: string
}
```

## Schema Definition with Blueprint

The `Blueprint` class defines column types and constraints:

### Numeric Types
```typescript
Blueprint.int()           // INT
Blueprint.tinyInt()       // TINYINT
Blueprint.bigInt()        // BIGINT
Blueprint.boolean()       // BOOLEAN
Blueprint.double()        // DOUBLE
Blueprint.float()         // FLOAT
Blueprint.serial()        // SERIAL
```

### String Types
```typescript
Blueprint.varchar(255)    // VARCHAR(n)
Blueprint.char(10)        // CHAR(n)
Blueprint.text()          // TEXT
Blueprint.longText()      // LONGTEXT
Blueprint.mediumText()    // MEDIUMTEXT
Blueprint.tinyText()      // TINYTEXT
Blueprint.uuid()          // UUID
Blueprint.binary()        // BINARY
Blueprint.json()          // JSON
```

### Date/Time Types
```typescript
Blueprint.date()          // DATE
Blueprint.dateTime()      // DATETIME
Blueprint.timestamp()     // TIMESTAMP
```

### Special Types
```typescript
Blueprint.enum('admin', 'user')  // ENUM
Blueprint.virtualColumn('SQL expression')  // Virtual/Computed column
```

### Column Modifiers
```typescript
Blueprint.int().primary()           // PRIMARY KEY
Blueprint.int().autoIncrement()     // AUTO_INCREMENT
Blueprint.varchar(50).null()        // NULL allowed
Blueprint.varchar(50).notNull()     // NOT NULL
Blueprint.varchar(50).unique()      // UNIQUE constraint
Blueprint.varchar(50).index()       // Create index
Blueprint.varchar(50).default('value')  // DEFAULT value
Blueprint.timestamp().currentTimestamp()  // DEFAULT CURRENT_TIMESTAMP
Blueprint.int().unsigned()          // UNSIGNED
Blueprint.int().foreign({ on: User, references: 'id' })  // Foreign key
```

## Model Configuration Methods

### Table Name
```typescript
class User extends Model {
  constructor() {
    super()
    this.useTable('users')      // Explicit table name
    this.useTableSingular()     // Auto singular from class name
    this.useTablePlural()       // Auto plural from class name
  }
}
```

### Pattern (Naming Convention)
```typescript
class User extends Model {
  constructor() {
    super()
    this.usePattern('snake_case')   // Convert to snake_case
    this.usePattern('camelCase')    // Convert to camelCase
  }
}
```

### UUID Support
```typescript
class User extends Model {
  constructor() {
    super()
    this.useUUID()              // Enable UUID (default column: 'uuid')
    this.useUUID('custom_uuid') // Custom column name
  }
}
```

### Timestamps
```typescript
class User extends Model {
  constructor() {
    super()
    this.useTimestamp()                    // createdAt, updatedAt
    this.useTimestamp({ createdAt: 'created_at', updatedAt: 'updated_at' })
  }
}
```

### Soft Deletes
```typescript
class User extends Model {
  constructor() {
    super()
    this.useSoftDelete()              // Enable soft delete (default: 'deleted_at')
    this.useSoftDelete('deleted_at')  // Custom column name
  }
}
```

## Type Definitions

### Schema Type Extraction
```typescript
import { Model, Blueprint, T } from 'tspace-mysql'

const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).null(),
  email: Blueprint.varchar(255).null(),
}

// Extract TypeScript type from schema
type UserSchema = T.Schema<typeof userSchema>
// Result: { id: number, name: string | null, email: string | null }

class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
  }
}
```

### With Relations
```typescript
import { T } from 'tspace-mysql'

class Post extends Model {
  // ... schema definition
}

class User extends Model {
  constructor() {
    super()
    this.useSchema({ /* ... */ })
    this.hasMany({ model: Post, name: 'posts' })
  }
}

type UserSchema = T.Schema<typeof userSchema>
type UserRelations = T.Relation<{ posts: Post[] }>

class UserTyped extends Model<UserSchema, UserRelations> {
  // Full type safety with relations
}
```

## Model Lifecycle Hooks

### Using Methods in boot()
```typescript
class User extends Model {
  boot() {
    this.useUUID()
    this.useTimestamp()
    this.useSoftDelete()
    
    this.globalScope(query => {
      return query.where('status', 'active')
    })
  }
}
```

### Using Decorators
```typescript
import { 
  Table, UUID, Timestamp, SoftDelete, 
  Observer, Pattern, Hooks,
  BeforeInsert, AfterInsert 
} from 'tspace-mysql'

@UUID()
@Timestamp()
@SoftDelete()
@Pattern('snake_case')
@Table('users')
@Observer(UserObserver)
class User extends Model {
  
  @BeforeInsert()
  hashPassword() {
    // Hash password before insert
  }
  
  @AfterInsert()
  sendWelcomeEmail() {
    // Send email after insert
  }
  
  @Hooks()
  logAction() {
    // Generic lifecycle hook
  }
}
```

## Observer Pattern

```typescript
class UserObserver {
  selected(results: unknown) {
    console.log('User selected:', results)
  }
  
  created(results: unknown) {
    console.log('User created:', results)
  }
  
  updated(results: unknown) {
    console.log('User updated:', results)
  }
  
  deleted(results: unknown) {
    console.log('User deleted:', results)
  }
}

class User extends Model {
  constructor() {
    super()
    this.useObserver(UserObserver)
  }
}
```

## Logger Configuration

```typescript
class User extends Model {
  constructor() {
    super()
    this.useLogger({
      selected: true,    // Log select queries
      inserted: true,    // Log insert operations
      updated: true,     // Log update operations
      deleted: true,     // Log delete operations
    })
  }
}
```

## Global Scope

Apply query constraints to all queries:

```typescript
class User extends Model {
  boot() {
    super()
    this.globalScope(query => {
      return query
        .where('deleted_at', null)
        .orderBy('created_at', 'desc')
    })
  }
}

// All queries automatically include the global scope
const users = await new User().findMany()
// SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC
```

## Schema Synchronization

```typescript
// Sync model schema with database
await new User().sync({
  force: true,      // Drop and recreate table
  changed: true,    // Sync changed columns
  foreign: true,    // Sync foreign keys
  index: true,      // Sync indexes
})

// Drop table
await new User().drop({ force: true })
```

## Complete Example

```typescript
import { Model, Blueprint, DB, T, HasMany, Observer } from 'tspace-mysql'

// Observer class
class UserObserver {
  created(user: any) {
    console.log(`User ${user.name} created!`)
  }
}

// Schema definition
const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null(),
  email: Blueprint.varchar(255).notNull().unique(),
  name: Blueprint.varchar(255).null(),
  password: Blueprint.varchar(255).notNull(),
  status: Blueprint.boolean().default(0),
  role: Blueprint.enum('admin', 'user', 'guest').default('user'),
  created_at: Blueprint.timestamp().null(),
  updated_at: Blueprint.timestamp().null(),
  deleted_at: Blueprint.timestamp().null(),
}

// Type extraction
type UserSchema = T.Schema<typeof userSchema>

// Model class
class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.useTable('users')
    this.useUUID()
    this.useTimestamp()
    this.useSoftDelete()
    this.usePattern('snake_case')
    this.useObserver(UserObserver)
    this.useLogger({ selected: false, inserted: true, updated: true, deleted: true })
    
    // Relations
    this.hasMany({ model: Post, name: 'posts' })
    this.hasOne({ model: Profile, name: 'profile' })
    
    // Global scope - exclude soft deleted
    this.globalScope(query => query.where('deleted_at', null))
  }
  
  boot() {
    // Additional setup in boot method
  }
}

// Usage
const user = await User.find(1, {
  relations: ['posts', 'profile']
})
```

## Common Patterns

### Static Repository Usage
```typescript
// Using static methods (Repository pattern internally)
const users = await User.findMany({ where: { status: 1 } })
const user = await User.findOne({ where: { email: 'test@example.com' } })
const created = await User.create({ data: { email: 'new@example.com', name: 'New User' } })
```

### Instance Query Builder
```typescript
// Using instance methods (Query Builder pattern)
const users = await new User()
  .where('status', 1)
  .orderBy('name')
  .limit(10)
  .findMany()
```

### Type-Safe Queries
```typescript
import type { T } from 'tspace-mysql'

class User extends Model<UserSchema> { /* ... */ }

// Full type inference
const user = await User.findOne({
  select: { id: true, email: true },  // Type-safe column selection
  where: { id: 1 },                    // Type-safe where conditions
  relations: ['posts']                 // Type-safe relation names
})
// user type: { id: number, email: string | null, posts: Post[] }
```

## Related Documents

- `00-overview.md` - Library overview
- `02-query-builder.md` - Query builder usage
- `03-relations.md` - Model relationships
- `05-decorators.md` - Decorator patterns
- `06-type-safety.md` - TypeScript type system