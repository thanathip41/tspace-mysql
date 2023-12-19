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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
const DB_1 = require("./DB");
const Schema_1 = require("./Schema");
const AbstractModel_1 = require("./Abstracts/AbstractModel");
const Proxy_1 = require("./Handlers/Proxy");
const State_1 = require("./Handlers/State");
const Relation_1 = require("./Handlers/Relation");
/**
 *
 * 'Model' class is a representation of a database table
 * @example
 * class User extends Model {}
 * new User().findMany().then(users => console.log(users))
 */
class Model extends AbstractModel_1.AbstractModel {
    constructor() {
        super();
        /**
         *
         * @Get initialize for model
         */
        this._initialModel();
        /**
         *
         * @define Setup for model
         */
        this.define();
        this.boot();
        return new Proxy(this, Proxy_1.proxyHandler);
    }
    /**
     * The 'define' method is a special method that you can define within a model.
     * @example
     *  class User extends Model {
     *     define() {
     *       this.useUUID()
     *       this.usePrimaryKey('id')
     *       this.useTimestamp()
     *       this.useSoftDelete()
     *     }
     *  }
     * @return {void} void
     */
    define() { }
    /**
     *  The 'boot' method is a special method that you can define within a model.
     *  @example
     *  class User extends Model {
     *     boot() {
     *       this.useUUID()
     *       this.usePrimaryKey('id')
     *       this.useTimestamp()
     *       this.useSoftDelete()
     *     }
     *  }
     * @return {void} void
     */
    boot() { }
    /**
     * The "useObserve" pattern refers to a way of handling model events using observer classes.
     * Model events are triggered when certain actions occur on models,
     * such as creating, updating, deleting, or saving a record.
     *
     * Observers are used to encapsulate the event-handling logic for these events,
     * keeping the logic separate from the model itself and promoting cleaner, more maintainable code.
     * @param {Function} observer
     * @return this
     * @example
     *
     * class UserObserve {
     *
     *    public created(results : unknown) {
     *       console.log({ results , created : true })
     *    }
     *
     *    public updated(results : unknown) {
     *       console.log({ results ,updated : true })
     *    }
     *
     *    public deleted(results : unknown) {
     *       console.log({ results ,deleted : true })
     *    }
     *   }
     *
     *   class User extends Model {
     *      constructor() {
     *          super()
     *          this.useObserver(UserObserve)
     *      }
     *   }
     */
    useObserver(observer) {
        this._setState('OBSERVER', observer);
        return this;
    }
    /**
     * The "useSchema" method is used to define the schema.
     *
     * It's automatically create, called when not exists table or columns.
     * @param {object} schema using Blueprint for schema
     * @example
     * import { Blueprint } from 'tspace-mysql'
     * class User extends Model {
     *     constructor() {
     *        this.useSchema ({
     *            id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *            uuid        : new Blueprint().varchar(50).null(),
     *            email       : new Blueprint().varchar(50).null(),
     *            name        : new Blueprint().varchar(255).null(),
     *            created_at  : new Blueprint().timestamp().null(),
     *            updated_at  : new Blueprint().timestamp().null()
     *         })
     *     }
     * }
     * @return {this} this
     */
    useSchema(schema) {
        this._setState('SCHEMA_TABLE', schema);
        return this;
    }
    /**
     *
     * The "useRegistry" method is used to define Function to results.
     *
     * It's automatically given Function to results.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useRegistry()
     *     }
     * }
     */
    useRegistry() {
        this._setState('REGISTRY', Object.assign(Object.assign({}, this._getState('REGISTRY')), { '$attach': this._attach, '$detach': this._detach }));
        return this;
    }
    /**
     * The "useLoadRelationsInRegistry" method is used automatically called relations in your registry Model.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useLoadRelationInRegistry()
     *     }
     * }
     */
    useLoadRelationsInRegistry() {
        const relations = this._getState('RELATION').map((r) => String(r.name));
        if (relations.length)
            this.relations(...Array.from(new Set(relations)));
        return this;
    }
    /**
     * The "useBuiltInRelationFunctions" method is used to define the function.
     *
     * It's automatically given built-in relation functions to a results.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useBuiltInRelationsFunction()
     *     }
     * }
     */
    useBuiltInRelationFunctions() {
        this._setState('FUNCTION_RELATION', true);
        return this;
    }
    /**
     * The "usePrimaryKey" method is add primary keys for database tables.
     *
     * @param {string} primary
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.usePrimaryKey()
     *     }
     * }
     */
    usePrimaryKey(primary) {
        this._setState('PRIMARY_KEY', primary);
        return this;
    }
    /**
     * The "useUUID" method is a concept of using UUIDs (Universally Unique Identifiers) as column 'uuid' in table.
     *
     * It's automatically genarate when created a result.
     * @param {string?} column [column=uuid] make new name column for custom column replace uuid with this
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useUUID()
     *     }
     * }
     */
    useUUID(column) {
        this._setState('UUID', true);
        if (column)
            this._setState('UUID_FORMAT', column);
        return this;
    }
    /**
     * The "useDebug" method is viewer raw-sql logs when excute the results.
     * @return {this} this
     */
    useDebug() {
        this._setState('DEBUG', true);
        return this;
    }
    /**
     * The "usePattern" method is used to assign pattern [snake_case , camelCase].
     * @param  {string} pattern
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.usePattern('camelCase')
     *     }
     * }
     */
    usePattern(pattern) {
        const allowPattern = [
            this.$constants('PATTERN').snake_case,
            this.$constants('PATTERN').camelCase
        ];
        this._assertError(!allowPattern.includes(pattern), `tspace-mysql support only pattern ["${this.$constants('PATTERN').snake_case}","${this.$constants('PATTERN').camelCase}"]`);
        this._setState('PATTERN', pattern);
        this._makeTableName();
        return this;
    }
    /**
     * The "useCamelCase" method is used to assign pattern camelCase.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useCamelCase()
     *     }
     * }
     */
    useCamelCase() {
        this._setState('PATTERN', this.$constants('PATTERN').camelCase);
        this._makeTableName();
        return this;
    }
    /**
     * The "SnakeCase" method is used to assign pattern snake_case.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.SnakeCase()
     *     }
     * }
     */
    useSnakeCase() {
        this._setState('PATTERN', this.$constants('PATTERN').snake_case);
        this._makeTableName();
        return this;
    }
    /**
     * The "useSoftDelete" refer to a feature that allows you to "soft delete" records from a database table instead of permanently deleting them.
     *
     * Soft deleting means that the records are not physically removed from the database but are instead marked as deleted by setting a timestamp in a dedicated column.
     *
     * This feature is particularly useful when you want to retain a record of deleted data and potentially recover it later,
     * or when you want to maintain referential integrity in your database
     * @param {string?} column default deleted_at
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useSoftDelete('deletedAt')
     *     }
     * }
     */
    useSoftDelete(column) {
        this._setState('SOFT_DELETE', true);
        if (column)
            this._setState('SOFT_DELETE_FORMAT', column);
        return this;
    }
    /**
     * The "useTimestamp" method is used to assign a timestamp when creating a new record,
     * or updating a record.
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change new name column replace by default [created at]
     * @property {string} timestampFormat.updatedAt - change new name column replace by default updated at
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTimestamp({
     *           createdAt : 'createdAt',
     *           updatedAt : 'updatedAt'
     *        })
     *     }
     * }
     */
    useTimestamp(timestampFormat) {
        this._setState('TIMESTAMP', true);
        if (timestampFormat) {
            this._setState('TIMESTAMP_FORMAT', {
                CREATED_AT: timestampFormat.createdAt,
                UPDATED_AT: timestampFormat.updatedAt
            });
        }
        return this;
    }
    /**
     * This "useTable" method is used to assign the name of the table.
     * @param {string} table table name in database
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTable('setTableNameIsUser') // => 'setTableNameIsUser'
     *     }
     * }
     */
    useTable(table) {
        this._setState('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * This "useTableSingular" method is used to assign the name of the table with signgular pattern.
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTableSingular() // => 'user'
     *     }
     * }
     */
    useTableSingular() {
        var _a;
        const table = this._classToTableName((_a = this.constructor) === null || _a === void 0 ? void 0 : _a.name, { singular: true });
        this._setState('TABLE_NAME', `\`${this._valuePattern(table)}\``);
        return this;
    }
    /**
     * This "useTablePlural " method is used to assign the name of the table with pluarl pattern
     * @return {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTablePlural() // => 'users'
     *     }
     * }
     */
    useTablePlural() {
        var _a;
        const table = this._classToTableName((_a = this.constructor) === null || _a === void 0 ? void 0 : _a.name);
        this._setState('TABLE_NAME', `\`${pluralize_1.default.plural(table)}\``);
        return this;
    }
    /**
     * This 'useValidationSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @return {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useValidationSchema({
     *      id : Number,
     *       uuid :  Number,
     *       name : {
     *           type : String,
     *           require : true
     *           // json : true,
     *           // enum : ["1","2","3"]
     *      },
     *      email : {
     *           type : String,
     *           require : true,
     *           length : 199,
     *           match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
     *           unique : true,
     *           fn : async (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
     *       },
     *       createdAt : Date,
     *       updatedAt : Date,
     *       deletedAt : Date
     *    })
     *  }
     * }
     */
    useValidationSchema(schema) {
        this._setState('VALIDATE_SCHEMA', true);
        this._setState('VALIDATE_SCHEMA_DEFINED', schema);
        return this;
    }
    /**
     * This 'useValidateSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @return {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useValidationSchema({
     *       id : Number,
     *       uuid :  string,
     *       name : {
     *           type : String,
     *           require : true
     *      },
     *      email : {
     *           type : String,
     *           require : true,
     *           length : 199,
     *           // json : true,
     *           // enum : ["1","2","3"]
     *           match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
     *           unique : true,
     *           fn : async (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
     *       },
     *       createdAt : Date,
     *       updatedAt : Date,
     *       deletedAt : Date
     *    })
     *  }
     * }
     */
    useValidateSchema(schema) {
        return this.useValidationSchema(schema);
    }
    /**
     * The "useHooks" method is used to assign hook function when execute returned results to callback function.
     * @param {Function[]} arrayFunctions functions for callback result
     * @return {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.useHook([(results) => console.log(results)])
     *   }
     * }
    */
    useHooks(arrayFunctions) {
        for (const func of arrayFunctions) {
            if (typeof func !== "function")
                throw new Error(`this '${func}' is not a function`);
            this._setState('HOOKS', [...this._getState('HOOKS'), func]);
        }
        return this;
    }
    /**
     * exceptColumns for method except
     * @override
     * @return {promise<string>} string
     */
    exceptColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            const excepts = this._getState('EXCEPTS');
            const hasDot = excepts.some((except) => /\./.test(except));
            const names = excepts.map((except) => {
                if (/\./.test(except))
                    return except.split('.')[0];
                return null;
            }).filter((d) => d != null);
            const tableNames = names.length ? [...new Set(names)] : [this._getState('TABLE_NAME')];
            const removeExcepts = [];
            for (const tableName of tableNames) {
                const isHasSchema = [
                    this._getState('SCHEMA_TABLE') != null,
                    tableName.replace(/`/g, '') === this._getState('TABLE_NAME').replace(/`/g, '')
                ].every(d => d);
                if (isHasSchema) {
                    const columns = Object.keys(this._getState('SCHEMA_TABLE'));
                    const removeExcept = columns.filter((column) => {
                        return excepts.every((except) => {
                            if (/\./.test(except)) {
                                const [table, _] = except.split('.');
                                return except !== `${table}.${column}`;
                            }
                            return except !== column;
                        });
                    });
                    removeExcepts.push(hasDot ? removeExcept.map(r => `${tableName}.${r}`) : removeExcept);
                    continue;
                }
                const sql = [
                    `${this.$constants('SHOW')}`,
                    `${this.$constants('COLUMNS')}`,
                    `${this.$constants('FROM')}`,
                    `${tableName}`
                ].join(' ');
                const rawColumns = yield this._queryStatement(sql);
                const columns = rawColumns.map((column) => column.Field);
                const removeExcept = columns.filter((column) => {
                    return excepts.every((except) => {
                        if (/\./.test(except)) {
                            const [table, _] = except.split('.');
                            return except !== `${table}.${column}`;
                        }
                        return except !== column;
                    });
                });
                removeExcepts.push(hasDot ? removeExcept.map(r => `\`${tableName}\`.${r}`) : removeExcept);
            }
            return removeExcepts.flat();
        });
    }
    /**
     * Build  method for relation in model
     * @param    {string} name name relation registry in your model
     * @param    {Function} callback query callback
     * @return   {this}   this
     */
    buildMethodRelation(name, callback) {
        var _a, _b;
        this.relations(name);
        const relation = this._getState('RELATIONS').find((data) => data.name === name);
        this._assertError(relation == null, `This Relation "${name}" not be register in Model "${(_a = this.constructor) === null || _a === void 0 ? void 0 : _a.name}"`);
        const relationHasExists = (_b = Object.values(this.$constants('RELATIONSHIP'))) === null || _b === void 0 ? void 0 : _b.includes(relation.relation);
        this._assertError(!relationHasExists, `Unknown Relationship in [${this.$constants('RELATIONSHIP')}] !`);
        if (callback == null) {
            relation.query = new relation.model();
            return this;
        }
        relation.query = callback(new relation.model());
        return this;
    }
    /**
     *
     * The 'makeSelectStatement' method is used to make select statement.
     * @return {Promise<string>} string
     */
    makeSelectStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaModel = this.getSchemaModel();
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('SELECT')}`,
                    `${columns.join(', ')}`,
                    `${this.$constants('FROM')}`,
                    `\`${this.getTableName()}\``,
                ].join(' ');
            };
            if (schemaModel == null) {
                const schemaTable = yield this.getSchema();
                const columns = schemaTable.map(column => `\`${this.getTableName()}\`.\`${column.Field}\``);
                return makeStatement(columns);
            }
            const columns = Object.keys(schemaModel).map((column) => `\`${this.getTableName()}\`.\`${column}\``);
            return makeStatement(columns);
        });
    }
    /**
     *
     * The 'makeInsertStatement' method is used to make insert table statement.
     * @return {Promise<string>} string
     */
    makeInsertStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaModel = this.getSchemaModel();
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('INSERT')}`,
                    `\`${this.getTableName()}\``,
                    `(${columns.join(', ')})`,
                    `${this.$constants('VALUES')}`,
                    `(${Array(columns.length).fill('?').join(' , ')})`
                ].join(' ');
            };
            if (schemaModel == null) {
                const schemaTable = yield this.getSchema();
                const columns = schemaTable.map(column => `\`${column.Field}\``);
                return makeStatement(columns);
            }
            const columns = Object.keys(schemaModel).map((column) => `\`${column}\``);
            return makeStatement(columns);
        });
    }
    /**
     *
     * The 'makeUpdateStatement' method is used to make update table statement.
     * @return {Promise<string>} string
     */
    makeUpdateStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaModel = this.getSchemaModel();
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('UPDATE')}`,
                    `\`${this.getTableName()}\``,
                    `${this.$constants('SET')}`,
                    `(${columns.join(', ')})`
                ].join(' ');
            };
            if (schemaModel == null) {
                const schemaTable = yield this.getSchema();
                const columns = schemaTable.map(column => `\`${column.Field}\` = ?`);
                return makeStatement(columns);
            }
            const columns = Object.keys(schemaModel).map((column) => `\`${column}\` = ?`);
            return makeStatement(columns);
        });
    }
    /**
     *
     * The 'makeDeleteStatement' method is used to make delete statement.
     * @return {Promise<string>} string
     */
    makeDeleteStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const makeStatement = () => {
                return [
                    `${this.$constants('DELETE')}`,
                    `${this.$constants('FROM')}`,
                    `\`${this.getTableName()}\``,
                    `${this.$constants('WHERE')}`,
                    `?where_expression`
                ].join(' ');
            };
            return makeStatement();
        });
    }
    /**
     *
     * The 'makeCreateStatement' method is used to make create table statement.
     * @return {Promise<string>} string
     */
    makeCreateStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaModel = this.getSchemaModel();
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                    `\`${this.getTableName()}\``,
                    `(`,
                    `\n${columns === null || columns === void 0 ? void 0 : columns.join(',\n')}`,
                    `\n)`,
                    `${this.$constants('ENGINE')}`
                ].join(' ');
            };
            if (schemaModel == null) {
                const columns = yield this.showSchema();
                return makeStatement(columns);
            }
            let columns = [];
            for (const key in schemaModel) {
                const data = schemaModel[key];
                const { type, attributes } = data;
                columns = [
                    ...columns,
                    `${key} ${type} ${attributes === null || attributes === void 0 ? void 0 : attributes.join(' ')}`
                ];
            }
            return makeStatement(columns);
        });
    }
    /**
     *
     * Clone instance of model
     * @param {Model} instance instance of model
     * @return {this} this
     */
    clone(instance) {
        const copy = Object.fromEntries(instance.$state.get());
        this.$state.clone(copy);
        return this;
    }
    /**
     *
     * Copy an instance of model
     * @param {Model} instance instance of model
     * @param {Object} options keep data
     * @return {Model} Model
     */
    copyModel(instance, options) {
        this._assertError(!(instance instanceof Model), 'Value is not a instanceof Model');
        const copy = Object.fromEntries(instance.$state.get());
        const newInstance = new Model();
        newInstance.$state.clone(copy);
        newInstance.$state.set('SAVE', '');
        newInstance.$state.set('DEBUG', false);
        if ((options === null || options === void 0 ? void 0 : options.insert) == null)
            newInstance.$state.set('INSERT', '');
        if ((options === null || options === void 0 ? void 0 : options.update) == null)
            newInstance.$state.set('UPDATE', '');
        if ((options === null || options === void 0 ? void 0 : options.delete) == null)
            newInstance.$state.set('DELETE', '');
        if ((options === null || options === void 0 ? void 0 : options.where) == null)
            newInstance.$state.set('WHERE', []);
        if ((options === null || options === void 0 ? void 0 : options.limit) == null)
            newInstance.$state.set('LIMIT', '');
        if ((options === null || options === void 0 ? void 0 : options.offset) == null)
            newInstance.$state.set('OFFSET', '');
        if ((options === null || options === void 0 ? void 0 : options.groupBy) == null)
            newInstance.$state.set('GROUP_BY', '');
        if ((options === null || options === void 0 ? void 0 : options.orderBy) == null)
            newInstance.$state.set('ORDER_BY', '');
        if ((options === null || options === void 0 ? void 0 : options.select) == null)
            newInstance.$state.set('SELECT', []);
        if ((options === null || options === void 0 ? void 0 : options.join) == null)
            newInstance.$state.set('JOIN', []);
        return newInstance;
    }
    /**
     *
     * execute the query using raw sql syntax
     * @override method
     * @param {string} sql
     * @return {this} this
     */
    _queryStatement(sql) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this._getState('DEBUG')) {
                    this.$utils.consoleDebug(sql);
                    const result = yield this.$pool.query(sql);
                    return result;
                }
                return yield this.$pool.query(sql);
            }
            catch (error) {
                if ((_a = this._getState('JOIN')) === null || _a === void 0 ? void 0 : _a.length)
                    throw error;
                yield this._checkSchemaOrNextError(error, Number(this._getState('RETRY')));
                this._setState('RETRY', Number(this._getState('RETRY')) + 1);
                return yield this._queryStatement(sql);
            }
        });
    }
    /**
     *
     * execute the query using raw sql syntax actions for insert update and delete
     * @override method
     * @param {Object} actions
     * @property {Function} actions.sqlresult
     * @property {Function} actions.returnId
     * @return {this} this
     */
    _actionStatement({ sql, returnId = false }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this._getState('DEBUG')) {
                    this.$utils.consoleDebug(sql);
                    if (returnId) {
                        const result = yield this.$pool.query(sql);
                        return [result.affectedRows, result.insertId];
                    }
                    const { affectedRows: result } = yield this.$pool.query(sql);
                    return result;
                }
                if (returnId) {
                    const result = yield this.$pool.query(sql);
                    return [result.affectedRows, result.insertId];
                }
                const { affectedRows: result } = yield this.$pool.query(sql);
                return result;
            }
            catch (error) {
                if ((_a = this._getState('JOIN')) === null || _a === void 0 ? void 0 : _a.length)
                    throw error;
                yield this._checkSchemaOrNextError(error, Number(this._getState('RETRY')));
                this._setState('RETRY', Number(this._getState('RETRY')) + 1);
                return yield this._actionStatement({
                    sql,
                    returnId
                });
            }
        });
    }
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    table(table) {
        this._setState('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     *  @param {boolean} condition
     * @return {this} this
     */
    disableSoftDelete(condition = false) {
        this._setState('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @return {this} this
     */
    ignoreSoftDelete(condition = false) {
        this._setState('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign build in function to result of data
     * @param {Record} func
     * @return {this} this
     */
    registry(func) {
        this._setState('REGISTRY', Object.assign(Object.assign({}, func), { attach: this._attach, detach: this._detach }));
        return this;
    }
    /**
     * The 'with' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use 'with' for results of relationship
     *  await new User().relations('posts').findMany()
     *
     */
    with(...nameRelations) {
        var _a;
        this._setState('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'default'));
        return this;
    }
    /**
     * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method ignore soft delete
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withAll(...nameRelations) {
        var _a;
        this._setState('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'all'));
        return this;
    }
    /**
    * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
    *
    * Eager loading allows you to retrieve a primary model and its related models in a more efficient
    * It's method ignore soft delete
    * @param {...string} nameRelations if data exists return blank
    * @return {this} this
    */
    withCount(...nameRelations) {
        var _a;
        this._setState('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'count'));
        return this;
    }
    /**
     * The 'withTrashed' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return results only in trash (soft deleted)
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withTrashed(...nameRelations) {
        var _a;
        this._setState('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'trashed'));
        return this;
    }
    /**
     * The 'withExists' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @return {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().relationsExists('posts').findMany()
     */
    withExists(...nameRelations) {
        var _a;
        this._setState('RELATIONS_EXISTS', true);
        this._setState('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'exists'));
        return this;
    }
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().has('posts').findMany()
     * @return {this} this
     */
    has(...nameRelations) {
        return this.withExists(...nameRelations);
    }
    /**
     *
     * The 'withQuery' method is particularly useful when you want to filter or add conditions records based on related data.
     *
     * Use relation '${name}' registry models then return callback queries
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *
     *   class Comment extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'users' , model : User })
     *           this.belongsTo({ name : 'post' , model : Post })
     *       }
     *   }
     *
     *   await new User().relations('posts')
     *   .relationsQuery('posts', (query : Post) => {
     *       return query.relations('comments','user')
     *       .relationsQuery('comments', (query : Comment) => {
     *           return query.relations('user','post')
     *       })
     *       .relationsQuery('user', (query : User) => {
     *           return query.relations('posts').relationsQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @return {this} this
     */
    withQuery(nameRelation, callback) {
        var _a;
        this.with(nameRelation);
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.callback(nameRelation, callback);
        return this;
    }
    /**
     *
     * Use relations in registry of model return result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship
     *  await new User().relations('posts').findMany()
     * @return {this} this
     */
    relations(...nameRelations) {
        return this.with(...nameRelations);
    }
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *  // use with for results of relationship if relations is exists
     *  await new User().relationsExists('posts').findMany()
     * @return {this} this
     */
    relationsExists(...nameRelations) {
        return this.withExists(...nameRelations);
    }
    /**
     *
     * Use relation '${name}' registry of model return callback this query model
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @example
     *   import { Model } from 'tspace-mysql'
     *   class User extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'posts' , model : Post })
     *       }
     *   }
     *
     *   class Post extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'comments' , model : Comment })
     *           this.belongsTo({ name : 'user' , model : User })
     *       }
     *   }
     *
     *   class Comment extends Model {
     *       constructor(){
     *           super()
     *           this.hasMany({ name : 'users' , model : User })
     *           this.belongsTo({ name : 'post' , model : Post })
     *       }
     *   }
     *
     *   await new User().relations('posts')
     *   .relationQuery('posts', (query : Post) => {
     *       return query.relations('comments','user')
     *       .relationQuery('comments', (query : Comment) => {
     *           return query.relations('user','post')
     *       })
     *       .relationQuery('user', (query : User) => {
     *           return query.relations('posts').relationQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @return {this} this
     */
    relationQuery(nameRelation, callback) {
        return this.withQuery(nameRelation, callback);
    }
    /**
     *
     * Use relations in registry of model return ignore soft deleted
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    relationsAll(...nameRelations) {
        return this.withAll(...nameRelations);
    }
    /**
     *
     * Use relations in registry of model return only in trash (soft delete)
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    relationsTrashed(...nameRelations) {
        return this.withTrashed(...nameRelations);
    }
    /**
     * The 'hasOne' relationship defines a one-to-one relationship between two database tables.
     *
     * It indicates that a particular record in the primary table is associated with one and only one record in the related table.
     *
     * This is typically used when you have a foreign key in the related table that references the primary table.
     *
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @return   {this}   this
     */
    hasOne({ name, as, model, localKey, foreignKey, freezeTable }) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.hasOne({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        });
        return this;
    }
    /**
     * The 'hasMany' relationship defines a one-to-many relationship between two database tables.
     *
     * It indicates that a record in the primary table can be associated with multiple records in the related table.
     *
     * This is typically used when you have a foreign key in the related table that references the primary table.
     *
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @return   {this}   this
     */
    hasMany({ name, as, model, localKey, foreignKey, freezeTable }) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.hasMany({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        });
        return this;
    }
    /**
     * The 'belongsTo' relationship defines a one-to-one or many-to-one relationship between two database tables.
     *
     * It indicates that a record in the related table belongs to a single record in the primary table.
     *
     * This is typically used when you have a foreign key in the primary table that references the related table.
     *
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @return   {this}   this
     */
    belongsTo({ name, as, model, localKey, foreignKey, freezeTable }) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.belongsTo({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        });
        return this;
    }
    /**
     * The 'belongsToMany' relationship defines a many-to-many relationship between two database tables.
     *
     * It indicates that records in both the primary table and the related table can be associated
     * with multiple records in each other's table through an intermediate table.
     *
     * This is commonly used when you have a many-to-many relationship between entities, such as users and roles or products and categories.
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable freeae table name
     * @property {string} relation.pivot table name of pivot
     * @property {string} relation.oldVersion return value of old version
     * @property {class?} relation.modelPivot model for pivot
     * @return   {this}   this
     */
    belongsToMany({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.belongsToMany({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            oldVersion,
            modelPivot
        });
        return this;
    }
    /**
     * The 'hasOneBuilder' method is useful for creating 'hasOne' relationship to function
     *
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}   model
     * @property {string?} name
     * @property {string?} as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {Function?} callback callback of query
     * @return   {this} this
     */
    hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.hasOneBuilder({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        }, callback);
        return this;
    }
    /**
     * The 'hasManyBuilder' method is useful for creating 'hasMany' relationship to function
     *
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}  model
     * @property {string?} name
     * @property {string?}  as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @return   {this} this
     */
    hasManyBuilder({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.hasManyBuilder({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        }, callback);
        return this;
    }
    /**
     * The 'belongsToBuilder' method is useful for creating 'belongsTo' relationship to function
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}  model
     * @property {string?} name
     * @property {string?}  as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @return   {this} this
     */
    belongsToBuilder({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.belongsToBuilder({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable
        }, callback);
        return this;
    }
    /**
     * The 'belongsToManyBuilder' method is useful for creating 'belongsToMany' relationship to function
     * @param    {object}  relation registry relation in your model
     * @type     {object}  relation
     * @property {class}  model
     * @property {string?} name
     * @property {string?}  as
     * @property {string?} localKey
     * @property {string?} foreignKey
     * @property {string?} freezeTable
     * @param    {function?} callback callback of query
     * @return   {this} this
     */
    belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }, callback) {
        var _a;
        (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.belongsToManyBuilder({
            name,
            as,
            model,
            localKey,
            foreignKey,
            freezeTable,
            pivot,
            oldVersion,
            modelPivot
        }, callback);
        return this;
    }
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @return {this} this
     */
    onlyTrashed() {
        this.disableSoftDelete();
        this.whereNotNull(this._valuePattern(this._getState('SOFT_DELETE_FORMAT')));
        return this;
    }
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @return {this} this
     */
    trashed() {
        return this.onlyTrashed();
    }
    /**
     * restore data in trashed
     * @return {promise}
     */
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            this.disableSoftDelete();
            const updatedAt = this._valuePattern(this._getState('TIMESTAMP_FORMAT').UPDATED_AT);
            const deletedAt = this._valuePattern(this._getState('SOFT_DELETE_FORMAT'));
            const query = this._getState('TIMESTAMP')
                ? `${deletedAt} = NULL , ${updatedAt} = '${this.$utils.timestamp()}'`
                : `${deletedAt} = NULL`;
            this._setState('UPDATE', [
                `${this.$constants('UPDATE')}`,
                `${this._getState('TABLE_NAME')}`,
                `SET ${query}`
            ].join(' '));
            this._setState('SAVE', 'UPDATE');
            return yield this.save();
        });
    }
    toTableName() {
        return this.getTableName();
    }
    toTableNameAndColumn(column) {
        return `\`${this.getTableName()}\`.\`${this._valuePattern(column)}\``;
    }
    /**
     * @override Method
     * @return {promise<boolean>} promise boolean
     */
    delete() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this._getState('where').length, "This method 'delete' is require to use 'where' conditions");
            this.limit(1);
            if (this._getState('SOFT_DELETE')) {
                const deletedAt = this._valuePattern(this._getState('SOFT_DELETE_FORMAT'));
                const sql = new Model()
                    .copyModel(this, { where: true, limit: true })
                    .bind(this.$pool.get())
                    .update({
                    [deletedAt]: this.$utils.timestamp()
                })
                    .toString();
                const result = yield this._actionStatement({ sql });
                const r = Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
                this._observer(r, 'updated');
                return r;
            }
            this._setState('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this._getState('FROM')}`,
                `${this._getState('TABLE_NAME')}`,
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            const r = Boolean(this._resultHandler((_b = !!result) !== null && _b !== void 0 ? _b : false));
            this._observer(r, 'deleted');
            return r;
        });
    }
    /**
     * @override Method
     * @return {promise<boolean>} promise boolean
     */
    deleteMany() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this._getState('where').length, "This method 'delete' is require to use 'where' conditions");
            if (this._getState('SOFT_DELETE')) {
                const deletedAt = this._valuePattern(this._getState('SOFT_DELETE_FORMAT'));
                const sql = new Model()
                    .copyModel(this, { where: true, limit: true })
                    .bind(this.$pool.get())
                    .updateMany({
                    [deletedAt]: this.$utils.timestamp()
                })
                    .toString();
                const result = yield this._actionStatement({ sql });
                const r = Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
                this._observer(r, 'updated');
                return r;
            }
            this._setState('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this._getState('FROM')}`,
                `${this._getState('TABLE_NAME')}`,
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            const r = Boolean(this._resultHandler((_b = !!result) !== null && _b !== void 0 ? _b : false));
            this._observer(r, 'deleted');
            return r;
        });
    }
    /**
     * @override Method
     * @return {promise<Record<string,any> | null>} Record | null
    */
    first() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('first');
            if (this._getState('VOID'))
                return this._resultHandler(undefined);
            if ((_a = this._getState('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            this.limit(1);
            if (this._getState('RELATIONS_EXISTS')) {
                return yield this._execute({
                    sql: String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists()),
                    type: 'FIRST'
                });
            }
            return yield this._execute({
                sql: this._queryBuilder().select(),
                type: 'FIRST'
            });
        });
    }
    /**
     * @override Method
     * @return {promise<Record<string,any> | null>} Record | null
    */
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.first();
        });
    }
    /**
     * @override Method
     * @return {promise<object | Error>} Record | throw error
    */
    firstOrError(message, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('firstOrError');
            if ((_a = this._getState('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            this.limit(1);
            if (this._getState('RELATIONS_EXISTS')) {
                return yield this._execute({
                    sql: String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists()),
                    type: 'FIRST_OR_ERROR', message, options
                });
            }
            return yield this._execute({
                sql: this._queryBuilder().select(),
                type: 'FIRST_OR_ERROR',
                message,
                options
            });
        });
    }
    /**
     *
     * @override Method
     * @return {promise<any>} Record | throw error
    */
    findOneOrError(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.firstOrError(message, options);
        });
    }
    /**
     *
     * @override Method
     * @return {promise<array>} Array
    */
    get() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('get');
            if (this._getState('VOID'))
                return [];
            if ((_a = this._getState('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            let sql = this._queryBuilder().select();
            if (this._getState('RELATIONS_EXISTS'))
                sql = String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists());
            return yield this._execute({
                sql,
                type: 'GET'
            });
        });
    }
    /**
     *
     * @override Method
     * @return {promise<array>} Array
    */
    findMany() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get();
        });
    }
    /**
     * @override Method
     * @param {object?} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @return {promise<Pagination>} Pagination
     */
    pagination(paginationOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('pagination');
            let limit = 15;
            let page = 1;
            if (paginationOptions != null) {
                limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
            }
            if ((_a = this._getState('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            const offset = (page - 1) * limit;
            this._setState('PER_PAGE', limit);
            this._setState('PAGE', page);
            this.limit(limit);
            this.offset(offset);
            let sql = this._queryBuilder().select();
            if (this._getState('RELATIONS_EXISTS'))
                sql = String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists());
            return yield this._execute({
                sql,
                type: 'PAGINATION'
            });
        });
    }
    /**
    *
    * @override Method
    * @param    {?object} paginationOptions by default page = 1 , limit = 15
    * @property {number}  paginationOptions.limit
    * @property {number}  paginationOptions.page
    * @return   {promise<Pagination>} Pagination
    */
    paginate(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pagination(paginationOptions);
        });
    }
    /**
     * @override Method
     * @param {string} column
     * @return {Promise<array>} Array
     */
    getGroupBy(column) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this._getState('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            this.selectRaw([
                `\`${column}\`,`,
                `${this.$constants('GROUP_CONCAT')}(id)`,
                `${this.$constants('AS')} \`data\``
            ].join(' '));
            this.groupBy(column);
            const sql = this._queryBuilder().select();
            const results = yield this._queryStatement(sql);
            let data = [];
            results.forEach((result) => {
                var _a, _b;
                const splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                splits.forEach((split) => data = [...data, split]);
            });
            const sqlChild = new Model()
                .copyModel(this)
                .select('*')
                .whereIn('id', data.map((a) => `\'${a}\'`))
                .toString();
            const childData = yield this._queryStatement(sqlChild);
            const child = yield this._executeGroup(childData);
            const resultData = results.map((result) => {
                const id = result[column];
                const newData = child.filter((data) => data[column] === id);
                return ({
                    [column]: id,
                    data: newData
                });
            });
            return this._resultHandler(resultData);
        });
    }
    /**
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    insert(data) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
        this._setState('DATA', data);
        const query = this._queryInsertModel(data);
        this._setState('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this._getState('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this._setState('SAVE', 'INSERT');
        return this;
    }
    /**
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    create(data) {
        return this.insert(data);
    }
    /**
     * @override Method
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @return {this} this
     */
    update(data, updateNotExists = []) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
        if (updateNotExists.length) {
            for (const c of updateNotExists) {
                for (const column in data) {
                    if (c !== column)
                        continue;
                    const value = data[column];
                    data[column] = this._updateHandler(column, value);
                    break;
                }
            }
        }
        this._setState('DATA', data);
        this.limit(1);
        const query = this._queryUpdateModel(data);
        this._setState('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this._getState('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this._setState('SAVE', 'UPDATE');
        return this;
    }
    /**
     * @override Method
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @return {this} this
     */
    updateMany(data, updateNotExists = []) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
        if (updateNotExists.length) {
            for (const c of updateNotExists) {
                for (const column in data) {
                    if (c !== column)
                        continue;
                    const value = data[column];
                    data[column] = this._updateHandler(column, value);
                    break;
                }
            }
        }
        this._setState('DATA', data);
        const query = this._queryUpdateModel(data);
        this._setState('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this._getState('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this._setState('SAVE', 'UPDATE');
        return this;
    }
    /**
     * @override Method
     * @param {object} data
     * @return {this} this
     */
    updateNotExists(data) {
        this.limit(1);
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
        for (const column in data) {
            const value = data[column];
            data[column] = this._updateHandler(column, value);
        }
        this._setState('DATA', data);
        const query = this._queryUpdateModel(data);
        this._setState('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this._getState('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this._setState('SAVE', 'UPDATE');
        return this;
    }
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrCreate(data) {
        this.limit(1);
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
        const queryUpdate = this._queryUpdateModel(data);
        const queryInsert = this._queryInsertModel(data);
        this._setState('DATA', data);
        this._setState('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this._getState('TABLE_NAME')}`,
            `${queryInsert}`
        ].join(' '));
        this._setState('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this._getState('TABLE_NAME')}`,
            `${queryUpdate}`
        ].join(' '));
        this._setState('SAVE', 'UPDATE_OR_INSERT');
        return this;
    }
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrInsert(data) {
        return this.updateOrCreate(data);
    }
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    insertOrUpdate(data) {
        return this.updateOrCreate(data);
    }
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    createOrUpdate(data) {
        return this.updateOrCreate(data);
    }
    /**
     * @override Method
     * @param {object} data for create
     * @return {this} this
     */
    createOrSelect(data) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
        this._setState('DATA', data);
        const queryInsert = this._queryInsertModel(data);
        this._setState('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this._getState('TABLE_NAME')}`,
            `${queryInsert}`
        ].join(' '));
        this._setState('SAVE', 'INSERT_OR_SELECT');
        return this;
    }
    /**
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    insertOrSelect(data) {
        return this.createOrSelect(data);
    }
    /**
     * @override Method
     * @param {Record<string,any>[]} data create multiple data
     * @return {this} this this
     */
    createMultiple(data) {
        this._setState('DATA', data);
        const query = this._queryInsertMultipleModel(data);
        this._setState('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this._getState('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this._setState('SAVE', 'INSERT_MULTIPLE');
        return this;
    }
    /**
     *
     * @override Method
     * @param {Record<string,any>[]} data create multiple data
     * @return {this} this
     */
    insertMultiple(data) {
        return this.createMultiple(data);
    }
    /**
     * @override Method
     * @param {object} data create not exists data
     * @return {this} this
     */
    createNotExists(data) {
        this._assertError(Array.isArray(data), 'Data must be an array. Only object are supported');
        this._setState('DATA', data);
        const query = this._queryInsertModel(data);
        this._setState('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this._getState('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this._setState('SAVE', 'INSERT_NOT_EXISTS');
        return this;
    }
    /**
     * @override Method
     * @param {object} data create not exists data
     * @return {this} this this
     */
    insertNotExists(data) {
        return this.createNotExists(data);
    }
    getSchemaModel() {
        return this._getState('SCHEMA_TABLE');
    }
    validation(schema) {
        this._setState('VALIDATE_SCHEMA', true);
        this._setState('VALIDATE_SCHEMA_DEFINED', schema);
        return this;
    }
    /**
     * The 'bindPattern' method is used to covert column relate with pattern
     * @param {string} column
     * @return {string} return table.column
     */
    bindPattern(column) {
        return this._valuePattern(column);
    }
    /**
     * @override Method
     * @return {Promise<Record<string,any> | any[] | null | undefined>}
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const attributes = this.$attributes;
            if (attributes != null) {
                while (true) {
                    if (!this._getState('where').length) {
                        this.create(attributes);
                        break;
                    }
                    this.update(attributes);
                    break;
                }
            }
            this._validateMethod('save');
            switch (String(this._getState('SAVE'))) {
                case 'INSERT': return yield this._insertModel();
                case 'UPDATE': return yield this._updateModel();
                case 'INSERT_MULTIPLE': return yield this._createMultipleModel();
                case 'INSERT_NOT_EXISTS': return yield this._insertNotExistsModel();
                case 'UPDATE_OR_INSERT': return yield this._updateOrInsertModel();
                case 'INSERT_OR_SELECT': return yield this._insertOrSelectModel();
                default: throw new Error(`Unknown this [${this._getState('SAVE')}]`);
            }
        });
    }
    /**
     *
     * @override Method
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    faker(rows = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('FIELDS')}`,
                `${this.$constants('FROM')}`,
                `${this._getState('TABLE_NAME')}`
            ].join(' ');
            const fields = yield this._queryStatement(sql);
            for (let row = 0; row < rows; row++) {
                this._assertError(this._getState('TABLE_NAME') === '' || this._getState('TABLE_NAME') == null, "Unknow this table");
                let columnAndValue = {};
                for (const { Field: field, Type: type } of fields) {
                    const deletedAt = this._valuePattern(this._getState('SOFT_DELETE_FORMAT'));
                    const passed = ['id', '_id', 'uuid', deletedAt].some(p => field === p);
                    if (passed)
                        continue;
                    columnAndValue = Object.assign(Object.assign({}, columnAndValue), { [field]: this.$utils.faker(type) });
                }
                data = [...data, columnAndValue];
            }
            return yield this.createMultiple(data).save();
        });
    }
    _valuePattern(value) {
        switch (this._getState('PATTERN')) {
            case this.$constants('PATTERN').snake_case: {
                return value.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`);
            }
            case this.$constants('PATTERN').camelCase: {
                return value.replace(/(.(\_|-|\s)+.)/g, (str) => `${str[0]}${str[str.length - 1].toUpperCase()}`);
            }
            default: return value;
        }
    }
    _isPatternSnakeCase() {
        return this._getState('PATTERN') === this.$constants('PATTERN').snake_case;
    }
    _classToTableName(className, { singular = false } = {}) {
        if (className == null)
            className = this.constructor.name;
        const tb = className.replace(/([A-Z])/g, (str) => '_' + str.toLowerCase()).slice(1);
        if (singular)
            return pluralize_1.default.singular(this._valuePattern(tb));
        return pluralize_1.default.plural(this._valuePattern(tb));
    }
    _makeTableName() {
        const tableName = this._classToTableName();
        this._setState('TABLE_NAME', `\`${tableName}\``);
        return this;
    }
    _handleSoftDelete() {
        if (this._getState('SOFT_DELETE')) {
            const deletedAt = this._valuePattern(this._getState('SOFT_DELETE_FORMAT'));
            const wheres = this._getState('WHERE');
            const softDeleteIsNull = [
                this.bindColumn(`${this.getTableName()}.${deletedAt}`),
                this.$constants('IS_NULL')
            ].join(' ');
            if (!wheres.some((where) => where.includes(softDeleteIsNull))) {
                this.whereNull(deletedAt);
                return this;
            }
            return this;
        }
        return this;
    }
    /**
     *
     * generate sql statements
     * @override
     */
    _queryBuilder() {
        this._handleSoftDelete();
        return this._buildQueryStatement();
    }
    _showOnly(data) {
        let result = [];
        const hasNameRelation = this._getState('RELATIONS').map((w) => { var _a; return (_a = w.as) !== null && _a !== void 0 ? _a : w.name; });
        data.forEach((d) => {
            let newData = {};
            this._getState('ONLY').forEach((only) => {
                if (d.hasOwnProperty(only))
                    newData = Object.assign(Object.assign({}, newData), { [only]: d[only] });
            });
            hasNameRelation.forEach((name) => {
                if (name)
                    newData = Object.assign(Object.assign({}, newData), { [name]: d[name] });
            });
            result = [...result, newData];
        });
        return result;
    }
    _validateSchema(data, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const validateSchema = this._getState('VALIDATE_SCHEMA');
            if (!validateSchema)
                return;
            const schemaTable = this._getState('SCHEMA_TABLE');
            if (schemaTable == null) {
                return this._assertError(schemaTable == null, `This method "validateSchema" isn't validation without schema. Please use the method "useSchema" for define your schema`);
            }
            const schemaTableDefined = this._getState('VALIDATE_SCHEMA_DEFINED');
            const schema = schemaTableDefined !== null && schemaTableDefined !== void 0 ? schemaTableDefined : Object.keys(schemaTable).reduce((acc, key) => {
                acc[key] = schemaTable[key].valueType;
                return acc;
            }, {});
            if (schema == null)
                return;
            const regexDate = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
            const regexDateTime = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
            Object.entries(data).some(([column]) => {
                if (schema[column] == null)
                    this._assertError(`This column "${column}" is not in schema`);
            });
            for (const column in schema) {
                const s = schema[column];
                const r = data[column];
                const typeOf = (r) => this.$utils.typeOf(r);
                if (typeOf(s) !== 'object') {
                    if (r == null)
                        continue;
                    if (regexDate.test(r) || regexDateTime.test(r)) {
                        if (typeOf(new Date(r)) === typeOf(new s()))
                            continue;
                        this._assertError(`This column "${column}" is must be type "${typeOf(new s())}"`);
                    }
                    if (typeOf(r) === typeOf(new s()))
                        continue;
                    this._assertError(`This column "${column}" is must be type "${typeOf(new s())}"`);
                    continue;
                }
                if (s.require && action === 'insert')
                    this._assertError(r === '' || r == null, `This column "${column}" is required`);
                if (r == null)
                    continue;
                this._assertError((regexDate.test(r) || regexDateTime.test(r)) && typeOf(new Date(r)) !== typeOf(new s.type()) `This column "${column}" is must be type "${typeOf(new s.type())}"`);
                this._assertError(typeOf(r) !== typeOf(new s.type()), `This column "${column}" is must be type "${typeOf(new s.type())}"`);
                if (s.json) {
                    try {
                        JSON.parse(r);
                    }
                    catch (_) {
                        this._assertError(`This column "${column}" is must be JSON`);
                    }
                }
                if (s.length)
                    this._assertError((`${r}`.length > s.length), `This column "${column}" is more than "${s.length}" length of characters`);
                if (s.maxLength)
                    this._assertError((`${r}`.length > s.maxLength), `This column "${column}" is more than "${s.maxLength}" length of characters`);
                if (s.minLength)
                    this._assertError((`${r}`.length < s.minLength), `This column "${column}" is less than "${s.minLength}" length of characters`);
                if (s.max)
                    this._assertError(r > s.max, `This column "${column}" is more than "${s.max}"`);
                if (s.min)
                    this._assertError(r < s.min, `This column "${column}" is less than "${s.min}"`);
                if (s.enum && s.enum.length) {
                    this._assertError(!s.enum.some((e) => e === r), `This column "${column}" is must be in ${s.enum.map((e) => `"${e}"`)}`);
                }
                if (s.match)
                    this._assertError(!s.match.test(r), `This column "${column}" is not match a regular expression`);
                if (s.fn)
                    this._assertError(!(yield s.fn(r)), `This column "${column}" is not valid with function`);
                if (s.unique && action === 'insert') {
                    const exist = yield new Model()
                        .copyModel(this, { select: true, where: true, limit: true })
                        .where([column], r)
                        .debug(this._getState('DEBUG'))
                        .exists();
                    this._assertError(exist, `This column "${column}" is duplicated`);
                }
            }
            return;
        });
    }
    _execute({ sql, type, message, options }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this._queryStatement(sql);
            if (!result.length)
                return this._returnEmpty(type, result, message, options);
            const relations = this._getState('RELATIONS');
            if (!relations.length)
                return (yield this._returnResult(type, result)) || this._returnEmpty(type, result, message, options);
            for (const relation of relations) {
                result = (_b = yield ((_a = this.$relation) === null || _a === void 0 ? void 0 : _a.load(result, relation))) !== null && _b !== void 0 ? _b : [];
            }
            if (this._getState('HIDDEN').length)
                this._hiddenColumnModel(result);
            return (yield this._returnResult(type, result)) || this._returnEmpty(type, result, message, options);
        });
    }
    _executeGroup(dataParents, type = 'GET') {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataParents.length)
                return this._returnEmpty(type, dataParents);
            const relations = this._getState('RELATIONS');
            if (relations.length) {
                for (const relation of relations) {
                    dataParents = (_b = yield ((_a = this.$relation) === null || _a === void 0 ? void 0 : _a.load(dataParents, relation))) !== null && _b !== void 0 ? _b : [];
                }
            }
            if ((_c = this._getState('HIDDEN')) === null || _c === void 0 ? void 0 : _c.length)
                this._hiddenColumnModel(dataParents);
            const resultData = yield this._returnResult(type, dataParents);
            return resultData || this._returnEmpty(type, dataParents);
        });
    }
    _pagination(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const currentPage = +(this._getState('PAGE'));
            const limit = Number(this._getState('PER_PAGE'));
            this._assertError(limit < 1, "This pagination needed limit minimun less 1 for limit");
            const total = yield new Model()
                .copyModel(this, { where: true, select: true })
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .count();
            let lastPage = Math.ceil(total / limit) || 0;
            lastPage = lastPage > 1 ? lastPage : 1;
            const nextPage = currentPage + 1;
            const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
            const totalPage = (_a = data === null || data === void 0 ? void 0 : data.length) !== null && _a !== void 0 ? _a : 0;
            const meta = {
                total,
                limit,
                totalPage,
                currentPage,
                lastPage,
                nextPage,
                prevPage,
            };
            if (this._isPatternSnakeCase()) {
                return this.$utils.snakeCase(this._resultHandler({
                    meta,
                    data
                }));
            }
            return this._resultHandler({
                meta,
                data
            });
        });
    }
    _returnEmpty(type, result, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let emptyData = null;
            switch (type) {
                case 'FIRST': {
                    emptyData = null;
                    break;
                }
                case 'FIRST_OR_ERROR': {
                    if (!(result === null || result === void 0 ? void 0 : result.length)) {
                        if (options == null) {
                            throw {
                                message,
                                code: 400
                            };
                        }
                        throw Object.assign({ message }, options);
                    }
                    emptyData = null;
                    break;
                }
                case 'GET': {
                    emptyData = [];
                    break;
                }
                case 'PAGINATION': {
                    emptyData = {
                        meta: {
                            total: 0,
                            limit: Number(this._getState('PER_PAGE')),
                            totalPage: 0,
                            currentPage: Number(this._getState('PAGE')),
                            lastPage: 0,
                            nextPage: 0,
                            prevPage: 0
                        },
                        data: []
                    };
                    break;
                }
                default: this._assertError('Missing method first get or pagination');
            }
            if (this._isPatternSnakeCase()) {
                const empty = this.$utils.snakeCase(this._resultHandler(emptyData));
                yield this.$utils.hookHandle(this._getState('HOOKS'), empty);
                return empty;
            }
            const empty = this._resultHandler(emptyData);
            yield this.$utils.hookHandle(this._getState('HOOKS'), empty);
            return empty;
        });
    }
    _returnResult(type, data) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const registry = this._getState('REGISTRY');
            if (((_a = Object.keys(registry)) === null || _a === void 0 ? void 0 : _a.length) && registry != null) {
                for (const d of data) {
                    for (const name in registry) {
                        d[name] = registry[name];
                    }
                }
            }
            const functionRelation = this._getState('FUNCTION_RELATION');
            if (functionRelation) {
                for (const d of data) {
                    for (const r of this._getState('RELATION')) {
                        d[`$${r.name}`] = (cb) => __awaiter(this, void 0, void 0, function* () {
                            var _f, _g;
                            const query = cb ? cb(new r.model()) : new r.model();
                            r.query = query;
                            const dataFromRelation = (_g = yield ((_f = this.$relation) === null || _f === void 0 ? void 0 : _f.load([d], r))) !== null && _g !== void 0 ? _g : [];
                            const relationIsHasOneOrBelongsTo = [
                                this.$constants('RELATIONSHIP').hasOne,
                                this.$constants('RELATIONSHIP').belongsTo
                            ].some(x => x === r.relation);
                            if (relationIsHasOneOrBelongsTo)
                                return dataFromRelation[0] || null;
                            return dataFromRelation || [];
                        });
                    }
                }
            }
            if ((_b = this._getState('ONLY')) === null || _b === void 0 ? void 0 : _b.length)
                data = this._showOnly(data);
            let result = null;
            switch (type) {
                case 'FIRST': {
                    if (this._getState('PLUCK')) {
                        const pluck = this._getState('PLUCK');
                        const newData = data.shift();
                        const checkProperty = newData.hasOwnProperty(pluck);
                        this._assertError(!checkProperty, `Can't find property '${pluck}' of result`);
                        result = this._resultHandler(newData[pluck]);
                        break;
                    }
                    result = this._resultHandler((_c = data.shift()) !== null && _c !== void 0 ? _c : null);
                    break;
                }
                case 'FIRST_OR_ERROR': {
                    if (this._getState('PLUCK')) {
                        const pluck = this._getState('PLUCK');
                        const newData = data.shift();
                        const checkProperty = newData.hasOwnProperty(pluck);
                        this._assertError(!checkProperty, `Can't find property '${pluck}' of result`);
                        result = (_d = this._resultHandler(newData[pluck])) !== null && _d !== void 0 ? _d : null;
                        break;
                    }
                    result = this._resultHandler((_e = data.shift()) !== null && _e !== void 0 ? _e : null);
                    break;
                }
                case 'GET': {
                    if (this._getState('CHUNK')) {
                        const r = data.reduce((resultArray, item, index) => {
                            const chunkIndex = Math.floor(index / this._getState('CHUNK'));
                            if (!resultArray[chunkIndex])
                                resultArray[chunkIndex] = [];
                            resultArray[chunkIndex].push(item);
                            return resultArray;
                        }, []);
                        result = this._resultHandler(r);
                        break;
                    }
                    if (this._getState('PLUCK')) {
                        const pluck = this._getState('PLUCK');
                        const newData = data.map((d) => d[pluck]);
                        this._assertError(newData.every((d) => d == null), `Can't find property '${pluck}' of result`);
                        result = this._resultHandler(newData);
                        break;
                    }
                    result = this._resultHandler(data);
                    break;
                }
                case 'PAGINATION': {
                    result = yield this._pagination(data);
                    break;
                }
                default: {
                    throw new Error('Missing method first get or pagination');
                }
            }
            yield this.$utils.hookHandle(this._getState('HOOKS'), result);
            return result;
        });
    }
    _hiddenColumnModel(data) {
        const hiddens = this._getState('HIDDEN');
        for (const hidden of hiddens) {
            for (const objColumn of data) {
                delete objColumn[hidden];
            }
        }
        return data;
    }
    _attach(name, dataId, fields) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!Array.isArray(dataId), `this ${dataId} is not an array`);
            const relation = (_a = this._getState('RELATION')) === null || _a === void 0 ? void 0 : _a.find((data) => data.name === name);
            this._assertError(!relation, `unknown name relation ['${name}'] in model`);
            const thisTable = this.$utils.columnRelation(this.constructor.name);
            const relationTable = this._classToTableName(relation.model.name, { singular: true });
            const result = this._getState('RESULT');
            try {
                const pivotTable = `${thisTable}_${relationTable}`;
                const success = yield new DB_1.DB().table(pivotTable).createMultiple(dataId.map((id) => {
                    return Object.assign({ [this._valuePattern(`${relationTable}Id`)]: id, [this._valuePattern(`${thisTable}Id`)]: result.id }, fields);
                })).save();
                return success;
            }
            catch (e) {
                const errorTable = e.message;
                const search = errorTable.search("ER_NO_SUCH_TABLE");
                if (!!search)
                    throw new Error(e.message);
                try {
                    const pivotTable = `${relationTable}_${thisTable}`;
                    const success = yield new DB_1.DB().table(pivotTable).createMultiple(dataId.map((id) => {
                        return Object.assign({ [this._valuePattern(`${relationTable}Id`)]: id, [this._valuePattern(`${thisTable}Id`)]: result.id }, fields);
                    })).save();
                    return success;
                }
                catch (e) {
                    throw new Error(e.message);
                }
            }
        });
    }
    _detach(name, dataId) {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!Array.isArray(dataId), `this ${dataId} is not an array`);
            const relation = this._getState('RELATION').find((data) => data.name === name);
            this._assertError(!relation, `unknown name relation [${name}] in model`);
            const thisTable = this.$utils.columnRelation(this.constructor.name);
            const relationTable = this._classToTableName(relation.model.name, { singular: true });
            const result = this._getState('RESULT');
            try {
                const pivotTable = `${thisTable}_${relationTable}`;
                for (const id of dataId) {
                    yield new DB_1.DB().table(pivotTable)
                        .where(this._valuePattern(`${relationTable}Id`), id)
                        .where(this._valuePattern(`${thisTable}Id`), result.id)
                        .delete();
                }
                return true;
            }
            catch (e) {
                const errorTable = e.message;
                const search = errorTable.search("ER_NO_SUCH_TABLE");
                if (!!search)
                    throw new Error(e.message);
                try {
                    const pivotTable = `${relationTable}_${thisTable}`;
                    for (const id of dataId) {
                        yield new DB_1.DB().table(pivotTable)
                            .where(this._valuePattern(`${relationTable}Id`), id)
                            .where(this._valuePattern(`${thisTable}Id`), result.id)
                            .delete();
                    }
                    return true;
                }
                catch (e) {
                    throw new Error(e.message);
                }
            }
        });
    }
    _queryUpdateModel(objects) {
        this.$utils.covertDataToDateIfDate(objects);
        if (this._getState('TIMESTAMP')) {
            const updatedAt = this._valuePattern(this._getState('TIMESTAMP_FORMAT').UPDATED_AT);
            objects = Object.assign(Object.assign({}, objects), { [updatedAt]: this.$utils.timestamp() });
        }
        const keyValue = Object.entries(objects).map(([column, value]) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW'))))
                value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
            return `\`${column}\` = ${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return `${this.$constants('SET')} ${keyValue.join(', ')}`;
    }
    _queryInsertModel(data) {
        this.$utils.covertDataToDateIfDate(data);
        const hasTimestamp = Boolean(this._getState('TIMESTAMP'));
        if (hasTimestamp) {
            const format = this._getState('TIMESTAMP_FORMAT');
            const createdAt = this._valuePattern(String(format === null || format === void 0 ? void 0 : format.CREATED_AT));
            const updatedAt = this._valuePattern(String(format === null || format === void 0 ? void 0 : format.UPDATED_AT));
            data = Object.assign({ [createdAt]: this.$utils.timestamp(), [updatedAt]: this.$utils.timestamp() }, data);
        }
        const hasUUID = data.hasOwnProperty(this._getState('UUID_FORMAT'));
        if (this._getState('UUID') && !hasUUID) {
            const uuidFormat = this._getState('UUID_FORMAT');
            data = Object.assign({ [uuidFormat]: this.$utils.generateUUID() }, data);
        }
        const columns = Object.keys(data).map((column) => `\`${column}\``);
        const values = Object.values(data).map((value) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW'))))
                value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
            return `${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        const sql = [
            `(${columns.join(', ')})`,
            `${this.$constants('VALUES')}`,
            `(${values.join(', ')})`,
        ].join(' ');
        return sql;
    }
    _queryInsertMultipleModel(data) {
        var _a;
        let values = [];
        let columns = Object.keys((_a = [...data]) === null || _a === void 0 ? void 0 : _a.shift()).map((column) => `\`${column}\``);
        for (let objects of data) {
            this.$utils.covertDataToDateIfDate(data);
            const hasTimestamp = this._getState('TIMESTAMP');
            if (hasTimestamp) {
                const format = this._getState('TIMESTAMP_FORMAT');
                const createdAt = this._valuePattern(format.CREATED_AT);
                const updatedAt = this._valuePattern(format.UPDATED_AT);
                objects = Object.assign(Object.assign({}, objects), { [createdAt]: this.$utils.timestamp(), [updatedAt]: this.$utils.timestamp() });
                columns = [
                    ...columns,
                    `\`${createdAt}\``,
                    `\`${updatedAt}\``
                ];
            }
            const hasUUID = objects.hasOwnProperty(this._getState('UUID_FORMAT'));
            if (this._getState('UUID') && !hasUUID) {
                const uuidFormat = this._getState('UUID_FORMAT');
                objects = Object.assign(Object.assign({}, objects), { [uuidFormat]: this.$utils.generateUUID() });
                columns = [
                    ...columns,
                    `\`${uuidFormat}\``
                ];
            }
            const v = Object.values(objects).map((value) => {
                if (typeof value === 'string' && !(value.includes(this.$constants('RAW'))))
                    value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
                return `${value == null || value === 'NULL'
                    ? 'NULL'
                    : typeof value === 'string' && value.includes(this.$constants('RAW'))
                        ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                        : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
            });
            values = [
                ...values,
                `(${v.join(',')})`
            ];
        }
        return [
            `(${[...new Set(columns)].join(',')})`,
            `${this.$constants('VALUES')}`,
            `${values.join(', ')}`
        ].join(' ');
    }
    _insertNotExistsModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this._getState('where').length, "This method 'createNotExists' is require to use 'where' conditions");
            const check = (yield new Model()
                .copyModel(this, { where: true, select: true, limit: true })
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .exists()) || false;
            if (check)
                return this._resultHandler(null);
            yield this._validateSchema(this._getState('DATA'), 'insert');
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (!result)
                return this._resultHandler(null);
            const resultData = yield new Model()
                .copyModel(this, { select: true })
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .where('id', id)
                .first();
            return this._resultHandler(resultData);
        });
    }
    _insertModel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._validateSchema(this._getState('DATA'), 'insert');
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (this._getState('VOID'))
                return this._resultHandler(undefined);
            if (!result)
                return this._resultHandler(null);
            const resultData = yield new Model()
                .copyModel(this, { select: true })
                .where('id', id)
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .first();
            this._observer(resultData, 'created');
            return this._resultHandler(resultData);
        });
    }
    _createMultipleModel() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            for (const data of (_a = this._getState('DATA')) !== null && _a !== void 0 ? _a : []) {
                yield this._validateSchema(data, 'insert');
            }
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (this._getState('VOID'))
                return this._resultHandler(undefined);
            if (!result)
                return this._resultHandler(null);
            const arrayId = [...Array(result)].map((_, i) => i + id);
            const data = yield new Model()
                .copyModel(this, { select: true, limit: true })
                .bind(this.$pool.get())
                .whereIn('id', arrayId)
                .debug(this._getState('DEBUG'))
                .get();
            const resultData = data || [];
            this._observer(resultData, 'created');
            return this._resultHandler(resultData);
        });
    }
    _updateOrInsertModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this._getState('where').length, "This method 'createOrUpdate' is require to use 'where' conditions");
            const check = (yield new Model()
                .copyModel(this, { select: true, where: true, limit: true })
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .exists()) || false;
            switch (check) {
                case false: {
                    yield this._validateSchema(this._getState('DATA'), 'insert');
                    const [result, id] = yield this._actionStatement({
                        sql: this._queryBuilder().insert(),
                        returnId: true
                    });
                    if (this._getState('VOID') || !result)
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { select: true })
                        .bind(this.$pool.get())
                        .where('id', id)
                        .debug(this._getState('DEBUG'))
                        .first();
                    const resultData = data == null ? null : Object.assign(Object.assign({}, data), { $action: 'insert' });
                    const r = this._resultHandler(resultData);
                    this._observer(r, 'created');
                    return r;
                }
                case true: {
                    yield this._validateSchema(this._getState('DATA'), 'update');
                    const result = yield this._actionStatement({
                        sql: this._queryBuilder().update()
                    });
                    if (this._getState('VOID') || !result)
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { where: true, select: true, limit: true })
                        .bind(this.$pool.get())
                        .debug(this._getState('DEBUG'))
                        .get();
                    if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                        for (const v of data)
                            v.$action = 'update';
                        const r = this._resultHandler(data);
                        this._observer(r, 'updated');
                        return r;
                    }
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'update' }) || null;
                    const r = this._resultHandler(resultData);
                    this._observer(r, 'updated');
                    return r;
                }
            }
        });
    }
    _insertOrSelectModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this._getState('where').length, "This method 'createOrSelect' is require to use 'where' conditions");
            const check = (yield new Model()
                .copyModel(this, { select: true, where: true, limit: true })
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .exists()) || false;
            switch (check) {
                case false: {
                    yield this._validateSchema(this._getState('DATA'), 'insert');
                    const [result, id] = yield this._actionStatement({
                        sql: this._queryBuilder().insert(),
                        returnId: true
                    });
                    if (this._getState('VOID') || !result)
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { select: true })
                        .bind(this.$pool.get())
                        .where('id', id)
                        .debug(this._getState('DEBUG'))
                        .first();
                    const resultData = data == null
                        ? null
                        : Object.assign(Object.assign({}, data), { $action: 'insert' });
                    const r = this._resultHandler(resultData);
                    this._observer(r, 'created');
                    return r;
                }
                case true: {
                    if (this._getState('VOID'))
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { select: true, where: true, limit: true })
                        .bind(this.$pool.get())
                        .debug(this._getState('DEBUG'))
                        .get();
                    if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                        for (const v of data)
                            v.$action = 'select';
                        return data;
                    }
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'select' }) || null;
                    return this._resultHandler(resultData);
                }
            }
        });
    }
    _updateModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this._getState('where').length, "This method 'update' is require to use 'where' conditions");
            yield this._validateSchema(this._getState('DATA'), 'update');
            const sql = this._queryBuilder().update();
            const result = yield this._actionStatement({ sql });
            if (this._getState('VOID') || !result || result == null)
                return this._resultHandler(undefined);
            const data = yield new Model()
                .copyModel(this, { where: true, select: true, limit: true, orderBy: true })
                .bind(this.$pool.get())
                .debug(this._getState('DEBUG'))
                .get();
            if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                const r = this._resultHandler(data);
                this._observer(r, 'updated');
                return r;
            }
            const resultData = (data === null || data === void 0 ? void 0 : data.shift()) || null;
            const r = this._resultHandler(resultData);
            this._observer(r, 'updated');
            return r;
        });
    }
    _assertError(condition = true, message = 'error') {
        if (typeof condition === 'string') {
            throw new Error(condition);
        }
        if (condition)
            throw new Error(message);
        return;
    }
    _validateMethod(method) {
        const methodChangeStatements = [
            'insert',
            'create',
            'update',
            'updateMany',
            'updateNotExists',
            'delete',
            'deleteMany',
            'forceDelete',
            'restore',
            'faker',
            'createNotExists',
            'insertNotExists',
            'createOrSelect',
            'insertOrSelect',
            'createOrUpdate',
            'insertOrUpdate',
            'updateOrCreate',
            'updateOrInsert',
            'createMultiple',
            'insertMultiple'
        ];
        switch (method.toLocaleLowerCase()) {
            case 'paginate':
            case 'pagination':
            case 'findOneOrError':
            case 'firstOrError':
            case 'findOne':
            case 'findMany':
            case 'first':
            case 'get': {
                const methodCallings = this.$logger.get();
                const methodsNotAllowed = methodChangeStatements;
                const findMethodNotAllowed = methodCallings.find((methodCalling) => methodsNotAllowed.includes(methodCalling));
                this._assertError(methodCallings.some((methodCalling) => methodsNotAllowed.includes(methodCalling)), `This method "${method}" can't using method : [ ${findMethodNotAllowed} ]`);
                break;
            }
            case 'save': {
                const methodCallings = this.$logger.get();
                const methodsSomeAllowed = methodChangeStatements;
                this._assertError(!methodCallings.some((methodCalling) => methodsSomeAllowed.includes(methodCalling)), `This ${method} method need some : [ ${methodsSomeAllowed.join(', ')} ] methods`);
                break;
            }
        }
    }
    _checkSchemaOrNextError(e, retry = 1) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (retry > 3 || this._getState('RETRY') > 3)
                    throw e;
                const schemaTable = this._getState('SCHEMA_TABLE');
                if (schemaTable == null)
                    return this._stoppedRetry(e);
                if (!(e instanceof Error))
                    return this._stoppedRetry(e);
                const errorMessage = (_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : '';
                if (errorMessage.toLocaleLowerCase().includes('unknown column')) {
                    const pattern = /'([^']+)'/;
                    const isPattern = errorMessage.match(pattern);
                    const column = isPattern
                        ? String(Array.isArray(isPattern) ? isPattern[0] : '').replace(/'/g, '').split('.').pop()
                        : null;
                    if (column == null)
                        return this._stoppedRetry(e);
                    const type = (_c = (_b = schemaTable[column]) === null || _b === void 0 ? void 0 : _b.type) !== null && _c !== void 0 ? _c : null;
                    const attributes = (_e = (_d = schemaTable[column]) === null || _d === void 0 ? void 0 : _d.attributes) !== null && _e !== void 0 ? _e : null;
                    if (type == null || attributes == null)
                        return this._stoppedRetry(e);
                    const entries = Object.entries(schemaTable);
                    const indexWithColumn = entries.findIndex(([key]) => key === column);
                    const findAfterIndex = indexWithColumn ? entries[indexWithColumn - 1][0] : null;
                    if (findAfterIndex == null)
                        return this._stoppedRetry(e);
                    const sql = [
                        `${this.$constants('ALTER_TABLE')}`,
                        `${this._getState('TABLE_NAME')}`,
                        `${this.$constants('ADD')}`,
                        `\`${column}\` ${type} ${attributes.join(' ')}`,
                        `${this.$constants('AFTER')}`,
                        `\`${findAfterIndex !== null && findAfterIndex !== void 0 ? findAfterIndex : ''}\``
                    ].join(' ');
                    yield this._queryStatement(sql);
                    return;
                }
                if (!errorMessage.toLocaleLowerCase().includes("doesn't exist"))
                    return this._stoppedRetry(e);
                const tableName = this._getState('TABLE_NAME');
                const sql = new Schema_1.Schema().createTable(tableName, schemaTable);
                yield this._queryStatement(sql);
            }
            catch (e) {
                if (retry > 3)
                    throw e;
                yield this._checkSchemaOrNextError(e, retry + 1);
            }
        });
    }
    _stoppedRetry(e) {
        this._setState('RETRY', 3);
        throw e;
    }
    _observer(result, type) {
        if (this._getState('OBSERVER') == null)
            return;
        const observer = this._getState('OBSERVER');
        switch (type.toLocaleLowerCase()) {
            case 'created': return new observer().created(result);
            case 'updated': return new observer().updated(result);
            case 'deleted': return new observer().deleted(result);
        }
        return;
    }
    _initialModel() {
        this.$state = new State_1.StateHandler(this.$constants('MODEL'));
        this._makeTableName();
        this.$relation = new Relation_1.RelationHandler(this);
        return this;
    }
}
exports.Model = Model;
exports.default = Model;
