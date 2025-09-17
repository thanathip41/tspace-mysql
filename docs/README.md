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
// ----------------------------------------------------
// example MariaDB Galera Cluster

DB_DRIVER = mariadb
DB_HOST = host-load-balncer ❌
DB_PORT = 3306
DB_USERNAME = root1
DB_PASSWORD = password1
DB_DATABASE = database
```

```js
// ----------------------------------------------------
// MariaDB Galera Cluster
// host1 -> Master node
// host2, host3 -> slave nodes
DB_CLUSTER = true
DB_DRIVER = mariadb
DB_HOST = master@host1,slave@host2,slave@host3 ✅
DB_PORT = 3306,3307,3308
DB_USERNAME = root1,root2,root3
DB_PASSWORD = password1,password2,password3
DB_DATABASE = database
```
## Example Framework
A collection of practical code samples to help you get started quickly.<br>
Examples of fetching data from a database in four ways:

- [SQL-like](sql-like?id=select-statements)
- [DB](query-builder?id=select-statements)
- [Model](model)
- [Repository](repository?id=select-statements)

The connection is configured using a .env file with the following settings:

```sh
DB_DRIVER = postgres ## mysql mariadb choose one for connection
DB_HOST = localhost
DB_PORT = 5432
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
```
### NodeJs
#### Http
This example demonstrates how to create a simple HTTP server using Node.js built-in `http` module.
```sh
npm intall tspace-mysql --save
```
```js
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { DB, sql, Model, Repository } from 'tspace-mysql';

class User extends Model {}

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
  
    const usersWithSqlLike = await sql().from('users');
    const usersWithDB = await new DB('users').findMany();
    const usersWithModel = await new User().findMany();
    const usersWithRepository = await Repository(User).findMany();


    res.writeHead(200, { 'Content-Type': 'application/json' });

    return res.end(JSON.stringify({
      usersWithRepository
      usersWithModel, 
      usersWithDB, 
      usersWithSqlLike
    }));

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

#### ExpressJs
An example showing how to create a web server using Express.js, a minimal and flexible Node.js web framework.
```sh
npm install express --save
npm intall tspace-mysql --save
```

```js
import express, { Request, Response } from 'express'
import { DB, sql, Model, Repository } from 'tspace-mysql';

class User extends Model {}

const app = express()

app.get('/', async (req: Request, res: Response) => {
  try {

    const usersWithSqlLike = await sql().from('users');
    const usersWithDB = await new DB('users').findMany();
    const usersWithModel = await new User().findMany(); 
    const usersWithRepository = await Repository(User).findMany();

    return res.json({
      usersWithRepository
      usersWithModel, 
      usersWithDB, 
      usersWithSqlLike
    })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000')
})

```
#### Fastify
An example demonstrating how to create a fast and low-overhead web server using Fastify, a high-performance Node.js framework.

```sh
npm install fastify --save
npm intall tspace-mysql --save
```

