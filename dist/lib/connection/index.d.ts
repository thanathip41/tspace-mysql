interface Connection {
    query: (sql: string) => Promise<any[]>;
}
interface Options {
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
declare class PoolConnection {
    [x: string]: any;
    private OPTIONS;
    constructor(options?: Options);
    private _pool;
    private _messageError;
    connection(): Connection;
    options(options: Options): this;
}
declare const Pool: Connection;
export { Pool };
export { PoolConnection };
export default Pool;
