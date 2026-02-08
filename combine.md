# README.md

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
DB_HOST = host1,host2,host3 ✅ // host1 still master by default
// if you want to specific master or slave
// master can be more than 1
// DB_HOST = master@host1,slave@host2,slave@host3 
DB_PORT = 3306,3307,3308
DB_USERNAME = root1,root2,root3
DB_PASSWORD = password1,password2,password3
DB_DATABASE = database
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


# backup.md

# Backup

To backup a database, you can perform the following steps:

```js
/**
 *
 * @param {string} database Database selected
 * @param {object | null} to defalut new current connection
 */
const backup = await new DB().backup({
    database: 'try-to-backup',  // clone current database to this database
    to ?: {
        host: 'localhost',
        port : 3306,
        username: 'username',
        password: 'password',
    }
})
/**
 *
 * @param {string} database Database selected
 * @param {string} filePath file path
 * @param {object | null} conection defalut current connection
 */
const backupToFile = await new DB().backupToFile({
    database: 'try-to-backup',
    filePath: 'backup.sql',
    connection ?: {
        host: 'localhost',
        port : 3306,
        database: 'database'
        username: 'username',
        password: 'password',
    }
})
// backupToFile => backup.sql

/**
 *
 * @param {string} database new db name
 */
await new DB().cloneDB('try-to-clone')

```

<div class="page-nav-cards">
  <a href="#/condition" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Condition </div>
  </a>

  <a href="#/injection" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Injection </div>
  </a>
</div>

# blueprint.md

# Blueprint

Blueprint is a tool used for defining database schemas programmatically. 
It allows developers to describe the structure of their database tables using a simple and intuitive syntax rather than writing SQL queries directly., you may use the:

```js
import { Schema , Blueprint , DB } from 'tspace-mysql'
(async () => {
    await new Schema().table('users', {
        id           : Blueprint.int().notNull().primary().autoIncrement(),
        // or id     : Blueprint.serial().primary(),
        uuid         : Blueprint.varchar(120).null()
        name         : Blueprint.varchar(120).default('name'),
        email        : Blueprint.varchar(255).unique().notNull(),
        email_verify : Blueprint.tinyInt(),
        password     : Blueprint.varchar(255),
        json         : Blueprint.json(),
        created_at   : Blueprint.null().timestamp(),
        updated_at   : Blueprint.null().timestamp(),
        deleted_at   : Blueprint.null().timestamp()
    })
    /**
     *
     *  @Faker fake data 5 raw
     *  await new DB().table('users').faker(5)
    */
})()

/**
 * To add types of the schema to the database
 * @Types
 *
*/
int (number)
tinyInt (number)
bigInt (number)
double ()
float ()
json ()
varchar (number)
char (number)
longText()
mediumText()
tinyText()
text()
enum(...n)
date()
dateTime()
timestamp ()

/**
 * To add attributes of the schema to the database
 * @Attrbuites
 *
*/
unsigned()
unique()
null()
notNull()
primary()
default(string)
defaultTimestamp()
autoIncrement()

/**
 *  To add a foreign key to the column
 *  @ForeginKey
 */
foreign({ references : ${COLUMN} , on : ${TABLE-NAME OR MODEL CLASSES} })

/**
 *  To add a index key to the column
 *  @indexKey
 */
index()
```

<div class="page-nav-cards">
  <a href="#/stored-procedure" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Stored Procedure </div>
  </a>

  <a href="#/cli" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Cli </div>
  </a>
</div>

# cli.md


# Cli

To get started, let's install tspace-mysql
you may use a basic cli :

```sh
npm install tspace-mysql -g

```

## Make Model

The command will be placed Model in the specific directory.

```sh

/**
  *
  * @make Model
  * @options
  * @arg --m  => created scheme table for migrate. short cut migration table like Make Migration
  * @arg --dir=directory => created model in directory. default root directory
  * @arg --type=js // extension js. default ts
  */
tspace-mysql make:model <model name> --m  --dir=.... --type=....

tspace-mysql make:model User --m --dir=app/Models
/**
  *
  * @Ex directory
  */
- node_modules
- app
  - Models
     User.ts
```

## Make Migration

The command will be placed Migration in the specific directory.

```sh
/**
  *
  * @make Migration Table
  * @options
  * @arg --dir=directory => created scheme table in directory. default root directory
  * @arg --type=js // extension js default ts
  */
tspace-mysql make:migration <table name> --type=... --dir=....

tspace-mysql make:migration users --dir=app/Models/Migrations
/**
 *
 * @Ex directory
 */
- node_modules
- app
  - Models
    - Migrations
      create_users_table.ts
    User.ts
```

## Migrate

```sh
/**
  *
  * @run Migrate table
  * @options
  * @arg --dir=directory => find migrate in directory. default find in root folder
  * @arg --type=js // extension js default ts
  */
tspace-mysql migrate <folder> --type=<type file js or ts> --dir=<directory for migrate>

tspace-mysql migrate --dir=app/Models/Migrations --type=js

/**
 *
 * @Ex directory
 */
- node_modules
- app
  - Models
    - Migrations
      create_users_table.ts
      create_posts_table.ts
    User.ts
    Post.ts
// => migrate all schemas in folder <Migrations>. created into database
```

# Query

The command will execute a query.

```sh
tspace-mysql query "SELECT * FROM users"

```

# Dump

The command will dump the database or table into a file.

```sh
tspace-mysql dump:db --dir=<folder for dump> --values // backup with values in the tables

tspace-mysql dump:table "table_name" --dir=<folder for dump> --values // backup with values in the table

```

# Generate Models

The command will generate models from tables in the database.

```sh
tspace-mysql generate:models --dir=<folder for creating>

tspace-mysql generate:models --dir=app/Models --env=development --decorators

```

# Migration Models

The command will generate migrations based on the schema in your models to a .sql file, 
can also push the migration files to the database.

```sh
/**
  *
  * @arg --push will push the migration files to the database
  * @arg --generate will generate the migration files
  */
tspace-mysql migrations:models --dir=<path-to-migration> --models=<path to your models> --generate
tspace-mysql migrations:models --dir=<path-to-migration> --push

tspace-mysql migrations:models --models=src/app/models --dir=migrations  --generate
tspace-mysql migrations:models --dir=migrations --push

```

# Migration DB

The command will generate migrations based on the schema in your database to a .sql file, 
can also push the migration files to the database.

```sh
/**
  *
  * @arg --push will push the migration files to the database
  * @arg --generate will generate the migration files
  */
tspace-mysql migrations:db --dir=<path-to-migration> --generate --env=<YOUR_ENV> -filename=<YOUR_FILENAME>
tspace-mysql migrations:db --dir=<path-to-migration> --push

tspace-mysql migrations:db --dir=migrations --generate --filename=dump.sql --env=development
tspace-mysql migrations:db --dir=migrations --push --filename=dump.sql --env=development

```

<div class="page-nav-cards">
  <a href="#/blueprint" class="prev-card" >
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Blueprint </div>
  </a>
  <a href="#/" class="next-card">
      <div class="nav-label">
          Next
          <span class="page-nav-arrow">→</span>
      </div>
      <div class="nav-title"> Getting Started </div>
    </a>
</div>

# connection.md

# Connection

When establishing a connection, you can specify options as follows:

```js
const connection = await new DB().getConnection({
    host: 'localhost',
    port : 3306,
    database: 'database'
    username: 'username',
    password: 'password',
})

const users = await new DB('users')
.bind(connection) // don't forget this
.findMany()
```
<div class="page-nav-cards">
  <a href="#/race-condition" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Race Condition </div>
  </a>

  <a href="#/backup" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Backup </div>
  </a>
</div>

# database-transactions.md

# Database Transactions

Within a database transaction, you can utilize the following:

```js
const trx = await new DB().beginTransaction();

try {
  /**
   *
   * @startTransaction start transaction in scopes function
   */
  await trx.startTransaction();

  const user = await new User()
    .create({
      name: `tspace`,
      email: "tspace@example.com",
    })
    /**
     *
     * bind method for make sure this trx has same transaction in trx
     * @params {Function} trx
     */
    .bind(trx)
    .save();

  const posts = await new Post()
    .createMultiple([
      {
        user_id: user.id,
        title: `tspace-post1`,
      },
      {
        user_id: user.id,
        title: `tspace-post2`,
      },
      {
        user_id: user.id,
        title: `tspace-post3`,
      },
    ])
    .bind(trx) // don't forget this
    .save();

  /**
   *
   * @commit commit transaction to database
   */
  // After your use commit if use same trx for actions this transction will auto commit
  await trx.commit();

  // If you need to start a new transaction again, just use wait trx.startTransaction();

  const postsAfterCommited = await new Post()
    .createMultiple([
      {
        user_id: user.id,
        title: `tspace-post1`,
      },
      {
        user_id: user.id,
        title: `tspace-post2`,
      },
      {
        user_id: user.id,
        title: `tspace-post3`,
      },
    ])
    // Using this trx now will auto-commit to the database.
    .bind(trx) // If you need to perform additional operations, use await trx.startTransaction(); again.
    .save();

   
    // Do not perform any operations with this trx.
    // The transaction has already been committed, and the trx is closed.
    // Just ensure everything is handled at the end of the transaction.
    await trx.end();
  
} catch (err) {
  /**
   *
   * @rollback rollback transaction
   */
  await trx.rollback();
}
```

<div class="page-nav-cards">
  <a href="#/query-builder" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Query Builder </div>
  </a>

  <a href="#/race-condition" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title">Race Condition</div>
  </a>
</div>

# generating-model-classes.md

# Generating Model Classes

To get started, install the 'tspace-mysql' package globally using the following npm command:

```js
/**
 *
 * @install global command
 */
npm install tspace-mysql -g

/**
 *
 * @make Model
 */
tspace-mysql make:model <model name> --dir=< directory >

# tspace-mysql make:model User --dir=App/Models
# App/Models/User.ts
```

# injection.md

# Injection

The 'tspace-mysql' library is configured to automatically escape SQL injection by default.
Let's example a escape SQL injection and XSs injection:

```js
const input = "admin' OR '1'='1";
DB.escape(input);
// "admin\' OR \'1\'=\'1"

//XSS
const input = "text hello!<script>alert('XSS attack');</script>";
DB.escapeXSS(input);
// "text hello!"
```

<div class="page-nav-cards">
  <a href="#/backup" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Backup </div>
  </a>

  <a href="#/model" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Model </div>
  </a>
</div>

# integrations.md

# Integrations
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
## NodeJs
### Http
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

### ExpressJs
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
### Fastify
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
### Nestjs
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
export class User extends Model {};

// --------------------------------------------------

// src/app.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Nest , T } from 'tspace-mysql';
import { User } from './entities/user.entity.ts'

