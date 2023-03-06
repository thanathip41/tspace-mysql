"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.PoolConnection = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const options_1 = __importDefault(require("./options"));
const mysql2_1 = require("mysql2");
class PoolConnection {
    /**
     *
     * @Init a options connection pool
     */
    constructor(options) {
        this.OPTIONS = this._loadOptions();
        if (options) {
            this.OPTIONS = new Map(Object.entries(Object.assign(Object.assign({}, Object.fromEntries(this.OPTIONS)), JSON.parse(JSON.stringify(options)))));
        }
    }
    /**
     *
     * Get a connection to database
     * @return {Connection} Connection
     * @property {Function} Connection.query
     * @property {Function} Connection.connection
     */
    connection() {
        const pool = (0, mysql2_1.createPool)(Object.fromEntries(this.OPTIONS));
        if (options_1.default.CONNECTION_ERROR) {
            pool.getConnection((err, _) => {
                if (err == null || !err)
                    return;
                const message = this._messageError.bind(this);
                process.nextTick(() => {
                    console.log(message());
                    return process.exit();
                });
            });
        }
        return {
            query: (sql) => {
                return new Promise((resolve, reject) => {
                    pool.query(sql, (err, results) => {
                        if (err)
                            return reject(err);
                        return resolve(results);
                    });
                });
            },
            connection: () => {
                return new Promise((resolve, reject) => {
                    pool.getConnection((err, connection) => {
                        if (err)
                            return reject(err);
                        const query = (sql) => {
                            return new Promise((resolve, reject) => {
                                connection.query(sql, (err, result) => {
                                    if (err)
                                        return reject(err);
                                    return resolve(result);
                                });
                            });
                        };
                        const startTransaction = () => query('START TRANSACTION');
                        const commit = () => query('COMMIT');
                        const rollback = () => query('ROLLBACK');
                        return resolve({
                            query,
                            startTransaction,
                            commit,
                            rollback
                        });
                    });
                });
            }
        };
    }
    _defaultOptions() {
        return new Map(Object.entries({
            connectionLimit: Number(options_1.default.CONNECTION_LIMIT),
            dateStrings: Boolean(options_1.default.DATE_STRINGS),
            connectTimeout: Number(options_1.default.TIMEOUT),
            waitForConnections: Boolean(options_1.default.WAIT_FOR_CONNECTIONS),
            queueLimit: Number(options_1.default.QUEUE_LIMIT),
            charset: String(options_1.default.CHARSET),
            host: String(options_1.default.HOST),
            port: Number.isNaN(Number(options_1.default.PORT))
                ? 3306
                : Number(options_1.default.PORT),
            database: String(options_1.default.DATABASE),
            user: String(options_1.default.USERNAME),
            password: String(options_1.default.PASSWORD) !== ''
                ? String(options_1.default.PASSWORD)
                : ''
        }));
    }
    _loadOptions() {
        try {
            /**
             *
             * @Json connection
             *
                "host"                  : "",
                "port"                  : "",
                "database"              : "",
                "user"                  : "",
                "password"              : "",
                "connectionLimit"       : "",
                "dateStrings"           : "",
                "connectTimeout"        : "",
                "waitForConnections"    : "",
                "queueLimit"            : "",
                "charset"               : ""
             */
            const jsonPath = path_1.default.join(path_1.default.resolve(), 'tspace-mysql.json');
            const jsonOptionsExists = fs_1.default.existsSync(jsonPath);
            if (!jsonOptionsExists)
                return this._defaultOptions();
            const jsonOptions = fs_1.default.readFileSync(jsonPath, 'utf8');
            const options = JSON.parse(jsonOptions);
            return new Map(Object.entries(options));
        }
        catch (e) {
            return this._defaultOptions();
        }
    }
    _messageError() {
        return `
            \x1b[1m\x1b[31m
            Connection lost to database ! \x1b[0m
            --------------------------------- \x1b[33m
                HOST     : ${this.OPTIONS.get('host')}         
                PORT     : ${this.OPTIONS.get('port')}        
                DATABASE : ${this.OPTIONS.get('database')} 
                USERNAME : ${this.OPTIONS.get('user')}          
                PASSWORD : ${this.OPTIONS.get('password')} \x1b[0m  
            ---------------------------------
        `;
    }
}
exports.PoolConnection = PoolConnection;
/**
 *
 * Connection to database when service is started
 * @return {Connection} Connection
 * @property {Function} Connection.query
 * @property {Function} Connection.connection
 */
const pool = new PoolConnection().connection();
exports.Pool = pool;
exports.default = pool;
