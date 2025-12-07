import "reflect-metadata";
import pluralize      from "pluralize";
import { Blueprint }  from "./Blueprint";
import type { 
  TRelationQueryOptionsDecorator 
} from "../types/decorator";
import type { 
  TPattern, 
  TValidateSchemaDecorator 
} from "../types";

export const REFLECT_META = {
  RELATIONS : {
    hasOne        : 'relation:hasOne',
    hasMany       : 'relation:hasMany',
    belongsTo     : 'relation:belongsTo',
    belongsToMany : 'relation:belongsToMany'
  },
  SCHEMA : 'model:schema',
  VALIDATE_SCHEMA : 'model:validateSchema',
  TABLE : 'model:table',
  UUID : {
    enabled: 'model:uuidEnabled',
    column : 'model:uuidColumn'
  },
  OBSERVER : 'model:observer',
  TIMESTAMP : {
    enabled: 'model:timestampEnabled',
    columns: 'model:timestampColumns'
  },
  SOFT_DELETE: {
    enabled: 'model:softDeleteEnabled',
    columns: 'model:softDeleteColumns'
  },
  PATTERN : 'model:pattern',
  HOOKS : 'model:hooks',
  TRANSFORM : 'model:transform',
  BEFORE : {
    INSERT : 'model:beforeInsert',
    UPDATE : 'model:beforeUpdate',
    REMOVE : 'model:beforeRemove'
  },
  AFTER : {
    INSERT : 'model:afterInsert',
    UPDATE : 'model:afterUpdate',
    REMOVE : 'model:afterRemove'
  }
}

/**
 * Decorator to mark a class with a database table name.
 *
 * Attaches the given table name to the class using Reflect metadata.
 * This can be retrieved later to map the class to the corresponding database table.
 *
 * @param {string} name - The name of the database table.
 * @returns {ClassDecorator} A class decorator that sets the table name metadata.
 *
 * @example
 * ```ts
 * @Table('users')
 * class User extends Model {}
 * ```
 */
export const Table = (name: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.TABLE, name, target);
  };
};

/**
 * Decorator to automatically generate a singular table name from a class name.
 *
 * Converts the class name from PascalCase to snake_case, then converts it to singular form.
 * The resulting table name is stored as metadata on the class.
 *
 * @returns {ClassDecorator} A class decorator that sets the singular table name metadata.
 *
 * @example
 * ```ts
 * @TableSingular()
 * class Users extends Model {}
 * ```
 */
export const TableSingular = (): ClassDecorator => {
  return (target) => {
    const name = target.name
      .replace(/([A-Z])/g, (str: string) => `_${str.toLowerCase()}`)
      .slice(1);

    const singular = pluralize.singular(name);

    Reflect.defineMetadata(REFLECT_META.TABLE, singular, target);
  };
};

/**
 * Decorator to automatically generate a plural table name from a class name.
 *
 * Converts the class name from PascalCase to snake_case, then converts it to plural form.
 * The resulting table name is stored as metadata on the class.
 *
 * @returns {ClassDecorator} A class decorator that sets the plural table name metadata.
 *
 * @example
 * ```ts
 * @TablePlural()
 * class User extends Model {}
 *
 * ```
 */
export const TablePlural = (): ClassDecorator => {
  return (target) => {
    const name = target.name
      .replace(/([A-Z])/g, (str: string) => `_${str.toLowerCase()}`)
      .slice(1);

    const plural = pluralize.plural(name);

    Reflect.defineMetadata(REFLECT_META.TABLE, plural, target);
  };
};

/**
 * Decorator to enable automatic UUID generation for a model.
 *
 * Stores metadata indicating UUID usage and optional column name.
 *
 * @param {string} [column] - Optional column name to store the UUID.
 * @returns {ClassDecorator} A class decorator that enables UUID metadata.
 *
 * @example
 * ```ts
 * @UUID('id')
 * class User extends Model {}
 * ```
 */
export const UUID = (column?: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.UUID.enabled, true, target);
    Reflect.defineMetadata(REFLECT_META.UUID.enabled, column, target);
  };
};

