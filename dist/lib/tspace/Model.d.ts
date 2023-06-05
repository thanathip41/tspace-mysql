import { AbstractModel } from './AbstractModel';
import { Relation, Pagination, RelationQuery } from './Interface';
declare class Model extends AbstractModel {
    constructor();
    /**
     *
     * define for initialize of models
     * @return {void} void
     */
    protected define(): void;
    /**
     *
     * boot for initialize of models
     * @return {void} void
     */
    protected boot(): void;
    /**
     *
     * Assign function callback in model
     * @return {this} this
     */
    protected useRegistry(): this;
    /**
     *
     * Assign model calling all relationships in model
     * @return {this} this
     */
    protected useLoadRelationInRegistry(): this;
    /**
     *
     * Assign model built-in relation functions to a results
     * @return {this} this
     */
    protected useBuiltInRelationFunctions(): this;
    /**
     *
     * Assign primary column in model
     * @return {this} this
     */
    protected usePrimaryKey(primary: string): this;
    /**
     * Assign generate uuid when creating in model
     * @param {string?} column [column=uuid] make new name column for custom column replace uuid with this
     * @return {this} this
     */
    protected useUUID(column?: string): this;
    /**
     * Assign in model console.log raw sql when fetching query statement
     * @return {this} this
     */
    protected useDebug(): this;
    /**
     *
     * Assign in model use pattern [snake_case , camelCase]
     * @param  {string} pattern
     * @return {this} this
     */
    protected usePattern(pattern: string): this;
    /**
     *
     * Assign in model show data not be deleted
     * Relations has reference this method
     * @param {string?} column
     * @return {this} this
     */
    protected useSoftDelete(column?: string): this;
    /**
     *
     * Assign timestamp when insert || updated created_at and update_at in table
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change new name column replace by default [created at]
     * @property {string} timestampFormat.updatedAt - change new name column replace by default updated at
     * @return {this} this
     */
    protected useTimestamp(timestampFormat?: {
        createdAt: string;
        updatedAt: string;
    }): this;
    /**
     *
     * Assign table name in model
     * @param {string} table table name in database
     * @return {this} this
     */
    protected useTable(table: string): this;
    /**
     *
     * Assign table name in model with signgular pattern
     * @return {this} this
     */
    protected useTableSingular(): this;
    /**
     *
     * Assign table name in model with pluarl pattern
     * @return {this} this
     */
    protected useTablePlural(): this;
    /**
     *
     * Assign schema column in model for validation data types
     * @param {Object<Function>} schema types (String Number and Date)
     * @return {this} this
     */
    protected useSchema(schema: Record<string, Function>): this;
    /**
     * Assign hook function when execute returned results to callback function
     * @param {Function} arrayFunction function for callback result
     * @return {this}
    */
    protected useHook(functions: Array<Function>): this;
    /**
     * exceptColumns for method except
     * @return {promise<string>} string
     */
    protected exceptColumns(): Promise<string>;
    /**
     * Build  method for relation in model
     * @param    {string} name name relation registry in your model
     * @param    {Function} callback query callback
     * @return   {this}   this
     */
    protected buildMethodRelation(name: string, callback?: Function): this;
    /**
     *
     * Clone instance of model
     * @param {Model} instance instance of model
     * @return {this} this
     */
    protected clone(instance: Model): this;
    /**
     *
     * Copy an instance of model
     * @param {Model} instance instance of model
     * @param {Object} options keep data
     * @return {Model} Model
     */
    protected copyModel(instance: Model, options?: {
        update?: boolean;
        insert?: boolean;
        delete?: boolean;
        where?: boolean;
    }): Model;
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @return {this} this
     */
    ignoreSoftDelete(condition?: boolean): this;
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    tableName(table: string): this;
    /**
     * Assign ignore delete_at in model
     *  @param {boolean} condition
     * @return {this} this
     */
    disableSoftDelete(condition?: boolean): this;
    /**
     * Assign build in function to result of data
     * @param {object} func
     * @return {this} this
     */
    registry(func: {
        [key: string]: Function;
    }): this;
    /**
     *
     * Use relations in registry of model return result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     */
    with(...nameRelations: Array<string>): this;
    /**
     *
     * Use relations in registry of model return ignore soft deleted
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withTrashed(...nameRelations: Array<string>): this;
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withExists(...nameRelations: Array<string>): this;
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    has(...nameRelations: Array<string>): this;
    /**
     *
     * Use relation '${name}' registry of model return callback this query model
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @return {this} this
     */
    withQuery(nameRelation: string, callback: Function): this;
    /**
     *
     * Use relations in registry of model retrun result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     */
    relations(...nameRelations: Array<string>): this;
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this}
     */
    relationsExists(...nameRelations: Array<string>): this;
    /**
     *
     * Use relation '${name}' registry of model return callback this query model
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @return {this} this
     */
    relationQuery(nameRelation: string, callback: Function): this;
    /**
     *
     * Use relations in registry of model return ignore soft deleted
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    relationTrashed(...nameRelations: Array<string>): this;
    /**
     * Assign the relation in model Objects
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
     * Assign the relation in model Objects
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
     * Assign the relation in model Objects
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
     * Assign the relation in model Objects
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable freeae table name
     * @property {string} relation.pivot table name of pivot
     * @property {string} relation.oldVersion return value of old version
     * @return   {this}   this
     */
    protected belongsToMany({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion }: Relation): this;
    /**
     * Assign the relation in model Objects
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
    protected hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback?: Function): this;
    /**
     * Assign the relation in model Objects
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
     * Assign the relation in model Objects
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
     * Assign the relation in model Objects
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
    protected belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, pivot }: RelationQuery, callback?: Function): this;
    /**
     * return only in trashed (data has been remove)
     * @return {promise}
     */
    trashed(): Promise<any>;
    /**
     * return all only in trashed (data has been remove)
     * @return {promise}
     */
    onlyTrashed(): Promise<any>;
    /**
     * restore data in trashed
     * @return {promise}
     */
    restore(): Promise<any>;
    toTableName(): string;
    toTableNameAndColumn(column: string): string;
    /**
     *
     * @override Method
     * @return {string}
    */
    toString(): string;
    /**
     *
     * @override Method
     * @return {string}
    */
    toSQL(): string;
    /**
     *
     * @override Method
     * @return {promise<string>}
    */
    toJSON(): Promise<string>;
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<Array>}
    */
    toArray(column?: string): Promise<Array<any>>;
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    avg(column?: string): Promise<number>;
    /**
     *
     * @override Method
     * @param {string} column [column=id]
     * @return {promise<number>}
    */
    sum(column?: string): Promise<number>;
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    max(column?: string): Promise<number>;
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    min(column?: string): Promise<number>;
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    count(column?: string): Promise<number>;
    /**
     *
     * execute data return result is exists
     * @return {promise<boolean>}
     */
    exists(): Promise<boolean>;
    /**
     * delete data from the database
     * @override Method
     * @return {promise<boolean>}
     */
    delete(): Promise<boolean>;
    /**
     *
     * force delete data from the database
     * @return {promise<boolean>}
     */
    forceDelete(): Promise<boolean>;
    /**
     *
     * @override Method
     * @return {promise<{[key: string]:any} | null>}
    */
    first(): Promise<{
        [key: string]: any;
    } | null>;
    /**
     *
     * @override Method
     * @return {promise<{[key: string]:any} | null>}
    */
    findOne(): Promise<{
        [key: string]: any;
    } | null>;
    /**
     *
     * @override Method
     * @return {promise<object | Error>}
    */
    firstOrError(message: string, options?: {
        [key: string]: any;
    }): Promise<{
        [key: string]: any;
    }>;
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    findOneOrError(message: string, options?: {
        [key: string]: any;
    }): Promise<{
        [key: string]: any;
    }>;
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    all(): Promise<Array<any>>;
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    find(id: number): Promise<Record<string, any> | null>;
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    get(): Promise<Array<any>>;
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    findMany(): Promise<Array<any>>;
    /**
     *
     * @override Method
     * @param {object?} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @return {promise<Pagination>}
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
    * @return   {promise<Pagination>}
    */
    paginate(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<Pagination>;
    /**
     *
     * @override Method
     * @param {string} column
     * @return {Promise<array>}
     */
    getGroupBy(column: string): Promise<Array<any>>;
    /**
     *
     * update data in the database
     * @override Method
     * @param {object} data
     * @return {this} this
     */
    update(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    insert(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    create(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrCreate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrInsert(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
    *
    * @override Method
    * @param {object} data for update or create
    * @return {this} this
    */
    insertOrUpdate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    createOrUpdate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @override Method
     * @param {object} data for create
     * @return {this} this
     */
    createOrSelect(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
    *
    * @override Method
    * @param {object} data for update or create
    * @return {this} this
    */
    insertOrSelect(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * insert multiple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    createMultiple(data: Array<{
        [key: string]: any;
    }>): this;
    /**
     *
     * insert muliple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data: Array<{
        [key: string]: any;
    }>): this;
    /**
     *
     * @param {object} data create not exists data
     * @override Method
     * @return {this} this this
     */
    createNotExists(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @param {object} data create not exists data
     * @override Method
     * @return {this} this this
     */
    insertNotExists(data: {
        [key: string]: any;
    } & {
        length?: never;
    }): this;
    /**
     *
     * get schema of table
     * @return {this} this this
     */
    getSchema(): Promise<any>;
    /**
     *
     * @override Method
     * @return {Promise<Record<string,any> | Array<any> | null | undefined>}
     */
    save(): Promise<Record<string, any> | Array<any> | null | undefined>;
    /**
     *
     * fake data into to this table
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    faker(rows?: number): Promise<Record<string, any>[]>;
    private _valuePattern;
    private _isPatternSnakeCase;
    private _classToTableName;
    private _makeTableName;
    private _tableName;
    private _valueInRelation;
    private _handleSoftDelete;
    private _buildQueryModel;
    private _showOnly;
    private _validateSchema;
    private _execute;
    private _executeGroup;
    private _relationMapData;
    private _handleRelationsExists;
    private _queryRelationsExists;
    private _relation;
    private _belongsToMany;
    private _pagination;
    private _result;
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
    private _functionRelationName;
    private _handleRelations;
    private _handleRelationsQuery;
    private _validateMethod;
    private _initialModel;
}
export { Model };
export default Model;