@Injectable()
export class AppService {
  constructor(
    @Nest.InjectRepository(User) // send by app.module
    private userRepository: T.Repository<User>
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
export class AppController {
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
import { Nest } from 'tspace-mysql';
import { User } from './entities/user.entity'

@Module({
  controllers: [AppController],
  providers: [AppService, Nest.Provider(User)] // register this
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

## Bun
```sh
## MacOS/Linux
curl -fsSL https://bun.sh/install | bash

## Windows
powershell -c "irm bun.sh/install.ps1 | iex"

```

### Bun Native
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

### Elysia
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

### Hono
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
  <a href="#/cli" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Cli</div>
  </a>

  <a href="#" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Getting Started </div>
  </a>
</div>

# model.md

# Model

Your database schema using models. These models represent tables in the database
Let's example a basic model class:

```js
import { Model } from "tspace-mysql";
// If you want to specify a global setting for the 'Model'
Model.global({
  uuid: true,
  softDelete: true,
  timestamp: true,
  logger: true,
});

class User extends Model {
  constructor() {
    super();
    /**
     *
     * Assign setting global in your model
     * @useMethod
     * this.usePattern('camelCase') // => default 'snake_case'
     * this.useCamelCase()
     * this.useSnakeCase()
     * this.useLogger()
     * this.useDebug()
     * this.usePrimaryKey('id')
     * this.useTimestamp({
     *    created_at : 'created_at',
     *    updated_at : 'updated_at'
     * }) // runing a timestamp when insert or update
     * this.useSoftDelete('deleted_at') // => default target to colmun deleted_at
     * this.useTable('users')
     * this.useTableSingular() // => 'user'
     * this.useTablePlural() // => 'users'
     * this.useUUID('uuid') // => runing a uuid (universally unique identifier) when insert new data
     * this.useMiddleware(() => func..)
     * this.useAfter([(r) => console.log(r)])
     * this.useObserver(Observe)
     * this.useSchema ({
     *     id          : Blueprint.int().notNull().primary().autoIncrement(),
     *     uuid        : Blueprint.varchar(50).null(),
     *     name        : Blueprint.varchar(191).notNull(),
     *     email       : Blueprint.varchar(191).notNull(),
     *     created_at  : Blueprint.timestamp().null(),
     *     updated_at  : Blueprint.timestamp().null(),
     *     deleted_at  : Blueprint.timestamp().null()
     *  }) // auto-generated table when table is not exists and auto-create column when column not exists
     *
     *  this.useLifecycle('beforeInsert', () => console.log('beforeInsert'))
     *  this.useLifecycle('afterInsert',  () => console.log('afterInsert'))
     *  this.useLifecycle('beforeUpdate', () => console.log('beforeUpdate'))
     *  this.useLifecycle('afterUpdate',  () => console.log('afterUpdate'))
     *  this.useLifecycle('beforeRemove', () => console.log('beforeRemove'))
     *  this.useLifecycle('afterRemove',  () => console.log('afterRemove'))
     * 
     *  this.useTransform({
     *    name : {
     *       to   : async (name) => `${name}-> transform@before`,
     *       from : async (name) => `${name}-> transform@after`,
     *    }
     *  })
     * 
     *  this.useHooks([
     *    (r:any) => console.log(r,'hook1'),
     *    (r:any) => console.log(r,'hook2'),
     *    (r:any) => console.log(r,'hook3')
     *  ])
     *  
     *  // validate input when create or update reference to the schema in 'this.useSchema'
     *  this.useValidateSchema({
     *   id : Number,
     *   uuid :  Number,
     *   name : {
     *       type : String,
     *       length : 191
     *       require : true
     *   },
     *   email : {
     *       type : String,
     *       require : true,
     *       length : 191,
     *       match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
     *       unique : true,
     *       fn : (email : string) => !/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
     *   },
     *   created_at : Date,
     *   updated_at : Date,
     *   deleted_at : Date
     *   })
     */

    /*
     * the "snake case", plural name of the class will be used as the table name
     *
     * @param {string} name The table associated with the model.
     */
    this.useTable("users");
  }
}
export { User };
export default User;
```

## Generating

To get started, install the 'tspace-mysql' package globally using the following npm command:

```js
/**
 *
 * @install global command
 */
npm install tspace-mysql -g

/**
 *
 * @make Model
 */
tspace-mysql make:model <model name> --dir=< directory >

# tspace-mysql make:model User --dir=App/Models
# App/Models/User.ts
```


## Basic Setup

### Table Name

```js
import { Model } from 'tspace-mysql'
class User extends Model {
    constructor() {
      super()
      // By default, the model knows that the table name for this User is 'users'

      this.useTable('fix_table') // fixtable
      this.useTablePlural() // users
      this.useTableSingular() // user
    }
}

```

### Pattern

```js

import { Model } from 'tspace-mysql'
class UserPhone extends Model {
    constructor() {
      super()
      // By default, the model is pattern snake_case
      // The table name is user_phones
      this.useSnakeCase()

      this.useCamelCase()
       // The table name is userPhones
    }
}

// set the pattern CamelCase for the model
const userPhone = await new UserPhone().where('user_id',1).findOne()
// covert 'user_id' to 'userId'
// SELECT * FROM `userPhones` WHERE `userPhones`.`userId` = '1' LIMIT 1;

// avoid the pattern CamelCase for the model
const userPhone = await new UserPhone().where(DB.freeze('user_id'),1).findOne()
// SELECT * FROM `userPhones` WHERE `userPhones`.`user_id` = '1' LIMIT 1;

```

### UUID

```js

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
    this.useUUID() // insert uuid when creating
  }
}

```

### Timestamp

```js

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
    // insert created_at and updated_at when creating
    // update updated_at when updating
    // 'created_at' and 'updated_at' still relate to pettern the model
    // this.useCamelCase() will covert 'created_at' to 'created_at' and 'updated_at' to 'updated_at'
    this.useTimestamp() 

    // custom the columns
    this.useTimestamp({
      created_at : 'created_atCustom',
      updated_at : 'updated_atCustom'
    })

  }
}

```

### Debug

```js

import { Model } from 'tspace-mysql'
class User extends Model {
    constructor() {
      super()
      this.useDebug() // show the query sql in console when executing
    }
}

```
### Observer

```js

class Observe {

  public selected(results) {
    console.log({ results , selected : true })
  }

  public created(results) {
      console.log({ results , created : true })
  }

  public updated(results) {
    console.log({ results , updated : true })
  }

  public deleted(results) {
    console.log({ results , deleted : true })
  }
}

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
    this.useObserver(Observe) // returning to the observers by statements
  }
}

```

### Logger

```js

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
    // keep logging everything except select  to the table '$loggers'
    // the table will automatically be created
    this.useLogger()

    // keep logging everything
    this.useLogger({
      selected : true,
      inserted : true,
      updated  : true,
      deleted  : true,
    })
  }
}

```

### Hooks

```js

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
      // when executed will returning the results to any hooks function
      this.useHooks([
        (results1) => console.log(results1),
        (results2) => console.log(results2),
        (results3) => console.log(results3)
      ])
  }
}

```

## Global Scope
```js

class User extends Model {
  constructor() {
    super()

    // Every query will have the global scope applied.
    this.globalScope((query : User) => {
      return query.select('id').where('id' , '>' , 10).orderBy('id')
    })
  }
}

const user = await new User().findMany()

// SELECT `users`.`id` FROM `users` WHERE `users`.`id` > '10' ORDER BY `users`.`id` ASC LIMIT 1

```

## Joins Model

## Inner Join Model Clause

```js
await new User().joinModel(User, Post).findMany();
// SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` INNER JOIN `posts` ON `users`.`id` = `posts`.`user_id`;

// if the model use soft delete
await new User().joinModel(User, Post).findMany();
// SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` 
// INNER JOIN `posts` ON `users`.`id` = `posts`.`user_id` 
// WHERE `posts`.`deleted_at` IS NULL AND `users`.`deleted_at` IS NULL;

await new User().select(`${User.table}.*`,`${Post.table}.*`).joinModel(User, Post).findMany();
// SELECT users.*, posts.* FROM `users` 
// INNER JOIN `posts` ON `users`.`id` = `posts`.`user_id` 
// WHERE `posts`.`deleted_at` IS NULL AND `users`.`deleted_at` IS NULL;

await new User().select('u.*','p.*')
.joinModel({ model : User , key : 'id' , alias : 'u' }, { model : Post , key : 'user_id', alias : 'p'})
.findMany();
// SELECT u.*, p.* FROM `users` AS `u` 
// INNER JOIN `posts` AS `p` ON `u`.`id` = `p`.`user_id` 
// WHERE `p`.`deleted_at` IS NULL AND `u`.`deleted_at` IS NULL;

await new DB("posts")
.join((join) => {
  return join
  .on('posts.user_id','users.id')
  .on('users.id','post_user.user_id')
  .and('users.id','posts.user_id')
})
.findMany()
//  SELECT * FROM `posts` 
// INNER JOIN `users` ON `posts`.`user_id` = `users`.`id` 
// INNER JOIN `post_user` ON `users`.`id` = `post_user`.`user_id` AND `users`.`id` = `posts`.`user_id`;
```
## Left Join, Right Join Model Clause

```js
await new User().leftJoinModel(User, Post).findMany();
//  SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` LEFT JOIN `posts` ON `users`.`id` = `posts`.`user_id`;

await new User().rightJoinModel(User, Post).findMany();
//  SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` RIGHT JOIN `posts` ON `users`.`id` = `posts`.`user_id`;
```

## Cross Join Model Clause

```js
await new User().crossJoinModel(User, Post).findMany();
//  SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` CROSS JOIN `posts` ON `users`.`id` = `posts`.`user_id`;
```

## Relationships

Relationships are defined as methods on your Model classes.
Let's example a basic relationship:

### One To One

A one-to-one relationship is used to define relationships where a single model is the parent to one child models

```js
import { Model } from 'tspace-mysql'
import Phone  from '../Phone'
class User extends Model {
    constructor(){
        super()
        this.useTimestamp()
        /**
         *
         * @hasOne Get the phone associated with the user.
         * @relationship users.id -> phones.user_id
         */
        this.hasOne({ name : 'phone' , model : Phone })
    }
    /**
     * Mark a method for relationship
     * @hasOne Get the phone associated with the user. using function callback
     * @function
     */
    phone (callback) {
      return this.hasOneBuilder({ name : 'phone' , model : Phone } , callback)
    }
}
export default User

+--------------------------------------------------------------------------+

import User from '../User'
const user = await new User().relations('phone').findOne() // You can also use the method .with('roles').
// user?.phone => {...}
const userUsingFunction = await new User().phone().findOne()
// userUsingFunction?.phone => {...}
```

### One To Many

A one-to-many relationship is used to define relationships where a single model is the parent to one or more child models.

```js
import { Model } from 'tspace-mysql'
import Comment  from '../Comment'
class Post extends Model {
    constructor(){
        super()
        this.useTimestamp()
        /**
         *
         * @hasMany Get the comments for the post.
         * @relationship posts.id -> comments.post_id
         */
        this.hasMany({ name : 'comments' , model : Comment })
    }
    /**
     *
     * @hasManyQuery Get the comments for the post. using function callback
     * @function
     */
    comments (callback) {
        return  this.hasManyBuilder({ name : 'comments' , model : Comment } , callback)
    }
}
export default Post

+--------------------------------------------------------------------------+

import Post from '../Post'
const posts = await new Post().relations('comments').findOne()
// posts?.comments => [{...}]
const postsUsingFunction = await new Post().comments().findOne()
// postsUsingFunction?.comments => [{...}]
```

### Belongs To

A belongsto relationship is used to define relationships where a single model is the child to parent models.

```js
import { Model } from 'tspace-mysql'
import User  from '../User'
class Phone extends Model {
    constructor(){
        super()
        this.useTimestamp()
        /**
         *
         * @belongsTo Get the user that owns the phone.
         * @relationship phones.user_id -> users.id
         */
        this.belognsTo({ name : 'user' , model : User })
    }
    /**
     *
     * @belongsToBuilder Get the user that owns the phone.. using function callback
     * @function
     */
    user (callback) {
        return this.belongsToBuilder({ name : 'user' , model : User }, callback)
    }
}
export default Phone

+--------------------------------------------------------------------------+

import Phone from '../Phone'
const phone = await new Phone().relations('user').findOne()
// phone?.user => {...}
const phoneUsingFunction = await new Phone().user().findOne()
// phoneUsingFunction?.user => {...}
```

### Many To Many

Many-to-many relations are slightly more complicated than hasOne and hasMany relationships.

```js
import { Model } from 'tspace-mysql'
import Role from '../Role'
class User extends Model {
    constructor(){
        super()
        this.useTimestamp()
        /**
         *
         * @belongsToMany Get The roles that belong to the user.
         * @relationship users.id , roles.id => role_user.user_id , role_user.role_id
         */
        this.belognsToMany({ name : 'roles' , model : Role })
    }
    /**
     * @belongsToBuilder Get the user that owns the phone.. using function callback
     * @function
     */
    roles (callback) {
        return this.belognsToManyBuilder({ model : Role } , callback)
    }
}
export default User

+--------------------------------------------------------------------------+

import User from '../User'
const user = await new User().relations('roles').findOne()
// user?.roles => [{...}]
const userUsingFunction = await new User().roles().findOne()
// user?.roles => [{...}]
```

### Relation

Relationships are connections between entities. 
Let's consider an example of a relationship:

```js

+-------------+--------------+----------------------------+
|                     table users                         |                    
+-------------+--------------+----------------------------+
| id          | username     | email                      |
|-------------|--------------|----------------------------|
| 1           | tspace1      | tspace1@gmail.com          |
| 2           | tspace2      | tspace2@gmail.com          |
| 3           | tspace3      | tspace3@gmail.com          |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                     table posts                         |
+-------------+--------------+----------------------------+
| id          | user_id      | title                      |
|-------------|--------------|----------------------------|
| 1           | 1            | posts 1                    |
| 2           | 1            | posts 2                    |
| 3           | 3            | posts 3                    |
+-------------+--------------+----------------------------+

import { Model } from 'tspace-mysql'

class User extends Model {
    constructor(){
      super()
      this.hasMany({ name : 'posts' , model : Post })
    }
}

class Post extends Model {
    constructor(){
      super()
      this.belongsTo({ name : 'user' , model : User })
    }
}

await new User()
.relations('posts')
.findOne()
// SELECT * FROM `users` LIMIT 1;
// SELECT * FROM `posts` WHERE `posts`.`userId` IN (...);

/*
 * @returns 
 *  {
 *      id : 1,
 *      username:  "tspace1",
 *      email : "tspace1@gmail.com",
 *      posts : [
 *        {
 *           id : 1 ,
 *           user_id : 1,
 *           title : "post 1"
 *        },
 *        {
 *           id : 2 ,
 *           user_id : 1,
 *           title : "post 2"
 *        }
 *      ]
 *  }
*/

/**
 * Query users that have related posts matching a condition,
 * without loading the related posts (uses WHERE EXISTS)
 */
await new User()
.whereHas("posts", (query) => query.where('title','LIKE',"%post%"))
.findOne()
/** 
  SELECT * FROM `users` 
  WHERE EXISTS (
    SELECT 1 FROM `posts` 
    WHERE `posts`.`title` LIKE '%post%' AND `users`.`id` = `posts`.`user_id`
  ) 
  LIMIT 1
*/

```

### Deeply Nested Relations

Relationships can involve deep connections. 
Let's consider an example of a deep relationship:

```js
import { Model } from 'tspace-mysql'

class User extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'posts' , model : Post })
    }
}
+--------------------------------------------------------------------------+
class Post extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'comments' , model : Comment })
        this.belongsTo({ name : 'user' , model : User })
        this.belongsToMany({ name : 'users' , model : User , modelPivot : PostUser })
    }
}
+--------------------------------------------------------------------------+
class Comment extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'users' , model : User })
        this.belongsTo({ name : 'post' , model : Post })
    }
}

class PostUser extends Model {}
+--------------------------------------------------------------------------+
// Deeply nested relations
await new User()
.relations('posts')
.relationQuery('posts', (query : Post) => {
    return query
    .relations('comments','user','users')
    .relationQuery('comments', (query : Comment) => {
        return query.relations('user','post')
    })
    .relationQuery('user', (query : User) => {
        return query.relations('posts').relationQuery('posts',(query : Post)=> {
            return query.relations('comments','user')
            // relation n, n, ...n
        })
    })
    .relationQuery('users', (query : User) => {
        return query
    })
    .relationQuery('users', (query : PostUser) => {
        return query
    }, { pivot : true })
})
.findMany()

// Select some columns in nested relations
await new User()
.relations('posts')
.relationQuery('posts', (query : Post) => query.select('id','user_id','title'))
.findMany()

// Where some columns in nested relations
await new User()
.relations('posts')
.relationQuery('posts', (query : Post) => query.whereIn('id',[1,3,5]))
.findMany()

