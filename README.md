# tspace-mysql

[![NPM version](https://img.shields.io/npm/v/tspace-mysql.svg)](https://www.npmjs.com)
[![NPM downloads](https://img.shields.io/npm/dm/tspace-mysql.svg)](https://www.npmjs.com)

Query builder object relation mapping

## Install

Install with [npm](https://www.npmjs.com/):

```sh
npm install tspace-mysql --save

```
## Setup
.env
```js
DB_HOST = localhost
DB_PORT = 3306
DB_USERNAME = root
DB_PASSWORD = password
DB_DATABASE = database
```
## Getting Started
queries data
```js
import { DB } from 'tspace-mysql'
(async () => {
    await new DB().raw('SELECT * FROM users')
    await new DB().table('users').findMany()
    await new DB().table('users').select('id').where('id',1).findOne()
    await new DB().table('users').select('id').whereIn('id',[1,2,3]).findMany()
})()
```
create data

```js
import { DB } from 'tspace-mysql'
(async () => {
    *ex pattern 1
    const user = await new DB().table('users').create({
          name : 'tspace',
          email : 'tspace@gmail.com'
      }).save()
      
      console.log(user)

     *ex pattern 2
     const u = new DB().table('users')
         u.name = 'tspace'
         u.email = 'tspace@gmail.com'
         await u.save()
      const { result : user } = u 
      /* or const user = await u.save() */
      console.log(user)
})()  
```

update data
```js
import { DB } from 'tspace-mysql'
(async () => {
     *ex pattern 1
     const user = await new DB().table('users').update({
          name : 'tspace',
          email : 'tspace@gmail.com'
      })
      .where('id',1)
      .save()
      
      console.log(user)

    *ex pattern 2
     const u = new DB().table('users').where('id',1)
         u.name = 'tspace'
         u.email = 'tspace@gmail.com'
         await u.save()
     const { result : user } = u 
    /* or const user = await u.save() */
     console.log(user)
})()
```    
delete data
```js
import { DB } from 'tspace-mysql'
(async () => {
     await new User().where('id',1).delete()
})()
``` 

## Transactions & Rollback
```js
import { DB } from 'tspace-mysql'
(async () => {
   const transaction = await new DB().beginTransaction()
   try {
      const user = await new User().create({
          name : 'tspace',
          email : 'tspace@gmail.com'
      })
      .save(transaction)
      
       const posts = await new Post().createMultiple([
            {   
                user_id : user.id,
                title : 'tspace post'
            },
            {   
                user_id : user.id,
                title : 'tspace post second'
            }
       ])
      .save(transaction)
      
      throw new Error('try to transaction')
      
   } catch (err) {
       const rollback = await transaction.rollback()
       console.log(rollback ,'rollback !')
   }
})()
```
     
## Model Conventions
basic model class and discuss some relations:

```js
import { Model } from 'tspace-mysql'
import Post from '../Post'
import Comment from '../Comment'
import User from '../User'

/**
Folder directory example
- App
  - Model
    Post.ts
    User.ts
    Comment.ts
*/   
    
(async () => {
    const users = await new User()
        .with('posts','comments') /* relations -> hasMany: posts & comments  */
        .withQuery('posts', (query) => query.with('user'))   /* relation -> belongsTo: post by user  */
        .withQuery('comments', (query) => query.with('user','post'))   /* relation -> belongsTo: comment by user? & comment in post*/
        .findMany()
        
    console.log(users)    
})()

/** 
 * 
 * User.ts
*/
import { Model } from 'tspace-mysql'
class User extends Model {
    constructor(){
        super()
        this.hasMany({name : 'posts', model: Post })
        this.hasMany({name : 'comments', model: Comment })
    }
} 
export default User
/** 
 * 
 * Post.ts
*/
import { Model } from 'tspace-mysql'

class Post extends Model {
    constructor(){
        super()
        this.belongsTo({name : 'user', model: User })
        this.hasMany({ name : 'comments' , model : Comment })
    }
} 
export default Post

/** 
 * 
 * Comment.ts
*/

import { Model } from 'tspace-mysql'

class Comment extends Model {
    constructor(){
        super()
        this.belongsTo({name : 'user', model: User })
        this.belongsTo({name : 'post', model: Post })
    }
} 
export default Comment
```

## Method chaining
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
/** 
 * relationship
 * 
 * @Relation setup name in model
*/
with(name1 , name2,...nameN)
withExists(name1 , name2,...nameN) 
withQuery('relation registry',(callback queries))

/**
 * queries statements
 * 
 *  @exec statements
*/
findMany()
findOne()
find(id)
first()
get()
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
npm install tspace-mysql -g
```js

tspace-mysql make:model <MODEL NAME> --m  --dir=... --js
* optional
    --m  /* created table for migrate */
    --dir=directory /* created model in directory */ 
    --type=js /* extension js default ts */

tspace-mysql make:migration <TABLE NAME>
* optional
    --type=js /* extension js default ts */
    --dir=directory /* created table in directory */ 
    
 tspace-mysql migrate <FOLDER> --js
 * optional
    --type=js /* extension js default ts */
    --dir=directory /* find migrate in directory */ 
```

tspace-mysql make:model User --m --dir=App/Models
```js
/* Ex folder 
- node_modules
- App
  - Models
     User.ts
*/

/* in App/Models/User.ts */
import { Model } from 'tspace-mysql'
class User extends Model{
  constructor(){
    super()
    this.useDebug()  /* default false *debug sql */
    this.useTimestamp() /* default false * case created_at & updated_at*/
    this.useSoftDelete()  /*  default false * case where deleted_at is null  */
    this.useTable('users') /*  default users   */
    this.usePattern('camelCase') /*  default snake_case  */
    this.useUUID()
  }
}
export default User
```
tspace-mysql make:migration users --dir=App/Models/Migrations
```js
/* Ex folder 
- node_modules
- App
  - Models
    - migrations
      create_users_table.ts
    User.ts
*/
/* in App/Models/Migrations/create_users_table.ts */
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
     *  @Faker data
     *  await new DB().table('users').faker(5)
    */
})()
```
tspace-mysql migrate --dir=App/Models/Migrations
/* migrate all table in folder into database */
```js
* Blueprint method
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
