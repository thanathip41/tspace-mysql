# 🚀 Start Here - Quick Start Guide

**New to tspace-mysql? Read this first!**

## ⚡ 5-Minute Setup

### Step 1: Install
```bash
npm install tspace-mysql
```

### Step 2: Configure `.env`
```env
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database
```

### Step 3: Import in Entry File
```typescript
// main.ts or index.ts
import 'reflect-metadata'  // MUST be first!
import { DB, Model, Blueprint, T, Repository } from 'tspace-mysql'

// Initialize database
DB.initialize()
```

### Step 4: Create Your First Model
```typescript
const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  email: Blueprint.varchar(255).notNull(),
  name: Blueprint.varchar(255).null(),
  created_at: Blueprint.timestamp().null(),
  updated_at: Blueprint.timestamp().null(),
}
type UserSchema = T.Schema<typeof userSchema>

class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.useTimestamp()
  }
}
```

### Step 5: Use Repository for CRUD
```typescript
const userRepository = Repository(User)

// Create
const user = await userRepository.create({
  data: { email: 'test@example.com', name: 'John' }
})

// Find
const found = await userRepository.find(1)

// Update
await userRepository.update({
  data: { name: 'Jane' },
  where: { id: 1 }
})

// Delete
await userRepository.delete(1)

// Find Many
const users = await userRepository.findMany({
  where: { email: { like: '%@example.com' } },
  limit: 10
})
```

## 📚 Next Steps

| I want to... | Read this |
|-------------|-----------|
| Understand the library | [`00-overview.md`](./00-overview.md) |
| Define more models | [`01-model-setup.md`](./01-model-setup.md) |
| Write queries | [`02-query-builder.md`](./02-query-builder.md) |
| Set up relations | [`03-relations.md`](./03-relations.md) |
| See complete example | [`99-quickstart.md`](./99-quickstart.md) |
| Fix common errors | [`11-troubleshooting.md`](./11-troubleshooting.md) |

## ⚠️ Common Mistakes to Avoid

### 1. Missing reflect-metadata
```typescript
// ❌ WRONG - Will fail!
import { Model } from 'tspace-mysql'

// ✅ CORRECT
import 'reflect-metadata'  // First!
import { Model } from 'tspace-mysql'
```

### 2. Wrong Relations Syntax
```typescript
// ❌ WRONG - Array syntax doesn't work
relations: ['posts', 'profile']

// ✅ CORRECT - Object syntax
relations: { posts: true, profile: true }
```

### 3. Wrong Repository Usage
```typescript
// ❌ WRONG - Don't instantiate as class
const repo = new Repository(User)

// ✅ CORRECT - Call as function
const repo = Repository(User)
```

### 4. Missing await
```typescript
// ❌ WRONG - Returns Promise, not value
const user = userRepository.find(1)

// ✅ CORRECT - All DB operations are async
const user = await userRepository.find(1)
```

### 5. Wrong Cache Method
```typescript
// ❌ WRONG - Don't set driver in code!
Cache.provider('redis')
Cache.driver('redis')

// ✅ CORRECT - Configure in .env only
// .env
DB_CACHE=redis         # memory, db, or redis
REDIS_URL=redis://localhost:6379
```

## 🎯 Quick Reference

### Model Methods
```typescript
User.find(1)                          // Find by ID
User.findOne({ where: { email: '...' } })  // Find one
User.findMany({ where: {...} })       // Find many
User.create({ data: {...} })          // Create
```

### Repository Methods
```typescript
repo.find(1)                          // Find by ID
repo.findOne({ where: {...} })        // Find one
repo.findMany({ where: {...} })       // Find many
repo.paginate({ page: 1, limit: 10 }) // Paginate
repo.create({ data: {...} })          // Create
repo.update({ data: {...}, where: {...} }) // Update
repo.delete(1)                        // Delete
```

### Relations
```typescript
// Always use object syntax
relations: { posts: true }
relations: { posts: true, profile: true }
relations: { 
  posts: { 
    relations: { 
      comments: true 
    } 
  } 
}
```

### Cache
```typescript
// 1. Configure in .env (automatic - do this once!)
// .env
DB_CACHE=memory        # Default (memory, db, or redis)

// 2. Cache a query
const users = await new User()
  .cache({
    key: 'users:list',
    expires: 3600000,   // 1 hour (in milliseconds!)
    namespace: true     // Prefixes with db:table
  })
  .findMany()

// 3. Delete cache
await User.cache.delete('users:list', { namespace: true })

// ⚠️ IMPORTANT:
// - Cache driver is loaded from .env automatically
// - Do NOT call Cache.driver() in your code
// - expires is in MILLISECONDS (3600000 = 1 hour)
// - Restart app after changing DB_CACHE in .env
```

### Transactions
```typescript
// Auto-managed (recommended)
const result = await DB.transaction(async (conn) => {
  await conn.query('INSERT ...')
  return userId
})

// Manual control
const trx = await DB.beginTransaction()
try {
  await new User().bind(trx).create(data).save()
  await trx.commit()
} catch (e) {
  await trx.rollback()
  throw e
} finally {
  await trx.end()
}
```

## 🆘 Need Help?

- **Common errors**: See [`11-troubleshooting.md`](./11-troubleshooting.md)
- **Full examples**: See [`99-quickstart.md`](./99-quickstart.md)
- **API details**: See topic-specific files (01-10)

---

**Ready?** Let's build something amazing! 🚀

**Last Updated**: 2026-03  
**Status**: ✅ 100% Verified Against Source Code v1.9.2+