// Sort data in  nested relations
await new User()
.relations('posts')
.relationQuery('posts', (query : Post) => query.latest('id'))
.findMany()

// Limit data in  nested relations
await new User()
.relations('posts')
.relationQuery('posts', (query : Post) => {
    return query
    .limit(1)
    .relations('comments')
    .relationQuery('comments', (query : Comment) => query.limit(1))
})
.findMany()

```

### Relation Exists

Relationships can return results only if they are not empty in relations, considering soft deletes.
Let's illustrate this with an example of an existence check in relations:

```js
+-------------+--------------+----------------------------+--------------------+
|                     table users                         |                    |
+-------------+--------------+----------------------------+--------------------+
| id          | username     | email                      | deleted_at         |
|-------------|--------------|----------------------------|--------------------|
| 1           | tspace1      | tspace1@gmail.com          |                    |
| 2           | tspace2      | tspace2@gmail.com          |                    |
| 3           | tspace3      | tspace3@gmail.com          |                    |
+-------------+--------------+----------------------------+--------------------+


+-------------+--------------+----------------------------+--------------------+
|                     table posts                         |                    |
+-------------+--------------+----------------------------+--------------------+
| id          | user_id      | title                      | deleted_at         |
|-------------|--------------|----------------------------|--------------------|
| 1           | 1            | posts 1                    |2020-07-15 00:00:00 |
| 2           | 2            | posts 2                    |                    |
| 3           | 3            | posts 3                    |2020-07-15 00:00:00 |
+-------------+--------------+----------------------------+--------------------+

import { Model } from 'tspace-mysql'

class User extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'posts' , model : Post })
        this.useSoftDelete()
    }
}

+--------------------------------------------------------------------------+

class Post extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'comments' , model : Comment })
        this.belongsTo({ name : 'user' , model : User })
        this.useSoftDelete()
    }
}
// normal relations
await new User().relations('posts').findMany()
// SELECT * FROM `users` WHERE `users`.`deleted_at`;
// SELECT * FROM `posts` WHERE `posts`.`userId` IN (...) AND `posts`.`deleted_at` IS NULL;

/*
 * @returns [
 *  {
 *      id : 1,
 *      username:  "tspace1",
 *      email : "tspace1@gmail.com",
 *      posts : []
 *  },
 *  {
 *      id : 2,
 *      username:  "tspace2",
 *      email : "tspace2@gmail.com",
 *      posts : [
 *       {
 *          id : 2,
 *          user_id :  2,
 *          title : "posts 2"
 *        }
 *      ]
 *  },
 *  {
 *      id : 3,
 *      username:  "tspace3",
 *      email : "tspace3@gmail.com",
 *      posts : []
 *  }
 * ]
*/

await new User().relationsExists('posts').findMany()
// SELECT * FROM `users` WHERE `users`.`deleted_at` IS NULL 
// AND EXISTS (SELECT 1 FROM `posts` WHERE `users`.`id` = `posts`.`user_id` AND `posts`.`deletedA_at` IS NULL);

// SELECT * FROM `posts` WHERE `posts`.`user_id` IN (...) AND `posts`.`deleted_at` IS NULL;

/*
 * @returns [
 *  {
 *      id : 2,
 *      username:  "tspace2",
 *      email : "tspace2@gmail.com",
 *      posts : [
 *       {
 *          id : 2,
 *          user_id :  2,
 *          title : "posts 2"
 *        }
 *      ]
 *  }
 * ]
 * because posts id 1 and id 3 has been removed from database (using soft delete)
 */

```

### Relation Count
Relationships will retrieving the count of related records without loading the data of related models
Let's illustrate this with an example of an existence check in relations:
```js

+-------------+--------------+----------------------------+
|                     table users                         |
+-------------+--------------+----------------------------+
| id          | username     | email                      |
|-------------|--------------|----------------------------|
| 1           | tspace1      | tspace1@gmail.com          |
| 2           | tspace2      | tspace2@gmail.com          |
+-------------+--------------+----------------------------+

+-------------+--------------+----------------------------+
|                     table posts                         |                    
+-------------+--------------+----------------------------+
| id          | user_id      | title                      |
|-------------|--------------|----------------------------|
| 1           | 1            | posts 1                    |
| 2           | 1            | posts 2                    |
| 3           | 2            | posts 3                    |
+-------------+--------------+----------------------------+

import { Model } from 'tspace-mysql'

class User extends Model {
  constructor(){
      super()
      this.hasMany({ name : 'posts' , model : Post })
      this.useSoftDelete()
  }
}

// you also use .withCount()
await new User().relationsCount('posts').findMany() 
// SELECT * FROM `users` WHERE `users`.`deleted_at` IS NULL;

// SELECT `posts`.`user_id`, COUNT(`user_id`) AS `aggregate` FROM `posts` 
// WHERE `posts`.`user_id` IN ('1','2') AND `posts`.`deleted_at` IS NULL GROUP BY `posts`.`user_id`;

/*
 * @returns [
 *  {
 *      id : 1,
 *      username:  "tspace1",
 *      email : "tspace1@gmail.com",
 *      posts : 2
 *  }
 *  {
 *      id : 2,
 *      username:  "tspace2",
 *      email : "tspace2@gmail.com",
 *      posts : 1
 *  }
 * ]
 */

```

### Relation Trashed
Relationships can return results only if they are deleted in table, considering soft deletes.
Let's illustrate this with an example:
```js

+-------------+--------------+----------------------------+--------------------+
|                     table users                         |                    |
+-------------+--------------+----------------------------+--------------------+
| id          | username     | email                      | deleted_at         |
|-------------|--------------|----------------------------|--------------------|
| 1           | tspace1      | tspace1@gmail.com          |                    |
| 2           | tspace2      | tspace2@gmail.com          |                    |
| 3           | tspace3      | tspace3@gmail.com          |2020-07-15 00:00:00 |
+-------------+--------------+----------------------------+--------------------+

+-------------+--------------+----------------------------+--------------------+
|                     table posts                         |                    |
+-------------+--------------+----------------------------+--------------------+
| id          | user_id      | title                      | deleted_at         |
|-------------|--------------|----------------------------|--------------------|
| 1           | 1            | posts 1                    |2020-07-15 00:00:00 |
| 2           | 2            | posts 2                    |                    |
| 3           | 3            | posts 3                    |2020-07-15 00:00:00 |
+-------------+--------------+----------------------------+--------------------+

import { Model } from 'tspace-mysql'

class User extends Model {
  constructor(){
    super()
    this.hasMany({ name : 'posts' , model : Post })
    this.useSoftDelete()
  }
}

+--------------------------------------------------------------------------+

class Post extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'comments' , model : Comment })
        this.belongsTo({ name : 'user' , model : User })
        this.useSoftDelete()
    }
}

// normal relations
await new User().relations('posts').findMany()
// SELECT * FROM `users` WHERE `users`.`deleted_at` IS NULL;
// SELECT * FROM `posts` WHERE `posts`.`user_id` IN (...) AND `posts`.`deleted_at` IS NULL;

/*
 * @returns [
 *  {
 *      id : 1,
 *      username:  "tspace1",
 *      email : "tspace1@gmail.com",
 *      posts : []
 *  }
 *  {
 *      id : 2,
 *      username:  "tspace2",
 *      email : "tspace2@gmail.com",
 *      posts : [
 *        {
 *          id : 2,
 *          user_id :  2,
 *          title : "posts 2"
 *        }
 *    ]
 *  }
 * ]
 */

// relationsTrashed
await new User().relationsTrashed('posts').findMany()
// SELECT * FROM `users` WHERE `users`.`deleted_at` IS NULL;
// SELECT * FROM `posts` WHERE `posts`.`user_id` IN (...) AND `posts`.`deleted_at` IS NOT NULL;

/*
 * @returns [
 *  {
 *      id : 1,
 *      username:  "tspace1",
 *      email : "tspace1@gmail.com",
 *      posts : [
 *       {
 *          id : 1,
 *          user_id :  1,
 *          title : "posts 1"
 *        }
 *      ]
 *  }
 *  {
 *      id : 2,
 *      username:  "tspace2",
 *      email : "tspace2@gmail.com",
 *      posts : []
 *  }
 * ]
 */

// relationsTrashed + trashed
await new User().relationsTrashed('posts').trashed().findMany()
// SELECT * FROM `users` WHERE `users`.`deleted_at` IS NOT NULL;
// SELECT * FROM `posts` WHERE `posts`.`user_id` IN (...) AND `posts`.`deleted_at` IS NOT NULL;
/*
 * @returns [
 *  {
 *      id : 3,
 *      username:  "tspace3",
 *      email : "tspace3@gmail.com",
 *      posts : [
 *        {
 *          id : 3,
 *          user_id :  3,
 *          title : "posts 3"
 *        }
 *      ]
 *  }
 * ]
 */

```

## Cache

Cache can be used in a Model.
Let's illustrate this with an example of a cache:

```js
// support memory db and redis
// set cache in file config  .env , .env.development ... etc
DB_CACHE = memory // by default

// for db
DB_CACHE = db

// for redis
DB_CACHE = redis://username:password@server:6379

const users = await new User()
.cache({
  key : 'users', // key of the cache
  expires : 1000 * 60 // cache expires in 60 seconds
})
.sleep(5) // assume the query takes longer than 5 seconds...
.findMany()

```

## Decorator

Decorators can be applied directly to your model classes.
When used, they automatically register the type into the system — no extra setup required.
Here’s a simple example of how a decorator works:

```js

import {
  Blueprint, Model ,
  Table ,TableSingular, TablePlural,
  UUID, SoftDelete, Timestamp,
  Pattern, Column, Validate, Observer,
  // ------- relations --------
  HasOne, HasMany, BelongsTo, BelongsToMany,
  // ------- Hook -------------
  Transform, Observer, Hooks,
  BeforeInsert, BeforeUpdate , BeforeRemove,
  AfterInsert, AfterUpdate , AfterRemove
} from 'tspace-mysql'
import { Post } from './Post'
import { PostUser } from './PostUser'

class UserObserve {

  public selected(results) {
    console.log({ results , selected : true })
  }

  public created(results) {
    console.log({ results , created : true })
  }

  public updated(results) {
    console.log({ results , updated : true })
  }

  public deleted(results) {
    console.log({ results , deleted : true })
  }
}

@Observer(UserObserve)
@UUID()
@SoftDelete()
@Timestamp()
@Table('users')
//@TableSingular() // 'user'
//@TablePlural() // 'users'
// if without set with @Table default 'users'
class User extends Model {

  @Column(() => Blueprint.int().notNull().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(50).null())
  public uuid!: string

  @Column(() => Blueprint.varchar(50).null())
  @Validate({
      type : String,
      require : true,
      length : 50,
      match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      unique : true,
      fn : (email : string) => {
        const matched = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        if(matched) return null;
        return `This column "${email}" is not match a regular expression`;
      }
  })
  public email!: string

  @Column(() => Blueprint.varchar(50).null())
  @Transform({
    to   : async (name:string) => `${name}-> transform@before`,
    from : async (name:string) => `${name}-> transform@after`,
  })
  public name !: string

  @Column(() => Blueprint.varchar(50).null())
  public username !: string

  @Column(() => Blueprint.varchar(50).null())
  public password !: string

  @Column(() => Blueprint.timestamp().null())
  public created_at!: Date

  @Column(() => Blueprint.timestamp().null())
  public updated_at!: Date

  @Column(() => Blueprint.timestamp().null())
  public deleted_at!: Date

  @HasOne({ model: () => Post })
  public post!: Post

  @HasMany({ model: () => Post })
  public posts!: Post[]

  @Hooks()
  hook1(result:any) {
    console.log(result,'hook1')
  }

  @Hooks()
  hook2(result:any) {
    console.log(result,'hook2')
  }

  @BeforeInsert()
  async beforeInsert(result:any) {
    console.log(result ,'@BeforeInsert\n')
    result.email = +new Date()+ '_overrideByBeforeInsert@gmail.com'
  }

  @AfterInsert()
  async afterInsert(result:any) {
    console.log(result ,'@AfterInsert\n')
    result.email = +new Date()+ '_overrideByAfterInsert@gmail.com'
  }

  @BeforeUpdate()
  async beforeUpdate(result:any) {
    console.log(result ,'@BeforeUpdate\n')
    result.email = +new Date()+ '_overrideByBeforeUpdate@gmail.com'
  }

  @AfterUpdate()
  async afterUpdate(result:any) {
    console.log(result ,'@AfterUpdate\n')
    result.email = +new Date()+ '_overrideByAfterUpdate@gmail.com'
  }

  @BeforeRemove()
  async beforeRemove() {
    console.log('@BeforeRemove\n')
  }

  @AfterRemove()
  async afterRemove() {
    console.log('@AfterRemove\n')
  }
}

```

## Schema

The schema refers to the structure of the database as it pertains to the objects and classes in the model. 
using the following:

### Schema Model

```js
import { Model, Blueprint , type T } from "tspace-mysql";

const schema = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null().index(),
  name: Blueprint.varchar(191).notNull(),
  email: Blueprint.varchar(191).notNull(),
  created_at: Blueprint.timestamp().null(),
  updated_at: Blueprint.timestamp().null(),
  deleted_at: Blueprint.timestamp().null()
}


// make type in TS
type TS = T.Schema<typeof Schema>

// the TSchemaUser will be created like that
/**
  {
    id : number,
    uuid : string | null,
    name : string,
    email : string,
    created_at : Date | string | null,
    updated_at : Date | string | null,
    deleted_at : Date | string | null
  }
*/


class User extends Model<TS>  // use the schema for this User model
{
  constructor() {
    super();
    this.useCamelCase()
    this.useSchema(schema)
  }
}

```

### Virtual Column
```js

