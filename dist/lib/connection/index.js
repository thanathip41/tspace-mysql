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
                    console.log(message(err === null || err === void 0 ? void 0 : err.message));
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
            connectionLimit: Number.isNaN(Number(options_1.default.CONNECTION_LIMIT)) ? 30 : Number(options_1.default.CONNECTION_LIMIT),
            dateStrings: Boolean(options_1.default.DATE_STRINGS),
            connectTimeout: Number.isNaN(Number(options_1.default.TIMEOUT)) ? 60 * 1000 : Number(options_1.default.TIMEOUT),
            waitForConnections: Boolean(options_1.default.WAIT_FOR_CONNECTIONS),
            queueLimit: Number.isNaN(Number(options_1.default.QUEUE_LIMIT) ? 0 : Number(options_1.default.QUEUE_LIMIT)),
            charset: String(options_1.default.CHARSET),
            host: String(options_1.default.HOST),
            port: Number.isNaN(Number(options_1.default.PORT)) ? 3306 : Number(options_1.default.PORT),
            database: String(options_1.default.DATABASE),
            user: String(options_1.default.USERNAME),
            password: String(options_1.default.PASSWORD) === '' ? '' : String(options_1.default.PASSWORD),
            multipleStatements: options_1.default.MULTIPLE_STATEMENTS || false,
            enableKeepAlive: options_1.default.ENABLE_KEEP_ALIVE || false,
            keepAliveInitialDelay: options_1.default.KEEP_ALIVE_DELAY || 0,
        }));
    }
    _loadOptions() {
        try {
            /**
             *  @source data
             *  source db {
             *       host               = localhost
             *       port               = 3306
             *       database           = npm
             *       user               = root
             *       password           =
             *       connectionLimit    =
             *       dateStrings        =
             *       connectTimeout     =
             *       waitForConnections =
             *       queueLimit         =
             *       charset            =
             *   }
             */
            const dbOptionsPath = path_1.default.join(path_1.default.resolve(), 'db.tspace');
            const dbOptionsExists = fs_1.default.existsSync(dbOptionsPath);
            if (!dbOptionsExists)
                return this._defaultOptions();
            const dbOptions = fs_1.default.readFileSync(dbOptionsPath, 'utf8');
            const options = this._convertStringToObject(dbOptions);
            if (options == null)
                return this._defaultOptions();
            return new Map(Object.entries(options));
        }
        catch (e) {
            return this._defaultOptions();
        }
    }
    _convertStringToObject(str, target = 'db') {
        if (str.toLocaleLowerCase().includes('#ignore'))
            return null;
        str = str.trim();
        const sources = str.split('\n\n');
        if (!sources.length)
            return null;
        const lines = sources[0].split('\r\n');
        if (!lines.length)
            return null;
        const sourceObj = {};
        let targetKey = '';
        for (const line of lines) {
            let [key, value] = line.split('=');
            const sourceKey = key.match(/source\s+(\w+)/);
            const sourceKeyClose = key.match(/}/g);
            if (sourceKey != null) {
                targetKey = sourceKey[1];
                continue;
            }
            if (sourceKeyClose != null && sourceKeyClose.length) {
                targetKey = '';
                continue;
            }
            if (key == null || value == null)
                continue;
            key = key.trim();
            value = value.trim();
            if (!sourceObj.hasOwnProperty(targetKey))
                sourceObj[targetKey] = {};
            sourceObj[targetKey][key] = value;
        }
        return this._covertKeyTypeToCorrectType(sourceObj[target]) || null;
    }
    _covertKeyTypeToCorrectType(data) {
        for (const [key, value] of Object.entries(data)) {
            if (value == null)
                continue;
            if (typeof value === 'string' && ['true', 'false'].some(v => value.toLowerCase() === v)) {
                data[key] = JSON.parse(value.toLowerCase());
                continue;
            }
            if (/^[0-9]+$/.test(value))
                data[key] = +value;
        }
        return data;
    }
    _messageError(err) {
        return `
            \x1b[1m\x1b[31m
            Connection lost to database ! \x1b[0m
            ------------------------------- \x1b[33m
                HOST     : ${this.OPTIONS.get('host')}         
                PORT     : ${this.OPTIONS.get('port')}        
                DATABASE : ${this.OPTIONS.get('database')} 
                USERNAME : ${this.OPTIONS.get('user')}          
                PASSWORD : ${this.OPTIONS.get('password')} \x1b[0m 
            -------------------------------
            \x1b[1m\x1b[31mError Message 
            : ${err !== null && err !== void 0 ? err : ''} \x1b[0m
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
