# tspace-mysql - Caching Guide

## Overview

tspace-mysql provides built-in caching support for Model queries. It supports three cache drivers: Memory (default), Database, and Redis.

## Cache Configuration

### Setting Cache Driver via Environment

Configure the cache driver in your `.env` file:

```env
# .env
DB_CACHE=memory    # Default - in-memory cache
# DB_CACHE=db      # Database-backed cache
# DB_CACHE=redis   # Redis-backed cache
```

### Redis Configuration

For Redis caching, set the `DB_CACHE` to `redis`. The Redis connection URL is constructed from standard Redis URL format:

```env
DB_CACHE=redis
REDIS_URL=redis://localhost:6379
```

Or for Redis with authentication:

```env
DB_CACHE=redis
REDIS_URL=redis://username:password@localhost:6379/0
```

> **Note**: The library uses the `redis` npm package (version 5.6.0+). Install it with:
> ```bash
> npm install redis@5.6.0 --save
> ```

## Cache Drivers

| Driver | Environment | Use Case |
|--------|-------------|----------|
| `memory` | `DB_CACHE=memory` | Development, single-instance apps (default) |
| `db` | `DB_CACHE=db` | Shared cache without Redis |
| `redis` | `DB_CACHE=redis` | Production, distributed systems |

## Basic Usage

### Using Model.cache() for Queries

The primary way to use cache is with the `.cache()` method on Model queries:

```typescript
import { Model, Blueprint } from 'tspace-mysql'

class User extends Model {
  constructor() {
    super()
    this.useSchema({
      id: Blueprint.int().primary().autoIncrement(),
      name: Blueprint.varchar(255).null(),
    })
  }
}

// Cache a query result
const users = await new User()
  .cache({
    key: 'users:list',           // Cache key
    expires: 1000 * 60,          // Expires in 60 seconds (milliseconds)
    namespace: true              // Add namespace prefix (db:table:key)
  })
  .findMany()

// With namespace enabled, key becomes: 'database:table:users:list'
```

### Cache Options

| Option | Type | Description |
|--------|------|-------------|
| `key` | string | Cache key identifier |
| `expires` | number | TTL in milliseconds |
| `namespace` | boolean | Add database/table prefix to key |

### Deleting Cache

```typescript
// Delete cache by key
await User.cache.delete('users:list', { namespace: true })

// Delete without namespace
await User.cache.delete('users:list')
```

## Cache Patterns

### Cache-Aside Pattern

```typescript
async function getUsers() {
  // Check cache first
  const cached = await User.cache.get('users:list', { namespace: true })
  if (cached) {
    return cached
  }
  
  // Cache miss - fetch from database
  const users = await new User().findMany()
  
  // Store in cache manually if needed
  // (usually the .cache() method handles this automatically)
  
  return users
}
```

### Automatic Caching with Queries

```typescript
// The .cache() method automatically caches query results
const user = await new User()
  .cache({
    key: `user:${id}`,
    expires: 3600000,  // 1 hour
    namespace: true
  })
  .find(id)

// If cache exists, it returns cached result
// If cache doesn't exist, it executes query and caches result
```

### Cache Invalidation

```typescript
// Invalidate cache after update
async function updateUser(id: number, data: Partial<User>) {
  const user = await User.update({ data, where: { id } })
  
  // Delete cached data
  await User.cache.delete(`user:${id}`, { namespace: true })
  
  return user
}

// Invalidate on create
async function createUser(data: UserData) {
  const user = await new User().create(data).save()
  
  // Invalidate list cache
  await User.cache.delete('users:list', { namespace: true })
  
  return user
}
```

## Complete Example

```typescript
import { Model, Blueprint, T } from 'tspace-mysql'

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

class UserService {
  // Get user with caching
  async find(id: number) {
    return await new User()
      .cache({
        key: `user:${id}`,
        expires: 3600000,
        namespace: true
      })
      .find(id)
  }
  
  // Get all users with caching
  async findAll() {
    return await new User()
      .cache({
        key: 'users:all',
        expires: 1800000,  // 30 minutes
        namespace: true
      })
      .findMany()
  }
  
  // Update and invalidate cache
  async update(id: number, data: Partial<UserSchema>) {
    const user = await User.update({ data, where: { id } })
    
    // Invalidate individual cache
    await User.cache.delete(`user:${id}`, { namespace: true })
    // Invalidate list cache
    await User.cache.delete('users:all', { namespace: true })
    
    return user
  }
  
  // Delete and invalidate cache
  async delete(id: number) {
    const result = await User.delete(id)
    
    if (result) {
      await User.cache.delete(`user:${id}`, { namespace: true })
      await User.cache.delete('users:all', { namespace: true })
    }
    
    return result
  }
}
```

