# 📑 Index & Glossary

Quick reference to all concepts, methods, and patterns in tspace-mysql.

## 📖 Glossary

### A
- **Auto Increment**: Automatic incrementing primary key (`Blueprint.int().autoIncrement()`)

### B
- **BelongsTo**: Inverse relationship (many-to-one)
- **BelongsToMany**: Many-to-many relationship with pivot table
- **Blueprint**: Class for defining column types and constraints
- **Bind**: Attach model instance to transaction

### C
- **Cache**: In-memory, database, or Redis caching system
- **CLI**: Command-line interface tools
- **Column Modifiers**: Methods like `.notNull()`, `.unique()`, `.index()`

### D
- **DB**: Database connection and query builder class
- **Decorator**: TypeScript decorators for model configuration
- **Delete**: Remove records (soft or hard delete)

### E
- **Eager Loading**: Load relations with `.find()` using `relations` option
- **Environment**: Configuration via `.env` file

### F
- **Foreign Key**: Reference to another table's primary key
- **Find**: Retrieve records by primary key
- **FindMany**: Retrieve multiple records
- **FindOne**: Retrieve single record matching criteria

### H
- **HasMany**: One-to-many relationship
- **HasOne**: One-to-one relationship

### I
- **Index**: Database index for faster queries (`.index()`)
- **Insert**: Create new records

### J
- **Join**: Combine tables in queries
- **JSON**: JSON column type support

### M
- **Model**: Base class for ORM entities
- **Migration**: Database schema version control

### O
- **Observer**: Model lifecycle event handlers
- **Operator**: Query operators (OP.like, OP.in, etc.)

### P
- **Paginate**: Get paginated results with metadata
- **Pattern**: Naming convention (snake_case, camelCase)
- **Pivot Table**: Junction table for many-to-many relations
- **Primary Key**: Unique identifier for records
- **Provider**: Cache driver (deprecated term, use "driver")

### Q
- **Queue**: Background job processing system
- **Query Builder**: Fluent API for constructing SQL queries

### R
- **Reflect Metadata**: Required TypeScript metadata for decorators
- **Relation**: Connection between models
- **Repository**: Data access pattern for CRUD operations
- **Repository Pattern**: Separation of data access logic

### S
- **Schema**: Database structure definition
- **Select**: Choose specific columns to retrieve
- **Soft Delete**: Mark as deleted without removing
- **Sync**: Synchronize model schema with database

### T
- **Timestamp**: Automatic created_at/updated_at columns
- **Transaction**: ACID-compliant database operations
- **Type Safety**: TypeScript type checking for queries

### U
- **Unique**: Constraint ensuring no duplicate values
- **Update**: Modify existing records
- **UUID**: Universally unique identifier

### W
- **Where**: Filter records by conditions
- **With**: Alternative to `bind()` for transactions

---

## 📋 Methods Index

### Model Methods
| Method | Description | File |
|--------|-------------|------|
| `find(id)` | Find by primary key | 01-model-setup.md |
| `findOne(options)` | Find single record | 01-model-setup.md |
| `findMany(options)` | Find multiple records | 01-model-setup.md |
| `create(data)` | Create new record | 01-model-setup.md |
| `save()` | Save instance to database | 01-model-setup.md |
| `update(data)` | Update instance | 01-model-setup.md |
| `delete()` | Delete instance | 01-model-setup.md |
| `sync(options)` | Sync schema with database | 01-model-setup.md |
| `truncate(options)` | Empty table | 01-model-setup.md |
| `bind(transaction)` | Bind to transaction | 07-transactions.md |
| `cache(options)` | Cache query result | 08-caching.md |

### Repository Methods
| Method | Description | File |
|--------|-------------|------|
| `find(id, options)` | Find by ID | 04-repository.md |
| `findOne(options)` | Find one record | 04-repository.md |
| `findMany(options)` | Find many records | 04-repository.md |
| `paginate(options)` | Get paginated results | 04-repository.md |
| `create(options)` | Create record | 04-repository.md |
| `update(options)` | Update record(s) | 04-repository.md |
| `delete(id)` | Delete record | 04-repository.md |
| `exists(options)` | Check if exists | 04-repository.md |
| `count(field, options)` | Count records | 04-repository.md |

