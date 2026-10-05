# TspaceMysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

tspace-mysql is an Object-Relational Mapping (ORM) tool designed to run seamlessly in Node.js and is fully compatible with TypeScript. It consistently supports the latest features in both TypeScript and JavaScript, providing additional functionalities to enhance your development experience.

| **Feature**                    | **Description**                                                                                         |
|--------------------------------|---------------------------------------------------------------------------------------------------------|
| **Supports Driver**            | MySQL ✅ / MariaDB ✅ / Postgres ✅ / SQLite ✅ / Mongodb ✅ (yes, even MongoDB 😏) /  MSSQL ⏳     |
| **Query Builder**              | Create flexible queries like `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. You can also use raw SQL.      |
| **Join Clauses**               | Use `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `CROSS JOIN` to combine data from multiple tables.     |
| **Model**                      | Provides a way to interact with database records as objects in code. You can perform create, read, update, and delete (CRUD) operations. Models also support soft deletes and relationship methods. |
| **Schema**                     | Allows you to define and manage the structure of MySQL tables, including data types and relationships. Supports migrations and validation. |
| **Validation**                 | Automatically checks data against defined rules before saving it to the database, ensuring data integrity and correctness. |
| **Sync**                       | Synchronizes the model structure with the database, updating the schema to match the model definitions automatically. |
| **Soft Deletes**               | Marks records as deleted without removing them from the database. This allows for recovery and auditing later. |
| **Relationships**              | Set up connections between models, such as one-to-one, one-to-many, belongs-to, and many-to-many. Supports nested relationships and checks. |
| **Type Safety**                | Ensures that queries are safer by checking the types of statements like `SELECT`, `ORDER BY`, `GROUP BY`, and `WHERE`. |
| **Metadata**                   | Get the metadata of a Model. |
| **Repository**                 | Follows a pattern for managing database operations like `SELECT`, `INSERT`, `UPDATE`, and `DELETE`. It helps keep the code organized. |
| **Decorators**                 | Use decorators to add extra functionality or information to model classes and methods, making the code easier to read. |
| **Caching**                  | Improves performance by storing frequently requested data. Supports in-memory caching (like memory DB) and Redis for distributed caching. |
| **Queue**                      | Job queue for background and async processing. Runs on top of databases for distributed workers (similar to pg-boss). |
| **Migrations**                 | Use CLI commands to create models, make migrations, and apply changes to the database structure.          |
| **Blueprints**                 | Create a clear layout of the database structure and how models and tables relate to each other.          |
| **CLI**                        | A Command Line Interface for managing models, running migrations, executing queries, and performing other tasks using commands (like `make:model`, `migrate`, and `query`). |

## 📚 For LLMs & AI Assistants

Complete Skills Documentation is available in the [`skills/`](../skills) folder. This includes comprehensive, verified guides for:

- Model Setup & Blueprint
- Query Builder & SQL Operations
- Relationships (hasOne, hasMany, belongsTo, belongsToMany)
- Repository Pattern
- Decorators
- Type Safety (T namespace)
- Transactions
- Caching (DB_CACHE, .cache())
- Queue System
- CLI Commands
- Complete Real-World Examples

All skills documentation is **100% verified** against the source code.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
## Install tspace-mysql locally for your project
npm install tspace-mysql --save

## Install tspace-mysql globally (optional)
npm install -g tspace-mysql
```

## TypeScript

The TypeScript version is specified only for **development and build-time** purposes and does **not** restrict how consumers use the library.

This library is built using **TypeScript 5.9.3**.  
The minimum supported **TypeScript version is >= 5.6.2**.

If you are contributing to this library or building it locally, install the pinned TypeScript version:

```sh
npm install -D typescript@5.9.3
```

## Configuration

To establish a connection, the recommended method for creating your environment variables is by using a '.env' file. using the following:

```js
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
/**
 * @default
 *  DB_CONNECTION_LIMIT = 20
 *  DB_QUEUE_LIMIT      = 0
 *  DB_TIMEOUT          = 60000
 *  DB_DATE_STRINGS     = false
 */
