import { Blueprint, DB, Model } from '../../src/lib'

export const pattern = 'camelCase';


export class User extends Model {
    constructor() {
        super()
        this.useCamelCase()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.hasMany({ model : Post , name : 'posts'  })
        this.hasOne({ model : Post , name : 'post' })
        
        this.useSchema({
            id        : Blueprint.int().primary().autoIncrement(),
            uuid      : Blueprint.varchar(50).null(),
            email     : Blueprint.varchar(50).null().index('users.email@index'),
            name      : Blueprint.varchar(255).null(),
            username  : Blueprint.varchar(255).null(),
            password  : Blueprint.varchar(255).null(),
            status    : Blueprint.boolean().default(0),
            role      : Blueprint.enum('admin','user').default('user'),
            createdAt : Blueprint.timestamp().null(),
            updatedAt : Blueprint.timestamp().null(),
            deletedAt : Blueprint.timestamp().null(),
        })
    }
}

export class Post extends Model {
    constructor() {
        super()
        this.useCamelCase()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.belongsTo({ name : 'user' , model : User })
        this.belongsToMany({ name : 'subscribers' , model : User , modelPivot : PostUser })
       
        this.useSchema({
            id          : Blueprint.int().notNull().primary().autoIncrement(),
            uuid        : Blueprint.varchar(50).null(),
            userId      : Blueprint.int().null().foreign({ on: User }),
            title       : Blueprint.varchar(100).notNull(),
            subtitle    : Blueprint.varchar(100).null(),
            description : Blueprint.varchar(255).null(),
            createdAt   : Blueprint.timestamp().null(),
            updatedAt   : Blueprint.timestamp().null(),
            deletedAt   : Blueprint.timestamp().null()
        })
    }
}

export class PostUser extends Model {
    constructor() {
        super()
        this.useCamelCase()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.useTableSingular()
       
        this.useSchema({
            id          : Blueprint.int().notNull().primary().autoIncrement(),
            uuid        : Blueprint.varchar(50).null(),
            userId      : Blueprint.int().notNull().foreign({ on: User }),
            postId      : Blueprint.int().notNull().foreign({ on: Post }),
            createdAt   : Blueprint.timestamp().null(),
            updatedAt   : Blueprint.timestamp().null(),
            deletedAt   : Blueprint.timestamp().null()
        })
    }
}

export const userSchemaObject = {
    type : 'object',
    properties : {
      id: { type: 'integer' },
      uuid :{ anyOf: [{ type: 'string' }, { type: 'null' }] },
      email: { type: 'string' },
      name :{ anyOf: [{ type: 'string' }, { type: 'null' }] },
      username: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      password: { type: 'string' },
      createdAt:  { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  ,{ type: 'null' }] },
      updatedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  , { type: 'null' }] },
      deletedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" } , { type: 'null' }] },
    }
}

export const userSchemaArray = {
    type: 'array',
    items : {
        ...userSchemaObject
    }
}

export const postSchemaObject = {
    type : 'object',
    properties : {
      id: { type: 'integer' },
      uuid :{ anyOf: [{ type: 'string' }, { type: 'null' }] },
      userId: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
      title :{ type: 'string' },
      subtitle: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      description: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      createdAt:  { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  ,{ type: 'null' }] },
      updatedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  , { type: 'null' }] },
      deletedAt: { anyOf: [{ type: 'string' }, { type: "object", format: "date" } , { type: 'null' }] },
    }
}

export const postSchemaArray = {
    type: 'array',
    items : {
        ...postSchemaObject
    }
}

export const userDataObject = {
  uuid: DB.generateUUID(),
  email: "test01@example.com",
  name: "name:test01",
  username: "test01",
  password: "xxxxxxxxxx",
  status: Math.random() < 0.5,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

export const userDataArray = [2, 3, 4, 5, 6].map((i) => {
  return  {
    uuid: DB.generateUUID(),
    email: `test0${i}@example.com`,
    name: `name:test0${i}`,
    username: `test0${i}`,
    password: "xxxxxxxxxx",
    status: Math.random() < 0.5,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }
});

export const postDataObject = {
  uuid: DB.generateUUID(),
  userId: 1,
  title: "title:01",
  subtitle: "subtitle:test01",
  description: "test01",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
}

export const postDataArray = [2, 3, 4, 5, 6].map((i) => {
  return {
    uuid: DB.generateUUID(),
    userId: i === 4 ? null : i,
    title: `title:0${i}`,
    subtitle: `subtitle:test0${i}`,
    description: `test0${i}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  }
});