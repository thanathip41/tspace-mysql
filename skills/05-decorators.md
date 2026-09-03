# tspace-mysql - Decorator Guide

## Overview

tspace-mysql provides a comprehensive set of decorators for configuring models, defining columns, setting up relationships, and adding lifecycle hooks. Decorators offer a declarative way to configure your models.

## Prerequisites

Ensure `reflect-metadata` is imported in your main entry file:

```js
// main.ts or index.ts
import 'reflect-metadata'
```

## Table Name Decorators

### @Table

Set explicit table name:

```js
import { Model, Table, Blueprint, Column } from 'tspace-mysql'

@Table('users')
class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(255).null())
  public name!: string
}
```

### @TableSingular

Automatically use singular form of class name:

```js
@TableSingular()
class Users extends Model {
  // Table name will be 'user' (singular)
}
```

### @TablePlural

Automatically use plural form of class name:

```js
@TablePlural()
class User extends Model {
  // Table name will be 'users' (plural)
}
```

## Column Decorators

### @Column

Define a database column with Blueprint:

```js
import { Column, Blueprint } from 'tspace-mysql'

class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(255).notNull())
  public name!: string

  @Column(() => Blueprint.varchar(255).unique().null())
  public email!: string

  @Column(() => Blueprint.text().null())
  public bio!: string

  @Column(() => Blueprint.boolean().default(false))
  public verified!: boolean

  @Column(() => Blueprint.timestamp().currentTimestamp())
  public createdAt!: Date

  @Column(() => Blueprint.json().null())
  public metadata!: Record<string, any>
}
```

### @Transform

Add custom transform functions for serialization/deserialization:

```js
import { Transform } from 'tspace-mysql'

class User extends Model {
  @Column(() => Blueprint.json().null())
  @Transform({
    to: (value) => JSON.stringify(value),
    from: (value) => JSON.parse(value)
  })
  public preferences!: Record<string, any>

  @Column(() => Blueprint.varchar(255).null())
  @Transform({
    to: (value) => value?.toUpperCase(),
    from: (value) => value?.toLowerCase()
  })
  public code!: string
}
```

### @Validate

Add validation rules to columns:

```js
import { Validate } from 'tspace-mysql'

class User extends Model {
  @Column(() => Blueprint.varchar(255).notNull())
  @Validate({
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255
  })
  public name!: string

  @Column(() => Blueprint.varchar(255).notNull())
  @Validate({
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    unique: true
  })
  public email!: string

  @Column(() => Blueprint.int().notNull())
  @Validate({
    type: Number,
    min: 0,
    max: 150
  })
  public age!: number

  @Column(() => Blueprint.varchar(255).null())
  @Validate({
    fn: async (value: string) => {
      // Custom async validation
      if (await this.isUsernameTaken(value)) {
        return 'Username is already taken'
      }
      return null
    }
  })
  public username!: string
}
```

## Relationship Decorators

### @HasOne

Define one-to-one relationship:

```js
import { HasOne } from 'tspace-mysql'

class Profile extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.int().null())
  public userId!: number
}

class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @HasOne({ model: () => Profile, name: 'profile' })
  public profile!: Profile
}

// Alternative shorthand
class User extends Model {
  @HasOne(() => Profile)
  public profile!: Profile
}
```

### @HasMany

Define one-to-many relationship:

```js
import { HasMany } from 'tspace-mysql'

class Post extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.int().null())
  public userId!: number

  @Column(() => Blueprint.varchar(255).null())
  public title!: string
}

class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @HasMany({ model: () => Post, name: 'posts' })
  public posts!: Post[]

  // Alternative shorthand
  @HasMany(() => Post)
  public allPosts!: Post[]
}
```

### @BelongsTo

Define inverse relationship (many-to-one):

```js
import { BelongsTo } from 'tspace-mysql'

class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number
}

class Post extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.int().null())
  public userId!: number

  @BelongsTo({ model: () => User, name: 'author' })
  public author!: User

  // With custom foreign key
  @Column(() => Blueprint.int().null())
  public authorId!: number

  @BelongsTo({ model: () => User, foreignKey: 'authorId' })
  public creator!: User
}
```

