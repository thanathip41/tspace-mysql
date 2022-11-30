import { AbstractDB } from './AbstractDB';
import { ConnectionTransaction } from '../connection';
declare class DB extends AbstractDB {
    constructor(table?: string);
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
     * @param {array} cases array
     * @return {string} string
     */
    caseUpdate(cases: any[]): string;
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
     * Get a connection
     * @return {ConnectionTransaction} object
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
     * @param {array} cases array object
     * @return {this}
     */
    static caseUpdate(cases: {
        when: string;
        then: string;
    }[]): string;
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
     * @return {ConnectionTransaction} object
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    static beginTransaction(): Promise<ConnectionTransaction>;
    private _initialDB;
    private _setupDB;
}
export { DB };
export default DB;
