# 🔧 Troubleshooting & Common Errors

## Quick Fixes

### Error: "reflect-metadata is not defined"

**Cause:** Missing reflect-metadata import

**Solution:**
```typescript
// Add to the TOP of your entry file (main.ts, index.ts, app.ts)
import 'reflect-metadata'

// Then import tspace-mysql
import { Model, DB } from 'tspace-mysql'
```

---

### Error: "Repository is not a constructor"

**Cause:** Trying to instantiate Repository as a class

**Solution:**
```typescript
// ❌ WRONG
const repo = new Repository(User)

// ✅ CORRECT
const repo = Repository(User)  // Call as function
```

---

### Error: "Cache.provider is not a function"

**Cause:** Using wrong method name

**Solution:**
```typescript
// ❌ WRONG
// ✅ CORRECT - Configure in .env file (automatic!)
// .env
DB_CACHE=db   # Options: memory, db, redis

```

---

### Error: "Promise { <pending> }" or getting Promise object instead of value

**Cause:** Missing `await` keyword

**Solution:**
```typescript
// ❌ WRONG - Missing await
const user = userRepository.find(1)

// ✅ CORRECT - All DB operations are async
const user = await userRepository.find(1)
```

**Remember:** ALL database/cache/queue operations are async!
- `find()` → `await find()`
- `create()` → `await create()`
- `update()` → `await update()`
- `delete()` → `await delete()`

---

### Error: "Cannot read property of undefined" with relations

**Cause:** Relations not loaded or wrong syntax

**Solution:**
```typescript
// ❌ WRONG - Array syntax doesn't work
const user = await User.find(1, {
  relations: ['posts']  // WRONG!
})

// ✅ CORRECT - Object syntax
const user = await User.find(1, {
  relations: { posts: true }  // CORRECT!
})

// Then access safely
console.log(user?.posts)  // Use optional chaining
```

---

### Error: "Cache not working" or "Cache always returns null"

**Cause:** Cache not configured properly in `.env` or key mismatch

**Solution:**

1. **Check .env configuration:**
```env
# For memory cache (default - no config needed)
DB_CACHE=memory

# For database cache
DB_CACHE=db

# For Redis cache
DB_CACHE=redis
REDIS_URL=redis://localhost:6379

# With authentication:
REDIS_URL=redis://username:password@localhost:6379/0
```

2. **Restart application after changing .env:**
```bash
# Cache driver is loaded on initialization
# You must restart your app after changing DB_CACHE
npm run dev  # or restart your server
```

3. **Use correct cache methods:**
```typescript
// ✅ CORRECT - Using Model.cache() for queries
const users = await new User()
  .cache({
    key: 'users:list',
    expires: 3600000,  // milliseconds (1 hour)
    namespace: true    // Adds db:table prefix
  })
  .findMany()

// ✅ CORRECT - Using Cache directly
await Cache.set('my:key', data, 3600000)
const data = await Cache.get('my:key')
await Cache.delete('my:key')
```

4. **Common cache mistakes:**
```typescript
// ❌ WRONG - Expires is in milliseconds, not seconds!
await Cache.set('key', data, 3600)  // Only 3.6 seconds!

// ✅ CORRECT
await Cache.set('key', data, 3600000)  // 1 hour (60 * 60 * 1000)

// ❌ WRONG - Using different keys for set/get
await Cache.set('users:list', data, 3600000)
const users = await Cache.get('users:all')  // Different key!

// ✅ CORRECT - Use same key
await Cache.set('users:list', data, 3600000)
const users = await Cache.get('users:list')

// ❌ WRONG - Trying to set driver in code
Cache.driver('redis')  // Don't do this!

// ✅ CORRECT - Set in .env only
// DB_CACHE=redis
```

5. **Debug cache issues:**
```typescript
// Check if cache exists
const exists = await Cache.exists('my:key')
console.log('Cache exists:', exists)

// Get all cache keys (memory/db only)
const all = await Cache.all()
console.log('All cache:', all)

// Clear all cache
await Cache.clear()
```

6. **Verify Redis connection (if using Redis):**
```bash
# Test Redis is running
redis-cli ping  # Should return "PONG"

# Install redis package
npm install redis@5.6.0 --save
```

**Important Notes:**
- ✅ Cache driver is **automatically** configured from `.env`
- ✅ **Do NOT** call `Cache.driver()` or `Cache.provider()` in code
- ✅ **Do NOT** forget to restart app after changing `DB_CACHE`
- ✅ **Remember** expires is in **milliseconds** (not seconds!)

---

### Error: "Table doesn't exist"

**Cause:** Model schema not synced with database

**Solution:**
```typescript
// Option 1: Sync model (development only)
await new User().sync({
  force: false,  // Don't drop table
  changed: true, // Sync changed columns
  foreign: true, // Sync foreign keys
  index: true    // Sync indexes
})

// Option 2: Use migrations (production)
// npx tspace-mysql migrate --dir=src/migrations
```

---

### Error: "Connection refused" or "ECONNREFUSED"

