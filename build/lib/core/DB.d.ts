import { AbstractDB } from './Abstracts/AbstractDB';
import { Backup, BackupTableToFile, BackupToFile, Connection, ConnectionOptions, ConnectionTransaction, Operator } from '../Interface';
/**
 * 'DB' Class is a component of the database system
 * @param {string?} table table name
 * @example
 * new DB('users').findMany().then(results => console.log(results))
 */
declare class DB extends AbstractDB {
    constructor(table?: string);
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @return {this} this
     */
    table(table: string): this;
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @return {DB} DB
     */
    static table(table: string): DB;
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    jsonObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    static jsonObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    JSONObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    static JSONObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @param {string} key
     * @return {string | object} string || object
     */
    constants(key?: string): string | Record<string, any>;
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @static
     * @param {string} key
     * @return {string | object} string || object
     */
    static constants(key?: string): string | Record<string, any>;
    /**
     * cases query
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @return {string} string
     */
    caseUpdate(cases: {
        when: string;
        then: string;
    }[], final?: string): string | [];
    /**
     * select by cases
     * @static
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @return {this}
     */
    static caseUpdate(cases: {
        when: string;
        then: string;
    }[], final?: string): string | [];
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @return {string} string
     */
    generateUUID(): string;
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @static
     * @return {string} string
     */
    static generateUUID(): string;
    /**
     * The 'snakeCase' methid is used to covert value to snakeCase pattern.
     * @return {string} string
     */
    snakeCase(value: string): string;
    /**
     * The 'snakeCase' methid is used to covert value to snake_case pattern.
     * @return {string} string
     */
    static snakeCase(value: string): string;
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @return {string} string
     */
    camelCase(value: string): string;
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @return {string} string
     */
    static camelCase(value: string): string;
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @return {string} string
     */
    escape(value: string): string;
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @return {string} string
     */
    static escape(value: string): string;
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @return {string} string
     */
    escapeXSS(value: string): string;
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @return {string} string
     */
    static escapeXSS(value: string): string;
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @param {string} sql
     * @return {string} string
     */
    raw(sql: string): string;
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @static
     * @param {string} sql
     * @return {string} string
     */
    static raw(sql: string): string;
    /**
     * The 'op' methid is used to operator for where conditions.
     * @static
     * @param {string} picked
     * @param {any} value
     * @return {string} string
     */
    op<T extends keyof Operator>(picked: T, value: any): string;
    /**
     * The 'op' methid is used to operator for where conditions.
     * @static
     * @param {string} operatorPicked
     * @param {any} value
     * @return {string} string
     */
    static op<T extends keyof Operator>(operatorPicked: T, value: any): string;
    /**
     * The 'getConnection' method is used to get a pool connection.
     * @param {Object} options options for connection database with credentials
     * @property {string} option.host
     * @property {number} option.port
     * @property {string} option.database
     * @property {string} option.username
     * @property {string} option.password
     * @return {Connection}
     */
    getConnection(options?: ConnectionOptions): Promise<Connection>;
    /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @return {Connection}
   */
    static getConnection(options: ConnectionOptions): Promise<Connection>;
    /**
     * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
     *
     * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
     *
     * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
     * ensuring data integrity.
     * @return {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    beginTransaction(): Promise<ConnectionTransaction>;
    /**
     * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
     *
     * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
     *
     * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
     * ensuring data integrity.
     * @static
     * @return {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    static beginTransaction(): Promise<ConnectionTransaction>;
    /**
     * The 'removeProperties' method is used to removed some properties.
     *
     * @param {Array | Record} data
     * @param {string[]} propertiesToRemoves
     * @return {Array | Record} this
     */
    removeProperties(data: any[] | Record<string, any>, propertiesToRemoves: string[]): Array<any> | Record<string, any>;
    /**
     * The 'removeProperties' method is used to removed some properties.
     *
     * @param {Array | Record} data
     * @param {string[]} propertiesToRemoves
     * @return {Array | Record} this
     */
    static removeProperties(data: any[] | Record<string, any>, propertiesToRemoves: string[]): Array<any> | Record<string, any>;
    /**
     *
     * This 'cloneDB' method is used to clone current database to new database
     * @param {string} database clone current database to new database name
     * @return {Promise<boolean>}
     */
    cloneDB(database: string): Promise<void>;
    /**
    *
    * This 'cloneDB' method is used to clone current database to new database
    * @param {string} database clone current database to new database name
    * @return {Promise<boolean>}
    */
    static cloneDB(database: string): Promise<void>;
    /**
     *
     * This 'backup' method is used to backup database intro new database same server or to another server
     * @type     {Object} backup
     * @property {string} backup.database clone current 'db' in connection to this database
     * @type     {object?} backup.to
     * @property {string} backup.to.host
     * @property {number} backup.to.port
     * @property {string} backup.to.username
     * @property {string} backup.to.password
     * @return {Promise<void>}
     */
    backup({ database, to }: Backup): Promise<void>;
    /**
     *
     * This 'backup' method is used to backup database intro new database same server or to another server
     * @type     {Object} backup
     * @property {string} backup.database clone current 'db' in connection to this database
     * @type     {object?} backup.to
     * @property {string} backup.to.host
     * @property {number} backup.to.port
     * @property {string} backup.to.username
     * @property {string} backup.to.password
     * @return {Promise<void>}
     */
    static backup({ database, to }: Backup): Promise<void>;
    /**
     *
     * This 'backupToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    backupToFile({ filePath, database, connection }: BackupToFile): Promise<void>;
    /**
    *
    * This 'backupToFile' method is used to backup database intro new ${file}.sql
    * @type {Object}  backup
    * @property {string} backup.database
    * @property {string} backup.filePath
    * @type     {object?} backup.connection
    * @property {string} backup.connection.host
    * @property {number} backup.connection.port
    * @property {number} backup.connection.database
    * @property {string} backup.connection.username
    * @property {string} backup.connection.password
    * @return {Promise<void>}
    */
    static backupToFile({ filePath, database, connection }: BackupToFile): Promise<void>;
    /**
     *
     * This 'backupSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    backupSchemaToFile({ filePath, database, connection }: BackupToFile): Promise<void>;
    /**
     *
     * This 'backupSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    static backupSchemaToFile({ filePath, database, connection }: BackupToFile): Promise<void>;
    /**
     *
     * This 'backupTableToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    backupTableToFile({ filePath, table, connection }: BackupTableToFile): Promise<void>;
    /**
     *
     * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.table
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    static backupTableToFile({ filePath, table, connection }: BackupTableToFile): Promise<void>;
    /**
     *
     * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    backupTableSchemaToFile({ filePath, table, connection }: BackupTableToFile): Promise<void>;
    /**
     *
     * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.table
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @return {Promise<void>}
     */
    static backupTableSchemaToFile({ filePath, table, connection }: BackupTableToFile): Promise<void>;
    private _backup;
    private _initialDB;
}
export { DB };
export default DB;