/**
 * Decorator to attach an observer class to a model.
 *
 * The observer class should have `selected`, `created`, `updated`, and `deleted` methods.
 *
 * @param {new () => { selected: Function; created: Function; updated: Function; deleted: Function }} observer - Observer class constructor.
 * @returns {ClassDecorator} A class decorator that sets the model observer.
 *
 * @example
 * ```ts
 * class UserObserver {
 *   selected() {}
 *   created() {}
 *   updated() {}
 *   deleted() {}
 * }
 *
 * @Observer(UserObserver)
 * class User extends Model {}
 * ```
 */
export const Observer = (observer: new () => {
  selected: Function;
  created: Function;
  updated: Function;
  deleted: Function;
}): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.OBSERVER, observer, target);
  };
};

/**
 * Decorator to enable automatic timestamps on a model.
 *
 * Stores metadata indicating that `createdAt` and `updatedAt` columns should be handled.
 *
 * @param {{ createdAt: string; updatedAt: string }} [columns] - Optional custom column names for timestamps.
 * @returns {ClassDecorator} A class decorator that enables timestamp metadata.
 *
 * @example
 * ```ts
 * @Timestamp({ createdAt: 'created_at', updatedAt: 'updated_at' })
 * class User extends Model {}
 * ```
 */
export const Timestamp = (columns?: { createdAt: string; updatedAt: string }): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.TIMESTAMP.enabled, true, target);
    Reflect.defineMetadata(REFLECT_META.TIMESTAMP.columns, columns, target);
  };
};

/**
 * Decorator to enable soft deletion on a model.
 *
 * Stores metadata indicating soft delete usage and optional column name.
 *
 * @param {string} [column] - Optional column name to track soft deletion.
 * @returns {ClassDecorator} A class decorator that enables soft delete metadata.
 *
 * @example
 * ```ts
 * @SoftDelete('deleted_at')
 * class User extends Model {}
 * ```
 */
export const SoftDelete = (column?: string): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.SOFT_DELETE.enabled, true, target);
    Reflect.defineMetadata(REFLECT_META.SOFT_DELETE.columns, column, target);
  };
};

/**
 * Decorator to set the naming pattern for a model.
 *
 * Can be `camelCase` or `snake_case`.
 *
 * @param {"camelCase" | "snake_case"} pattern - The naming convention to use.
 * @returns {ClassDecorator} A class decorator that sets the naming pattern metadata.
 *
 * @example
 * ```ts
 * @Pattern('snake_case')
 * class User extends Model {}
 * ```
 */
export const Pattern = (pattern: TPattern): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.PATTERN, pattern, target);
  };
};

/**
 * Decorator to set the model naming pattern to camelCase.
 *
 * @returns {ClassDecorator} A class decorator that sets camelCase naming metadata.
 *
 * @example
 * ```ts
 * @CamelCase()
 * class User extends Model {}
 * ```
 */
export const CamelCase = (): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.PATTERN, "camelCase", target);
  };
};

/**
 * Decorator to set the model naming pattern to snake_case.
 *
 * @returns {ClassDecorator} A class decorator that sets snake_case naming metadata.
 *
 * @example
 * ```ts
 * @SnakeCase()
 * class User extends Model {}
 * ```
 */
export const SnakeCase = (): ClassDecorator => {
  return (target) => {
    Reflect.defineMetadata(REFLECT_META.PATTERN, "snake_case", target);
  };
};

/**
 * Decorator to define a database column for a model property.
 *
 * Accepts a `Blueprint` function that defines the column type, constraints, and other attributes.
 * The resulting column schema is stored as metadata on the target class.
 *
 * @param {() => Blueprint} blueprint - A function returning a `Blueprint` instance describing the column.
 * @returns {Function} A property decorator that registers the column schema.
 *
 * @throws {Error} If the property name cannot be determined.
 *
 * @example
 * ```ts
 * class User extends Model {
 *
 *   @Column(() => Blueprint.int().notNull().primary().autoIncrement())
 *   public id!: number;
 *
 *   @Column(() => Blueprint.varchar(50).null())
 *   public uuid!: string;
 * }
 *
 * ```
 */
