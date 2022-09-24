import AbstractDatabase from './AbstractDatabase';
import { Pagination, Backup, Transaction, ConnectionOptions, BackupToFile } from './Interface';
declare class Database extends AbstractDatabase {
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
    except(...columns: string[]): this;
    /**
     *
     * @param {...string} columns show only colums selected
     * @return {this} this
     */
    only(...columns: string[]): this;
    /**
     *
     * @param {string=} column [column=id]
     * @return {this} this
     */
    distinct(column?: string): this;
    /**
     *
     * @param {string[]} ...columns
     * @return {this} this
     */
    select(...columns: string[]): this;
    /**
     *
     * @param {number} chunk
     * @return {this} this
     */
    chunk(chunk: number): this;
    /**
     *
     * @param {string | number | undefined | null | Boolean} condition when condition true will be callback
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
    where(column: string, operator?: any, value?: any): this;
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
     * @param {string} query where column with raw sql
     * @return {this} this
     */
    whereRaw(sql: string): this;
    /**
     *
     * @param {number} id
     * @param {string?} column custom it *if column is not id
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
     * @param {number} id
     * @param {string?} column custom it *if column is not user_id
     * @return {this}
     */
    whereUser(id: number, column?: string): this;
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
     * where grouping of start statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereGroupStart(column: string, operator?: any, value?: any): this;
    /**
     * or where grouping of start statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    orWhereGroupStart(column: string, operator?: any, value?: any): this;
    /**
     * where grouping of end statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereGroupEnd(column: string, operator?: any, value?: any): this;
    /**
     * where grouping of end statements
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    orWhereGroupEnd(column: string, operator?: any, value?: any): this;
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    having(condition: string): this;
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
     *
     * @param {string} column
     * @param {string=} order [order=asc] asc, desc
     * @return {this}
     */
    orderBy(column: string, order?: string | undefined): this;
    /**
     *
     * @param {string=} column [column=id]
     * @return {this}
     */
    latest(column?: string): this;
    /**
     *
     * @param {string=} column [column=id]
     * @return {this}
     */
    oldest(column?: string): this;
    /**
     *
     * @param {string=} column [column=id]
     * @return {this}
     */
    groupBy(column?: string): this;
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    limit(number?: number): this;
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    offset(number?: number): this;
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    hidden(...columns: string[]): this;
    /**
     *
     * update data in the database
     * @param {object} data
     * @return {this} this
     */
    update(data: object): this;
    /**
     *
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    insert(data: object): this;
    /**
     *
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    create(data: object): this;
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
     *
     * @param {object} data create not exists data
     * @return {this} this this
     */
    createNotExists(data: object): this;
    /**
     *
     * @param {object} data insert not exists data
     * @return {this} this this
     */
    insertNotExists(data: object): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrCreate(data: object): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrInsert(data: object): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrUpdate(data: object): this;
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data create or update data
     * @return {this} this this
     */
    createOrUpdate(data: object): this;
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
     * execute data with where by id
     * @param {number} id
     * @return {promise<any>}
     */
    find(id: number): Promise<any>;
    /**
     *
     * execute data page & limit
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
     * execute data return object | null
     * @return {promise<object | null>}
     */
    findOne(): Promise<{
        [key: string]: any;
    } | null>;
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
     * @param {object} transaction | DB.beginTransaction()
     * @return {Promise<any>}
     */
    save(transaction?: Transaction): Promise<any>;
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
     * @param {string=} table table name
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
     * backup database intro new database same server or to another server
     * @param {Object} backupOptions
     * @param {string} backup.database
     * @param {object?} backup.connection
     * @param {string} backup.connection.host
     * @param {number} backup.connection.port
     * @param {string} backup.connection.database
     * @param {string} backup.connection.username
     * @param {string} backup.connection.password

     * @return {Promise<boolean>}
     */
    backup({ database, connection }: Backup): Promise<boolean>;
    backupToFile({ filePath, database, connection }: BackupToFile): Promise<boolean>;
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any}
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
    private _insertNotExists;
    private _setupPool;
    private _queryStatement;
    private _actionStatement;
    private _create;
    private _createMultiple;
    private _updateOrInsert;
    private _update;
    private _hiddenColumn;
    private _queryUpdate;
    private _queryInsert;
    private _queryInsertMultiple;
    private _valueAndOperator;
    private _valueTrueFalse;
    private _queryGenrate;
    private _setupLogger;
    private _initialConnection;
}
export { Database };
export default Database;
