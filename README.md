## tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

tspace-mysql is an Object-Relational Mapping (ORM) tool designed to run seamlessly in Node.js and is fully compatible with TypeScript. It consistently supports the latest features in both TypeScript and JavaScript, providing additional functionalities to enhance your development experience.

## Feature

| **Feature**                   | **Description**                                                                                          |
|-------------------------------|----------------------------------------------------------------------------------------------------------|
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
npm install tspace-mysql --save
npm install tspace-mysql -g
```

## Basic Usage

- [Configuration](#configuration)
- [SQL Like](#sql-Like)
- [Query Builder](#query-builder)
  - [Table Name & Alias Name](#table-name--alias-name)
  - [Returning Results](#returning-results)
  - [Query Statement](#query-statements)
  - [Select Statements](#select-statements)
  - [Raw Expressions](#raw-expressions)
  - [Ordering, Grouping, Limit and Offset](#ordering-grouping-limit-and-offset)
    - [Ordering](#ordering)
    - [Grouping](#grouping)
    - [Limit and Offset](#limit-and-offset)
  - [Joins](#joins)
    - [Inner Join Clause](#inner-join-clause)
    - [Left Join, Right Join Clause](#left-join-right-join-clause)
    - [Cross Join Clause](#cross-join-clause)
  - [Basic Where Clauses](#basic-where-clauses)
    - [Where Clauses](#where-clauses)
    - [Or Where Clauses](#or-where-clauses)
    - [Where Object Clauses](#where-object-clauses)
    - [JSON Where Clauses](#json-where-clauses)
    - [Additional Where Clauses](#additional-where-clauses)
    - [Logical Grouping](#logical-grouping)
  - [Advanced Where Clauses](#advanced-where-clauses)
    - [Where Exists Clauses](#where-exists-clauses)
    - [Subquery Where Clauses](#subquery-where-clauses)
    - [Conditional Where Clauses](#conditional-where-clauses)
  - [GetGroupBy](#getgroupby)
  - [Paginating](#paginating)
  - [Insert Statements](#insert-statements)
  - [Update Statements](#update-statements)
  - [Delete Statements](#delete-statements)
  - [Hook Statements](#hook-statements)
  - [Faker Statements](#faker-statements)
  - [Unset Statements](#unset-statements)
  - [Common Table Expressions](#common-table-expressions)
  - [More Methods](#more-methods)
- [Database Transactions](#database-transactions)
- [Connection](#connection)
- [Backup](#backup)
- [Injection](#injection)
- [Generating Model Classes](#generating-model-classes)
- [Model Conventions](#model-conventions)
  - [Basic Model Setup](#basic-model-setup)
    - [Table Name](#table-name)
    - [Pattern](#pattern)
    - [UUID](#uuid)
    - [Timestamp](#timestamp)
    - [Debug](#debug)
    - [Observer](#observer)
    - [Logger](#logger)
    - [Hooks](#hooks)
    - [Global Scope](#global-scope)
  - [Schema](#schema)
    - [Schema Model](#schema-model)
    - [Virtual Column](#virtual-column)
    - [Validation](#validation)
    - [Sync](#sync)
  - [SoftDelete](#softdelete)
  - [Joins Model](#joins-model)
    - [Inner Join Model Clause](#inner-join-model-clause)
    - [Left Join , Right Join Model Clause](#left-join-right-join-model-clause)
    - [Cross Join Model Clause](#cross-join-model-clause)
  - [Relationships](#relationships)
    - [One To One](#one-to-one)
    - [One To Many](#one-to-many)
    - [Belongs To](#belongs-to)
    - [Many To Many](#many-to-many)
    - [Relation](#relation)
    - [Deeply Nested Relations](#deeply-nested-relations)
    - [Relation Exists](#relation-exists)
    - [Relation Count](#relation-count)
    - [Relation Trashed](#relation-trashed)
    - [Built in Relation Functions](#built-in-relation-functions)
  - [Cache](#cache)
  - [Decorator](#decorator)
  - [Type Safety](#type-safety)
    - [Type Safety Select](#type-safety-select)
    - [Type Safety OrderBy](#type-safety-order-by)
    - [Type Safety GroupBy](#type-safety-group-by)
    - [Type Safety Where](#type-safety-where)
    - [Type Safety Insert](#type-safety-insert)
    - [Type Safety Update](#type-safety-update)
    - [Type Safety Delete](#type-safety-delete)
    - [Type Safety Relationships](#type-safety-relationships)
    - [Type Safety Results](#type-safety-results)
  - [Metadata](#metadata)
- [Repository](#repository)
  - [Repository Select Statements](#repository-select-statements)
  - [Repository Insert Statements](#repository-insert-statements)
  - [Repository Update Statements](#repository-update-statements)
  - [Repository Delete Statements](#repository-delete-statements)
  - [Repository Transactions](#repository-transactions)
  - [Repository Relations](#repository-relations)
- [View](#view)
- [Stored Procedure](#stored-procedure)
- [Blueprint](#blueprint)
- [Cli](#cli)
  - [Make Model](#make-model)
  - [Make Migration](#make-migration)
  - [Migrate](#migrate)
  - [Query](#query)
  - [Dump](#dump)
  - [Generate Models](#generate-models)
  - [Migration Models](#migration-models)
  - [Migration DB](#migration-db)

## Configuration

To establish a connection, the recommended method for creating your environment variables is by using a '.env' file. using the following:

```js
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

