import { AbstractDB } from './Abstracts/AbstractDB';
import { TBackup, TBackupTableToFile, TBackupToFile, TConnection, TConnectionOptions, TConnectionTransaction, TRawStringQuery } from '../types';
/**
 * 'DB' Class is a component of the database system
 * @param {string?} table table name
 * @example
 * new DB('users').findMany().then(results => console.log(results))
 */
declare class DB extends AbstractDB {
    constructor(table?: string);
    /**
     * The 'instance' method is used get instance.
     * @override
     * @static
     * @returns {DB} instance of the DB
     */
    static get instance(): DB;
    /**
     * The 'query' method is used to execute sql statement
     *
     * @param {string} sql
     * @param {Record<string,any>} parameters
     * @returns {promise<any[]>}
     */
    query(sql: string, parameters?: Record<string, any>): Promise<any>;
    /**
     * The 'query' method is used to execute sql statement
     *
     * @param {string} sql
     * @param {Record<string,any>} parameters
     * @returns {promise<any[]>}
     */
    static query(sql: string, parameters?: Record<string, any>): Promise<any[]>;
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @returns {this} this
     */
    table(table: string): this;
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @returns {DB} DB
     */
    static table(table: string): DB;
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
     */
    jsonObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
     */
    static jsonObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
     */
    JSONObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
     */
    static JSONObject(object: Record<string, string>, alias: string): string;
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @param {string} key
     * @returns {string | object} string || object
     */
    constants(key?: string): string | Record<string, any>;
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @static
     * @param {string} key
     * @returns {string | object} string || object
     */
    static constants(key?: string): string | Record<string, any>;
    /**
     * cases query
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @returns {string} string
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
     * @returns {this}
     */
    static caseUpdate(cases: {
        when: string;
        then: string;
    }[], final?: string): string | [];
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @returns {string} string
     */
    generateUUID(): string;
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @static
     * @returns {string} string
     */
    static generateUUID(): string;
    /**
     * The 'snakeCase' methid is used to covert value to snakeCase pattern.
     * @returns {string} string
     */
    snakeCase(value: string): string;
    /**
     * The 'snakeCase' methid is used to covert value to snake_case pattern.
     * @returns {string} string
     */
    static snakeCase(value: string): string;
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @returns {string} string
     */
    camelCase(value: string): string;
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @returns {string} string
     */
    static camelCase(value: string): string;
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @returns {string} string
     */
    escape(value: string): string;
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @returns {string} string
     */
    static escape(value: string): string;
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @returns {string} string
     */
    escapeXSS(value: string): string;
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @returns {string} string
     */
    static escapeXSS(value: string): string;
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @param {string} sql
     * @returns {string} string
     */
    raw(sql: string): TRawStringQuery;
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @static
     * @param {string} sql
     * @returns {string} string
     */
    static raw(sql: string): TRawStringQuery;
    /**
     * The 'getConnection' method is used to get a pool connection.
     * @param {Object} options options for connection database with credentials
     * @property {string} option.host
     * @property {number} option.port
     * @property {string} option.database
     * @property {string} option.username
     * @property {string} option.password
     * @returns {Connection}
     */
    getConnection(options?: TConnectionOptions): Promise<TConnection>;
    /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @returns {Connection}
   */
    static getConnection(options: TConnectionOptions): Promise<TConnection>;
    /**
     * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
     *
     * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
     *
     * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
     * ensuring data integrity.
     * @returns {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    beginTransaction(): Promise<TConnectionTransaction>;
    /**
     * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
     *
     * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
     *
     * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
     * ensuring data integrity.
     * @static
     * @returns {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    static beginTransaction(): Promise<TConnectionTransaction>;
    /**
     * The 'removeProperties' method is used to removed some properties.
     *
     * @param {Array | Record} data
     * @param {string[]} propertiesToRemoves
     * @returns {Array | Record} this
     */
    removeProperties(data: any[] | Record<string, any>, propertiesToRemoves: string[]): Array<any> | Record<string, any>;
    /**
     * The 'removeProperties' method is used to removed some properties.
     *
     * @param {Array | Record} data
     * @param {string[]} propertiesToRemoves
     * @returns {Array | Record} this
     */
    static removeProperties(data: any[] | Record<string, any>, propertiesToRemoves: string[]): Array<any> | Record<string, any>;
    /**
     *
     * This 'cloneDB' method is used to clone current database to new database
     * @param {string} database clone current database to new database name
     * @returns {Promise<boolean>}
     */
    cloneDB(database: string): Promise<void>;
    /**
    *
    * This 'cloneDB' method is used to clone current database to new database
    * @param {string} database clone current database to new database name
    * @returns {Promise<boolean>}
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
     * @returns {Promise<void>}
     */
    backup({ database, to }: TBackup): Promise<void>;
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
     * @returns {Promise<void>}
     */
    static backup({ database, to }: TBackup): Promise<void>;
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
     * @returns {Promise<void>}
     */
    backupToFile({ filePath, database, connection }: TBackupToFile): Promise<void>;
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
    * @returns {Promise<void>}
    */
    static backupToFile({ filePath, database, connection }: TBackupToFile): Promise<void>;
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
     * @returns {Promise<void>}
     */
    backupSchemaToFile({ filePath, database, connection }: TBackupToFile): Promise<void>;
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
     * @returns {Promise<void>}
     */
    static backupSchemaToFile({ filePath, database, connection }: TBackupToFile): Promise<void>;
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
     * @returns {Promise<void>}
     */
    backupTableToFile({ filePath, table, connection }: TBackupTableToFile): Promise<void>;
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
     * @returns {Promise<void>}
     */
    static backupTableToFile({ filePath, table, connection }: TBackupTableToFile): Promise<void>;
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
     * @returns {Promise<void>}
     */
    backupTableSchemaToFile({ filePath, table, connection }: TBackupTableToFile): Promise<void>;
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
     * @returns {Promise<void>}
     */
    static backupTableSchemaToFile({ filePath, table, connection }: TBackupTableToFile): Promise<void>;
    private _backup;
    private _initialDB;
}
export { DB };
export default DB;
