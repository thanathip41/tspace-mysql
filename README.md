## tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

Tspace-mysql is an ORM that can run in NodeJs and can be used with TypeScript. 
Its always support the latest TypeScript and JavaScript features and provide additional features that help you to develop.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
npm install tspace-mysql --save
```
## Basic Usage
- [Configuration](#configuration)
- [Running Queries](#running-queries)
- [Database Transactions](#database-transactions)
- [Connection](#connection)
- [Backup](#backup)
- [Generating Model Classes](#generating-model-classes)
- [Model Conventions](#model-conventions)
- [Relationships](#relationships)
  - [One To One](#one-to-one)
  - [One To Many](#one-to-many)
  - [Belongs To](#belongs-to)
  - [Many To Many](#many-to-many)
  - [Deeply Nested Relations](#deeply-nested-relations)
  - [Relation Exists](#relation-exists)
  - [Built in Relation Functions](#built-in-relation-functions)
- [Query Builder](#query-builder)
- [Cli](#cli)
  - [Make Model](#make-model)
  - [Make Migration](#make-migration)
  - [Migrate](#migrate)
  - [Query](#query)
  - [Generate Models](#generate-models)
- [Blueprint](#blueprint)

## Configuration
Created your environment variables is to use a '.env' file, you may establish a connection is this:
```js
DB_HOST     = localhost
DB_PORT     = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database

/** 
 * @default
 *  DB_CONNECTION_LIMIT = 10
 *  DB_CONNECTION_ERROR = true
 *  DB_QUEUE_LIMIT      = 0
 *  DB_TIMEOUT          = 60000
 *  DB_DATE_STRINGS     = true
*/
```
Or you can created file name 'db.tspace' to use a connection  this:
```js
source db {
    host               = localhost
    port               = 3306
    database           = npm
    user               = root
    password           = 
    connectionLimit    = 10 
    dateStrings        = true
    connectTimeout     = 60000
    waitForConnections = true
    queueLimit         = 0
    charset            = utf8mb4
}

```
## Running Queries
Once you have configured your database connection, you may run queries is this :
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

import { DB } from 'tspace-mysql'
(async () => {
    await new DB('users').findMany() // SELECT * FROM users => Array
    await new DB('users').findOne() //  SELECT * FROM users LIMIT 1 => Object
})()
```
Running A Select Query
```js
const selectQuery = await new DB('users').select('id','username').findOne() 
    // selectQuery => { id : 1, username : 'tspace'}
const selectQueries = await new DB('users').select('id','username').findMany() 
    // selectQueries => [{ id : 1, username : 'tspace' } , { id : 2, username : 'tspace2'}]

const selectQueryRaw = await new DB('users').selectRaw('COUNT(id)').findMany() 

/**
 * @example except
 */
await new DB('users').except('id','username').findOne() 
```

Running A OrderBy & GroupBy Query
```js
await new DB('users').orderBy('id','asc').findOne()
await new DB('users').orderBy('id','desc').findOne()
await new DB('users').oldest('id').findOne()
await new DB('users').latest('id').findOne()

await new DB('users').groupBy('id').findOne()
await new DB('users').groupBy('id','usernamename').findOne()
```

Running A Join Query
```js
await new DB('posts').join('posts.user_id' , 'users.id').findMany()
await new DB('posts').leftJoin('posts.user_id' , 'users.id').findMany()
await new DB('posts').rightJoin('posts.user_id' , 'users.id').findMany()
```