import { Model, Blueprint , type T } from "tspace-mysql";

const schema = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null().index(),
  firstName: Blueprint.varchar(191).notNull(),
  lastName : Blueprint.varchar(191).notNull(),
  email: Blueprint.varchar(191).notNull(),
  created_at: Blueprint.timestamp().null(),
  updated_at: Blueprint.timestamp().null(),
  deleted_at: Blueprint.timestamp().null(),

  // Define you virtual column to schema
  fullName : new Blueprint().virtualColumn(`CONCAT(firstName,' ', lastName)`),
  countPosts : new Blueprint().virtualColumn(`(SELECT COUNT(*) FROM posts WHERE posts.userid = users.id)`)

  // if you need to custom the virtualColumn column for some method.
  // fullName : new Blueprint().virtualColumn({
  //     select  : `CONCAT(firstName,' ', lastName)`,
  //     where   : `CONCAT(firstName,' ', lastName)`,
  //     orderBy : `CONCAT(firstName,' ', lastName)`,
  //     groupBy : `CONCAT(firstName,' ', lastName)`,
  // }),
}

type TS = T.Schema<typeof Schema>

class User extends Model<TS> {
  constructor() {
    super();
    this.useSchema(schema)
  }
}
const users = await new User()
.select('id','firstName','lastName','fullName','countPosts')
.where('fullName','LIKE',`%tspace-mysql%`)
.orderBy('fullName','desc')
.groupBy('fullName')
.findMany()

// SELECT 
//    `users`.`id`, `users`.`firstName`, `users`.`lastName`, 
//    CONCAT(firstName,' ', lastName) AS fullName , 
//    (SELECT COUNT(*) FROM posts WHERE posts.userid = users.id) AS countPosts
// FROM `users` 
// WHERE CONCAT(firstName,' ', lastName) LIKE '%tspace-mysql%'
// GROUP BY CONCAT(firstName,' ', lastName)
// ORDER BY CONCAT(firstName,' ', lastName) DESC

```

### Validation

Validate the schema of Model
let's example a validator model:

```js
import { Model, Blueprint } from "tspace-mysql";
class User extends Model {
  constructor() {
    super();
    this.useSchema({
      id: Blueprint.int().notNull().primary().autoIncrement(),
      uuid: Blueprint.varchar(50).null(),
      name: Blueprint.varchar(191).notNull(),
      email: Blueprint.varchar(191).notNull(),
      created_at: Blueprint.timestamp().null(),
      updated_at: Blueprint.timestamp().null(),
      deleted_at: Blueprint.timestamp().null(),
    });

    // validate input when create or update reference to the schema in 'this.useSchema'
    this.useValidateSchema({
      id: Number,
      uuid: Number,
      name: {
        type: String,
        length: 191,
        require: true,
        json: true,
      },
      email: {
        type: String,
        require: true,
        length: 191,
        match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        unique: true,
        fn: async (email: string) => {
          const exists = await new User().where('email',email).exists()
          if(exists) return `This column "${email}" is dupicate`;
          return null;
        }
      },
      created_at: Date,
      updated_at: Date,
      deleted_at: Date,
    });
  }
}
```

### Sync

Sync the schema with the "Models" setting in your directory.
This process will verify and update table columns and foreign keys as needed.
Ensure that the relationships are correctly established through the 'useSchema' method in your models.
Let's examine a basic sync class:

```js
/**
 *
 * @Ex directory
 *
 * - node_modules
 * - src
 *   - index.ts
 *   - Models
 *    - User.ts
 *    - Post.ts
 */

// file User
class User extends Model {
  constructor() {
    super();
    this.hasMany({ name: "posts", model: Post });

    // if you need to initialize data when creating the table, you can use the following.
    this.onCreatedTable(async () => {
      console.log('hi onCreatedTable');

      await new User()
        .create({
          ...columns,
        })
        .void()
        .save();
    });

     this.onSyncTable(async () => {
      console.log('hi onSyncTable');
    });

    this.useSchema({
      id: Blueprint.int().notNull().primary().autoIncrement(),
      uuid: Blueprint.varchar(50).null(),
      email: Blueprint.int().notNull().unique(),
      name: Blueprint.varchar(255).null(),
      created_at: Blueprint.timestamp().null(),
      updated_at: Blueprint.timestamp().null(),
      deleted_at: Blueprint.timestamp().null(),
    });
  }
}

// file Post
import User from "./User";
class Post extends Model {
  constructor() {
    super();
    this.hasMany({ name: "comments", model: Comment });
    this.belongsTo({ name: "user", model: User });
    this.useSchema({
      id: Blueprint.int().notNull().primary().autoIncrement(),
      uuid: Blueprint.varchar(50).null(),
      user_id: Blueprint.int().notNull().foreign({
        references: "id",
        on: User,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }),
      title: Blueprint.varchar(255).null(),
      created_at: Blueprint.timestamp().null(),
      updated_at: Blueprint.timestamp().null(),
      deleted_at: Blueprint.timestamp().null(),
    });
  }
}

await Schema.sync(`/src/Models`, {
  force: true,
  log: true,
  foreign: true,
  changed: true,
});

// You can also synchronize using the Model.
await new User().sync({ force: true, foreign: true, changed: true });
```

## SoftDelete

```js

import { Model } from 'tspace-mysql'
class User extends Model {
    constructor() {
      super()
      this.useSoftDelete() // All query will be where 'deleted_at' is null

      // You can also use patterns camelCase to covert the 'deleted_at' to 'deleted_at'
      // You can also customize the  column 'deleted_at'
      this.useSoftDelete('deleted_atCustom')
    }
}

const user = await new User().where('user_id',1).findOne()
// SELECT * FROM `users` WHERE `users`.`userId` = '1' and `users`.`deleted_atCustom` IS NULL LIMIT 1;

// find in trashed
const user = await new User().trashed().findMany()
// SELECT * FROM `users` WHERE `users`.`userId` = '1' and `users`.`deleted_atCustom` IS NOT NULL;

```

## Type Safety
Type Type Safety in TypeScript refers to the ability of the language to detect and prevent type errors during compile-time. 
Type Type Safety still works when you add additional types to your model, using the following:

```js
// in file User.ts
import { Model , Blueprint , type T } from 'tspace-mysql'
import Phone  from '../Phone'

const schemaUser = {
    id :Blueprint.int().notNull().primary().autoIncrement(),
    uuid :Blueprint.varchar(50).null(),
    email :Blueprint.varchar(50).null(),
    name :Blueprint.varchar(255).null(),
    username : Blueprint.varchar(255).null(),
    password : Blueprint.varchar(255).null(),
    created_at :Blueprint.timestamp().null(),
    updated_at :Blueprint.timestamp().null()
}

type TSchemaUser = T.SchemaStatic<typeof schemaUser>
// TSchemaUser = T.Schema<typeof schemaUser>

// TSchema allowed to set any new keys without in the schema to results
// TSchemaStatic not allowed to set any new keys without in the schema to results

class User extends Model<TSchemaUser>  { // Add this '<TSchemaUser>' to activate the type for the Model.
  constructor() {
    super()
    this.useSchema(schemaUser)
    this.hasOne({ model : Phone, name : 'phone' })
    this.hasMany({ model : Phone, name : 'phones' })
  }
}

export { User }
export default User

+--------------------------------------------------------------------------+

// in file Phone.ts
import { Model , Blueprint , type T } from 'tspace-mysql'
import { User } from './User.ts'
const schemaPhone = {
    id :Blueprint.int().notNull().primary().autoIncrement(),
    uuid :Blueprint.varchar(50).null(),
    userId : Blueprint.int().notNull(),
    number :Blueprint.varchar(50).notNull(),
    created_at :Blueprint.timestamp().null(),
    updated_at :Blueprint.timestamp().null()
}

type TSchemaPhone = T.SchemaStatic<typeof schemaPhone>

class Phone extends Model<TSchemaPhone>  {
  constructor() {
    super()
    this.useSchema(schemaPhone)
    this.useBelongsTo({ model : User, name : 'user'})
  }
}

export { Phone }
export default Phone

// example basic
type TS = T.Schema<typeof TSchemaUser>
type TR = T.Relation<{ phone : Phone }>

type TSM = T.SchemaModel<User>
type TRM = T.RelationModel<User>     

type TColumn = T.Column<User>

type TResults = T.Results<User>
type TPaginateResults = T.Results<User, { paginate : true }>

type TRepository = T.Repository<User>
type TRepositoryTypeOf = T.RepositoryTypeOf<User>

+--------------------------------------------------------------------------+
```

### Select Type Safety 

```js
import { User  } from './User.ts'
import { Phone } from './Phone.ts'

const user = await new User().select('id','username').findOne() ✅
const user = await new User().select('idx','username').findOne() ❌

const user = await new User().except('id','username').findOne() ✅
const user = await new User().except('idx','username').findOne() ❌

// T.SchemaStatic not allowed to set any new keys without in the schema to results
user.withoutSchema = 1 ✅ // T.Schema<User>
user.withoutSchema = 1 ❌ // T.SchemaStatic<User>
// But can you make like this for cases
const user = await new User().except('idx','username').findOne<{ withoutSchema : number }>()
user.withoutSchema = 1 ✅
```

### OrderBy Type Safety

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().orderBy('id','DESC').findMany() ✅
const users = await new User().orderBy('idx','DESC').findMany() ❌

const users = await new User().latest('id').findMany() ✅
const users = await new User().latest('idx').findMany() ❌

const users = await new User().oldest('id').findMany() ✅
const users = await new User().oldest('idx').findMany() ❌

```

### GroupBy Type Safety

```js
import { User  } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().groupBy('id').findMany() ✅
const users = await new User().groupBy('idx').findMany() ❌

```
### Where Type Safety
```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().where('id',1).findMany() ✅
const users = await new User().where('idxx',1).findMany() ❌

const users = await new User().where('id',1).orWhere('id',5).findMany() ✅
const users = await new User().where('id',1).orWhere('idxx',5).findMany() ❌

const users = await new User().whereIn('id',[1]).findMany() ✅
const users = await new User().whereIn('idx',[1]).findMany() ❌

const users = await new User().whereNull('id').findMany() ✅
const users = await new User().whereNull('idx').findMany() ❌

const users = await new User().whereNotNull('id').findMany() 
const users = await new User().whereNotNull('idx').findMany() 

const users = await new User().whereBetween('id',[1,2]).findMany() ✅
const users = await new User().whereBetween('idx',[1,2]).findMany() ❌

const users = await new User()
.whereSubQuery(
  'id',
  new User().select('id').toString()
).findMany() ✅

const users = await new User()
.whereSubQuery(
  'idx',
  new User().select('id').toString()
).findMany() ❌

```
### Insert Type Safety

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().create({ id : 10 }).save() ✅

const users = await new User().create({ id : "10" }).save() ❌

const users = await new User().create({ idx : 10 }).save() ❌

```
### Update Type Safety

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().update({ id : 10 }).where('id',1).save() ✅
const users = await new User().update({ id : 10 }).where('idx',1).save() ❌
const users = await new User().update({ id : "10" }).where('id',1).save() ❌
const users = await new User().update({ idx : 10 }).where('idx',1).save() ❌

```
### Delete Type Safety

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().where('id',1).delete() ✅
const users = await new User().where('idx',1).delete() ❌

```
### Relationships Type Safety
```js
import { type T } from 'tspace-mysql'
import { User } from './User.ts'
import { Phone } from './Phone.ts'
// Case #1 : Relationship with 2 relations 'phone' and 'phones'
  const users = await new User()
  .relations('phone','phones')
  .findMany()

  for(const user of users) {
    user.phone  ❌
    user.phones ❌
  }

// You can also specify the type for the results.
// bad 👎👎👎
  const users = await new User()
  .relations('phone','phones')
  .findMany<{ phone : Record<string,any> , phones : any[]}>()

  for(const user of users) {
    user.phone  ✅
    user.phones ✅
    user.phone.id  ✅
    user.phone.idx ✅💩💩💩
    user.phones.map(phone => phone.id) ✅
    user.phones.map(phone => phone.idx) ✅💩💩💩
  }

// good 👍👍👍
const users = await new User()
.relations('phone','phones')
.findMany<{ phone : T.SchemaModel<Phone> , phones : T.SchemaModel<Phone>[] }>()

for(const user of users) {
  user.phone  ✅
  user.phones ✅
  user.phone?.id  ✅
  user.phone?.idx ❌
  user.phones.map(phone => phone?.id) ✅
  user.phones.map(phone => phone?.idx) ❌
}

+--------------------------------------------------------------------------+

// Case #2 : There is a relationship between two entities, 'phone' and 'phones', both of which are related to the 'user' entity through nested relations
  const users = await new User()
  .relations('phone','phones')
  .relationQuery('phone' , (query : Phone) => query.relations('user'))
  .relationQuery('phones' , (query : Phone) => query.relations('user'))
  .findMany<{ phone : T.SchemaModel<Phone> , phones : T.SchemaModel<Phone>[] }>()

  for(const user of users) {
    user.phone.user ❌
    user.phones.map(phone =>phone.user) ❌
  }

  // You can also specify the type for the results.
  // bad 👎👎👎
  const users = await new User()
  .relations('phone','phones')
  .relationQuery('phone' , (query : Phone) => query.relations('user'))
  .relationQuery('phones' , (query : Phone) => query.relations('user'))
  .findMany<{ phone : Record<string,any> , phones : Record<string,any>[] }>()

  for(const user of users) {
    user.phone.user ✅💩💩💩
    user.phones.map(phone =>phone.user) ✅💩💩💩
    user.phone.user.idx ✅💩💩💩
    user.phones.map(phone =>phone.user.idx) ✅💩💩💩
  }

  // good 👍👍👍
  const users = await new User()
  .relations('phone','phones')
  .relationQuery('phone' , (query : Phone) => query.relations('user'))
  .relationQuery('phones' , (query : Phone) => query.relations('user'))
  .findMany<{ 
    phone : Partial<T.SchemaModel<Phone>> & { user : T.SchemaModel<User>};
    phones : (Partial<T.SchemaModel<Phone>> & { user : T.SchemaModel<User>})[];
  }>()

  for(const user of users) {
    user.phone.user ✅
    user.phone.user.id ✅
    user.phone.userx ❌
    user.phone.user.idx ❌
    user.phones.map(phone =>phone.user.id) ✅
    user.phones.map(phone =>phone.user.idx) ❌
  }

