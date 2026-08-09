# tspace-mysql - Type Safety Guide

## Overview

tspace-mysql provides comprehensive TypeScript type safety for all database operations. The `T` namespace contains utility types that ensure type correctness for schema definitions, relations, queries, and results.

## Importing Types

```typescript
import { Model, Blueprint, T } from 'tspace-mysql'
```

## Schema Types

### T.Schema

Extract TypeScript type from a Blueprint schema:

```typescript
import { Model, Blueprint, T } from 'tspace-mysql'

const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).null(),
  email: Blueprint.varchar(255).notNull(),
  age: Blueprint.int().null(),
  verified: Blueprint.boolean().default(false),
}

// Extract type from schema
type UserSchema = T.Schema<typeof userSchema>
// Result: {
//   id: number,
//   name: string | null,
//   email: string,
//   age: number | null,
//   verified: boolean | T.Default<boolean>
// }

class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
  }
}
```

### T.SchemaModel

Get schema type from a Model class:

```typescript
import { T } from 'tspace-mysql'

class User extends Model { /* ... */ }

type UserSchemaType = T.SchemaModel<User>
// Returns the schema type defined in User model
```

### T.Relation

Define relationship types:

```typescript
import { Model, Blueprint, T } from 'tspace-mysql'

class Post extends Model { /* ... */ }
class Profile extends Model { /* ... */ }

type UserRelations = T.Relation<{
  posts: Post[]
  profile: Profile | null
}>
// Result includes both direct and $prefixed relations:
// {
//   posts: Post[],
//   profile: Profile | null,
//   $posts: { posts: Post[] },
//   $profile: { profile: Profile | null }
// }
```

### T.RelationModel

Get relation type from a Model class:

```typescript
import { T } from 'tspace-mysql'

class User extends Model {
  constructor() {
    super()
    this.hasMany({ model: Post, name: 'posts' })
  }
}

type UserRelationType = T.RelationModel<User>
// Returns: { posts: Post[] }
```

## Result Types

### T.Result

Get full result type from a Model:

```typescript
import { T } from 'tspace-mysql'

class User extends Model<UserSchema> { /* ... */ }

type UserResult = T.Result<User>
// Full result including schema and relations
```

### T.ResultFiltered

Get filtered result type based on select/relation options:

```typescript
import { T } from 'tspace-mysql'

class User extends Model<UserSchema> { /* ... */ }

// Type when selecting specific columns
type UserSelected = T.ResultFiltered<
  User,
  { id: true; name: true },  // Select
  { posts: true },           // Relations
  undefined,                 // Except
  undefined                  // Raw select
>
// Result: { id: number, name: string | null, posts: Post[] }
```

### T.PaginateResult

Get pagination result type:

```typescript
import { T } from 'tspace-mysql'

class User extends Model<UserSchema> { /* ... */ }

type UserPaginateResult = T.PaginateResult<User>
// Result: {
//   meta: {
//     total: number,
//     limit: number,
//     total_page: number,
//     current_page: number,
//     last_page: number,
//     next_page: number | null,
//     prev_page: number | null
//   },
//   data: UserResult[]
// }
```

### T.PaginateResultFiltered

Get filtered pagination result type:

```typescript
import { T } from 'tspace-mysql'

type UserPaginateFiltered = T.PaginateResultFiltered<
  User,
  {},                          // Select options
  { id: true; name: true },    // Selected columns
  { posts: true }              // Relations
>
```

## Column Types

### T.ColumnKeys

Get all valid column keys for a model:

```typescript
import { T } from 'tspace-mysql'

class User extends Model<UserSchema> { /* ... */ }

type UserColumns = T.ColumnKeys<User>
// Result: 'id' | 'name' | 'email' | 'age' | 'verified' | `${string}.${string}`
```

### T.Columns

Get columns type with their value types:

```typescript
import { T } from 'tspace-mysql'

type UserColumnTypes = T.Columns<User>
// Result: {
//   id: number,
//   name: string | null,
//   email: string,
//   age: number | null,
//   verified: boolean
// }

// With InputQuery option (includes operators)
type UserColumnTypesWithQuery = T.Columns<User, { InputQuery: true }>
// Result includes TOperatorQuery, TRawStringQuery, TFreezeStringQuery
```

### T.ColumnValue

Get specific column value type:

```typescript
import { T } from 'tspace-mysql'

type NameType = T.ColumnValue<User, 'name'>
// Result: string | null
```

### T.ColumnEnumKeys

Get enum column keys:

```typescript
import { T } from 'tspace-mysql'

const userSchema = {
  role: Blueprint.enum('admin', 'user', 'guest').default('user'),
  status: Blueprint.enum('active', 'inactive').default('active')
}

type UserEnumColumns = T.ColumnEnumKeys<User>
// Result: 'role' | 'status'
```

### T.ColumnEnumMap

Get enum columns with their values:

```typescript
import { T } from 'tspace-mysql'

type UserEnumMap = T.ColumnEnumMap<User>
// Result: {
//   role: 'admin' | 'user' | 'guest',
//   status: 'active' | 'inactive'
// }
```

## Relation Types

### T.RelationKeys

Get all valid relation keys:

```typescript
import { T } from 'tspace-mysql'

class User extends Model {
  constructor() {
    super()
    this.hasMany({ model: Post, name: 'posts' })
    this.hasOne({ model: Profile, name: 'profile' })
  }
}

type UserRelationKeys = T.RelationKeys<User>
// Result: 'posts' | 'profile'
```

### T.Relations

Get full relations type:

```typescript
import { T } from 'tspace-mysql'

type UserRelations = T.Relations<User>
// Returns the full relation type definition
```

## Query Option Types

### T.WhereOptions

Type for where conditions:

```typescript
import { T, OP } from 'tspace-mysql'

type UserWhere = T.WhereOptions<User>
// Can be used as:
const where: UserWhere = {
  id: OP.gt(1),
  name: OP.like('%john%'),
  status: OP.in(['active', 'pending']),
  email: OP.notNull()
}
```

### T.SelectOptions

Type for select conditions:

```typescript
import { T } from 'tspace-mysql'

type UserSelect = T.SelectOptions<User>
// Can be used as:
const select: UserSelect = {
  id: true,
  name: true,
  email: true
}
```

### T.ExceptOptions

Type for except (omit) conditions:

```typescript
import { T } from 'tspace-mysql'

type UserExcept = T.ExceptOptions<User>
// Can be used as:
const except: UserExcept = {
  password: true,
  deleted_at: true
}
```

### T.OrderByOptions

Type for order by conditions:

```typescript
import { T } from 'tspace-mysql'

type UserOrderBy = T.OrderByOptions<User>
// Can be used as:
const orderBy: UserOrderBy = [
  ['created_at', 'desc'],
  ['name', 'asc']
]
```

### T.GroupByOptions

Type for group by conditions:

```typescript
import { T } from 'tspace-mysql'

type UserGroupBy = T.GroupByOptions<User>
// Can be used as:
const groupBy: UserGroupBy = ['status', 'role']
```

### T.RelationOptions

Type for relation options:

```typescript
import { T } from 'tspace-mysql'

type UserRelationOpts = T.RelationOptions<User>
// Can be used as:
const relations: UserRelationOpts = {
  posts: true,
  profile: true
}
```

### T.RepositoryOptions

Full repository query options type:

```typescript
import { T } from 'tspace-mysql'

type UserQueryOptions = T.RepositoryOptions<User>
// Complete options type including:
// - select, except, orderBy, groupBy, having
// - limit, offset, where, whereRaw, whereQuery
// - when, join, leftJoin, rightJoin
// - relations, relationExists, relationQuery
// - debug
```

## CRUD Operation Types

### T.RepositoryCreate

Type for create operation:

