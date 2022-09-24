## tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

TspaceMySQL is an ORM that can run in NodeJs and can be used with TypeScript. 
Its goal is to always support the latest TypeScript and JavaScript features and provide additional features that help you to develop.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
npm install tspace-mysql --save
```
## Basic Usage
- [Configuration](#configuration)
- [Running Queries](#running-queryies)
- [Database Transactions](#database-transactions)
- [Connection](#connection)
- [Backup](#backup)
- [Generating Model Classes](#generating-model-classes)
- [Model Conventions](#model-conventions)
- [Relationships](#relationships)
  - [One To One](#one-to-one)
  - [One To Many](#one-to-many)
  - [One To One & One To Many (Inverse) / Belongs To](#inverse-belongs-to)
  - [Many To Many](#many-to-many)
- [Query Builder](#query-builder)
- [Cli](#cli)
  - [Make Model](#make-model)
  - [Make Migration](#make-migration)
  - [Migrate](#migrate)
- [Blueprint](#blueprint)

## Configuration
Created your environment variables is to use a .env file, you may establish a connection is this:
```js
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
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
```
Running A Where Query
```js
const user = await new DB('users').where('id',1).findOne()
    // user => { id : 1 , username : 'tspace', email : 'tspace@gmail.com'}
const users = await new DB('users').where('id','!=',1).findMany()
    // users => [{ id : 2 , username : 'tspace2' , email : 'tspace2@gmail.com' }]
```
Running A Insert Query
```js
const user = await new DB('users').create({
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
```
Running A Update Query
```js
const user = await new DB('users').where('id',1)
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
Running A Delete Query
```js
const deleted = await new DB('users').where('id',1).delete()
    // deleted => true
``` 
## Database Transactions 

Within a database transaction, you may use the:

```js
const transaction = await new DB().beginTransaction()
try {
    const user = await new DB('users').create({
        name : 'tspace5',
        email : 'tspace5@gmail.com'
    })
   .save(transaction)
    // user =>  { id : 5 , username : 'tspace5', email : 'tspace5@gmail.com'}
  
   const userSecond = await new DB('users').create({
        name : 'tspace6',
        email : 'tspace6@gmail.com'
    })
   .save(transaction)
    // userSecond =>  { id : 6 , username : 'tspace6', email : 'tspace6@gmail.com'}
   
  throw new Error('try to using transaction')
  
} catch (err) {
   const rollback = await transaction.rollback()
   // rollback => true
   // * rollback data user, userSecond in your database
}
```

## Connection
When establishing a connection, you may establish options is this:
```js
const users = await new DB('users')
    .connection({
       host: 'localhost..',
       port : 3306,
       database: 'database'
       username: 'username',
       password: 'password',
    })
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
     database: 'try-to-backup',
     connection ?: {
        host: 'localhost..',
        port : 3306,
        database: 'database'
        username: 'username',
        password: 'password',
    }
})
/**
 * 
 * @param conection defalut current connection
 */
const backupToFile = await new DB().backupToFile({
     database: 'try-to-backup',
     filePath: 'backup.sql',
     connection ?: {
        host: 'localhost..',
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

```sh
npm install tspace-mysql -g
tspace-mysql make:model <model name> --dir=<directory>

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
    this.useTimestamp()
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
     * @hasOneQuery Get the phone associated with the user. using function callback
     * @function 
     */
    phone (callback ?: Function) {
        return  this.hasOneQuery({ model : Phone }, (query) => {
            return callback ? callback(query) : query
        })
    }
}
export default User

+--------------------------------------------------------------------------+

import User from '../User'
const user = await new User().with('brand').findOne()
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
     * @hasManyQuery Get the comments for the post. using function callback
     * @function 
     */
    comments (callback ?: Function) {
        return  this.hasManyQuery({ model : Comment }, (query) => {
            return callback ? callback(query) : query
        })
    }
}
export default Post

+--------------------------------------------------------------------------+