+--------------------------------------------------------------------------+
// If you don't want to set types for every returning method such as 'findOne', 'findMany', and so on...

import { Model , Blueprint , type T } from 'tspace-mysql'
import { Phone }  from '../Phone'

const schemaUser = {
    id        :Blueprint.int().notNull().primary().autoIncrement(),
    uuid      :Blueprint.varchar(50).null(),
    email     :Blueprint.varchar(50).null(),
    name      :Blueprint.varchar(255).null(),
    username  :Blueprint.varchar(255).null(),
    password  :Blueprint.varchar(255).null(),
    created_at :Blueprint.timestamp().null(),
    updated_at :Blueprint.timestamp().null()
}

type TSchemaUser = T.SchemaStatic<typeof schemaUser>

type TRelationUser =  T.Relation<{
  phones : Phone[]
  phone  : Phone
}>

// Add this '<TSchemaUser, RelationUserType>' to activate the type for the Model.
class User extends Model< TSchemaUser, TRelationUser >  { 
  constructor() {
    super()
    this.useSchema(schemaUser)
    this.hasOne({ model : Phone, name : 'phonex' }) ❌
    this.hasMany({ model : Phone, name : 'phonesx' }) ❌
    this.hasOne({ model : Phone, name : 'phone' }) ✅
    this.hasMany({ model : Phone, name : 'phones' }) ✅
  }
}

export { User }

+--------------------------------------------------------------------------+

// in file Phone.ts
import { Model , Blueprint , type T } from 'tspace-mysql'
import { User } from './User.ts'

const schemaPhone = {
    id        :Blueprint.int().notNull().primary().autoIncrement(),
    uuid      :Blueprint.varchar(50).null(),
    userId    :Blueprint.int().notNull(),
    number    :Blueprint.varchar(50).notNull(),
    created_at :Blueprint.timestamp().null(),
    updated_at :Blueprint.timestamp().null()
}

type TSchemaPhone = T.Schema<typeof schemaPhone>

type TRelationPhone = T.Relation<{
  user : User[]
}>

class Phone extends Model<TSchemaPhone,TRelationPhone>  {
  constructor() {
    super()
    this.useSchema(schemaPhone)
    this.useBelongsTo({ model : User, name : 'userx'}) ❌
    this.useBelongsTo({ model : User, name : 'user'}) ✅
  }
}

export { Phone }

+--------------------------------------------------------------------------+

const users = await new User()
  .relations('phonex','phonesx') ❌
  .relationQuery('phonex' ❌ , (query : Phone) => query.relations('user')) ✅
  .relationQuery('phonesx' ❌ , (query : Phone) => query.relations('user')) ✅
  .findMany()

const users = await new User()
  .relations('phone','phones') ✅
  .relationQuery('phonex' ❌ , (query : Phone) => query.relations('user')) ✅
  .relationQuery('phonesx' ❌ , (query : Phone) => query.relations('user')) ✅
  .findMany()

const users = await new User()
  .relations('phone','phones')
  .relationQuery('phone' , (query : Phone) => query.relations('userx')) ❌
  .relationQuery('phones' , (query : Phone) => query.relations('userx')) ❌
  .findMany()

const users = await new User()
  .relations('phone','phones') ✅
  .relationQuery('phone' ✅ , (query : Phone) => query.relations('user')) ✅
  .relationQuery('phones'✅ , (query : Phone) => query.relations('user')) ✅
  .findMany()

  for(const user of users) {
    user.phone.user ❌
    user.phone?.user ✅
    user.phone?.user.id ✅
    user.phone?.userx ❌
    user.phone?.user.idx ❌
    user.phones.map(phone =>phone?.user.id) ❌
    user.phones?.map(phone =>phone?.user.id) ✅
    user.phones?.map(phone =>phone?.user.idx) ❌
  }

```
### Results Type Safety
```js
import { type T } from 'tspace-mysql'

const fError = async () : Promise<T.Results<User>[]> => {

  const users = [{
    id : 1,
    uuid: "12d4f08a-a20d-4f41-abac-81391e135d60",
    email: "tspace@example.com"
  }]
      
  return users // ❌
}

const fCorrect = async () : Promise<T.Results<User>[]> => {

  const users = await new User().findMany()
      
  return users // ✅
}

```
## Metadata
Get the metadata of a Model works only when a schema is added to the Model.

```js
import { Meta, Model , Blueprint , type T } from 'tspace-mysql';

const schema = {
  id        : Blueprint.int().notNull().primary().autoIncrement(),
  uuid      : Blueprint.varchar(50).null(),
  email     : Blueprint.varchar(255).notNull().index('users.email@index'),
  name      : Blueprint.varchar(255).null(),
  username  : Blueprint.varchar(255).notNull(),
  password  : Blueprint.varchar(255).notNull(),
  status    : Blueprint.tinyInt().notNull().default(0),
  role      : Blueprint.enum('admin','user').default('user'),
  created_at : Blueprint.timestamp().null(),
  updated_at : Blueprint.timestamp().null()
}

type TS = T.Schema<typeof schema>

class User extends Model<TS>  {
  constructor() {
    super()
    this.useSchema(schema)
  }
}

const meta = Meta(User)

const table         = meta.table() // 'users'
const column        = meta.column('id') // 'id'
const columnRef     = meta.columnReference('id') // `users`.`id`
const columnTypeOf  = meta.columnTypeOf('id') // number
const columnType    = meta.columnType('id') // Int
const columns       = meta.columns() // ['id','uuid',...'updated_at']
const hasColumn     = meta.hasColumn('idx') // false
const primaryKey    = meta.primaryKey() // 'id'
const indexes       = meta.indexes() // ['users.email@index']
const nullables     = meta.nullables() // ['uuid','name','created_at','updated_at']
const defaults      = meta.defaults() // { id : null, uuid : null, ..., status : 0, role: 'user' ,..updated_at : null  }
const enums         = meta.enums('role') // [ 'admin', 'user' ]
const enumsObj      = meta.enum('role') // { admin: 'admin', user: 'user' }
```

## Audit
Keeps a complete history of database changes, tracking who made changes and what was changed.

```js
await new User()
// support actions SELECT, INSERT, UPDATE, and DELETE.
// so you have a complete history of data changes and queries.
.audit(99 , { name : 'userNumber-99' }) 
.create({
  username : 'hi audit',
  email : 'tspace-mysql@gmail.com',
  // ...
})
.save()
```

<div class="page-nav-cards">
  <a href="#/injection" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Injection </div>
  </a>

  <a href="#/repository" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Repository </div>
  </a>
</div>

# navbar.md

* [Getting Started]()
  * [Install](?id=install)
  * [Mysql Database](?id=mysql-database)
  * [Mariadb Database](?id=mariadb-database)
  * [Postgres Database](?id=postgres-database)
  * [Cluster Database](?id=cluster-database)
  * [Example Framework](?id=example-framework)

* [Integrations](integrations)
  * [Http](integrations?id=http)
  * [Expressjs](integrations)
  * [Fastify](integrations?id=expressjs)
  * [Nestjs](integrations?id=nestjs)
  * [Bun](integrations?id=bun-native)
  * [Elysia](integrations?id=elysia)
  * [Hono](integrations?id=hono)

* [SQL Like](sql-like)
  * [Select Statements](sql-like?id=select-statements)
  * [Insert Statements](sql-like?id=insert-statements)
  * [Update Statements](sql-like?id=update-statements)
  * [Delete Statements](sql-like?id=delete-statements)

* [Query Builder](query-builder)
  * [Table Name & Alias Name](query-builder?id=table-name--alias-name)
  * [Returning Results](query-builder?id=returning-results)
  * [Query Statement](query-builder?id=query-statements)
  * [Select Statements](query-builder?id=select-statements)
  * [Insert Statements](query-builder?id=insert-statements)
  * [Update Statements](query-builder?id=update-statements)
  * [Delete Statements](query-builder?id=delete-statements)
  * [Raw Expressions](query-builder?id=raw-expressions)

* [Model](model?id=basic-model-setup)
  * [Basic Model Setup](model?id=basic-model-setup)
  * [Schema](model?id=schema)
  * [SoftDelete](model?id=softdelete)
  * [Joins Model](model?id=joins-model)
  * [Cache](model?id=cache)
  * [Decorator](model?id=decorator)
  * [Metadata](model?id=metadata)
  * [Audit](model?id=audit)

* [Relationships](model?id=relationships)
  * [One To One](model?id=one-to-one)
  * [One To Many](model?id=one-to-many)
  * [Belongs To](model?id=belongs-to)
  * [Many To Many](model?id=many-to-many)
  * [Relation](model?id=relation)
  * [Deeply Nested Relations](model?id=deeply-nested-relations)
  * [Relation Exists](model?id=relation-exists)
  * [Relation Count](model?id=relation-count)
  * [Relation Trashed](model?id=relation-trashed)
  * [Built in Relation Functions](model?id=built-in-relation-functions)

* [Type Safety](model?id=type-safety)
  * [Select Type Safety](model?id=select-type-safety)
  * [OrderBy Type Safety](model?id=order-by-type-safety)
  * [GroupBy Type Safety](model?id=group-by-type-safety)
  * [Where Type Safety](model?id=where-type-safety)
  * [Insert Type Safety](model?id=insert-type-safety)
  * [Update Type Safety](model?id=update-type-safety)
  * [Delete Type Safety](model?id=delete-type-safety)
  * [Relationships Type Safety](model?id=relationships-type-safety)
  * [Results Type Safety](model?id=results-type-safety)

* [Repository](repository)
  - [Select Statements](repository?id=select-statements)
  - [Insert Statements](repository?id=insert-statements)
  - [Update Statements](repository?id=update-statements)
  - [Delete Statements](repository?id=delete-statements)
  - [Transactions](repository?id=transactions)
  - [Relations](repository?id=relations)

* [Transactions](database-transactions)
  * [Database Transactions](database-transactions)
  * [Race Condition](race-condition)

* [Cli](cli)
  * [Make Model](cli?id=make-model)
  * [Make Migration](cli?id=make-migration)
  * [Migrate](cli?id=migrate)
  * [Query](cli?id=query)
  * [Dump](cli?id=dump)
  * [Generate Models](cli?id=generate-models)
  * [Migration Models](cli?id=migration-models)
  * [Migration DB](cli?id=migration-db)

# query-builder.md

# Query Builder

How a database query builder works with a simple example using the following:

```js
+-------------+--------------+----------------------------+
|                     table users                         |
+-------------+--------------+----------------------------+
| id          | username     | email                      |
|-------------|--------------|----------------------------|
| 1           | tspace       | tspace@gmail.com           |
| 2           | tspace2      | tspace2@gmail.com          |
+-------------+--------------+----------------------------+
```

```js
+-------------+--------------+----------------------------+
|                     table posts                         |
+-------------+--------------+----------------------------+
| id          | user_id      | title                      |
|-------------|--------------|----------------------------|
| 1           | 1            | posts tspace               |
| 2           | 2            | posts tspace2              |
+-------------+--------------+----------------------------+

```

## Table Name & Alias Name

```js
import { DB }  from 'tspace-mysql'

await new DB().from('users').find(1)
// SELECT * FROM `users` WHERE `users`.`id` = '1' LIMIT 1;

await new DB().table('users').find(1)
// SELECT * FROM `users` WHERE `users`.`id` = '1' LIMIT 1;

await new DB().table('users').alias('u').find(1)
// SELECT * FROM `users` AS `u` WHERE `u`.`id` = '1' LIMIT 1;

await new DB().alias('u',new DB('users').select('*').limit(1).toString()).find(1)
// SELECT * FROM ( SELECT * FROM `users` LIMIT 1 ) AS `u` WHERE `u`.`id` = '1' LIMIT 1;

```

## Returning Results

```js
const user = await new DB("users").find(1); // Object or null

const user = await new DB("users").findOne(); // Object or null

const user = await new DB("users").first(); // Object or null

const user = await new DB("users").firstOrError(message); // Object or error

const users = await new DB("users").findMany(); // Array-object of users

const users = await new DB("users").get(); // Array-object of users

const users = await new DB("users").getGroupBy('name') // Map

const users = await new DB("users").findGroupBy('name') // Map

const users = await new DB("users").toArray(); // Array of users

const users = await new DB("users").toJSON(); // JSON of users

const user = await new DB("users").exists(); // Boolean true if user exists otherwise false

const user = await new DB("users").count(); // Number of users counted

const user = await new DB("users").avg(); // Number of users avg

const user = await new DB("users").sum(); // Number of users sum

const user = await new DB("users").max(); // Number of users max

const user = await new DB("user").min(); // Number of users min

const users = await new DB("users").toString(); // sql query string

const users = await new DB("users").toSQL(); // sql query string

const users = await new DB("users").toRawSQL(); // sql query string

const users = await new DB("users").pagination(); // Object of pagination

const users = await new DB("users").makeSelectStatement() // query string for select statement

const users = await new DB("users").makeInsertStatement() // query string for insert statement

const users = await new DB("users").makeUpdateStatement() // query string for update statement

const users = await new DB("users").makeDeleteStatement() // query string for delete statement

const users = await new DB("users").makeCreateTableStatement() // query string for create table statement