### @BelongsToMany

Define many-to-many relationship with pivot table:

```js
import { BelongsToMany } from 'tspace-mysql'

class Role extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(50).notNull())
  public name!: string
}

class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @BelongsToMany({
    model: () => Role,
    name: 'roles',
    pivotTable: 'user_roles',
    localKey: 'user_id',
    foreignKey: 'role_id'
  })
  public roles!: Role[]
}
```

## Model Configuration Decorators

### @UUID

Enable automatic UUID generation:

```js
import { UUID, Model, Column, Blueprint } from 'tspace-mysql'

@UUID()  // Uses default 'uuid' column
class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(50).null())
  public uuid!: string  // Auto-populated
}

// Custom column name
@UUID('custom_uuid')
class Product extends Model {
  @Column(() => Blueprint.varchar(50).null())
  public custom_uuid!: string
}
```

### @Timestamp

Enable automatic timestamps:

```js
import { Timestamp } from 'tspace-mysql'

@Timestamp()  // Uses createdAt, updatedAt
class User extends Model {
  @Column(() => Blueprint.timestamp().null())
  public createdAt!: Date

  @Column(() => Blueprint.timestamp().null())
  public updatedAt!: Date
}

// Custom column names
@Timestamp({ createdAt: 'created_at', updatedAt: 'updated_at' })
class Post extends Model {
  @Column(() => Blueprint.timestamp().null())
  public created_at!: Date

  @Column(() => Blueprint.timestamp().null())
  public updated_at!: Date
}
```

### @SoftDelete

Enable soft delete functionality:

```js
import { SoftDelete } from 'tspace-mysql'

@SoftDelete()  // Uses default 'deleted_at' column
class User extends Model {
  @Column(() => Blueprint.timestamp().null())
  public deleted_at!: Date
}

// Custom column name
@SoftDelete('deletedAt')
class Post extends Model {
  @Column(() => Blueprint.timestamp().null())
  public deletedAt!: Date
}
```

### @Pattern

Set naming convention pattern:

```js
import { Pattern } from 'tspace-mysql'

@Pattern('snake_case')  // Convert camelCase to snake_case
class UserProfile extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public userId!: number

  @Column(() => Blueprint.varchar(255).null())
  public firstName!: string  // Becomes first_name
}

@Pattern('camelCase')  // Keep camelCase
class UserData extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public userId!: number

  @Column(() => Blueprint.varchar(255).null())
  public firstName!: string  // Stays firstName
}
```

### @CamelCase / @SnakeCase

Shorthand for pattern decorators:

```js
import { CamelCase, SnakeCase } from 'tspace-mysql'

@CamelCase()
class UserData extends Model {
  // Uses camelCase naming
}

@SnakeCase()
class UserProfiles extends Model {
  // Uses snake_case naming
}
```

## Observer Decorator

### @Observer

Attach an observer class to handle model events:

```js
import { Observer, Model, Column, Blueprint } from 'tspace-mysql'

// Observer class
class UserObserver {
  selected(results: unknown) {
    console.log('User selected:', results)
  }

  created(results: unknown) {
    console.log('User created:', results)
    // Send welcome email
  }

  updated(results: unknown) {
    console.log('User updated:', results)
    // Log changes
  }

  deleted(results: unknown) {
    console.log('User deleted:', results)
    // Cleanup related data
  }
}

@Observer(UserObserver)
class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number
}
```

## Lifecycle Hook Decorators

### @BeforeInsert

Execute before inserting a record:

```js
import { BeforeInsert, Model, Column, Blueprint } from 'tspace-mysql'
import bcrypt from 'bcrypt'

class User extends Model {
  @Column(() => Blueprint.varchar(255).notNull())
  public password!: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }
}
```

### @BeforeUpdate