export const Column = (blueprint: () => Blueprint): Function => {
  return (target: Object, propertyKey: string) => {
    if (!propertyKey) {
      throw new Error("Unable to determine property name for Column decorator");
    }
    
    const schema = Reflect.getMetadata(REFLECT_META.SCHEMA, target) || {};

    Reflect.defineMetadata(REFLECT_META.SCHEMA, {
      ...schema,
      [propertyKey]: blueprint()
    }, target);
  };
};

/**
 * A decorator factory that registers custom `to` and `from` transform functions
 * for a property. Useful for serialization/deserialization logic (e.g. ORM, DTO).
 *
 * @param {Object} options - Transform options.
 * @param {(value: unknown) => any | Promise<any>} options.to - Function executed when transforming *to* database/output.
 * @param {(value: unknown) => any | Promise<any>} options.from - Function executed when transforming *from* database/input.
 * @returns {Function} A property decorator that stores transform metadata.
 *
 * @throws {Error} If the property name cannot be determined.
 *
 * @example
 * ```ts
 * class User {
 *   @Transform({
 *     to: (v) => JSON.stringify(v),
 *     from: (v) => JSON.parse(v),
 *   })
 *   profile;
 * }
 * ```
 */
export const Transform = ({ to , from } : {
  to : (value: unknown) => any | Promise<any>;
  from  : (value: unknown) => any | Promise<any>;
}): Function => {
  return (target: Object, propertyKey: string) => {
    if (!propertyKey) {
      throw new Error("Unable to determine property name for Transform decorator");
    }
    
    const schema = Reflect.getMetadata(REFLECT_META.TRANSFORM, target) || {};

    Reflect.defineMetadata(REFLECT_META.TRANSFORM, {
      ...schema,
      [propertyKey]: { to , from }
    }, target);
  };
};

/**
 * Decorator to attach validation rules to a model property.
 *
 * Accepts a `TValidateSchemaDecorator` object describing the validation rules
 * (e.g., type, required, length, regex match, uniqueness, or custom validation function).
 * The validation schema is stored as metadata on the target class.
 *
 * @param {TValidateSchemaDecorator} validate - An object defining validation rules for the property.
 * @returns {Function} A decorator that registers the validation schema.
 *
 * @example
 * ```ts
 * class User extends Model {
 *
 *   @Column(() => Blueprint.int().notNull().primary().autoIncrement())
 *   public id!: number;
 *
 *   @Column(() => Blueprint.varchar(50).null())
 *   public uuid!: string;
 *
 *   @Column(() => Blueprint.varchar(50).null())
 *   @Validate({
 *       type: String,
 *       require: true,
 *       length: 50,
 *       match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
 *       unique: true,
 *       fn: async (email: string) => {
 *         const exists = await new User().where('email',email).exists();
 *         if(exists) return `This column "${email}" is dupicate`;
 *         return null;
 *       }
 *   })
 *   public email!: string;
 * }
 *
 * ```
 */
export const Validate = (validate: TValidateSchemaDecorator): Function => {
  return (target: Object, propertyKey: string | symbol) => {
    const existing = Reflect.getMetadata(REFLECT_META.VALIDATE_SCHEMA, target) || {};

    Reflect.defineMetadata(REFLECT_META.VALIDATE_SCHEMA, { 
      ...existing, 
      [propertyKey]: validate 
    }, target);
  };
};

/**
 * Decorator to define a HasOne relationship on a model property.
 *
 * @param {TRelationQueryOptionsDecorator} options - Options describing the relation.
 * @returns {Function} A decorator that registers the HasOne relationship.
 *
 * @example
 * ```ts
 * class Profile extends Model {}
 *
 * class User extends Model {
 *   @HasOne({ model: Profile })
 *   public profile!: Profile;
 * }
 *
 * ```
 */