```

## Query Statements

```js
const query = await DB.query(
  "SELECT * FROM users WHERE id = :id AND email IS :email AND name IN :username", {
  id : 1,
  email : null,
  username : ['name1','name2']
})
// SELECT * FROM users WHERE id = '1' AND email IS NULL AND username in ('name1','name2');
```

## Select Statements

```js
const select = await new DB("users").select("id", "username").findOne();
// SELECT `users`.`id`, `users`.`username` FROM `users` LIMIT 1;

const selectRaw = await new DB("users").selectRaw("COUNT(id)").findMany();
// SELECT COUNT(id) FROM `users`;
// You can also use the DB.raw() function
// const selectRaw = await new DB("users").selec(DB.raw("COUNT(id)")).findMany();

const selectObject = await new DB("posts")
  .join("posts.user_id", "users.id")
  .select("posts.*")
  .selectObject(
    { id: "users.id", name: "users.name", email: "users.email" },
    "user"
  )
  .findOne();

/** 
SELECT 
  posts.*, JSON_OBJECT('id' , `users`.`id` , 'name' , `users`.`name` , 'email' , `users`.`email`) AS `user`
FROM `posts` 
INNER JOIN `users` ON `posts`.`user_id` = `users`.`id` LIMIT 1;
*/

const selectArray = await new DB("users")
  .select('id','name','email')
  .join("users.id", "posts.user_id")
  .select("posts.*")
  .selectArray(
    { id: "posts.id", user_id: "posts.user_id", title: "posts.title" },
    "posts"
  )
  .findOne();
/** 
SELECT 
  `users`.`id`, `users`.`name`, `users`.`email`, 
  CASE WHEN COUNT(`posts`.`id`) = 0 THEN JSON_ARRAY() 
  ELSE JSON_ARRAYAGG(JSON_OBJECT('id' , `posts`.`id` , 'user_id' , `posts`.`user_id` , 'email' , `posts`.`title`)) 
  END AS `posts` 
FROM `users` 
INNER JOIN `posts` ON `users`.`id` = `posts`.`user_id` WHERE `users`.`deletedAt` IS NULL GROUP BY `users`.`id` LIMIT 1;
*/

await new DB("users").except("id").findOne();
// SELECT `users`.`email`, `users`.`username` FROM `users` LIMIT 1;

await new DB("users").distinct().select("id").findOne();
// SELECT DISTINCT `users`.`id` FROM `users` LIMIT 1;
```

## Raw Expressions

```js
const users = await new DB("users")
  .select(DB.raw("COUNT(`username`) as c"), "username")
  .groupBy("username")
  .having("c > 1")
  .findMany();
// SELECT COUNT(`username`) as c, `users`.`username` FROM `users` GROUP BY `username` HAVING c > 1;

const users = await new DB("users")
  .where(
    "id",
    DB.raw(new DB("users").select("id").where("id", "1").limit(1).toString())
  )
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = (SELECT `users`.`id` FROM `users` WHERE `users`.`id` = '1' LIMIT 1);

const findFullName = await new User()
.select('name',`${DB.raw('CONCAT(firstName," ",lastName) as fullName')}`)
.whereRaw(`CONCAT(firstName," ",lastName) LIKE '%${search}%'`)
.findOne()     
//  SELECT `users`.`name`, CONCAT(firstName," ",lastName) as fullName FROM `users` WHERE CONCAT(firstName," ",lastName) LIKE '%search%' LIMIT 1;

```

## Insert Statements

```js
const user = await new DB("users")
  .create({
    name: "tspace3",
    email: "tspace3@gmail.com",
  })
  .save();
/**
  INSERT INTO `users` 
    (`users`.`name`,`users`.`email`) 
  VALUES 
    ('tspace3','tspace3@gmail.com');

  -- then return the result inserted --
  SELECT * FROM `users` WHERE `users`.`id` = ${INSERT ID};
*/

const users = await new DB("users")
  .createMultiple([
    {
      name: "tspace4",
      email: "tspace4@gmail.com",
    },
    {
      name: "tspace5",
      email: "tspace5@gmail.com",
    },
    {
      name: "tspace6",
      email: "tspace6@gmail.com",
    },
  ])
  .save();

/**
  INSERT INTO `users` 
    (`users`.`name`,`users`.`email`)
  VALUES
    ('tspace4','tspace4@gmail.com'), 
    ('tspace5','tspace5@gmail.com'), 
    ('tspace6','tspace6@gmail.com');
*/

const users = await new DB("users")
  .where("name", "tspace4")
  .where("email", "tspace4@gmail.com")
  .createNotExists({
    name: "tspace4",
    email: "tspace4@gmail.com",
  })
  .save();
/*
  -- if exists return null, if not exists created new data --
  SELECT EXISTS(
    SELECT 1 FROM `users` 
    WHERE `users`.`name` = 'tspace4' 
    AND `users`.`email` = 'tspace4@gmail.com' 
    LIMIT 1
  ) AS 'exists';

  INSERT INTO `users` (`users`.`name`,`users`.`email`) VALUES ('tspace4','tspace4@gmail.com');
*/

const users = await new DB("users")
  .where("name", "tspace4")
  .where("email", "tspace4@gmail.com")
  .createOrSelect({
    name: "tspace4",
    email: "tspace4@gmail.com",
  })
  .save();
/**
  -- if has exists return data, if not exists created new data --
  SELECT EXISTS(
    SELECT 1 FROM `users` 
    WHERE `users`.`name` = 'tspace4' 
    AND `users`.`email` = 'tspace4@gmail.com' 
    LIMIT 1
  ) AS 'exists';

  INSERT INTO `users` (`users`.`name`,`users`.`email`) VALUES ('tspace4','tspace4@gmail.com');

  SELECT * FROM `users` WHERE `users`.`id` = '4';
*/
```

## Update Statements

```js
const user = await new DB("users")
  .where("id", 1)
  .update({
    name: "tspace1**",
    email: "tspace1@gmail.com",
  })
  .save();
/**

 UPDATE `users` SET 
  `users`.`name` = 'tspace1',
  `users`.`email` = 'tspace1@gmail.com' 
 WHERE `users`.`id` = '1' LIMIT 1;

 */

const user = await new DB("users")
  .where("id", 1)
  .updateMany({
    name: "tspace1",
    email: "tspace1@gmail.com",
  })
  .save();
/**
 UPDATE `users` SET 
 `users`.`name` = 'tspace1',
 `users`.`email` = 'tspace1@gmail.com' 
 WHERE `users`.`id` = '1';
 */

const user = await new DB("users")
  .where("id", 1)
  .update(
    {
      name: "tspace1",
      email: "tspace1@gmail.com",
    },
    ["name"]
  )
  .save();
/**
  UPDATE `users` SET 
    `name` = 
    CASE WHEN (`name` = '' OR `name` IS NULL) 
    THEN 'tspace1' ELSE `name` 
    END,
    `email` = 
    'tspace1@gmail.com' 
    WHERE `users`.`id` = '1' LIMIT 1;
 */

const user = await new DB("users")
  .updateCases([
    {
      condition: {
        id: 1,
        name: "name1",
      },
      columns: {
        name: "update row1",
        email: "row1@example.com",
      },
    },
    {
      when: {
        id: 2,
      },
      columns: {
        name: "update row2",
        email: "row2@example.com",
      },
    },
  ])
  .save();

/** 
 UPDATE `users` SET 
 `users`.`name` = ( 
  CASE WHEN `users`.`id` = '1' 
    AND `users`.`name` = 'name1' 
  THEN 'update row1' 
    WHEN `users`.`id` = '2' 
  THEN 'update row2' 
    ELSE `users`.`name` 
  END 
  ), 
  `users`.`email` = ( 
    CASE WHEN `users`.`id` = '1' 
      AND `users`.`name` = 'name1' 
    THEN 'row1@example.com' 
      WHEN `users`.`id` = '2' 
    THEN 'row2@example.com' 
      ELSE `users`.`email` 
    END 
  ) 
  WHERE `users`.`id` IN ('1','2') LIMIT 2;

 */

const user = await new DB("users")
  .where("id", 1)
  .updateOrCreate({
    name: "tspace1**",
    email: "tspace1@gmail.com",
  })
  .save();
// if has exists return update, if not exists created new data
// UPDATE `users` SET `name` = 'tspace1**',`email` = 'tspace1@gmail.com' WHERE `users`.`id` = '1' LIMIT 1;
// INSERT INTO `users` (`name`,`email`) VALUES ('tspace1**','tspace1@gmail.com');
```

## Delete Statements

```js
const deleted = await new DB("users").where("id", 1).delete();
// DELETE FROM `users` WHERE `users`.`id` = '1' LIMIT 1;

const deleted = await new DB("users").where("id", 1).deleteMany();
// DELETE FROM `users` WHERE `users`.`id` = '1' ;
```

## Ordering, Grouping, Limit and Offset

### Ordering

```js
await new DB("users").orderBy("id", "asc").findOne();
// SELECT * FROM `users` ORDER BY `id` ASC LIMIT 1;

await new DB("users").orderBy("id", "desc").findOne();
// SELECT * FROM `users` ORDER BY `id` DESC LIMIT 1;

await new DB("users").oldest("id").findOne();
// SELECT * FROM `users` ORDER BY `id` ASC LIMIT 1;

await new DB("users").latest("id").findOne();
// SELECT * FROM `users` ORDER BY `id` DESC LIMIT 1;

await new DB("users").random().findMany();
// SELECT * FROM `users` ORDER BY RAND();
```

### Grouping

```js
await new DB("users").groupBy("id").findOne();
// SELECT * FROM `users` GROUP BY `id` LIMIT 1;

await new DB("users").groupBy("id", "username").findOne();
// SELECT * FROM `users` GROUP BY `id`, `username` LIMIT 1;

await new DB("users")
  .select(DB.raw("COUNT(username) as c"), "username")
  .groupBy("username")
  .having("c > 1")
  .findMany();
// SELECT COUNT(username) as c, `users`.`username` FROM `users` GROUP BY `username` HAVING c > 1;
```

### Limit and Offset

```js
await new DB("users").limit(5).findMany();
// SELECT * FROM `users` LIMIT 5;

await new DB("users").limit(-1).findMany();
// SELECT * FROM `users` LIMIT 2147483647; // int-32  2**31 - 1

await new DB("users").offset(1).findOne();
// SELECT * FROM `users` LIMIT 1 OFFSET 1;
```

## Joins

### Inner Join Clause

```js
await new DB("posts").join("posts.user_id", "users.id").findMany();
// SELECT * FROM `posts` INNER JOIN `users` ON `posts`.`user_id` = `users`.`id`;

await new DB("posts")
.join((join) => {
  return join
  .on('posts.user_id','users.id')
  .on('users.id','post_user.user_id')
  .and('users.id','posts.user_id')
})
.findMany();

// SELECT * FROM `posts` 
// INNER JOIN `users` ON `posts`.`user_id` = `users`.`id` 
// INNER JOIN `post_user` ON `users`.`id` = `post_user`.`user_id` AND `users`.`id` = `posts`.`user_id`;
```

### Left Join, Right Join Clause

```js
await new DB("posts").leftJoin("posts.user_id", "users.id").findMany();
// SELECT * FROM `posts` LEFT JOIN `users` ON `posts`.`user_id` = `users`.`id`;

await new DB("posts").rightJoin("posts.user_id", "users.id").findMany();
// SELECT * FROM `posts` RIGHT JOIN `users` ON `posts`.`user_id` = `users`.`id`;
```

### Cross Join Clause

```js
await new DB("posts").crossJoin("posts.user_id", "users.id").findMany();
// SELECT * FROM `posts` CROSS JOIN `users` ON `posts`.`user_id` = `users`.`id`;
```

## Basic Where Clauses

### Where Clauses

```js
const users = await new DB("users").where("id", 1).findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1'

const users = await new DB("users")
  .where("id", 1)
  .where("username", "try to find")
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1' and `users`.`username` = 'try to find'

const users = await new DB("users").where("id", ">", 1).findMany();
// SELECT * FROM `users` WHERE `users`.`id` > '1';

const users = await new DB("users").where("id", "<>", 1).findMany();
// SELECT * FROM `users` WHERE `users`.`id` <> '1';
```

### Or Where Clauses

```js
const users = await new DB("users").where("id", 1).orWhere("id", 2).findMany();
// SELECT * FROM `users` WHERE `users`.`id` = 1 OR `users`.`id` = 2

const users = await new DB("users")
  .where("id", 1)
  .whereQuery((query) => {
    return query
      .where("id", "<>", 2)
      .orWhere("username", "try to find")
      .orWhere("email", "find@example.com");
  })
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = 1
// AND
// ( `users`.`id` <> 2 OR `users`.`username` = 'try to find' OR `users`.`email` = 'find@example.com');

```

### Where cases

```js
const payments = await new DB('payments')
.whereCases([
  {
    when : "payment_type = 'credit'",
    then : "status = 'approved'"
  },
  {
    when : "payment_type = 'paypal'",
    then : "status = 'pending'"
  }
],"FALSE")
.findMany()

// SELECT * FROM `payments` 
// WHERE ( 
// CASE 
//  WHEN payment_type = 'credit' THEN status = 'approved' 
//  WHEN payment_type = 'paypal' THEN status = 'pending' 
//  ELSE FALSE 
// END 
// );

const tasks = await new DB("tasks")
.whereCases([
  {
    when : "priority = 'high'",
    then : "DATEDIFF(due_date, NOW()) <= 3"
  },
],"DATEDIFF(due_date, NOW()) <= 7")
.findMany()

// SELECT * FROM `tasks` 
// WHERE ( 
//  CASE 
//    WHEN priority = 'high' THEN DATEDIFF(due_date, NOW()) <= 3 
//    ELSE DATEDIFF(due_date, NOW()) <= 7 
//  END 
// );

```

### Where Object Clauses

```js
import { OP } from 'tspace-mysql'