**Cause:** Database not running or wrong credentials

**Solution:**
1. Check if database server is running
2. Verify `.env` configuration:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=your_database
```
3. Test connection:
```typescript
try {
  await DB.initialize()
  console.log('Connected!')
} catch (error) {
  console.error('Connection failed:', error.message)
}
```

---

### Error: "Duplicate entry" or "Unique constraint failed"

**Cause:** Trying to insert duplicate unique value

**Solution:**
```typescript
// Check if exists first
const exists = await userRepository.exists({
  where: { email: 'test@example.com' }
})

if (exists) {
  // Handle duplicate
  console.log('User already exists')
} else {
  // Create new
  await userRepository.create({ data: {...} })
}
```

---

### Error: "Foreign key constraint fails"

**Cause:** Referencing non-existent record

**Solution:**
```typescript
// Ensure parent exists first
const user = await User.find(userId)
if (!user) {
  throw new Error('User not found')
}

// Then create child record
await Post.create({
  data: {
    user_id: userId,  // Must exist
    title: 'My Post'
  }
})
```

---

### Error: "Column cannot be null"

**Cause:** Missing required field

**Solution:**
```typescript
// Check schema for .notNull() fields
const userSchema = {
  email: Blueprint.varchar(255).notNull(),  // Required!
  name: Blueprint.varchar(255).null(),      // Optional
}

// Provide all required fields
await userRepository.create({
  data: {
    email: 'test@example.com',  // Required
    // name is optional
  }
})
```

---

### Error: "Max statement limit exceeded" or timeout

**Cause:** Too many queries or long-running query

**Solution:**
```typescript
// Use batch operations
const users = [
  { email: 'a@b.com' },
  { email: 'c@d.com' },
  { email: 'e@f.com' }
]

// ❌ SLOW - One query per user
for (const user of users) {
  await userRepository.create({ data: user })
}

// ✅ FAST - Use transaction or batch
const trx = await DB.beginTransaction()
try {
  for (const user of users) {
    await userRepository.create({ 
      data: user,
      transaction: trx 
    })
  }
  await trx.commit()
} catch (e) {
  await trx.rollback()
  throw e
} finally {
  await trx.end()
}
```

---

### Error: "Cannot find module 'reflect-metadata'"

**Cause:** Package not installed

**Solution:**
```bash
npm install reflect-metadata --save
```

---

### Error: "Unexpected token" in TypeScript

**Cause:** TypeScript configuration issue

**Solution:**
Check `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "experimentalDecorators": true,  // Required for decorators
    "emitDecoratorMetadata": true,   // Required for decorators
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Performance Issues

### Slow Queries

**Problem:** Queries taking too long

**Solutions:**

1. **Add Indexes**
```typescript
const userSchema = {
  email: Blueprint.varchar(255).notNull().index(),  // Add index
  status: Blueprint.varchar(50).index(),            // Add index
}
```

2. **Select Only Needed Fields**
```typescript
// ❌ SLOW - Select all columns
const users = await userRepository.findMany()

// ✅ FAST - Select only needed
const users = await userRepository.findMany({
  select: { id: true, email: true, name: true }
})
```

3. **Use Pagination**
```typescript
// ❌ SLOW - Load all records
const users = await userRepository.findMany()

// ✅ FAST - Paginate
const result = await userRepository.paginate({
  page: 1,
  limit: 20
})
```

4. **Use Caching**
```typescript
// Cache frequently accessed data
const users = await new User()
  .cache({
    key: 'users:active',
    expires: 3600000,  // 1 hour
    namespace: true
  })
  .findMany({ where: { status: 'active' } })
```

---

## Debugging Tips

### Enable Query Logging
```typescript
class User extends Model {
  constructor() {
    super()
    this.useSchema({...})
    
    // Enable SQL logging
    this.useLogger({
      selected: true,   // Log SELECT queries
      inserted: true,   // Log INSERT queries
      updated: true,    // Log UPDATE queries
      deleted: true     // Log DELETE queries
    })
  }
}
```

### View Generated SQL
```typescript
// See the SQL without executing
const sql = await new User()
  .where('status', 'active')
  .toString()

console.log(sql)
// SELECT * FROM `users` WHERE `status` = 'active'
```

### Debug Relations
```typescript
// Check if relations are defined
const user = await User.find(1, {
  relations: { posts: true }
})

console.log('Has posts?', user?.posts !== undefined)
console.log('Posts count:', user?.posts?.length)
```

---

## Still Having Issues?

1. **Check the docs**: [`00-START-HERE.md`](./00-START-HERE.md)
2. **See examples**: [`99-quickstart.md`](./99-quickstart.md)
3. **Review API**: Topic-specific files (01-10)
4. **Check GitHub**: https://github.com/thanathip41/tspace-mysql/issues
5. **npm page**: https://www.npmjs.com/package/tspace-mysql

---

**Last Updated**: 2026-03  
**Status**: ✅ 100% Verified Against Source Code v1.9.2+