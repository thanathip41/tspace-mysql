"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const AbstractDB_1 = require("./AbstractDB");
const ProxyHandler_1 = require("./ProxyHandler");
class DB extends AbstractDB_1.AbstractDB {
    constructor(table) {
        super();
        this._initialDB();
        if (table)
            this.table(table);
        return new Proxy(this, ProxyHandler_1.proxyHandler);
    }
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    table(table) {
        this.$db.set('SELECT', `${this.$constants('SELECT')} *`);
        this.$db.set('TABLE_NAME', `\`${table}\``);
        this.$db.set('FROM', `${this.$constants('FROM')}`);
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
     * @param {array} cases array
     * @return {string} string
     */
    caseUpdate(cases) {
        if (!cases.length)
            return '';
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
     * Get a connection
     * @return {ConnectionTransaction} object
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    async beginTransaction() {
        const pool = await this.$pool.load();
        return await pool.connection();
    }
    /**
     * Assign table name
     * @static
     * @param {string} table table name
     * @return {DB} DB
     */
    static table(table) {
        const self = new this();
        self.$db.set('SELECT', `${self.$constants('SELECT')} *`);
        self.$db.set('TABLE_NAME', `\`${table}\``);
        self.$db.set('FROM', `${self.$constants('FROM')}`);
        return self;
    }
    /**
     * select by cases
     * @static
     * @param {array} cases array object
     * @return {this}
     */
    static caseUpdate(cases) {
        if (!cases.length)
            return '';
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
     * @return {ConnectionTransaction} object
     * @type     {object} connection
     * @property {function} connection.query - execute query sql then release connection to pool
     * @property {function} connection.startTransaction - start transaction of query
     * @property {function} connection.commit - commit transaction of query
     * @property {function} connection.rollback - rollback transaction of query
     */
    static async beginTransaction() {
        const self = new this();
        const pool = await self.$pool.load();
        return await pool.connection();
    }
    _initialDB() {
        this.$db = this._setupDB();
        return this;
    }
    _setupDB() {
        let db = new Map(Object.entries({ ...this.$constants('DB') }));
        return {
            get: (key) => {
                if (key == null)
                    return db;
                if (!db.has(key))
                    throw new Error(`can't get this [${key}]`);
                return db.get(key);
            },
            set: (key, value) => {
                if (!db.has(key))
                    throw new Error(`can't set this [${key}]`);
                db.set(key, value);
                return;
            },
            clone: (data) => {
                db = new Map(Object.entries({ ...data }));
                return;
            }
        };
    }
}
exports.DB = DB;
exports.default = DB;
