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

### Cluster Database
If you need strict race condition control, it is required to use multiple nodes for write and read. <br>
Avoid using a node load balancer in this case, as it may bypass proper write/read distribution and compromise consistency.<br>
To connect your application to a Cluster database, use the following configuration:

```js
DB_DRIVER = mariadb
DB_HOST = host-load-balncer ❌
DB_PORT = 3306
DB_USERNAME = root1
DB_PASSWORD = password1
DB_DATABASE = database

// ----------------------------------------------------
// example MariaDB Galera Cluster
// host1 -> Writer node
// host2, host3 -> Reader nodes

DB_CLUSTER = true
DB_DRIVER = mariadb
DB_HOST = master@host1,slave@host2,slave@host3 ✅
DB_PORT = 3306,3307,3308
DB_USERNAME = root1,root2,root3
DB_PASSWORD = password1,password2,password3
DB_DATABASE = database
```

## NodeJs

### http
```js
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { DB , sql , Model } from 'tspace-mysql';

class User extends Model {}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
  
    const usersWithModel = await new User().get();
    const usersWithDB = await new DB('users').get();
    const usersWithSqlLike = await sql().from('users')

    res.writeHead(200, { 'Content-Type': 'application/json' });

    return res.end(JSON.stringify({ data: { usersWithModel , usersWithDB, usersWithSqlLike} }));

  } catch (err : any) {
    return res.end(JSON.stringify({
      error: err.message
    }));
  }
  
});

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

```

### ExpressJs
```sh
npm install express --save

```

```js
import express, { Request, Response } from 'express'
import { DB, sql, Model } from 'tspace-mysql'

class User extends Model {}

const app = express()

app.get('/', async (req: Request, res: Response) => {
  try {
    const usersWithModel = await new User().get()
    const usersWithDB = await new DB('users').get()
    const usersWithSqlLike = await sql().from('users')

    res.json({
      data: { usersWithModel, usersWithDB, usersWithSqlLike }
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000')
})

```
### Fastify
```sh
npm install fastify --save

```

```js

import Fastify from 'fastify'
import { DB, sql, Model } from 'tspace-mysql'

class User extends Model {}

const fastify = Fastify({ logger: true })

fastify.get('/', async (request, reply) => {
  try {
    const usersWithModel = await new User().get()
    const usersWithDB = await new DB('users').get()
    const usersWithSqlLike = await sql().from('users')

    return reply.send({
      data: { usersWithModel, usersWithDB, usersWithSqlLike }
    })
  } catch (err: any) {
    return reply.status(500).send({ error: err.message })
  }
})

fastify.listen({ port: 5000 })
.then(() => {
  console.log('Server is running on http://localhost:5000')
})

```

## Bun
```sh
## MacOS/Linux
curl -fsSL https://bun.sh/install | bash

## Windows
powershell -c "irm bun.sh/install.ps1 | iex"

```

### Native
```js
import { DB, sql, Model } from 'tspace-mysql'

class User extends Model {}

const server = Bun.serve({
  port: 5000,
  async fetch(req) {
    try {
      if (new URL(req.url).pathname === '/users') {
        const usersWithModel = await new User().get()
        const usersWithDB = await new DB('users').get()
        const usersWithSqlLike = await sql().from('users')

        return new Response(
          JSON.stringify({ data: { usersWithModel, usersWithDB, usersWithSqlLike } }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      }

      return new Response('Not Found', { status: 404 })
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
})

console.log(`Server running on http://localhost:${server.port}`)

```

### Elysia
```sh
npm install elysia --save

```

```js
import { Elysia } from 'elysia'
import { DB, sql, Model } from 'tspace-mysql'

class User extends Model {}

const app = new Elysia()

app.get('/', async () => {
  try {
    const usersWithModel = await new User().get()
    const usersWithDB = await new DB('users').get()
    const usersWithSqlLike = await sql().from('users')

    return {
      data: { usersWithModel, usersWithDB, usersWithSqlLike }
    }
  } catch (err: any) {
    return {
      error: err.message
    }
  }
})

app.listen(5000)

console.log('Server is running on http://localhost:5000')

```

<div class="page-nav-cards">
  <a href="#" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Getting Started</div>
  </a>

  <a href="#/sql-like" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> SQL Like </div>
  </a>
</div>