const whereObject = await new DB("users")
  .whereObject({
    id :  OP.notEq(1),
    username :  OP.in(['user1','user2']),
    name :  OP.like('%value%')
  })
  .findMany();

// SELECT * FROM `users` WHERE `users`.`id` <> '1' AND `users`.`username` = 'user1' AND `users`.`name` LIKE '%value%';

```

### JSON Where Clauses

```js
const whereJSON = await new DB("users")
  .whereJSON("json", { key: "id", value: "1234" })
  .findMany();
// SELECT * FROM `users` WHERE `users`.`json`->>'$.id' = '1234';
```

### Additional Where Clauses

```js
const users = await new DB("users").whereIn("id", [1, 2]).findMany();
// SELECT * FROM `users` WHERE `users`.`id` IN ('1','2');

const users = await new DB("users").whereNotIn("id", [1, 2]).findMany();
// SELECT * FROM `users` WHERE `users`.`id` NOT IN ('1','2');

const users = await new DB("users").whereBetween("id", [1, 2]).findMany();
// SELECT * FROM `users` WHERE `users`.`id` BETWEEN '1' AND '2';

const users = await new DB("users").whereNotBetween("id", [1, 2]).findMany();
// SELECT * FROM `users` WHERE `users`.`id` NOT BETWEEN '1' AND '2';

const users = await new DB("users").whereNull("username").findMany();
// SELECT * FROM `users` WHERE `users`.`username` IS NULL;

const users = await new DB("users").whereNotNull("username").findMany();
// SELECT * FROM `users` WHERE `users`.`username` IS NOT NULL;
```

### Logical Grouping

```js
const users = await new DB("users")
  .whereQuery((query) => query.where("id", 1).where("username", "values"))
  .whereIn("id", [1, 2])
  .findOne();
// SELECT * FROM `users` WHERE ( `users`.`id` = '1' AND `users`.`username` = 'values') AND `users`.`id` IN ('1','2'') LIMIT 1;

const users = await new DB("users")
  .where("id", 1)
  .whereQuery((query) => {
    return query
      .where("id", "<>", 2)
      .where("username", "try to find")
      .where("email", "find@example.com");
  })
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1'
// AND
// ( `users`.`id` <> '2' AND `users`.`username` = 'try to find' AND `users`.`email` = 'find@example.com');

const users = await new DB("users")
  .whereAny(["name", "username", "email"], "like", `%v%`)
  .findMany();
// SELECT * FROM `users` WHERE ( `users`.`name` LIKE '%v%' OR `users`.`username` LIKE '%v%' OR `users`.`email` LIKE '%v%');

const users = await new DB("users")
  .whereAll(["name", "username", "email"], "like", `%v%`)
  .findMany();
// SELECT * FROM `users` WHERE ( `users`.`name` LIKE '%v%' AND `users`.`username` LIKE '%v%' AND `users`.`email` LIKE '%v%');
```

## Advanced Where Clauses

### Where Exists Clauses

```js
const users = await new DB("users")
  .whereExists(new DB("users").select("id").where("id", 1).toString())
  .findMany();
// SELECT * FROM `users` WHERE EXISTS (SELECT `id` FROM `users` WHERE id = 1);

const users = await new DB("users")
  .wherNoteExists(new DB("users").select("id").where("id", 1).toString())
  .findMany();
// SELECT * FROM `users` WHERE NOT EXISTS (SELECT `id` FROM `users` WHERE id = 1);
```

### Subquery Where Clauses

```js
const users = await new DB("users")
  .whereSubQuery("id", "SELECT id FROM users")
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` IN (SELECT id FROM users);

const users = await new DB("users")
  .whereSubQuery("id", new DB("users").select("id").toString())
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` IN (SELECT id FROM users);

const users = await new DB("users")
  .whereSubQuery(
    "id",
    new DB("users")
      .select("id")
      .whereSubQuery("id", new DB("posts").select("user_id").toString())
      .toString()
  )
  .findMany();
/*
  SELECT * FROM `users` 
  WHERE `users`.`id`
    IN (
      SELECT `users`.`id` FROM `users` 
      WHERE `users`.`id` 
        IN (
          SELECT `posts`.`user_id` FROM `posts` 
        )
    );
*/
```

### Conditional Where Clauses

```js
const users = await new DB("users")
  .where("id", 1)
  .when(true, (query) => query.where("username", "when is actived"))
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1' AND `users`.`username` = 'when is actived';

const users = await new DB("users")
  .where("id", 1)
  .when(false, (query) => query.where("username", "when is actived"))
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1';
```

## GetGroupBy

```js
const data = await new DB("posts").getGroupBy('user_id')

// return new Map()
// find posts by user id
const userHasPosts = data.get(1)

console.log(userHasPosts)

```

## Paginating

```js
const users = await new DB("users").paginate();
// SELECT * FROM `users` LIMIT 15 OFFSET 0;
// SELECT COUNT(*) AS total FROM `users`;

const pageTwoUsers = await new DB("users").paginate({ page: 2, limit: 5 });

/*
  SELECT * FROM `users` LIMIT 5 OFFSET 5;
  SELECT COUNT(*) AS total FROM `users`;
  
  the results are returned
  {
    meta: {
      total: n,
      limit: 5,
      count: 5,
      current_page: 2,
      last_page: n,
      next_page: 3,
      prev_page: 1
    },
    data: [...your data here]
  }

*/
```
## Hook Statements

```js
const hookImage = async (results) => {
  for(const result of results) {
    result.image = await ...getImage()
  }
};
const user = await new DB("users").where("id", 1).hook(hookResult).findMany();
```

## Faker Statements

```js
await new DB("users").faker(2);
/**
  INSERT INTO `users`  
    (`users`.`username`,`users`.`email`)
  VALUES
    ('ivsvtagyta86n571z9d81maz','fxcwkubccdi5ewos521uqexy'),
    ('rnr4esoki7fgekmdtarqewt','gv0mzb1m3rlbinsdyb6')
 */

// custom faker
await new DB("users").faker(5, (row, index) => {
  return {
    username: `username-${index + 1}`,
    email: `email-${index + 1}`,
  };
});

/**
  
INSERT INTO `users` 
  (`users`.`username`,`users`.`email`) 
VALUES 
  ('username-1','email-1'),
  ('username-2','email-2'),
  ('username-3','email-3'),
  ('username-4','email-4'),
  ('username-5','email-5');

 */

// fast to create
await new DB("users").faker(40_000);
```

## Unset Statements

```js

const userInstance = new User().where('email','test@gmail.com')
  
const exits = await userInstance.exists()
// SELECT EXISTS (SELECT 1 FROM `users` WHERE `users`.`email` = 'test@gmail.com' LIMIT 1) AS `aggregate`;

const user = await userInstance.orderBy('id').findOne()
// SELECT * FROM `users` WHERE `users`.`email` = 'test@gmail.com' ORDER BY `users`.`id` DESC LIMIT 1;

const users = await userInstance.select('id').unset({ limit : true }).findMany()
// SELECT `users`.`id` FROM `users` WHERE `users`.`email` = 'test@gmail.com' ORDER BY `users`.`id` DESC;

const usersUnsetWhereStatement = await userInstance.unset({ select : true, where : true , orderBy : true }).findMany()
// SELECT * FROM `users` WHERE `users`.`deletedAt` IS NULL;

```

## Common Table Expressions
```js
const user = await new User()
.CTEs('z', (query) => {
  return query
  .from('posts')
})
.CTEs('x', (query) => {
  return query
  .from('post_user')
})
.select('users.*','x.*','z.*')
.join('users.id','x.user_id')
.join('users.id','z.user_id')
.findOne()

// WITH z AS (SELECT posts.* FROM `posts`), 
// x AS (SELECT * FROM `post_user`) 
// SELECT users.*, z.*, x.* FROM `users` INNER JOIN `x` ON `users`.`id` = `x`.`user_id` INNER JOIN `z` ON `users`.`id` = `z`.`user_id` WHERE `users`.`deleted_at` IS NULL LIMIT 1;

```
## Union
```js
const users = await new DB('users')
.where('id',1)
.union(new DB('users').whereIn('id',[2]))
.union(new DB('users').whereIn('id',[3,4]))
.findMany()

// (SELECT * FROM `users` WHERE `users`.`id` = 1) 
// UNION (SELECT * FROM `users` WHERE `users`.`id` IN (2)) 
// UNION (SELECT * FROM `users` WHERE `users`.`id` IN (3,4)); 


const users = await new DB('users')
.unionAll(new DB('users'))
.unionAll(new DB('users'))
.findMany()

// (SELECT * FROM `users`) 
// UNION ALL (SELECT * FROM `users`)  
// UNION ALL (SELECT * FROM `users`); 

```

## More Methods

```js
where(column , OP , value)
whereSensitive(column , OP , value)
whereId(id)
whereUser(userId)
whereEmail(value)
whereIn(column , [])
whereNotIn(column , [])
whereNull(column)
whereNotNull(column)
whereBetween (column , [value1 , value2])
whereQuery(callback)
whereJson(column, { targetKey, value , OP })
whereRaw(sql)
whereExists(sql)
whereSubQuery(colmn , rawSQL)
whereNotSubQuery(colmn , rawSQL)
orWhere(column , OP , value)
orWhereRaw(sql)
orWhereIn(column , [])
orWhereSubQuery(colmn , rawSQL)
when(contition , callback)
select(column1 ,column2 ,...N)
distinct()
selectRaw(column1 ,column2 ,...N)
except(column1 ,column2 ,...N)
exceptTimestamp()
only(column1 ,column2 ,...N)
hidden(column1 ,column2 ,...N)
join(primary key , table.foreign key)
rightJoin (primary key , table.foreign key)
leftJoin (primary key , table.foreign key)
limit (limit)
having (condition)
havingRaw (condition)
orderBy (column ,'ASC' || 'DSCE')
orderByRaw(column ,'ASC' || 'DSCE')
latest (column)
latestRaw (column)
oldest (column)
oldestRaw (column)
groupBy (column)
groupByRaw (column)
create(objects)
createMultiple(array objects)
update (objects)
updateMany (objects)
updateCases([{ condition, columns }])
createNotExists(objects)
updateOrCreate (objects)
onlyTrashed()
connection(options)
backup({ database , connection })
backupToFile({ filePath, database , connection })
hook((result) => ...) // callback result to function
sleep(seconds)

/**
 * registry relation in your models
 * @relationship
 */
hasOne({ name, model, localKey, foreignKey, freezeTable , as })
hasMany({ name, model, localKey, foreignKey, freezeTable , as })
belongsTo({ name, model, localKey, foreignKey, freezeTable , as })
belongsToMany({ name, model, localKey, foreignKey, freezeTable, as, pivot })
/**
 * @relation using registry in your models
 */
relations(name1 , name2,...nameN) // with(name1, name2,...nameN)
/**
 * @relation using registry in your models ignore soft delete
 */
relationsAll(name1 , name2,...nameN) // withAll(name1, name2,...nameN)
/**
 * @relation using registry in your models. if exists child data remove this data
 */
relationsExists(name1 , name2,...nameN) // withExists(name1, name2,...nameN)
/**
 * @relation using registry in your models return only in trash (soft delete)
 */
relationsTrashed(name1 , name2,...nameN) // withTrashed(name1, name2,...nameN)
/**
 * @relation call a name of relation in registry, callback query of data
 */
relationQuery(name, (callback) ) // withQuery(name1, (callback))

/**
 * @relation where of relation in registry, callback query of data
 */
whereHas(relation,(callback))
whereNotHas(relation,(callback))


/**
 * queries statements
 * @execute data of statements
*/
findMany() // get()
findOne() // first()
find(id)
delelte()
delelteMany()
exists()
toString()
toJSON()
toArray(column)
count(column)
sum(column)
avg(column)
max(column)
min(column)
pagination({ limit , page })
save() /* for actions statements insert or update */
makeSelectStatement()
makeInsertStatement()
makeUpdateStatement()
makeDeleteStatement()
makeCreateTableStatement()

```

<div class="page-nav-cards">
  <a href="#/sql-like" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> SQL Like</div>
  </a>

  <a href="#/database-transactions" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title">Database Transactions</div>
  </a>
</div>

# race-condition.md

# Race Condition

Within a race condition, you can utilize the following:

```js
import { Model, DB, Blueprint }  from 'tspace-mysql'

class Product extends Model {
  protected boot() {
    this.useSchema({
      id     : Blueprint.int().notNull().primary().autoIncrement(),
      name   : Blueprint.varchar(20).notNull(),
      stock  : Blueprint.int().notNull()
    });
  }
}

class Order extends Model {
  protected boot() {
    this.useSchema({
      id          : Blueprint.int().notNull().primary().autoIncrement(),
      user_id     : Blueprint.int().notNull(),
      product_id  : Blueprint.int().notNull()
      qty         : Blueprint.int().notNull()
    });
  }
}

const purchaseForUpdate = async({userId , productId , qty } : { 
  userId: number;
  productId: number;
  qty: number 
}): Promise<void> => {
  const trx = await DB.beginTransaction()

  // ********************************************************************************
  // To verify the transaction correctly, do not use an IP load balancer; 
  // use cluster mode instead.
  
  // If your cluster has more than one master node:
  // Use `await DB.beginTransaction({ nodeId: <your node number> })` 
  // to lock a specific node for writing.
  
  // Alternatively, use `await DB.beginTransaction({ primaryId: <your primary ID> })`
  // In cases you cannot specify the node (for example, if the product ID is always 1).

  try {
   
    await trx.startTransaction()

    const product = await new Product()
    .where('id',productId)
    .rowLock('FOR_UPDATE') // don't forget this, lock this product for update
    .bind(trx)
    .first()

    if (product == null) throw new Error("Product not found");

    if (product.stock < qty) throw new Error("Not enough stock");

    await new Product()
    .where('id',productId)
    .update({
      stock : product.stock - qty,
      id: productId
    })
    .bind(trx)
    .save()

    await new Order()
    .create({
      user_id : userId,
      product_id : productId,
      qty
    })
    .bind(trx)
    .save()

    await trx.commit();
    console.log(`✅ [FOR UPDATE] User ${userId} purchased ${qty}`);

  } catch (err: any) {
    await trx.rollback();
    console.log(`❌ [FOR UPDATE] User ${userId} failed: ${err.message}`);
  } finally {
    await trx.end();
  }
}

