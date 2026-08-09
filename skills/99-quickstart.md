# tspace-mysql - Quick Start Guide

## Complete Real-World Example: Blog Application

This guide walks through building a complete blog application with users, posts, comments, and categories using tspace-mysql.

## Step 1: Project Setup

```bash
# Initialize project
mkdir my-blog-api
cd my-blog-api
npm init -y

# Install tspace-mysql
npm install tspace-mysql

# Install TypeScript (if using)
npm install -D typescript @types/node

# Create .env file
cat > .env << EOF
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=my_blog
EOF
```

## Step 2: Define Models

### User Model

```typescript
// src/models/User.ts
import { Model, Blueprint, T, HasMany } from 'tspace-mysql'
import { Post } from './Post'
import { Comment } from './Comment'

const userSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null(),
  email: Blueprint.varchar(255).unique().notNull(),
  name: Blueprint.varchar(255).notNull(),
  password: Blueprint.varchar(255).notNull(),
  role: Blueprint.enum('admin', 'editor', 'reader').default('reader'),
  isVerified: Blueprint.boolean().default(false),
  lastLoginAt: Blueprint.timestamp().null(),
  created_at: Blueprint.timestamp().currentTimestamp(),
  updated_at: Blueprint.timestamp().null(),
  deleted_at: Blueprint.timestamp().null(),
}

type UserSchema = T.Schema<typeof userSchema>

export class User extends Model<UserSchema> {
  constructor() {
    super()
    this.useSchema(userSchema)
    this.useUUID()
    this.useTimestamp()
    this.useSoftDelete()
    
    // Relations
    this.hasMany({ model: Post, name: 'posts' })
    this.hasMany({ model: Comment, name: 'comments' })
  }
}
```

### Post Model

```typescript
// src/models/Post.ts
import { Model, Blueprint, T, BelongsTo, BelongsToMany, HasMany } from 'tspace-mysql'
import { User } from './User'
import { Category } from './Category'
import { PostCategory } from './PostCategory'
import { Comment } from './Comment'

const postSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  uuid: Blueprint.varchar(50).null(),
  authorId: Blueprint.int().foreign({ on: User, references: 'id' }).notNull(),
  title: Blueprint.varchar(255).notNull(),
  slug: Blueprint.varchar(255).unique().notNull(),
  excerpt: Blueprint.varchar(500).null(),
  content: Blueprint.longText().notNull(),
  status: Blueprint.enum('draft', 'published', 'archived').default('draft'),
  publishedAt: Blueprint.timestamp().null(),
  viewCount: Blueprint.int().default(0),
  featuredImage: Blueprint.varchar(500).null(),
  created_at: Blueprint.timestamp().currentTimestamp(),
  updated_at: Blueprint.timestamp().null(),
  deleted_at: Blueprint.timestamp().null(),
}

type PostSchema = T.Schema<typeof postSchema>

export class Post extends Model<PostSchema> {
  constructor() {
    super()
    this.useSchema(postSchema)
    this.useUUID()
    this.useTimestamp()
    this.useSoftDelete()
    
    // Relations
    this.belongsTo({ model: User, foreignKey: 'authorId', name: 'author' })
    this.belongsToMany({
      model: Category,
      name: 'categories',
      modelPivot: PostCategory,
    })
    this.hasMany({ model: Comment, name: 'comments' })
  }
  
  // Custom method to publish a post
  async publish() {
    return await this.update({
      data: {
        status: 'published',
        publishedAt: new Date()
      },
      where: { id: this.id }
    }).save()
  }
}
```

### Category Model

```typescript
// src/models/Category.ts
import { Model, Blueprint, T, BelongsToMany } from 'tspace-mysql'
import { Post } from './Post'
import { PostCategory } from './PostCategory'

const categorySchema = {
  id: Blueprint.int().primary().autoIncrement(),
  name: Blueprint.varchar(100).notNull(),
  slug: Blueprint.varchar(100).unique().notNull(),
  description: Blueprint.text().null(),
  parentId: Blueprint.int().foreign({ on: Category, references: 'id' }).null(),
  created_at: Blueprint.timestamp().currentTimestamp(),
}

type CategorySchema = T.Schema<typeof categorySchema>

export class Category extends Model<CategorySchema> {
  constructor() {
    super()
    this.useSchema(categorySchema)
    this.useTimestamp()
    
    // Self-referencing relation for nested categories
    this.belongsTo({ model: Category, foreignKey: 'parentId', name: 'parent' })
    this.belongsToMany({
      model: Post,
      name: 'posts',
      modelPivot: PostCategory,
    })
  }
}
```

