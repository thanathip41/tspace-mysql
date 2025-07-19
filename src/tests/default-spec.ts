import { Model }  from '../lib'

export class User extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.hasMany({ model : Post , name : 'posts'  })
        this.hasOne({ model : Post , name : 'post' })
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
    }
}

export class PostUser extends Model {
    constructor() {
        super()
        this.useUUID()
        this.useTimestamp()
        this.useSoftDelete()
        this.useTableSingular()
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
