import pluralize from "pluralize"
import { TRelationQueryOptions, TValidateSchemaDecorator } from "../types"
import { Blueprint } from "./Blueprint"

/**
 * 
 * @param   {string} name 
 * @returns {Function}
 * 
 * @example
 * 
 * @Table('users')
 * class User extends Model {}
 */
export const Table = (name : string): Function => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$table = name
  }
}

/**
 * 
 * @returns {Function}
 * 
 * @example
 * 
 * @TableSingular()
 * class User extends Model {}
 */
export const TableSingular = (): Function => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    const name = String(constructor.name).replace(/([A-Z])/g, ( str:string ) => `_${str.toLowerCase()}`).slice(1)
    constructor.prototype.$table = pluralize.singular(name)
  }
}

/**
 * 
 * @returns {Function}
 * 
 * @example
 * 
 * @TablePlural()
 * class User extends Model {}
 */
export const TablePlural = (): Function => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    const name = constructor.name.replace(/([A-Z])/g, ( str:string ) => `_${str.toLowerCase()}`).slice(1)
    constructor.prototype.$table =  pluralize.plural(name)
  }
}

/**
 * 
 * @param   {Blueprint}  blueprint
 * @returns {Function}
 * 
 * @example
 * 
 * class User extends Model {
 * 
 *   @Column(() => Blueprint.int().notNull().primary().autoIncrement())
 *   public id!: number
 * 
 *   @Column(() => Blueprint.varchar(50).null())
 *   public uuid!: string
 * }
 */
export const Column = (blueprint: () => Blueprint): Function => {
  return (target: any, key: string) => {
    if(!(blueprint() instanceof Blueprint)) return
    if (target.$schema == null) target.$schema = {}
    target.$schema = {
      ...target.$schema,
      [key]: blueprint()
    }
  }
}

/**
 * 
 * @param   {TValidateSchemaDecorator}  validate
 * @returns {Function}
 * 
 * @example
 * 
 * class User extends Model {
 * 
 *   @Column(() => Blueprint.int().notNull().primary().autoIncrement())
 *   public id!: number
 *    
 *   
 *   @Column(() => Blueprint.varchar(50).null())
 *   public uuid!: string
 * 
 *   @Column(() => Blueprint.varchar(50).null())
 *   @Validate({
 *         type : String,
 *         require : true,
 *         length : 50,
 *         match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
 *         unique : true,
 *         fn : (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
 *    })
 *    public email!: string
 * }
 */
export const Validate = (validate : TValidateSchemaDecorator): Function => {
  return (target: any, key: string) => {
    if (target.$validateSchema == null) target.$validateSchema = {}
    target.$validateSchema = {
      ...target.$validateSchema,
      [key]: validate
    }
  }
}

export const UUID = (column ?: string) => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$uuid = true
    constructor.prototype.$uuidColumn = column
  }
}

export const Observer = (observer: new () => {
  selected: Function
  created:  Function
  updated:  Function
  deleted:  Function
}) => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$observer = observer
  }
}

export const Timestamp = (timestampColumns ?: { createdAt : string , updatedAt : string }) => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$timestamp = true
    constructor.prototype.$timestampColumns = timestampColumns
  }
}

export const SoftDelete = (column ?: string) => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$softDelete = true
    constructor.prototype.$softDeleteColumn = column
  }
}

export const Pattern = (pattern : 'camelCase' | 'snake_case') => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$pattern = pattern
  }
}

export const CamelCase = () => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$pattern = 'camelCase'
  }
}

export const SnakeCase = () => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$pattern = 'snake_case'
  }
}

export const HasOne = ({ 
  name, 
  as, 
  model , 
  localKey, 
  foreignKey, 
  freezeTable 
} : TRelationQueryOptions ) => {
  return (target: any, key: string) => {
    
    if (target.$hasOne == null) target.$hasOne = []
    target.$hasOne.push({
      name : name == null ? key : name , 
      as , 
      model, 
      localKey, 
      foreignKey, 
      freezeTable
    })
  }
}

export const HasMany = ({ name , as , model  , localKey , foreignKey , freezeTable } : TRelationQueryOptions ) => {
  return (target: any, key: string) => {
    
    if (target.$hasMany == null) target.$hasMany = []
    target.$hasMany.push({
      name : name == null ? key : name , 
      as , 
      model, 
      localKey, 
      foreignKey, 
      freezeTable
    })
  }
}

export const BelongsTo = ({ 
  name , 
  as , 
  model  , 
  localKey , 
  foreignKey , 
  freezeTable 
} : TRelationQueryOptions ) => {
  return (target : any, key: string) => {
    if (target.$belongsTo == null) target.$belongsTo = []

    target.$belongsTo.push({
      name : name == null ? key : name , 
      as , 
      model, 
      localKey, 
      foreignKey, 
      freezeTable
    })
  }
}

export const BelongsToMany = ({ 
  name, 
  as, 
  model, 
  localKey, 
  foreignKey, 
  freezeTable, 
  pivot, 
  oldVersion, 
  modelPivot 
} : TRelationQueryOptions ) => {
  return (target: any, key: string) => {
    if (target.$belongsToMany == null) target.$belongsToMany = []
    target.$belongsToMany.push({
      name : name == null ? key : name , 
      as, 
      model, 
      localKey, 
      foreignKey, 
      freezeTable,
      pivot, 
      oldVersion, 
      modelPivot
    })
  }
}
