import { AbstractBuilder } from './AbstractBuilder';
import { Pagination, Backup, ConnectionOptions, BackupToFile, Connection, ConnectionTransaction } from './Interface';
declare class Builder extends AbstractBuilder {
    constructor();
    /**
     *
     * @param {string} column
     * @return {this}
     */
    pluck(column: string): this;
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    except(...columns: Array<string>): this;
    /**
     * data alaways will return void
     * @return {this} this
     */
    void(): this;
    /**
     *
     * @param {...string} columns show only colums selected
     * @return {this} this
     */
    only(...columns: Array<string>): this;
    /**
     *
     * @param {string=} column [column=id]
     * @return {this} this
     */
    distinct(column?: string): this;
    /**
     * select data form table
     * @param {Array<string>} ...columns
     * @return {this} this
     */
    select(...columns: Array<string>): this;
    selectRaw(...columns: Array<string>): this;
    /**
     * chunks data from array
     * @param {number} chunk
     * @return {this} this
     */
    chunk(chunk: number): this;
    /**
     *
     * @param {string | number | undefined | null | Boolean} condition when condition true will return query callback
     * @return {this} this
     */
    when(condition: string | number | undefined | null | Boolean, callback: Function): this;
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    resetWhere(): this;
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    where(column: string | any, operator?: any, value?: any): this;
    /**
     * where using object operator only '='
     * @param {Object} columns
     * @return {this}
     */
    whereObject(columns: {
        [key: string]: any;
    }): this;
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    orWhere(column: string, operator?: any, value?: any): this;
    /**
     *
     * @param {string} sql where column with raw sql
     * @return {this} this
     */
    whereRaw(sql: string): this;
    /**
     *
     * @param {string} query where column with raw sql
     * @return {this} this
     */
    orWhereRaw(sql: string): this;
    /**
     *
     * @param {string} tableAndLocalKey
     * @param {string?} tableAndForeignKey
     * @return {this}
     */
    protected whereReference(tableAndLocalKey: string, tableAndForeignKey?: any): this;
    /**
     *
     * where exists
     * @param {string} sql
     * @return {this}
     */
    whereExists(sql: string): this;
    /**
     *
     * @param {number} id
     * @return {this} this
     */
    whereId(id: number, column?: string): this;
    /**
     *
     * @param {string} email where using email
     * @return {this}
     */
    whereEmail(email: string): this;
    /**
     *
     * @param {number} userId
     * @param {string?} column custom it *if column is not user_id
     * @return {this}
     */
    whereUser(userId: number, column?: string): this;
    /**
     * using array value where in value in array
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereIn(column: string, array: Array<any>): this;
    /**
     * or where in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereIn(column: string, array: Array<any>): this;
    /**
     * where not in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereNotIn(column: string, array: Array<any>): this;
    /**
     * where not in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereNotIn(column: string, array: Array<any>): this;
    /**
     * where sub query using sub query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereSubQuery(column: string, subQuery: string): this;
    /**
     * where not sub query using sub query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereNotSubQuery(column: string, subQuery: string): this;
    /**
     * or where not sub query using query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereSubQuery(column: string, subQuery: string): this;
    /**
     * or where not sub query using query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereNotSubQuery(column: string, subQuery: string): this;
    /**
     * where between using [value1, value2]
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereBetween(column: string, array: Array<any>): this;
    /**
     * where null using NULL
     * @param {string} column
     * @return {this}
     */
    whereNull(column: string): this;
    /**
     * where not null using NULL
     * @param {string} column
     * @return {this}
     */
    whereNotNull(column: string): this;
    /**
     * where sensitive (uppercase, lowercase)
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereSensitive(column: string, operator?: any, value?: any): this;
    /**
     * where Strict (uppercase, lowercase)
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereStrict(column: string, operator?: any, value?: any): this;
    /**
     * where group query
     * @param {function} callback callback query
     * @return {this}
     */
    whereQuery(callback: Function): this;
    /**
     * select by cases
     * @param {array} cases array object [{ when : 'id < 7' , then : 'id is than under 7'}]
     * @param {string} as
     * @return {this}
     */
    case(cases: string | any[], as: string): this;
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    join(pk: string, fk: string): this;
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    rightJoin(pk: string, fk: string): this;
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    leftJoin(pk: string, fk: string): this;
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    crossJoin(pk: string, fk: string): this;
    /**
     * sort the result in ASC or DESC order.
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @return {this}
     */
    orderBy(column: string, order?: string | undefined): this;
    /**
     * sort the result in ASC or DESC order. can using with raw query
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @return {this}
     */
    orderByRaw(column: string, order?: string | undefined): this;
    /**
     * sort the result in using DESC for order by.
     * @param {string?} columns [column=id]
     * @return {this}
     */
    latest(...columns: Array<string>): this;
    /**
     * sort the result in using DESC for order by. can using with raw query
     * @param {string?} columns [column=id]
     * @return {this}
     */
    latestRaw(...columns: Array<string>): this;
    /**
     * sort the result in using ASC for order by.
     * @param {string?} columns [column=id]
     * @return {this}
     */
    oldest(...columns: Array<string>): this;
    /**
     * sort the result in using ASC for order by. can using with raw query
     * @param {string?} columns [column=id]
     * @return {this}
     */
    oldestRaw(...columns: Array<string>): this;
    /**
     *
     * @param {string?} columns [column=id]
     * @return {this}
     */
    groupBy(...columns: Array<string>): this;
    /**
    *
    * @param {string?} columns [column=id]
    * @return {this}
    */
    groupByRaw(...columns: Array<string>): this;
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    having(condition: string): this;
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    havingRaw(condition: string): this;
    /**
     *  sort the result in random order.
     * @return {this}
     */
    random(): this;
    /**
     *  sort the result in random order.
     * @return {this}
     */
    inRandom(): this;
    /**
     * limit data
     * @param {number=} number [number=1]
     * @return {this}
     */
    limit(number?: number): this;
    /**
     * limit data
     * @param {number=} number [number=1]
     * @return {this}
     */
    take(number?: number): this;
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    offset(number?: number): this;
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    skip(number?: number): this;
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    hidden(...columns: Array<string>): this;
    /**
     *
     * update data in the database
     * @param {object} data
     * @return {this} this
     */
    update(data: {
        [key: string]: any;
    } & {
        length?: unknown;
    }): this;
    /**
     *
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    insert(data: {
        [key: string]: any;
    } & {
        length?: unknown;
    }): this;
    /**
     *
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    create(data: {
        [key: string]: any;
    } & {
        length?: unknown;
    }): this;
    /**
     *
     * insert muliple data into the database
     * @param {array} data create multiple data
     * @return {this} this this
     */
    createMultiple(data: Array<any>): this;
    /**
     *
     * insert muliple data into the database
     * @param {array} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data: Array<any>): this;
    /**
     *
     * @return {string} return sql query
     */
    toString(): string;
    /**
     *
     * @return {string} return sql query
     */
    toSQL(): string;
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    debug(debug?: boolean): this;
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    dd(debug?: boolean): this;
    /**
     * hook function when execute returned result to callback function
     * @param {Function} func function for callback result
     * @return {this}
    */
    hook(func: Function): this;
    /**
     * hook function when execute returned result to callback function
     * @param {Function} func function for callback result
     * @return {this}
    */
    before(func: Function): this;
    /**
     *
     * @param {object} data create not exists data
     * @return {this} this this
     */
    createNotExists(data: {
        [key: string]: any;
    } & {
        length?: unknown;
    }): this;
    /**
     *
     * @param {object} data insert not exists data
     * @return {this} this this
     */
    insertNotExists(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * check data if exists if exists then return result. if not exists insert data
     * @param {object} data insert data
     * @return {this} this this
     */
    createOrSelect(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrSelect(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrCreate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrInsert(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrUpdate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data create or update data
     * @return {this} this this
     */
    createOrUpdate(data: Record<string, any> & {
        length?: never;
    }): this;
    /**
     *
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.user
     * @param {string} option.password
     * @return {this} this
     */
    connection(options: ConnectionOptions): this;
    /**
     *
     * @param {Function} pool pool connection database
     * @return {this} this
     */
    pool(pool: Connection): this;
    /**
     * make sure this connection has same transaction in pool connection
     * @param {object} connection pool database
     * @return {this} this
     */
    bind(connection: Connection | ConnectionTransaction): this;
    /**
     * exceptColumns for method except
     * @return {promise<string>} string
     */
    protected exceptColumns(): Promise<string>;
    /**
     * execute sql statements with raw sql query
     * @param {string} sql sql execute return data
     * @return {promise<any>}
     */
    rawQuery(sql: string): Promise<any>;
    /**
     *
     * plus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    increment(column?: string, value?: number): Promise<any>;
    /**
     *
     * minus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    decrement(column?: string, value?: number): Promise<any>;
    /**
     * execute data without condition
     * @return {promise<any>}
     */
    all(): Promise<any>;
    /**
     *
     * execute data with where by primary key default = id
     * @param {number} id
     * @return {promise<any>}
     */
    find(id: number): Promise<Record<string, any> | null>;
    /**
     *
     * execute data page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit default 15
     * @param {number} paginationOptions.page default 1
     * @return {promise<Pagination>}
     */
    pagination(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<Pagination>;
    /**
     *
     * execute data useing page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    paginate(paginationOptions?: {
        limit?: number;
        page?: number;
    }): Promise<Pagination>;
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    first(): Promise<{
        [key: string]: any;
    } | null>;
    /**
     *
     * execute data return object | throw rror
     * @return {promise<object | null>}
     */
    findOne(): Promise<{
        [key: string]: any;
    } | null>;
    /**
     *
     * execute data return object | throw Error
     * @return {promise<object | Error>}
     */
    firstOrError(message: string, options?: {
        [key: string]: any;
    }): Promise<{
        [key: string]: any;
    }>;
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    findOneOrError(message: string, options?: {
        [key: string]: any;
    }): Promise<{
        [key: string]: any;
    }>;
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    get(): Promise<Array<any>>;
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    findMany(): Promise<Array<any>>;
    /**
     *
     * execute data return json of result
     * @return {promise<string>}
     */
    toJSON(): Promise<string>;
    /**
     *
     * execute data return array of results
     * @param {string=} column [column=id]
     * @return {promise<Array>}
     */
    toArray(column?: string): Promise<Array<any>>;
    /**
     *
     * execute data return number of results
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
     *
     * execute data return average of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    avg(column?: string): Promise<number>;
    /**
     *
     * execute data return summary of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    sum(column?: string): Promise<number>;
    /**
     *
     * execute data return maximum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    max(column?: string): Promise<number>;
    /**
     *
     * execute data return minimum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    min(column?: string): Promise<number>;
    /**
     *
     * delete data from database
     * @return {promise<boolean>}
     */
    delete(): Promise<boolean>;
    /**
     *
     * delete data from database ignore where condition
     * @return {promise<boolean>}
     */
    forceDelete(): Promise<boolean>;
    /**
     *
     * execute data return Array *grouping results in column
     * @param {string} column
     * @return {promise<Array>}
     */
    getGroupBy(column: string): Promise<Array<any>>;
    /**
     *
     * execute data return grouping results by index
     * @param {string} column
     * @return {promise<Array>}
     */
    findManyGroupBy(column: string): Promise<Array<any>>;
    /**
     * execute data when save *action [insert , update]
     * @return {Promise<any>} promise
     */
    save(): Promise<{
        [key: string]: any;
    } | Array<any> | null | undefined>;
    /**
     *
     * show columns in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    showColumns(table?: string): Promise<Array<string>>;
    /**
     *
     * show schemas in table
     * @param {string=} table [table= current table name]
     * @return {Promise<Array>}
     */
    showSchemas(table?: string): Promise<Array<string>>;
    /**
     *
     * show values in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    showValues(table?: string): Promise<Array<string>>;
    /**
     *
     * backup this database intro new database same server or to another server
     * @param {Object} backupOptions
     * @param {string} backup.database
     * @param {object?} backup.to
     * @param {string} backup.to.host
     * @param {number} backup.to.port
     * @param {string} backup.to.database
     * @param {string} backup.to.username
     * @param {string} backup.to.password

     * @return {Promise<boolean>}
     */
    backup({ database, to }: Backup): Promise<boolean>;
    /**
     *
     * backup database intro file
     * @param {Object}  backupOptions
     * @param {string}  backup.database
     * @param {object?} backup.filePath
     * @param {object?} backup.connection
     * @param {string}  backup.connection.host
     * @param {number}  backup.connection.port
     * @param {string}  backup.connection.database
     * @param {string}  backup.connection.username
     * @param {string}  backup.connection.password

     * @return {Promise<boolean>}
     */
    backupToFile({ filePath, database, connection }: BackupToFile): Promise<void>;
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    faker(rows?: number): Promise<any>;
    /**
     *
     * truncate of table
     * @return {promise<boolean>}
     */
    truncate(): Promise<boolean>;
    /**
     *
     * drop of table
     * @return {promise<boolean>}
     */
    drop(): Promise<boolean>;
    private _queryWhereIsExists;
    private _bindTableAndColumnInQueryWhere;
    private _insertNotExists;
    protected queryStatement(sql: string): Promise<Array<any>>;
    protected actionStatement({ sql, returnId }: {
        sql: string;
        returnId?: boolean;
    }): Promise<any>;
    private _insert;
    private _checkValueHasRaw;
    private _insertMultiple;
    private _insertOrSelect;
    private _updateOrInsert;
    private _update;
    private _hiddenColumn;
    private _queryUpdate;
    private _queryInsert;
    private _queryInsertMultiple;
    private _valueAndOperator;
    private _valueTrueFalse;
    private _buildQuery;
    private _initialConnection;
}
export { Builder };
export default Builder;