You can also create a file named 'db.tspace' to configure the connection. using the following:

```js
source db {
    host               = localhost
    port               = 3306
    database           = npm
    user               = root
    password           = database
    connectionLimit    = 10
    dateStrings        = true
    connectTimeout     = 60000
    waitForConnections = true
    queueLimit         = 0
    charset            = utf8mb4
}

```

## SQL Like
```js
import { sql , OP }  from 'tspace-mysql'

// select
await sql()
  .select('id','name')
  .from('users')
  .where({
    'name' : 'tspace'
    'id' : OP.in([1,2,3])
  })
  .limit(3)
  .orderBy('name')

// insert
await sql()
.insert('users')
.values({
  email : 'tspace@example.com'
})

// insert return data
await sql()
.insert('users')
.values({
  email : 'tspace@example.com'
})
.returning({
  id : true,
  email : true,
  enum : true
})

// update
await sql()
.update('users')
.where({
  id : 1
})
.set({
  email : 'tspace@example.com'
})

// update return data
await sql()
.update('users')
.where({
  id : 1
})
.set({
  email : 'tspace@example.com'
})
.returning()

//delete
await sql()
.delete('users')
.where({
  id : 1
})


```

## Query Builder

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


+-------------+--------------+----------------------------+
|                     table posts                         |
+-------------+--------------+----------------------------+
| id          | user_id      | title                      |
|-------------|--------------|----------------------------|
| 1           | 1            | posts tspace               |
| 2           | 2            | posts tspace2              |
+-------------+--------------+----------------------------+

```

### Table Name & Alias Name

```js
import { DB }  from 'tspace-mysql'

await new DB().from('users').find(1)
// SELECT * FROM `users` WHERE `users`.`id` = '1' LIMIT 1;

await new DB().table('users').find(1)
// SELECT * FROM `users` WHERE `users`.`id` = '1' LIMIT 1;

await new DB().table('users').alias('u').find(1)
// SELECT * FROM `users` AS `u` WHERE `u`.`id` = '1' LIMIT 1;

await new DB().fromRaw('u',new DB('users').select('*').limit(1).toString()).find(1)
// SELECT * FROM ( SELECT * FROM `users` LIMIT 1 ) AS `u` WHERE `u`.`id` = '1' LIMIT 1;

await new DB().alias('u',new DB('users').select('*').limit(1).toString()).find(1)
// SELECT * FROM ( SELECT * FROM `users` LIMIT 1 ) AS `u` WHERE `u`.`id` = '1' LIMIT 1;

