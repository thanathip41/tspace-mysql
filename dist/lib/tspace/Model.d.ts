import { AbstractModel } from './AbstractModel';
import { Relation, Pagination, Transaction, RelationQuery } from './Interface';
declare class Model extends AbstractModel {
    [key: string]: any;
    constructor();
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
     * @param {string} uuid custom column uuid
     * @return {this} this
     */
    useUUID(uuid?: string): this;
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
     * @return {this} this
     */
    useSoftDelete(): this;
    /**
     * Assign in model show data not be deleted in relations
     * repicate
     * @return {this} this
     */
    useDisableSoftDeleteInRelations(): this;
    /**
     *
     * Assign timestamp when insert || updated created_at and update_at in table
     * @return {this} this
     */
    useTimestamp(timestampFormat?: {
        createdAt: string;
        updatedAt: string;
    }): this;
    /**
     *
     * Assign table name in model
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
     * Assign ignore delete_at in model
     * @return {this} this
     */
    ignoreSoftDelete(condition?: boolean): this;
    /**
     * return ignore delete at all data
     * @return {this} this
     */
    disableSoftDelete(condition?: boolean): this;
    /**
     *
     * @param {function} func
     * @return {this} this
     */
    registry(func: {
        [key: string]: Function;
    }): this;
    /**
     *
     * relation model retrun result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     */
    with(...nameRelations: Array<string>): this;
    /**
     *
     * relation model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this}
     */
    withExists(...nameRelations: Array<string>): this;
    /**
     *
     * deep relation in model return callback query
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @return {this} this
     */
    withQuery(nameRelation: string, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    hasOne({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    hasMany({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    belongsTo({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    belongsToMany({ name, as, model, localKey, foreignKey, freezeTable }: Relation): this;
    /**
    * Assign the relation in model Objects
    * @param {object} relations registry relation in your model
    * @param {string?} relation.name
    * @param {string} relation.as
    * @param {class}  relation.model
    * @param {string} relation.localKey
    * @param {string} relation.foreignKey
    * @param {string} relation.freezeTable
    * @return {this} this
    */
    hasOneQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string?} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    hasManyQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
     */
    belongsToQuery({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery, callback: Function): this;
    /**
     * Assign the relation in model Objects
     * @param {object} relations registry relation in your model
     * @param {string} relation.name
     * @param {string} relation.as
     * @param {class}  relation.model
     * @param {string} relation.localKey
     * @param {string} relation.foreignKey
     * @param {string} relation.freezeTable
     * @return {this} this
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
     * @param {string=} column [column=id]
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
     * @return {promise<object | null>}
    */
    first(): Promise<{
        [key: string]: any;
    } | null>;
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    findOne(): Promise<{
        [key: string]: any;
    } | null>;
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
    find(id: number): Promise<{
        [key: string]: any;
    } | null>;
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
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    pagination(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<Pagination>;
    /**
     *
     * @override Method
     * @param {Object} pagination page , limit
     * @param {number} pagination.limit
     * @param {number} pagination.page
     * @return {promise<Pagination>}
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
     * insert muliple data into the database
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
     * @param {object?} transaction using DB.beginTransaction()
     * Ex. +---------------------------------------------------+
     * const transaction = await new DB().beginTransaction()
     *
     * try {
     *      const useSave = await create  ...something then .save(transaction)
     *      const useSave2 = await create ...something then .save(transaction)
     *      throw new Error('try to errors')
     * } catch (e) {
     *      const rollback = await transaction.rollback()
     *      // rollback => ture
     *      // !done transaction has been rolled back [useSave , useSave2]
     * }
     *
     * @return {Promise<array | object | null>}
     */
    save(transaction?: Transaction): Promise<Array<any> | {
        [key: string]: any;
    } | null>;
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any}
     */
    faker(rows?: number): Promise<any>;
    /**
    *
    * @override Method
    * @param {number} id
    * @return {this}
    */
    whereUser(id: number): this;
    private _queryStatementModel;
    private _actionStatementModel;
    private _valuePattern;
    private _isPatternSnakeCase;
    private _classToTableName;
    private _tableName;
    private _valueInRelation;
    private _queryGenrateModel;
    private _exceptColumns;
    private _showOnly;
    private _execute;
    private _executeGroup;
    private _relationFilter;
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
    private _initialModel;
    private _setupModel;
}
export { Model };
export default Model;