export const HasOne = (options: TRelationQueryOptionsDecorator): Function => {
  return (target: Object, propertyKey: string) => {
    if (!propertyKey) throw new Error("Unable to determine property name for HasOne decorator");

    const existing: TRelationQueryOptionsDecorator[] = Reflect.getMetadata(REFLECT_META.RELATIONS.hasOne, target) || [];

    Reflect.defineMetadata(
      REFLECT_META.RELATIONS.hasOne,
      [...existing, { ...options, name: options.name ?? propertyKey }],
      target
    );
  };
};

/**
 * Decorator to define a HasMany relationship on a model property.
 *
 * @param {TRelationQueryOptionsDecorator} options - Options describing the relation.
 * @returns {Function} A decorator that registers the HasMany relationship.
 *
 * @example
 * ```ts
 * class Post extends Model {}
 *
 * class User extends Model {
 *   @HasMany({ model: Post })
 *   public posts!: Post[];
 * }
 *
 * ```
 */
export const HasMany = (options: TRelationQueryOptionsDecorator): Function => {
  return (target: Object, propertyKey: string) => {
    if (!propertyKey) throw new Error("Unable to determine property name for HasMany decorator");

    const existing: TRelationQueryOptionsDecorator[] = Reflect.getMetadata(REFLECT_META.RELATIONS.hasMany, target) || [];

    Reflect.defineMetadata(
      REFLECT_META.RELATIONS.hasMany,
      [...existing, { ...options, name: options.name ?? propertyKey }],
      target
    );
  };
};

/**
 * Decorator to define a BelongsTo relationship on a model property.
 *
 * @param {TRelationQueryOptionsDecorator} options - Options describing the relation.
 * @returns {Function} A decorator that registers the BelongsTo relationship.
 *
 * @example
 * ```ts
 * class User extends Model {}
 *
 * class Post extends Model {
 *   @BelongsTo({ model: User })
 *   public author!: User;
 * }
 *
 * ```
 */
export const BelongsTo = (options: TRelationQueryOptionsDecorator): Function => {
  return (target: Object, propertyKey: string) => {
    if (!propertyKey) throw new Error("Unable to determine property name for BelongsTo decorator");

    const existing: TRelationQueryOptionsDecorator[] = Reflect.getMetadata(REFLECT_META.RELATIONS.belongsTo, target) || [];

    Reflect.defineMetadata(
      REFLECT_META.RELATIONS.belongsTo,
      [...existing, { ...options, name: options.name ?? propertyKey }],
      target
    );
  };
};

/**
 * Decorator to define a BelongsToMany (many-to-many) relationship on a model property.
 *
 * @param {TRelationQueryOptionsDecorator} options - Options describing the relation.
 * @returns {Function} A decorator that registers the BelongsToMany relationship.
 *
 * @example
 * ```ts
 * class Role extends Model {}
 *
 * class User extends Model {
 *   @BelongsToMany({ model: Role, pivotTable: 'user_roles' })
 *   public roles!: Role[];
 * }
 *
 * ```
 */
export const BelongsToMany = (options: TRelationQueryOptionsDecorator): Function => {
  return (target: Object, propertyKey: string) => {
    if (!propertyKey) throw new Error("Unable to determine property name for BelongsToMany decorator");

    const existing: TRelationQueryOptionsDecorator[] = Reflect.getMetadata(REFLECT_META.RELATIONS.belongsToMany, target) || [];

    Reflect.defineMetadata(
      REFLECT_META.RELATIONS.belongsToMany,
      [...existing, { ...options, name: options.name ?? propertyKey }],
      target
    );
  };
};

/**
 * Decorator that registers a method as a generic lifecycle hook.
 * Unlike specific hooks such as `@BeforeInsert` or `@AfterUpdate`,
 * this decorator is **multi-purpose** and collects all tagged methods
 * into a single metadata registry (`REFLECT_META.HOOKS`).
 *
 * These hook methods can later be invoked by the ORM/engine at any stage
 * depending on your custom logic.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-method class member.
 *
 * @example
 * ```ts
 * class User {
 *   @Hooks()
 *   logAction() {
 *     console.log("A lifecycle action happened");
 *   }
 * }
 * ```
 *
 * @example
 * // Later, your ORM engine could do:
 * const hooks = Reflect.getMetadata(REFLECT_META.HOOKS, userInstance) || [];
 * for (const hook of hooks) hook.call(userInstance);
 */
