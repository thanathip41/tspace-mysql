import { AbstractModel } from './AbstractModel';
import { Relation, Pagination, RelationQuery } from './Interface';
declare class Model extends AbstractModel {
    private tableName?;
    constructor();
    /**
     *
     * define for initialize of models
     * @return {void} void
     */
    define(): void;
    /**
     *
     * Assign function callback in model
     * @return {this} this
     */
    useRegistry(): this;
    /**
    *
    * Assign function callback in model
    * @return {this} this
    */
    usePrimaryKey(primary: string): this;
    /**
     * Assign in model uuid when creating
     * @param {string?} column [column=uuid] custom column replace this
     * @return {this} this
     */
    useUUID(column?: string): this;
    /**
     * Assign in model console.log sql statement
     * @return {this} this
     */
    useDebug(): this;
    /**
     *
     * Assign in model use pattern [snake_case , camelCase]
     * @param  {string} pattern
     * @return {this} this
     */
    usePattern(pattern: string): this;
    /**
     *
     * Assign in model show data not be deleted
     * Relations has reference this method
     * @param {string?} column
     * @return {this} this
     */
    useSoftDelete(column?: string): this;
    /**
     *
     * Assign timestamp when insert || updated created_at and update_at in table
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change column of created at
     * @property {string} timestampFormat.updatedAt - change column of updated at
     * @return {this} this
     */
    useTimestamp(timestampFormat?: {
        createdAt: string;
        updatedAt: string;
    }): this;
    /**
     *
     * Assign table name in model
     * @param {string} table table name in database
     * @return {this} this
     */
    useTable(table: string): this;
    /**
     *
     * Assign table name in model with signgular pattern
     * @return {this} this
     */
    useTableSingular(): this;
    /**
     *
     * Assign table name in model with pluarl pattern
     * @return {this} this
     */
    useTablePlural(): this;
    /**
     *
     * Clone instance of model
     * @override Method
     * @return {this} this
     */
    clone(instance: Model): this;
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @return {this} this
     */
    ignoreSoftDelete(condition?: boolean): this;
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
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withExists(...nameRelations: Array<string>): this;
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
    hasOne({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
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
    hasMany({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
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
    belongsTo({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
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
    belongsToMany({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    hasOneQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    hasManyQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    belongsToQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    belongsToManyQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
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
    /**
     *
     * @override Method
     * @return {promise<string>}
    */
    exceptColumns(): Promise<string>;
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
     * delete data from the database
     * @override Method
     * @return {promise<boolean>}
     */
    delete(): Promise<boolean>;
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    first(): Promise<{
        [key: string]: any;
    } | null>;
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    findOne(): Promise<any>;
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
    find(id: number): Promise<any>;
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
     * @param {?object} paginationOptions by default page = 1 , limit = 15
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
    update(data: object): this;
    /**
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    insert(data: object): this;
    /**
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    create(data: object): this;
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrCreate(data: object): this;
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrInsert(data: object): this;
    /**
    *
    * @override Method
    * @param {object} data for update or create
    * @return {this} this
    */
    insertOrUpdate(data: object): this;
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    createOrUpdate(data: object): this;
    /**
     *
     * insert multiple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    createMultiple(data: Array<Object>): this;
    /**
     *
     * insert muliple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data: Array<Object>): this;
    /**
     *
     * @override Method
     * @return {Promise<any>}
     */
    save(): Promise<any>;
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    faker(rows?: number): Promise<any>;
    private _queryStatementModel;
    private _actionStatementModel;
    private _valuePattern;
    private _isPatternSnakeCase;
    private _classToTableName;
    private _tableName;
    private _valueInRelation;
    private _buildQueryModel;
    private _showOnly;
    private _execute;
    private _executeGroup;
    private _relationMapData;
    private _handleRelationsExists;
    private _queryRelationsExists;
    private _relation;
    private _handleBelongsToMany;
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
    private _registry;
    private _insertNotExistsModel;
    private _createModel;
    private _createMultipleModel;
    private _updateOrInsertModel;
    private _updateModel;
    private _assertError;
    private _functionRelationName;
    private _handleRelationsQuery;
    private _initialModel;
    private _setupModel;
}
export { Model };
export default Model;