```js

import Fastify from 'fastify'
import { DB, sql, Model, Repository } from 'tspace-mysql';

class User extends Model {}

const fastify = Fastify({ logger: true })

fastify.get('/', async (request, reply) => {
  try {
    
    const usersWithSqlLike = await sql().from('users');
    const usersWithDB = await new DB('users').findMany();
    const usersWithModel = await new User().findMany();
    const usersWithRepository = await Repository(User).findMany();


    return reply.send({
      usersWithRepository
      usersWithModel, 
      usersWithDB, 
      usersWithSqlLike
    })
  } catch (err: any) {
    return reply.status(500).send({ error: err.message })
  }
})

fastify.listen({ port: 5000 })
.then(() => {
  console.log('Server is running on http://localhost:5000')
})

// ts-node run src/index.ts
```
#### Nestjs
An example showing how to build a scalable, modular, and maintainable backend using NestJS, a progressive Node.js framework built with TypeScript.
```sh
npm install -g @nestjs/cli

nest new nestjs

npm intall tspace-mysql --save

# nestjs/
#  ├─ src/
#  |   ├─ entities
#  |   |  └─ user.entity.ts
#  │   ├─ app.controller.ts
#  │   ├─ app.module.ts
#  │   ├─ app.service.ts
#  │   └─ main.ts
#  ├─ package.json
#  ├─ tsconfig.json
#  └─ ...
```
```js
// src/entities/user.entity.ts
import { Model }  from 'tspace-mysql';
export class User extends Model {}

// --------------------------------------------------

// src/app.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { NestInject, NestRepository } from 'tspace-mysql';
import { User } from './entities/User'

@Injectable()
export class AppService {
  constructor(
    @Inject(NestInject(User)) // send by app.module
    private userRepository: NestRepository<User>
  ) {}
  async findAll() {
    const users = await this.userRepository.findMany();
    return { users };
  }
}
// --------------------------------------------------

// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class UsersController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getData() {
    return {
      ...await this.appService.findAll()
    };
  }
}

// --------------------------------------------------

// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NestProvider } from 'tspace-mysql';
import { User } from './entities/user.entity'

@Module({
  controllers: [AppController],
  providers: [AppService, NestProvider(User)] // register this
})
export class AppModule {}
// --------------------------------------------------

// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppModule } from './app.module';

@Module({
  imports: [AppModule],
})
export class AppModule {}

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
  console.log('Server is running on http://localhost:5000');
}
bootstrap();

// npm run dev
```

### Bun
```sh
## MacOS/Linux
curl -fsSL https://bun.sh/install | bash

## Windows
powershell -c "irm bun.sh/install.ps1 | iex"

```

#### Bun Native
This example demonstrates how to create a simple HTTP server using Bun's built-in runtime capabilities without any additional frameworks.

```js
import { DB, sql, Model, Repository } from 'tspace-mysql';

class User extends Model {}

const server = Bun.serve({
  port: 5000,
  async fetch(req) {
    try {
      if (new URL(req.url).pathname === '/') {

        const usersWithSqlLike = await sql().from('users');
        const usersWithDB = await new DB('users').findMany();
        const usersWithModel = await new User().findMany();
        const usersWithRepository = await Repository(User).findMany();

        return new Response(
          JSON.stringify({ 
            usersWithRepository
            usersWithModel, 
            usersWithDB, 
            usersWithSqlLike
          }),
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
// bun run src/index.ts

```

#### Elysia
An example showing how to build a fast and modern web server using Elysia, a lightweight and high-performance framework.

```sh
bun create elysia elysia
cd elysia
bun add tspace-mysql

```

```js
import { Elysia } from 'elysia'
import { DB, sql, Model, Repository } from 'tspace-mysql';

class User extends Model {}

const app = new Elysia()

app.get('/', async () => {
  try {

    const usersWithSqlLike = await sql().from('users');
    const usersWithDB = await new DB('users').findMany();
    const usersWithModel = await new User().findMany();
    const usersWithRepository = await Repository(User).findMany();


    return {
      usersWithRepository
      usersWithModel, 
      usersWithDB, 
      usersWithSqlLike
    }
  } catch (err: any) {
    return {
      error: err.message
    }
  }
})

app.listen(5000)

console.log('Server is running on http://localhost:5000')

// bun run src/index.ts

```

#### Hono
An example showing how to build a fast and modern web server using Hono, optimized for performance and simplicity.
```sh
bun create hono@latest hono
cd hono
bun add tspace-mysql

```

```js
import { Hono } from 'hono'
import { DB, sql, Model, Repository } from 'tspace-mysql';

class User extends Model {}

const app = new Hono()

app.get('/', async (c) => {
  try {

    const usersWithSqlLike = await sql().from('users');
    const usersWithDB = await new DB('users').findMany();
    const usersWithModel = await new User().findMany();
    const usersWithRepository = await Repository(User).findMany();


    return c.json({ 
      usersWithRepository
      usersWithModel, 
      usersWithDB, 
      usersWithSqlLike
    })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})

console.log('Server running on http://localhost:5000')

export default { 
  port: 5000, 
  fetch: app.fetch, 
} 

// bun run src/index.ts
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