```

### Returning Results

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
// SELECT * FROM `users` WHERE `users`.`id` = '1' OR `users`.`id` = '2'

const users = await new DB("users")
  .where("id", 1)
  .whereQuery((query) => {
    return query
      .where("id", "<>", 2)
      .orWhere("username", "try to find")
      .orWhere("email", "find@example.com");
  })
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1'
// AND
// ( `users`.`id` <> '2' OR `users`.`username` = 'try to find' OR `users`.`email` = 'find@example.com');

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
      total_page: 5,
      current_page: 2,
      last_page: n,
      next_page: 3,
      prev_page: 1
    },
    data: [...your data here]
  }

*/
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
  .updateMultiple([
    {
      when: {
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
updateMultiple(array objects)
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

## Database Transactions

Within a database transaction, you can utilize the following:

```js
const connection = await new DB().beginTransaction();

try {
  /**
   *
   * @startTransaction start transaction in scopes function
   */
  await connection.startTransaction();

  const user = await new User()
    .create({
      name: `tspace`,
      email: "tspace@example.com",
    })
    /**
     *
     * bind method for make sure this connection has same transaction in connection
     * @params {Function} connection
     */
    .bind(connection)
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
    .bind(connection) // don't forget this
    .save();

  /**
   *
   * @commit commit transaction to database
   */
  // After your use commit if use same connection for actions this transction will auto commit
  await connection.commit();

  // If you need to start a new transaction again, just use wait connection.startTransaction();

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
    // Using this connection now will auto-commit to the database.
    .bind(connection) // If you need to perform additional operations, use await connection.startTransaction(); again.
    .save();

   
    // Do not perform any operations with this connection.
    // The transaction has already been committed, and the connection is closed.
    // Just ensure everything is handled at the end of the transaction.
    await connection.end();
  
} catch (err) {
  /**
   *
   * @rollback rollback transaction
   */
  await connection.rollback();
}
```

## Connection

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

## Backup

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

## Injection

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

## Generating Model Classes

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

## Model Conventions

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
     *    createdAt : 'created_at',
     *    updatedAt : 'updated_at'
     * }) // runing a timestamp when insert or update
     * this.useSoftDelete('deletedAt') // => default target to colmun deleted_at
     * this.useTable('users')
     * this.useTableSingular() // => 'user'
     * this.useTablePlural() // => 'users'
     * this.useUUID('uuid') // => runing a uuid (universally unique identifier) when insert new data
     * this.useRegistry() // => build-in functions registry
     * this.useLoadRelationsInRegistry() // => auto generated result from relationship to results
     * this.useBuiltInRelationFunctions() // => build-in functions relationships to results
     * this.useHooks([(r) => console.log(r)])
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

### Basic Model Setup

#### Table Name

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

#### Pattern

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

#### UUID

```js

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
    this.useUUID() // insert uuid when creating
  }
}

```

#### Timestamp

```js

import { Model } from 'tspace-mysql'
class User extends Model {
  constructor() {
    super()
    // insert created_at and updated_at when creating
    // update updated_at when updating
    // 'created_at' and 'updated_at' still relate to pettern the model
    // this.useCamelCase() will covert 'created_at' to 'createdAt' and 'updated_at' to 'updatedAt'
    this.useTimestamp() 

    // custom the columns
    this.useTimestamp({
      createdAt : 'createdAtCustom',
      updatedAt : 'updatedAtCustom'
    })

  }
}

```

#### Debug

```js

import { Model } from 'tspace-mysql'
class User extends Model {
    constructor() {
      super()
      this.useDebug() // show the query sql in console when executing
    }
}

```
#### Observer

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

#### Logger

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

#### Hooks

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

### Global Scope
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

### Inner Join Model Clause

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
### Left Join, Right Join Model Clause

```js
await new User().leftJoinModel(User, Post).findMany();
//  SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` LEFT JOIN `posts` ON `users`.`id` = `posts`.`user_id`;

await new User().rightJoinModel(User, Post).findMany();
//  SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` RIGHT JOIN `posts` ON `users`.`id` = `posts`.`user_id`;
```

### Cross Join Model Clause

```js
await new User().crossJoinModel(User, Post).findMany();
//  SELECT `users`.`id`, `users`.`email`, `users`.`username` FROM `users` CROSS JOIN `posts` ON `users`.`id` = `posts`.`user_id`;
```

### Relationships

Relationships are defined as methods on your Model classes.
Let's example a basic relationship:

#### One To One

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

#### Belongs To

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

#### Many To Many

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

#### Relation

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

```