### PostCategory (Pivot) Model

```typescript
// src/models/PostCategory.ts
import { Model, Blueprint, T } from 'tspace-mysql'

const postCategorySchema = {
  id: Blueprint.int().primary().autoIncrement(),
  postId: Blueprint.int().foreign({ on: Post, references: 'id' }).notNull(),
  categoryId: Blueprint.int().foreign({ on: Category, references: 'id' }).notNull(),
  isPrimary: Blueprint.boolean().default(false),
  created_at: Blueprint.timestamp().currentTimestamp(),
}

type PostCategorySchema = T.Schema<typeof postCategorySchema>

export class PostCategory extends Model<PostCategorySchema> {
  constructor() {
    super()
    this.useSchema(postCategorySchema)
    this.useTimestamp()
    this.useTable('post_categories')
  }
}
```

### Comment Model

```typescript
// src/models/Comment.ts
import { Model, Blueprint, T, BelongsTo } from 'tspace-mysql'
import { User } from './User'
import { Post } from './Post'

const commentSchema = {
  id: Blueprint.int().primary().autoIncrement(),
  postId: Blueprint.int().foreign({ on: Post, references: 'id' }).notNull(),
  userId: Blueprint.int().foreign({ on: User, references: 'id' }).notNull(),
  parentId: Blueprint.int().foreign({ on: Comment, references: 'id' }).null(),
  content: Blueprint.text().notNull(),
  status: Blueprint.enum('pending', 'approved', 'rejected').default('pending'),
  created_at: Blueprint.timestamp().currentTimestamp(),
  updated_at: Blueprint.timestamp().null(),
}

type CommentSchema = T.Schema<typeof commentSchema>

export class Comment extends Model<CommentSchema> {
  constructor() {
    super()
    this.useSchema(commentSchema)
    this.useTimestamp()
    
    // Relations
    this.belongsTo({ model: Post, name: 'post' })
    this.belongsTo({ model: User, name: 'author' })
    this.belongsTo({ model: Comment, foreignKey: 'parentId', name: 'parent' })
    this.hasMany({ model: Comment, foreignKey: 'parentId', name: 'replies' })
  }
}
```

## Step 3: Database Migration

```typescript
// src/migrations/001-init.ts
import { Schema, Blueprint } from 'tspace-mysql'

export async function up(schema: Schema): Promise<void> {
  // Users table
  await schema.table('users', {
    id: Blueprint.int().primary().autoIncrement(),
    uuid: Blueprint.varchar(50).null().index(),
    email: Blueprint.varchar(255).unique().notNull(),
    name: Blueprint.varchar(255).notNull(),
    password: Blueprint.varchar(255).notNull(),
    role: Blueprint.enum('admin', 'editor', 'reader').default('reader'),
    isVerified: Blueprint.boolean().default(false),
    lastLoginAt: Blueprint.timestamp().null(),
    created_at: Blueprint.timestamp().currentTimestamp(),
    updated_at: Blueprint.timestamp().null(),
    deleted_at: Blueprint.timestamp().null(),
  }, {
    foreign: true,
    index: true,
  })
  
  // Posts table
  await schema.table('posts', {
    id: Blueprint.int().primary().autoIncrement(),
    uuid: Blueprint.varchar(50).null(),
    authorId: Blueprint.int().foreign({ on: 'User', references: 'id' }).notNull(),
    title: Blueprint.varchar(255).notNull(),
    slug: Blueprint.varchar(255).unique().notNull(),
    excerpt: Blueprint.varchar(500).null(),
    content: Blueprint.longText().notNull(),
    status: Blueprint.enum('draft', 'published', 'archived').default('draft'),
    publishedAt: Blueprint.timestamp().null(),
    viewCount: Blueprint.int().default(0),
    featuredImage: Blueprint.varchar(500).null(),
    created_at: Blueprint.timestamp().currentTimestamp(),
    updated_at: Blueprint.timestamp().null(),
    deleted_at: Blueprint.timestamp().null(),
  }, {
    foreign: true,
    index: true,
  })
  
  // Categories table
  await schema.table('categories', {
    id: Blueprint.int().primary().autoIncrement(),
    name: Blueprint.varchar(100).notNull(),
    slug: Blueprint.varchar(100).unique().notNull(),
    description: Blueprint.text().null(),
    parentId: Blueprint.int().foreign({ on: 'Category', references: 'id' }).null(),
    created_at: Blueprint.timestamp().currentTimestamp(),
  }, {
    foreign: true,
  })
  
  // Post-Category pivot table
  await schema.table('post_categories', {
    id: Blueprint.int().primary().autoIncrement(),
    postId: Blueprint.int().foreign({ on: 'Post', references: 'id' }).notNull(),
    categoryId: Blueprint.int().foreign({ on: 'Category', references: 'id' }).notNull(),
    isPrimary: Blueprint.boolean().default(false),
    created_at: Blueprint.timestamp().currentTimestamp(),
    // Unique constraint for post-category pair
  }, {
    foreign: true,
  })
  
  // Comments table
  await schema.table('comments', {
    id: Blueprint.int().primary().autoIncrement(),
    postId: Blueprint.int().foreign({ on: 'Post', references: 'id' }).notNull(),
    userId: Blueprint.int().foreign({ on: 'User', references: 'id' }).notNull(),
    parentId: Blueprint.int().foreign({ on: 'Comment', references: 'id' }).null(),
    content: Blueprint.text().notNull(),
    status: Blueprint.enum('pending', 'approved', 'rejected').default('pending'),
    created_at: Blueprint.timestamp().currentTimestamp(),
    updated_at: Blueprint.timestamp().null(),
  }, {
    foreign: true,
    index: true,
  })
}

export async function down(schema: Schema): Promise<void> {
  await schema.drop('comments')
  await schema.drop('post_categories')
  await schema.drop('categories')
  await schema.drop('posts')
  await schema.drop('users')
}
```

