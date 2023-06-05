import { AbstractDB } from './AbstractDB';
import { Connection, ConnectionOptions, ConnectionTransaction } from './Interface';
declare class DB extends AbstractDB {
    constructor(table?: string);
    union(a: string, b: string): Promise<any[]>;
    /**
     * Covert result to array
     * @param {any} result table name
     * @return {Array} array
     */
    makeArray(result: any): Array<any>;
    /**
     * Covert result to object or null
     * @param {any} result table name
     * @return {Record | null} object or null
     */
    makeObject(result: any): Record<string, any> | null;
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    table(table: string): this;
    /**
     * Get constant
     * @param {string} constant
     * @return {string | object} string || object
     */
    constants(constant?: string): string | {
        [key: string]: any;
    };
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
     * generate UUID
     * @return {string} string
     */
    generateUUID(): string;
    /**
     * Assign raw query for schema validation
     * @param {string} sql
     * @return {string} string
     */
    raw(sql: string): string;
    /**
     * Get a pool connection
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.username
     * @param {string} option.password
     * @return {Connection}
     */
    getConnection(options: ConnectionOptions): Connection;
    /**
     * Covert result to array
     * @param {any} result table name
     * @return {Array} array
     */
    static makeArray(result: any): any[];
    /**
     * Covert result to object | null
     * @param {any} result table name
     * @return {Record | null} object | null
     */
    static makeObject(result: any): Record<string, any> | null;
    /**
     * Get a connection
     * @return {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    beginTransaction(): Promise<ConnectionTransaction>;
    /**
     * Assign table name
     * @static
     * @param {string} table table name
     * @return {DB} DB
     */
    static table(table: string): DB;
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
     * Assign raw query for schema validation
     * @static
     * @param {string} sql
     * @return {string} string
     */
    static raw(sql: string): string;
    /**
     * generate UUID
     * @static
     * @return {string} string
     */
    static generateUUID(): string;
    /**
     * Get constant
     * @static
     * @param {string} constant
     * @return {string | object} string || object
     */
    static constants(constant?: string): string | {
        [key: string]: any;
    };
    /**
     * Get a connection
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
     * Get a pool connection
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.username
     * @param {string} option.password
     * @return {Connection}
     */
    static getConnection(options: ConnectionOptions): Connection;
    private _typeOf;
    private _initialDB;
}
export { DB };
export default DB;