Running A Where Query
```js
const user = await new DB('users').where('id',1).findOne()
    // user => { id : 1 , username : 'tspace', email : 'tspace@gmail.com'}
const users = await new DB('users').where('id','!=',1).findMany()
    // users => [{ id : 2 , username : 'tspace2' , email : 'tspace2@gmail.com' }]

const whereIn = await new DB('users').whereIn('id',[1,2]).findMany()
const whereBetween = await new DB('users').whereBetween('id',[1,2]).findMany()
const whereSubQuery = await new DB('users').whereSubQuery('id','select id from users').findMany()
// same As await new DB('users').whereSubQuery('id',new DB('users').select('id').toString()).findMany()
const whereNull = await new DB('users').whereNull('username').findOne()
const whereNotNull = await new DB('users').whereNotNull('username').findOne()
const whereQuery = await new DB('users').whereQuery(query => query.where('id',1).where('username','tspace')).whereIn('id',[1,2]).findOne()
    // SELECT * FROM `users` WHERE ( `users`.`id` = '1' AND `users`.`username` = 'tspace') AND `users`.`id` IN ('1','2'') LIMIT 1
```

Running A Hook Query
```js
const hookResult = (result) => console.log(result)
const user = await new DB('users').where('id',1).hook(hookResult).findOne()
```

Running A Insert Query
```js
const user = await new DB('users')
    .create({
        name : 'tspace3',
        email : 'tspace3@gmail.com'
    }).save()
    // user =>  { id : 3 , username : 'tspace3', email : 'tspace3@gmail.com'}

+--------------------------------------------------------------------------+

const reposity = new DB('users')
    reposity.name = 'tspace4'
    reposity.email = 'tspace4@gmail.com'
    await reposity.save()
const { result } = reposity
    // result =>  { id : 4 , username : 'tspace4', email : 'tspace4@gmail.com'}

const users = await new DB('users')
    .createMultiple([
        {
            name :'tspace4',
            email : 'tspace4@gmail.com'
        },
        {
            name :'tspace5',
            email : 'tspace5@gmail.com'
        },
        {
            name :'tspace6',
            email : 'tspace6@gmail.com'
        },
    ]).save()

const users = await new DB('users')
    .where('name','tspace4')
    .where('email','tspace4@gmail.com')
    .createNotExists({
        name :'tspace4',
        email : 'tspace4@gmail.com'
    })
    .save()
    // if has exists return null, if not exists created new data

const users = await new DB('users')
    .where('name','tspace4')
    .where('email','tspace4@gmail.com')
    .createOrSelect({
        name :'tspace4',
        email : 'tspace4@gmail.com'
    })
    .save()
    // if has exists return data, if not exists created new data

```
Running A Update Query
```js
const user = await new DB('users')
    .where('id',1)
    .update({
          name : 'tspace1**',
          email : 'tspace1@gmail.com'
    }).save()
    // user =>  { id : 1 , username : 'tspace1**', email : 'tspace1@gmail.com'} 

+--------------------------------------------------------------------------+

const reposity = new DB('users').where('id',1)
    reposity.name = 'tspace1++'
    reposity.email = 'tspace1++@gmail.com'
    await reposity.save()
const { result } = reposity
    // result =>  { id : 1 , username : 'tspace1++', email : 'tspace1++@gmail.com'} 
```

Running A  Update Or Created Query
```js
const user = await new DB('users')
    .where('id',1)
    .updateOrCreate({
          name : 'tspace1**',
          email : 'tspace1@gmail.com'
    }).save()
    // user =>  { username : 'tspace1**', email : 'tspace1@gmail.com' } 
```  

Running A Delete Query
```js
const deleted = await new DB('users').where('id',1).delete()
    // deleted => Boolean
``` 
## Database Transactions 

Within a Database Transaction, you may use the:

```js
const connection = await new DB().beginTransaction()

try {
    /**
     *
     * @startTransaction start transaction in scopes function 
     */
    await connection.startTransaction()

    const user = await new User()
        .create({
            name : `tspace`,
            email : 'tspace@example.com'
        })
        /**
         *
         * bind method for make sure this connection has same transaction in connection
         * @params {Function} connection 
         */
        .bind(connection)
        .save()

    const posts = await new Post().createMultiple([
        {
            user_id : user.id,
            title : `tspace-post1`
        },
        {
            user_id : user.id,
            title : `tspace-post2`
        },
        {
            user_id : user.id,
            title : `tspace-post3`
        }
    ])
    .bind(connection) // don't forget this
    .save()

    /**
     *
     * @commit commit transaction to database
     */
    await connection.commit()

} catch (err) {

    /**
     *
     * @rollback rollback transaction
     */
    await connection.rollback()
}

```

