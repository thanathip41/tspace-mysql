
### Schema
Setup schema
<!-- tabs:start -->
#### **Tspace-mysql**

```js
// User.ts
import {
  Blueprint, Model,
  UUID, SoftDelete, Timestamp,
  Column, HasMany
} from 'tspace-mysql'
import { Post } from './Post'

@UUID()
@SoftDelete()
@Timestamp()
class User extends Model {

  @Column(() => Blueprint.int().notNull().primary().autoIncrement())
  public id!: number

  @Column(() => Blueprint.varchar(50).null())
  public uuid!: string

  @Column(() => Blueprint.varchar(50).notNull().unique())
  public email!: string

  @Column(() => Blueprint.varchar(50).null())
  public name !: string | null

  @Column(() => Blueprint.timestamp())
  public created_at!: Date

  @Column(() => Blueprint.timestamp())
  public updated_at!: Date

  @Column(() => Blueprint.timestamp().null())
  public deleted_at!: Date | null

  @HasMany(() => Post)
  public posts!: Post[]
}
```

#### **Typeorm**

```js
// User.entity.ts
import {
  Entity, PrimaryGeneratedColumn,
  Column, Generated,
  OneToMany, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'
import { Post } from './Post.entity'

@Entity({ name: 'users' })
class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'uuid', nullable: true, unique: true })
  @Generated('uuid')
  uuid!: string | null

  @Column({ type: 'varchar', length: 50, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 50, nullable: true })
  name!: string | null

  @CreateDateColumn()
  created_at!: Date

  @UpdateDateColumn()
  updated_at!: Date

  @DeleteDateColumn()
  deleted_at!: Date | null

  @OneToMany(() => Post, post => post.user)
  posts!: Post[]
}
```

#### **Prisma**

```js
// schema.prisma

model User {
    id         Int      @id @default(autoincrement())
    uuid       String?  @unique @default(uuid())
    email      String   @unique @db.VarChar(50)
    name       String?  @db.VarChar(50)
    created_at DateTime @default(now())
    updated_at DateTime @updatedAt
    deleted_at DateTime?
    posts      Post[]
    @@map("users")
}

```
<!-- tabs:end -->


## Selecting fields
This section explains the differences in type safety when selecting a subset of a model's fields in a query.

### Tspace-mysql
TypeORM provides a select option for its find methods (e.g. find, findByIds, findOne, ...), for example:
<!-- tabs:start -->

#### **`find` with `select`**

```js
const postRepository = Repository(Post)
const publishedPosts = await postRepository.findMany({
  where: { published: true },
  select: { id : true , title : true },
})

```

#### **Model**

```js
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  content: string

  @Column({ default: false })
  published: boolean

  @ManyToOne((type) => User, (user) => user.posts)
  author: User
}
```
<!-- tabs:end -->

### TypeORM
TypeORM provides a select option for its find methods (e.g. find, findByIds, findOne, ...), for example:
<!-- tabs:start -->

#### **`find` with `select`**

```js
const postRepository = getManager().getRepository(Post)
const publishedPosts = await postRepository.find({
  where: { published: true },
  select: ['id', 'title'],
})

```

#### **Model**

```js
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column({ nullable: true })
  content: string

  @Column({ default: false })
  published: boolean

  @ManyToOne((type) => User, (user) => user.posts)
  author: User
}
```
<!-- tabs:end -->