## Step 4: Repository Layer

```typescript
// src/repositories/UserRepository.ts
import { Repository, OP } from 'tspace-mysql'
import { User } from '../models/User'

export class UserRepository {
  private repository = Repository(User)
  
  async findById(id: number) {
    return await this.repository.find(id, {
      relations: ['posts']
    })
  }
  
  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email }
    })
  }
  
  async findAll(options: { page?: number; limit?: number; role?: string } = {}) {
    const { page = 1, limit = 15, role } = options
    
    const where: any = {}
    if (role) {
      where.role = role
    }
    
    return await this.repository.paginate({
      page,
      limit,
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        created_at: true
      },
      orderBy: [['created_at', 'desc']]
    })
  }
  
  async create(data: { email: string; name: string; password: string; role?: string }) {
    return await this.repository.create({
      data: {
        ...data,
        role: data.role || 'reader'
      }
    })
  }
  
  async update(id: number, data: Partial<User>) {
    return await this.repository.update({
      data,
      where: { id }
    })
  }
  
  async delete(id: number) {
    return await this.repository.delete(id)
  }
  
  async search(query: string) {
    return await this.repository.findMany({
      where: {
        name: OP.like(`%${query}%`)
      },
      orderBy: [['name', 'asc']]
    })
  }
}
```

```typescript
// src/repositories/PostRepository.ts
import { Repository, OP } from 'tspace-mysql'
import { Post } from '../models/Post'

export class PostRepository {
  private repository = Repository(Post)
  
  async findById(id: number) {
    return await this.repository.find(id, {
      relations: ['author', 'categories', 'comments']
    })
  }
  
  async findBySlug(slug: string) {
    return await this.repository.findOne({
      where: { slug },
      relations: ['author', 'categories']
    })
  }
  
  async findPublished(options: { page?: number; limit?: number; categoryId?: number } = {}) {
    const { page = 1, limit = 10, categoryId } = options
    
    const where: any = { status: 'published' }
    
    return await this.repository.paginate({
      page,
      limit,
      where,
      relations: ['author', 'categories'],
      orderBy: [['publishedAt', 'desc']]
    })
  }
  
  async findByAuthor(authorId: number) {
    return await this.repository.findMany({
      where: { authorId },
      orderBy: [['created_at', 'desc']]
    })
  }
  
  async create(data: { 
    title: string
    slug: string
    content: string
    authorId: number
    excerpt?: string
    status?: string
  }) {
    return await this.repository.create({ data })
  }
  
  async update(id: number, data: Partial<Post>) {
    return await this.repository.update({ data, where: { id } })
  }
  
  async incrementViewCount(id: number) {
    return await this.repository.update({
      data: { viewCount: OP.raw('view_count + 1') },
      where: { id }
    })
  }
}
```

## Step 5: Service Layer

