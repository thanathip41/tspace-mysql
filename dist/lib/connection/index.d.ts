import { loadOptionsEnvironment } from './options';
import { Connection, Options } from '../tspace/Interface';
export declare class PoolConnection {
    private OPTIONS;
    /**
     *
     * @Init a options connection pool
     */
    constructor(options?: Options);
    /**
     *
     * Get a connection to database
     * @return {Connection} Connection
     * @property {Function} Connection.query
     * @property {Function} Connection.connection
     */
    connection(): Connection;
    private _defaultOptions;
    private _loadOptions;
    private _convertStringToObject;
    private _covertKeyTypeToCorrectType;
    private _messageError;
}
/**
 *
 * Connection to database when service is started
 * @return {Connection} Connection
 * @property {Function} Connection.query
 * @property {Function} Connection.connection
 */
declare const pool: Connection;
export { pool as Pool };
export { loadOptionsEnvironment };
export default pool;
