import { AbstractDB } from './Abstracts/AbstractDB';
import { Connection, ConnectionOptions, ConnectionTransaction } from '../Interface';
/**
 * 'DB' class is a component of the database system
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
    private _initialDB;
}
export { DB };
export default DB;