```typescript
import { T } from 'tspace-mysql'

type UserCreate = T.RepositoryCreate<User>
// {
//   data: T.InsertInput<User, T.Columns<User>>,
//   debug?: boolean,
//   transaction?: TConnection,
//   noReturn?: boolean
// }
```

### T.RepositoryCreateMultiple

Type for create many operation:

```typescript
import { T } from 'tspace-mysql'

type UserCreateMany = T.RepositoryCreateMultiple<User>
// {
//   data: T.InsertInput<User, T.Columns<User>>[],
//   debug?: boolean,
//   transaction?: TConnection,
//   noReturn?: boolean
// }
```

### T.RepositoryUpdate

Type for update operation:

```typescript
import { T } from 'tspace-mysql'

type UserUpdate = T.RepositoryUpdate<User>
// {
//   data: T.UpdateInput<User, T.Columns<User>>,
//   where: T.WhereOptions<User>,
//   debug?: boolean,
//   transaction?: TConnection,
//   noReturn?: boolean
// }
```

### T.RepositoryUpdateMultiple

Type for update many operation:

```typescript
import { T } from 'tspace-mysql'

type UserUpdateMany = T.RepositoryUpdateMultiple<User>
```

### T.RepositoryCreateOrThings

Type for createOrUpdate, createNotExists, createOrSelect:

```typescript
import { T } from 'tspace-mysql'

type UserUpsert = T.RepositoryCreateOrThings<User>
// {
//   data: T.InsertOrUpdateInput<User, T.Columns<User>>,
//   where: T.WhereOptions<User>,
//   debug?: boolean,
//   transaction?: TConnection,
//   noReturn?: boolean
// }
```

### T.RepositoryDelete

Type for delete operation:

```typescript
import { T } from 'tspace-mysql'

type UserDelete = T.RepositoryDelete<User>
```

## Insert/Update Input Types

### T.InsertInput

Type for insert input with conflict checking:

```typescript
import { T } from 'tspace-mysql'

// Required columns for insert
type UserInsertInput = T.InsertInput<User, T.Columns<User>>
```

### T.UpdateInput

Type for update input:

```typescript
import { T } from 'tspace-mysql'

// All columns are optional for update
type UserUpdateInput = T.UpdateInput<User, T.Columns<User>>
```

### T.InsertOrUpdateInput

Type for upsert input:

```typescript
import { T } from 'tspace-mysql'

type UserUpsertInput = T.InsertOrUpdateInput<User, T.Columns<User>>
```

### T.NoConflict

Check for duplicate keys between two arrays:

```typescript
import { T } from 'tspace-mysql'

// Returns error type if there are conflicting keys
type ConflictCheck = T.NoConflict<['id', 'name'], ['name', 'email']>
// Result: { ERROR_DUPLICATE_KEYS: 'name' }
```

## Result Types for Operations

### T.InsertResult

Type for insert result:

```typescript
import { T } from 'tspace-mysql'

type UserInsertResult = T.InsertResult<User>
// Same as T.Result<User>
```

### T.InsertManyResult

Type for insert many result:

```typescript
import { T } from 'tspace-mysql'

type UserInsertManyResult = T.InsertManyResult<User>
// T.Result<User>[]
```

### T.InsertNotExistsResult

Type for createNotExists result:

```typescript
import { T } from 'tspace-mysql'

type UserInsertNotExistsResult = T.InsertNotExistsResult<User>
// T.Result<User> | null
```

### T.UpdateResult

Type for update result:

```typescript
import { T } from 'tspace-mysql'

type UserUpdateResult = T.UpdateResult<User>
// T.Result<User> | null
```

### T.UpdateManyResult

Type for update many result:

```typescript
import { T } from 'tspace-mysql'

type UserUpdateManyResult = T.UpdateManyResult<User>
// T.Result<User>[]
```

### T.DeleteResult

Type for delete result:

```typescript
import { T } from 'tspace-mysql'

type UserDeleteResult = T.DeleteResult
// boolean
```

## Advanced Type Utilities

### T.ZodShapeCreate

Generate Zod schema shape for create operations:

```typescript
import { T } from 'tspace-mysql'
import { z } from 'zod'

type UserCreateShape = T.ZodShapeCreate<User>
// Can be used to create Zod schema for validation
```

### T.ZodShapeUpdate

Generate Zod schema shape for update operations:

```typescript
import { T } from 'tspace-mysql'

type UserUpdateShape = T.ZodShapeUpdate<User>
// All fields optional except read-only fields
```

### T.BlueprintToZod

Convert Blueprint type to Zod type:

```typescript
import { T } from 'tspace-mysql'

type NumberToZod = T.BlueprintToZod<number>
// z.ZodNumber

type StringToZod = T.BlueprintToZod<string>
// z.ZodString
```

### T.Raw

Raw query type with operators:

```typescript
import { T } from 'tspace-mysql'

type UserRawQuery = T.Raw<User>
// Each column can be value, operator, or raw string query
```

### T.QueryModifier

Type for query modifier callbacks:

```typescript
import { T } from 'tspace-mysql'

type UserQueryModifier = T.QueryModifier<User>
// (query: User) => User
```

### T.Default

Type for default values:

```typescript
import { T } from 'tspace-mysql'

type DefaultBoolean = T.Default<boolean>
// Used for columns with default values
```

## Complete Type-Safe Example

```typescript
import { Model, Blueprint, T, Repository, OP } from 'tspace-mysql'

// Schema definition
const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null(),
  email: Blueprint.varchar(255).notNull(),
  name: Blueprint.varchar(255).null(),
  role: Blueprint.enum('admin', 'user', 'guest').default('user'),
  status: Blueprint.enum('active', 'inactive', 'pending').default('pending'),
  created_at: Blueprint.timestamp().null(),
  updated_at: Blueprint.timestamp().null(),
}

type UserSchema = T.Schema<typeof userSchema>

// Model with full type safety
class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.useTimestamp()
    this.hasMany({ model: Post, name: 'posts' })
  }
}

// Type-safe repository
const userRepository = Repository(User)

// Type-safe queries
async function getUser(id: number) {
  // Full type inference
  return await userRepository.find(id, {
    select: { id: true, email: true, name: true },
    relations: ['posts']
  })
  // Return type: { id: number, email: string, name: string | null, posts: Post[] } | null
}

async function searchUsers(emailPattern: string) {
  return await userRepository.findMany({
    where: {
      email: OP.like(`%${emailPattern}%`),
      status: OP.in(['active', 'pending'] as const)
    },
    orderBy: [['created_at', 'desc']],
    limit: 10
  })
}

async function createUser(data: { email: string; name?: string }) {
  // Type-checked insert data
  return await userRepository.create({
    data: {
      email: data.email,
      name: data.name ?? null,
      role: 'user' as const
    }
  })
}

async function updateUser(id: number, data: Partial<UserSchema>) {
  // Type-checked update data
  return await userRepository.update({
    data,
    where: { id }
  })
}

// Type-safe pagination
async function getUsers(page: number, limit: number) {
  return await userRepository.paginate({
    page,
    limit,
    where: { status: 'active' },
    orderBy: [['created_at', 'desc']]
  })
  // Return type: T.PaginateResult<User>
}
```

## Type-Safe Generic Service Pattern

```typescript
import { Model, T, Repository } from 'tspace-mysql'

// Generic service with type safety
class BaseService<M extends Model> {
  protected repository: ReturnType<typeof Repository<M>>

  constructor(model: new () => M) {
    this.repository = Repository(model)
  }

  async find(id: number) {
    return await this.repository.find(id)
  }

  async findAll() {
    return await this.repository.findMany()
  }
}

// Specific service with full type safety
class UserService extends BaseService<User> {
  constructor() {
    super(User)
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email }
    })
  }
}
```

## Related Documents

- `00-overview.md` - Library overview
- `01-model-setup.md` - Model definitions
- `03-relations.md` - Model relationships
- `04-repository.md` - Repository pattern
- `05-decorators.md` - Decorator patterns