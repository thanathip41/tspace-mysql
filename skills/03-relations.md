# tspace-mysql - Model Relationships Guide

## Overview

tspace-mysql supports four types of model relationships:
- **HasOne** - One-to-one relationship
- **HasMany** - One-to-many relationship
- **BelongsTo** - Inverse of has-many
- **BelongsToMany** - Many-to-many relationship with pivot table

## Defining Relationships

### HasOne (One-to-One)

The `HasOne` relationship indicates that each model instance has exactly one related instance.

```typescript
import { Model, Blueprint, HasOne, T } from 'tspace-mysql'

class Profile extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      user_id: Blueprint.int().foreign({ on: 'User', references: 'id' }),
      bio: Blueprint.text().null(),
      avatar: Blueprint.varchar(255).null(),
    })
  }
}

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).null(),
      email: Blueprint.varchar(255).null(),
    })
    
    // Define HasOne relationship
    this.hasOne({ model: Profile, name: 'profile' })
  }
}

// Usage
const user = await User.find(1, {
  relations: ['profile']
})
console.log(user?.profile?.bio)
```

### HasMany (One-to-Many)

The `HasMany` relationship indicates that each model instance can have many related instances.

```typescript
import { Model, Blueprint, HasMany, T } from 'tspace-mysql'

class Post extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      user_id: Blueprint.int().foreign({ on: 'User', references: 'id' }),
      title: Blueprint.varchar(255).null(),
      content: Blueprint.text().null(),
    })
  }
}

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).null(),
    })
    
    // Define HasMany relationship
    this.hasMany({ model: Post, name: 'posts' })
  }
}

// Usage
const user = await User.find(1, {
  relations: ['posts']
})
console.log(user?.posts) // Array of Post objects
```

### BelongsTo (Inverse of HasMany)

The `BelongsTo` relationship is the inverse of `HasMany`, indicating that the model belongs to another model.

```typescript
import { Model, Blueprint, BelongsTo, T } from 'tspace-mysql'

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).null(),
    })
  }
}

class Post extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      user_id: Blueprint.int().foreign({ on: 'User', references: 'id' }),
      title: Blueprint.varchar(255).null(),
    })
    
    // Define BelongsTo relationship
    this.belongsTo({ model: User, name: 'author' })
  }
}

// Usage
const post = await Post.find(1, {
  relations: ['author']
})
console.log(post?.author?.name)
```

### BelongsToMany (Many-to-Many)

The `BelongsToMany` relationship requires a pivot table to connect two models.

```typescript
import { Model, Blueprint, BelongsToMany, T } from 'tspace-mysql'

class Role extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(50).null(),
    })
  }
}

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).null(),
    })
    
    // Define BelongsToMany relationship
    this.belongsToMany({
      model: Role,
      name: 'roles',
      pivotTable: 'user_roles',           // Optional: defaults to role_user
      localKey: 'user_id',                // Optional: defaults to user_id
      foreignKey: 'role_id',              // Optional: defaults to role_id
    })
  }
}

class Role extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(50).null(),
    })
    
    // Inverse relationship
    this.belongsToMany({
      model: User,
      name: 'users',
      pivotTable: 'user_roles',
    })
  }
}

// Usage
const user = await User.find(1, {
  relations: ['roles']
})
console.log(user?.roles) // Array of Role objects
```

## Querying Relations

### With Relations (Eager Loading)

```typescript
// Load single relation
const user = await User.find(1, {
  relations: ['posts']
})

// Load multiple relations
const user = await User.find(1, {
  relations: ['posts', 'profile', 'roles']
})

// Nested relations
const user = await User.find(1, {
  relations: ['posts.comments.author']
})
```

### Relation Exists

Check if related records exist without loading them.

```typescript
// Check if user has any posts
const hasPosts = await User.exists(1, {
  relationExists: ['posts']
})

// Check multiple relations
const user = await User.findOne({
  where: { id: 1 },
  relationExists: ['posts', 'profile']
})
```

### Relation Count

Add count of related records to the result.

```typescript
const user = await User.find(1, {
  relationCount: ['posts', 'comments']
})
// Result includes posts_count, comments_count properties
```

### Relation Query with Conditions

Filter relations based on conditions.

```typescript
const user = await User.find(1, {
  relations: ['posts'],
  relationQuery: {
    posts: (query) => query.where('status', 'published').orderBy('created_at', 'desc')
  }
})
```

### Deeply Nested Relations

```typescript
// Load user -> posts -> comments -> author
const user = await User.find(1, {
  relations: ['posts.comments.author']
})

// With conditions on nested relations
const user = await User.find(1, {
  relations: ['posts.comments'],
  relationQuery: {
    posts: (q) => q.where('published', true),
    'posts.comments': (q) => q.where('approved', true)
  }
})
```

## Relation Options

### Custom Foreign Keys

```typescript
class Post extends Model {
  constructor() {
    super()
    this.belongsTo({
      model: User,
      name: 'author',
      foreignKey: 'author_id',    // Custom foreign key column
      localKey: 'id',             // Custom local key column
    })
  }
}
```

### Custom Pivot Table Configuration

```typescript
class User extends Model {
  constructor() {
    super()
    this.belongsToMany({
      model: Role,
      name: 'roles',
      pivotTable: 'user_role_assignments',  // Custom pivot table name
      localKey: 'user_id',                  // Foreign key in pivot for this model
      foreignKey: 'role_id',                // Foreign key in pivot for related model
    })
  }
}
```

