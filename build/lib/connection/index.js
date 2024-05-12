"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.loadOptionsEnvironment = exports.PoolConnection = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mysql2_1 = require("mysql2");
const events_1 = require("events");
const options_1 = __importStar(require("./options"));
Object.defineProperty(exports, "loadOptionsEnvironment", { enumerable: true, get: function () { return options_1.loadOptionsEnvironment; } });
class PoolConnection extends events_1.EventEmitter {
    /**
     *
     * @Init a options connection pool
     */
    constructor(options) {
        super();
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
        /**
         * After the server is listening, verify that the pool has successfully connected to the database.
         * @protected {Pool} pool
         * @returns {void}
         */
        setTimeout(() => {
            pool.getConnection((err, connection) => {
                if (err == null || !err) {
                    this.emit('CONNECTION', pool);
                    connection.query(`SHOW VARIABLES LIKE 'version%'`, (err, results) => {
                        connection.release();
                        if (err)
                            return;
                        const message = [
                            results.find(v => (v === null || v === void 0 ? void 0 : v.Variable_name) === 'version'),
                            results.find(v => (v === null || v === void 0 ? void 0 : v.Variable_name) === 'version_comment')
                        ].map(v => v === null || v === void 0 ? void 0 : v.Value).join(' - ');
                        console.log(this._messageConnected.bind(this)(`${message}.`));
                    });
                    return;
                }
                const message = this._messageError.bind(this);
                process.nextTick(() => {
                    console.log(message(err.message == null || err.message === '' ? err.code : err.message));
                    if (options_1.default.CONNECTION_ERROR)
                        return process.exit();
                });
            });
        }, 1000 * 2);
        pool.on('release', (connection) => {
            this.emit('RELEASE', connection);
        });
        return {
            on: (event, data) => {
                return this.on(event, data);
            },
            query: (sql) => {
                return new Promise((resolve, reject) => {
                    const start = Date.now();
                    pool.query(sql, (err, results) => {
                        if (err)
                            return reject(err);
                        this._detectEventQuery({
                            start,
                            sql,
                            results
                        });
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
                            const start = Date.now();
                            return new Promise((resolve, reject) => {
                                connection.query(sql, (err, results) => {
                                    if (err)
                                        return reject(err);
                                    this._detectEventQuery({ start, sql, results });
                                    return resolve(results);
                                });
                            });
                        };
                        const startTransaction = () => query('START TRANSACTION');
                        const commit = () => query('COMMIT');
                        const rollback = () => query('ROLLBACK');
                        return resolve({
                            on: (event, data) => {
                                return this.on(event, data);
                            },
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
    _detectEventQuery({ start, sql, results }) {
        const duration = Date.now() - start;
        if (duration > 1000 * 5) {
            console.log(`\n\x1b[1m\x1b[31mWARING:\x1b[0m \x1b[1m\x1b[30mSlow query detected: Execution time: ${duration} ms\x1b[0m \n\x1b[33m${sql};\x1b[0m`);
            this.emit('SLOW_QUERY', {
                sql,
                results,
                execution: duration
            });
        }
        this.emit('QUERY', {
            sql,
            results,
            execution: duration
        });
        this.emit(this._detectQueryType(sql), {
            sql,
            results,
            execution: duration
        });
    }
    _detectQueryType(query) {
        const selectRegex = /^SELECT\b/i;
        const updateRegex = /^UPDATE\b/i;
        const insertRegex = /^INSERT\b/i;
        const deleteRegex = /^DELETE\b/i;
        if (selectRegex.test(query))
            return 'SELECT';
        if (updateRegex.test(query))
            return 'UPDATE';
        if (insertRegex.test(query))
            return 'INSERT';
        if (deleteRegex.test(query))
            return 'DELETE';
        return 'UNKNOWN';
    }
    _defaultOptions() {
        return new Map(Object.entries({
            connectionLimit: Number.isNaN(Number(options_1.default.CONNECTION_LIMIT)) ? 30 : Number(options_1.default.CONNECTION_LIMIT),
            dateStrings: Boolean(options_1.default.DATE_STRINGS),
            connectTimeout: Number.isNaN(Number(options_1.default.TIMEOUT)) ? 60 * 1000 : Number(options_1.default.TIMEOUT),
            waitForConnections: Boolean(options_1.default.WAIT_FOR_CONNECTIONS),
            queueLimit: Number.isNaN(Number(options_1.default.QUEUE_LIMIT)) ? 0 : Number(options_1.default.QUEUE_LIMIT),
            charset: String(options_1.default.CHARSET),
            host: String(options_1.default.HOST),
            port: Number.isNaN(Number(options_1.default.PORT)) ? 3306 : Number(options_1.default.PORT),
            database: String(options_1.default.DATABASE),
            user: String(options_1.default.USERNAME),
            password: String(options_1.default.PASSWORD) === '' ? '' : String(options_1.default.PASSWORD),
            multipleStatements: Boolean(options_1.default.MULTIPLE_STATEMENTS || false),
            enableKeepAlive: Boolean(options_1.default.ENABLE_KEEP_ALIVE || false),
            keepAliveInitialDelay: Number.isNaN(Number(options_1.default.KEEP_ALIVE_DELAY || 0) ? 0 : Number(options_1.default.KEEP_ALIVE_DELAY)),
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
    _messageConnected(message) {
        return `
            \x1b[1m\x1b[32m
            Connection established to the database. 
            Version : ${message !== null && message !== void 0 ? message : ''} \x1b[0m
            ------------------------------- \x1b[30m
                HOST     : ${this.OPTIONS.get('host')}         
                PORT     : ${this.OPTIONS.get('port')}        
                DATABASE : ${this.OPTIONS.get('database')}
                USERNAME : ${this.OPTIONS.get('user')}          
                PASSWORD : ${this.OPTIONS.get('password')} \x1b[0m 
            -------------------------------
        `;
    }
    _messageError(message) {
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
            : ${message !== null && message !== void 0 ? message : ''} \x1b[0m
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
//# sourceMappingURL=index.js.map