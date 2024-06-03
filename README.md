## tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

tspace-mysql is an Object-Relational Mapping (ORM) tool designed to run seamlessly in Node.js and is fully compatible with TypeScript. It consistently supports the latest features in both TypeScript and JavaScript, providing additional functionalities to enhance your development experience.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
npm install tspace-mysql --save
npm install tspace-mysql -g
```

## Basic Usage

- [Configuration](#configuration)
- [Query Builder](#query-builder)
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
  - [Paginating](#paginating)
  - [Insert Statements](#insert-statements)
  - [Update Statements](#update-statements)
  - [Delete Statements](#delete-statements)
  - [Hook Statements](#hook-statements)
  - [Faker Statements](#faker-statements)
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
  - [SoftDelete](#softdelete)
  - [Schema](#schema)
    - [Schema Model](#schema-model)
    - [Validation](#validation)
    - [Sync](#sync)
  - [Relationships](#relationships)
    - [One To One](#one-to-one)
    - [One To Many](#one-to-many)
    - [Belongs To](#belongs-to)
    - [Many To Many](#many-to-many)
    - [Relation](#relation)
    - [Deeply Nested Relations](#deeply-nested-relations)
    - [Relation Exists](#relation-exists)
    - [Relation Trashed](#relation-trashed)
    - [Built in Relation Functions](#built-in-relation-functions)
  - [Decorator](#decorator)
  - [Type Safety](#type-safety)
    - [Safety Select](#safety-select)
    - [Safety OrderBy](#safety-order-by)
    - [Safety GroupBy](#safety-group-by)
    - [Safety Where](#safety-where)
    - [Safety Insert](#safety-insert)
    - [Safety Update](#safety-update)
    - [Safety Delete](#safety-delete)
    - [Safety Relationships](#safety-relationships)
- [Repository](#repository)
  - [Repository Select Statements](#repository-select-statements)
  - [Repository Insert Statements](#repository-insert-statements)
  - [Repository Update Statements](#repository-update-statements)
  - [Repository Delete Statements](#repository-delete-statements)
  - [Repository Transactions](#repository-transactions)
  - [Repository Relations](#repository-relations)
- [Blueprint](#blueprint)
- [Cli](#cli)
  - [Make Model](#make-model)
  - [Make Migration](#make-migration)
  - [Migrate](#migrate)
  - [Query](#query)
  - [Dump](#dump)
  - [Generate Models](#generate-models)
  - [Migration Models](#migrate-models)
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
 *  DB_DATE_STRINGS     = true
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

### Returning Results

```js
const user = await new DB("users").find(1); // Object or null

const user = await new DB("users").findOne(); // Object or null

const user = await new DB("users").first(); // Object or null

const user = await new DB("users").firstOrError(message); // Object or error

const users = await new DB("users").findMany(); // Array-object of users

const users = await new DB("users").get(); // Array-object of users

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

await new DB("users").offset(1).findOne();
// SELECT * FROM `users` LIMIT 1 OFFSET 1;
```

## Joins

### Inner Join Clause

```js
await new DB("posts").join("posts.user_id", "users.id").findMany();
// SELECT * FROM `posts` INNER JOIN `users` ON `posts`.`user_id` = `users`.`id`;
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

const users = await new DB("users")
  .where("id", 1)
  .orWhereQuery((query) => {
    return query
      .where("id", "<>", 2)
      .where("username", "try to find")
      .where("email", "find@example.com");
  })
  .findMany();
// SELECT * FROM `users` WHERE `users`.`id` = '1'
// OR
// ( `users`.`id` <> '2' AND `users`.`username` = 'try to find' AND `users`.`email` = 'find@example.com');
```

### Where Object Clauses

```js
import { Operator } from 'tspace-mysql'

