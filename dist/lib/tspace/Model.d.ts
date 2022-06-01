import AbstractModel from './AbstractModel';
import { Relation } from './Interface';
declare class Model extends AbstractModel {
    [x: string]: {};
    constructor();
    useRegistry(): this;
    useUUID(custom?: string): this;
    useDebug(): this;
    usePattern(pattern: string): this;
    useSoftDelete(): this;
    useTimestamp(): this;
    useTable(table: string): this;
    disabledSoftDelete(): this;
    registry(func: any): this;
    withQuery(name: string, cb: Function): this;
    with(...nameRelations: Array<any>): this;
    withExists(...nameRelations: Array<string>): this;
    whereUser(id: number): this;
    hasOne({ name, as, model, pk, fk, freezeTable }: Relation): this;
    hasMany({ name, as, model, pk, fk, freezeTable }: Relation): this;
    belongsTo({ name, as, model, pk, fk, freezeTable }: Relation): this;
    belongsToMany({ name, as, model, pk, fk, freezeTable }: Relation): this;
    trashed(): Promise<any>;
    onlyTrashed(): Promise<any>;
    restore(): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    toString(): string;
    /**
     *
     * @Override Method
     *
    */
    toSQL(): string;
    /**
     *
     * @Override Method
     *
    */
    toJSON(): Promise<string | never[]>;
    /**
     *
     * @Override Method
     *
    */
    toArray(column?: string): Promise<any[]>;
    /**
     *
     * @Override Method
     *
    */
    avg(column?: string): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    sum(column?: string): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    max(column?: string): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    min(column?: string): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    count(column?: string): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    delete(): Promise<boolean>;
    /**
     *
     * @Override Method
     *
    */
    first(): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    all(): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    find(id: number): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    findOne(): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    get(): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    findMany(): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    pagination({ limit, page }?: {
        limit?: number | undefined;
        page?: number | undefined;
    }): Promise<any>;
    paginate({ limit, page }?: {
        limit?: number | undefined;
        page?: number | undefined;
    }): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    getGroupBy(column: string): Promise<any>;
    /**
    *
    * @Override Method
    *
   */
    update(objects: object): this;
    /**
     *
     * @Override Method
     *
    */
    insert(objects: object): this;
    /**
     *
     * @Override Method
     *
    */
    create(objects: object): this;
    /**
     *
     * @Override Method
     *
    */
    updateOrCreate(objects: object): this;
    updateOrInsert(objects: object): this;
    insertOrUpdate(objects: object): this;
    createOrUpdate(objects: object): this;
    /**
     *
     * @Override Method
     *
    */
    createMultiple(data: Array<any>): this;
    /**
     *
     * @Override Method
     *
    */
    insertMultiple(data: Array<any>): this;
    private _queryStatementModel;
    private _actionStatementModel;
    private _isPatternSnakeCase;
    private _classToTableName;
    private _tableName;
    private _valueInRelation;
    private _getSQLModel;
    private _exceptColumns;
    private _showOnly;
    private _exec;
    private _execGroup;
    private _relationFilter;
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
    private _registry;
    private _insertNotExistsModel;
    private _createModel;
    private _createMultipleModel;
    private _updateOrInsertModel;
    private _updateModel;
    /**
     *
     * @Override Method
     *
    */
    save(transaction?: {
        query: {
            table: string;
            id: string;
        }[];
    }): Promise<any>;
    /**
     *
     * @Override Method
     *
    */
    faker(rounds?: number): Promise<any>;
    private _initModel;
    private _setupLogger;
    private _setupModel;
}
export default Model;
