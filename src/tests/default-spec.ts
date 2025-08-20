import { Blueprint, Model }  from '../lib'

export class User extends Model {
    constructor() {
        super()
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
            created_at : Blueprint.timestamp().null(),
            updated_at : Blueprint.timestamp().null(),
            deleted_at : Blueprint.timestamp().null(),
         })
    }
}

export class Post extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.belongsTo({ name : 'user' , model : User })
        this.belongsToMany({ name : 'subscribers' , model : User , modelPivot : PostUser })

        this.useSchema({
            id          : Blueprint.int().notNull().primary().autoIncrement(),
            uuid        : Blueprint.varchar(50).null(),
            user_id      : Blueprint.int().null().foreign({ on: User }),
            title       : Blueprint.varchar(100).notNull(),
            subtitle    : Blueprint.varchar(100).null(),
            description : Blueprint.varchar(255).null(),
            created_at : Blueprint.timestamp().null(),
            updated_at : Blueprint.timestamp().null(),
            deleted_at : Blueprint.timestamp().null(),
        })
    }
}

export class PostUser extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.useTableSingular()

        this.useSchema({
            id          : Blueprint.int().notNull().primary().autoIncrement(),
            uuid        : Blueprint.varchar(50).null(),
            user_id     : Blueprint.int().notNull().foreign({ on: User }),
            post_id     : Blueprint.int().notNull().foreign({ on: Post }),
            created_at  : Blueprint.timestamp().null(),
            updated_at  : Blueprint.timestamp().null(),
            deleted_at  : Blueprint.timestamp().null(),
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
      status : { anyOf: [{ type: 'boolean' }, { type: 'integer' } , { type: 'null' }] },
      created_at:  { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  ,{ type: 'null' }] },
      updated_at: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  , { type: 'null' }] },
      deleted_at: { anyOf: [{ type: 'string' }, { type: "object", format: "date" } , { type: 'null' }] },
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
      created_at:  { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  ,{ type: 'null' }] },
      updated_at: { anyOf: [{ type: 'string' }, { type: "object", format: "date" }  , { type: 'null' }] },
      deleted_at: { anyOf: [{ type: 'string' }, { type: "object", format: "date" } , { type: 'null' }] },
    }
}

export const postSchemaArray = {
    type: 'array',
    items : {
        ...postSchemaObject
    }
}
