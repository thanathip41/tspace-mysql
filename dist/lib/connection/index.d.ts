export interface PoolCallback {
    query: (sql: string, callback: (err: any, result: any) => void) => void;
    release: () => void;
}
export interface ConnectionTransaction {
    query: (sql: string) => Promise<any[]>;
    startTransaction: () => Promise<any[]>;
    commit: () => Promise<any[]>;
    rollback: () => Promise<any[]>;
}
export interface Connection {
    query: (sql: string) => Promise<any[]>;
    connection: () => Promise<ConnectionTransaction>;
}
export interface Options {
    [key: string]: any;
    connectionLimit?: number;
    dateStrings?: boolean;
    waitForConnections?: boolean;
    charset?: string;
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
}
export declare class PoolConnection {
    private OPTIONS;
    constructor(options?: Options);
    /**
     *
     * Set a options connection pool
     * @return {this} this
     */
    options(options: Options): this;
    /**
     *
     * Get a connection pool
     * @return {Connection} Connection
     */
    connection(): Connection;
    private _defaultOptions;
    private _getJsonOptions;
    private _messageError;
}
declare const Pool: Connection;
export { Pool };
export default Pool;
