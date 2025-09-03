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

await new DB().fromRaw('u',new DB('users').select('*').limit(1).toString()).find(1)
// SELECT * FROM ( SELECT * FROM `users` LIMIT 1 ) AS `u` WHERE `u`.`id` = '1' LIMIT 1;

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

<div class="page-nav-cards">
  <a href="#/sql-like" class="prev-card">
    <div class="nav-label"> 
        <span style="color:#fff; font-size:16px;">←</span> 
        Previous
    </div>
    <div class="nav-title"> SQL Like</div>
  </a>

  <a href="#/database-transactions" class="next-card">
    <div class="nav-label">
        Next
        <span style="color:#fff; font-size:16px;">→</span>
    </div>
    <div class="nav-title">Database Transactions</div>
  </a>
</div>