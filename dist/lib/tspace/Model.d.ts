import { AbstractModel } from './Abstracts/AbstractModel';
import { Blueprint } from './Blueprint';
import { Relation, Pagination, RelationQuery, ValidateSchema } from '../Interface';
/**
 *
 * 'Model' class is a representation of a database table
 * @example
 * class User extends Model {}
 * new User().findMany().then(users => console.log(users))
 */
declare class Model extends AbstractModel {
    constructor();
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
     * @return {void} void
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
     * @return {void} void
     */
    protected boot(): void;
    /**
     * The "useObserve" pattern refers to a way of handling model events using observer classes.
     * Model events are triggered when certain actions occur on models,
     * such as creating, updating, deleting, or saving a record.
     *
     * Observers are used to encapsulate the event-handling logic for these events,
     * keeping the logic separate from the model itself and promoting cleaner, more maintainable code.
     * @param {Function} observer
     * @return this
     * @example
     *
     * class UserObserve {
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
    protected useObserver(observer: Function): this;
    /**
     * The "useSchema" method is used to define the schema.
     *
     * It's automatically create, called when not exists table or columns.
     * @param {object} schema using Blueprint for schema
     * @example
     * import { Blueprint } from 'tspace-mysql'
     * class User extends Model {
     *     constructor() {
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
     * @return {this} this
     */
    protected useSchema(schema: Record<string, Blueprint>): this;
    /**
     *
     * The "useRegistry" method is used to define Function to results.
     *
     * It's automatically given Function to results.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useRegistry()
     *     }
     * }
     */
    protected useRegistry(): this;
    /**
     * The "useLoadRelationsInRegistry" method is used automatically called relations in your registry Model.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useLoadRelationInRegistry()
     *     }
     * }
     */
    protected useLoadRelationsInRegistry(): this;
    /**
     * The "useBuiltInRelationFunctions" method is used to define the function.
     *
     * It's automatically given built-in relation functions to a results.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useBuiltInRelationsFunction()
     *     }
     * }
     */
    protected useBuiltInRelationFunctions(): this;
    /**
     * The "usePrimaryKey" method is add primary keys for database tables.
     *
     * @param {string} primary
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
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
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useUUID()
     *     }
     * }
     */
    protected useUUID(column?: string): this;
    /**
     * The "useDebug" method is viewer raw-sql logs when excute the results.
     * @return {this} this
     */
    protected useDebug(): this;
    /**
     * The "usePattern" method is used to assign pattern [snake_case , camelCase].
     * @param  {string} pattern
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.usePattern('camelCase')
     *     }
     * }
     */
    protected usePattern(pattern: "snake_case" | "camelCase"): this;
    /**
     * The "useCamelCase" method is used to assign pattern camelCase.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useCamelCase()
     *     }
     * }
     */
    protected useCamelCase(): this;
    /**
     * The "SnakeCase" method is used to assign pattern snake_case.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
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
     * @return {this} this
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
     * @return {this} this
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
     * @return {this} this
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
     * @return {this} this
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
     * @return {this} this
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
     * @return {this} this
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
    protected useValidationSchema(schema?: ValidateSchema): this;
    /**
     * This 'useValidateSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @return {this} this
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
    protected useValidateSchema(schema?: ValidateSchema): this;
    /**
     * The "useHooks" method is used to assign hook function when execute returned results to callback function.
     * @param {Function[]} arrayFunctions functions for callback result
     * @return {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useHook([(results) => console.log(results)])
     *   }
     * }
    */
    protected useHooks(arrayFunctions: Function[]): this;
    /**
     * exceptColumns for method except
     * @override
     * @return {promise<string>} string
     */
    protected exceptColumns(): Promise<string[]>;
    /**
     * Build  method for relation in model
     * @param    {string} name name relation registry in your model
     * @param    {Function} callback query callback
     * @return   {this}   this
     */
    protected buildMethodRelation(name: string, callback?: Function): this;
    /**
     *
     * The 'makeSelectStatement' method is used to make select statement.
     * @return {Promise<string>} string
     */
    makeSelectStatement(): Promise<string>;
    /**
     *
     * The 'makeInsertStatement' method is used to make insert table statement.
     * @return {Promise<string>} string
     */
    makeInsertStatement(): Promise<string>;
    /**
     *
     * The 'makeUpdateStatement' method is used to make update table statement.
     * @return {Promise<string>} string
     */
    makeUpdateStatement(): Promise<string>;
    /**
     *
     * The 'makeDeleteStatement' method is used to make delete statement.
     * @return {Promise<string>} string
     */
    makeDeleteStatement(): Promise<string>;
    /**
     *
     * The 'makeCreateStatement' method is used to make create table statement.
     * @return {Promise<string>} string
     */
    makeCreateStatement(): Promise<string>;
    /**
     *
     * Clone instance of model
     * @param {Model} instance instance of model
     * @return {this} this
     */
    clone(instance: Model): this;
    /**
     *
     * Copy an instance of model
     * @param {Model} instance instance of model
     * @param {Object} options keep data
     * @return {Model} Model
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
    }): Model;
    /**
     *
     * execute the query using raw sql syntax
     * @override method
     * @param {string} sql
     * @return {this} this
     */
    protected _queryStatement(sql: string): Promise<any[]>;
    /**
     *
     * execute the query using raw sql syntax actions for insert update and delete
     * @override method
     * @param {Object} actions
     * @property {Function} actions.sqlresult
     * @property {Function} actions.returnId
     * @return {this} this
     */
    protected _actionStatement({ sql, returnId }: {
        sql: string;
        returnId?: boolean;
    }): Promise<any>;
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    table(table: string): this;
    /**
     * Assign ignore delete_at in model
     *  @param {boolean} condition
     * @return {this} this
     */
    disableSoftDelete(condition?: boolean): this;
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @return {this} this
     */
    ignoreSoftDelete(condition?: boolean): this;
    /**
     * Assign build in function to result of data
     * @param {Record} func
     * @return {this} this
     */
    registry(func: Record<string, Function>): this;
    /**
     * The 'with' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
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
     *  // use 'with' for results of relationship
     *  await new User().relations('posts').findMany()
     *
     */
    with(...nameRelations: string[]): this;
    /**
     * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method ignore soft delete
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withAll(...nameRelations: string[]): this;
    /**
    * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
    *
    * Eager loading allows you to retrieve a primary model and its related models in a more efficient
    * It's method ignore soft delete
    * @param {...string} nameRelations if data exists return blank
    * @return {this} this
    */
    withCount(...nameRelations: string[]): this;
    /**
     * The 'withTrashed' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return results only in trash (soft deleted)
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withTrashed(...nameRelations: string[]): this;
    /**
     * The 'withExists' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @return {this} this
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
     *  // use with for results of relationship if relations is exists
     *  await new User().relationsExists('posts').findMany()
     */
    withExists(...nameRelations: string[]): this;
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
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
     *  // use with for results of relationship if relations is exists
     *  await new User().has('posts').findMany()
     * @return {this} this
     */
    has(...nameRelations: string[]): this;
    /**
     *
     * The 'withQuery' method is particularly useful when you want to filter or add conditions records based on related data.
     *
     * Use relation '${name}' registry models then return callback queries
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
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
     *   .relationsQuery('posts', (query : Post) => {
     *       return query.relations('comments','user')
     *       .relationsQuery('comments', (query : Comment) => {
     *           return query.relations('user','post')
     *       })
     *       .relationsQuery('user', (query : User) => {
     *           return query.relations('posts').relationsQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @return {this} this
     */
    withQuery(nameRelation: string, callback: Function): this;
    /**
     *
     * Use relations in registry of model return result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
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
     *  // use with for results of relationship
     *  await new User().relations('posts').findMany()
     * @return {this} this
     */
    relations(...nameRelations: string[]): this;
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
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
     *  // use with for results of relationship if relations is exists
     *  await new User().relationsExists('posts').findMany()
     * @return {this} this
     */
    relationsExists(...nameRelations: string[]): this;
    /**
     *
     * Use relation '${name}' registry of model return callback this query model
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
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
     *           return query.relations('posts').relationQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @return {this} this
     */
    relationQuery(nameRelation: string, callback: Function): this;
    /**
     *
     * Use relations in registry of model return ignore soft deleted
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    relationsAll(...nameRelations: string[]): this;
    /**
     *
     * Use relations in registry of model return only in trash (soft delete)
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    relationsTrashed(...nameRelations: string[]): this;
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
     * @return   {this}   this
     */
    protected hasOne({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
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
     * @return   {this}   this
     */
    protected hasMany({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
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
     * @return   {this}   this
     */
    protected belongsTo({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
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
     * @return   {this}   this
     */
    protected belongsToMany({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }: Relation): this;
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
     * @return   {this} this
     */
    protected hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback?: Function): this;
    /**
     * The 'hasManyBuilder' method is useful for creating 'hasMany' relationship to function
     *
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}  model
     * @property {string?} name
     * @property {string?}  as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @return   {this} this
     */
    protected hasManyBuilder({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback?: Function): this;
    /**
     * The 'belongsToBuilder' method is useful for creating 'belongsTo' relationship to function
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}  model
     * @property {string?} name
     * @property {string?}  as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @return   {this} this
     */
    protected belongsToBuilder({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback?: Function): this;
    /**
     * The 'belongsToManyBuilder' method is useful for creating 'belongsToMany' relationship to function
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}  model
     * @property {string?} name
     * @property {string?}  as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @return   {this} this
     */
    protected belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }: RelationQuery, callback?: Function): this;
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @return {this} this
     */
    onlyTrashed(): this;
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @return {this} this
     */
    trashed(): this;
    /**
     * restore data in trashed
     * @return {promise}
     */
    restore(): Promise<any[]>;
    /**
     *
     * @return {string} string
     */
    toTableName(): string;
    /**
     *
     * @param {string} column
     * @return {string} string
     */
    toTableNameAndColumn(column: string): string;
    private _columnPattern;
    /**
     * @override Method
     * @param {string} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this} this
     */
    where(column: string | Record<string, any>, operator?: any, value?: any): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    orWhere(column: string, operator?: any, value?: any): this;
    /**
     * @override Method
     * @param {Object} columns
     * @return {this}
     */
    whereObject(columns: Record<string, any>): this;
    /**
    * @override Method
    * @param    {string} column
    * @param    {object}  property object { key , value , operator }
    * @property {string}  property.key
    * @property {string}  property.value
    * @property {string?} property.operator
    * @return   {this}
    */
    whereJSON(column: string, { key, value, operator }: {
        key: string;
        value: string;
        operator?: string;
    }): this;
    /**
     * @override Method
     * @param {number} userId
     * @param {string?} column custom it *if column is not user_id
     * @return {this}
     */
    whereUser(userId: number, column?: string): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereIn(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereIn(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereNotIn(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereNotIn(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereSubQuery(column: string, subQuery: string): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereNotSubQuery(column: string, subQuery: string): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereSubQuery(column: string, subQuery: string): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereNotSubQuery(column: string, subQuery: string): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereBetween(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereBetween(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereNotBetween(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereNotBetween(column: string, array: any[]): this;
    /**
     * @override Method
     * @param {string} column
     * @return {this}
     */
    whereNull(column: string): this;
    /**
     * @override Method
     * @param {string} column
     * @return {this}
     */
    orWhereNull(column: string): this;
    /**
     * @override Method
     * @param {string} column
     * @return {this}
     */
    whereNotNull(column: string): this;
    /**
     * @override Method
     * @param {string} column
     * @return {this}
     */
    orWhereNotNull(column: string): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereSensitive(column: string, operator?: any, value?: any): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereStrict(column: string, operator?: any, value?: any): this;
    /**
     * @override Method
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    orWhereSensitive(column: string, operator?: any, value?: any): this;
    /**
     * @override Method
     * @param {Function} callback callback query
     * @return {this}
     */
    whereQuery(callback: Function): this;
    /**
     * @override Method
     * @return {promise<boolean>} promise boolean
     */
    delete(): Promise<boolean>;
    /**
     * @override Method
     * @return {promise<boolean>} promise boolean
     */
    deleteMany(): Promise<boolean>;
    /**
     * @override Method
     * @return {promise<Record<string,any> | null>} Record | null
    */
    first(): Promise<Record<string, any> | null>;
    /**
     * @override Method
     * @return {promise<Record<string,any> | null>} Record | null
    */
    findOne(): Promise<Record<string, any> | null>;
    /**
     * @override Method
     * @return {promise<object | Error>} Record | throw error
    */
    firstOrError(message: string, options?: Record<string, any>): Promise<Record<string, any>>;
    /**
     *
     * @override Method
     * @return {promise<any>} Record | throw error
    */
    findOneOrError(message: string, options?: Record<string, any>): Promise<Record<string, any>>;
    /**
     *
     * @override Method
     * @return {promise<array>} Array
    */
    get(): Promise<any[]>;
    /**
     *
     * @override Method
     * @return {promise<array>} Array
    */
    findMany(): Promise<any[]>;
    /**
     * @override Method
     * @param {object?} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @return {promise<Pagination>} Pagination
     */
    pagination(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<Pagination>;
    /**
    *
    * @override Method
    * @param    {?object} paginationOptions by default page = 1 , limit = 15
    * @property {number}  paginationOptions.limit
    * @property {number}  paginationOptions.page
    * @return   {promise<Pagination>} Pagination
    */
    paginate(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<Pagination>;
    /**
     * @override Method
     * @param {string} column
     * @return {Promise<array>} Array
     */
    getGroupBy(column: string): Promise<any[]>;
    /**
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    insert(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    create(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @return {this} this
     */
    update(data: Record<string, string | number | boolean | null | undefined>, updateNotExists?: string[]): this;
    /**
     * @override Method
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @return {this} this
     */
    updateMany(data: Record<string, string | number | boolean | null | undefined>, updateNotExists?: string[]): this;
    /**
     * @override Method
     * @param {object} data
     * @return {this} this
     */
    updateNotExists(data: Record<string, string | number | boolean | null | undefined> & {
        length?: unknown;
    }): this;
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrCreate(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrInsert(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    insertOrUpdate(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    createOrUpdate(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data for create
     * @return {this} this
     */
    createOrSelect(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    insertOrSelect(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {Record<string,any>[]} data create multiple data
     * @return {this} this this
     */
    createMultiple(data: Record<string, string | number | boolean | null | undefined>[]): this;
    /**
     *
     * @override Method
     * @param {Record<string,any>[]} data create multiple data
     * @return {this} this
     */
    insertMultiple(data: Record<string, string | number | boolean | null | undefined>[]): this;
    /**
     * @override Method
     * @param {object} data create not exists data
     * @return {this} this
     */
    createNotExists(data: Record<string, string | number | boolean | null | undefined>): this;
    /**
     * @override Method
     * @param {object} data create not exists data
     * @return {this} this this
     */
    insertNotExists(data: Record<string, string | number | boolean | null | undefined>): this;
    getSchemaModel(): Record<string, Blueprint> | null;
    validation(schema?: ValidateSchema): this;
    /**
     * The 'bindPattern' method is used to covert column relate with pattern
     * @param {string} column
     * @return {string} return table.column
     */
    bindPattern(column: string): string;
    /**
     * @override Method
     * @return {Promise<Record<string,any> | any[] | null | undefined>}
     */
    save(): Promise<Record<string, any> | any[] | null | undefined>;
    /**
     *
     * @override Method
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    faker(rows: number, callback?: Function): Promise<Record<string, any>[]>;
    /**
     * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
     *
     * @property {boolean} force - forec always check all columns if not exists will be created
     * @property {boolean} foreign - foreign key for constraint
     * @return {promise<void>}
     */
    sync({ force, foreign }?: {
        force?: boolean | undefined;
        foreign?: boolean | undefined;
    }): Promise<void>;
    private _valuePattern;
    private _isPatternSnakeCase;
    private _classToTableName;
    private _makeTableName;
    private _handleSoftDelete;
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
    private _execute;
    private _executeGroup;
    private _pagination;
    private _returnEmpty;
    private _returnResult;
    private _hiddenColumnModel;
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
    private _initialModel;
}
export { Model };
export default Model;
