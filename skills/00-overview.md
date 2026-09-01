# tspace-mysql - LLM Skills Overview

## Library Summary

**tspace-mysql** is a TypeScript ORM (Object-Relational Mapping) library for Node.js that provides type-safe database operations. It supports multiple database drivers including MySQL, MariaDB, PostgreSQL, SQLite, and MongoDB (partial support).

## Key Information for LLMs

### Package Details
- **Name**: `tspace-mysql`
- **Version**: 1.9.2+
- **Author**: Thanathip
- **License**: MIT
- **Repository**: https://github.com/thanathip41/tspace-mysql

### Installation
```bash
npm install tspace-mysql --save
```

### Peer Dependencies
- TypeScript >= 5.6.2 (library built with 5.9.3)

### Runtime Dependencies
- `dotenv` - Environment variable management
- `mysql2` - MySQL driver
- `pluralize` - String pluralization
- `reflect-metadata` - Decorator metadata
- `sql-formatter` - SQL formatting
- `zod` - Schema validation

## Core Exports

```js
import {
  DB,           // Database connection and query builder
  Model,        // Base model class for ORM
  Schema,       // Schema management
  Blueprint,    // Column type definitions
  Pool,         // Connection pool management
  sql,          // SQL-like query builder
  Meta,         // Model metadata
  View,         // Database views
  Queue,        // Job queue system
  Repository,   // Repository pattern
  Operator,     // Query operators (OP)
  // Decorators
  Table, TableSingular, TablePlural,
  UUID, Timestamp, SoftDelete,
  Pattern, CamelCase, SnakeCase,
  Column, Transform, Validate,
  HasOne, HasMany, BelongsTo, BelongsToMany,
  Observer, Hooks,
  BeforeInsert, BeforeUpdate, BeforeRemove,
  AfterInsert, AfterUpdate, AfterRemove,
  // Types
  T             // Type utilities namespace
} from 'tspace-mysql'
```

## Database Configuration

Environment variables (`.env`):
```env
DB_DRIVER=mysql        # mysql, mariadb, postgres, sqlite, mongodb
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=database
DB_CONNECTION_LIMIT=20
DB_QUEUE_LIMIT=0
DB_TIMEOUT=60000
DB_DATE_STRINGS=false
```

## Supported Databases

| Database | Driver Package | Status |
|----------|---------------|--------|
| MySQL | mysql2 | ✅ Full Support |
| MariaDB | mariadb | ✅ Full Support |
| PostgreSQL | pg | ✅ Full Support |
| SQLite | better-sqlite3 | ✅ Full Support |
| MongoDB | mongodb | ⚠️ Partial Support |
| MSSQL | mssql | ⏳ Planned |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
├─────────────────────────────────────────────────────────┤
│  Model (ORM)  │  Repository  │  Query Builder (DB)      │
├─────────────────────────────────────────────────────────┤
│              Core Components                             │
│  - Blueprint    - Schema      - Meta                    │
│  - RelationManager - StateManager - Cache               │
│  - JoinModel    - View        - Queue                   │
│  - StoredProcedure - Operator                           │
├─────────────────────────────────────────────────────────┤
│                    Driver Layer                          │
│  MySQL │ MariaDB │ PostgreSQL │ SQLite │ MongoDB        │
└─────────────────────────────────────────────────────────┘
```

## Key Concepts

1. **Model-based ORM**: Extend `Model` class to define database tables
2. **Blueprint System**: Define column types with `Blueprint` class
3. **Type Safety**: Full TypeScript support with generic types
4. **Repository Pattern**: Separate data access logic with `Repository()`
5. **Decorator Support**: Use decorators for model configuration
6. **Query Builder**: Fluent API for building SQL queries
7. **Relations**: HasOne, HasMany, BelongsTo, BelongsToMany
8. **Soft Deletes**: Mark records as deleted without removing
9. **Transactions**: ACID-compliant database transactions
10. **Caching**: In-memory and Redis cache support
11. **Queue System**: Background job processing
12. **CLI Tools**: Command-line utilities for development

## ⚡ Quick Tips

### Performance Best Practices
1. **Use indexes** on frequently queried columns
2. **Select only needed fields** with `select: { id: true, email: true }`
3. **Use pagination** for large datasets
4. **Cache frequently accessed data** with `.cache()`
5. **Use relations wisely** - only load what you need

### Common Pitfalls to Avoid
1. ❌ Missing `import 'reflect-metadata'`
2. ❌ Using array syntax for relations: `['posts']`
3. ❌ Forgetting `await` on async operations
4. ❌ Using `new Repository(Model)` instead of `Repository(Model)`
5. ❌ Using `Cache.provider()` instead of `Cache.driver()`

### Getting Help
- **Quick Start**: [`00-START-HERE.md`](./00-START-HERE.md)
- **Common Errors**: [`11-troubleshooting.md`](./11-troubleshooting.md)
- **Complete Example**: [`99-quickstart.md`](./99-quickstart.md)

## Related Skills Documents

- `01-model-setup.md` - Defining models and schemas
- `02-query-builder.md` - Using DB query builder
- `03-relations.md` - Model relationships
- `04-repository.md` - Repository pattern
- `05-decorators.md` - Decorator usage
- `06-type-safety.md` - TypeScript type system
- `07-transactions.md` - Database transactions
- `08-caching.md` - Caching strategies
- `09-queue.md` - Job queue system
- `10-cli.md` - Command line tools
- `99-quickstart.md` - Complete real-world example
- `11-troubleshooting.md` - Common errors and solutions