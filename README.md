# tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

tspace-mysql is an Object-Relational Mapping (ORM) tool designed to run seamlessly in Node.js and is fully compatible with TypeScript. It consistently supports the latest features in both TypeScript and JavaScript, providing additional functionalities to enhance your development experience.


## Feature

| **Feature**                    | **Description**                                                                                         |
|--------------------------------|---------------------------------------------------------------------------------------------------------|
| **Supports Driver**            | MySQL ✅ / MariaDB ✅ / Postgres / ✅ MSSQL ⏳ / SQLite3 ⏳ / Oracle ⏳                                |
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
| **Caching**                    | Improves performance by storing frequently requested data. Supports in-memory caching (like memory DB) and Redis for distributed caching. |
| **Migrations**                 | Use CLI commands to create models, make migrations, and apply changes to the database structure.          |
| **Blueprints**                 | Create a clear layout of the database structure and how models and tables relate to each other.          |
| **CLI**                        | A Command Line Interface for managing models, running migrations, executing queries, and performing other tasks using commands (like `make:model`, `migrate`, and `query`). |

## Install

Install with [npm](https://www.npmjs.com/):

```sh
# Install tspace-mysql locally for your project
npm install tspace-mysql --save

# Install tspace-mysql globally (optional)
npm install -g tspace-mysql

# Install database drivers if needed:
# For MariaDB
npm install mariadb --save

# For PostgreSQL
npm install pg --save

# MySQL2 driver is installed by default with tspace-mysql
```

## Documentation

See the [`docs`](https://thanathip41.github.io/tspace-mysql) directory for full documentation.

## Basic Usage

- [Getting Started](https://thanathip41.github.io/tspace-mysql/#/)
  - [Install](https://thanathip41.github.io/tspace-mysql/#/?id=install)
  - [Configuration](https://thanathip41.github.io/tspace-mysql/#/?id=configuration)
- [Integrations](https://thanathip41.github.io/tspace-mysql/#/integrations)
  - [Http](https://thanathip41.github.io/tspace-mysql/#/integrations?id=http)
  - [Expressjs](https://thanathip41.github.io/tspace-mysql/#/integrations)
  - [Fastify](https://thanathip41.github.io/tspace-mysql/#/integrations?id=expressjs)
  - [Nestjs](https://thanathip41.github.io/tspace-mysql/#/integrations?id=nestjs)
  - [Bun](https://thanathip41.github.io/tspace-mysql/#/integrations?id=bun-native)
  - [Elysia](https://thanathip41.github.io/tspace-mysql/#/integrations?id=elysia)
  - [Hono](https://thanathip41.github.io/tspace-mysql/#/integrations?id=hono)
- [SQL Like](https://thanathip41.github.io/tspace-mysql/#/sql-like)
  - [Select Statements](https://thanathip41.github.io/tspace-mysql/#/sql-like?id=select-statements)
  - [Insert Statements](https://thanathip41.github.io/tspace-mysql/#/sql-like?id=insert-statements)
  - [Update Statements](https://thanathip41.github.io/tspace-mysql/#/sql-like?id=update-statements)
  - [Delete Statements](https://thanathip41.github.io/tspace-mysql/#/sql-like?id=delete-statements)
- [Query Builder](https://thanathip41.github.io/tspace-mysql/#/query-builder)
  - [Table Name & Alias Name](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=table-name--alias-name)
  - [Returning Results](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=returning-results)
  - [Query Statement](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=query-statements)
  - [Select Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=select-statements)
  - [Insert Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=insert-statements)
  - [Update Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=update-statements)
  - [Delete Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=delete-statements)
  - [Raw Expressions](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=raw-expressions)
  - [Ordering, Grouping, Limit and Offset](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=ordering-grouping-limit-and-offset)
    - [Ordering](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=ordering)
    - [Grouping](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=grouping)
    - [Limit and Offset](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=limit-and-offset)
  - [Joins](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=joins)
    - [Inner Join Clause](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=inner-join-clause)
    - [Left Join, Right Join Clause](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=left-join-right-join-clause)
    - [Cross Join Clause](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=cross-join-clause)
  - [Basic Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=basic-where-clauses)
    - [Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=where-clauses)
    - [Or Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=or-where-clauses)
    - [Where cases](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=where-cases)
    - [Where Object Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=where-object-clauses)
    - [JSON Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=json-where-clauses)
    - [Additional Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=additional-where-clauses)
    - [Logical Grouping](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=logical-grouping)
  - [Advanced Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=advanced-where-clauses)
    - [Where Exists Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=where-exists-clauses)
    - [Subquery Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=subquery-where-clauses)
    - [Conditional Where Clauses](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=conditional-where-clauses)
  - [GetGroupBy](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=getgroupby)
  - [Paginating](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=paginating)
  - [Hook Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=hook-statements)
  - [Faker Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=faker-statements)
  - [Unset Statements](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=unset-statements)
  - [Common Table Expressions](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=common-table-expressions)
  - [Union](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=union)
  - [More Methods](https://thanathip41.github.io/tspace-mysql/#/query-builder?id=more-methods)
- [Database Transactions](https://thanathip41.github.io/tspace-mysql/#/database-transactions)
- [Race Condition](https://thanathip41.github.io/tspace-mysql/#/race-condition)
- [Connection](https://thanathip41.github.io/tspace-mysql/#/connection)
- [Backup](https://thanathip41.github.io/tspace-mysql/#/backup)
- [Injection](https://thanathip41.github.io/tspace-mysql/#/injection)
- [Model](https://thanathip41.github.io/tspace-mysql/#/model)
  - [Basic Model Setup](https://thanathip41.github.io/tspace-mysql/#/model?id=basic-model-setup)
    - [Table Name](https://thanathip41.github.io/tspace-mysql/#/model?id=table-name)
    - [Pattern](https://thanathip41.github.io/tspace-mysql/#/model?id=pattern)
    - [UUID](https://thanathip41.github.io/tspace-mysql/#/model?id=uuid)
    - [Timestamp](https://thanathip41.github.io/tspace-mysql/#/model?id=timestamp)
    - [Debug](https://thanathip41.github.io/tspace-mysql/#/model?id=debug)
    - [Observer](https://thanathip41.github.io/tspace-mysql/#/model?id=observer)
    - [Logger](https://thanathip41.github.io/tspace-mysql/#/model?id=logger)
    - [Hooks](https://thanathip41.github.io/tspace-mysql/#/model?id=hooks)
    - [Global Scope](https://thanathip41.github.io/tspace-mysql/#/model?id=global-scope)
  - [Schema](https://thanathip41.github.io/tspace-mysql/#/model?id=schema)
    - [Schema Model](https://thanathip41.github.io/tspace-mysql/#/model?id=schema-model)
    - [Virtual Column](https://thanathip41.github.io/tspace-mysql/#/model?id=virtual-column)
    - [Validation](https://thanathip41.github.io/tspace-mysql/#/model?id=validation)
    - [Sync](https://thanathip41.github.io/tspace-mysql/#/model?id=sync)
  - [SoftDelete](https://thanathip41.github.io/tspace-mysql/#/model?id=softdelete)
  - [Joins Model](https://thanathip41.github.io/tspace-mysql/#/model?id=joins-model)
    - [Inner Join Model Clause](https://thanathip41.github.io/tspace-mysql/#/model?id=inner-join-model-clause)
    - [Left Join , Right Join Model Clause](https://thanathip41.github.io/tspace-mysql/#/model?id=left-join-right-join-model-clause)
    - [Cross Join Model Clause](https://thanathip41.github.io/tspace-mysql/#/model?id=cross-join-model-clause)
  - [Relationships](https://thanathip41.github.io/tspace-mysql/#/model?id=relationships)
    - [One To One](https://thanathip41.github.io/tspace-mysql/#/model?id=one-to-one)
    - [One To Many](https://thanathip41.github.io/tspace-mysql/#/model?id=one-to-many)
    - [Belongs To](https://thanathip41.github.io/tspace-mysql/#/model?id=belongs-to)
    - [Many To Many](https://thanathip41.github.io/tspace-mysql/#/model?id=many-to-many)
    - [Relation](https://thanathip41.github.io/tspace-mysql/#/model?id=relation)
    - [Deeply Nested Relations](https://thanathip41.github.io/tspace-mysql/#/model?id=deeply-nested-relations)
    - [Relation Exists](https://thanathip41.github.io/tspace-mysql/#/model?id=relation-exists)
    - [Relation Count](https://thanathip41.github.io/tspace-mysql/#/model?id=relation-count)
    - [Relation Trashed](https://thanathip41.github.io/tspace-mysql/#/model?id=relation-trashed)
    - [Built in Relation Functions](https://thanathip41.github.io/tspace-mysql/#/model?id=built-in-relation-functions)
  - [Cache](https://thanathip41.github.io/tspace-mysql/#/model?id=cache)
  - [Decorator](https://thanathip41.github.io/tspace-mysql/#/model?id=decorator)
  - [Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=type-safety)
    - [Select Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=select-type-safety-type-safety)
    - [OrderBy Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=order-by-type-safety)
    - [GroupBy Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=group-by-type-safety)
    - [Where Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=where-type-safety)
    - [Insert Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=insert-type-safety)
    - [Update Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=update-type-safety)
    - [Delete Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=delete-type-safety)
    - [Relationships Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=relationships-type-safety)
    - [Results Type Safety](https://thanathip41.github.io/tspace-mysql/#/model?id=results-type-safety)
  - [Metadata](https://thanathip41.github.io/tspace-mysql/#/model?id=metadata)
  - [Audit](https://thanathip41.github.io/tspace-mysql/#/model?id=audit)
- [Repository](https://thanathip41.github.io/tspace-mysql/#/repository)
  - [Select Statements](https://thanathip41.github.io/tspace-mysql/#/repository?id=select-statements)
  - [Insert Statements](https://thanathip41.github.io/tspace-mysql/#/repository?id=insert-statements)
  - [Update Statements](https://thanathip41.github.io/tspace-mysql/#/repository?id=update-statements)
  - [Delete Statements](https://thanathip41.github.io/tspace-mysql/#/repository?id=delete-statements)
  - [Transactions](https://thanathip41.github.io/tspace-mysql/#/repository?id=transactions)
  - [Relations](https://thanathip41.github.io/tspace-mysql/#/repository?id=relations)
- [View](https://thanathip41.github.io/tspace-mysql/#/view)
- [Stored Procedure](https://thanathip41.github.io/tspace-mysql/#/stored-procedure)
- [Blueprint](https://thanathip41.github.io/tspace-mysql/#/blueprint)
- [Cli](https://thanathip41.github.io/tspace-mysql/#/cli)
  - [Make Model](https://thanathip41.github.io/tspace-mysql/#/cli?id=make-model)
  - [Make Migration](https://thanathip41.github.io/tspace-mysql/#/cli?id=make-migration)
  - [Migrate](https://thanathip41.github.io/tspace-mysql/#/cli?id=migrate)
  - [Query](https://thanathip41.github.io/tspace-mysql/#/cli?id=query)
  - [Dump](https://thanathip41.github.io/tspace-mysql/#/cli?id=dump)
  - [Generate Models](https://thanathip41.github.io/tspace-mysql/#/cli?id=generate-models)
  - [Migration Models](https://thanathip41.github.io/tspace-mysql/#/cli?id=migration-models)
  - [Migration DB](https://thanathip41.github.io/tspace-mysql/#/cli?id=migration-db)