export const Hooks = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@Hooks() can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const hooks : Function[] = Reflect.getMetadata(REFLECT_META.HOOKS, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.HOOKS, [...hooks, original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};

/**
 * Decorator that registers a method to be executed **before an insert operation**.
 * Works similarly to TypeORM's `@BeforeInsert`.  
 *
 * The decorated method will be stored in metadata and executed later by the ORM engine.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-function member.
 *
 * @example
 * ```ts
 * class User {
 *   @BeforeInsert()
 *   setCreatedAt() {
 *     this.createdAt = new Date();
 *   }
 * }
 * ```
 */
export const BeforeInsert = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@BeforeInsert can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const existing: Function[] = Reflect.getMetadata(REFLECT_META.BEFORE.INSERT, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.BEFORE.INSERT, [...existing,original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};

/**
 * Decorator that registers a method to be executed **before an update operation**.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-function member.
 *
 * @example
 * ```ts
 * class User {
 *   @BeforeUpdate()
 *   updateTimestamp() {
 *     this.updatedAt = new Date();
 *   }
 * }
 * ```
 */
export const BeforeUpdate = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@BeforeUpdate can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const existing: Function[] = Reflect.getMetadata(REFLECT_META.BEFORE.UPDATE, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.BEFORE.UPDATE, [...existing,original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};

/**
 * Decorator that registers a method to be executed **before a remove/delete operation**.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-function member.
 *
 * @example
 * ```ts
 * class User {
 *   @BeforeRemove()
 *   handleBeforeDelete() {
 *     console.log("User will be deleted");
 *   }
 * }
 * ```
 */
export const BeforeRemove = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@BeforeRemove can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const existing: Function[] = Reflect.getMetadata(REFLECT_META.BEFORE.REMOVE, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.BEFORE.REMOVE, [...existing,original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};

/**
 * Decorator that registers a method to be executed **after an insert operation**.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-function member.
 *
 * @example
 * ```ts
 * class User {
 *   @AfterInsert()
 *   notifyCreated() {
 *     console.log("User inserted");
 *   }
 * }
 * ```
 */
export const AfterInsert = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@afterInsert can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const existing: Function[] = Reflect.getMetadata(REFLECT_META.AFTER.INSERT, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.AFTER.INSERT, [...existing,original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};

/**
 * Decorator that registers a method to be executed **after an update operation**.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-function member.
 *
 * @example
 * ```ts
 * class User {
 *   @AfterUpdate()
 *   logUpdate() {
 *     console.log("User updated");
 *   }
 * }
 * ```
 */
export const AfterUpdate = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@afterUpdate can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const existing: Function[] = Reflect.getMetadata(REFLECT_META.AFTER.UPDATE, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.AFTER.UPDATE, [...existing,original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};

/**
 * Decorator that registers a method to be executed **after a remove/delete operation**.
 *
 * @returns {Function} A method decorator.
 *
 * @throws {Error} If applied to a non-function member.
 *
 * @example
 * ```ts
 * class User {
 *   @AfterRemove()
 *   logDeletion() {
 *     console.log("User removed");
 *   }
 * }
 * ```
 */
export const AfterRemove = (): Function => { 

  return (target: Object, propertyKey: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)!;
    }

    if (typeof descriptor.value !== 'function') {
      throw new Error(`@afterRemove can only be applied to methods.`);
    }

    const original = descriptor.value as (...args: any[]) => any; 

    const existing: Function[] = Reflect.getMetadata(REFLECT_META.AFTER.REMOVE, target) || [];
    
    Reflect.defineMetadata(REFLECT_META.AFTER.REMOVE, [...existing,original], target);

    descriptor.value = function (this: any, ...args: any[]) {
      return original.apply(this, args);
    };

    return descriptor;
  }
};
