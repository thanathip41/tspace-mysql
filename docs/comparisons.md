## ORMs Comparison
Comparing how different ORMs validate queries, selected fields, and result shapes at compile time.


| Feature / API | TypeORM (Repo) | TypeORM (QueryBuilder) | Prisma | Tspace-mysql (Repo) | Tspace-mysql (Builder) |
|--------------|----------------|------------------------|--------|---------------------|------------------------|
| Partial select typing | ⚠ Medium  | ❌ Unsafe | ✅ Safe | ✅ Safe | ⚠ Medium  |
| Except columns(Omit) | ❌ Not supported | ❌ Not supported | ✅ v6.2+ | ✅ Supported | ✅ Supported|
| Invalid field detection | ✅ Compile-time | ❌ Runtime | ✅ Compile-time | ✅ Compile-time | ✅ Compile-time |
| Result shape accuracy | ⚠ Approximate | ❌ Inaccurate | ✅ Exact | ✅ Exact | ⚠ Approximate |
| Where condition typing | ✅ Strong  | ❌ None (string-based) | ✅ Strong | ✅ Strong | ✅ Strong |
| Relations | ✅ Supported  | ❌ Not supported | ✅ Supported | ✅ Supported | ✅ Supported |
| Relation name safety | ✅ Strong  | ❌ Not supported | ✅ Strong | ✅ Strong | ✅ Strong |
| Self Join | ❌ Not supported  | ✅ Supported | ❌ Not supported | ✅ Supported | ✅ Supported |
| Error detection time | ✅Compile-time | ❌Runtime | ✅Compile-time | ✅Compile-time | ✅Compile-time |
| No code generation needed | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| Built-in `.paginate()` method | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Query flexibility | ⚠ Medium| ✅ Very High | ⚠ Medium |✅ High | ✅ Very High |
| Custom chainable methods | ❌ Not supported | ⚠ Possible (hacky) | ❌ Not supported | ✅ First-class | ✅ First-class |


## Schema
This section explains the differences in setup schema of a model’s.
<!-- tabs:start -->
### **schema:`Tspace-mysql`**
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

  @Column(() => Blueprint.boolean().null())
  public actived !: boolean | null

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

### **schema:`Typeorm`**

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

  @Column({ type: 'boolean', nullable: true })
  public actived !: boolean | null

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

### **schema:`Prisma`**

```js
// schema.prisma
model User {
  id         Int      @id @default(autoincrement())
  uuid       String?  @unique @default(uuid())
  email      String   @unique @db.VarChar(50)
  name       String?  @db.VarChar(50)
  actived    Boolean  @db.Boolean()
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt
  deleted_at DateTime?
  posts      Post[]
  @@map("users")
}

```
<!-- tabs:end -->

## Select
This section explains the differences in type safety when selecting a subset of a model's fields in a query.

<!-- tabs:start -->
#### **`select:`Tspace-mysql**

```js
import { Repository } from 'tspace-mysql';

const userRepository = Repository(User)
const users = await userRepository.findMany({
  select: { 
    id : true ,  ✅
    email : true  ✅
    emailx : true  ❌ // type error
  }
})

for(const user of users) {
  user.name  ❌ // type error
  user.email ✅
}

```
#### **`select:`TypeORM**

```js
import getManager from '../<your-manager>';
const userRepository = getManager().getRepository(User)
const users = await userRepository.find({
  select: { 
    id : true ,  ✅
    email : true  ✅
    emailx : true  ❌ // type error
  }
})

for(const user of users) {
  user.name  💩 // no check type
  user.email 💩 // no check type
}

```
#### **`select:`Prisma**

```js
import prima from '../<your-prima>';
const userRepository = prima.user
const users = await userRepository.findMany({
  select: { 
    id : true ,  ✅
    email : true  ✅
    emailx : true  ❌ // type error 
  }
})

for(const user of users) {
  user.name  ❌ // type error
  user.email ✅
}

```
<!-- tabs:end -->

## Omit
This section explains the differences in type safety when omit a subset of a model's fields in a query.

<!-- tabs:start -->
#### **`omit:`Tspace-mysql**

```js
const userRepository = Repository(User)
const users = await userRepository.findMany({
  except: { 
    id : true ,  ✅
    email : true  ✅
  }
})

for(const user of users) {
  user.name  ✅
  user.email ❌ // type error
}

```
#### **`omit:`TypeORM**

