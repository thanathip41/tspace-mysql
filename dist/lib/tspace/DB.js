"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const AbstractDB_1 = require("./Abstracts/AbstractDB");
const Proxy_1 = require("./Handlers/Proxy");
const connection_1 = require("../connection");
const State_1 = __importDefault(require("./Handlers/State"));
/**
 * 'DB' class is a component of the database system
 * @param {string?} table table name
 * @example
 * new DB('users').findMany().then(results => console.log(results))
 */
class DB extends AbstractDB_1.AbstractDB {
    constructor(table) {
        super();
        this._initialDB();
        if (table)
            this.table(table);
        return new Proxy(this, Proxy_1.proxyHandler);
    }
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @return {this} this
     */
    table(table) {
        this._setState('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @return {DB} DB
     */
    static table(table) {
        return new this().table(table);
    }
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    jsonObject(object, alias) {
        if (!Object.keys(object).length)
            throw new Error("The method 'jsonObject' is not supported for empty object");
        let maping = [];
        for (const [key, value] of Object.entries(object)) {
            if (/\./.test(value)) {
                const [table, c] = value.split('.');
                maping = [...maping, `'${key}'`, `\`${table}\`.\`${c}\``];
                continue;
            }
            maping = [...maping, `'${key}'`, `\`${this.getTableName()}\`.\`${value}\``];
        }
        return `${this.$constants('JSON_OBJECT')}(${maping.join(' , ')}) ${this.$constants('AS')} \`${alias}\``;
    }
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    static jsonObject(object, alias) {
        return new this().jsonObject(object, alias);
    }
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    JSONObject(object, alias) {
        return this.jsonObject(object, alias);
    }
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @return {string} string
     */
    static JSONObject(object, alias) {
        return new this().jsonObject(object, alias);
    }
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @param {string} key
     * @return {string | object} string || object
     */
    constants(key) {
        return this.$constants(key);
    }
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @static
     * @param {string} key
     * @return {string | object} string || object
     */
    static constants(key) {
        return new this().constants(key);
    }
    /**
     * cases query
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @return {string} string
     */
    caseUpdate(cases, final) {
        if (!cases.length)
            return [];
        let query = [];
        for (const c of cases) {
            if (c.when == null)
                throw new Error(`can't find when condition`);
            if (c.then == null)
                throw new Error(`can't find then condition`);
            query = [
                ...query,
                `${this.$constants('WHEN')} ${c.when} ${this.$constants('THEN')} ${c.then}`
            ];
        }
        return [
            this.$constants('RAW'),
            this.$constants('CASE'),
            query.join(' '),
            final == null ? '' : `ELSE ${final}`,
            this.$constants('END')
        ].join(' ');
    }
    /**
     * select by cases
     * @static
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @return {this}
     */
    static caseUpdate(cases, final) {
        return new this().caseUpdate(cases, final);
    }
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @return {string} string
     */
    generateUUID() {
        return this.$utils.generateUUID();
    }
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @static
     * @return {string} string
     */
    static generateUUID() {
        return new this().generateUUID();
    }
    /**
     * The 'snakeCase' methid is used to covert value to snakeCase pattern.
     * @return {string} string
     */
    snakeCase(value) {
        return this.$utils.snakeCase(value);
    }
    /**
     * The 'snakeCase' methid is used to covert value to snake_case pattern.
     * @return {string} string
     */
    static snakeCase(value) {
        return new this().$utils.snakeCase(value);
    }
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @return {string} string
     */
    camelCase(value) {
        return this.$utils.camelCase(value);
    }
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @return {string} string
     */
    static camelCase(value) {
        return new this().$utils.camelCase(value);
    }
    /**
    * The 'escape' methid is used to escaping SQL injections.
    * @return {string} string
    */
    escape(value) {
        return this.$utils.escape(value);
    }
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @return {string} string
     */
    static escape(value) {
        return new this().$utils.escape(value);
    }
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @return {string} string
     */
    escapeXSS(value) {
        return this.$utils.escapeXSS(value);
    }
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @return {string} string
     */
    static escapeXSS(value) {
        return new this().$utils.escapeXSS(value);
    }
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @param {string} sql
     * @return {string} string
     */
    raw(sql) {
        return `${this.$constants('RAW')} ${sql}`;
    }
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @static
     * @param {string} sql
     * @return {string} string
     */
    static raw(sql) {
        return `${new this().raw(sql)}`;
    }
    /**
     * The 'getConnection' method is used to get a pool connection.
     * @param {Object} options options for connection database with credentials
     * @property {string} option.host
     * @property {number} option.port
     * @property {string} option.database
     * @property {string} option.username
     * @property {string} option.password
     * @return {Connection}
     */
    getConnection(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options == null) {
                const pool = yield this.$pool.get();
                return yield pool.connection();
            }
            const { host, port, database, username: user, password } = options, others = __rest(options, ["host", "port", "database", "username", "password"]);
            const pool = new connection_1.PoolConnection(Object.assign({ host,
                port,
                database,
                user,
                password }, others));
            return yield pool.connection();
        });
    }
    /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @return {Connection}
   */
    static getConnection(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new this().getConnection(options);
        });
    }
    /**
     * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
     *
     * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
     *
     * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
     * ensuring data integrity.
     * @return {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const pool = yield this.$pool.get();
            return yield pool.connection();
        });
    }
    /**
     * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
     *
     * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
     *
     * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
     * ensuring data integrity.
     * @static
     * @return {ConnectionTransaction} object - Connection for the transaction
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    static beginTransaction() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new this().beginTransaction();
        });
    }
    _initialDB() {
        this.$state = new State_1.default(this.$constants('DB'));
        return this;
    }
}
exports.DB = DB;
exports.default = DB;
