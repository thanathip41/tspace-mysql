import pluralize from "pluralize"
import { TRelationQueryOptions, TValidateSchemaDecorator } from "../types"
import { Blueprint } from "./Blueprint"

export const Table = (name : string) => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    constructor.prototype.$table = name
  }
}

export const TableSingular = () => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    const name = String(constructor.name).replace(/([A-Z])/g, ( str:string ) => `_${str.toLowerCase()}`).slice(1)
    constructor.prototype.$table = pluralize.singular(name)
  }
}

export const TablePlural = () => {
  return (constructor: Function) => {
    if(constructor.prototype == null) return
    const name = constructor.name.replace(/([A-Z])/g, ( str:string ) => `_${str.toLowerCase()}`).slice(1)
    constructor.prototype.$table =  pluralize.plural(name)
  }
}

export const Column = (blueprint: () => Blueprint) => {
  return (target: any, key: string) => {
    if(!(blueprint() instanceof Blueprint)) return
    if (target.$schema == null) target.$schema = {}
    target.$schema = {
      ...target.$schema,
      [key]: blueprint()
    }
  }
}

export const Validate = (validate : TValidateSchemaDecorator) => {
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