```js
// No. TypeORM doesn't have a omit.
import { EntityTarget } from "typeorm";
type OmitFields<T> = Partial<Record<keyof T, true>>;

function omitToSelect<T extends object>(
  entity: EntityTarget<T>,
  omit: OmitFields<T>
) {
  const metadata = db.getMetadata(entity);

  return Object.fromEntries(
    metadata.columns
      .filter(col => !omit[col.propertyName as keyof T])
      .map(col => [col.propertyName, true])
  );
}

const userRepository = getManager().getRepository(User)

const users = await userRepository.find({
  select: omitToSelect(User, {
    password: true,
    email: true,
  })
})

for(const user of users) {
  user.name  💩 // no check type
  user.email 💩 // no check type
}

```
#### **`omit:`Prisma**

```js
const userRepository = prima.user
const users = await userRepository.findMany({
  omit: { 
    id : true ,  ✅
    email : true  ✅
  }
})

for(const user of users) {
  user.name  ✅
  user.email ❌ // type error
}

```
<!-- tabs:end -->

## Where
This section explains the differences in type safety when where of a model's fields in a query.

<!-- tabs:start -->
#### **`where:`Tspace-mysql**

```js
const userRepository = Repository(User)
const users = await userRepository.findMany({
  where:  { 
    id : 1 ,  ✅
    email : true,  ❌ // type error email is string
    // email : 'true' ✅
    actived: true, ✅
    activedx: true, ❌ // type error
  }
})

```
#### **`where:`TypeORM**

```js
const userRepository = getManager().getRepository(Post)
const users = await userRepository.find({
  where:  { 
    id : 1 ,  ✅
    email : true,  ❌ // type error email is string
    // email : 'true' ✅
    actived: true, ✅
    activedx: true, ❌ // type error
  }
})

```
#### **`where:`Prisma**

```js
const userRepository = prima.user
const users = await userRepository.findMany({
  where:  { 
    id : 1 ,  ✅
    email : true,  ❌ // type error email is string
    // email : 'true' ✅
    actived: true, ✅
    activedx: true, ❌ // type error
  }
})

```
<!-- tabs:end -->

## Relation
This section explains the differences in type safety when selecting a subset of a model's fields in a query.

<!-- tabs:start -->
#### **`relation:`Tspace-mysql**

```js
const userRepository = Repository(User)
const users = await userRepository.findMany({
  relations : { posts : true },
  select: { 
    id : true, 
    name : true,
    posts : {
      id       : true,
      title    : true
    }
  },
})

for(const user of users) {
  // if comment the relations posts will type error in .posts
  user.posts.forEach(post => {
    post.id ✅
    post.title ✅
    post.subtitle ❌ // type error
  })
}

```
#### **`relation:`TypeORM**

```js
const userRepository = getManager().getRepository(Post)
const users = await userRepository.find({
  relations : { posts : true },
  select: { 
    id : true, 
    name : true,
    posts : {
      id       : true,
      title    : true
    }
  },
})

for(const user of users) {
  // if comment the relations posts will not check type in .posts
  user.posts.forEach(post => {
    post.id ✅
    post.title ✅
    post.subtitle ✅ // no type check
  })
}

```
#### **`relation:`Prisma**

```js
const userRepository = prima.user
const users = await userRepository.findMany({
  // include cannot be combined with select
  // include: { posts: true }
  select: { 
    id : true,
    name : true,
    posts : {
      select : { // 💩 Nested relation selection requires another select block
        id       : true,
        title    : true
      },
      where : {
        // ...// 💩 Relation filters must be defined alongside the nested select
      }
    }
  },
})

for(const user of users) {
  // if comment the relations posts will not check type in .posts
  user.posts.forEach(post => {
    post.id ✅
    post.title ✅
    post.subtitle ❌ // type error
  })
}

```
<!-- tabs:end -->

<div class="page-nav-cards">
  <a href="#" class="prev-card">
    <div class="nav-label"> 
        <span class="page-nav-arrow">←</span> 
        Previous
    </div>
    <div class="nav-title"> Getting Started</div>
  </a>

  <a href="#/integrations" class="next-card">
    <div class="nav-label">
        Next
        <span class="page-nav-arrow">→</span>
    </div>
    <div class="nav-title"> Integrations </div>
  </a>
</div>
