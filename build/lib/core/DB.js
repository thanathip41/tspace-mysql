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
const fs_1 = __importDefault(require("fs"));
const sql_formatter_1 = require("sql-formatter");
const AbstractDB_1 = require("./Abstracts/AbstractDB");
const Proxy_1 = require("./Handlers/Proxy");
const connection_1 = require("../connection");
const State_1 = require("./Handlers/State");
/**
 * 'DB' Class is a component of the database system
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
     * The 'instance' method is used get instance.
     * @override
     * @static
     * @returns {DB} instance of the DB
     */
    static get instance() {
        return new this();
    }
    /**
     * The 'query' method is used to execute sql statement
     *
     * @param {string} sql
     * @param {Record<string,any>} parameters
     * @returns {promise<any[]>}
     */
    query(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, parameters = {}) {
            if (Object.keys(parameters).length) {
                let bindSql = sql;
                for (const key in parameters) {
                    const parameter = parameters[key];
                    if (parameter === null) {
                        bindSql = bindSql.replace(`:${key}`, this.$constants('NULL'));
                        continue;
                    }
                    if (parameter === true || parameter === false) {
                        bindSql = bindSql.replace(`:${key}`, `'${parameter === true ? 1 : 0}'`);
                        continue;
                    }
                    bindSql = bindSql.replace(`:${key}`, Array.isArray(parameter)
                        ? `(${parameter.map(p => `'${this.escape(p)}'`).join(',')})`
                        : `'${this.escape(parameter)}'`);
                }
                return yield this.rawQuery(bindSql);
            }
            return yield this.rawQuery(sql);
        });
    }
    /**
     * The 'query' method is used to execute sql statement
     *
     * @param {string} sql
     * @param {Record<string,any>} parameters
     * @returns {promise<any[]>}
     */
    static query(sql_1) {
        return __awaiter(this, arguments, void 0, function* (sql, parameters = {}) {
            return yield new this().query(sql, parameters);
        });
    }
    /**
     * The 'from' method is used to define the from table name.
     * @param {string} table table name
     * @returns {this} this
     */
    from(table) {
        this.$state.set('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * The 'from' method is used to define the from table name.
     * @param {string} table table name
     * @returns {this} this
     */
    static from(table) {
        return new this().from(table);
    }
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @returns {this} this
     */
    table(table) {
        this.$state.set('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * The 'table' method is used to define the table name.
     * @param {string} table table name
     * @returns {DB} DB
     */
    static table(table) {
        return new this().table(table);
    }
    /**
     * The 'jsonObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
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
     * @returns {string} string
     */
    static jsonObject(object, alias) {
        return new this().jsonObject(object, alias);
    }
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
     */
    JSONObject(object, alias) {
        return this.jsonObject(object, alias);
    }
    /**
     * The 'JSONObject' method is used to specify select data to JSON objects.
     * @static
     * @param {string} object table name
     * @param {string} alias
     * @returns {string} string
     */
    static JSONObject(object, alias) {
        return new this().jsonObject(object, alias);
    }
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @param {string} key
     * @returns {string | object} string || object
     */
    constants(key) {
        return this.$constants(key);
    }
    /**
     * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
     * @static
     * @param {string} key
     * @returns {string | object} string || object
     */
    static constants(key) {
        return new this().constants(key);
    }
    /**
     * cases query
     * @param {arrayObject} cases array object {when , then }
     * @param {string?} final else condition
     * @returns {string} string
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
     * @returns {this}
     */
    static caseUpdate(cases, final) {
        return new this().caseUpdate(cases, final);
    }
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @returns {string} string
     */
    generateUUID() {
        return this.$utils.generateUUID();
    }
    /**
     * The 'generateUUID' methid is used to generate a universal unique identifier.
     * @static
     * @returns {string} string
     */
    static generateUUID() {
        return new this().generateUUID();
    }
    /**
     * The 'snakeCase' methid is used to covert value to snakeCase pattern.
     * @returns {string} string
     */
    snakeCase(value) {
        return this.$utils.snakeCase(value);
    }
    /**
     * The 'snakeCase' methid is used to covert value to snake_case pattern.
     * @returns {string} string
     */
    static snakeCase(value) {
        return new this().$utils.snakeCase(value);
    }
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @returns {string} string
     */
    camelCase(value) {
        return this.$utils.camelCase(value);
    }
    /**
     * The 'camelCase' methid is used to covert value to camelCase pattern.
     * @returns {string} string
     */
    static camelCase(value) {
        return new this().$utils.camelCase(value);
    }
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @returns {string} string
     */
    escape(value) {
        return this.$utils.escape(value, true);
    }
    /**
     * The 'escape' methid is used to escaping SQL injections.
     * @returns {string} string
     */
    static escape(value) {
        return new this().escape(value);
    }
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @returns {string} string
     */
    escapeXSS(value) {
        return this.$utils.escapeXSS(value);
    }
    /**
     * The 'escapeXSS' methid is used to escaping XSS characters.
     * @returns {string} string
     */
    static escapeXSS(value) {
        return new this().escapeXSS(value);
    }
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @param {string} sql
     * @returns {string} string
     */
    raw(sql) {
        return `${this.$constants('RAW')}${sql}`;
    }
    /**
     * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
     * @static
     * @param {string} sql
     * @returns {string} string
     */
    static raw(sql) {
        return `${new this().raw(sql)}`;
    }
    /**
     * The 'freeze' methid is used to freeze the column without any pattern.
     *
     * @param {string} column
     * @returns {string} string
     */
    freeze(column) {
        return `${this.$constants('FREEZE')}${column}`;
    }
    /**
     * The 'freeze' methid is used to freeze the column without any pattern.
     *
     * @static
     * @param {string} column
     * @returns {string} string
     */
    static freeze(column) {
        return new this().freeze(column);
    }
    /**
     * The 'getConnection' method is used to get a pool connection.
     * @param {Object} options options for connection database with credentials
     * @property {string} option.host
     * @property {number} option.port
     * @property {string} option.database
     * @property {string} option.username
     * @property {string} option.password
     * @returns {Connection}
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
            return pool.connection();
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
   * @returns {Connection}
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
     * @returns {ConnectionTransaction} object - Connection for the transaction
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
     * @returns {ConnectionTransaction} object - Connection for the transaction
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
    /**
     * The 'removeProperties' method is used to removed some properties.
     *
     * @param {Array | Record} data
     * @param {string[]} propertiesToRemoves
     * @returns {Array | Record} this
     */
    removeProperties(data, propertiesToRemoves) {
        const setNestedProperty = (obj, path, value) => {
            const segments = path.split('.');
            let currentObj = obj;
            for (let i = 0; i < segments.length - 1; i++) {
                const segment = segments[i];
                if (!currentObj.hasOwnProperty(segment)) {
                    currentObj[segment] = {};
                }
                currentObj = currentObj[segment];
            }
            const lastSegment = segments[segments.length - 1];
            currentObj[lastSegment] = value;
        };
        const remove = (obj, propertiesToRemoves) => {
            const temp = JSON.parse(JSON.stringify(obj));
            for (const property of propertiesToRemoves) {
                if (property == null)
                    continue;
                const properties = property.split('.');
                let current = temp;
                let afterProp = '';
                const props = [];
                for (let i = 0; i < properties.length - 1; i++) {
                    const prop = properties[i];
                    if (current[prop] == null)
                        continue;
                    props.push(prop);
                    if (typeof current[prop] === 'object' && current[prop] != null) {
                        current = current[prop];
                        afterProp = prop;
                        continue;
                    }
                    delete current[prop];
                    afterProp = prop;
                }
                const lastProp = properties[properties.length - 1];
                if (Array.isArray(current)) {
                    setNestedProperty(temp, props.join('.'), this.removeProperties(current, [afterProp, lastProp]));
                    continue;
                }
                if (current[lastProp] == null)
                    continue;
                delete current[lastProp];
            }
            return temp;
        };
        if (Array.isArray(data)) {
            return data.map(obj => remove(obj, propertiesToRemoves));
        }
        return remove(data, propertiesToRemoves);
    }
    /**
     * The 'removeProperties' method is used to removed some properties.
     *
     * @param {Array | Record} data
     * @param {string[]} propertiesToRemoves
     * @returns {Array | Record} this
     */
    static removeProperties(data, propertiesToRemoves) {
        return new this().removeProperties(data, propertiesToRemoves);
    }
    /**
     *
     * This 'cloneDB' method is used to clone current database to new database
     * @param {string} database clone current database to new database name
     * @returns {Promise<boolean>}
     */
    cloneDB(database) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const db = yield this._queryStatement(`${this.$constants('SHOW_DATABASES')} ${this.$constants('LIKE')} '${database}'`);
            if (Object.values((_a = db[0]) !== null && _a !== void 0 ? _a : []).length)
                throw new Error(`This database : '${database}' is already exists`);
            const tables = yield this.showTables();
            const backup = yield this._backup({ tables, database });
            yield this._queryStatement(`${this.$constants('CREATE_DATABASE_NOT_EXISTS')} \`${database}\``);
            const creating = (_a) => __awaiter(this, [_a], void 0, function* ({ table, values }) {
                try {
                    yield this._queryStatement(table);
                    if (values != null && values !== '')
                        yield this._queryStatement(values);
                }
                catch (e) { }
            });
            yield Promise.all(backup.map(b => creating({ table: b.table, values: b.values })));
            return;
        });
    }
    /**
    *
    * This 'cloneDB' method is used to clone current database to new database
    * @param {string} database clone current database to new database name
    * @returns {Promise<boolean>}
    */
    static cloneDB(database) {
        return __awaiter(this, void 0, void 0, function* () {
            return new this().cloneDB(database);
        });
    }
    /**
     *
     * This 'backup' method is used to backup database intro new database same server or to another server
     * @type     {Object} backup
     * @property {string} backup.database clone current 'db' in connection to this database
     * @type     {object?} backup.to
     * @property {string} backup.to.host
     * @property {number} backup.to.port
     * @property {string} backup.to.username
     * @property {string} backup.to.password
     * @returns {Promise<void>}
     */
    backup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ database, to }) {
            if (to != null && Object.keys(to).length)
                this.connection(Object.assign(Object.assign({}, to), { database }));
            return this.cloneDB(database);
        });
    }
    /**
     *
     * This 'backup' method is used to backup database intro new database same server or to another server
     * @type     {Object} backup
     * @property {string} backup.database clone current 'db' in connection to this database
     * @type     {object?} backup.to
     * @property {string} backup.to.host
     * @property {number} backup.to.port
     * @property {string} backup.to.username
     * @property {string} backup.to.password
     * @returns {Promise<void>}
     */
    static backup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ database, to }) {
            return new this().backup({ database, to });
        });
    }
    /**
     *
     * This 'backupToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    backupToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, database = 'db-backup', connection }) {
            var _b;
            const tables = yield this.showTables();
            const backup = (yield this._backup({ tables, database }))
                .map(b => {
                return {
                    table: [
                        `\n--`,
                        `-- Table structure for table '${b.name}'`,
                        `--\n`,
                        `${(0, sql_formatter_1.format)(b.table, {
                            language: 'spark',
                            tabWidth: 2,
                            linesBetweenQueries: 1
                        })}`
                    ].join('\n'),
                    values: b.values !== '' ? [
                        `\n--`,
                        `-- Dumping data for table '${b.name}'`,
                        `--\n`,
                        `${b.values}`
                    ].join('\n') : ''
                };
            });
            if (connection != null && ((_b = Object.keys(connection)) === null || _b === void 0 ? void 0 : _b.length))
                this.connection(connection);
            let sql = [
                `--`,
                `-- tspace-mysql SQL Dump`,
                `-- https://www.npmjs.com/package/tspace-mysql`,
                `--`,
                `-- Host: mysql-db`,
                `-- Generation Time: ${new Date()}\n`,
                `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`,
                `START TRANSACTION;`,
                `SET time_zone = "+00:00";\n`,
                `--`,
                `-- Database: '${database}'`,
                `--\n`,
                `${this.$constants('CREATE_DATABASE_NOT_EXISTS')} \`${database}\`;`,
                `USE \`${database}\`;`,
                `-- --------------------------------------------------------`
            ];
            for (const b of backup) {
                sql = [...sql, b.table];
                if (b.values) {
                    sql = [...sql, b.values];
                }
            }
            fs_1.default.writeFileSync(filePath, [...sql, 'COMMIT;'].join('\n'));
            return;
        });
    }
    /**
    *
    * This 'backupToFile' method is used to backup database intro new ${file}.sql
    * @type {Object}  backup
    * @property {string} backup.database
    * @property {string} backup.filePath
    * @type     {object?} backup.connection
    * @property {string} backup.connection.host
    * @property {number} backup.connection.port
    * @property {number} backup.connection.database
    * @property {string} backup.connection.username
    * @property {string} backup.connection.password
    * @returns {Promise<void>}
    */
    static backupToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, database, connection }) {
            return new this().backupToFile({ filePath, database, connection });
        });
    }
    /**
     *
     * This 'backupSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    backupSchemaToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, database = 'db-backup', connection }) {
            var _b;
            if (connection != null && ((_b = Object.keys(connection)) === null || _b === void 0 ? void 0 : _b.length))
                this.connection(connection);
            const tables = yield this.showTables();
            const backup = (yield this._backup({ tables, database }))
                .map(b => {
                return {
                    table: (0, sql_formatter_1.format)(b.table, {
                        language: 'spark',
                        tabWidth: 2,
                        linesBetweenQueries: 1,
                    }) + "\n"
                };
            });
            let sql = [
                `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`,
                `START TRANSACTION;`,
                `SET time_zone = "+00:00";`,
                `${this.$constants('CREATE_DATABASE_NOT_EXISTS')} \`${database}\`;`,
                `USE \`${database}\`;`
            ];
            for (const b of backup)
                sql = [...sql, b.table];
            fs_1.default.writeFileSync(filePath, [...sql, 'COMMIT;'].join('\n'));
            return;
        });
    }
    /**
     *
     * This 'backupSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    static backupSchemaToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, database, connection }) {
            return new this().backupSchemaToFile({ filePath, database, connection });
        });
    }
    /**
     *
     * This 'backupTableToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    backupTableToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, table, connection }) {
            var _b;
            if (connection != null && ((_b = Object.keys(connection)) === null || _b === void 0 ? void 0 : _b.length))
                this.connection(connection);
            const schemas = yield this.showSchema(table);
            const createTableSQL = [
                `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                `\`${table}\``,
                `(${schemas.join(',')})`,
                `${this.$constants('ENGINE')};`,
            ];
            const values = yield this.showValues(table);
            let valueSQL = [];
            if (values.length) {
                const columns = yield this.showColumns(table);
                valueSQL = [
                    `${this.$constants('INSERT')}`,
                    `\`${table}\``,
                    `(${columns.map((column) => `\`${column}\``).join(',')})`,
                    `${this.$constants('VALUES')} ${values.join(',')};`
                ];
            }
            const sql = [
                (0, sql_formatter_1.format)(createTableSQL.join(' '), {
                    language: 'mysql',
                    tabWidth: 2,
                    linesBetweenQueries: 1,
                }) + "\n",
                valueSQL.join(' ')
            ];
            fs_1.default.writeFileSync(filePath, [...sql, 'COMMIT;'].join('\n'));
            return;
        });
    }
    /**
     *
     * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.table
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    static backupTableToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, table, connection }) {
            return new this().backupTableToFile({ filePath, table, connection });
        });
    }
    /**
     *
     * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.database
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    backupTableSchemaToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, table, connection }) {
            var _b;
            const schemas = yield this.showSchema(table);
            const createTableSQL = [
                `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                `\`${table}\``,
                `(${schemas.join(',')})`,
                `${this.$constants('ENGINE')};`,
            ];
            const sql = [createTableSQL.join(' ')];
            if (connection != null && ((_b = Object.keys(connection)) === null || _b === void 0 ? void 0 : _b.length))
                this.connection(connection);
            fs_1.default.writeFileSync(filePath, (0, sql_formatter_1.format)(sql.join('\n'), {
                language: 'spark',
                tabWidth: 2,
                linesBetweenQueries: 1,
            }));
            return;
        });
    }
    /**
     *
     * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
     * @type {Object}  backup
     * @property {string} backup.table
     * @property {string} backup.filePath
     * @type     {object?} backup.connection
     * @property {string} backup.connection.host
     * @property {number} backup.connection.port
     * @property {number} backup.connection.database
     * @property {string} backup.connection.username
     * @property {string} backup.connection.password
     * @returns {Promise<void>}
     */
    static backupTableSchemaToFile(_a) {
        return __awaiter(this, arguments, void 0, function* ({ filePath, table, connection }) {
            return new this().backupTableSchemaToFile({ filePath, table, connection });
        });
    }
    _backup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ tables, database }) {
            const backup = [];
            for (const table of tables) {
                const schemas = yield this.showSchema(table);
                const createTableSQL = [
                    `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                    `\`${database}\`.\`${table}\``,
                    `(${schemas.join(', ')})`,
                    `${this.$constants('ENGINE')};`,
                ];
                const values = yield this.showValues(table);
                let valueSQL = [];
                if (values.length) {
                    const columns = yield this.showColumns(table);
                    valueSQL = [
                        `${this.$constants('INSERT')}`,
                        `\`${database}\`.\`${table}\``,
                        `(${columns.map((column) => `\`${column}\``).join(', ')})`,
                        `${this.$constants('VALUES')}`,
                        `\n${values.join(',\n')};`
                    ];
                }
                backup.push({
                    name: table == null ? '' : table,
                    table: createTableSQL.join(' '),
                    values: valueSQL.join(' '),
                });
            }
            return backup;
        });
    }
    _initialDB() {
        this.$state = new State_1.StateHandler('db');
        return this;
    }
}
exports.DB = DB;
exports.default = DB;
//# sourceMappingURL=DB.js.map