#### Deeply Nested Relations

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

#### Relation Exists

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

#### Relation Count
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

#### Relation Trashed
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

### Built in Relation Functions
Certainly, let's illustrate the use of a built-in function in the results of relationships:

```js
import { Model } from 'tspace-mysql'

class User extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'posts' , model : Post })
        this.useBuiltInRelationFunctions()
    }
}
+--------------------------------------------------------------------------+
class Post extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'comments' , model : Comment })
        this.belongsTo({ name : 'user' , model : User })
        this.useBuiltInRelationFunctions()
    }
}
+--------------------------------------------------------------------------+
class Comment extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'users' , model : User })
        this.belongsTo({ name : 'post' , model : Post })
        this.useBuiltInRelationFunctions()
    }
}
+--------------------------------------------------------------------------+
const user = await new User().findOne()
const posts = await user.$posts()

/** Warning built-in function has Big-O effect */
for (const post of posts) {
    const comments = await post.$comments()
}

```

### Cache

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

### Decorator

Decorators can be used in a Model.
Let's illustrate this with an example of a decorators:

```js

import {
    Blueprint, Model ,
    Table ,TableSingular, TablePlural,
    UUID, SoftDelete, Timestamp,
    Pattern, CamelCase , snakeCase ,
    Column, Validate, Observer
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

@Pattern('camelCase')
@Observer(UserObserve)
@UUID()
@SoftDelete()
@Timestamp()
@Table('users')
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
        fn : (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    })
    public email!: string

    @Column(() => Blueprint.varchar(50).null())
    public name !: string

    @Column(() => Blueprint.varchar(50).null())
    public username !: string

    @Column(() => Blueprint.varchar(50).null())
    public password !: string

    @Column(() => Blueprint.timestamp().null())
    public createdAt!: Date

    @Column(() => Blueprint.timestamp().null())
    public updatedAt!: Date

    @Column(() => Blueprint.timestamp().null())
    public deletedAt!: Date

}

export { User }
export default User

```

### Schema

The schema refers to the structure of the database as it pertains to the objects and classes in the model. 
using the following:

#### Schema Model

```js
import { Model, Blueprint , type T } from "tspace-mysql";

const schema = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null().index(),
  name: Blueprint.varchar(191).notNull(),
  email: Blueprint.varchar(191).notNull(),
  createdAt: Blueprint.timestamp().null(),
  updatedAt: Blueprint.timestamp().null(),
  deletedAt: Blueprint.timestamp().null()
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
    createdAt : Date | string | null,
    updatedAt : Date | string | null,
    deletedAt : Date | string | null
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

#### Virtual Column
```js

import { Model, Blueprint , type T } from "tspace-mysql";

const schema = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null().index(),
  firstName: Blueprint.varchar(191).notNull(),
  lastName : Blueprint.varchar(191).notNull(),
  email: Blueprint.varchar(191).notNull(),
  createdAt: Blueprint.timestamp().null(),
  updatedAt: Blueprint.timestamp().null(),
  deletedAt: Blueprint.timestamp().null(),

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

#### Validation

Validate the schema of Model
let's example a validator model:

```js
import { Model, Blueprint } from "tspace-mysql";
class User extends Model {
  constructor() {
    super();
    this.useCamelCase();
    this.useSchema({
      id: Blueprint.int().notNull().primary().autoIncrement(),
      uuid: Blueprint.varchar(50).null(),
      name: Blueprint.varchar(191).notNull(),
      email: Blueprint.varchar(191).notNull(),
      createdAt: Blueprint.timestamp().null(),
      updatedAt: Blueprint.timestamp().null(),
      deletedAt: Blueprint.timestamp().null(),
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
        fn: (email: string) => {
          return /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        }
      },
      createdAt: Date,
      updatedAt: Date,
      deletedAt: Date,
    });
  }
}
```