import Post from '../Post'
const posts = await new Post().with('comments').findOne()
// posts?.comments => [{...}]
const postsUsingFunction = await new Post().comments().findOne()
// postsUsingFunction?.comments => [{...}]
```

## One To One & One To Many (Inverse) / Belongs To
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
     * @belongsToQuery Get the user that owns the phone.. using function callback
     * @function 
     */
    user (callback ?: Function) {
        return  this.belongsToQuery({ model : User }, (query) => {
            return callback ? callback(query) : query
        })
    }
}
export default Phone

+--------------------------------------------------------------------------+

import Phone from '../Phone'
const phone = await new Phone().with('user').findOne()
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
     * @belongsToQuery Get the user that owns the phone.. using function callback
     * @function 
     */
    roles (callback ?: Function) {
        return  this.belongsToManyQuery({ model : Role }, (query) => {
            return callback ? callback(query) : query
        })
    }
}
export default User

+--------------------------------------------------------------------------+

import User from '../User'
const user = await new User().with('roles').findOne()
// user?.roles => [{...}]
const userUsingFunction = await new User().roles().findOne()
// user?.roles => [{...}]
```
## Query Builder
method chaining for queries
```js
where(column , operator , value)   
whereSensitive(column , operator , value) 
whereId(id)  
whereUser(userId)  
whereEmail(value)  
orWhere(column , operator , value)   
whereIn(column , [])
whereNotIn(column , [])
whereNull(column)
whereNotNull(column)
whereBetween (column , [value1 , value2])
whereSubQuery(colmn , rawSQL)
select(column1 ,column2 ,...N)
except(column1 ,column2 ,...N)
only(column1 ,column2 ,...N)
hidden(column1 ,column2 ,...N)
join(primary key , table.foreign key) 
rightJoin (primary key , table.foreign key) 
leftJoin (primary key , table.foreign key) 
limit (limit)
orderBy (column ,'ASC' || 'DSCE')
having (condition)
latest (column)
oldest (column)
groupBy (column)
create(objects)
createMultiple(array objects)
update (objects)
createNotExists(objects)
updateOrCreate (objects)
connection(options)
backup({ database , connection })
backupToFile({ filePath, database , connection })

/** 
 * registry relation in your models
 * @relationship
*/
hasOne({ name , model , localKey , foreignKey , freezeTable , as }
hasMany({ name , model , localKey , foreignKey , freezeTable , as }
belongsTo({ name , model , localKey , foreignKey , freezeTable , as }
belongsToMany({ name , model , localKey , foreignKey , freezeTable , as }
/** 
 * @relation using registry in your models
*/
with(name1 , name2,...nameN)
/** 
 * @relation using registry in your models. if exists child data remove this parent data
*/
withExists(name1 , name2,...nameN) 
/** 
 * @relation call a relation in registry, callback query of parent data
*/
withQuery('relation registry',(callback query))

/**
 * queries statements
 * @exec statements
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
To get started, let's install npm install tspace-mysql -g
you may use a basic cli :

## Make Model
Command will be placed Model in the specific directory
```sh
tspace-mysql make:model <MODEL NAME> --m  --dir=.... --type=....
/** 
  * @options
  * --m  // created scheme table for migrate
  * --dir=directory // created model in directory 
  * --type=js // extension js default ts
  */
  
tspace-mysql make:model User --m --dir=app/Models  
// => 
- node_modules
- app
  - Models
     User.ts
*/
```

## Make Migration
Command will be placed Migration in the specific directory
```sh
tspace-mysql make:migration <TABLE NAME>
 /** 
  * @options
  * --type=js /* extension js default ts */
  * --dir=directory /* created table in directory */ 
  */
tspace-mysql make:migration users --dir=app/Models/Migrations
// => 
- node_modules
- app
  - Models
    - Migrations
      create_users_table.ts
    User.ts
*/
```
## Migrate
```sh
 tspace-mysql migrate <FOLDER> --type=...
 /** 
  * @options
  *--type=js /* extension js default ts */
  *--dir=directory /* find migrate in directory */ 
  */
  
tspace-mysql migrate --dir=App/Models/Migrations
// => migrate all schema table in folder into database
```

## Blueprint
Schema table created by command make:migration,  you may use the:
```js
import { Schema , Blueprint , DB } from 'tspace-mysql'
(async () => {
    await new Schema().table('users',{ 
        id :  new Blueprint().int().notNull().primary().autoIncrement(),
        name : new Blueprint().varchar(120).default('my name'),
        email : new Blueprint().varchar(255).unique(),
        email_verify : new Blueprint().tinyInt(),
        password : new Blueprint().varchar(255),
        created_at : new Blueprint().null().timestamp(),
        updated_at : new Blueprint().null().timestamp()
    })
    /**
     *  
     *  @Faker fake data 5 raw
     *  await new DB().table('users').faker(5)
    */
})()
/**
 * 
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
 * 
 * @Attrbuites
 * 
*/
unsigned ()
unique ()
null ()
notNull ()
primary() 
default (string) 
defaultTimestamp () 
autoIncrement () 
```