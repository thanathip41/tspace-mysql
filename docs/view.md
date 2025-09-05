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