```

### MySQL Database

To connect the application to a MySQL database, using the following:
```sh
npm install mysql2 --save
```

```js
DB_DRIVER = mysql
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
```
💡 Notes

Uses mysql2 as the default driver

Fully supports MySQL-compatible databases such as MariaDB

No additional configuration is required for standard usage

### Mariadb Database

To connect the application to a Mariadb database, using the following:

```sh
npm install mariadb --save
```

```js
DB_DRIVER = mariadb
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
```

### Postgres Database

To connect the application to a Postgres database, using the following:

```sh
npm install pg --save
```

```js
DB_DRIVER = postgres
DB_HOST = localhost
DB_PORT = 5432
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
```

### SQLite Database

To connect the application to a SQLite database, using the following:

```sh
npm install better-sqlite3 --save
```

```js
DB_DRIVER = sqlite
DB_DATABASE = app.db
```
⚠️ Requirements for better-sqlite3
Node.js 22 or higher is required

### Mongodb Database

To connect the application to a Mongodb database, using the following:
```sh
npm install mongodb --save
```

```js
DB_DRIVER = mongodb
DB_HOST = localhost
DB_PORT = 27017
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
```
✅ Supported Features

CRUD operations (create, read, update, delete)
Basic joins & relations (via abstraction layer)

⚠️ Limitations

MongoDB support is partially implemented and may not fully match SQL-based drivers like MySQL or PostgreSQL

* Advanced ORM features may be limited
* Complex joins rely on abstraction (not native MongoDB behavior)
* Some features may behave differently compared to relational databases
* Transactions / advanced optimizations may be limited

### Cluster Database
If you need strict race condition control, it is required to use multiple nodes for write and read. <br>
Avoid using a node load balancer in this case, as it may bypass proper write/read distribution and compromise consistency.<br>
To connect your application to a Cluster database, use the following configuration:

```js
// ----------------------------------------------------
// @Example MariaDB Galera Cluster

DB_DRIVER = mariadb
DB_HOST = host-load-balncer ❌
DB_PORT = 3306
DB_USERNAME = root1
DB_PASSWORD = password1
DB_DATABASE = database
```

```js
// ----------------------------------------------------
// Configure multiple database nodes using comma-separated connection values.

// MariaDB Galera Cluster
// host1 → Primary node
// host2 → Replica node 1
// host3 → Replica node 2
DB_DRIVER = mariadb
// Host 1 remains the primary; hosts 2 and 3 are replicas.
DB_HOST = host1,host2,host3 
DB_PORT = 3306,3307,3308
DB_USERNAME = root1,root2,root3
DB_PASSWORD = password1,password2,password3
DB_DATABASE = database
```
Example Flow

```text
              ┌─────────────────┐
              │   Application   │
              └────────┬────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    WRITE → READ                  READ
          │                         │
          ▼                         ▼
  ┌─────────────────┐       ┌─────────────────┐
  │     host1       │       │ Random Replica  │
  │     PRIMARY     │       │                 │
  └─────────────────┘       └────────┬────────┘
                                     │
                              ┌──────┴──────┐
                              ▼             ▼
                      ┌────────────┐ ┌────────────┐
                      │   host2    │ │   host3    │
                      │  REPLICA 1 │ │  REPLICA 2 │
                      └────────────┘ └────────────┘
```
Node Selection

When no node is explicitly selected, the database automatically routes
queries based on the action being performed.

Write / Action Queries

Queries that modify data are automatically sent to the primary node.
```js
await new DB('users')
  .create({
    name: 'John'
  })
  .save() // host1

await new DB('users') 
  .update({
    name: 'John Doe'
  })
  .save() // host1

await new DB('users')
  .delete() // host1

```
Read / Select Queries

Queries that only read data are automatically sent to a random replica node.
```js
await new DB('users')
.findMany(); // host2, host3
```
Use the primary node explicitly:

```js
await new DB('users')
.useNode('primary') // host1
.findMany();

```
Use a random replica node:

```js
await new DB('users')
.useNode('replica') // host2,host3
.findMany();
```
Use a specific replica node:

```js
await new DB('users')
  .useNode('replica', { node: 1 }) // host2
  .findMany()

await new DB('users')
  .useNode('replica', { node: 2 }) // host3
  .findMany()
```
Transactions are executed on the **primary node by default**, but you can use a replica node if needed.

Use `.bind(trx)` to ensure queries are executed within the same transaction.
```js
await new DB()
.useNode('primary') // Primary by default; replicas can also be selected.
.transaction(async (trx) => {
    await new User()
    .create({
      name: `tspace`,
      email: "tspace@example.com",
    })
    .bind(trx) // Don't forget to bind the transaction
    .save();
  });
```
⚠️ Why .bind(trx) is required

The transaction is associated with a specific database connection.
Calling .bind(trx) ensures that the query uses the same connection and transaction context.

Without .bind(trx), the query may use another connection and will not be part of the transaction.
```js
await new DB()
.useNode('primary')
.transaction(async (trx) => {
  
    const user = await new User()
    .create({
      name: `tspace`,
      email: "tspace@example.com",
    })
    .bind(trx)
    .save();
  });

  // ⚠️ Read operations use a random replica by default.
  const findUser = await new User().where('id',user.id).findOne()
  // May not be found because the query can be routed to 
  // host2 or host3 before the replication has completed.

  // How to Fix Read-After-Write
  // If you need to read data immediately after a transaction, 
  // there are two ways to ensure the read sees the latest data.
  const fixed1 = await new User()
   .bind(trx) // Uses the same transaction connection.
   .where('id',user.id)
   .findOne()

  const fixed2 = await new User()
   .useNode('primary') // Uses the same primary node selected for the transaction.
   .where('id',user.id)
   .findOne()

```

<div class="page-nav-cards">
  <a href="#" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Getting Started</div>
  </a>

  <a href="#/comparisons" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Comparisons </div>
  </a>
</div>