## Namespace Option

When `namespace: true` is passed, the key is automatically prefixed:

```typescript
// Without namespace
await User.cache.delete('user:1')  // Key: 'user:1'

// With namespace (recommended)
await User.cache.delete('user:1', { namespace: true })
// Key becomes: '{database_name}:{table_name}:user:1'
// Example: 'myapp:users:user:1'
```

## Notes

- Cache is configured via `DB_CACHE` environment variable, not runtime method
- The `.cache()` method is used on Model query chains
- `Model.cache.delete()` is used to manually delete cache entries
- Memory cache is process-specific (lost on restart)
- Database/Redis cache persists across restarts
- Use namespace to avoid key collisions between different models

## Cache Patterns

### Cache-Aside (Lazy Loading) with Model.cache

```typescript
async function getUser(id: number) {
  const cacheKey = `user:${id}`
  
  // Try cache first with namespace
  const cached = await User.cache.get(cacheKey, { namespace: true })
  if (cached) {
    return cached
  }
  
  // Cache miss - fetch from database
  const user = await new User().find(id)
  
  if (user) {
    // Store in cache for 1 hour
    await User.cache.set(cacheKey, user, 3600000, { namespace: true })
  }
  
  return user
}
```

### Write-Through

```typescript
async function updateUser(id: number, data: Partial<User>) {
  const cacheKey = `user:${id}`
  
  // Update database
  const user = await User.update({ data, where: { id } })
  
  if (user) {
    // Update cache immediately
    await User.cache.set(cacheKey, user, 3600000, { namespace: true })
  } else {
    // Delete from cache if user was deleted
    await User.cache.delete(cacheKey, { namespace: true })
  }
  
  return user
}
```

### Cache Invalidation on Model Operations

```typescript
// Invalidate on create
async function createUser(data: UserData) {
  const user = await new User().create(data).save()
  
  // Invalidate list cache
  await User.cache.delete('users:list', { namespace: true })
  
  return user
}

// Invalidate on update
async function updateUser(id: number, data: Partial<User>) {
  const user = await User.update({ data, where: { id } })
  
  // Invalidate individual and list cache
  await User.cache.delete(`user:${id}`, { namespace: true })
  await User.cache.delete('users:list', { namespace: true })
  
  return user
}

// Invalidate on delete
async function deleteUser(id: number) {
  const result = await User.delete(id)
  
  if (result) {
    await User.cache.delete(`user:${id}`, { namespace: true })
    await User.cache.delete('users:list', { namespace: true })
  }
  
  return result
}
```

## Driver Configuration

Cache driver is set via environment variable `DB_CACHE`. You can also switch drivers at runtime:

```typescript
import { Cache } from 'tspace-mysql'

// Switch driver at runtime (optional)
Cache.driver('memory')  // In-memory
Cache.driver('db')      // Database
Cache.driver('redis')   // Redis
```

## Complete Example: Cached Repository

```typescript
import { Repository, Model, Blueprint, T } from 'tspace-mysql'

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

class CachedUserService {
  private repository = Repository(User)
  private cacheTTL = 3600000  // 1 hour
  
  async find(id: number) {
    const cacheKey = `user:${id}`
    
    // Try cache with namespace
    const cached = await User.cache.get(cacheKey, { namespace: true })
    if (cached) {
      return cached
    }
    
    // Cache miss - fetch from DB
    const user = await this.repository.find(id)
    if (user) {
      await User.cache.set(cacheKey, user, this.cacheTTL, { namespace: true })
    }
    return user
  }
  
  async findMany(options: any = {}) {
    const cacheKey = `users:${JSON.stringify(options)}`
    
    const cached = await User.cache.get(cacheKey, { namespace: true })
    if (cached) {
      return cached
    }
    
    const users = await this.repository.findMany(options)
    await User.cache.set(cacheKey, users, this.cacheTTL / 2, { namespace: true })
    return users
  }
  
  async create(data: Partial<UserSchema>) {
    const user = await this.repository.create({ data })
    
    // Invalidate list cache
    await User.cache.delete('users:list', { namespace: true })
    
    return user
  }
  
  async update(id: number, data: Partial<UserSchema>) {
    const user = await this.repository.update({ data, where: { id } })
    
    if (user) {
      await User.cache.delete(`user:${id}`, { namespace: true })
      await User.cache.delete('users:list', { namespace: true })
    }
    
    return user
  }
  
  async delete(id: number) {
    const result = await this.repository.delete(id)
    
    if (result) {
      await User.cache.delete(`user:${id}`, { namespace: true })
      await User.cache.delete('users:list', { namespace: true })
    }
    
    return result
  }
}
```

## Internal Cache Usage in Model

The Model class uses cache internally for find operations:

```typescript
// Model has internal cache handling for find operations
// When you call find(), it may check cache first based on configuration
const user = await new User().find(1)  // May use cache internally
```

## Best Practices

1. **Use Model.cache with namespace**: Provides automatic key prefixing
2. **Use appropriate TTL**: Shorter for frequently changing data
3. **Invalidate on writes**: Always delete cache when data changes
4. **Use meaningful keys**: Prefix with entity type (e.g., `user:`, `product:`)
5. **Handle cache failures gracefully**: Cache errors don't throw exceptions
6. **Use Redis for production**: Memory cache is for development only
7. **Cache expensive queries**: Results of complex joins, aggregations

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  Model.cache.get() / Cache.get()                        │
├─────────────────────────────────────────────────────────┤
│                    Cache Interface                       │
│  - Error handling (never throws)                         │
│  - Auto-serialization to JSON                            │
│  - TTL support                                           │
│  - Optional namespace prefixing                          │
├─────────────────────────────────────────────────────────┤
│                    Driver Layer                          │
│  MemoryCache │ DBCache │ RedisCache                     │
└─────────────────────────────────────────────────────────┘
```

## Notes

- All cache operations are async
- Values are automatically JSON serialized/deserialized
- Errors are logged but not thrown (fail-safe design)
- Memory cache is per-process (not shared across instances)
- Database cache persists across restarts
- Redis cache is shared across distributed instances
- `Model.cache` provides namespace-aware caching automatically
- Use `{ namespace: true }` option for model-specific cache keys

## Cache Patterns

### Cache-Aside Pattern (Lazy Loading)

```typescript
async function getUser(id: number) {
  const cacheKey = `user:${id}`
  
  // Try to get from cache first
  const cached = await User.cache.get(cacheKey, { namespace: true })
  if (cached) {
    return cached
  }
  
  // Cache miss - fetch from database
  const user = await User.find(id)
  
  if (user) {
    // Store in cache for 1 hour
    await User.cache.set(cacheKey, user, 3600000, { namespace: true })
  }
  
  return user
}
```

### Write-Through Cache

```typescript
async function updateUser(id: number, data: Partial<User>) {
  const cacheKey = `user:${id}`
  
  // Update database
  const user = await User.update({
    data,
    where: { id }
  })
  
  if (user) {
    // Update cache immediately
    await User.cache.set(cacheKey, user, 3600000, { namespace: true })
  } else {
    // Delete from cache if user was deleted
    await User.cache.delete(cacheKey, { namespace: true })
  }
  
  return user
}
```

### Write-Behind Cache

```typescript
async function bulkUpdateUsers(updates: { id: number; data: Partial<User> }[]) {
  const results = []
  
  for (const update of updates) {
    // Update database
    const user = await User.update({
      data: update.data,
      where: { id: update.id }
    })
    
    results.push(user)
    
    // Invalidate cache (will be refreshed on next read)
    await User.cache.delete(`user:${update.id}`, { namespace: true })
  }
  
  return results
}
```

## Cache with Model Queries

### Automatic Caching Helper

```typescript
async function getCachedUser(id: number, ttlMs: number = 3600000) {
  const cacheKey = `user:${id}`
  
  return await User.cache.get(cacheKey, { namespace: true }) 
    ?? await (async () => {
      const user = await User.find(id)
      if (user) {
        await User.cache.set(cacheKey, user, ttlMs, { namespace: true })
      }
      return user
    })()
}
```

### Cache Invalidation on Model Events

```typescript
import { Observer } from 'tspace-mysql'

class UserObserver {
  async created(user: any) {
    // Invalidate list cache when new user created
    await User.cache.delete('users:list', { namespace: true })
  }
  
  async updated(user: any) {
    // Invalidate individual user cache
    await User.cache.delete(`user:${user.id}`, { namespace: true })
    await User.cache.delete('users:list', { namespace: true })
  }
  
  async deleted(user: any) {
    // Invalidate all related caches
    await User.cache.delete(`user:${user.id}`, { namespace: true })
    await User.cache.delete('users:list', { namespace: true })
  }
}

@Observer(UserObserver)
class User extends Model {
  // ... model definition
}
```

## Redis Setup

### Installation

```bash
npm install redis@5.6.0 --save
```

### Configuration

Set in `.env`:
```env
DB_CACHE=redis
REDIS_URL=redis://localhost:6379
```

Or with authentication:
```env
DB_CACHE=redis
REDIS_URL=redis://username:password@localhost:6379/0
```

## Notes

- Memory cache is process-specific (lost on restart)
- Database/Redis cache persists across restarts
- Use namespace to avoid key collisions

## Cache Strategies

### Time-To-Live (TTL)

```typescript
// Short-lived cache (5 minutes)
await User.cache.set('user:1', user, 5 * 60 * 1000, { namespace: true })

