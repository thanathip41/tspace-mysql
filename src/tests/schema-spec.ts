import { Blueprint, Model }  from '../../src/lib'

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
                id : new Blueprint().int().primary().autoIncrement(),
                uuid :new Blueprint().varchar(50).null(),
                email :new Blueprint().varchar(50).null(),
                name :new Blueprint().varchar(255).null(),
                username : new Blueprint().varchar(255).null(),
                password : new Blueprint().varchar(255).null(),
                createdAt :new Blueprint().timestamp().null(),
                updatedAt :new Blueprint().timestamp().null(),
                deletedAt :new Blueprint().timestamp().null(),
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
                id          : new Blueprint().int().notNull().primary().autoIncrement(),
                uuid        : new Blueprint().varchar(50).null(),
                userId      : new Blueprint().int().null(),
                title       : new Blueprint().varchar(100).notNull(),
                subtitle    : new Blueprint().varchar(100).null(),
                description : new Blueprint().varchar(255).null(),
                createdAt   : new Blueprint().timestamp().null(),
                updatedAt   : new Blueprint().timestamp().null(),
                deletedAt   : new Blueprint().timestamp().null()
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
                id          : new Blueprint().int().notNull().primary().autoIncrement(),
                uuid        : new Blueprint().varchar(50).null(),
                userId      : new Blueprint().int().notNull(),
                postId      : new Blueprint().int().notNull(),
                createdAt   : new Blueprint().timestamp().null(),
                updatedAt   : new Blueprint().timestamp().null(),
                deletedAt   : new Blueprint().timestamp().null()
            },
            pattern
        }))
    }
}

export class UserDefault extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.hasMany({ model : Post , name : 'posts'})
        this.hasOne({ model : Post , name : 'post' })
    }
}

export class PostDefault extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.belongsTo({ name : 'user' , model : User })
        this.belongsToMany({ name : 'subscribers' , model : User , modelPivot : PostUser })
    }
}

export class PostUserDefault extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useTableSingular()
        this.useTimestamp()
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
