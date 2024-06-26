import { AbstractModel } from './Abstracts/AbstractModel';
import { Blueprint } from './Blueprint';
import { TSchemaModel } from './UtilityTypes';
import { Cache } from './Cache';
import { TRelationOptions, TPagination, TRelationQueryOptions, TValidateSchema, TGlobalSetting, TRawStringQuery, TFreezeStringQuery, TPattern } from '../types';
/**
 *
 * 'Model' class is a representation of a database table
 * @generic {Type} TS
 * @generic {Type} TR
 * @example
 * import { Model, Blueprint , TSchema , TRelation } from 'tspace-mysql'
 *
 * const schema = {
 *   id    : new Blueprint().int().primary().autoIncrement(),
 *   uuid  : new Blueprint().varchar(50).null(),
 *   email : new Blueprint().varchar(50).null(),
 *   name  : new Blueprint().varchar(255).null(),
 * }
 *
 * type TS = TSchema<typeof schema>
 * type TR = TRelation<{}>
 *
 * class User extends Model<TS,TR> {
 *     ...........configration
 * }
 *
 * const users = await new User().findMany()
 * console.log(users)
 */
declare class Model<TS extends Record<string, any> = any, TR = unknown> extends AbstractModel<TS, TR> {
    protected $cache: Cache;
    constructor($cache?: Cache);
    /**
     * The 'global' method is used setting global variables in models.
     * @static
     * @param {GlobalSetting} settings
     * @example
     * Model.global({
     *   softDelete : true,
     *   uuid       : true,
     *   timestamp  : true,
     *   debug      : true
     *   logger     : {
     *       selected : true,
     *       inserted : true,
     *       updated  : true,
     *       deleted  : true
     *   },
     * })
     * @returns {void} void
     */
    static global(settings: TGlobalSetting): void;
    /**
     * The 'column' method is used keyof column in schema.
     * @param {string} column
     * @example
     * import { User } from '../User'
     * Model.column<User>('id')
     * @returns {string} column
     */
    static column<T extends Model>(column: keyof TSchemaModel<T> | `${string}.${string}`): string;
    /**
     * The 'formatPattern' method is used to change the format of the pattern.
     * @param {object} data { data , pattern }
     * @property {Record | string} data
     * @property {string} parttern
     * @returns {Record | string} T
     */
    static formatPattern<T extends Record<string, any> | string>({ data, pattern }: {
        data: T;
        pattern: TPattern;
    }): T;
    /**
     * The 'instance' method is used get instance.
     * @override
     * @static
     * @returns {Model} instance of the Model
     */
    static get instance(): Model;
    /**
     * The 'globalScope' method is a feature that allows you to apply query constraints to all queries for a given model.
     *
     * @example
     *  class User extends Model {
     *     constructor() {
     *      super()
     *      this.globalScope(query => {
     *           return query.where('id' , '>' , 10)
     *      })
     *   }
     *  }
     * @returns {void} void
     */
    protected globalScope<T extends Model>(callback: (query: T) => T): this;
    /**
     * The 'define' method is a special method that you can define within a model.
     * @example
     *  class User extends Model {
     *     define() {
     *       this.useUUID()
     *       this.usePrimaryKey('id')
     *       this.useTimestamp()
     *       this.useSoftDelete()
     *     }
     *  }
     * @returns {void} void
     */
    protected define(): void;
    /**
     *  The 'boot' method is a special method that you can define within a model.
     *  @example
     *  class User extends Model {
     *     boot() {
     *       this.useUUID()
     *       this.usePrimaryKey('id')
     *       this.useTimestamp()
     *       this.useSoftDelete()
     *     }
     *  }
     * @returns {void} void
     */
    protected boot(): void;
    /**
     * The "useObserve" method is used to pattern refers to a way of handling model events using observer classes.
     * Model events are triggered when certain actions occur on models,
     * such as creating, updating, deleting, or saving a record.
     *
     * Observers are used to encapsulate the event-handling logic for these events,
     * keeping the logic separate from the model itself and promoting cleaner, more maintainable code.
     * @param {Function} observer
     * @returns this
     * @example
     *
     * class UserObserve {
     *    public selected(results : unknown) {
     *       console.log({ results , selected : true })
     *    }
     *
     *    public created(results : unknown) {
     *       console.log({ results , created : true })
     *    }
     *
     *    public updated(results : unknown) {
     *       console.log({ results ,updated : true })
     *    }
     *
     *    public deleted(results : unknown) {
     *       console.log({ results ,deleted : true })
     *    }
     *   }
     *
     *   class User extends Model {
     *      constructor() {
     *          super()
     *          this.useObserver(UserObserve)
     *      }
     *   }
     */
    protected useObserver(observer: new () => {
        selected: Function;
        created: Function;
        updated: Function;
        deleted: Function;
    }): this;
    /**
    * The "useLogger" method is used to keeping query data and changed in models.
    *
    * @type     {object}  options
    * @property {boolean} options.selected - default is false
    * @property {boolean} options.inserted - default is true
    * @property {boolean} options.updated  - default is true
    * @property {boolean} options.deleted  - default is true
    * @example
    * class User extends Model {
    *     constructor() {
    *        super()
    *        this.useLogger({
    *          selected : true,
    *          inserted : true,
    *          updated  : true,
    *          deleted  : true,
    *       })
    *   }
    * }
    * @returns {this} this
    */
    protected useLogger({ selected, inserted, updated, deleted }?: {
        selected?: boolean | undefined;
        inserted?: boolean | undefined;
        updated?: boolean | undefined;
        deleted?: boolean | undefined;
    }): this;
    /**
     * The "useSchema" method is used to define the schema.
     *
     * It's automatically create, called when not exists table or columns.
     * @param {object} schema using Blueprint for schema
     * @example
     * import { Blueprint } from 'tspace-mysql';
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useSchema ({
     *            id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *            uuid        : new Blueprint().varchar(50).null(),
     *            email       : new Blueprint().varchar(50).null(),
     *            name        : new Blueprint().varchar(255).null(),
     *            created_at  : new Blueprint().timestamp().null(),
     *            updated_at  : new Blueprint().timestamp().null()
     *         })
     *     }
     * }
     * @returns {this} this
     */
    protected useSchema(schema: Record<string, Blueprint>): this;
    /**
     *
     * The "useRegistry" method is used to define Function to results.
     *
     * It's automatically given Function to results.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useRegistry()
     *     }
     * }
     */
    protected useRegistry(): this;
    /**
     * The "useLoadRelationsInRegistry" method is used automatically called relations in your registry Model.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useLoadRelationInRegistry()
     *     }
     * }
     */
    protected useLoadRelationsInRegistry(): this;
    /**
     * The "useBuiltInRelationFunctions" method is used to define the function.
     *
     * It's automatically given built-in relation functions to a results.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useBuiltInRelationsFunction()
     *     }
     * }
     */
    protected useBuiltInRelationFunctions(): this;
    /**
     * The "usePrimaryKey" method is add primary keys for database tables.
     *
     * @param {string} primary
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.usePrimaryKey()
     *     }
     * }
     */
    protected usePrimaryKey(primary: string): this;
    /**
     * The "useUUID" method is a concept of using UUIDs (Universally Unique Identifiers) as column 'uuid' in table.
     *
     * It's automatically genarate when created a result.
     * @param {string?} column [column=uuid] make new name column for custom column replace uuid with this
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useUUID()
     *     }
     * }
     */
    protected useUUID(column?: string): this;
    /**
     * The "useDebug" method is viewer raw-sql logs when excute the results.
     * @returns {this} this
     */
    protected useDebug(): this;
    /**
     * The "usePattern" method is used to assign pattern [snake_case , camelCase].
     * @param  {string} pattern
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.usePattern('camelCase')
     *     }
     * }
     */
    protected usePattern(pattern: "snake_case" | "camelCase"): this;
    /**
     * The "useCamelCase" method is used to assign pattern camelCase.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useCamelCase()
     *     }
     * }
     */
    protected useCamelCase(): this;
    /**
     * The "SnakeCase" method is used to assign pattern snake_case.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.SnakeCase()
     *     }
     * }
     */
    protected useSnakeCase(): this;
    /**
     * The "useSoftDelete" refer to a feature that allows you to "soft delete" records from a database table instead of permanently deleting them.
     *
     * Soft deleting means that the records are not physically removed from the database but are instead marked as deleted by setting a timestamp in a dedicated column.
     *
     * This feature is particularly useful when you want to retain a record of deleted data and potentially recover it later,
     * or when you want to maintain referential integrity in your database
     * @param {string?} column default deleted_at
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useSoftDelete('deletedAt')
     *     }
     * }
     */
    protected useSoftDelete(column?: string): this;
    /**
     * The "useTimestamp" method is used to assign a timestamp when creating a new record,
     * or updating a record.
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change new name column replace by default [created at]
     * @property {string} timestampFormat.updatedAt - change new name column replace by default updated at
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTimestamp({
     *           createdAt : 'createdAt',
     *           updatedAt : 'updatedAt'
     *        })
     *     }
     * }
     */
    protected useTimestamp(timestampFormat?: {
        createdAt: string;
        updatedAt: string;
    }): this;
    /**
     * This "useTable" method is used to assign the name of the table.
     * @param {string} table table name in database
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTable('setTableNameIsUser') // => 'setTableNameIsUser'
     *     }
     * }
     */
    protected useTable(table: string): this;
    /**
     * This "useTableSingular" method is used to assign the name of the table with signgular pattern.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTableSingular() // => 'user'
     *     }
     * }
     */
    protected useTableSingular(): this;
    /**
     * This "useTablePlural " method is used to assign the name of the table with pluarl pattern
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTablePlural() // => 'users'
     *     }
     * }
     */
    protected useTablePlural(): this;
    /**
     * This 'useValidationSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @returns {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useValidationSchema({
     *      id : Number,
     *       uuid :  Number,
     *       name : {
     *           type : String,
     *           require : true
     *           // json : true,
     *           // enum : ["1","2","3"]
     *      },
     *      email : {
     *           type : String,
     *           require : true,
     *           length : 199,
     *           match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
     *           unique : true,
     *           fn : async (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
     *       },
     *       createdAt : Date,
     *       updatedAt : Date,
     *       deletedAt : Date
     *    })
     *  }
     * }
     */
    protected useValidationSchema(schema?: TValidateSchema): this;
    /**
     * This 'useValidateSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @returns {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useValidationSchema({
     *       id : Number,
     *       uuid :  string,
     *       name : {
     *           type : String,
     *           require : true
     *      },
     *      email : {
     *           type : String,
     *           require : true,
     *           length : 199,
     *           // json : true,
     *           // enum : ["1","2","3"]
     *           match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
     *           unique : true,
     *           fn : async (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
     *       },
     *       createdAt : Date,
     *       updatedAt : Date,
     *       deletedAt : Date
     *    })
     *  }
     * }
     */
    protected useValidateSchema(schema?: TValidateSchema): this;
    /**
     * The "useHooks" method is used to assign hook function when execute returned results to callback function.
     * @param {Function[]} arrayFunctions functions for callback result
     * @returns {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useHook([(results) => console.log(results)])
     *   }
     * }
    */
    protected useHooks(arrayFunctions: Function[]): this;
    /**
     * The "beforeCreatingTable" method is used exection function when creating the table.
     * @param {Function} fn functions for executing before creating the table
     * @returns {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.beforeCreatingTable(async () => {
     *         await new User()
     *          .create({
     *            ...columns
     *          })
     *          .save()
     *      })
     *   }
     * }
    */
    protected beforeCreatingTable(fn: () => Promise<any>): this;
    /**
     * exceptColumns for method except
     * @override
     * @returns {promise<string>} string
     */
    protected exceptColumns(): Promise<string[]>;
    /**
     * Build  method for relation in model
     * @param    {string} name name relation registry in your model
     * @param    {Function} callback query callback
     * @returns   {this}   this
     */
    protected buildMethodRelation<K extends TR extends object ? keyof TR : string>(name: K, callback?: Function): this;
    meta(meta: 'MAIN' | 'SUBORDINATE'): this;
    /**
     * The 'typeOfSchema' method is used get type of schema.
     * @returns {TS} type of schema
     */
    typeOfSchema(): TS;
    /**
     * The 'typeOfRelation' method is used get type of relation.
     * @returns {TR} type of Relation
     */
    typeOfRelation(): TR;
    /**
     * The 'cache' method is used get data from cache.
     * @param {Object}  object
     * @property {string} key key of cache
     * @property {number} expires ms
     * @returns {this} this
     */
    cache({ key, expires }: {
        key: string;
        expires: number;
    }): this;
    /**
     *
     * @override
     * @param {string[]} ...columns
     * @returns {this} this
     */
    select<K extends Extract<keyof TS, string> | `${string}.${string}` | TRawStringQuery | '*'>(...columns: K[]): this;
    /**
     *
     * @override
     * @param {...string} columns
     * @returns {this} this
     */
    hidden<K extends Extract<keyof TS, string>>(...columns: K[]): this;
    /**
     *
     * @override
     * @param {...string} columns
     * @returns {this} this
     */
    except<K extends Extract<keyof TS, string> | `${string}.${string}`>(...columns: K[]): this;
    /**
     *
     * @override
     * @returns {this} this
     */
    exceptTimestamp(): this;
    /**
     *
     * @override
     * @param {string} column
     * @param {string?} order by default order = 'asc' but you can used 'asc' or  'desc'
     * @returns {this}
     */
    orderBy<K extends Extract<keyof TS, string> | `${string}.${string}`>(column: K, order?: 'ASC' | 'asc' | 'DESC' | 'desc'): this;
    /**
     *
     * @override
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    latest<K extends Extract<keyof TS, string> | `${string}.${string}`>(...columns: K[]): this;
    /**
     *
     * @override
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    oldest<K extends Extract<keyof TS, string> | `${string}.${string}`>(...columns: K[]): this;
    /**
     *
     * @override
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    groupBy<K extends Extract<keyof TS, string> | `${string}.${string}`>(...columns: K[]): this;
    /**
     * @override
     * @param {string} column
     * @returns {string} return table.column
     */
    bindColumn(column: string, pattern?: boolean): string;
    /**
     *
     * @override
     * The 'makeSelectStatement' method is used to make select statement.
     * @returns {Promise<string>} string
     */
    makeSelectStatement(): Promise<string>;
    /**
     *
     * @override
     * The 'makeInsertStatement' method is used to make insert table statement.
     * @returns {Promise<string>} string
     */
    makeInsertStatement(): Promise<string>;
    /**
     *
     * @override
     * The 'makeUpdateStatement' method is used to make update table statement.
     * @returns {Promise<string>} string
     */
    makeUpdateStatement(): Promise<string>;
    /**
     *
     * @override
     * The 'makeDeleteStatement' method is used to make delete statement.
     * @returns {Promise<string>} string
     */
    makeDeleteStatement(): Promise<string>;
    /**
     *
     * @override
     * The 'makeCreateTableStatement' method is used to make create table statement.
     * @returns {Promise<string>} string
     */
    makeCreateTableStatement(): Promise<string>;
    /**
     *
     * Clone instance of model
     * @param {Model} instance instance of model
     * @returns {this} this
     */
    clone(instance: Model): this;
    /**
     *
     * Copy an instance of model
     * @param {Model} instance instance of model
     * @param {Object} options keep data
     * @returns {Model} Model
     */
    copyModel(instance: Model, options?: {
        update?: boolean;
        insert?: boolean;
        delete?: boolean;
        where?: boolean;
        limit?: boolean;
        orderBy?: boolean;
        join?: boolean;
        offset?: boolean;
        groupBy?: boolean;
        select?: boolean;
        having?: boolean;
        relations?: boolean;
    }): Model;
    /**
     *
     * execute the query using raw sql syntax
     * @override
     * @param {string} sql
     * @returns {this} this
     */
    protected _queryStatement(sql: string, { retry }?: {
        retry?: boolean | undefined;
    }): Promise<any[]>;
    /**
     *
     * execute the query using raw sql syntax actions for insert update and delete
     * @override
     * @param {Object} actions
     * @property {Function} actions.sqlresult
     * @property {Function} actions.returnId
     * @returns {this} this
     */
    protected _actionStatement({ sql, returnId }: {
        sql: string;
        returnId?: boolean;
    }): Promise<any>;
    /**
     * The 'table' method is used to set the table name.
     *
     * @param {string} table table name
     * @returns {this} this
     */
    table(table: string): this;
    /**
     * The 'from' method is used to set the table name.
     *
     * @param {string} table table name
     * @returns {this} this
     */
    from(table: string): this;
    /**
     * The 'disableSoftDelete' method is used to disable the soft delete.
     *
     * @param {boolean} condition
     * @returns {this} this
     */
    disableSoftDelete(condition?: boolean): this;
    /**
    * The 'ignoreSoftDelete' method is used to disable the soft delete.
     * @param {boolean} condition
     * @returns {this} this
     */
    ignoreSoftDelete(condition?: boolean): this;
    /**
     * The 'disableVoid' method is used to disable void.
     *
     * @returns {this} this
     */
    disableVoid(): this;
    /**
     * The 'ignoreVoid' method is used to ignore void.
     *
     * @returns {this} this
     */
    ignoreVoid(): this;
    /**
     * The 'disabledGlobalScope' method is used to disable globalScope.
     *
     * @returns {this} this
     */
    disabledGlobalScope(condition?: boolean): this;
    /**
     * The 'ignoreGlobalScope' method is used to disable globalScope.
     *
     * @returns {this} this
     */
    ignoreGlobalScope(condition?: boolean): this;
    /**
     * Assign build in function to result of data
     * @param {Record} func
     * @returns {this} this
     */
    registry(func: Record<string, Function>): this;
    /**
     * The 'with' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @returns {this} this
     * @example
     *   import { Model , TR } from 'tspace-mysql'
     *
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use 'with' for results of relationship
     *  await new User().with('posts').findMany()
     *
     */
    with<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'relations' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @returns {this} this
     * @example
     *   import { Model , TR } from 'tspace-mysql'
     *
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use 'with' for results of relationship
     *  await new User().relations('posts').findMany()
     *
     */
    relations<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method ignore soft delete
     * @param {...string} nameRelations if data exists return empty
     * @returns {this} this
     */
    withAll<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'relationsAll' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * It's method ignore soft delete
     * @param {...string} nameRelations if data exists return empty
     * @returns {this} this
     */
    relationsAll<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'withCount' method is used to eager load related (relations) data and count data in the relation.
     *
     * @param {...string} nameRelations if data exists return 0
     * @returns {this} this
     */
    withCount<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'relationsCount' method is used to eager load related (relations) data and count data in the relation.
     *
     * @param {...string} nameRelations if data exists return 0
     * @returns {this} this
     */
    relationsCount<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'withTrashed' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * It's method return results only in trash (soft deleted)
     * @param {...string} nameRelations if data exists return blank
     * @returns {this} this
     */
    withTrashed<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'relationsTrashed' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * It's method return results only in trash (soft deleted)
     * @param {...string} nameRelations if data exists return blank
     * @returns {this} this
     */
    relationsTrashed<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'withExists' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { pattern } from '../../tests/schema-spec';
     *   import { TRelationOptions } from '../types';
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().withExists('posts').findMany()
     */
    withExists<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'relationsExists' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     * import utils from '../utils/index';
     *   import { TRelationOptions } from '../types';
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().relationsExists('posts').findMany()
     */
    relationsExists<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'has' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { TRelationOptions } from '../types';
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().has('posts').findMany()
     */
    has<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'withNotExists' method is used to eager load related (relations)  data when not exists relation from a database.
     *
     * It's method return only not exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { pattern } from '../../tests/schema-spec';
     *   import { TRelationOptions } from '../types';
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().withNotExists('posts').findMany()
     */
    withNotExists<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     * The 'relationsNotExists' method is used to eager load related (relations)  data when not exists relation from a database.
     *
     * It's method return only not exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { pattern } from '../../tests/schema-spec';
     *   import { TRelationOptions } from '../types';
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().relationsNotExists('posts').findMany()
     */
    relationsNotExists<K extends TR extends object ? keyof TR : string>(...nameRelations: K[]): this;
    /**
     *
     * The 'withQuery' method is particularly useful when you want to filter or add conditions records based on related data.
     *
     * Use relation '${name}' registry models then return callback queries
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @param {object} options pivot the query
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *
     *   class Comment extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'users' , model : User })
     *           this.belongsTo({ name : 'post' , model : Post })
     *       }
     *   }
     *
     *   await new User().relations('posts')
     *   .withQuery('posts', (query : Post) => {
     *       return query.relations('comments','user')
     *       .withQuery('comments', (query : Comment) => {
     *           return query.relations('user','post')
     *       })
     *       .withQuery('user', (query : User) => {
     *           return query.relations('posts').withQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @returns {this} this
     */
    withQuery<K extends TR extends object ? keyof TR : string, M extends Model>(nameRelation: K, callback: (query: M) => M, options?: {
        pivot: boolean;
    }): this;
    /**
     *
     * The 'relationQuery' method is particularly useful when you want to filter or add conditions records based on related data.
     *
     * Use relation '${name}' registry models then return callback queries
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @param {object} options pivot the query
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *
     *   class Comment extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'users' , model : User })
     *           this.belongsTo({ name : 'post' , model : Post })
     *       }
     *   }
     *
     *   await new User().relations('posts')
     *   .relationQuery('posts', (query : Post) => {
     *       return query.relations('comments','user')
     *       .relationQuery('comments', (query : Comment) => {
     *           return query.relations('user','post')
     *       })
     *       .relationQuery('user', (query : User) => {
     *           return query.relations('posts').relationsQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @returns {this} this
     */
    relationQuery<K extends TR extends object ? keyof TR : string, T extends Model>(nameRelation: K, callback: (query: T) => T, options?: {
        pivot: boolean;
    }): this;
    /**
     *
     * The 'findWithQuery' method is used to find instance call back from relation.
     *
     * @param {string} name name relation in registry in your model
     * @returns {Model} model instance
     */
    findWithQuery<K extends TR extends object ? keyof TR : string>(name: K): Model | null;
    /**
     * The 'hasOne' relationship defines a one-to-one relationship between two database tables.
     *
     * It indicates that a particular record in the primary table is associated with one and only one record in the related table.
     *
     * This is typically used when you have a foreign key in the related table that references the primary table.
     *
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @returns  {this}   this
     */
    protected hasOne<K extends TR extends object ? keyof TR : string>({ name, as, model, localKey, foreignKey, freezeTable }: TRelationOptions<K>): this;
    /**
     * The 'hasMany' relationship defines a one-to-many relationship between two database tables.
     *
     * It indicates that a record in the primary table can be associated with multiple records in the related table.
     *
     * This is typically used when you have a foreign key in the related table that references the primary table.
     *
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @returns   {this}   this
     */
    protected hasMany<K extends TR extends object ? keyof TR : string>({ name, as, model, localKey, foreignKey, freezeTable }: TRelationOptions<K>): this;
    /**
     * The 'belongsTo' relationship defines a one-to-one or many-to-one relationship between two database tables.
     *
     * It indicates that a record in the related table belongs to a single record in the primary table.
     *
     * This is typically used when you have a foreign key in the primary table that references the related table.
     *
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @returns   {this}   this
     */
    protected belongsTo<K extends TR extends object ? keyof TR : string>({ name, as, model, localKey, foreignKey, freezeTable }: TRelationOptions<K>): this;
    /**
     * The 'belongsToMany' relationship defines a many-to-many relationship between two database tables.
     *
     * It indicates that records in both the primary table and the related table can be associated
     * with multiple records in each other's table through an intermediate table.
     *
     * This is commonly used when you have a many-to-many relationship between entities, such as users and roles or products and categories.
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable freeae table name
     * @property {string} relation.pivot table name of pivot
     * @property {string} relation.oldVersion return value of old version
     * @property {class?} relation.modelPivot model for pivot
     * @returns  {this}   this
     */
    protected belongsToMany<K extends TR extends object ? keyof TR : string>({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }: TRelationOptions<K>): this;
    /**
     * The 'hasOneBuilder' method is useful for creating 'hasOne' relationship to function
     *
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}   model
     * @property {string?} name
     * @property {string?} as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {Function?} callback callback of query
     * @returns  {this} this
     */
    protected hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable }: TRelationQueryOptions, callback?: Function): this;
    /**
     * The 'hasManyBuilder' method is useful for creating 'hasMany' relationship to function
     *
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}   model
     * @property {string?} name
     * @property {string?} as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @returns  {this} this
     */
    protected hasManyBuilder({ name, as, model, localKey, foreignKey, freezeTable }: TRelationQueryOptions, callback?: Function): this;
    /**
     * The 'belongsToBuilder' method is useful for creating 'belongsTo' relationship to function
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}   model
     * @property {string?} name
     * @property {string?} as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @returns  {this} this
     */
    protected belongsToBuilder({ name, as, model, localKey, foreignKey, freezeTable }: TRelationQueryOptions, callback?: Function): this;
    /**
     * The 'belongsToManyBuilder' method is useful for creating 'belongsToMany' relationship to function
     *
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}   model
     * @property {string?} name
     * @property {string?} as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @returns  {this} this
     */
    protected belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }: TRelationQueryOptions, callback?: Function): this;
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @returns {this} this
     */
    onlyTrashed(): this;
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @returns {this} this
     */
    trashed(): this;
    /**
     * restore data in trashed
     * @returns {promise}
     */
    restore(): Promise<TS[]>;
    /**
     *
     * @returns {string} string
     */
    toTableName(): string;
    /**
     *
     * @param {string} column
     * @returns {string} string
     */
    toTableNameAndColumn(column: string): string;
    /**
     * @override
     * @param {string | K} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this} this
     */
    where<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K | Record<string, any>, operator?: any, value?: any): this;
    /**
     * @override
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    orWhere<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, operator?: any, value?: any): this;
    /**
     * @override
     * @param {string} column
     * @param {number} day
     * @returns {this}
     */
    whereDay<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, day: number): this;
    /**
     * @override
     * @param {string} column
     * @param {number} month
     * @returns {this}
     */
    whereMonth<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, month: number): this;
    /**
     * @override
     * @param {string} column
     * @param {number} year
     * @returns {this}
     */
    whereYear<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, year: number): this;
    /**
     * @override
     * @param {Object} columns
     * @returns {this}
     */
    whereObject<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(columns: K extends keyof TS ? {
        [P in K]: TS[K];
    } : {
        [P in K]: any;
    }): this;
    /**
    * @override
    * @param    {string} column
    * @param    {object}  property object { key , value , operator }
    * @property {string}  property.key
    * @property {string}  property.value
    * @property {string?} property.operator
    * @returns   {this}
    */
    whereJSON<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, { key, value, operator }: {
        key: string;
        value: string;
        operator?: string;
    }): this;
    /**
     * @override
     * @param    {string} column
     * @param    {object}  property object { key , value , operator }
     * @property {string}  property.key
     * @property {string}  property.value
     * @property {string?} property.operator
     * @returns   {this}
     */
    whereJson<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, { key, value, operator }: {
        key: string;
        value: string;
        operator?: string;
    }): this;
    /**
     * @override
     * @param {number} userId
     * @param {string?} column custom it *if column is not user_id
     * @returns {this}
     */
    whereUser(userId: number, column?: string): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereIn<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereIn<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereNotIn<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereNotIn<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    whereSubQuery<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, subQuery: string): this;
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    whereNotSubQuery<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, subQuery: string): this;
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    orWhereSubQuery<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, subQuery: string): this;
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    orWhereNotSubQuery<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, subQuery: string): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereBetween<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereBetween<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereNotBetween<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereNotBetween<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, array: any[]): this;
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    whereNull<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K): this;
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    orWhereNull<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K): this;
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    whereNotNull<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K): this;
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    orWhereNotNull<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K): this;
    /**
     * @override
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    whereSensitive<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, operator?: any, value?: any): this;
    /**
     * @override
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    whereStrict<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, operator?: any, value?: any): this;
    /**
     * @override
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    orWhereSensitive<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(column: K, operator?: any, value?: any): this;
    /**
     * @override
     * @param {Function} callback callback query
     * @returns {this}
     */
    whereQuery<T extends Model>(callback: (query: T) => T): this;
    /**
     * @override
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    whereAny<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(columns: K[], operator?: any, value?: any): this;
    /**
     * The 'whereAll' method is used to clause to a database query.
     *
     * This method allows you to specify conditions that the retrieved records must meet.
     *
     * If has only 2 arguments default operator '='
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    whereAll<K extends keyof TS | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery>(columns: K[], operator?: any, value?: any): this;
    /**
     * @override
     * @returns {promise<boolean>} promise boolean
     */
    delete(): Promise<boolean>;
    /**
     * @override
     * @returns {promise<boolean>} promise boolean
     */
    deleteMany(): Promise<boolean>;
    /**
     *
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one or more records that match certain criteria.
     *
     * This method should be ignore the soft delete
     * @returns {promise<boolean>}
     */
    forceDelete(): Promise<boolean>;
    /**
     *
     * @override
     * @returns {string} return sql query
     */
    toString({ latest, oldest }?: {
        latest?: boolean | undefined;
        oldest?: boolean | undefined;
    }): string;
    /**
     *
     * @override
     * @returns {string} return sql query
     */
    toSQL({ latest, oldest }?: {
        latest?: boolean | undefined;
        oldest?: boolean | undefined;
    }): string;
    /**
     * @override
     * @param {string=} column [column=id]
     * @returns {promise<Array>}
     */
    toArray<K extends Extract<keyof TS, string> | 'id'>(column?: K): Promise<any[]>;
    /**
     *
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<Record<string,any> | null>} Record | null
    */
    first<K>(cb?: Function): Promise<TS & K & Partial<TR extends any ? TS & Partial<TR> : TR> | null>;
    /**
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<Record<string,any> | null>} Record | null
    */
    findOne<K>(cb?: Function): Promise<Partial<TS> & K & Partial<TR> | null>;
    /**
     * @override
     * @returns {promise<object | Error>} Record | throw error
    */
    firstOrError<K>(message?: string, options?: Record<string, any>): Promise<TS & K & Partial<TR>>;
    /**
     *
     * @override
     * @returns {promise<any>} Record | throw error
    */
    findOneOrError<K>(message: string, options?: Record<string, any>): Promise<Partial<TS> & K & Partial<TR>>;
    /**
     *
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<array>} Array
    */
    get<K>(cb?: Function): Promise<(TS & K & Partial<TR>)[]>;
    /**
     *
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<array>} Array
    */
    findMany<K>(cb?: Function): Promise<Partial<(TS & K & Partial<TR>)>[]>;
    /**
     * @override
     * @param {object?} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @returns {promise<Pagination>} Pagination
     */
    pagination<K>(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<TPagination<Partial<(TS & K & Partial<TR>)>[]>>;
    /**
    *
    * @override
    * @param    {?object} paginationOptions by default page = 1 , limit = 15
    * @property {number}  paginationOptions.limit
    * @property {number}  paginationOptions.page
    * @returns   {promise<Pagination>} Pagination
    */
    paginate<K>(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<TPagination<Partial<(TS & K & Partial<TR>)>[]>>;
    /**
     * @override
     * @param {string} column
     * @returns {Promise<array>} Array
     */
    getGroupBy<K extends Extract<keyof TS, string> | `${string}.${string}`>(column: K): Promise<any[]>;
    /**
     * @override
     * @param {string} column
     * @returns {Promise<array>} Array
     */
    findGroupBy<K extends Extract<keyof TS, string> | `${string}.${string}`>(column: K): Promise<any[]>;
    /**
     * @override
     * @param {object} data for insert
     * @returns {this} this
     */
    insert<K extends keyof TS>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for insert
     * @returns {this} this
     */
    create<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K];
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @returns {this} this
     */
    update<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }, updateNotExists?: string[]): this;
    /**
     * @override
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @returns {this} this
     */
    updateMany<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }, updateNotExists?: string[]): this;
    /**
     * @override
     * @param {object} data
     * @returns {this} this
     */
    updateNotExists<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    updateOrCreate<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    updateOrInsert<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    insertOrUpdate<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    createOrUpdate<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for create
     * @returns {this} this
     */
    createOrSelect<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    insertOrSelect<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
    *
    * @override
    * @param {object} data create not exists data
    * @returns {this} this
    */
    createNotExists<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     *
     * @override
     * @param {object} data create not exists data
     * @returns {this} this this
     */
    insertNotExists<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: K extends keyof TS ? {
        [P in K]: TS[K] | TRawStringQuery;
    } : {
        [P in K]: any;
    }): this;
    /**
     * @override
     * @param {Record<string,any>[]} data create multiple data
     * @returns {this} this this
     */
    createMultiple<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: (K extends keyof TS ? Partial<{
        [K in keyof TS]: TS[K];
    }> : Record<string, any>)[]): this;
    /**
     *
     * @override
     * @param {Record<string,any>[]} data create multiple data
     * @returns {this} this
     */
    insertMultiple<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(data: (K extends keyof TS ? Partial<{
        [K in keyof TS]: TS[K];
    }> : Record<string, any>)[]): this;
    /**
     *
     * @override
     * @param {{when : Object , columns : Object}[]} cases update multiple data specific columns by cases update
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.when
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.columns
     * @returns {this} this
     */
    updateMultiple<K extends keyof TS | TRawStringQuery | TFreezeStringQuery>(cases: {
        when: (K extends keyof TS ? Partial<{
            [K in keyof TS]: TS[K];
        }> : Record<string, any>);
        columns: (K extends keyof TS ? Partial<{
            [K in keyof TS]: TS[K];
        }> : Record<string, any>);
    }[]): this;
    /**
     * The 'getSchemaModel' method is used get a schema model
     * @returns {Record<string, Blueprint> | null} Record<string, Blueprint> | null
     */
    getSchemaModel(): Record<string, Blueprint> | null;
    /**
     * The 'validation' method is used validate the column by validating
     * @param {ValidateSchema} schema
     * @returns {this} this
     */
    validation(schema?: TValidateSchema): this;
    /**
     * The 'bindPattern' method is used to covert column relate with pattern
     * @param {string} column
     * @returns {string} return table.column
     */
    bindPattern(column: string): string;
    /**
     * @override
     * @returns {Promise<Record<string,any> | any[] | null | undefined>}
     */
    save(): Promise<Record<string, any> | any[] | null | undefined>;
    /**
     *
     * @override
     * @param {number} rows number of rows
     * @param {Function} callback function will be called data and index
     * @returns {promise<void>}
     */
    faker<T extends TS>(rows: number, callback?: (results: T, index: number) => T): Promise<void>;
    /**
     * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
     * @type     {object}  options
     * @property {boolean} options.force - forec always check all columns if not exists will be created
     * @property {boolean} options.log   - show log execution with sql statements
     * @property {boolean} options.foreign - check when has a foreign keys will be created
     * @property {boolean} options.changed - check when column is changed attribute will be change attribute
     * @returns {Promise<void>}
     */
    sync({ force, foreign, changed }?: {
        force?: boolean | undefined;
        foreign?: boolean | undefined;
        changed?: boolean | undefined;
    }): Promise<void>;
    private _valuePattern;
    private _checkTableLoggerIsExists;
    private _isPatternSnakeCase;
    private _classToTableName;
    private _makeTableName;
    private _handleSoftDelete;
    private _handleGlobalScope;
    private _handleSelect;
    /**
     *
     * generate sql statements
     * @override
     */
    protected _queryBuilder(): {
        select: () => string;
        insert: () => string;
        update: () => string;
        delete: () => string;
        where: () => string | null;
        any: () => string;
    };
    private _showOnly;
    private _validateSchema;
    private _getCache;
    private _setCache;
    private _execute;
    private _pagination;
    private _returnEmpty;
    private _returnResult;
    private _hiddenColumnModel;
    private _save;
    private _attach;
    private _detach;
    private _queryUpdateModel;
    private _queryInsertModel;
    private _queryInsertMultipleModel;
    private _insertNotExistsModel;
    private _insertModel;
    private _createMultipleModel;
    private _updateOrInsertModel;
    private _insertOrSelectModel;
    private _updateModel;
    private _assertError;
    private _validateMethod;
    private _checkSchemaOrNextError;
    private _stoppedRetry;
    private _observer;
    private _makeRelations;
    private _guardWhereCondition;
    protected _resultHandler(data: any): any;
    private _initialModel;
}
export { Model };
export default Model;
