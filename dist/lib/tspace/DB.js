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
const AbstractDB_1 = require("./AbstractDB");
const ProxyHandler_1 = require("./ProxyHandler");
const connection_1 = require("../connection");
const StateHandler_1 = __importDefault(require("./StateHandler"));
/**
 * Assign table name
 * @param {string?} table table name
 */
class DB extends AbstractDB_1.AbstractDB {
    constructor(table) {
        super();
        this._initialDB();
        if (table)
            this.table(table);
        return new Proxy(this, ProxyHandler_1.proxyHandler);
    }
    /**
     * Covert result to array
     * @param {any} result table name
     * @return {Array} array
     */
    makeArray(result) {
        switch (this._typeOf(result)) {
            case 'object': {
                if (Object.keys(result).length)
                    return [result];
                return [];
            }
            case 'array': {
                return result;
            }
            case 'undefined':
            case 'null': {
                return [];
            }
            default: return [].concat(result);
        }
    }
    /**
     * Covert result to object or null
     * @param {any} result table name
     * @return {Record | null} object or null
     */
    makeObject(result) {
        switch (this._typeOf(result)) {
            case 'object': {
                if (Object.keys(result).length)
                    return result;
                return null;
            }
            case 'array': {
                if (result[0] == null)
                    return null;
                return result[0];
            }
            case 'undefined':
            case 'null': {
                return null;
            }
            default: return {
                "0": result
            };
        }
    }
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    table(table) {
        this.$state.set('SELECT', `${this.$constants('SELECT')} *`);
        this.$state.set('TABLE_NAME', `\`${table}\``);
        this.$state.set('FROM', `${this.$constants('FROM')}`);
        return this;
    }
    /**
     * Get constant
     * @param {string} constant
     * @return {string | object} string || object
     */
    constants(constant) {
        return this.$constants(constant);
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
     * generate UUID
     * @return {string} string
     */
    generateUUID() {
        return this.$utils.generateUUID();
    }
    /**
     * Assign raw query for schema validation
     * @param {string} sql
     * @return {string} string
     */
    raw(sql) {
        return `${this.$constants('RAW')} ${sql}`;
    }
    /**
     * Get a pool connection
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.username
     * @param {string} option.password
     * @return {Connection}
     */
    getConnection(options) {
        const { host, port, database, username: user, password } = options, others = __rest(options, ["host", "port", "database", "username", "password"]);
        const pool = new connection_1.PoolConnection(Object.assign({ host,
            port,
            database,
            user,
            password }, others));
        return pool.connection();
    }
    /**
     * Covert result to array
     * @param {any} result table name
     * @return {Array} array
     */
    static makeArray(result) {
        switch (new this()._typeOf(result)) {
            case 'object': {
                if (Object.keys(result).length)
                    return [result];
                return [];
            }
            case 'array': {
                return result;
            }
            case 'undefined':
            case 'null': {
                return [];
            }
            default: return [].concat(result);
        }
    }
    /**
     * Covert result to object | null
     * @param {any} result table name
     * @return {Record | null} object | null
     */
    static makeObject(result) {
        switch (new this()._typeOf(result)) {
            case 'object': {
                if (Object.keys(result).length)
                    return result;
                return null;
            }
            case 'array': {
                if (result[0] == null)
                    return null;
                return result[0];
            }
            case 'undefined':
            case 'null': {
                return null;
            }
            default: return {
                "0": result
            };
        }
    }
    /**
     * Get a connection
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
     * Assign table name
     * @static
     * @param {string} table table name
     * @return {DB} DB
     */
    static table(table) {
        const self = new this();
        self.$state.set('SELECT', `${self.$constants('SELECT')} *`);
        self.$state.set('TABLE_NAME', `\`${table}\``);
        self.$state.set('FROM', `${self.$constants('FROM')}`);
        return self;
    }
    /**
     * select by cases
     * @static
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @return {this}
     */
    static caseUpdate(cases, final) {
        if (!cases.length)
            return [];
        const self = new this();
        let query = [];
        for (const c of cases) {
            if (c.when == null)
                throw new Error(`can't find when condition`);
            if (c.then == null)
                throw new Error(`can't find then condition`);
            query = [
                ...query,
                `${self.$constants('WHEN')} ${c.when} ${self.$constants('THEN')} ${c.then}`
            ];
        }
        return [
            self.$constants('RAW'),
            self.$constants('CASE'),
            query.join(' '),
            final == null ? '' : `ELSE ${final}`,
            self.$constants('END'),
        ].join(' ');
    }
    /**
     * Assign raw query for schema validation
     * @static
     * @param {string} sql
     * @return {string} string
     */
    static raw(sql) {
        return `${new this().$constants('RAW')} ${sql}`;
    }
    /**
     * generate UUID
     * @static
     * @return {string} string
     */
    static generateUUID() {
        return new this().$utils.generateUUID();
    }
    /**
     * Get constant
     * @static
     * @param {string} constant
     * @return {string | object} string || object
     */
    static constants(constant) {
        return new this().$constants(constant);
    }
    /**
     * Get a connection
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
            const self = new this();
            const pool = yield self.$pool.get();
            return yield pool.connection();
        });
    }
    /**
     * Get a pool connection
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.username
     * @param {string} option.password
     * @return {Connection}
     */
    static getConnection(options) {
        const { host, port, database, username: user, password } = options, others = __rest(options, ["host", "port", "database", "username", "password"]);
        const pool = new connection_1.PoolConnection(Object.assign({ host,
            port,
            database,
            user,
            password }, others));
        return pool.connection();
    }
    _typeOf(data) {
        return Object.prototype.toString.apply(data).slice(8, -1).toLocaleLowerCase();
    }
    _initialDB() {
        this.$state = new StateHandler_1.default(this.$constants('DB'));
        return this;
    }
}
exports.DB = DB;
exports.default = DB;