## Connection
When establishing a connection, you may establish options is this:
```js
const connection = await new DB().getConnection({
    host: 'localhost',
    port : 3306,
    database: 'database'
    username: 'username',
    password: 'password',
})

const users = await new DB('users')
    .bind(connection)
    .findMany()
// users => [{ .... }]
```

## Backup
Backup database, you may backup is this:
```js
/**
 * 
 * @param conection defalut current connection
 */
const backup = await new DB().backup({
     database: 'try-to-backup',  // clone current database to this database
     connection ?: {
        host: 'localhost',
        port : 3306,
        database: 'database'
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
```

## Generating Model Classes
To get started, let's install npm install tspace-mysql -g  
you may use the make:model command to generate a new model:

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
# => App/Models/User.ts
```
## Model Conventions
Models generated by the make:model command will be placed in the specific directory. 
Let's examine a basic model class:

```js
import { Model } from 'tspace-mysql'
class User extends Model {
  constructor(){
    super()
    /**
     * 
     * Assign setting global in your model
     * @useMethod
     *
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
     * this.usePattern('snake_case') // => default 'snake_case'   
     * this.useUUID('uuid') // => runing a uuid (universally unique identifier) when insert new data
     * this.useRegistry() // => build-in functions registry
     * this.useLoadRelationsInRegistry() // => auto generated results from relationship to results
     * this.useBuiltInRelationFunctions() // => build-in functions relationships to results
     * this.useSchema({
     *   id : Number,
     *   username : String
     *   created_at : Date,
     *   updated_at : Date,
     *  }) // => validate type of schema when return results
     * this.useCreateTableIfNotExists ({ 
     *     id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *     uuid        : new Blueprint().varchar(50).null(),
     *     user_id     : new Blueprint().int().notNull(),
     *     title       : new Blueprint().varchar(255).null(),
     *     created_at  : new Blueprint().timestamp().null(),
     *     updated_at  : new Blueprint().timestamp().null(),
     *     deleted_at  : new Blueprint().timestamp().null()
     *   })
     */


    /*
     * the "snake case", plural name of the class will be used as the table name 
     * 
     * @param {string} name The table associated with the model.
     */
    this.useTable('users')
  }
}
export { User }
export default User
```
## Relationships
Relationships are defined as methods on your Model classes
Let's examine a basic relations :

## One To One
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
    phone (callback ?: Function) {
        return this.hasOneBuilder({ name : 'phone' , model : Phone } , callback)
    }
}
export default User

+--------------------------------------------------------------------------+

import User from '../User'
const user = await new User().relations('brand').findOne()
// user?.phone => {...} 
const userUsingFunction = await new User().phone().findOne()
// userUsingFunction?.phone => {...} 
```

