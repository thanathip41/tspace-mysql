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
const Relation_1 = require("./Handlers/Relation");
const Blueprint_1 = require("./Blueprint");
const State_1 = require("./Handlers/State");
let globalSettings = {
    softDelete: false,
    debug: false,
    uuid: false,
    timestamp: false,
    logger: {
        selected: false,
        inserted: false,
        updated: false,
        deleted: false
    }
};
/**
 *
 * 'Model' class is a representation of a database table
 * @generic {Type} TS
 * @generic {Type} TR
 * @example
 * import { Model, Blueprint , TSchema , TRelation } from 'tspace-mysql'
 *
 * const schema = {
 *   id    : new Blueprint().int().primary().autoIncrement(),
 *   uuid  : new Blueprint().varchar(50).null(),
 *   email : new Blueprint().varchar(50).null(),
 *   name  : new Blueprint().varchar(255).null(),
 * }
 *
 * type TS = TSchema<typeof schema>
 * type TR = TRelation<{}>
 *
 * class User extends Model<TS,TR> {
 *     ...........configration
 * }
 *
 * const users = await new User().findMany()
 * console.log(users)
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
     * The 'global' method is used setting global variables in models.
     * @static
     * @param {GlobalSetting} settings
     * @example
     * Model.global({
     *   softDelete : true,
     *   uuid       : true,
     *   timestamp  : true,
     *   debug      : true
     *   logger     : {
     *       selected : true,
     *       inserted : true,
     *       updated  : true,
     *       deleted  : true
     *   },
     * })
     * @returns {void} void
     */
    static global(settings) {
        globalSettings = Object.assign({}, globalSettings, settings);
        return;
    }
    /**
     * The 'column' method is used keyof column in schema.
     * @param {string} column
     * @example
     * import { User } from '../User'
     * Model.column<User>('id')
     * @returns {string} column
     */
    static column(column) {
        return column;
    }
    /**
     * The 'instance' method is used get instance.
     * @override
     * @static
     * @returns {Model} instance of the Model
     */
    static get instance() {
        return new this();
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
     * @returns {void} void
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
     * @returns {void} void
     */
    boot() { }
    /**
     * The "useObserve" method is used to pattern refers to a way of handling model events using observer classes.
     * Model events are triggered when certain actions occur on models,
     * such as creating, updating, deleting, or saving a record.
     *
     * Observers are used to encapsulate the event-handling logic for these events,
     * keeping the logic separate from the model itself and promoting cleaner, more maintainable code.
     * @param {Function} observer
     * @returns this
     * @example
     *
     * class UserObserve {
     *    public selected(results : unknown) {
     *       console.log({ results , selected : true })
     *    }
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
        this.$state.set('OBSERVER', observer);
        return this;
    }
    /**
    * The "useLogger" method is used to keeping query data and changed in models.
    *
    * @type     {object}  options
    * @property {boolean} options.selected - default is false
    * @property {boolean} options.inserted - default is true
    * @property {boolean} options.updated  - default is true
    * @property {boolean} options.deleted  - default is true
    * @example
    * class User extends Model {
    *     constructor() {
    *        super()
    *        this.useLogger({
    *          selected : true,
    *          inserted : true,
    *          updated  : true,
    *          deleted  : true,
    *       })
    *   }
    * }
    * @returns {this} this
    */
    useLogger({ selected = false, inserted = true, updated = true, deleted = true } = {}) {
        this.$state.set('LOGGER', true);
        this.$state.set('LOGGER_OPTIONS', {
            selected,
            inserted,
            updated,
            deleted
        });
        return this;
    }
    /**
     * The "useSchema" method is used to define the schema.
     *
     * It's automatically create, called when not exists table or columns.
     * @param {object} schema using Blueprint for schema
     * @example
     * import { Blueprint, TR } from 'tspace-mysql';
     * class User extends Model {
     *     constructor() {
     *        super()
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
     * @returns {this} this
     */
    useSchema(schema) {
        this.$state.set('SCHEMA_TABLE', schema);
        return this;
    }
    /**
     *
     * The "useRegistry" method is used to define Function to results.
     *
     * It's automatically given Function to results.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useRegistry()
     *     }
     * }
     */
    useRegistry() {
        this.$state.set('REGISTRY', Object.assign(Object.assign({}, this.$state.get('REGISTRY')), { '$save': this._save.bind(this), '$attach': this._attach.bind(this), '$detach': this._detach.bind(this) }));
        return this;
    }
    /**
     * The "useLoadRelationsInRegistry" method is used automatically called relations in your registry Model.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useLoadRelationInRegistry()
     *     }
     * }
     */
    useLoadRelationsInRegistry() {
        const relations = this.$state.get('RELATION').map((r) => String(r.name));
        if (relations.length)
            this.relations(...Array.from(new Set(relations)));
        return this;
    }
    /**
     * The "useBuiltInRelationFunctions" method is used to define the function.
     *
     * It's automatically given built-in relation functions to a results.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useBuiltInRelationsFunction()
     *     }
     * }
     */
    useBuiltInRelationFunctions() {
        this.$state.set('FUNCTION_RELATION', true);
        return this;
    }
    /**
     * The "usePrimaryKey" method is add primary keys for database tables.
     *
     * @param {string} primary
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.usePrimaryKey()
     *     }
     * }
     */
    usePrimaryKey(primary) {
        this.$state.set('PRIMARY_KEY', primary);
        return this;
    }
    /**
     * The "useUUID" method is a concept of using UUIDs (Universally Unique Identifiers) as column 'uuid' in table.
     *
     * It's automatically genarate when created a result.
     * @param {string?} column [column=uuid] make new name column for custom column replace uuid with this
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useUUID()
     *     }
     * }
     */
    useUUID(column) {
        this.$state.set('UUID', true);
        if (column)
            this.$state.set('UUID_FORMAT', column);
        return this;
    }
    /**
     * The "useDebug" method is viewer raw-sql logs when excute the results.
     * @returns {this} this
     */
    useDebug() {
        this.$state.set('DEBUG', true);
        return this;
    }
    /**
     * The "usePattern" method is used to assign pattern [snake_case , camelCase].
     * @param  {string} pattern
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.usePattern('camelCase')
     *     }
     * }
     */
    usePattern(pattern) {
        const allowPattern = [
            this.$constants('PATTERN').snake_case,
            this.$constants('PATTERN').camelCase
        ];
        if (!allowPattern.includes(pattern)) {
            throw this._assertError(`The 'tspace-mysql' support only pattern '${this.$constants('PATTERN').snake_case}', 
                '${this.$constants('PATTERN').camelCase}'`);
        }
        this.$state.set('PATTERN', pattern);
        this._makeTableName();
        return this;
    }
    /**
     * The "useCamelCase" method is used to assign pattern camelCase.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.useCamelCase()
     *     }
     * }
     */
    useCamelCase() {
        this.$state.set('PATTERN', this.$constants('PATTERN').camelCase);
        this._makeTableName();
        return this;
    }
    /**
     * The "SnakeCase" method is used to assign pattern snake_case.
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        super()
     *        this.SnakeCase()
     *     }
     * }
     */
    useSnakeCase() {
        this.$state.set('PATTERN', this.$constants('PATTERN').snake_case);
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
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useSoftDelete('deletedAt')
     *     }
     * }
     */
    useSoftDelete(column) {
        this.$state.set('SOFT_DELETE', true);
        if (column)
            this.$state.set('SOFT_DELETE_FORMAT', column);
        return this;
    }
    /**
     * The "useTimestamp" method is used to assign a timestamp when creating a new record,
     * or updating a record.
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change new name column replace by default [created at]
     * @property {string} timestampFormat.updatedAt - change new name column replace by default updated at
     * @returns {this} this
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
        this.$state.set('TIMESTAMP', true);
        if (timestampFormat) {
            this.$state.set('TIMESTAMP_FORMAT', {
                CREATED_AT: timestampFormat.createdAt,
                UPDATED_AT: timestampFormat.updatedAt
            });
        }
        return this;
    }
    /**
     * This "useTable" method is used to assign the name of the table.
     * @param {string} table table name in database
     * @returns {this} this
     * @example
     * class User extends Model {
     *     constructor() {
     *        this.useTable('setTableNameIsUser') // => 'setTableNameIsUser'
     *     }
     * }
     */
    useTable(table) {
        this.$state.set('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * This "useTableSingular" method is used to assign the name of the table with signgular pattern.
     * @returns {this} this
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
        this.$state.set('TABLE_NAME', `\`${this._valuePattern(table)}\``);
        return this;
    }
    /**
     * This "useTablePlural " method is used to assign the name of the table with pluarl pattern
     * @returns {this} this
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
        this.$state.set('TABLE_NAME', `\`${this._valuePattern(table)}\``);
        return this;
    }
    /**
     * This 'useValidationSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @returns {this} this
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
        this.$state.set('VALIDATE_SCHEMA', true);
        this.$state.set('VALIDATE_SCHEMA_DEFINED', schema);
        return this;
    }
    /**
     * This 'useValidateSchema' method is used to validate the schema when have some action create or update.
     * @param {Object<ValidateSchema>} schema types (String Number and Date)
     * @returns {this} this
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
     * @returns {this} this
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
                throw this._assertError(`this 'function' is not a function`);
            this.$state.set('HOOKS', [...this.$state.get('HOOKS'), func]);
        }
        return this;
    }
    /**
     * The "beforeCreatingTable" method is used exection function when creating the table.
     * @param {Function} fn functions for executing before creating the table
     * @returns {this} this
     * @example
     * class User extends Model {
     *   constructor() {
     *     this.beforeCreatingTable(async () => {
     *         await new User()
     *          .create({
     *            ...columns
     *          })
     *          .save()
     *      })
     *   }
     * }
    */
    beforeCreatingTable(fn) {
        if (!(fn instanceof Function))
            throw this._assertError(`This '${fn}' is not a function.`);
        this.$state.set('BEFORE_CREATING_TABLE', fn);
        return this;
    }
    /**
     * exceptColumns for method except
     * @override
     * @returns {promise<string>} string
     */
    exceptColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            const excepts = this.$state.get('EXCEPTS');
            const hasDot = excepts.some((except) => /\./.test(except));
            const names = excepts.map((except) => {
                if (/\./.test(except))
                    return except.split('.')[0];
                return null;
            }).filter((d) => d != null);
            const tableNames = names.length ? [...new Set(names)] : [this.$state.get('TABLE_NAME')];
            const removeExcepts = [];
            const schemaColumns = this.getSchemaModel();
            for (const tableName of tableNames) {
                const isHasSchema = [
                    schemaColumns != null,
                    tableName.replace(/`/g, '') === this.$state.get('TABLE_NAME').replace(/`/g, '')
                ].every(d => d);
                if (isHasSchema) {
                    const columns = Object.keys(schemaColumns);
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
     * @returns   {this}   this
     */
    buildMethodRelation(name, callback) {
        var _a, _b;
        this.relations(name);
        const relation = this.$state.get('RELATIONS').find((data) => data.name === name);
        if (relation == null) {
            throw this._assertError(`This Relation '${String(name)}' not be register in Model '${(_a = this.constructor) === null || _a === void 0 ? void 0 : _a.name}'.`);
        }
        const relationHasExists = (_b = Object.values(this.$constants('RELATIONSHIP'))) === null || _b === void 0 ? void 0 : _b.includes(relation.relation);
        if (!relationHasExists) {
            throw this._assertError(`Unknown relationship in '${this.$constants('RELATIONSHIP')}'.`);
        }
        if (callback == null) {
            relation.query = new relation.model();
            return this;
        }
        relation.query = callback(new relation.model());
        return this;
    }
    /**
     * The 'typeOfSchema' method is used get type of schema.
     * @returns {TS} type of schema
     */
    typeOfSchema() {
        return {};
    }
    /**
     * The 'typeOfRelation' method is used get type of relation.
     * @returns {TR} type of Relation
     */
    typeOfRelation() {
        return {};
    }
    /**
     *
     * @override
     * @param {string[]} ...columns
     * @returns {this} this
     */
    select(...columns) {
        if (!columns.length) {
            this.$state.set('SELECT', ['*']);
            return this;
        }
        let select = columns.map((c) => {
            const column = String(c);
            if (column === '*' || (column.includes('*') && /\./.test(column)))
                return column;
            if (column.includes(this.$constants('RAW')))
                return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '').replace(/'/g, '');
            return this.bindColumn(column);
        });
        select = [...this.$state.get('SELECT'), ...select];
        if (this.$state.get('DISTINCT') && select.length) {
            select[0] = String(select[0]).includes(this.$constants('DISTINCT'))
                ? select[0]
                : `${this.$constants('DISTINCT')} ${select[0]}`;
        }
        this.$state.set('SELECT', select);
        return this;
    }
    /**
     *
     * @override
     * @param {...string} columns
     * @returns {this} this
     */
    except(...columns) {
        if (!columns.length)
            return this;
        const exceptColumns = this.$state.get('EXCEPTS');
        this.$state.set('EXCEPTS', [
            ...columns,
            ...exceptColumns
        ]);
        return this;
    }
    /**
     *
     * @override
     * @returns {this} this
     */
    exceptTimestamp() {
        let excepts = [];
        if (this.$state.get('SOFT_DELETE')) {
            const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
            excepts = [
                ...excepts,
                deletedAt
            ];
        }
        const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
        const createdAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').CREATED_AT);
        excepts = [
            ...excepts,
            createdAt,
            updatedAt
        ];
        const exceptColumns = this.$state.get('EXCEPTS');
        this.$state.set('EXCEPTS', [
            ...excepts,
            ...exceptColumns
        ]);
        return this;
    }
    /**
     *
     * @override
     * @param {string} column
     * @param {string?} order by default order = 'asc' but you can used 'asc' or  'desc'
     * @returns {this}
     */
    orderBy(column, order = 'ASC') {
        let c = String(column);
        if (c.includes(this.$constants('RAW')) || /\./.test(c)) {
            c = c === null || c === void 0 ? void 0 : c.replace(this.$constants('RAW'), '');
            if (/\./.test(c))
                c = this.bindColumn(c);
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `\`${c}\` ${order.toUpperCase()}`
        ]);
        return this;
    }
    /**
     *
     * @override
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    latest(...columns) {
        let orderBy = '`id`';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderBy = columns.map(c => {
                if (/\./.test(c))
                    return this.bindColumn(c);
                if (c.includes(this.$constants('RAW')))
                    return c === null || c === void 0 ? void 0 : c.replace(this.$constants('RAW'), '');
                return `\`${c}\``;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `${orderBy} ${this.$constants('DESC')}`
        ]);
        return this;
    }
    /**
     *
     * @override
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    oldest(...columns) {
        let orderBy = '`id`';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderBy = columns.map(c => {
                if (/\./.test(c))
                    return this.bindColumn(c);
                if (c.includes(this.$constants('RAW')))
                    return c === null || c === void 0 ? void 0 : c.replace(this.$constants('RAW'), '');
                return `\`${c}\``;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `${orderBy} ${this.$constants('ASC')}`
        ]);
        return this;
    }
    /**
     *
     * @override
     * @param {string?} columns [column=id]
     * @returns {this}
     */
    groupBy(...columns) {
        let groupBy = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            groupBy = columns.map(c => {
                if (/\./.test(c))
                    return this.bindColumn(c);
                if (c.includes(this.$constants('RAW')))
                    return c === null || c === void 0 ? void 0 : c.replace(this.$constants('RAW'), '');
                return `\`${c}\``;
            }).join(', ');
        }
        this.$state.set('GROUP_BY', [
            ...this.$state.get('GROUP_BY'),
            `${groupBy}`
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @returns {string} return table.column
     */
    bindColumn(column, pattern = true) {
        if (!/\./.test(column)) {
            column = pattern ? this._valuePattern(column) : column;
            return `\`${this.getTableName().replace(/`/g, '')}\`.\`${column.replace(/`/g, '')}\``;
        }
        let [table, c] = column.split('.');
        c = pattern ? this._valuePattern(c) : c;
        return `\`${table.replace(/`/g, '')}\`.\`${c.replace(/`/g, '')}\``;
    }
    /**
     *
     * @override
     * The 'makeSelectStatement' method is used to make select statement.
     * @returns {Promise<string>} string
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
     * @override
     * The 'makeInsertStatement' method is used to make insert table statement.
     * @returns {Promise<string>} string
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
                    `(${Array(columns.length).fill('`?`').join(' , ')})`
                ].join(' ');
            };
            if (schemaModel == null) {
                const schemaTable = yield this.getSchema();
                const columns = schemaTable.map(column => this.bindColumn(column.Field));
                return makeStatement(columns);
            }
            const columns = Object.keys(schemaModel).map((column) => this.bindColumn(column));
            return makeStatement(columns);
        });
    }
    /**
     *
     * @override
     * The 'makeUpdateStatement' method is used to make update table statement.
     * @returns {Promise<string>} string
     */
    makeUpdateStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const schemaModel = this.getSchemaModel();
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('UPDATE')}`,
                    `\`${this.getTableName()}\``,
                    `${this.$constants('SET')}`,
                    `(${columns.join(', ')})`,
                    `${this.$constants('WHERE')}`,
                    `${this.bindColumn('id')} = '?'`
                ].join(' ');
            };
            if (schemaModel == null) {
                const schemaTable = yield this.getSchema();
                const columns = schemaTable.map(column => `${this.bindColumn(column.Field)} = '?'`);
                return makeStatement(columns);
            }
            const columns = Object.keys(schemaModel).map((column) => `${this.bindColumn(column)} = '?'`);
            return makeStatement(columns);
        });
    }
    /**
     *
     * @override
     * The 'makeDeleteStatement' method is used to make delete statement.
     * @returns {Promise<string>} string
     */
    makeDeleteStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const makeStatement = () => {
                return [
                    `${this.$constants('DELETE')}`,
                    `${this.$constants('FROM')}`,
                    `\`${this.getTableName()}\``,
                    `${this.$constants('WHERE')}`,
                    `${this.bindColumn('id')} = \`?\``
                ].join(' ');
            };
            return makeStatement();
        });
    }
    /**
     *
     * @override
     * The 'makeCreateTableStatement' method is used to make create table statement.
     * @returns {Promise<string>} string
     */
    makeCreateTableStatement() {
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
     * @returns {this} this
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
     * @returns {Model} Model
     */
    copyModel(instance, options) {
        if (!(instance instanceof Model)) {
            throw this._assertError('This instance is not an instanceof Model.');
        }
        const copy = Object.fromEntries(instance.$state.get());
        const newInstance = new Model();
        newInstance.$state.clone(copy);
        newInstance.$state.set('SAVE', '');
        newInstance.$state.set('DEBUG', false);
        newInstance.$state.set('LOGGER', false);
        if ((options === null || options === void 0 ? void 0 : options.insert) == null || !options.insert)
            newInstance.$state.set('INSERT', '');
        if ((options === null || options === void 0 ? void 0 : options.update) == null || !options.update)
            newInstance.$state.set('UPDATE', '');
        if ((options === null || options === void 0 ? void 0 : options.delete) == null || !options.delete)
            newInstance.$state.set('DELETE', '');
        if ((options === null || options === void 0 ? void 0 : options.where) == null || !options.where)
            newInstance.$state.set('WHERE', []);
        if ((options === null || options === void 0 ? void 0 : options.limit) == null || !options.limit)
            newInstance.$state.set('LIMIT', '');
        if ((options === null || options === void 0 ? void 0 : options.offset) == null || !options.offset)
            newInstance.$state.set('OFFSET', '');
        if ((options === null || options === void 0 ? void 0 : options.groupBy) == null || !options.groupBy)
            newInstance.$state.set('GROUP_BY', '');
        if ((options === null || options === void 0 ? void 0 : options.orderBy) == null || !options.orderBy)
            newInstance.$state.set('ORDER_BY', []);
        if ((options === null || options === void 0 ? void 0 : options.select) == null || !options.select)
            newInstance.$state.set('SELECT', []);
        if ((options === null || options === void 0 ? void 0 : options.join) == null || !options.join)
            newInstance.$state.set('JOIN', []);
        if ((options === null || options === void 0 ? void 0 : options.having) == null || !options.having)
            newInstance.$state.set('HAVING', '');
        return newInstance;
    }
    /**
     *
     * execute the query using raw sql syntax
     * @override
     * @param {string} sql
     * @returns {this} this
     */
    _queryStatement(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (this.$state.get('DEBUG'))
                    this.$utils.consoleDebug(sql);
                if (this.$state.get('LOGGER')) {
                    const selectRegex = /^SELECT\b/i;
                    const loggerOptions = this.$state.get('LOGGER_OPTIONS');
                    if (selectRegex.test(sql) && loggerOptions.selected) {
                        yield this._checkTableLoggerIsExists().catch(err => null);
                        const result = yield this.$pool.query(sql);
                        yield new DB_1.DB(this.$state.get('TABLE_LOGGER'))
                            .create({
                            uuid: DB_1.DB.generateUUID(),
                            model: this.$state.get('MODEL_NAME'),
                            query: sql,
                            action: 'SELECT',
                            data: result.length
                                ? JSON.stringify(result.length === 1 ? result[0] : result)
                                : null,
                            changed: null,
                            createdAt: this.$utils.timestamp(),
                            updatedAt: this.$utils.timestamp()
                        })
                            .void()
                            .save()
                            .catch(_ => null);
                        return result;
                    }
                }
                const result = yield this.$pool.query(sql);
                return result;
            }
            catch (error) {
                if ((_a = this.$state.get('JOIN')) === null || _a === void 0 ? void 0 : _a.length)
                    throw error;
                const retry = Number(this.$state.get('RETRY'));
                yield this._checkSchemaOrNextError(error, retry);
                this.$state.set('RETRY', retry + 1);
                return yield this._queryStatement(sql);
            }
        });
    }
    /**
     *
     * execute the query using raw sql syntax actions for insert update and delete
     * @override
     * @param {Object} actions
     * @property {Function} actions.sqlresult
     * @property {Function} actions.returnId
     * @returns {this} this
     */
    _actionStatement(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sql, returnId = false }) {
            var _b;
            try {
                if (this.$state.get('DEBUG'))
                    this.$utils.consoleDebug(sql);
                if (this.$state.get('LOGGER')) {
                    const updateRegex = /^UPDATE\b/i;
                    const insertRegex = /^INSERT\b/i;
                    const deleteRegex = /^DELETE\b/i;
                    const loggerOptions = this.$state.get('LOGGER_OPTIONS');
                    if (insertRegex.test(sql) && loggerOptions.inserted) {
                        yield this._checkTableLoggerIsExists().catch(_ => null);
                        const result = yield this.$pool.query(sql);
                        const changed = yield new Model()
                            .copyModel(this, {
                            where: false,
                            orderBy: true,
                            limit: true
                        })
                            .where('id', result.insertId)
                            .disableVoid()
                            .get();
                        yield new DB_1.DB(this.$state.get('TABLE_LOGGER'))
                            .create({
                            uuid: DB_1.DB.generateUUID(),
                            model: this.$state.get('MODEL_NAME'),
                            query: sql,
                            action: 'INSERTD',
                            data: changed.length
                                ? JSON.stringify(changed.length === 1 ? changed[0] : changed)
                                : null,
                            changed: null,
                            createdAt: this.$utils.timestamp(),
                            updatedAt: this.$utils.timestamp()
                        })
                            .void()
                            .save()
                            .catch(_ => null);
                        if (returnId)
                            return [result.affectedRows, result.insertId];
                        return result.affectedRows;
                    }
                    if (updateRegex.test(sql) && loggerOptions.updated) {
                        yield this._checkTableLoggerIsExists().catch(err => null);
                        const createdAt = this.$utils.timestamp();
                        const data = yield new Model().copyModel(this, {
                            where: true,
                            orderBy: true,
                            limit: true
                        })
                            .disableVoid()
                            .get();
                        const result = yield this.$pool.query(sql);
                        const changed = yield new Model().copyModel(this, {
                            where: true,
                            orderBy: true,
                            limit: true
                        })
                            .disableSoftDelete()
                            .disableVoid()
                            .get();
                        const updatedAt = this.$utils.timestamp();
                        yield new DB_1.DB(this.$state.get('TABLE_LOGGER'))
                            .create({
                            uuid: DB_1.DB.generateUUID(),
                            model: this.$state.get('MODEL_NAME'),
                            query: sql,
                            action: 'UPDATED',
                            data: data.length
                                ? JSON.stringify(data.length === 1 ? data[0] : data)
                                : null,
                            changed: changed.length
                                ? JSON.stringify(changed.length === 1 ? changed[0] : changed)
                                : null,
                            createdAt,
                            updatedAt
                        })
                            .void()
                            .save()
                            .catch(_ => null);
                        if (returnId)
                            return [result.affectedRows, result.insertId];
                        return result.affectedRows;
                    }
                    if (deleteRegex.test(sql) && loggerOptions.deleted) {
                        yield this._checkTableLoggerIsExists().catch(err => null);
                        const data = yield new Model().copyModel(this, {
                            where: true,
                            orderBy: true,
                            limit: true
                        })
                            .disableVoid()
                            .get();
                        const result = yield this.$pool.query(sql);
                        yield new DB_1.DB(this.$state.get('TABLE_LOGGER'))
                            .create({
                            uuid: DB_1.DB.generateUUID(),
                            model: this.$state.get('MODEL_NAME'),
                            query: sql,
                            action: 'DELETED',
                            data: data.length
                                ? JSON.stringify(data.length === 1 ? data[0] : data)
                                : null,
                            changed: null,
                            createdAt: this.$utils.timestamp(),
                            updatedAt: this.$utils.timestamp()
                        })
                            .void()
                            .save()
                            .catch(_ => null);
                        if (returnId)
                            return [result.affectedRows, result.insertId];
                        return result.affectedRows;
                    }
                }
                const result = yield this.$pool.query(sql);
                if (returnId)
                    return [result.affectedRows, result.insertId];
                return result.affectedRows;
            }
            catch (error) {
                if ((_b = this.$state.get('JOIN')) === null || _b === void 0 ? void 0 : _b.length)
                    throw error;
                yield this._checkSchemaOrNextError(error, Number(this.$state.get('RETRY')));
                this.$state.set('RETRY', Number(this.$state.get('RETRY')) + 1);
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
     * @returns {this} this
     */
    table(table) {
        this.$state.set('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     *  @param {boolean} condition
     * @returns {this} this
     */
    disableSoftDelete(condition = false) {
        this.$state.set('SOFT_DELETE', condition);
        return this;
    }
    /**
     * The 'disableVoid' method is used to ignore void.
     *
     * @returns {this} this
     */
    disableVoid() {
        this.$state.set('VOID', false);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @returns {this} this
     */
    ignoreSoftDelete(condition = false) {
        this.$state.set('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign build in function to result of data
     * @param {Record} func
     * @returns {this} this
     */
    registry(func) {
        this.$state.set('REGISTRY', Object.assign(Object.assign({}, func), { '$save': this._save.bind(this), '$attach': this._attach.bind(this), '$detach': this._detach.bind(this) }));
        return this;
    }
    /**
     * The 'with' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @returns {this} this
     * @example
     *   import { Model , TR } from 'tspace-mysql'
     *
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
        if (!nameRelations.length)
            return this;
        this.$state.set('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'default'));
        return this;
    }
    /**
     * The 'relations' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @returns {this} this
     * @example
     *   import { Model , TR } from 'tspace-mysql'
     *
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
    relations(...nameRelations) {
        return this.with(...nameRelations);
    }
    /**
     * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method ignore soft delete
     * @param {...string} nameRelations if data exists return empty
     * @returns {this} this
     */
    withAll(...nameRelations) {
        var _a;
        if (!nameRelations.length)
            return this;
        this.$state.set('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'all'));
        return this;
    }
    /**
     * The 'relationsAll' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * It's method ignore soft delete
     * @param {...string} nameRelations if data exists return empty
     * @returns {this} this
     */
    relationsAll(...nameRelations) {
        return this.withAll(...nameRelations);
    }
    /**
     * The 'withCount' method is used to eager load related (relations) data and count data in the relation.
     *
     * @param {...string} nameRelations if data exists return 0
     * @returns {this} this
     */
    withCount(...nameRelations) {
        var _a;
        if (!nameRelations.length)
            return this;
        this.$state.set('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'count'));
        return this;
    }
    /**
     * The 'relationsCount' method is used to eager load related (relations) data and count data in the relation.
     *
     * @param {...string} nameRelations if data exists return 0
     * @returns {this} this
     */
    relationsCount(...nameRelations) {
        var _a;
        if (!nameRelations.length)
            return this;
        this.$state.set('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'count'));
        return this;
    }
    /**
     * The 'withTrashed' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * It's method return results only in trash (soft deleted)
     * @param {...string} nameRelations if data exists return blank
     * @returns {this} this
     */
    withTrashed(...nameRelations) {
        var _a;
        if (!nameRelations.length)
            return this;
        this.$state.set('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'trashed'));
        return this;
    }
    /**
     * The 'relationsTrashed' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
     *
     * It's method return results only in trash (soft deleted)
     * @param {...string} nameRelations if data exists return blank
     * @returns {this} this
     */
    relationsTrashed(...nameRelations) {
        return this.withTrashed(...nameRelations);
    }
    /**
     * The 'withExists' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { TRelationOptions } from '../types';
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
     *  await new User().withExists('posts').findMany()
     */
    withExists(...nameRelations) {
        var _a;
        if (!nameRelations.length)
            return this;
        this.$state.set('RELATIONS_EXISTS', true);
        this.$state.set('RELATIONS', (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.apply(nameRelations, 'exists'));
        return this;
    }
    /**
     * The 'relationsExists' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { TRelationOptions } from '../types';
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
    relationsExists(...nameRelations) {
        return this.withExists(...nameRelations);
    }
    /**
     * The 'has' method is used to eager load related (relations) data when retrieving records from a database.
     *
     * Eager loading allows you to retrieve a primary model and its related models in a more efficient
     * It's method return only exists result of relation query
     * @param {...string} nameRelations
     * @returns {this} this
     * @example
     *   import { Model } from 'tspace-mysql'
     *   import { TRelationOptions } from '../types';
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
     * @param {object} options pivot the query
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
     *   .withQuery('posts', (query : Post) => {
     *       return query.relations('comments','user')
     *       .withQuery('comments', (query : Comment) => {
     *           return query.relations('user','post')
     *       })
     *       .withQuery('user', (query : User) => {
     *           return query.relations('posts').withQuery('posts',(query : Post)=> {
     *               return query.relations('comments','user')
     *               // relation n, n, ...n
     *           })
     *       })
     *   })
     *  .findMany()
     * @returns {this} this
     */
    withQuery(nameRelation, callback, options = { pivot: false }) {
        var _a, _b;
        this.with(nameRelation);
        if (options.pivot) {
            (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.callbackPivot(String(nameRelation), callback);
            return this;
        }
        (_b = this.$relation) === null || _b === void 0 ? void 0 : _b.callback(String(nameRelation), callback);
        return this;
    }
    /**
     *
     * The 'relationQuery' method is particularly useful when you want to filter or add conditions records based on related data.
     *
     * Use relation '${name}' registry models then return callback queries
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @param {object} options pivot the query
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
     * @returns {this} this
     */
    relationQuery(nameRelation, callback, options = { pivot: false }) {
        return this.withQuery(nameRelation, callback, options);
    }
    /**
     *
     * The 'findWithQuery' method is particularly useful when you want to filter or add conditions records based on related data.
     *
     * Use relation '${name}' registry models then return callback queries
     * @param {string} nameRelation name relation in registry in your model
     * @returns {Model} model instance
     */
    findWithQuery(nameRelation) {
        var _a;
        const instanceCallback = (_a = this.$relation) === null || _a === void 0 ? void 0 : _a.returnCallback(nameRelation);
        return instanceCallback == null ? null : instanceCallback;
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
     * @returns   {this}   this
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
     * @returns   {this}   this
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
     * @returns   {this}   this
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
     * @returns   {this}   this
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
     * @returns   {this} this
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
     * @returns   {this} this
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
     * @returns   {this} this
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
     * @returns   {this} this
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
     * @returns {this} this
     */
    onlyTrashed() {
        this.disableSoftDelete();
        const column = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
        this.whereNotNull(column);
        return this;
    }
    /**
     * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
     *
     * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
     * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
     * @returns {this} this
     */
    trashed() {
        return this.onlyTrashed();
    }
    /**
     * restore data in trashed
     * @returns {promise}
     */
    restore() {
        return __awaiter(this, void 0, void 0, function* () {
            this.disableSoftDelete();
            const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
            const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
            const query = this.$state.get('TIMESTAMP')
                ? `${deletedAt} = NULL , ${updatedAt} = '${this.$utils.timestamp()}'`
                : `${deletedAt} = NULL`;
            this.$state.set('UPDATE', [
                `${this.$constants('UPDATE')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `SET ${query}`
            ].join(' '));
            this.$state.set('SAVE', 'UPDATE');
            return yield this.save();
        });
    }
    /**
     *
     * @returns {string} string
     */
    toTableName() {
        return this.getTableName();
    }
    /**
     *
     * @param {string} column
     * @returns {string} string
     */
    toTableNameAndColumn(column) {
        return `\`${this.getTableName()}\`.\`${this._valuePattern(column)}\``;
    }
    /**
     * @override
     * @param {string | K} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this} this
     */
    where(column, operator, value) {
        if (typeof column === 'object') {
            return this.whereObject(column);
        }
        const c = this._columnPattern(String(column));
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (value === null) {
            return this.whereNull(column);
        }
        if (Array.isArray(value)) {
            return this.whereIn(column, value);
        }
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(String(c))}`,
                `${operator}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    orWhere(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        const c = this._columnPattern(String(column));
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (value === null) {
            return this.orWhereNull(column);
        }
        if (Array.isArray(value)) {
            return this.orWhereIn(column, value);
        }
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(String(c))}`,
                `${operator}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {Object} columns
     * @returns {this}
     */
    whereObject(columns) {
        for (let column in columns) {
            const operator = '=';
            const value = this.$utils.escape(columns[column]);
            const c = this._columnPattern(String(column));
            if (value === null) {
                this.whereNull(column);
                continue;
            }
            const useOp = this._checkValueHasOp(value);
            if (useOp == null) {
                this.$state.set('WHERE', [
                    ...this.$state.get('WHERE'),
                    [
                        this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                        `${this.bindColumn(String(c))}`,
                        `${operator}`,
                        `${this._checkValueHasRaw(value)}`
                    ].join(' ')
                ]);
                continue;
            }
            switch (useOp.op) {
                case 'IN': {
                    this.whereIn(column, Array.isArray(useOp.value) ? useOp.value : useOp.value.split(','));
                    break;
                }
                case '|IN': {
                    this.orWhereIn(column, Array.isArray(useOp.value) ? useOp.value : useOp.value.split(','));
                    break;
                }
                case 'QUERY': {
                    this.whereSubQuery(column, useOp.value);
                    break;
                }
                case '!QUERY': {
                    this.orWhereSubQuery(column, useOp.value);
                    break;
                }
                case 'NOT IN': {
                    this.whereNotIn(column, Array.isArray(useOp.value) ? useOp.value : useOp.value.split(','));
                    break;
                }
                case '|NOT IN': {
                    this.orWhereNotIn(column, Array.isArray(useOp.value) ? useOp.value : useOp.value.split(','));
                    break;
                }
                case 'IS NULL': {
                    this.whereNull(column);
                    break;
                }
                case '|IS NULL': {
                    this.orWhereNull(column);
                    break;
                }
                case 'IS NOT NULL': {
                    this.whereNotNull(column);
                    break;
                }
                case '|IS NOT NULL': {
                    this.orWhereNotNull(column);
                    break;
                }
                default: {
                    if (useOp.op.includes('|')) {
                        this.orWhere(column, useOp.op.replace('|', ''), useOp.value);
                        break;
                    }
                    this.where(column, useOp.op, useOp.value);
                }
            }
        }
        return this;
    }
    /**
    * @override
    * @param    {string} column
    * @param    {object}  property object { key , value , operator }
    * @property {string}  property.key
    * @property {string}  property.value
    * @property {string?} property.operator
    * @returns   {this}
    */
    whereJSON(column, { key, value, operator }) {
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}->>'$.${key}'`,
                `${operator == null ? "=" : operator.toLocaleUpperCase()}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {number} userId
     * @param {string?} column custom it *if column is not user_id
     * @returns {this}
     */
    whereUser(userId, column = 'user_id') {
        column = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)} = ${this.$utils.escape(userId)}`,
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereIn(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        const values = array.length
            ? `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`
            : this.$constants(this.$constants('NULL'));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereIn(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        const values = array.length
            ? `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`
            : this.$constants(this.$constants('NULL'));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereNotIn(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('NOT_IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereNotIn(column, array) {
        if (!Array.isArray(array)) {
            this._assertError(`This 'orWhereNotIn' method is required array only`);
        }
        const c = this._columnPattern(String(column));
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('NOT_IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    whereSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery)) {
            throw this._assertError(`This "subQuery" is invalid. Sub query is should contain 1 column(s)`);
        }
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    whereNotSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery)) {
            throw this._assertError(`This "subQuery" is invalid. Sub query is should contain 1 column(s)`);
        }
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('NOT_IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    orWhereSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery)) {
            throw this._assertError(`This "subQuery" is invalid. Sub query is should contain 1 column(s)`);
        }
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length
                    ? `${this.$constants('OR')}`
                    : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string} subQuery
     * @returns {this}
     */
    orWhereNotSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery)) {
            throw this._assertError(`This "subQuery" is invalid. Sub query is should contain 1 column(s)`);
        }
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length
                    ? `${this.$constants('OR')}`
                    : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('NOT_IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereBetween(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                    `${this.bindColumn(c)}`,
                    `${this.$constants('BETWEEN')}`,
                    `${this.$constants(this.$constants('NULL'))}`,
                    `${this.$constants('AND')}`,
                    `${this.$constants(this.$constants('NULL'))}`
                ].join(' ')
            ]);
            return this;
        }
        const [value1, value2] = array;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereBetween(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                    `${this.bindColumn(c)}`,
                    `${this.$constants('BETWEEN')}`,
                    `${this.$constants(this.$constants('NULL'))}`,
                    `${this.$constants('AND')}`,
                    `${this.$constants(this.$constants('NULL'))}`
                ].join(' ')
            ]);
            return this;
        }
        const [value1, value2] = array;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    whereNotBetween(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                    `${this.bindColumn(c)}`,
                    `${this.$constants('NOT_BETWEEN')}`,
                    `${this.$constants(this.$constants('NULL'))}`,
                    `${this.$constants('AND')}`,
                    `${this.$constants(this.$constants('NULL'))}`
                ].join(' ')
            ]);
            return this;
        }
        const [value1, value2] = array;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('NOT_BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {array} array
     * @returns {this}
     */
    orWhereNotBetween(column, array) {
        if (!Array.isArray(array)) {
            throw this._assertError("This method must require the value to be an array only.");
        }
        const c = this._columnPattern(String(column));
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                    `${this.bindColumn(c)}`,
                    `${this.$constants('NOT_BETWEEN')}`,
                    `${this.$constants(this.$constants('NULL'))}`,
                    `${this.$constants('AND')}`,
                    `${this.$constants(this.$constants('NULL'))}`
                ].join(' ')
            ]);
            return this;
        }
        const [value1, value2] = array;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('NOT_BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    whereNull(column) {
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IS_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    orWhereNull(column) {
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IS_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    whereNotNull(column) {
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IS_NOT_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @returns {this}
     */
    orWhereNotNull(column) {
        const c = this._columnPattern(String(column));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(c)}`,
                `${this.$constants('IS_NOT_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    whereSensitive(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        const c = this._columnPattern(String(column));
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.$constants('BINARY')}`,
                `${this.bindColumn(c)}`,
                `${operator}`,
                `${this._checkValueHasRaw(this.$utils.escape(value))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    whereStrict(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        const c = this._columnPattern(String(column));
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.$constants('BINARY')}`,
                `${this.bindColumn(c)}`,
                `${operator}`,
                `${this._checkValueHasRaw(this.$utils.escape(value))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @returns {this}
     */
    orWhereSensitive(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        const c = this._columnPattern(String(column));
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.$constants('BINARY')}`,
                `${this.bindColumn(c)}`,
                `${operator}`,
                `${this._checkValueHasRaw(this.$utils.escape(value))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {Function} callback callback query
     * @returns {this}
     */
    whereQuery(callback) {
        const db = new Model().copyModel(this);
        const repository = callback(db);
        if (repository instanceof Promise)
            throw this._assertError('The "whereQuery" method is not supported a Promise');
        if (!(repository instanceof Model))
            throw this._assertError(`Unknown callback query: '${repository}'`);
        const where = (repository === null || repository === void 0 ? void 0 : repository.$state.get('WHERE')) || [];
        if (!where.length)
            return this;
        const query = where.join(' ');
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length
                    ? `${this.$constants('AND')}`
                    : '',
                `(${query})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * @override
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    whereAny(columns, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.whereQuery((query) => {
            for (const index in columns) {
                const column = String(columns[index]);
                if (+index === 0) {
                    query.where(column, operator, value);
                    continue;
                }
                query.orWhere(column, operator, value);
            }
            return query;
        });
        return this;
    }
    /**
     * The 'whereAll' method is used to clause to a database query.
     *
     * This method allows you to specify conditions that the retrieved records must meet.
     *
     * If has only 2 arguments default operator '='
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @returns {this}
     */
    whereAll(columns, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.whereQuery((query) => {
            for (const key in columns) {
                const column = String(columns[key]);
                query.where(column, operator, value);
            }
            return query;
        });
        return this;
    }
    /**
     * @override
     * @returns {promise<boolean>} promise boolean
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this._guardWhereCondition();
            this.limit(1);
            if (this.$state.get('SOFT_DELETE')) {
                const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
                const sql = new Model()
                    .copyModel(this, { where: true, limit: true })
                    .bind(this.$pool.get())
                    .update({
                    [deletedAt]: this.$utils.timestamp()
                })
                    .toString();
                const result = yield this._actionStatement({ sql });
                const r = Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
                yield this._observer(r, 'updated');
                return r;
            }
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            const r = Boolean(this._resultHandler((_b = !!result) !== null && _b !== void 0 ? _b : false));
            yield this._observer(r, 'deleted');
            return r;
        });
    }
    /**
     * @override
     * @returns {promise<boolean>} promise boolean
     */
    deleteMany() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this._guardWhereCondition();
            if (this.$state.get('SOFT_DELETE')) {
                const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
                const sql = new Model()
                    .copyModel(this, { where: true, limit: true })
                    .bind(this.$pool.get())
                    .updateMany({
                    [deletedAt]: this.$utils.timestamp()
                })
                    .toString();
                const result = yield this._actionStatement({ sql });
                const r = Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
                yield this._observer(r, 'updated');
                return r;
            }
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            const r = Boolean(this._resultHandler((_b = !!result) !== null && _b !== void 0 ? _b : false));
            yield this._observer(r, 'deleted');
            return r;
        });
    }
    /**
     *
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one or more records that match certain criteria.
     *
     * This method should be ignore the soft delete
     * @returns {promise<boolean>}
     */
    forceDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.disableSoftDelete();
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            if (result)
                return Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
            return Boolean(this._resultHandler((_b = !!result) !== null && _b !== void 0 ? _b : false));
        });
    }
    /**
     * @override
     * @param {string=} column [column=id]
     * @returns {promise<Array>}
     */
    toArray(column) {
        return __awaiter(this, void 0, void 0, function* () {
            if (column == null)
                column = 'id';
            this.selectRaw(`${this.bindColumn(column)}`);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            const toArray = result.map((data) => data[column]);
            return this._resultHandler(toArray);
        });
    }
    /**
     *
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<Record<string,any> | null>} Record | null
    */
    first(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this._validateMethod('first');
            if (this.$state.get('VOID'))
                return this._resultHandler(undefined);
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            this.limit(1);
            let sql = this._queryBuilder().select();
            if (this.$state.get('RELATIONS_EXISTS'))
                sql = String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists());
            if (cb) {
                const callbackSql = cb(sql);
                if (callbackSql == null || callbackSql === '') {
                    throw this._assertError('Please provide a callback for execution');
                }
                sql = callbackSql;
            }
            return yield this._execute({
                sql,
                type: 'FIRST'
            });
        });
    }
    /**
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<Record<string,any> | null>} Record | null
    */
    findOne(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.first(cb);
        });
    }
    /**
     * @override
     * @returns {promise<object | Error>} Record | throw error
    */
    firstOrError(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this._validateMethod('firstOrError');
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            this.limit(1);
            let sql = this._queryBuilder().select();
            if (this.$state.get('RELATIONS_EXISTS'))
                sql = String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists());
            return yield this._execute({
                sql,
                type: 'FIRST_OR_ERROR',
                message,
                options
            });
        });
    }
    /**
     *
     * @override
     * @returns {promise<any>} Record | throw error
    */
    findOneOrError(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.firstOrError(message, options);
        });
    }
    /**
     *
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<array>} Array
    */
    get(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this._validateMethod('get');
            if (this.$state.get('VOID'))
                return [];
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            let sql = this._queryBuilder().select();
            if (this.$state.get('RELATIONS_EXISTS'))
                sql = String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists());
            if (cb) {
                const callbackSql = cb(sql);
                if (callbackSql == null || callbackSql === '') {
                    throw this._assertError('Please provide a callback for execution');
                }
                sql = callbackSql;
            }
            return yield this._execute({
                sql,
                type: 'GET'
            });
        });
    }
    /**
     *
     * @override
     * @param {Function?} cb callback function return query sql
     * @returns {promise<array>} Array
    */
    findMany(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(cb);
        });
    }
    /**
     * @override
     * @param {object?} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @returns {promise<Pagination>} Pagination
     */
    pagination(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this._validateMethod('pagination');
            let limit = 15;
            let page = 1;
            if (paginationOptions != null) {
                limit = ((paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit);
                page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
            }
            limit = limit > 1000 ? 1000 : limit;
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            const offset = (page - 1) * limit;
            this.$state.set('PER_PAGE', limit);
            this.$state.set('PAGE', page);
            this.limit(limit);
            this.offset(offset);
            let sql = this._queryBuilder().select();
            if (this.$state.get('RELATIONS_EXISTS'))
                sql = String((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.loadExists());
            return yield this._execute({
                sql,
                type: 'PAGINATION'
            });
        });
    }
    /**
    *
    * @override
    * @param    {?object} paginationOptions by default page = 1 , limit = 15
    * @property {number}  paginationOptions.limit
    * @property {number}  paginationOptions.page
    * @returns   {promise<Pagination>} Pagination
    */
    paginate(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.pagination(paginationOptions);
        });
    }
    /**
     * @override
     * @param {string} column
     * @returns {Promise<array>} Array
     */
    getGroupBy(column) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
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
            const grouping = yield new Model()
                .copyModel(this)
                .whereIn('id', data.map((v) => v))
                .debug(this.$state.get('DEBUG'))
                .get();
            const result = results.map((result) => {
                const id = result[column];
                const newData = grouping.filter((data) => data[column] === id);
                return ({
                    [column]: id,
                    data: newData
                });
            });
            return this._resultHandler(result);
        });
    }
    /**
     * @override
     * @param {string} column
     * @returns {Promise<array>} Array
     */
    findGroupBy(column) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getGroupBy(column);
        });
    }
    /**
     * @override
     * @param {object} data for insert
     * @returns {this} this
     */
    insert(data) {
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        this.$state.set('DATA', data);
        const query = this._queryInsertModel(data);
        this.$state.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'INSERT');
        return this;
    }
    /**
     * @override
     * @param {object} data for insert
     * @returns {this} this
     */
    create(data) {
        return this.insert(data);
    }
    /**
     * @override
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @returns {this} this
     */
    update(data, updateNotExists = []) {
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        if (updateNotExists.length) {
            for (const c of updateNotExists) {
                for (const column in data) {
                    if (c !== column)
                        continue;
                    const value = data[column];
                    data = Object.assign(Object.assign({}, data), { [column]: this._updateHandler(column, value) });
                    break;
                }
            }
        }
        this.$state.set('DATA', data);
        this.limit(1);
        const query = this._queryUpdateModel(data);
        this.$state.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'UPDATE');
        return this;
    }
    /**
     * @override
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data}
     * @returns {this} this
     */
    updateMany(data, updateNotExists = []) {
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        if (updateNotExists.length) {
            for (const c of updateNotExists) {
                for (const column in data) {
                    if (c !== column)
                        continue;
                    const value = data[column];
                    data = Object.assign(Object.assign({}, data), { [column]: this._updateHandler(column, value) });
                    break;
                }
            }
        }
        this.$state.set('DATA', data);
        const query = this._queryUpdateModel(data);
        this.$state.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'UPDATE');
        return this;
    }
    /**
     * @override
     * @param {object} data
     * @returns {this} this
     */
    updateNotExists(data) {
        this.limit(1);
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        for (const column in data) {
            const value = data[column];
            data = Object.assign(Object.assign({}, data), { [column]: this._updateHandler(column, value) });
        }
        this.$state.set('DATA', data);
        const query = this._queryUpdateModel(data);
        this.$state.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'UPDATE');
        return this;
    }
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    updateOrCreate(data) {
        this.limit(1);
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        const queryUpdate = this._queryUpdateModel(data);
        const queryInsert = this._queryInsertModel(data);
        this.$state.set('DATA', data);
        this.$state.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${queryInsert}`
        ].join(' '));
        this.$state.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${queryUpdate}`
        ].join(' '));
        this.$state.set('SAVE', 'UPDATE_OR_INSERT');
        return this;
    }
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    updateOrInsert(data) {
        return this.updateOrCreate(data);
    }
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    insertOrUpdate(data) {
        return this.updateOrCreate(data);
    }
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    createOrUpdate(data) {
        return this.updateOrCreate(data);
    }
    /**
     * @override
     * @param {object} data for create
     * @returns {this} this
     */
    createOrSelect(data) {
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        this.$state.set('DATA', data);
        const queryInsert = this._queryInsertModel(data);
        this.$state.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${queryInsert}`
        ].join(' '));
        this.$state.set('SAVE', 'INSERT_OR_SELECT');
        return this;
    }
    /**
     * @override
     * @param {object} data for update or create
     * @returns {this} this
     */
    insertOrSelect(data) {
        return this.createOrSelect(data);
    }
    /**
    *
    * @override
    * @param {object} data create not exists data
    * @returns {this} this
    */
    createNotExists(data) {
        if (!Object.keys(data).length) {
            throw this._assertError('This method must require at least 1 argument.');
        }
        this.$state.set('DATA', data);
        const query = this._queryInsertModel(data);
        this.$state.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'INSERT_NOT_EXISTS');
        return this;
    }
    /**
     *
     * @override
     * @param {object} data create not exists data
     * @returns {this} this this
     */
    insertNotExists(data) {
        return this.createNotExists(data);
    }
    /**
     * @override
     * @param {Record<string,any>[]} data create multiple data
     * @returns {this} this this
     */
    createMultiple(data) {
        if (!Array.isArray(data) || !data.length) {
            throw this._assertError('This method must require a non-empty array.');
        }
        this.$state.set('DATA', data);
        const query = this._queryInsertMultipleModel(data);
        this.$state.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    }
    /**
     *
     * @override
     * @param {Record<string,any>[]} data create multiple data
     * @returns {this} this
     */
    insertMultiple(data) {
        return this.createMultiple(data);
    }
    /**
     *
     * @override
     * @param {{when : Object , columns : Object}[]} cases update multiple data specific columns by cases update
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.when
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.columns
     * @returns {this} this
     */
    updateMultiple(cases) {
        if (!cases.length) {
            throw this._assertError('This method must require a non-empty array.');
        }
        this.limit(cases.length);
        const updateColumns = cases.reduce((columns, item) => {
            return (item.columns && Object.keys(item.columns).forEach(key => columns[key] = [
                this.$constants('RAW'),
                this.$constants('CASE'),
                `${this.$constants('ELSE')} ${this.bindColumn(key)}`,
                this.$constants('END')
            ]), columns);
        }, {});
        const columns = cases.reduce((columns, item) => {
            return (item.columns && Object.keys(item.columns).forEach(key => columns[key] = ''), columns);
        }, {});
        if (this.$state.get('TIMESTAMP')) {
            const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
            columns[updatedAt] = [];
            updateColumns[updatedAt] = [
                this.$constants('RAW'),
                this.$constants('CASE'),
                `${this.$constants('ELSE')} ${this.bindColumn(updatedAt)}`,
                this.$constants('END')
            ];
        }
        for (let i = cases.length - 1; i >= 0; i--) {
            const c = cases[i];
            if (c.when == null || !Object.keys(c.when).length) {
                throw this._assertError(`This 'when' property is missing some properties.`);
            }
            if (c.columns == null || !Object.keys(c.columns).length) {
                throw this._assertError(`This 'columns' property is missing some properties.`);
            }
            const when = Object.entries(c.when).map(([key, value]) => {
                value = this.$utils.escape(value);
                value = this._valueTrueFalse(value);
                return `${this.bindColumn(key)} = '${value}'`;
            });
            if (this.$state.get('TIMESTAMP')) {
                const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
                c.columns[updatedAt] = this.$utils.timestamp();
            }
            for (const [key, value] of Object.entries(c.columns)) {
                if (updateColumns[key] == null)
                    continue;
                const startIndex = updateColumns[key].indexOf(this.$constants('CASE'));
                const str = `${this.$constants('WHEN')} ${when.join(` ${this.$constants('AND')} `)} ${this.$constants('THEN')} '${value}'`;
                updateColumns[key].splice(startIndex + 1, 0, str);
            }
        }
        for (const key in columns) {
            if (updateColumns[key] == null)
                continue;
            columns[key] = `( ${updateColumns[key].join(' ')} )`;
        }
        const keyValue = Object.entries(columns).map(([column, value]) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                value = this.$utils.escapeActions(value);
            }
            return `${this.bindColumn(column)} = ${value == null || value === this.$constants('NULL')
                ? this.$constants('NULL')
                : this._checkValueHasRaw(value)}`;
        });
        const query = `${this.$constants('SET')} ${keyValue.join(', ')}`;
        this.$state.set('DATA', columns);
        this.$state.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.whereRaw('1');
        this.$state.set('SAVE', 'UPDATE');
        return this;
    }
    /**
     * The 'getSchemaModel' method is used get a schema model
     * @returns {Record<string, Blueprint> | null} Record<string, Blueprint> | null
     */
    getSchemaModel() {
        if (this.$schema == null)
            return this.$state.get('SCHEMA_TABLE');
        return this.$schema;
    }
    /**
     * The 'validation' method is used validate the column by validating
     * @param {ValidateSchema} schema
     * @returns {this} this
     */
    validation(schema) {
        this.$state.set('VALIDATE_SCHEMA', true);
        this.$state.set('VALIDATE_SCHEMA_DEFINED', schema);
        return this;
    }
    /**
     * The 'bindPattern' method is used to covert column relate with pattern
     * @param {string} column
     * @returns {string} return table.column
     */
    bindPattern(column) {
        return this._valuePattern(column);
    }
    /**
     * @override
     * @returns {Promise<Record<string,any> | any[] | null | undefined>}
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('save');
            switch (String(this.$state.get('SAVE'))) {
                case 'INSERT': return yield this._insertModel();
                case 'UPDATE': return yield this._updateModel();
                case 'INSERT_MULTIPLE': return yield this._createMultipleModel();
                case 'INSERT_NOT_EXISTS': return yield this._insertNotExistsModel();
                case 'UPDATE_OR_INSERT': return yield this._updateOrInsertModel();
                case 'INSERT_OR_SELECT': return yield this._insertOrSelectModel();
                default: throw this._assertError(`Unknown this [${this.$state.get('SAVE')}]`);
            }
        });
    }
    /**
     *
     * @override
     * @param {number} rows number of rows
     * @param {Function} callback function will be called data and index
     * @returns {promise<void>}
     */
    faker(rows, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = [];
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('FIELDS')}`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            const schemaModel = this.getSchemaModel();
            const fields = schemaModel == null
                ? yield this._queryStatement(sql)
                : Object.entries(schemaModel).map(([key, value]) => {
                    return {
                        Field: key,
                        Type: value.type
                    };
                });
            if (this.$state.get('TABLE_NAME') === '' || this.$state.get('TABLE_NAME') == null) {
                throw this._assertError("Unknow this table.");
            }
            for (let row = 0; row < rows; row++) {
                let columnAndValue = {};
                for (const { Field: field, Type: type } of fields) {
                    const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
                    const passed = ['id', '_id', 'uuid', deletedAt].some(p => field === p);
                    if (passed)
                        continue;
                    columnAndValue = Object.assign(Object.assign({}, columnAndValue), { [field]: this.$utils.faker(type) });
                }
                if (callback) {
                    data.push(callback(columnAndValue, row));
                    continue;
                }
                data.push(columnAndValue);
            }
            yield this.createMultiple(data).void().save();
            return;
        });
    }
    /**
     * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
     * @type     {object}  options
     * @property {boolean} options.force - forec always check all columns if not exists will be created
     * @property {boolean} options.log   - show log execution with sql statements
     * @property {boolean} options.foreign - check when has a foreign keys will be created
     * @property {boolean} options.changed - check when column is changed attribute will be change attribute
     * @returns {Promise<void>}
     */
    sync() {
        return __awaiter(this, arguments, void 0, function* ({ force = false, foreign = false, changed = false } = {}) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const checkTables = yield this._queryStatement(`${this.$constants('SHOW_TABLES')} ${this.$constants('LIKE')} '${this.getTableName()}'`);
            const existsTables = checkTables.map((c) => Object.values(c)[0]);
            const schemaModel = this.getSchemaModel();
            if (schemaModel == null)
                throw this._assertError(schemaModel == null, 'Schema model not found');
            const checkTableIsExists = existsTables.some((table) => table === this.getTableName());
            const syncForeignKey = (_j) => __awaiter(this, [_j], void 0, function* ({ schemaModel, model }) {
                var _k;
                for (const key in schemaModel) {
                    if (((_k = schemaModel[key]) === null || _k === void 0 ? void 0 : _k.foreignKey) == null)
                        continue;
                    const foreign = schemaModel[key].foreignKey;
                    const table = typeof foreign.on === "string" ? foreign.on : foreign.on.getTableName();
                    const sql = [
                        this.$constants('ALTER_TABLE'),
                        `\`${model.getTableName()}\``,
                        this.$constants('ADD_CONSTRAINT'),
                        `\`${model.getTableName()}(${key})_${table}(${foreign.references})\``,
                        `${this.$constants('FOREIGN_KEY')}(\`${key}\`)`,
                        `${this.$constants('REFERENCES')} \`${table}\`(\`${foreign.references}\`)`,
                        `${this.$constants('ON_DELETE')} ${foreign.onDelete} ${this.$constants('ON_UPDATE')} ${foreign.onUpdate}`
                    ].join(' ');
                    try {
                        yield model._queryStatement(sql);
                        continue;
                    }
                    catch (e) {
                        if (typeof foreign.on === "string")
                            continue;
                        if (String(e.message).includes("Duplicate foreign key constraint"))
                            continue;
                        const schemaModelOn = yield foreign.on.getSchemaModel();
                        if (!schemaModelOn)
                            continue;
                        const tableSql = new Schema_1.Schema().createTable(`\`${table}\``, schemaModelOn);
                        yield model._queryStatement(tableSql).catch(e => console.log(e));
                        yield model._queryStatement(sql).catch(e => console.log(e));
                        continue;
                    }
                }
            });
            if (!checkTableIsExists) {
                const sql = new Schema_1.Schema().createTable(`\`${this.getTableName()}\``, schemaModel);
                yield this._queryStatement(sql);
                yield syncForeignKey({ schemaModel, model: this });
            }
            if (foreign) {
                yield syncForeignKey({ schemaModel, model: this });
                return;
            }
            if (!force)
                return;
            const schemaTable = yield this.getSchema();
            const schemaTableKeys = schemaTable.map((k) => k.Field);
            const schemaModelKeys = Object.keys(schemaModel);
            const wasChangedColumns = changed ? Object.entries(schemaModel).map(([key, value]) => {
                const find = schemaTable.find(t => t.Field === key);
                if (find == null)
                    return null;
                const compare = String(find.Type).toLocaleLowerCase() !== String(value.type).toLocaleLowerCase();
                return compare ? key : null;
            }).filter(d => d != null) : [];
            if (wasChangedColumns.length) {
                for (const column of wasChangedColumns) {
                    if (column == null)
                        continue;
                    const type = (_b = (_a = schemaModel[column]) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : null;
                    const attributes = (_d = (_c = schemaModel[column]) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : null;
                    const sql = [
                        this.$constants('ALTER_TABLE'),
                        `\`${this.getTableName()}\``,
                        this.$constants('CHANGE'),
                        `\`${column}\``,
                        `\`${column}\` ${type} ${attributes.join(' ')}`,
                    ].join(' ');
                    yield this._queryStatement(sql);
                }
            }
            const missingColumns = schemaModelKeys.filter(schemaModelKey => !schemaTableKeys.includes(schemaModelKey));
            if (!missingColumns.length)
                return;
            const entries = Object.entries(schemaModel);
            for (const column of missingColumns) {
                const indexWithColumn = entries.findIndex(([key]) => key === column);
                const findAfterIndex = indexWithColumn ? entries[indexWithColumn - 1][0] : null;
                const type = (_f = (_e = schemaModel[column]) === null || _e === void 0 ? void 0 : _e.type) !== null && _f !== void 0 ? _f : null;
                const attributes = (_h = (_g = schemaModel[column]) === null || _g === void 0 ? void 0 : _g.attributes) !== null && _h !== void 0 ? _h : null;
                if (findAfterIndex == null || type == null || attributes == null)
                    continue;
                const sql = [
                    this.$constants('ALTER_TABLE'),
                    `\`${this.getTableName()}\``,
                    this.$constants('ADD'),
                    `\`${column}\` ${type} ${attributes.join(' ')}`,
                    this.$constants('AFTER'), ,
                    `\`${findAfterIndex}\``
                ].join(' ');
                yield this._queryStatement(sql);
            }
            return;
        });
    }
    covertColumnSchemaToFixColumn(column) {
        const schema = this.$state.get('SCHEMA_TABLE');
        if (schema == null)
            return column;
        const find = schema[column];
        if (find == null || find.column == null) {
            return column;
        }
        return find.column;
    }
    covertFixColumnToColumnSchema(column) {
        const schema = this.$state.get('SCHEMA_TABLE');
        if (schema == null)
            return column;
        const fixColumns = [];
        for (const key in schema) {
            const find = schema[key];
            if (find.column == null)
                continue;
            fixColumns.push({
                key,
                value: find.column
            });
        }
        const findColumnSameTheColumn = fixColumns.find(fixColumn => fixColumn.value === column);
        return findColumnSameTheColumn == null ? column : findColumnSameTheColumn.key;
    }
    _valuePattern(column) {
        const fixColumn = this.covertColumnSchemaToFixColumn(column);
        switch (this.$state.get('PATTERN')) {
            case this.$constants('PATTERN').snake_case: {
                return fixColumn === column
                    ? column.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`)
                    : fixColumn;
            }
            case this.$constants('PATTERN').camelCase: {
                return fixColumn === column
                    ? column.replace(/(.(_|-|\s)+.)/g, (str) => `${str[0]}${str[str.length - 1].toUpperCase()}`)
                    : fixColumn;
            }
            default: return column;
        }
    }
    _checkTableLoggerIsExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('LOGGER'))
                return;
            const tableLogger = this.$state.get('TABLE_LOGGER');
            const checkTables = yield new DB_1.DB().rawQuery(`${this.$constants('SHOW_TABLES')} ${this.$constants('LIKE')} '${tableLogger}'`);
            const existsTables = checkTables.map((c) => Object.values(c)[0])[0];
            if (existsTables != null)
                return;
            const schemaLogger = {
                id: new Blueprint_1.Blueprint().int().notNull().primary().autoIncrement(),
                uuid: new Blueprint_1.Blueprint().varchar(50).null(),
                model: new Blueprint_1.Blueprint().varchar(50).null(),
                query: new Blueprint_1.Blueprint().longText().null(),
                action: new Blueprint_1.Blueprint().varchar(50).null(),
                data: new Blueprint_1.Blueprint().json().null(),
                changed: new Blueprint_1.Blueprint().json().null(),
                createdAt: new Blueprint_1.Blueprint().timestamp().null(),
                updatedAt: new Blueprint_1.Blueprint().timestamp().null()
            };
            const sql = new Schema_1.Schema().createTable(`\`${tableLogger}\``, schemaLogger);
            yield new DB_1.DB().debug(this.$state.get('DEBUG')).rawQuery(sql);
            return;
        });
    }
    _columnPattern(column) {
        if (column.startsWith(this.$constants('RAW'))) {
            return column.replace(this.$constants('RAW'), '');
        }
        return this._valuePattern(column);
    }
    _isPatternSnakeCase() {
        return this.$state.get('PATTERN') === this.$constants('PATTERN').snake_case;
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
        this.$state.set('TABLE_NAME', `\`${this._valuePattern(tableName)}\``);
        this.$state.set('MODEL_NAME', this.constructor.name);
        return this;
    }
    _handleSoftDelete() {
        if (this.$state.get('SOFT_DELETE')) {
            const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
            const wheres = this.$state.get('WHERE');
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
    _handleSelect() {
        const selects = this.$state.get('SELECT');
        const hasStart = selects === null || selects === void 0 ? void 0 : selects.some(s => s.includes('*'));
        if (selects.length || hasStart)
            return this;
        const schemaColumns = this.getSchemaModel();
        if (schemaColumns == null)
            return this;
        const columns = [];
        for (const key in schemaColumns) {
            const schemaColumn = schemaColumns[key];
            if (schemaColumn.column == null) {
                columns.push(this.bindColumn(key));
                continue;
            }
            columns.push(this.bindColumn(schemaColumn.column, false));
        }
        if (!columns.length)
            return this;
        this.$state.set('SELECT', columns);
        return this;
    }
    /**
     *
     * generate sql statements
     * @override
     */
    _queryBuilder() {
        this._handleSoftDelete();
        this._handleSelect();
        return this._buildQueryStatement();
    }
    _showOnly(data) {
        let result = [];
        const hasNameRelation = this.$state.get('RELATIONS').map((w) => { var _a; return (_a = w.as) !== null && _a !== void 0 ? _a : w.name; });
        data.forEach((d) => {
            let newData = {};
            this.$state.get('ONLY').forEach((only) => {
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
            const validateSchema = this.$state.get('VALIDATE_SCHEMA');
            if (!validateSchema)
                return;
            const schemaTable = this.getSchemaModel();
            if (schemaTable == null) {
                throw this._assertError(`This method "validateSchema" isn't validation without schema. Please use the method "useSchema" for define your schema.`);
            }
            const schemaTableDefined = this.$state.get('VALIDATE_SCHEMA_DEFINED');
            const schema = schemaTableDefined !== null && schemaTableDefined !== void 0 ? schemaTableDefined : Object.keys(schemaTable).reduce((acc, key) => {
                acc[key] = schemaTable[key].valueType;
                return acc;
            }, {});
            if (schema == null || !Object.keys(schema).length)
                return;
            const regexDate = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
            const regexDateTime = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
            for (const column in schema) {
                if (data == null)
                    continue;
                const s = schema[column];
                const r = data[column];
                const typeOf = (r) => this.$utils.typeOf(r);
                if (typeOf(s) !== 'object') {
                    if (r == null)
                        continue;
                    if (regexDate.test(r) || regexDateTime.test(r)) {
                        if (typeOf(new Date(r)) === typeOf(new s()))
                            continue;
                        throw this._assertError(`This column "${column}" is must be type "${typeOf(new s())}".`);
                    }
                    if (typeOf(r) === typeOf(new s()))
                        continue;
                    throw this._assertError(`This column "${column}" is must be type "${typeOf(new s())}".`);
                }
                if ((s.require && action === 'insert') && (r === '' || r == null)) {
                    throw this._assertError(`This column "${column}" is required.`);
                }
                if (r == null)
                    continue;
                if ((regexDate.test(r) || regexDateTime.test(r)) && typeOf(new Date(r)) !== typeOf(new s.type())) {
                    throw this._assertError(`This column "${column}" is must be type "${typeOf(new s.type())}".`);
                }
                if (typeOf(r) !== typeOf(new s.type())) {
                    throw this._assertError(`This column "${column}" is must be type "${typeOf(new s.type())}".`);
                }
                if (s.json) {
                    try {
                        JSON.parse(r);
                    }
                    catch (_) {
                        throw this._assertError(`This column "${column}" is must be JSON.`);
                    }
                }
                if (s.length && (`${r}`.length > s.length)) {
                    throw this._assertError(`This column "${column}" is more than "${s.length}" length of characters.`);
                }
                if (s.maxLength && (`${r}`.length > s.maxLength)) {
                    throw this._assertError(`This column "${column}" is more than "${s.maxLength}" length of characters.`);
                }
                if (s.minLength && (`${r}`.length < s.minLength)) {
                    throw this._assertError(`This column "${column}" is less than "${s.minLength}" length of characters`);
                }
                if (s.max && r > s.max)
                    throw this._assertError(`This column "${column}" is more than "${s.max}"`);
                if (s.min && r < s.min)
                    throw this._assertError(`This column "${column}" is less than "${s.min}"`);
                if ((s.enum && s.enum.length) && !s.enum.some((e) => e === r)) {
                    throw this._assertError(`This column "${column}" is must be in ${s.enum.map((e) => `"${e}"`)}`);
                }
                if (s.match && !s.match.test(r)) {
                    throw this._assertError(`This column "${column}" is not match a regular expression`);
                }
                if (s.fn && !(yield s.fn(r))) {
                    throw this._assertError(`This column "${column}" is not valid with function`);
                }
                if (s.unique && action === 'insert') {
                    const exist = yield new Model()
                        .copyModel(this, { select: true, where: true, limit: true })
                        .where(column, r)
                        .debug(this.$state.get('DEBUG'))
                        .exists();
                    if (exist)
                        throw this._assertError(`This column "${column}" is duplicated`);
                }
            }
            return;
        });
    }
    _execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sql, type, message, options }) {
            var _b, _c;
            let result = yield this._queryStatement(sql);
            if (!result.length)
                return this._returnEmpty(type, result, message, options);
            const relations = this.$state.get('RELATIONS');
            for (const relation of relations) {
                result = (_c = yield ((_b = this.$relation) === null || _b === void 0 ? void 0 : _b.load(result, relation))) !== null && _c !== void 0 ? _c : [];
            }
            if (this.$state.get('HIDDEN').length)
                this._hiddenColumnModel(result);
            return (yield this._returnResult(type, result)) || this._returnEmpty(type, result, message, options);
        });
    }
    _executeGroup(dataParents_1) {
        return __awaiter(this, arguments, void 0, function* (dataParents, type = 'GET') {
            var _a, _b, _c;
            if (!dataParents.length)
                return this._returnEmpty(type, dataParents);
            const relations = this.$state.get('RELATIONS');
            if (relations.length) {
                for (const relation of relations) {
                    dataParents = (_b = yield ((_a = this.$relation) === null || _a === void 0 ? void 0 : _a.load(dataParents, relation))) !== null && _b !== void 0 ? _b : [];
                }
            }
            if ((_c = this.$state.get('HIDDEN')) === null || _c === void 0 ? void 0 : _c.length)
                this._hiddenColumnModel(dataParents);
            const resultData = yield this._returnResult(type, dataParents);
            return resultData || this._returnEmpty(type, dataParents);
        });
    }
    _pagination(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const currentPage = +(this.$state.get('PAGE'));
            const limit = Number(this.$state.get('PER_PAGE'));
            if (limit < 1) {
                throw this._assertError("This pagination needed limit minimun less 1 for limit");
            }
            const total = yield new Model()
                .copyModel(this, { where: true, join: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .count(this.$state.get('PRIMARY_KEY'));
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
                    if (this.$state.get('RETURN_TYPE') != null) {
                        const returnType = this.$state.get('RETURN_TYPE');
                        emptyData = this._resultHandler(returnType === 'object'
                            ? null
                            : returnType === 'array' ? [] : null);
                        break;
                    }
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
                    break;
                }
                case 'GET': {
                    if (this.$state.get('RETURN_TYPE') != null) {
                        const returnType = this.$state.get('RETURN_TYPE');
                        emptyData = this._resultHandler(returnType === 'object'
                            ? null
                            : returnType === 'array' ? [] : null);
                        break;
                    }
                    emptyData = [];
                    break;
                }
                case 'PAGINATION': {
                    emptyData = {
                        meta: {
                            total: 0,
                            limit: Number(this.$state.get('PER_PAGE')),
                            totalPage: 0,
                            currentPage: Number(this.$state.get('PAGE')),
                            lastPage: 0,
                            nextPage: 0,
                            prevPage: 0
                        },
                        data: []
                    };
                    break;
                }
                default: throw this._assertError('Missing method first get or pagination');
            }
            if (this._isPatternSnakeCase()) {
                const empty = this.$utils.snakeCase(this._resultHandler(emptyData));
                yield this.$utils.hookHandle(this.$state.get('HOOKS'), empty);
                this._observer(empty, 'selected');
                return empty;
            }
            const empty = this._resultHandler(emptyData);
            yield this.$utils.hookHandle(this.$state.get('HOOKS'), empty);
            this._observer(empty, 'selected');
            return empty;
        });
    }
    _returnResult(type, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const registry = this.$state.get('REGISTRY');
            if (((_a = Object.keys(registry)) === null || _a === void 0 ? void 0 : _a.length) && registry != null) {
                for (const d of data) {
                    for (const name in registry) {
                        d[name] = registry[name];
                    }
                }
            }
            const functionRelation = this.$state.get('FUNCTION_RELATION');
            if (functionRelation) {
                for (const d of data) {
                    for (const r of this.$state.get('RELATION')) {
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
            if ((_b = this.$state.get('ONLY')) === null || _b === void 0 ? void 0 : _b.length)
                data = this._showOnly(data);
            let result = null;
            let res = [];
            for (const r of data) {
                const newData = {};
                for (const origin in r) {
                    const value = r[origin];
                    const covert = this.covertFixColumnToColumnSchema(origin);
                    if (origin === covert) {
                        newData[origin] = value;
                        continue;
                    }
                    newData[covert] = value;
                }
                if (Object.keys(newData).length) {
                    res.push(newData);
                }
            }
            if (!res.length)
                res = data;
            switch (type) {
                case 'FIRST': {
                    if (this.$state.get('PLUCK')) {
                        const pluck = this.$state.get('PLUCK');
                        const newData = res[0];
                        const checkProperty = newData.hasOwnProperty(pluck);
                        if (!checkProperty) {
                            this._assertError(`Can't find property '${pluck}' of results.`);
                        }
                        result = this._resultHandler(newData[pluck]);
                        break;
                    }
                    if (this.$state.get('RETURN_TYPE') != null) {
                        const returnType = this.$state.get('RETURN_TYPE');
                        result = this._resultHandler(returnType === 'object'
                            ? res[0]
                            : returnType === 'array' ? res : [res]);
                        break;
                    }
                    result = this._resultHandler((_c = res[0]) !== null && _c !== void 0 ? _c : null);
                    break;
                }
                case 'FIRST_OR_ERROR': {
                    if (this.$state.get('PLUCK')) {
                        const pluck = this.$state.get('PLUCK');
                        const newData = res[0];
                        const checkProperty = newData.hasOwnProperty(pluck);
                        if (!checkProperty) {
                            throw this._assertError(`Can't find property '${pluck}' of results`);
                        }
                        result = (_d = this._resultHandler(newData[pluck])) !== null && _d !== void 0 ? _d : null;
                        break;
                    }
                    if (this.$state.get('RETURN_TYPE') != null) {
                        const returnType = this.$state.get('RETURN_TYPE');
                        result = this._resultHandler(returnType === 'object'
                            ? res[0]
                            : returnType === 'array' ? res : [res]);
                        break;
                    }
                    result = this._resultHandler((_e = res[0]) !== null && _e !== void 0 ? _e : null);
                    break;
                }
                case 'GET': {
                    if (this.$state.get('CHUNK')) {
                        const r = data.reduce((resultArray, item, index) => {
                            const chunkIndex = Math.floor(index / this.$state.get('CHUNK'));
                            if (!resultArray[chunkIndex])
                                resultArray[chunkIndex] = [];
                            resultArray[chunkIndex].push(item);
                            return resultArray;
                        }, []);
                        result = this._resultHandler(r);
                        break;
                    }
                    if (this.$state.get('PLUCK')) {
                        const pluck = this.$state.get('PLUCK');
                        const newData = data.map((d) => d[pluck]);
                        if (newData.every((d) => d == null)) {
                            throw this._assertError(`Can't find property '${pluck}' of results.`);
                        }
                        result = this._resultHandler(newData);
                        break;
                    }
                    if (this.$state.get('RETURN_TYPE') != null) {
                        const returnType = this.$state.get('RETURN_TYPE');
                        result = this._resultHandler(returnType === 'object'
                            ? data[0]
                            : returnType === 'array' ? data : [data]);
                        break;
                    }
                    result = this._resultHandler(res);
                    break;
                }
                case 'PAGINATION': {
                    result = yield this._pagination(res);
                    break;
                }
                default: {
                    throw this._assertError('Missing method first get or pagination');
                }
            }
            yield this.$utils.hookHandle(this.$state.get('HOOKS'), result);
            yield this._observer(result, 'selected');
            return result;
        });
    }
    _hiddenColumnModel(data) {
        const hiddens = this.$state.get('HIDDEN');
        for (const hidden of hiddens) {
            for (const objColumn of data) {
                delete objColumn[hidden];
            }
        }
        return data;
    }
    _save() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.$state.get('RESULT');
            if (result.id == null) {
                throw this._assertError(`This '$save' must be required the 'id' for the function`);
            }
            const update = JSON.parse(JSON.stringify(Object.assign({}, result)));
            return yield this
                .where('id', result.id)
                .update(update)
                .dd()
                .save();
        });
    }
    _attach(name, dataId, fields) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!Array.isArray(dataId)) {
                throw this._assertError(`This '${dataId}' is not an array.`);
            }
            const relation = (_a = this.$state.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find((data) => data.name === name);
            if (!relation) {
                throw this._assertError(`Unknown relation '${name}' in model.`);
            }
            const thisTable = this.$utils.columnRelation(this.constructor.name);
            const relationTable = this._classToTableName(relation.model.name, { singular: true });
            const result = this.$state.get('RESULT');
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
                    throw this._assertError(e.message);
                try {
                    const pivotTable = `${relationTable}_${thisTable}`;
                    const success = yield new DB_1.DB().table(pivotTable).createMultiple(dataId.map((id) => {
                        return Object.assign({ [this._valuePattern(`${relationTable}Id`)]: id, [this._valuePattern(`${thisTable}Id`)]: result.id }, fields);
                    })).save();
                    return success;
                }
                catch (e) {
                    throw this._assertError(e.message);
                }
            }
        });
    }
    _detach(name, dataId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Array.isArray(dataId)) {
                throw this._assertError(`This '${dataId}' is not an array.`);
            }
            const relation = this.$state.get('RELATION').find((data) => data.name === name);
            if (!relation) {
                throw this._assertError(`Unknown relation '${name}' in model.`);
            }
            const thisTable = this.$utils.columnRelation(this.constructor.name);
            const relationTable = this._classToTableName(relation.model.name, { singular: true });
            const result = this.$state.get('RESULT');
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
                    throw this._assertError(e.message);
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
                    throw this._assertError(e.message);
                }
            }
        });
    }
    _queryUpdateModel(objects) {
        this.$utils.covertDataToDateIfDate(objects);
        if (this.$state.get('TIMESTAMP')) {
            const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
            objects = Object.assign(Object.assign({}, objects), { [updatedAt]: this.$utils.timestamp() });
        }
        const keyValue = Object.entries(objects).map(([column, value]) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                value = this.$utils.escapeActions(value);
            }
            return `${this.bindColumn(column)} = ${value == null || value === this.$constants('NULL')
                ? this.$constants('NULL')
                : this._checkValueHasRaw(value)}`;
        });
        return `${this.$constants('SET')} ${keyValue.join(', ')}`;
    }
    _queryInsertModel(data) {
        this.$utils.covertDataToDateIfDate(data);
        const hasTimestamp = Boolean(this.$state.get('TIMESTAMP'));
        if (hasTimestamp) {
            const format = this.$state.get('TIMESTAMP_FORMAT');
            const createdAt = this._valuePattern(String(format === null || format === void 0 ? void 0 : format.CREATED_AT));
            const updatedAt = this._valuePattern(String(format === null || format === void 0 ? void 0 : format.UPDATED_AT));
            data = Object.assign(Object.assign({}, data), { [createdAt]: this.$utils.timestamp(), [updatedAt]: this.$utils.timestamp() });
        }
        const hasUUID = data.hasOwnProperty(this.$state.get('UUID_FORMAT'));
        if (this.$state.get('UUID') && !hasUUID) {
            const uuidFormat = this.$state.get('UUID_FORMAT');
            data = Object.assign({ [uuidFormat]: this.$utils.generateUUID() }, data);
        }
        const columns = Object.keys(data).map((column) => this.bindColumn(column));
        const values = Object.values(data).map((value) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                value = this.$utils.escapeActions(value);
            }
            return `${value == null || value === this.$constants('NULL')
                ? this.$constants('NULL')
                : this._checkValueHasRaw(value)}`;
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
        let columns = Object.keys((_a = [...data]) === null || _a === void 0 ? void 0 : _a.shift()).map((column) => column);
        for (let objects of data) {
            this.$utils.covertDataToDateIfDate(data);
            const hasTimestamp = this.$state.get('TIMESTAMP');
            if (hasTimestamp) {
                const format = this.$state.get('TIMESTAMP_FORMAT');
                const createdAt = this._valuePattern(format.CREATED_AT);
                const updatedAt = this._valuePattern(format.UPDATED_AT);
                objects = Object.assign(Object.assign({}, objects), { [createdAt]: this.$utils.timestamp(), [updatedAt]: this.$utils.timestamp() });
                columns = [
                    ...columns,
                    `\`${createdAt}\``,
                    `\`${updatedAt}\``
                ];
            }
            const hasUUID = objects.hasOwnProperty(this.$state.get('UUID_FORMAT'));
            if (this.$state.get('UUID') && !hasUUID) {
                const uuidFormat = this.$state.get('UUID_FORMAT');
                objects = Object.assign({ [uuidFormat]: this.$utils.generateUUID() }, objects);
                columns = [
                    `\`${uuidFormat}\``,
                    ...columns
                ];
            }
            const v = Object.values(objects).map((value) => {
                if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                    value = this.$utils.escapeActions(value);
                }
                return `${value == null || value === this.$constants('NULL')
                    ? this.$constants('NULL')
                    : this._checkValueHasRaw(value)}`;
            });
            values = [
                ...values,
                `(${v.join(',')})`
            ];
        }
        return [
            `(${[...new Set(columns.map(c => this.bindColumn(c)))].join(',')})`,
            `${this.$constants('VALUES')}`,
            `${values.join(', ')}`
        ].join(' ');
    }
    _insertNotExistsModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._guardWhereCondition();
            const check = (yield new Model()
                .copyModel(this, { where: true, select: true, limit: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .exists()) || false;
            if (check)
                return this._resultHandler(null);
            yield this._validateSchema(this.$state.get('DATA'), 'insert');
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (!result)
                return this._resultHandler(null);
            const resultData = yield new Model()
                .copyModel(this, { select: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .where('id', id)
                .first();
            return this._resultHandler(resultData);
        });
    }
    _insertModel() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._validateSchema(this.$state.get('DATA'), 'insert');
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (this.$state.get('VOID'))
                return this._resultHandler(undefined);
            if (!result)
                return this._resultHandler(null);
            const resultData = yield new Model()
                .copyModel(this, { select: true })
                .where('id', id)
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .first();
            yield this._observer(resultData, 'created');
            return this._resultHandler(resultData);
        });
    }
    _createMultipleModel() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            for (const data of (_a = this.$state.get('DATA')) !== null && _a !== void 0 ? _a : []) {
                yield this._validateSchema(data, 'insert');
            }
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (this.$state.get('VOID'))
                return this._resultHandler(undefined);
            if (!result)
                return this._resultHandler(null);
            const arrayId = [...Array(result)].map((_, i) => i + id);
            const data = yield new Model()
                .copyModel(this, { select: true, limit: true })
                .bind(this.$pool.get())
                .whereIn('id', arrayId)
                .debug(this.$state.get('DEBUG'))
                .get();
            const resultData = data || [];
            yield this._observer(resultData, 'created');
            return this._resultHandler(resultData);
        });
    }
    _updateOrInsertModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._guardWhereCondition();
            const check = (yield new Model()
                .copyModel(this, { select: true, where: true, limit: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .exists()) || false;
            switch (check) {
                case false: {
                    yield this._validateSchema(this.$state.get('DATA'), 'insert');
                    const [result, id] = yield this._actionStatement({
                        sql: this._queryBuilder().insert(),
                        returnId: true
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { select: true })
                        .bind(this.$pool.get())
                        .where('id', id)
                        .debug(this.$state.get('DEBUG'))
                        .first();
                    const resultData = data == null ? null : Object.assign(Object.assign({}, data), { $action: 'insert' });
                    const r = this._resultHandler(resultData);
                    yield this._observer(r, 'created');
                    return r;
                }
                case true: {
                    yield this._validateSchema(this.$state.get('DATA'), 'update');
                    const result = yield this._actionStatement({
                        sql: this._queryBuilder().update()
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { where: true, select: true, limit: true })
                        .bind(this.$pool.get())
                        .debug(this.$state.get('DEBUG'))
                        .get();
                    if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                        for (const v of data)
                            v.$action = 'update';
                        const r = this._resultHandler(data);
                        yield this._observer(r, 'updated');
                        return r;
                    }
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'update' }) || null;
                    const r = this._resultHandler(resultData);
                    yield this._observer(r, 'updated');
                    return r;
                }
            }
        });
    }
    _insertOrSelectModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._guardWhereCondition();
            const check = (yield new Model()
                .copyModel(this, { select: true, where: true, limit: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .exists()) || false;
            switch (check) {
                case false: {
                    yield this._validateSchema(this.$state.get('DATA'), 'insert');
                    const [result, id] = yield this._actionStatement({
                        sql: this._queryBuilder().insert(),
                        returnId: true
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { select: true })
                        .bind(this.$pool.get())
                        .where('id', id)
                        .debug(this.$state.get('DEBUG'))
                        .first();
                    const resultData = data == null
                        ? null
                        : Object.assign(Object.assign({}, data), { $action: 'insert' });
                    const r = this._resultHandler(resultData);
                    yield this._observer(r, 'created');
                    return r;
                }
                case true: {
                    if (this.$state.get('VOID'))
                        return this._resultHandler(undefined);
                    const data = yield new Model()
                        .copyModel(this, { select: true, where: true, limit: true })
                        .bind(this.$pool.get())
                        .debug(this.$state.get('DEBUG'))
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
            this._guardWhereCondition();
            yield this._validateSchema(this.$state.get('DATA'), 'update');
            const sql = this._queryBuilder().update();
            const result = yield this._actionStatement({ sql });
            if (this.$state.get('VOID') || !result || result == null)
                return this._resultHandler(undefined);
            const data = yield new Model()
                .copyModel(this, { where: true, select: true, limit: true, orderBy: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .get();
            if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                const r = this._resultHandler(data);
                yield this._observer(r, 'updated');
                return r;
            }
            const resultData = (data === null || data === void 0 ? void 0 : data.shift()) || null;
            const r = this._resultHandler(resultData);
            yield this._observer(r, 'updated');
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
            'updateMultiple',
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
                if (methodCallings.some((methodCalling) => methodsNotAllowed.includes(methodCalling))) {
                    throw this._assertError(`This method '${method}' can't using the method '${findMethodNotAllowed}'.`);
                }
                break;
            }
            case 'save': {
                const methodCallings = this.$logger.get();
                const methodsSomeAllowed = methodChangeStatements;
                if (!methodCallings.some((methodCalling) => methodsSomeAllowed.includes(methodCalling))) {
                    throw this._assertError(`This ${method} method need some ${methodsSomeAllowed.map(v => `'${v}'`).join(', ')} methods.`);
                }
                break;
            }
        }
    }
    _checkSchemaOrNextError(e_1) {
        return __awaiter(this, arguments, void 0, function* (e, retry = 1) {
            var _a, _b, _c, _d, _e;
            try {
                if (retry > 2 || this.$state.get('RETRY') > 2)
                    throw e;
                const schemaTable = this.getSchemaModel();
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
                        `${this.$state.get('TABLE_NAME')}`,
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
                const tableName = this.$state.get('TABLE_NAME');
                const sql = new Schema_1.Schema().createTable(tableName, schemaTable);
                yield this._queryStatement(sql);
                const beforeCreatingTheTable = this.$state.get('BEFORE_CREATING_TABLE');
                if (beforeCreatingTheTable != null)
                    yield beforeCreatingTheTable();
            }
            catch (e) {
                if (retry >= 2)
                    throw e;
                yield this._checkSchemaOrNextError(e, retry + 1);
            }
        });
    }
    _stoppedRetry(e) {
        this.$state.set('RETRY', 2);
        throw e;
    }
    _observer(result, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$state.get('OBSERVER') == null)
                return;
            const observer = this.$state.get('OBSERVER');
            const ob = new observer();
            yield ob[type](result);
        });
    }
    _makeRelations() {
        if (this.$hasOne != null) {
            for (const hasOne of this.$hasOne) {
                this.hasOne(Object.assign(Object.assign({}, hasOne), { name: hasOne.name }));
            }
        }
        if (this.$hasMany != null) {
            for (const hasMany of this.$hasMany) {
                this.hasMany(Object.assign(Object.assign({}, hasMany), { name: hasMany.name }));
            }
        }
        if (this.$belongsTo != null) {
            for (const belongsTo of this.$belongsTo) {
                this.belongsTo(Object.assign(Object.assign({}, belongsTo), { name: belongsTo.name }));
            }
        }
        if (this.$belongsToMany != null) {
            for (const belongsToMany of this.$belongsToMany) {
                this.belongsToMany(Object.assign(Object.assign({}, belongsToMany), { name: belongsToMany.name }));
            }
        }
        return this;
    }
    _guardWhereCondition() {
        const wheres = this.$state.get('WHERE');
        if (!wheres.length) {
            throw this._assertError("The statement requires the use of 'where' conditions.");
        }
        if (wheres.length === 1 && this.$state.get('SOFT_DELETE')) {
            const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
            const softDeleteIsNull = [
                this.bindColumn(`${this.getTableName()}.${deletedAt}`),
                this.$constants('IS_NULL')
            ].join(' ');
            if (wheres.some((where) => where.includes(softDeleteIsNull))) {
                throw this._assertError(`The statement is not allowed to use the '${deletedAt}' column as a condition for any action`);
            }
        }
    }
    _initialModel() {
        var _a, _b, _c, _d;
        this.$state = new State_1.StateHandler('model');
        if (this.$pattern != null)
            this.usePattern(this.$pattern);
        this._makeTableName();
        this.$relation = new Relation_1.RelationHandler(this);
        this._makeRelations();
        if (globalSettings.debug)
            this.useDebug();
        if (globalSettings.softDelete)
            this.useSoftDelete();
        if (globalSettings.uuid)
            this.useUUID();
        if (globalSettings.timestamp)
            this.useTimestamp();
        if (globalSettings.logger != null) {
            this.useLogger({
                selected: (_a = globalSettings.logger) === null || _a === void 0 ? void 0 : _a.selected,
                inserted: (_b = globalSettings.logger) === null || _b === void 0 ? void 0 : _b.inserted,
                updated: (_c = globalSettings.logger) === null || _c === void 0 ? void 0 : _c.updated,
                deleted: (_d = globalSettings.logger) === null || _d === void 0 ? void 0 : _d.deleted
            });
        }
        if (this.$table != null)
            this.useTable(this.$table);
        if (this.$uuid != null)
            this.useUUID(this.$uuidColumn);
        if (this.$timestamp != null)
            this.useTimestamp(this.$timestampColumns);
        if (this.$softDelete != null)
            this.useSoftDelete(this.$softDeleteColumn);
        if (this.$validateSchema != null)
            this.useValidateSchema(this.$validateSchema);
        if (this.$observer != null)
            this.useObserver(this.$observer);
        return this;
    }
}
exports.Model = Model;
exports.default = Model;
//# sourceMappingURL=Model.js.map