### Query Builder (DB) Methods
| Method | Description | File |
|--------|-------------|------|
| `select(...columns)` | Select columns | 02-query-builder.md |
| `where(field, value)` | Add WHERE clause | 02-query-builder.md |
| `orderBy(field, dir)` | Sort results | 02-query-builder.md |
| `limit(n)` | Limit results | 02-query-builder.md |
| `offset(n)` | Skip results | 02-query-builder.md |
| `join(condition)` | JOIN tables | 02-query-builder.md |
| `groupBy(field)` | GROUP BY clause | 02-query-builder.md |
| `having(condition)` | HAVING clause | 02-query-builder.md |
| `insert(data)` | INSERT query | 02-query-builder.md |
| `update(data)` | UPDATE query | 02-query-builder.md |
| `delete()` | DELETE query | 02-query-builder.md |

### Cache Methods
| Method | Description | File |
|--------|-------------|------|
| `Cache.driver(name)` | Set cache driver | 08-caching.md |
| `Cache.get(key)` | Get cached value | 08-caching.md |
| `Cache.set(key, value, ms)` | Set cache value | 08-caching.md |
| `Cache.delete(key)` | Delete cache value | 08-caching.md |
| `Cache.clear()` | Clear all cache | 08-caching.md |
| `Cache.exists(key)` | Check if exists | 08-caching.md |

### Queue Methods
| Method | Description | File |
|--------|-------------|------|
| `queue.add(name, payload, options)` | Add job to queue | 09-queue.md |
| `queue.process(name, handler, options)` | Process jobs | 09-queue.md |
| `queue.shutdown()` | Graceful shutdown | 09-queue.md |

### Transaction Methods
| Method | Description | File |
|--------|-------------|------|
| `DB.transaction(callback)` | Auto-managed transaction | 07-transactions.md |
| `DB.beginTransaction()` | Manual transaction | 07-transactions.md |
| `trx.query(sql, params)` | Execute query in transaction | 07-transactions.md |
| `trx.commit()` | Commit transaction | 07-transactions.md |
| `trx.rollback()` | Rollback transaction | 07-transactions.md |
| `trx.end()` | End transaction | 07-transactions.md |

---

## 🔍 Concepts by Topic

### Getting Started
- Installation → 00-overview.md
- Configuration → 00-overview.md
- First Model → 01-model-setup.md
- First Query → 02-query-builder.md
- Quick Start → 00-START-HERE.md

### Database Operations
- CRUD → 04-repository.md
- Queries → 02-query-builder.md
- Transactions → 07-transactions.md
- Migrations → 10-cli.md

### Advanced Features
- Relations → 03-relations.md
- Caching → 08-caching.md
- Queue → 09-queue.md
- Decorators → 05-decorators.md
- Type Safety → 06-type-safety.md

### Troubleshooting
- Common Errors → 11-troubleshooting.md
- Performance → 11-troubleshooting.md
- Debugging → 11-troubleshooting.md

---

## 📊 File Reference

| File | Lines | Topic | Difficulty |
|------|-------|-------|------------|
| 00-START-HERE.md | ~200 | Quick Start | ⭐ Beginner |
| 00-overview.md | ~140 | Architecture | ⭐ Beginner |
| 01-model-setup.md | ~445 | Models | ⭐⭐ Intermediate |
| 02-query-builder.md | ~681 | Queries | ⭐⭐ Intermediate |
| 03-relations.md | ~590 | Relations | ⭐⭐⭐ Advanced |
| 04-repository.md | ~683 | Repository | ⭐⭐ Intermediate |
| 05-decorators.md | ~656 | Decorators | ⭐⭐⭐ Advanced |
| 06-type-safety.md | ~793 | TypeScript | ⭐⭐⭐ Advanced |
| 07-transactions.md | ~485 | Transactions | ⭐⭐⭐ Advanced |
| 08-caching.md | ~835 | Caching | ⭐⭐⭐ Advanced |
| 09-queue.md | ~461 | Queue | ⭐⭐⭐ Advanced |
| 10-cli.md | ~215 | CLI Tools | ⭐ Beginner |
| 11-troubleshooting.md | ~400 | Debugging | ⭐⭐ Intermediate |
| 12-index.md | ~350 | Index | Reference |
| 99-quickstart.md | ~730 | Example | ⭐⭐ Intermediate |

---

## 🎯 Quick Lookup

**Need to...**
- Create a model → 01-model-setup.md
- Query database → 02-query-builder.md
- Add relation → 03-relations.md
- Use repository → 04-repository.md
- Add decorator → 05-decorators.md
- Add types → 06-type-safety.md
- Use transaction → 07-transactions.md
- Add caching → 08-caching.md
- Add queue → 09-queue.md
- Run CLI → 10-cli.md
- Fix error → 11-troubleshooting.md
- See example → 99-quickstart.md

---

**Last Updated**: 2026-03  
**Status**: ✅ 100% Verified Against Source Code v1.9.2+