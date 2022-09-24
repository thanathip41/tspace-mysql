"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolConnection = exports.Pool = void 0;
var mysql_1 = require("mysql");
var env_1 = __importDefault(require("../config/env"));
var PoolConnection = /** @class */ (function () {
    function PoolConnection(options) {
        this.OPTIONS = new Map(Object.entries({
            connectionLimit: 10,
            dateStrings: true,
            waitForConnections: false,
            charset: 'utf8mb4',
            host: String(env_1.default.DB_HOST),
            port: Number.isNaN(Number(env_1.default.DB_PORT))
                ? 3306
                : Number(env_1.default.DB_PORT),
            database: String(env_1.default.DB_DATABASE),
            user: String(env_1.default.DB_USERNAME),
            password: String(env_1.default.DB_PASSWORD)
        }));
        if (options) {
            this.OPTIONS = new Map(Object.entries(__assign(__assign({}, Object.fromEntries(this.OPTIONS)), JSON.parse(JSON.stringify(options)))));
        }
    }
    PoolConnection.prototype._pool = function () {
        return (0, mysql_1.createPool)(Object.fromEntries(this.OPTIONS));
    };
    PoolConnection.prototype._messageError = function () {
        console.log("\u001B[1m\u001B[31m\n            Connection lost to database ! \u001B[0m\n            ------------------------------- \u001B[33m\n                DB_HOST     : ".concat(this.OPTIONS.get('host'), "         \n                DB_PORT     : ").concat(this.OPTIONS.get('port'), "        \n                DB_DATABASE : ").concat(this.OPTIONS.get('database'), " \n                DB_USERNAME : ").concat(this.OPTIONS.get('user'), "          \n                DB_PASSWORD : ").concat(this.OPTIONS.get('password'), " \u001B[0m  \n            -------------------------------\n            "));
        return;
    };
    PoolConnection.prototype.connection = function () {
        var _this = this;
        var pool = this._pool();
        pool.getConnection(function (err, connection) {
            if (err) {
                _this._messageError();
                return process.exit();
            }
            if (connection)
                connection.release();
            return;
        });
        return {
            query: function (sql) {
                return new Promise(function (resolve, reject) {
                    pool.query(sql, function (err, results) {
                        if (err)
                            return reject(err);
                        return resolve(results);
                    });
                });
            }
        };
    };
    PoolConnection.prototype.options = function (options) {
        this.OPTIONS = new Map(Object.entries(options));
        return this;
    };
    return PoolConnection;
}());
exports.PoolConnection = PoolConnection;
var Pool = new PoolConnection().connection();
exports.Pool = Pool;
exports.default = Pool;