const simulateRaceConnection = async (): Promise<void> => {

  const MAX_CONNECTION = 500;
  const TASKS: Function[] = [];
  const STOCK = MAX_CONNECTION * 10

  await new Product()
  .where('id',1)
  .update({
    stock : STOCK,
  })
  .save()

  const successes : number[] = []
  const fails     : number[] = []
  let purchased   : number = 0
  let outOfStock  : number = 0
  for (let i = 1; i <= MAX_CONNECTION; i++) {
    TASKS.push(async () => {
      const qty = Math.floor(Math.random() * 30) + 1 
      await purchaseForUpdate({
        userId : i, 
        productId : 1 , 
        qty
      })
      .then(_ => {
        successes.push(1)
        purchased += qty
      })
      .catch(_ => {
        fails.push(1)
        outOfStock += qty
      })
    });
  }

  console.log("=== Simulation ===");
  const start = Date.now();
  await Promise.all(TASKS.map(v => v()));
  const end = Date.now();
  console.log(`USING TIME TO TEST IN ${end - start} ms`)
  console.log(`ALL STOCK: ${STOCK} qty`)
  console.log(`✅ [SUCCESS(${successes.length})] [Purchased]: ${purchased} qty`);
  console.log(`❌ [FAIL(${fails.length})] [OutOfStock]: ${outOfStock} qty`);
  console.log('======== DONE ============')
  process.exit(0)
}

simulateRaceConnection();

```

<div class="page-nav-cards">
  <a href="#/database-transactions" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Database Transactions </div>
  </a>

  <a href="#/connection" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Connection </div>
  </a>
</div>

# repository.md


# Repository
```js
Repository is a mechanism that encapsulates all database operations related to a specific model. 
It provides methods for querying, inserting, updating, and deleting records in the database associated with the model.

** The Repository check always type Type Safety if model is used the type of schema 

```
## Select Statements
```js
import { Repository, OP , type T } from 'tspace-mysql'
import { User } from '../Models/User'

const userRepository = Repository(User)
const needPhone = true
const user = await userRepository.findOne({
  select : {
    id : true,
    name : true,
    username : true,
    phone : {
      id : true,
      name : true,
      user_id : true,
    }
  },
  where : {
    id: 1
  },
  when : {
    condition : needPhone,
    query: () => ({
      relations : {
        phone : true
        /** 
         You can also specify the phone with any methods of the repository
        phone : {
          where : {
            id : 41
          },
          select : {
            id : true,
            user_id : true
          }
        }
        */
      }
    })
  },
  model : (query) => {
    return query // returning self model you can using any method in your model.
    // query.where('id',1)
    // query.customMethodWhereUser(1)
  }
})

const users = await userRepository.findMany({
  select : {
    id : true,
    name : true,
    username : true,
  },
  limit : 3,
  orderBy : {
    id : 'ASC',
    name : 'DESC'
  }
  groupBy : ['id'],
  where : {
    id: OP.in([1,2,3])
  }
})

const userPaginate = await userRepository.pagination({
  select : {
    id : true,
    name : true,
    username : true,
  },
  page : 1,
  limit : 3,
  where : {
    id:  OP.in([1,2,3])
  }
})

const findFullName = await userRepository.findOne({
  select : {
    name : true,
    [`${DB.raw('CONCAT(firstName," ",lastName) as fullName')}`]: true
  }
  whereRaw : [
    `CONCAT(firstName," ",lastName) LIKE '%${search}%'`
  ]
})
```
## Insert Statements
```js
const userRepository = Repository(User)

const created = await userRepository.create({
  data : {
    name : "repository-name",
    // ....
  }
})

const createdMultiple = await u.createMultiple({
  data : [
    {
      name: "tspace4",
      // ....
    },
    {
      name: "tspace5",
      // ....
    },
    {
      name: "tspace6",
      // ....
    }
    // ....
  ]
})

const createdNotExists = await userRepository.createNotExists({
  data : {
    name : "repository-name",
    // ....
  },
  where : {
    id : 1
  }
})

const createdOrSelected = await userRepository.createOrSelect({
  data : {
    name : "repository-name",
    // ....
  },
  where : {
    id : 1
  }
})


```
## Update Statements
```js
const userRepository = Repository(User)

const updated = await userRepository.update({
  data : {
    name : "repository-name",
    // ....
  },
  where : {
    id : 1
  }
})

```
## Delete Statements
```js
const userRepository = Repository(User)

const deleted = await userRepository.delete({
  where : {
    id : 1
  }
})

```

## Transactions

```js
import { DB , Repository } from 'tspace-mysql'
import { User } from '../Models/User'
const userRepository = Repository(User)

const transaction = await DB.beginTransaction()

try {
  await transaction.startTransaction()

  const created = await userRepository.create({
    data : {
      name : "repository-name",
      // ....
    },
    transaction // add this for the transaction
  })

  const updated = await userRepository.update({
    data : {
      name : "repository-name",
      // ....
    },
    where : {
      id : created.id
    },
    transaction
  })

  // after your use commit if use same transction for actions this transction will auto commit
  await transaction.commit()

  // ensure the nothing with transction just use end of transction
  await transaction.end();

} catch (err) {

  await transaction.rollback()
}

```

## Relations
```js
import { Repository , OP } from 'tspace-mysql'
import { User } from '../Models/User'
import { Phone } from '../Models/Phone'

const userRepository = Repository(User)

const userHasPhones = await userRepository.findOne({
  select : {
    id : true,
    name : true,
    username : true,
    phone : {
      id : true,
      user_id : true,
      name: true
    }
  },
  where : {
    id: 1
  },
  relations: {
    phone: {
      user : true
    }
  }
});

const phoneRepository = Repository(Phone)

const phoneBelongUser = await phoneRepository.findOne({
  select : '*',
  where : {
    id: 1
  },
  relations : {
    user : { // you can using any options in method findOne too
      select: {
        id: true,
        name: true
      },
      where: {
        id: 2
      }
    }
  }
})

```

<div class="page-nav-cards">
  <a href="#/model" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Model </div>
  </a>

  <a href="#/view" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> View </div>
  </a>
</div>

# sidebar.md

- [Getting Started]()
- [Integrations](integrations)
- [SQL Like](sql-like)
- [Query Builder](query-builder)
- [Database Transactions](database-transactions)
- [Race Condition](race-condition)
- [Connection](connection)
- [Backup](backup)
- [Injection](injection)
- [Model](model)
- [Repository](repository)
- [View](view)
- [Stored Procedure](stored-procedure)
- [Blueprint](blueprint)
- [Cli](cli)


# sql-like.md

# SQL Like
SQL (Structured Query Language) is used to manage data in relational databases.  
Here are the four most common commands with **tspace-mysql** examples:

## Select Statements
SQL LIKE select statement Retrieve data from a table. You can select specific columns or all columns.

```js
import { sql, OP } from 'tspace-mysql'

await sql()
  .select('id', 'name')
  .from('users')
  .where({
    name: 'tspace',
    id: OP.in([1, 2, 3])
  })
  .limit(3)
  .orderBy('name')

```

## Insert Statements
SQL LIKE insert statement Add new data into a table.

```js
import { sql } from 'tspace-mysql'

await sql()
  .insert('users')
  .values({
    email: 'tspace@example.com'
  })

await sql()
  .insert('users')
  .values({
    email: 'tspace@example.com'
  })
  .returning({
    id: true,
    email: true,
    enum: true
  })
```

## Update Statements

Modify existing data in a table.

```js
import { sql } from 'tspace-mysql'

await sql()
  .update('users')
  .where({ id: 1 })
  .set({
    email: 'tspace@example.com'
  })

await sql()
  .update('users')
  .where({ id: 1 })
  .set({
    email: 'tspace@example.com'
  })
  .returning()

```

## Delete Statements

Remove data from a table.

```js
import { sql } from 'tspace-mysql'

await sql()
  .delete('users')
  .where({ id: 1 })
  
```
<div class="page-nav-cards">
    <a href="#" class="prev-card">
      <div class="nav-label"> 
          <span class="page-nav-arrow">←</span> 
          Previous
      </div>
      <div class="nav-title"> Getting Started</div>
    </a>

  <a href="#/query-builder" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title">Query Builder</div>
  </a>
</div>

# stored-procedure.md

# Stored Procedure
StoredProcedure is a predefined set of SQL statements stored in the database that you can call (execute) by name.
```js
import {  StoredProcedure } from 'tspace-mysql'

type T = {
  AddUser: {
      params: {
          name : string;
          email: string;
      } | [string,string];
      result: {
          fieldCount: number;
          affectedRows: number;
          insertId: number;
          info: string;
          serverStatus: number;
          warningStatus: number;
          changedRows: number;
      }
  };
    GetUser: {
      params: [number];
      result: any[]
  },
  GetUsers: {
      params: [];
      result: any[]
  }
};

class MyStoreProcedure extends StoredProcedure<T> {
  protected boot(): void {

    this.createProcedure({
      name: 'AddUser',
      expression: `
          CREATE PROCEDURE AddUser(IN name VARCHAR(255), IN email VARCHAR(255))
          BEGIN
            INSERT INTO users (name, email) VALUES (name, email);
          END;
      `,
      synchronize: true
    });

    this.createProcedure({
      name: 'GetUsers',
      expression: `
          CREATE PROCEDURE GetUsers()
          BEGIN
            SELECT * FROM users LIMIT 5;
          END;
      `,
      synchronize: true
    });

    this.createProcedure({
      name: 'GetUser',
      expression: `
          CREATE PROCEDURE GetUser(IN userId INT)
          BEGIN
            SELECT * FROM users WHERE id = userId LIMIT 1;
          END;
      `,
      synchronize: true
    })
  }
}

const storeProcedure = new MyStoreProcedure()

storeProcedure.call('AddUser', { name : 'tspace-mysql' , email : 'tspace-mysql@example.com'})
.then(r => console.log(r))
.catch(e => console.log(e))

storeProcedure.call('GetUser',[1])
.then(r => console.log(r))
.catch(e => console.log(e))

storeProcedure.call('GetUsers',[])
.then(r => console.log(r))
.catch(e => console.log(e))

```

<div class="page-nav-cards">
  <a href="#/view" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> View </div>
  </a>

  <a href="#/blueprint" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Blueprint </div>
  </a>
</div>

# view.md

# View

Your database schema can also use views. These views are represented by classes that behave similarly to models, 
but they are based on stored SQL queries instead of actual tables.
Let's look at a basic view class example:
```js
import { type T, Blueprint, Model , View , Meta } from 'tspace-mysql'

const schemaUser = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null().index(),
  name: Blueprint.varchar(191).notNull(),
  email: Blueprint.varchar(191).notNull()
}

type TUser = T.Schema<typeof schemaUser>

class User extends Model<TUser> {
  protected boot(): void {
    this.useSchema(schemaUser)
  }
}

const schemaPost = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null().index(),
  user_id :Blueprint.int().notnull(),
  title: Blueprint.varchar(191).notNull(),
  content: Blueprint.varchar(191).notNull()
}

type TPost = T.Schema<typeof schemaPost>

class Post extends Model<TPost> {
  protected boot(): void {
    this.useSchema(schemaPost)
  }
}

const schemaUserPostCountView = {
  id :Blueprint.int().notNull().primary().autoIncrement(),
  user_id :Blueprint.int().notnull(),
  name :Blueprint.varchar(255).null(),
  post_count : Blueprint.int().notnull()
}

type TSUserPostCountView = T.Schema<typeof schemaUserPostCountView>
type TRUserPostCountView = T.Relation<{
  user: User
}>

class UserPostCountView extends View<TSUserPostCountView,TRUserPostCountView> {

  protected boot(): void {
    this.useSchema(schemaUserPostCountView)
    const metaUser = Meta(User)
    const metaPost = Meta(Post)

    this.createView({
      synchronize: true,
      expression : new User()
      .selectRaw(`ROW_NUMBER() OVER (ORDER BY ${metaUser.columnRef('id')}) AS id`)
      .selectRaw(`${metaUser.columnRef('id')} AS user_id`)
      .selectRaw(metaUser.columnRef('name'))
      .select(metaUser.columnRef('email'))
      .selectRaw(`COUNT(${metaPost.columnRef('id')}) AS post_count`)
      .leftJoin(metaUser.columnRef('id'),metaPost.columnRef('user_id'))
      .groupBy(metaUser.columnRef('id'))
      .groupBy(metaUser.columnRef('name'))
      .toString()

      // Look like this
      // expression : 
      // SELECT 
      //   ROW_NUMBER() OVER (ORDER BY `users`.`id`) AS id, 
      //   `users`.`id` AS user_id, `users`.`name`, `users`.`email`, 
      //   COUNT(`posts`.`id`) AS post_count 
      //   FROM `users` 
      //   LEFT JOIN `posts` ON `users`.`id` = `posts`.`user_id` 
      //   GROUP BY `users`.`id`, `users`.`name`
    })

    this.belongsTo({ name : 'user' , model : User })
  }
}

new UserPostCountView()
.with('user')
.get()
.then( v=> {
  console.log(v)
})

```

<div class="page-nav-cards">
  <a href="#/repository" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Repository </div>
  </a>

  <a href="#/stored-procedure" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Stored Procedure </div>
  </a>
</div>