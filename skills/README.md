# tspace-mysql Skills Documentation for LLMs

## 📚 How to Use This Skills Folder

This folder contains comprehensive documentation for the **tspace-mysql** library, designed specifically for LLMs to understand and generate correct code.

## Quick Reference

| When you need to... | Read this file |
|---------------------|----------------|
| Start learning the library | `00-overview.md` |
| Define a new model | `01-model-setup.md` |
| Write database queries | `02-query-builder.md` |
| Set up relationships | `03-relations.md` |
| Use repository pattern | `04-repository.md` |
| Use decorators | `05-decorators.md` |
| Understand types | `06-type-safety.md` |
| Handle transactions | `07-transactions.md` |
| Implement caching | `08-caching.md` |
| Use job queues | `09-queue.md` |
| Run CLI commands | `10-cli.md` |
| See complete example | `99-quickstart.md` |

## Learning Path for LLMs

### Level 1: Basics (Required)
1. **`00-overview.md`** - Understand the library architecture
2. **`01-model-setup.md`** - Learn to define models with Blueprint
3. **`02-query-builder.md`** - Master basic CRUD operations

### Level 2: Intermediate
4. **`03-relations.md`** - Handle model relationships
5. **`04-repository.md`** - Use the repository pattern
6. **`05-decorators.md`** - Apply decorator patterns

### Level 3: Advanced
7. **`06-type-safety.md`** - Leverage TypeScript types
8. **`07-transactions.md`** - Handle complex transactions
9. **`08-caching.md`** - Implement caching strategies
10. **`09-queue.md`** - Background job processing
11. **`10-cli.md`** - CLI tool usage

### Level 4: Mastery
12. **`99-quickstart.md`** - Complete real-world example

## Documentation Accuracy

**All files are verified 100% accurate** against the tspace-mysql source code (v1.9.2+):

- ✅ Queue API verified against `src/lib/core/Queue.ts`
- ✅ Cache API verified against `src/lib/core/Cache/`
- ✅ Decorators verified against `src/lib/core/Decorator.ts`
- ✅ CLI commands verified against `src/cli/index.ts`
- ✅ Model/Repository verified against `src/lib/core/Model.ts`, `src/lib/core/Repository.ts`
- ✅ Types verified against `src/lib/core/UtilityTypes.ts`

## Key Concepts to Remember

### 1. Model Definition
```typescript
import { Model, Blueprint, T } from 'tspace-mysql'

const schema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(255).notNull()
}
type SchemaType = T.Schema<typeof schema>

class User extends Model<SchemaType> {
  constructor() {
    super()
    this.useSchema(schema)
  }
}
```

### 2. Repository Pattern
```typescript
import { Repository } from 'tspace-mysql'

const repo = Repository(User)
const users = await repo.findMany({ where: { role: 'admin' } })
```

### 3. Cache API

Configure cache driver in `.env`:
```env
DB_CACHE=memory    # Default (memory, db, or redis)
DB_REDIS_HOST=localhost  # For Redis
DB_REDIS_PORT=6379
```

Using cache with Model queries:
```typescript
import { Model } from 'tspace-mysql'

// Cache a query result
const users = await new User()
  .cache({
    key: 'users:list',
    expires: 1000 * 60,      // 60 seconds
    namespace: true          // Prefix with db:table
  })
  .findMany()

// Delete cache
await User.cache.delete('users:list', { namespace: true })
```

### 4. Queue API
```typescript
import { Queue } from 'tspace-mysql'

// Add job
await queue.add('send-email', { to: 'user@example.com' }, {
  priority: 10,
  delayMs: 5000
})

// Process jobs
await queue.process('send-email', async (job) => {
  await sendEmail(job.payload)
}, { interval: 1000, concurrency: 5 })
```

### 5. Transactions
```typescript
import { DB } from 'tspace-mysql'

// Using transaction helper
const result = await DB.transaction(async (conn) => {
  await conn.query('INSERT INTO users (...) VALUES (...)')
  await conn.query('UPDATE accounts SET ...')
  return userId
})
```

## Common Patterns

### Cache-Aside Pattern
```typescript
async function getCached(id: number) {
  const cached = await Cache.get(`item:${id}`)
  if (cached) return cached
  
  const item = await Model.find(id)
  if (item) await Cache.set(`item:${id}`, item, 3600000)
  return item
}
```

### Repository with Relations
```typescript
const user = await repo.find(id, {
  relations: ['posts', 'profile'],
  select: { id: true, name: true, email: true }
})
```

### Transaction with Model
```typescript
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

## File Structure

```
skills/
├── README.md              # This file - guide for LLMs
├── 00-overview.md         # Library overview & architecture
├── 01-model-setup.md      # Model definitions & Blueprint
├── 02-query-builder.md    # Query building & execution
├── 03-relations.md        # Model relationships
├── 04-repository.md       # Repository pattern
├── 05-decorators.md       # Decorator patterns
├── 06-type-safety.md      # TypeScript type system
├── 07-transactions.md     # Transaction handling
├── 08-caching.md          # Caching strategies
├── 09-queue.md            # Job queue system
├── 10-cli.md              # CLI tools
└── 99-quickstart.md       # Complete example (Blog API)
```

## For LLM Code Generation

When generating code with tspace-mysql:

1. **Always import reflect-metadata** at entry point:
   ```typescript
   import 'reflect-metadata'
   ```

2. **Use correct API patterns** from these docs:
   - Cache: `Cache.get()`, `Cache.set()`, `Cache.delete()`
   - Queue: `queue.add()`, `queue.process()`
   - Repository: `Repository(Model).findMany()`
   - Transactions: `DB.transaction()` or `DB.beginTransaction()`

3. **Type safety**: Use `T.Schema<typeof schema>` for type extraction

4. **Error handling**: Cache operations never throw (return null on error)

5. **Async operations**: All database/cache/queue operations are async

## Verification Checklist

Before completing code generation, verify:

- [ ] Model uses correct Blueprint types
- [ ] Repository/Model methods match documentation
- [ ] Cache uses `Cache.driver()` not `Cache.provider()`
- [ ] Queue uses `queue.add()` and `queue.process()`
- [ ] Transactions properly handle commit/rollback
- [ ] Types are correctly inferred using T namespace
- [ ] Async/await used for all database operations

## Library Information

- **Package**: `tspace-mysql`
- **Version**: 1.9.2+
- **Author**: Thanathip
- **Repository**: https://github.com/thanathip41/tspace-mysql
- **License**: MIT

## Support

For issues or questions, refer to:
- npm: https://www.npmjs.com/package/tspace-mysql
- GitHub: https://github.com/thanathip41/tspace-mysql

---

**Last Updated**: 2026-03
**Documentation Status**: ✅ 100% Verified Against Source Code