const whereObject = await new DB("users")
  .whereObject({
    id :  Operator.notEq(1),
    username :  Operator.in(['user1','user2']),
    name :  Operator.like('%value%')
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
```

## More Methods

```js
where(column , operator , value)
whereSensitive(column , operator , value)
whereId(id)
whereUser(userId)
whereEmail(value)
whereIn(column , [])
whereNotIn(column , [])
whereNull(column)
whereNotNull(column)
whereBetween (column , [value1 , value2])
whereQuery(callback)
whereJson(column, { targetKey, value , operator })
whereRaw(sql)
whereExists(sql)
whereSubQuery(colmn , rawSQL)
whereNotSubQuery(colmn , rawSQL)
orWhere(column , operator , value)
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
  await connection.commit();
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
// AND EXISTS (SELECT 1 FROM `posts` WHERE `users`.`id` = `posts`.`user_id` AND `posts`.`deletedA_at` IS NULL );

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
import { Model, Blueprint , TSchema } from "tspace-mysql";

const schema = {
  id: Blueprint.int().notNull().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null(),
  name: Blueprint.varchar(191).notNull(),
  email: Blueprint.varchar(191).notNull(),
  createdAt: Blueprint.timestamp().null().bindColumn('created_at'),
  updatedAt: Blueprint.timestamp().null().bindColumn('updated_at'),
  deletedAt: Blueprint.timestamp().null().bindColumn('deleted_at')
}


// make type in TS
type TSchemaUser = TSchema<typeof Schema>

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


class User extends Model
<TSchemaUser>  // use the schema for this User model
{
  constructor() {
    super();
    this.useCamelCase()
    this.useSchema(schema)
  }
}

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
    this.beforeCreatingTable(async () => {
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

### Type Safety
Type safety in TypeScript refers to the ability of the language to detect and prevent type errors during compile-time. 
Type safety still works when you add additional types to your model, using the following:

```js
// in file User.ts
import { Model , Blueprint , TSchema } from 'tspace-mysql'
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

type TSchemaUser = TSchema<typeof schemaUser>

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
import { Model , Blueprint , TSchema } from 'tspace-mysql'
import { User } from './User.ts'
const schemaPhone = {
    id :Blueprint.int().notNull().primary().autoIncrement(),
    uuid :Blueprint.varchar(50).null(),
    userId : Blueprint.int().notNull(),
    number :Blueprint.varchar(50).notNull(),
    createdAt :Blueprint.timestamp().null(),
    updatedAt :Blueprint.timestamp().null()
}

type TSchemaPhone = TSchema<typeof schemaPhone>

class Phone extends Model<TSchemaPhone>  {
  constructor() {
    super()
    this.useSchema(schemaPhone)
    this.useBelongsTo({ model : User, name : 'user'})
  }
}

export { Phone }
export default Phone

+--------------------------------------------------------------------------+
```

### Safety Select

```js
import { User  } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().select('id','username').findMany() ✅
const users = await new User().select('idx','username').findMany() ❌

const users = await new User().except('id','username').findMany() ✅
const users = await new User().except('idx','username').findMany() ❌

```

### Safety OrderBy

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

### Safety GroupBy

```js
import { User  } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().groupBy('id').findMany() ✅
const users = await new User().groupBy('idx').findMany() ❌

```

### Safety Where

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

### Safety Insert

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().create({ id : 10 }).save() ✅

const users = await new User().create({ id : "10" }).save() ❌

const users = await new User().create({ idx : 10 }).save() ❌

```

### Safety Update

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().update({ id : 10 }).where('id',1).save() ✅
const users = await new User().update({ id : 10 }).where('idx',1).save() ❌
const users = await new User().update({ id : "10" }).where('id',1).save() ❌
const users = await new User().update({ idx : 10 }).where('idx',1).save() ❌

```

### Safety Delete

```js
import { User } from './User.ts'
import { Phone } from './Phone.ts'

const users = await new User().where('id',1).delete() ✅
const users = await new User().where('idx',1).delete() ❌

```

### Safety Relationships

```js
import { TSchemaModel } from 'tspace-mysql'
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
.findMany<{ phone : TSchemaModel<Phone> , phones : TSchemaModel<Phone>[] }>()

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
  .findMany<{ phone : TSchemaModel<Phone> , phones : TSchemaModel<Phone>[] }>()

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
    phone : Partial<TSchemaModel<Phone>> & { user : TSchemaModel<User>};
    phones : (Partial<TSchemaModel<Phone>> & { user : TSchemaModel<User>})[];
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

import { Model , Blueprint , TSchema , TRelation } from 'tspace-mysql'
import { Phone }  from '../Phone'

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

type TSchemaUser = TSchema<typeof schemaUser>

type TRelationUser =  TRelation<{
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
import { Model , Blueprint , TSchema , TRelation } from 'tspace-mysql'
import { User } from './User.ts'

const schemaPhone = {
    id :Blueprint.int().notNull().primary().autoIncrement(),
    uuid :Blueprint.varchar(50).null(),
    userId : Blueprint.int().notNull(),
    number :Blueprint.varchar(50).notNull(),
    createdAt :Blueprint.timestamp().null(),
    updatedAt :Blueprint.timestamp().null()
}

type TSchemaPhone = TSchema<typeof schemaPhone>

type TRelationPhone = TRelation<{
  user : User[]
}>

class Phone extends Model<
  TSchemaPhone,
  TRelationPhone
>  {
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

## Repository
```js
Repository is a mechanism that encapsulates all database operations related to a specific model. 
It provides methods for querying, inserting, updating, and deleting records in the database associated with the model.

** The Repository check always type safety if model is used the type of schema 

```
### Repository Select Statements
```js
import { Repository , TRepository , Operator } from 'tspace-mysql'
import { User } from '../Models/User'

const userRepository = Repository.bind(User)
const needPhone = true
const user = await userRepository.findOne({
  select : ['id','name','username'],
  where : {
    id: 1
  },
  when : {
    condition : `${needPhone}`,
    callback: () => ({
      relations : ['phone']
    })
  }
})

const users = await userRepository.findMany({
  select : ['id','name','username'],
  limit : 3,
  orderBy : {
    id : 'ASC',
    name : 'DESC'
  }
  groupBy : ['id'],
  where : {
    id: Operator.in([1,2,3])
  }
})

const userPaginate = await userRepository.pagination({
  select : ['id','name','username'],
  page : 1,
  limit : 3,
  where : {
    id:  Operator.in([1,2,3])
  }
})

const findFullName = await userRepository.findOne({
  select : ['name',`${DB.raw('CONCAT(firstName," ",lastName) as fullName')}`],
  whereRaw : [
    `CONCAT(firstName," ",lastName) LIKE '%${search}%'`
  ]
})
```
### Repository Insert Statements
```js

const userRepository = Repository.bind(User)

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

const userRepository = Repository.bind(User)

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

const userRepository = Repository.bind(User)

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
const userRepository = Repository.bind(User)

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

  await transaction.commit()

} catch (err) {

  await transaction.rollback()
}

```

### Repository Relations
```js
import { Repository , TRepository , Operator } from 'tspace-mysql'
import { User } from '../Models/User'
import { Phone } from '../Models/Phone'

const userRepository = Repository.bind(User)

const userHasPhones = await userRepository.findOne({
  select : ['*'],
  where : {
    id: 1
  },
  relations : ['phone'],
  relationQuery:{
    name : 'phone',
    callback: () : TRepository<Phone> => ({ // add type for the callback know to check type of the model
      select: ['id', 'userId', 'name'],
      relations : ['user']
    }) 
  }
})

const phoneRepository = Repository.bind(Phone)

const phoneBelongUser = await phoneRepository.findOne({
  select : ['*'],
  where : {
    id: 1
  },
  relations : ['user']
})

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
tspace-mysql dump:db "database" --values // backup with values in the tables

tspace-mysql dump:table "table" --values // backup with values in the table

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
tspace-mysql migrations:db --dir=<path-to-migration> --generate --db=<db-name>
tspace-mysql migrations:db --dir=<path-to-migration> --push

tspace-mysql migrations:db --dir=migrations --generate --db=db-migratons
tspace-mysql migrations:db --dir=migrations --push

```
