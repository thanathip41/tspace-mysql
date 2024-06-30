import { EventEmitter } from 'events';
import { loadOptionsEnvironment } from '../options';
import { TConnection, TOptions } from '../types';
export declare class PoolConnection extends EventEmitter {
    private OPTIONS;
    /**
     *
     * @Init a options connection pool
     */
    constructor(options?: TOptions);
    /**
     *
     * Get a connection to database
     * @return {Connection} Connection
     * @property {Function} Connection.query
     * @property {Function} Connection.connection
     */
    connection(): TConnection;
    private _detectEventQuery;
    private _detectQueryType;
    private _defaultOptions;
    private _loadOptions;
    private _loadCache;
    private _convertStringToObject;
    private _covertKeyTypeToCorrectType;
    private _messageConnected;
    private _messageError;
    private _messageSlowQuery;
}
/**
 *
 * Connection to database when service is started
 * @return {Connection} Connection
 * @property {Function} Connection.query
 * @property {Function} Connection.connection
 */
declare const pool: TConnection;
export { loadOptionsEnvironment };
export { pool as Pool };
export default pool;
