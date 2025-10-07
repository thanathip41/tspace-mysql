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

Decorators can be used in a Model.
Let's illustrate this with an example of a decorators:

```js

import {
  Blueprint, Model ,
  Table ,TableSingular, TablePlural,
  UUID, SoftDelete, Timestamp,
  Pattern, Column, Validate, Observer,

  // ------- relations --------
  HasOne, HasMany, BelongsTo, BelongsToMany
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
const nullable      = meta.nullable() // ['uuid','name','created_at','updated_at']
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