#### Sync

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
    this.whenCreatingTable(async () => {
      return await new User()
        .create({
          ...columns,
        })
        .void()
        .save();
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

### SoftDelete

```js

import { Model } from 'tspace-mysql'
class User extends Model {
    constructor() {
      super()
      this.useSoftDelete() // All query will be where 'deleted_at' is null

      // You can also use patterns camelCase to covert the 'deleted_at' to 'deletedAt'
      // You can also customize the  column 'deleted_at'
      this.useSoftDelete('deletedAtCustom')
    }
}

const user = await new User().where('user_id',1).findOne()
// SELECT * FROM `users` WHERE `users`.`userId` = '1' and `users`.`deletedAtCustom` IS NULL LIMIT 1;

// find in trashed
const user = await new User().trashed().findMany()
// SELECT * FROM `users` WHERE `users`.`userId` = '1' and `users`.`deletedAtCustom` IS NOT NULL;

```

### Type Safety
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
    createdAt :Blueprint.timestamp().null(),
    updatedAt :Blueprint.timestamp().null()
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
    createdAt :Blueprint.timestamp().null(),
    updatedAt :Blueprint.timestamp().null()
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

### Type Safety Select

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

### Type Safety OrderBy

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

### Type Safety GroupBy

```js
import { User  } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().groupBy('id').findMany() ✅
const users = await new User().groupBy('idx').findMany() ❌

```

### Type Safety Where

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

### Type Safety Insert

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().create({ id : 10 }).save() ✅

const users = await new User().create({ id : "10" }).save() ❌

const users = await new User().create({ idx : 10 }).save() ❌

```

### Type Safety Update

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().update({ id : 10 }).where('id',1).save() ✅
const users = await new User().update({ id : 10 }).where('idx',1).save() ❌
const users = await new User().update({ id : "10" }).where('id',1).save() ❌
const users = await new User().update({ idx : 10 }).where('idx',1).save() ❌

```

### Type Safety Delete

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().where('id',1).delete() ✅
const users = await new User().where('idx',1).delete() ❌

```

### Type Safety Relationships

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
    createdAt :Blueprint.timestamp().null(),
    updatedAt :Blueprint.timestamp().null()
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
    createdAt :Blueprint.timestamp().null(),
    updatedAt :Blueprint.timestamp().null()
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

## Type Safety Results
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
  createdAt : Blueprint.timestamp().null(),
  updatedAt : Blueprint.timestamp().null()
}

type TS = T.Schema<typeof schema>

class User extends Model<TS>  {
  constructor() {
    super()
    this.useSchema(schema)
    this.useUUID()
    this.useTimestamp()
  }
}

const meta = Meta(User)

const table         = meta.table() // 'users'
const column        = meta.column('id') // 'id'
const columnRef     = meta.columnReference('id') // `users`.`id`
const columnTypeOf  = meta.columnTypeOf('id') // number
const columnType    = meta.columnType('id') // Int
const columns       = meta.columns() // ['id','uuid',...'updatedAt']
const hasColumn     = meta.hasColumn('idx') // false
const primaryKey    = meta.primaryKey() // 'id'
const indexes       = meta.indexes() // ['users.email@index']
const nullable      = meta.nullable() // ['uuid','name','createdAt','updatedAt']
const defaults      = meta.defaults() // { status : 0 }

console.log({
  table,
  column,
  columnRef,
  columnTypeOf,
  columnType,
  columns,
  hasColumn,
  primaryKey,
  indexes,
  nullable,
  defaults
})

```

## Repository
```js
Repository is a mechanism that encapsulates all database operations related to a specific model. 
It provides methods for querying, inserting, updating, and deleting records in the database associated with the model.

** The Repository check always type Type Safety if model is used the type of schema 

```
### Repository Select Statements
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
### Repository Insert Statements
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
### Repository Update Statements
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
### Repository Delete Statements
```js

const userRepository = Repository(User)

const deleted = await userRepository.delete({
  where : {
    id : 1
  }
})

```

### Repository Transactions

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

### Repository Relations
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
    user : true
  }
})

```

## View

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

## Stored Procedure
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
## Blueprint

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

## Cli

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