## Type-Safe Relations

### Using T.Relation Type

```typescript
import { Model, Blueprint, T } from 'tspace-mysql'

class Post extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      title: Blueprint.varchar(255).null(),
    })
  }
}

const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).null(),
}

type UserSchema = T.Schema<typeof userSchema>
type UserRelations = T.Relation<{
  posts: Post[]
  profile: Profile | null
}>

class User extends Model<UserSchema, UserRelations> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.hasMany({ model: Post, name: 'posts' })
    this.hasOne({ model: Profile, name: 'profile' })
  }
}

// Full type inference
const user = await User.find(1, {
  select: { id: true, name: true },
  relations: ['posts']
})
// Type: { id: number, name: string | null, posts: Post[] }
```

## Relation Methods on Model Instance

### Check Relation Exists

```typescript
const user = await new User().find(1)
const hasPosts = await user?.relation('posts').exists()
```

### Load Relation on Existing Model

```typescript
const user = await new User().find(1)
await user?.load('posts')
console.log(user?.posts)
```

### Load Multiple Relations

```typescript
const user = await new User().find(1)
await user?.load(['posts', 'profile', 'roles'])
```

## Relation with Soft Deletes

By default, soft-deleted related records are excluded. Use `withTrashed` to include them.

```typescript
const user = await User.find(1, {
  relations: ['posts'],
  relationQuery: {
    posts: (query) => query.withTrashed()  // Include soft-deleted posts
  }
})
```

## Relation Trashed Check

Check if related records have been soft-deleted.

```typescript
const user = await User.find(1, {
  relationTrashed: ['posts']  // Checks if any posts are soft-deleted
})
```

## Built-in Relation Functions

### Attach Related Records

```typescript
// Attach a post to a user
const user = await User.find(1)
await user?.relation('posts').attach({
  title: 'New Post',
  content: 'Post content'
})
```

### Detach Related Records

```typescript
// Remove relation (without deleting)
await user?.relation('posts').detach(postId)

// Detach all
await user?.relation('posts').detach()
```

### Sync Relations (BelongsToMany)

```typescript
// Sync role assignments (attaches missing, detaches removed)
await user?.relation('roles').sync([1, 2, 3])

// Sync with pivot data
await user?.relation('roles').sync([1, 2, 3], {
  assigned_at: new Date()
})
```

### Toggle Relations

```typescript
// Toggle role assignment
await user?.relation('roles').toggle([1, 2, 3])
```

## Join Model Relations

Use join clauses directly in model queries.

```typescript
const users = await new User()
  .join('users.id', 'posts.user_id')
  .select('users.*', 'posts.title as post_title')
  .findMany()
```

## Complete Example

```typescript
import { Model, Blueprint, T, HasMany, BelongsTo, BelongsToMany } from 'tspace-mysql'

// User Model
const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).null(),
  email: Blueprint.varchar(255).unique().notNull(),
}

type UserSchema = T.Schema<typeof userSchema>

class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.hasMany({ model: Post, name: 'posts' })
    this.hasOne({ model: Profile, name: 'profile' })
    this.belongsToMany({ model: Role, name: 'roles', pivotTable: 'user_roles' })
  }
}

// Post Model
const postSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  user_id: Blueprint.int().foreign({ on: User }).null(),
  title: Blueprint.varchar(255).notNull(),
  content: Blueprint.text().null(),
  status: Blueprint.enum('draft', 'published').default('draft'),
}

type PostSchema = T.Schema<typeof postSchema>

class Post extends Model<PostSchema> {
  constructor() {
    super()
    this.useSchema(postSchema)
    this.belongsTo({ model: User, name: 'author' })
    this.hasMany({ model: Comment, name: 'comments' })
  }
}

// Comment Model
class Comment extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      post_id: Blueprint.int().foreign({ on: Post }).null(),
      user_id: Blueprint.int().foreign({ on: User }).null(),
      content: Blueprint.text().null(),
    })
    this.belongsTo({ model: Post, name: 'post' })
    this.belongsTo({ model: User, name: 'author' })
  }
}

// Profile Model
class Profile extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      user_id: Blueprint.int().foreign({ on: User }).unique(),
      bio: Blueprint.text().null(),
      avatar: Blueprint.varchar(255).null(),
    })
    this.belongsTo({ model: User, name: 'user' })
  }
}

// Role Model
class Role extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(50).notNull(),
    })
    this.belongsToMany({ model: User, name: 'users', pivotTable: 'user_roles' })
  }
}

// Usage Examples

// Get user with all relations
const user = await User.find(1, {
  relations: ['posts.comments.author', 'profile', 'roles'],
  relationQuery: {
    posts: (q) => q.where('status', 'published').orderBy('created_at', 'desc')
  }
})

// Get posts with author
const posts = await Post.findMany({
  relations: ['author'],
  where: { status: 'published' }
})

// Get users with specific role
const adminUsers = await User.findMany({
  relations: ['roles'],
  whereQuery: (q) => q.whereJSON('roles', { key: 'name', value: 'admin' })
})
```

## Related Documents

- `00-overview.md` - Library overview
- `01-model-setup.md` - Model definitions
- `02-query-builder.md` - Query builder usage
- `04-repository.md` - Repository pattern
- `06-type-safety.md` - TypeScript type system