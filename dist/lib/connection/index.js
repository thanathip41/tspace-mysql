"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.PoolConnection = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const mysql_1 = require("mysql");
class PoolConnection {
    OPTIONS = this._getJsonOptions();
    constructor(options) {
        if (options) {
            this.OPTIONS = new Map(Object.entries({
                ...Object.fromEntries(this.OPTIONS),
                ...JSON.parse(JSON.stringify(options))
            }));
        }
    }
    /**
     *
     * Set a options connection pool
     * @return {this} this
     */
    options(options) {
        this.OPTIONS = new Map(Object.entries(options));
        return this;
    }
    /**
     *
     * Get a connection pool
     * @return {Connection} Connection
     */
    connection() {
        const pool = (0, mysql_1.createPool)(Object.fromEntries(this.OPTIONS));
        pool.getConnection((err, connection) => {
            if (err) {
                const message = this._messageError.bind(this);
                process.nextTick(() => {
                    console.log(message());
                    return process.exit();
                });
            }
            if (connection)
                connection.release();
        });
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
            connectionLimit: Number.isNaN(Number(env_1.env.DB_CONNECTION_LIMIT))
                ? 10 * 5
                : Number(env_1.env.DB_CONNECTION_LIMIT),
            dateStrings: true,
            connectTimeout: Number.isNaN(Number(env_1.env.DB_TIMEOUT))
                ? 1000 * 30
                : Number.isNaN(Number(env_1.env.DB_TIMEOUT)),
            acquireTimeout: Number.isNaN(Number(env_1.env.DB_TIMEOUT))
                ? 1000 * 30
                : Number.isNaN(Number(env_1.env.DB_TIMEOUT)),
            waitForConnections: true,
            queueLimit: Number.isNaN(Number(env_1.env.DB_QUEUE_LIMIT))
                ? 25
                : Number.isNaN(Number(env_1.env.DB_QUEUE_LIMIT)),
            charset: 'utf8mb4',
            host: String(env_1.env.DB_HOST),
            port: Number.isNaN(Number(env_1.env.DB_PORT))
                ? 3306
                : Number(env_1.env.DB_PORT),
            database: String(env_1.env.DB_DATABASE),
            user: String(env_1.env.DB_USERNAME),
            password: String(env_1.env.DB_PASSWORD)
        }));
    }
    _getJsonOptions() {
        try {
            const jsonPath = path_1.default.join(path_1.default.resolve(), 'tspace-mysql.json');
            const jsonOptionsExists = fs_1.default.existsSync(jsonPath);
            if (jsonOptionsExists) {
                const jsonOptions = fs_1.default.readFileSync(jsonPath, 'utf8');
                const options = JSON.parse(jsonOptions);
                return new Map(Object.entries(options));
            }
            return this._defaultOptions();
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
                DB_HOST     : ${this.OPTIONS.get('host')}         
                DB_PORT     : ${this.OPTIONS.get('port')}        
                DB_DATABASE : ${this.OPTIONS.get('database')} 
                DB_USERNAME : ${this.OPTIONS.get('user')}          
                DB_PASSWORD : ${this.OPTIONS.get('password')} \x1b[0m  
            ---------------------------------
        `;
    }
}
exports.PoolConnection = PoolConnection;
const Pool = new PoolConnection().connection();
exports.Pool = Pool;
exports.default = Pool;