Execute before updating a record:

```js
import { BeforeUpdate } from 'tspace-mysql'

class User extends Model {
  @Column(() => Blueprint.varchar(255).null())
  public email!: string

  @Column(() => Blueprint.timestamp().null())
  public emailVerifiedAt!: Date | null

  @BeforeUpdate()
  async markEmailUnverified() {
    if (this.emailChanged) {
      this.emailVerifiedAt = null
    }
  }
}
```

### @BeforeRemove

Execute before deleting a record:

```js
import { BeforeRemove } from 'tspace-mysql'

class User extends Model {
  @BeforeRemove()
  async cleanupRelations() {
    // Delete related records before removing user
    await this.deleteRelatedPosts()
  }
}
```

### @AfterInsert

Execute after inserting a record:

```js
import { AfterInsert } from 'tspace-mysql'

class User extends Model {
  @AfterInsert()
  async sendWelcomeEmail() {
    await sendEmail(this.email, 'Welcome!', 'Thanks for joining...')
  }
}
```

### @AfterUpdate

Execute after updating a record:

```js
import { AfterUpdate } from 'tspace-mysql'

class Order extends Model {
  @AfterUpdate()
  async notifyStatusChange() {
    if (this.statusChanged) {
      await notifyCustomer(this.userId, this.status)
    }
  }
}
```

### @AfterRemove

Execute after deleting a record:

```js
import { AfterRemove } from 'tspace-mysql'

class Post extends Model {
  @AfterRemove()
  async logDeletion() {
    await logAudit('post_deleted', { id: this.id })
  }
}
```

### @Hooks

Generic lifecycle hook decorator:

```js
import { Hooks } from 'tspace-mysql'

class User extends Model {
  @Hooks()
  logAction() {
    console.log('Action performed on user:', this.id)
  }
}
```

## Complete Decorator Example

```js
import {
  Model, Table, UUID, Timestamp, SoftDelete, Pattern, Observer,
  Column, Blueprint, Validate, Transform,
  HasMany, BelongsTo,
  BeforeInsert, BeforeUpdate, AfterInsert
} from 'tspace-mysql'
import bcrypt from 'bcrypt'

// Observer class
class UserObserver {
  created(user: any) {
    console.log(`User ${user.email} created!`)
  }
  updated(user: any) {
    console.log(`User ${user.email} updated!`)
  }
}

@UUID()
@Timestamp()
@SoftDelete()
@Pattern('snake_case')
@Table('users')
@Observer(UserObserver)
class User extends Model {
  @Column(() => Blueprint.int().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(50).null())
  public uuid!: string

  @Column(() => Blueprint.varchar(255).notNull())
  @Validate({
    type: String,
    required: true,
    match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    unique: true
  })
  public email!: string

  @Column(() => Blueprint.varchar(255).notNull())
  @Validate({ type: String, required: true, minLength: 2 })
  public name!: string

  @Column(() => Blueprint.varchar(255).notNull())
  @Validate({ type: String, required: true, minLength: 8 })
  public password!: string

  @Column(() => Blueprint.boolean().default(false))
  public verified!: boolean

  @Column(() => Blueprint.json().null())
  @Transform({
    to: (v) => JSON.stringify(v),
    from: (v) => JSON.parse(v)
  })
  public preferences!: Record<string, any>

  @Column(() => Blueprint.timestamp().null())
  public emailVerifiedAt!: Date | null

  @HasMany(() => Post)
  public posts!: Post[]

  @HasMany(() => Comment)
  public comments!: Comment[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10)
  }

  @BeforeUpdate()
  async updateTimestamp() {
    // Custom update logic
  }

  @AfterInsert()
  async sendWelcomeEmail() {
    // Send welcome email after user creation
  }
}
```

## Related Documents

- `00-overview.md` - Library overview
- `01-model-setup.md` - Model definitions
- `03-relations.md` - Model relationships
- `06-type-safety.md` - TypeScript type system
- `99-quickstart.md` - Complete example