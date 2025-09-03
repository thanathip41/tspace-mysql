# TspaceMysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

tspace-mysql is an Object-Relational Mapping (ORM) tool designed to run seamlessly in Node.js and is fully compatible with TypeScript. It consistently supports the latest features in both TypeScript and JavaScript, providing additional functionalities to enhance your development experience.

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
## Install tspace-mysql locally for your project
npm install tspace-mysql --save

## Install tspace-mysql globally (optional)
npm install -g tspace-mysql

## Install database drivers if needed:
## For MariaDB
npm install mariadb --save

## For PostgreSQL
npm install pg --save

## MySQL2 driver is installed by default with tspace-mysql
```

## Configuration

To establish a connection, the recommended method for creating your environment variables is by using a '.env' file. using the following:

```js
DB_DRIVER = mysql 
// DB_DRIVER = mariadb
// DB_DRIVER = postgres
DB_HOST = localhost;
DB_PORT = 3306;
DB_USERNAME = root;
DB_PASSWORD = password;
DB_DATABASE = database;

/**
 * @default
 *  DB_CONNECTION_LIMIT = 10
 *  DB_QUEUE_LIMIT      = 0
 *  DB_TIMEOUT          = 60000
 *  DB_DATE_STRINGS     = false
 */
```

<div class="page-nav-cards">
  <a href="#" class="prev-card">
    <div class="nav-label"> 
        <span style="color:#fff; font-size:16px;">←</span> 
        Previous
    </div>
    <div class="nav-title"> Getting Started</div>
  </a>

  <a href="#/sql-like" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title"> SQL Like </div>
  </a>
</div>
