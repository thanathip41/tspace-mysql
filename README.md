## tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

tspace-mysql is an Object-Relational Mapping (ORM) tool designed to run seamlessly in Node.js and is fully compatible with TypeScript. It consistently supports the latest features in both TypeScript and JavaScript, providing additional functionalities to enhance your development experience.

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
    - [Decorator](#decorator)
  - [Schema Model](#schema-model)
    - [Validation](#validation)
    - [Sync](#sync)
- [Query Builder](#query-builder)
- [Cli](#cli)
  - [Make Model](#make-model)
  - [Make Migration](#make-migration)
  - [Migrate](#migrate)
  - [Query](#query)
  - [Dump](#dump)
  - [Generate Models](#generate-models)
- [Blueprint](#blueprint)

## Configuration
To establish a connection, the recommended method for creating your environment variables is by using a '.env' file. using the following:
```js
DB_HOST     = localhost
DB_PORT     = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database

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
## Running Queries
Once you have configured your database connection, you can execute queries using the following:
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
    await new DB('users').findMany() //  SELECT * FROM users => Array
    await new DB('users').findOne()  //  SELECT * FROM users LIMIT 1 => Object
})()

```
Running A Raw Query
```js
const rawQuery = await new DB().query('SELECT * FROM users') 

```
Running A Select Query
```js
const select = await new DB('users').select('id','username').findOne() 

const selectRaw = await new DB('users').selectRaw('COUNT(id)').findMany()

const selectObject = await new DB('posts')
.join('posts.user_id', 'users.id')
.select('posts.*')
.selectObject({ id : 'users.id', name : 'users.name' , email : 'users.email'},'user')
.findOne()

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
const whereEqual = await new DB('users').where('id',1).findOne()
// SELECT * FROM `users` WHERE `users`.`id` = '1' LIMIT 1;

const whereNotEqual = await new DB('users').where('id','!=',1).findMany()
// SELECT * FROM `users` WHERE `users`.`id` != '1';

const whereIn = await new DB('users').whereIn('id',[1,2]).findMany()
// SELECT * FROM `users` WHERE `users`.`id` BETWEEN '1' AND '2';

const whereBetween = await new DB('users').whereBetween('id',[1,2]).findMany()
// SELECT * FROM `users` WHERE `users`.`id` BETWEEN '1' AND '2';

const whereSubQuery = await new DB('users').whereSubQuery('id','SELECT id FROM users').findMany()
// SELECT * FROM `users` WHERE `users`.`id` IN (SELECT id FROM users);
// or use -> await new DB('users').whereSubQuery('id',new DB('users').select('id').toString()).findMany()

const whereNull = await new DB('users').whereNull('username').findOne()
// SELECT * FROM `users` WHERE `users`.`username` IS NULL LIMIT 1;

const whereNotNull = await new DB('users').whereNotNull('username').findOne()
// SELECT * FROM `users` WHERE `users`.`username` IS NOT NULL LIMIT 1;

const whereQuery = await new DB('users').whereQuery(query => query.where('id',1).where('username','values')).whereIn('id',[1,2]).findOne()
// SELECT * FROM `users` WHERE ( `users`.`id` = '1' AND `users`.`username` = 'values') AND `users`.`id` IN ('1','2'') LIMIT 1;

const whereExists = await new DB('users').whereExists(new DB('users').select('id').where('id',1).toString()).findOne()
// SELECT * FROM `users` WHERE EXISTS (SELECT `id` FROM `users` WHERE id = 1) LIMIT 1;

const whereJSON = await  new DB('users').whereJSON('json', { key : 'id', value : '1234' }).findOne()
// SELECT * FROM `users` WHERE `users`.`json`->>'$.id' = '1234' LIMIT 1;

const whereWhenIsTrue = await new DB('users').where('id',1).when(true, (query) => query.where('username','when is actived')).findOne()
// SELECT * FROM `users` WHERE `users`.`id` = '1' AND `users`.`username` = 'when is actived' LIMIT 1;

const whereWhenIsFalse = await new DB('users').where('id',1).when(false, (query) => query.where('username','when is actived')).findOne()
// SELECT * FROM `users` WHERE `users`.`id` = '1' LIMIT 1;
```

Running A Hook Query
```js
const hookResult = (result) => console.log('hook!! result => ',result)
const user = await new DB('users').where('id',1).hook(hookResult).findOne()
```

Running A Faker
```js

await new DB('users').faker(5)
// custom some columns
await new DB('users').faker(5 , (row , index) => {
    return {
        ...row,
        custom : 'custom' + index
    }
})
```

Running A Insert Query
```js
const user = await new DB('users')
.create({
    name : 'tspace3',
    email : 'tspace3@gmail.com'
})
.save()
// user =>  { id : 3 , username : 'tspace3', email : 'tspace3@gmail.com'}

+--------------------------------------------------------------------------+
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
])
.save()

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
})
.save()
// UPDATE `users` SET `name` = 'tspace1**',`email` = 'tspace1@gmail.com' WHERE `users`.`id` = '1' LIMIT 1;

const user = await new DB('users')
.where('id',1)
.update({
    name : 'tspace1**',
    email : 'tspace1@gmail.com'
},['name'])
.save()
// UPDATE `users` SET `name` = CASE WHEN (`name` = "" OR `name` IS NULL) THEN "tspace1**" ELSE `name` END,`email` = 'tspace1@gmail.com' WHERE `users`.`id` = '1' LIMIT 1;

```
Running A Update Or Created Query
```js
const user = await new DB('users')
.where('id',1)
.updateOrCreate({
    name : 'tspace1**',
    email : 'tspace1@gmail.com'
}).save()
// INSERT INTO `users` (`name`,`email`) VALUES ('tspace1**','tspace1@gmail.com');

// UPDATE `users` SET `name` = 'tspace1**',`email` = 'tspace1@gmail.com' WHERE `users`.`id` = '1' LIMIT 1; 
```  

Running A Delete Query
```js
const deleted = await new DB('users').where('id',1).delete()
// DELETE FROM `users` WHERE `users`.`id` = '1' LIMIT 1;
``` 
## Database Transactions 

Within a database transaction, you can utilize the following:

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

    const posts = await new Post()
    .createMultiple([
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
.bind(connection)
.findMany()
// users => [{ .... }]
```

## Backup
To backup a database, you can perform the following steps:
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
     * this.usePattern('camelCase') // => default 'snake_case' 
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
     * this.useSchema ({ 
     *     id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *     uuid        : new Blueprint().varchar(50).null(),
     *     name        : new Blueprint().varchar(191).notNull(),
     *     email       : new Blueprint().varchar(191).notNull(),
     *     created_at  : new Blueprint().timestamp().null(),
     *     updated_at  : new Blueprint().timestamp().null(),
     *     deleted_at  : new Blueprint().timestamp().null()
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
    this.useTable('users')
  }
}
export { User }
export default User
```
## Relationships
Relationships are defined as methods on your Model classes. 
Let's example a basic relationship:

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
Relationships can involve deep connections. 
Let's example of a deep relationship:
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
await new User()
.relations('posts')
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
## Relation Exists
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
 * because posts id 1 and id 3 has been removed from database (using soft delete)
 */


```
## Built in Relation Functions
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

## Decorator
Decorators can be used in a Model.
Let's illustrate this with an example of a decorator:
```js

import { 
    Blueprint, 
    Model , 
    Table ,TableSingular, TablePlural, 
    UUID, SoftDelete, Timestamp,
    Column, Pattern, Validate,
    HasMany, HasOne, BelongsTo, BelongsToMany
    
} from 'tspace-mysql'
import { Post } from './Post'
import { PostUser } from './PostUser'

@Pattern('camelCase')
@UUID()
@SoftDelete()
@Timestamp()
@Table('users')
class User extends Model {

    @Column(() => new Blueprint().int().notNull().primary().autoIncrement())
    public id!: number

    @Column(() => new Blueprint().varchar(50).null())
    public uuid!: string

    @Column(() => new Blueprint().varchar(50).null())
    @Validate({
        type : String,
        require : true,
        length : 50,
        match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        unique : true,
        fn : (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    })
    public email!: string

    @Column(() => new Blueprint().varchar(50).null())
    public name !: string

    @Column(() => new Blueprint().varchar(50).null())
    public username !: string

    @Column(() => new Blueprint().varchar(50).null())
    public password !: string

    @Column(() => new Blueprint().timestamp().null())
    public createdAt!: Date

    @Column(() => new Blueprint().timestamp().null())
    public updatedAt!: Date

    @Column(() => new Blueprint().timestamp().null())
    public deletedAt!: Date
 
    @HasMany({ model : Post })
    public posts!: Post[]

    @HasOne({ model : Post })
    public post!: Post

    @BelongsToMany({ model : Post , modelPivot : PostUser })
    public users!: PostUser[]
}

export { User }
export default User

```
## Schema Model
Define the schema of a Model

## Validation
Validate the schema of Model 
let's example a validator model:
```js
import { Model , Blueprint , Column } from 'tspace-mysql'
class User extends Model {
  constructor(){
    super()
    this.useCamelCase()
    this.useSchema ({ 
        id          : new Blueprint().int().notNull().primary().autoIncrement(),
        uuid        : new Blueprint().varchar(50).null(),
        name        : new Blueprint().varchar(191).notNull(),
        email       : new Blueprint().varchar(191).notNull(),
        createdAt   : new Blueprint().timestamp().null(),
        updatedAt   : new Blueprint().timestamp().null(),
        deletedAt   : new Blueprint().timestamp().null()
     })
     // validate input when create or update reference to the schema in 'this.useSchema'
     this.useValidateSchema({
      id : Number,
      uuid :  Number,
      name : {
          type : String,
          length : 191,
          require : true,
          json : true
      },
      email : {
          type : String,
          require : true,
          length : 191,
          match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          unique : true,
          fn : (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      },
      createdAt : Date,
      updatedAt : Date,
      deletedAt : Date
    })
  }
}

```

## Sync
Sync schema with Models setting in your directory, 
Sync will check for create or update table columns and foreign keys, 
Related by method 'useSchema' in your models. 
Let's examine a basic model sync class:

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
    constructor(){
        super()
        this.hasMany({ name : 'posts' , model : Post })
        this.useSchema ({ 
            id          : new Blueprint().int().notNull().primary().autoIncrement(),
            uuid        : new Blueprint().varchar(50).null(),
            email       : new Blueprint().int().notNull().unique(),
            name        : new Blueprint().varchar(255).null(),
            created_at  : new Blueprint().timestamp().null(),
            updated_at  : new Blueprint().timestamp().null(),
            deleted_at  : new Blueprint().timestamp().null()
        })
    }
}
 
// file Post
import User from './User'
class Post extends Model {
    constructor(){
        super()
        this.hasMany({ name : 'comments' , model : Comment })
        this.belongsTo({ name : 'user' , model : User })
        this.useSchema ({ 
            id          : new Blueprint().int().notNull().primary().autoIncrement(),
            uuid        : new Blueprint().varchar(50).null(),
            user_id     : new Blueprint().int().notNull()
            .foreign({ references : 'id' , on : User ,onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
            title       : new Blueprint().varchar(255).null(),
            created_at  : new Blueprint().timestamp().null(),
            updated_at  : new Blueprint().timestamp().null(),
            deleted_at  : new Blueprint().timestamp().null()
        })
    }
}
await Schema.sync(`src/Models` , { force : true })

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
if(contition , callback)
select(column1 ,column2 ,...N)
distinct()
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
updateMany (objects)
createNotExists(objects)
updateOrCreate (objects)
onlyTrashed()
connection(options)
backup({ database , connection })
backupToFile({ filePath, database , connection })
hook((result) => ...) // callback result to function

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
relations(name1 , name2,...nameN)
/** 
 * @relation using registry in your models ignore soft delete
 */
relationsAll(name1 , name2,...nameN) 
/** 
 * @relation using registry in your models. if exists child data remove this data
 */
relationsExists(name1 , name2,...nameN) 
/** 
 * @relation call a name of relation in registry, callback query of data
 */
relationQuery(name, (callback) )
/** 
 * @relation using registry in your models return only in trash (soft delete)
 */
relationsTrashed(name1 , name2,...nameN) 


/**
 * queries statements
 * @execute data of statements
*/
findMany()
findOne()
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
makeCreateStatement()
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
# Dump
Command will be dump database or table into file
```js
tspace-mysql dump:db "database" --values // backup with values in the tables

tspace-mysql dump:table "table" --values // backup with values in the table

```

# Generate Models
Command will be generate models from table in database
```js
tspace-mysql generate:models --dir=<folder for creating> 
or 
tspace-mysql gen:models --dir=<folder for creating> --env=development

```

## Blueprint
Schema table created by command make:migration,  you may use the:
```js
import { Schema , Blueprint , DB } from 'tspace-mysql'
(async () => {
    await new Schema().table('users', { 
        id           : new Blueprint().int().notNull().primary().autoIncrement(),
        uuid         : new Blueprint().varchar(120).null()
        name         : new Blueprint().varchar(120).default('name'),
        email        : new Blueprint().varchar(255).unique().notNull(),
        email_verify : new Blueprint().tinyInt(),
        password     : new Blueprint().varchar(255),
        json         : new Blueprint().json(),
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
 * add Type of schema in database
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
 * add Attrbuites of schema in database
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
foreign({ references : <column> , on : <table or model>}),
```