// Medium-lived cache (1 hour)
await User.cache.set('user:1', user, 60 * 60 * 1000, { namespace: true })

// Long-lived cache (24 hours)
await User.cache.set('user:1', user, 24 * 60 * 60 * 1000, { namespace: true })
```

### Cache Stampede Prevention

```typescript
async function getUserWithLock(id: number) {
  const cacheKey = `user:${id}`
  
  // Try to get from cache
  const cached = await User.cache.get(cacheKey, { namespace: true })
  if (cached) {
    return cached
  }
  
  // Use a lock key to prevent stampede
  const lockKey = `lock:${cacheKey}`
  const lockExists = await User.cache.exists(lockKey)
  
  if (lockExists) {
    // Wait for lock to be released
    await new Promise(resolve => setTimeout(resolve, 100))
    return await getUserWithLock(id)  // Retry
  }
  
  // Set lock
  await User.cache.set(lockKey, '1', 5000)  // 5 second lock
  
  try {
    // Fetch from database
    const user = await User.find(id)
    
    // Cache the result
    if (user) {
      await User.cache.set(cacheKey, user, 3600000, { namespace: true })
    }
    
    return user
  } finally {
    // Release lock
    await User.cache.delete(lockKey)
  }
}
```

### Tag-Based Cache Invalidation

```typescript
class CacheManager {
  private static tags: Map<string, Set<string>> = new Map()
  
  static async set(key: string, value: any, ttl: number, tags: string[] = []) {
    await User.cache.set(key, value, ttl)
    
    // Register key with tags
    for (const tag of tags) {
      if (!this.tags.has(tag)) {
        this.tags.set(tag, new Set())
      }
      this.tags.get(tag)!.add(key)
    }
  }
  
  static async invalidateTag(tag: string) {
    const keys = this.tags.get(tag)
    if (keys) {
      for (const key of keys) {
        await User.cache.delete(key)
      }
      this.tags.delete(tag)
    }
  }
}

// Usage
await CacheManager.set(
  'user:1',
  userData,
  3600000,
  ['user', 'user:1', 'admin']  // Tags
)

// Invalidate all user caches
await CacheManager.invalidateTag('user')
```

## Complete Example: Cached Repository

```typescript
import { Repository, Model, Blueprint, T } from 'tspace-mysql'

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
    this.useLogger({ selected: false, inserted: true, updated: true, deleted: true })
  }
}

class CachedUserService {
  private repository = Repository(User)
  private cacheTTL = 3600000  // 1 hour
  
  async find(id: number) {
    const cacheKey = `user:${id}`
    
    const cached = await User.cache.get(cacheKey, { namespace: true })
    if (cached) {
      return cached
    }
    
    const user = await this.repository.find(id)
    if (user) {
      await User.cache.set(cacheKey, user, this.cacheTTL, { namespace: true })
    }
    return user
  }
  
  async findMany(options: any = {}) {
    const cacheKey = `users:${JSON.stringify(options)}`
    
    const cached = await User.cache.get(cacheKey, { namespace: true })
    if (cached) {
      return cached
    }
    
    const users = await this.repository.findMany(options)
    await User.cache.set(cacheKey, users, this.cacheTTL / 2, { namespace: true })  // Shorter TTL for lists
    return users
  }
  
  async create(data: Partial<UserSchema>) {
    const user = await this.repository.create({ data })
    
    // Invalidate list cache
    await User.cache.delete('users:', { namespace: true })
    
    return user
  }
  
  async update(id: number, data: Partial<UserSchema>) {
    const user = await this.repository.update({ data, where: { id } })
    
    // Invalidate individual cache
    if (user) {
      await User.cache.delete(`user:${id}`, { namespace: true })
      await User.cache.delete('users:', { namespace: true })
    }
    
    return user
  }
  
  async delete(id: number) {
    const result = await this.repository.delete(id)
    
    // Invalidate cache
    if (result) {
      await User.cache.delete(`user:${id}`, { namespace: true })
      await User.cache.delete('users:', { namespace: true })
    }
    
    return result
  }
}
```

## Best Practices

1. **Use appropriate TTL**: Shorter TTL for frequently changing data
2. **Invalidate on writes**: Always invalidate cache when data changes
3. **Use namespaces**: Separate cache by model/type
4. **Monitor cache hit rate**: Track effectiveness
5. **Handle cache failures gracefully**: Don't let cache errors break your app
6. **Consider cache size**: Implement LRU eviction for memory cache
7. **Use Redis for distributed systems**: Share cache across instances

## Related Documents

- `00-overview.md` - Library overview
- `04-repository.md` - Repository pattern
- `09-queue.md` - Queue system
- `07-transactions.md` - Database transactions