## One To Many
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
    comments (callback ?: Function) {
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

## Belongs To
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
    user (callback ?: Function) {
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

## Many To Many
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
    roles (callback ?: Function) {
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

## Deeply Nested Relations
Relationships can deeply relations. 
let's example a deep in relations :
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
+--------------------------------------------------------------------------+
// Deeply nested relations
await new User().relations('posts')
    .relationQuery('posts', (query : Post) => { 
        return query.relations('comments','user')
        .relationQuery('comments', (query : Comment) => {
            return query.relations('user','post')
        })
        .relationQuery('user', (query : User) => {
            return query.relations('posts').relationQuery('posts',(query : Post)=> {
                return query.relations('comments','user')
                // relation n, n, ...n
            })
        })
    })
    .findMany()

// Select some columns in nested relations    
await new User().relations('posts')
    .relationQuery('posts', (query : Post) => query.select('id','user_id','title'))
    .findMany()

// Where some columns in nested relations
await new User().relations('posts')
    .relationQuery('posts', (query : Post) => query.whereIn('id',[1,3,5]))
    .findMany()

// Sort data in  nested relations
await new User().relations('posts')
    .relationQuery('posts', (query : Post) => query.latest('id'))
    .findMany()

// Limit data in  nested relations
await new User().relations('posts')
    .relationQuery('posts', (query : Post) => {
        return query
        .limit(1)
        .relations('comments')
        .relationQuery('comments', (query : Comment) => query.limit(1))
    })
    .findMany()

```
## Relation Exists
Relationships can return only result is not isempty related with soft delete. 
let's example a exists in relations :
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
 * because posts id 1 and id 3 has been removed from database using soft delete
 */


```

## Built in Relation Functions
Relationships can using built in function in results 
let's example a built in function :
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

/** Warning built in function has Big-O effect */
for (const post of posts) {
    const comments = await post.$comments()
}

```

## Query Builder
Methods builder for queries
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
whereRaw(sql)
whereExists(sql)
whereSubQuery(colmn , rawSQL)
whereNotSubQuery(colmn , rawSQL)
orWhere(column , operator , value)   
orWhereRaw(sql)
orWhereIn(column , [])
orWhereSubQuery(colmn , rawSQL)
select(column1 ,column2 ,...N)
selectRaw(column1 ,column2 ,...N)
except(column1 ,column2 ,...N)
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
createNotExists(objects)
updateOrCreate (objects)
connection(options)
backup({ database , connection })
backupToFile({ filePath, database , connection })
hook((result) => ...) // callback result to function

/** 
 * registry relation in your models
 * @relationship
*/
hasOne({ name , model , localKey , foreignKey , freezeTable , as })
hasMany({ name , model , localKey , foreignKey , freezeTable , as })
belongsTo({ name , model , localKey , foreignKey , freezeTable , as })
belongsToMany({ name , model , localKey , foreignKey , freezeTable , as , pivot })
/** 
 * @relation using registry in your models
*/
relations(name1 , name2,...nameN)
/** 
 * @relation using registry in your models. if exists child data remove this data
*/
relationsExists(name1 , name2,...nameN) 
/** 
 * @relation call a name of relation in registry, callback query of data
*/
relationQuery(name, (callback) )

/**
 * queries statements
 * @execute data of statements
*/
findMany()
findOne()
find(id)
delelte()
exists ()
onlyTrashed()
toSQL()
toString()
toJSON()
toArray(column)
count(column)
sum(column)
avg(column)
max(column)
min(column)
pagination({ limit , page })
save() /*for action statements insert update or delete */
```

## Cli
To get started, let's install tspace-mysql
you may use a basic cli :

```sh
npm install tspace-mysql -g

```
## Make Model
Command will be placed Model in the specific directory
```js

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
Command will be placed Migration in the specific directory
```js
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
```js
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
Command will be execute a query
```js
tspace-mysql query "SELECT * FROM users"

```

# Generate Models
Command will be generate models from table in database
```js
tspace-mysql generate:models --dir=<folder for creating>

```

## Blueprint
Schema table created by command make:migration,  you may use the:
```js
import { Schema , Blueprint , DB } from 'tspace-mysql'
(async () => {
    await new Schema().table('users',{ 
        id           :  new Blueprint().int().notNull().primary().autoIncrement(),
        uuid         : new Blueprint().varchar(120).null()
        name         : new Blueprint().varchar(120).default('name'),
        email        : new Blueprint().varchar(255).unique().notNull(),
        email_verify : new Blueprint().tinyInt(),
        password     : new Blueprint().varchar(255),
        created_at   : new Blueprint().null().timestamp(),
        updated_at   : new Blueprint().null().timestamp()
    })
    /**
     *  
     *  @Faker fake data 5 raw
     *  await new DB().table('users').faker(5)
    */
})()

/**
 * type of schema in database
 * @Types
 * 
*/
int ()
tinyInt (number) 
bigInt (number)
double ()
float ()
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
 * attrbuites of schema in database
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
```