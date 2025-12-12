import { Blueprint, Model }  from '../src/lib'

export const pattern : 'snake_case' | 'camelCase'  = 'snake_case' 
export class User extends Model {
    constructor() {
        super()
        this.usePattern(pattern)
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.hasMany({ model : Post , name : 'posts'  })
        this.hasOne({ model : Post , name : 'post' })
        
        this.useSchema(Model.formatPattern({ 
            data : {
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
            },
            pattern
        }))
    }
}

export class Post extends Model {
    constructor() {
        super()
        this.usePattern(pattern)
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.belongsTo({ name : 'user' , model : User })
        this.belongsToMany({ name : 'subscribers' , model : User , modelPivot : PostUser })
       
        this.useSchema(Model.formatPattern({
            data :  { 
                id          : Blueprint.int().notNull().primary().autoIncrement(),
                uuid        : Blueprint.varchar(50).null(),
                userId      : Blueprint.int().null().foreign({ on: User }),
                title       : Blueprint.varchar(100).notNull(),
                subtitle    : Blueprint.varchar(100).null(),
                description : Blueprint.varchar(255).null(),
                createdAt   : Blueprint.timestamp().null(),
                updatedAt   : Blueprint.timestamp().null(),
                deletedAt   : Blueprint.timestamp().null()
            },
            pattern
        }))
    }
}

export class PostUser extends Model {
    constructor() {
        super()
        this.usePattern(pattern)
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.useTableSingular()
       
        this.useSchema(Model.formatPattern({
            data : { 
                id          : Blueprint.int().notNull().primary().autoIncrement(),
                uuid        : Blueprint.varchar(50).null(),
                userId      : Blueprint.int().notNull().foreign({ on: User }),
                postId      : Blueprint.int().notNull().foreign({ on: Post }),
                createdAt   : Blueprint.timestamp().null(),
                updatedAt   : Blueprint.timestamp().null(),
                deletedAt   : Blueprint.timestamp().null()
            },
            pattern
        }))
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