```typescript
// src/services/UserService.ts
import { UserRepository } from '../repositories/UserRepository'
import { Queue } from 'tspace-mysql'
import bcrypt from 'bcrypt'

const welcomeEmailQueue = new Queue('welcome_emails')

export class UserService {
  private userRepository = new UserRepository()
  
  async register(data: { email: string; name: string; password: string }) {
    // Check if email exists
    const existing = await this.userRepository.findByEmail(data.email)
    if (existing) {
      throw new Error('Email already registered')
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    // Create user
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword
    })
    
    // Queue welcome email (async)
    await welcomeEmailQueue.publish({
      type: 'send-welcome-email',
      data: { userId: user.id, email: user.email, name: user.name }
    })
    
    return user
  }
  
  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email)
    
    if (!user) {
      throw new Error('Invalid credentials')
    }
    
    const validPassword = await bcrypt.compare(password, user.password)
    
    if (!validPassword) {
      throw new Error('Invalid credentials')
    }
    
    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date()
    })
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  
  async getProfile(userId: number) {
    return await this.userRepository.findById(userId)
  }
  
  async updateProfile(userId: number, data: { name?: string }) {
    return await this.userRepository.update(userId, data)
  }
}
```

```typescript
// src/services/PostService.ts
import { PostRepository } from '../repositories/PostRepository'
import { slugify } from '../utils/slugify'

export class PostService {
  private postRepository = new PostRepository()
  
  async create(data: {
    title: string
    content: string
    authorId: number
    excerpt?: string
    categoryIds?: number[]
  }) {
    const post = await this.postRepository.create({
      title: data.title,
      slug: slugify(data.title),
      content: data.content,
      authorId: data.authorId,
      excerpt: data.excerpt,
      status: 'draft'
    })
    
    // Attach categories if provided
    if (data.categoryIds?.length) {
      // Implementation for attaching categories
    }
    
    return post
  }
  
  async publish(postId: number) {
    const post = await this.postRepository.findById(postId)
    
    if (!post) {
      throw new Error('Post not found')
    }
    
    return await post.publish()
  }
  
  async getPublishedPosts(page: number = 1, limit: number = 10) {
    return await this.postRepository.findPublished({ page, limit })
  }
  
  async getPostBySlug(slug: string) {
    const post = await this.postRepository.findBySlug(slug)
    
    if (post && post.status === 'published') {
      // Increment view count asynchronously
      this.postRepository.incrementViewCount(post.id)
    }
    
    return post
  }
}
```

## Step 6: API Routes (Express Example)

```typescript
// src/routes/posts.ts
import { Router } from 'express'
import { PostService } from '../services/PostService'
import { authenticate } from '../middleware/auth'

const router = Router()
const postService = new PostService()

// Get all published posts
router.get('/posts', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  
  const result = await postService.getPublishedPosts(page, limit)
  res.json(result)
})

// Get single post by slug
router.get('/posts/:slug', async (req, res) => {
  const post = await postService.getPostBySlug(req.params.slug)
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' })
  }
  
  res.json(post)
})

// Create new post (authenticated)
router.post('/posts', authenticate, async (req, res) => {
  try {
    const post = await postService.create({
      ...req.body,
      authorId: req.user.id
    })
    res.status(201).json(post)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Publish post (authenticated)
router.post('/posts/:id/publish', authenticate, async (req, res) => {
  try {
    const post = await postService.publish(parseInt(req.params.id))
    res.json(post)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

export default router
```

## Step 7: Main Application

```typescript
// src/index.ts
import 'reflect-metadata'
import express from 'express'
import { DB } from 'tspace-mysql'
import postsRoutes from './routes/posts'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())

// Initialize database connection
DB.initialize().then(() => {
  console.log('Database connected')
}).catch(console.error)

// Routes
app.use('/api', postsRoutes)

// Health check
app.get('/health', async (req, res) => {
  try {
    await DB.query('SELECT 1')
    res.json({ status: 'healthy' })
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Step 8: Run the Application

```bash
# Run migrations
npx tspace-mysql migrate

# Start the server
npm run dev  # or ts-node src/index.ts
```

## Testing the API

```bash
# Get published posts
curl http://localhost:3000/api/posts

# Get single post
curl http://localhost:3000/api/posts/my-first-post

# Create post (with auth token)
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Hello World!",
    "excerpt": "Welcome to my blog"
  }'
```

## Summary

This complete example demonstrates:

1. **Model Definition** - Schema, relations, timestamps, soft delete
2. **Database Migration** - Creating tables with proper constraints
3. **Repository Pattern** - Clean data access layer
4. **Service Layer** - Business logic with validation
5. **API Routes** - RESTful endpoints
6. **Queue Integration** - Async email processing
7. **Type Safety** - Full TypeScript support throughout

The same patterns can be applied to any domain - e-commerce, SaaS, social media, etc.