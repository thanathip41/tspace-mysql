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
const AbstractModel_1 = require("./AbstractModel");
const ProxyHandler_1 = require("./ProxyHandler");
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
         * @Define Setup for model
         */
        this.define();
        return new Proxy(this, ProxyHandler_1.proxyHandler);
    }
    /**
     *
     * define for initialize of models
     * @return {void} void
     */
    define() {
    }
    /**
     *
     * Assign function callback in model
     * @return {this} this
     */
    useRegistry() {
        this.$state.set('REGISTRY', Object.assign(Object.assign({}, this.$state.get('REGISTRY')), { attach: this._attach, detach: this._detach }));
        return this;
    }
    /**
    *
    * Assign primary column in model
    * @return {this} this
    */
    usePrimaryKey(primary) {
        this.$state.set('PRIMARY_KEY', primary);
        return this;
    }
    /**
     * Assign generate uuid when creating in model
     * @param {string?} column [column=uuid] make new name column for custom column replace uuid with this
     * @return {this} this
     */
    useUUID(column) {
        this.$state.set('UUID', true);
        if (column)
            this.$state.set('UUID_FORMAT', column);
        return this;
    }
    /**
     * Assign in model console.log raw sql when fetching query statement
     * @return {this} this
     */
    useDebug() {
        this.$state.set('DEBUG', true);
        return this;
    }
    /**
     *
     * Assign in model use pattern [snake_case , camelCase]
     * @param  {string} pattern
     * @return {this} this
     */
    usePattern(pattern) {
        const allowPattern = [
            this.$constants('PATTERN').snake_case,
            this.$constants('PATTERN').camelCase
        ];
        this._assertError(!allowPattern.includes(pattern), `tspace-mysql support only pattern [${allowPattern}]`);
        this.$state.set('PATTERN', pattern);
        return this;
    }
    /**
     *
     * Assign in model show data not be deleted
     * Relations has reference this method
     * @param {string?} column
     * @return {this} this
     */
    useSoftDelete(column) {
        this.$state.set('SOFT_DELETE', true);
        if (column)
            this.$state.set('SOFT_DELETE_FORMAT', column);
        return this;
    }
    /**
     *
     * Assign timestamp when insert || updated created_at and update_at in table
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change new name column replace by default [created at]
     * @property {string} timestampFormat.updatedAt - change new name column replace by default updated at
     * @return {this} this
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
     *
     * Assign table name in model
     * @param {string} table table name in database
     * @return {this} this
     */
    useTable(table) {
        this.$state.set('TABLE_NAME', `\`${table}\``);
        return this;
    }
    /**
     *
     * Assign table name in model with signgular pattern
     * @return {this} this
     */
    useTableSingular() {
        var _a;
        const table = this._classToTableName((_a = this.constructor) === null || _a === void 0 ? void 0 : _a.name, { singular: true });
        this.$state.set('TABLE_NAME', `\`${pluralize_1.default.singular(table)}\``);
        return this;
    }
    /**
     *
     * Assign table name in model with pluarl pattern
     * @return {this} this
     */
    useTablePlural() {
        var _a;
        const table = this._classToTableName((_a = this.constructor) === null || _a === void 0 ? void 0 : _a.name);
        this.$state.set('TABLE_NAME', `\`${pluralize_1.default.plural(table)}\``);
        return this;
    }
    /**
     * Build  method for relation in model
     * @param    {string} name name relation registry in your model
     * @param    {Function} callback query callback
     * @return   {this}   this
     */
    buildMethodRelation(name, callback) {
        var _a;
        this.with(name);
        const r = this.$state.get('WITH').find((data) => data.name === name);
        this._assertError(r == null, `relation ${name} not be register !`);
        const relationHasExists = (_a = Object.values(this.$constants('RELATIONSHIP'))) === null || _a === void 0 ? void 0 : _a.includes(r.relation);
        this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return this;
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
        this._assertError(!(instance instanceof Model), 'value is not a instanceof Model');
        const copy = Object.fromEntries(instance.$state.get());
        const newInstance = new Model();
        newInstance.$state.clone(copy);
        if ((options === null || options === void 0 ? void 0 : options.insert) == null)
            newInstance.$state.set('INSERT', '');
        if ((options === null || options === void 0 ? void 0 : options.update) == null)
            newInstance.$state.set('UPDATE', '');
        if ((options === null || options === void 0 ? void 0 : options.delete) == null)
            newInstance.$state.set('DELETE', '');
        if ((options === null || options === void 0 ? void 0 : options.where) == null)
            newInstance.$state.set('WHERE', '');
        return newInstance;
    }
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @return {this} this
     */
    ignoreSoftDelete(condition = false) {
        this.$state.set('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     *  @param {boolean} condition
     * @return {this} this
     */
    disableSoftDelete(condition = false) {
        this.$state.set('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign build in function to result of data
     * @param {object} func
     * @return {this} this
     */
    registry(func) {
        this.$state.set('REGISTRY', Object.assign(Object.assign({}, func), { attach: this._attach, detach: this._detach }));
        return this;
    }
    /**
     *
     * Use relations in registry of model return result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     */
    with(...nameRelations) {
        const relations = nameRelations.map((name) => {
            var _a, _b;
            const relation = (_a = this.$state.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find((data) => data.name === name);
            this._assertError(relation == null, `relation ${name} not be register !`);
            const relationHasExists = (_b = Object.values(this.$constants('RELATIONSHIP'))) === null || _b === void 0 ? void 0 : _b.includes(relation.relation);
            this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
            if (relation.query == null)
                relation.query = new relation.model();
            return relation;
        });
        relations.sort((cur, prev) => cur.relation.length - prev.relation.length);
        const setRelations = this.$state.get('WITH').length
            ? [...relations.map((w) => {
                    const exists = this.$state.get('WITH').find((r) => r.name === w.name);
                    if (exists)
                        return null;
                    return w;
                }).filter((d) => d != null),
                ...this.$state.get('WITH')]
            : relations;
        this.$state.set('WITH', setRelations);
        return this;
    }
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this} this
     */
    withExists(...nameRelations) {
        this.with(...nameRelations);
        this.$state.set('WITH_EXISTS', true);
        return this;
    }
    /**
    *
    * Use relations in registry of model return only exists result of relation query
    * @param {...string} nameRelations if data exists return blank
    * @return {this} this
    */
    has(...nameRelations) {
        this.with(...nameRelations);
        this.$state.set('WITH_EXISTS', true);
        return this;
    }
    /**
     *
     * Use relation '${name}' registry of model return callback this query model
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @return {this} this
     */
    withQuery(nameRelation, callback) {
        var _a;
        const relation = this.$state.get('WITH').find((data) => data.name === nameRelation);
        this._assertError(relation == null, `relation ${nameRelation} not be register !`);
        const relationHasExists = (_a = Object.values(this.$constants('RELATIONSHIP'))) === null || _a === void 0 ? void 0 : _a.includes(relation.relation);
        this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
        relation.query = callback(new relation.model());
        return this;
    }
    /**
     *
     * Use relations in registry of model retrun result of relation query
     * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
     * @return {this} this
     */
    relations(...nameRelations) {
        const relations = nameRelations.map((name) => {
            var _a, _b;
            const relation = (_a = this.$state.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find((data) => data.name === name);
            this._assertError(relation == null, `relation ${name} not be register !`);
            const relationHasExists = (_b = Object.values(this.$constants('RELATIONSHIP'))) === null || _b === void 0 ? void 0 : _b.includes(relation.relation);
            this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
            if (relation.query == null)
                relation.query = new relation.model();
            return relation;
        });
        relations.sort((cur, prev) => cur.relation.length - prev.relation.length);
        const setRelations = this.$state.get('WITH').length
            ? [...relations.map((w) => {
                    const exists = this.$state.get('WITH').find((r) => r.name === w.name);
                    if (exists)
                        return null;
                    return w;
                }).filter((d) => d != null), ...this.$state.get('WITH')]
            : relations;
        this.$state.set('WITH', setRelations);
        return this;
    }
    /**
     *
     * Use relations in registry of model return only exists result of relation query
     * @param {...string} nameRelations if data exists return blank
     * @return {this}
     */
    relationsExists(...nameRelations) {
        this.with(...nameRelations);
        this.$state.set('WITH_EXISTS', true);
        return this;
    }
    /**
     *
     * Use relation '${name}' registry of model return callback this query model
     * @param {string} nameRelation name relation in registry in your model
     * @param {function} callback query callback
     * @return {this} this
     */
    relationQuery(nameRelation, callback) {
        var _a;
        const relation = this.$state.get('WITH').find((data) => data.name === nameRelation);
        this._assertError(relation == null, `relation ${nameRelation} not be register !`);
        const relationHasExists = (_a = Object.values(this.$constants('RELATIONSHIP'))) === null || _a === void 0 ? void 0 : _a.includes(relation.relation);
        this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
        relation.query = callback(new relation.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
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
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        this.$state.set('RELATION', [...this.$state.get('RELATION'), relation]);
        return this;
    }
    /**
     * Assign the relation in model Objects
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
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        this.$state.set('RELATION', [...this.$state.get('RELATION'), relation]);
        return this;
    }
    /**
     * Assign the relation in model Objects
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
        const relation = {
            name,
            as,
            model,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        this.$state.set('RELATION', [...this.$state.get('RELATION'), relation]);
        return this;
    }
    /**
     * Assign the relation in model Objects
     * @param    {object} relations registry relation in your model
     * @property {string} relation.name
     * @property {string} relation.as
     * @property {class}  relation.model
     * @property {string} relation.localKey
     * @property {string} relation.foreignKey
     * @property {string} relation.freezeTable
     * @return   {this}   this
     */
    belongsToMany({ name, as, model, localKey, foreignKey, freezeTable }) {
        const relation = {
            name,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        this.$state.set('RELATION', [...this.$state.get('RELATION'), relation]);
        return this;
    }
    /**
     * Assign the relation in model Objects
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
    hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasOne,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._handleRelationsQuery(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
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
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').hasMany,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._handleRelationsQuery(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
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
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsTo,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._handleRelationsQuery(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
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
    belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
        const nameRelation = name == null
            ? this._functionRelationName()
            : String(name);
        const relation = {
            name: nameRelation,
            model,
            as,
            relation: this.$constants('RELATIONSHIP').belongsToMany,
            localKey,
            foreignKey,
            freezeTable,
            query: null
        };
        const r = this._handleRelationsQuery(nameRelation, relation);
        if (callback == null) {
            r.query = new r.model();
            return this;
        }
        r.query = callback(new r.model());
        return this;
    }
    /**
     * return only in trashed (data has been remove)
     * @return {promise}
     */
    trashed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.disableSoftDelete();
            this.whereNotNull(this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT')));
            const sql = this._buildQueryModel();
            return yield this._execute({ sql, type: 'GET' });
        });
    }
    /**
     * return all only in trashed (data has been remove)
     * @return {promise}
     */
    onlyTrashed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.disableSoftDelete();
            this.whereNotNull(this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT')));
            const sql = this._buildQueryModel();
            return yield this._execute({ sql, type: 'GET' });
        });
    }
    /**
     * restore data in trashed
     * @return {promise}
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
     * @override Method
     * @return {promise<string>}
    */
    exceptColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('COLUMNS')}`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            const rawColumns = yield this.queryStatement(sql);
            const columns = rawColumns.map((column) => column.Field);
            const removeExcept = columns.filter((column) => !this.$state.get('EXCEPT').includes(column));
            return removeExcept.join(',');
        });
    }
    /**
     *
     * @override Method
     * @return {string}
    */
    toString() {
        return this._buildQueryModel();
    }
    /**
     *
     * @override Method
     * @return {string}
    */
    toSQL() {
        return this._buildQueryModel();
    }
    /**
     *
     * @override Method
     * @return {promise<string>}
    */
    toJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            if (this.$state.get('HIDDEN').length)
                this._hiddenColumnModel(result);
            return JSON.stringify(result);
        });
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<Array>}
    */
    toArray(column = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            this.select(column);
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            const toArray = result.map((data) => data[column]);
            return toArray;
        });
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    avg(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.select(`${this.$constants('AVG')}(${column}) ${this.$constants('AS')} avg`);
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.avg) || 0;
        });
    }
    /**
     *
     * @override Method
     * @param {string} column [column=id]
     * @return {promise<number>}
    */
    sum(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.select(`${this.$constants('SUM')}(${column}) ${this.$constants('AS')} sum`);
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.sum) || 0;
        });
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    max(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.select(`${this.$constants('MAX')}(${column}) ${this.$constants('AS')} max`);
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.max) || 0;
        });
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    min(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.select(`${this.$constants('MIN')}(${column}) ${this.$constants('AS')} min`);
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.min) || 0;
        });
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    count(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.select(`${this.$constants('COUNT')}(${column}) ${this.$constants('AS')} total`);
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.total) || 0;
        });
    }
    /**
     *
     * execute data return result is exists
     * @return {promise<boolean>}
     */
    exists() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.select(this.$state.get('PRIMARY_KEY'));
            const sql = this._buildQueryModel();
            const result = yield this.queryStatement([
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}`,
                `(${sql} ${this.$constants('LIMIT')} 1)`,
                `${this.$constants('AS')} 'exists'`
            ].join(' '));
            return !!((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.exists) || false;
        });
    }
    /**
     * delete data from the database
     * @override Method
     * @return {promise<boolean>}
     */
    delete() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE'))
                throw new Error("Can't delete without where condition");
            if (this.$state.get('SOFT_DELETE')) {
                const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
                const query = `${deletedAt} = '${this.$utils.timestamp()}'`;
                let sql = [
                    `${this.$constants('UPDATE')}`,
                    `${this.$state.get('TABLE_NAME')}`,
                    `${this.$constants('SET')}`,
                    `${query}`
                ].join(' ');
                if (this.$state.get('TIMESTAMP')) {
                    const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
                    sql = `${sql} , ${updatedAt} = '${this.$utils.timestamp()}'`;
                }
                this.$state.set('UPDATE', `${sql} ${this.$state.get('WHERE')}`);
                const result = yield this.actionStatement({ sql: this.$state.get('UPDATE') });
                return (_a = !!result) !== null && _a !== void 0 ? _a : false;
            }
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`
            ].join(' '));
            const result = yield this.actionStatement({ sql: this.$state.get('DELETE') });
            return (_b = !!result) !== null && _b !== void 0 ? _b : false;
        });
    }
    /**
     *
     * force delete data from the database
     * @return {promise<boolean>}
     */
    forceDelete() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`
            ].join(' ');
            const result = yield this.actionStatement({ sql });
            return (_a = !!result) !== null && _a !== void 0 ? _a : false;
        });
    }
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    first() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('first');
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            let sql = this._buildQueryModel();
            if (!sql.includes(this.$constants('LIMIT'))) {
                sql = `${sql} ${this.$constants('LIMIT')} 1`;
                if (this.$state.get('WITH_EXISTS')) {
                    sql = `${this._queryRelationsExists()} ${this.$constants('LIMIT')} 1`;
                }
                if (this.$state.get('VOID'))
                    return null;
                return yield this._execute({ sql, type: 'FIRST' });
            }
            sql = sql.replace(this.$state.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
            if (this.$state.get('WITH_EXISTS')) {
                sql = `${this._queryRelationsExists()} ${this.$constants('LIMIT')} 1`;
            }
            if (this.$state.get('VOID'))
                return null;
            return yield this._execute({ sql, type: 'FIRST' });
        });
    }
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.first();
        });
    }
    /**
     *
     * @override Method
     * @return {promise<object | Error>}
    */
    firstOrError(message, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('firstOrError');
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            let sql = this._buildQueryModel();
            if (!sql.includes(this.$constants('LIMIT'))) {
                sql = `${sql} ${this.$constants('LIMIT')} 1`;
                return yield this._execute({ sql, type: 'FIRST_OR_ERROR', message, options });
            }
            sql = sql.replace(this.$state.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
            if (this.$state.get('WITH_EXISTS')) {
                sql = this._queryRelationsExists();
            }
            return yield this._execute({ sql, type: 'FIRST_OR_ERROR', message, options });
        });
    }
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    findOneOrError(message, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('findOneOrError');
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            let sql = this._buildQueryModel();
            if (!sql.includes(this.$constants('LIMIT'))) {
                sql = `${sql} ${this.$constants('LIMIT')} 1`;
                return yield this._execute({ sql, type: 'FIRST_OR_ERROR', message, options });
            }
            sql = sql.replace(this.$state.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
            if (this.$state.get('WITH_EXISTS')) {
                sql = this._queryRelationsExists();
            }
            return yield this._execute({ sql, type: 'FIRST_OR_ERROR', message, options });
        });
    }
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            const result = yield this.queryStatement(sql);
            return result;
        });
    }
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('find');
            this._handleSoftDelete();
            const sql = [
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')}`,
                `${this.$state.get('PRIMARY_KEY')} = ${id}`
            ].join(' ');
            const result = yield this.queryStatement(sql);
            return (result === null || result === void 0 ? void 0 : result.shift()) || null;
        });
    }
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    get() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('get');
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            let sql = this._buildQueryModel();
            if (this.$state.get('WITH_EXISTS')) {
                sql = this._queryRelationsExists();
            }
            if (this.$state.get('VOID'))
                return [];
            return yield this._execute({ sql, type: 'GET' });
        });
    }
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    findMany() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('findMany');
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            const sql = this._buildQueryModel();
            return yield this._execute({ sql, type: 'GET' });
        });
    }
    /**
     *
     * @override Method
     * @param {?object} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @return {promise<Pagination>}
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
            this._assertError((_a = this.$logger) === null || _a === void 0 ? void 0 : _a.check('limit'), `this '[pagination]' can't support '[limit]' method`);
            if ((_b = this.$state.get('EXCEPT')) === null || _b === void 0 ? void 0 : _b.length)
                this.select(yield this.exceptColumns());
            const offset = (page - 1) * limit;
            this.$state.set('PER_PAGE', limit);
            this.$state.set('PAGE', page);
            let sql = this._buildQueryModel();
            if (this.$state.get('WITH_EXISTS')) {
                sql = this._queryRelationsExists();
            }
            if (!sql.includes(this.$constants('LIMIT'))) {
                sql = [
                    `${sql}`,
                    `${this.$constants('LIMIT')}`,
                    `${limit}`,
                    `${this.$constants('OFFSET')}`,
                    `${offset}`
                ].join(' ');
                return yield this._execute({ sql, type: 'PAGINATION' });
            }
            sql = sql.replace(this.$state.get('LIMIT'), [
                `${this.$constants('LIMIT')}`,
                `${limit}`,
                `${this.$constants('OFFSET')}`,
                `${offset}`
            ].join(' '));
            return yield this._execute({ sql, type: 'PAGINATION' });
        });
    }
    /**
    *
    * @override Method
    * @param    {?object} paginationOptions by default page = 1 , limit = 15
    * @property {number}  paginationOptions.limit
    * @property {number}  paginationOptions.page
    * @return   {promise<Pagination>}
    */
    paginate(paginationOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this._validateMethod('paginate');
            let limit = 15;
            let page = 1;
            if (paginationOptions != null) {
                limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
            }
            this._assertError((_a = this.$logger) === null || _a === void 0 ? void 0 : _a.check('limit'), `this '[pagination]' can't support '[limit]' method`);
            if ((_b = this.$state.get('EXCEPT')) === null || _b === void 0 ? void 0 : _b.length)
                this.select(yield this.exceptColumns());
            const offset = (page - 1) * limit;
            this.$state.set('PER_PAGE', limit);
            this.$state.set('PAGE', page);
            let sql = this._buildQueryModel();
            if (this.$state.get('WITH_EXISTS')) {
                sql = this._queryRelationsExists();
            }
            if (!sql.includes(this.$constants('LIMIT'))) {
                sql = [
                    `${sql}`,
                    `${this.$constants('LIMIT')}`,
                    `${limit}`,
                    `${this.$constants('OFFSET')}`,
                    `${offset}`
                ].join(' ');
                return yield this._execute({ sql, type: 'PAGINATION' });
            }
            sql = sql.replace(this.$state.get('LIMIT'), [
                `${this.$constants('LIMIT')}`,
                `${limit}`,
                `${this.$constants('OFFSET')}`,
                `${offset}`
            ].join(' '));
            return yield this._execute({ sql, type: 'PAGINATION' });
        });
    }
    /**
     *
     * @override Method
     * @param {string} column
     * @return {Promise<array>}
     */
    getGroupBy(column) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            this.$state.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${column}`);
            this.$state.set('SELECT', [
                `${this.$state.get('SELECT')},`,
                `${this.$constants('GROUP_CONCAT')}(id)`,
                `${this.$constants('AS')} data`
            ].join(' '));
            const sql = this._buildQueryModel();
            const results = yield this.queryStatement(sql);
            let data = [];
            results.forEach((result) => {
                var _a, _b;
                const splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                splits.forEach((split) => data = [...data, split]);
            });
            const sqlChild = [
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')} id`,
                `${this.$constants('IN')}`,
                `(${data.map((a) => `\'${a}\'`).join(',') || ['0']})`
            ].join(' ');
            const childData = yield this.queryStatement(sqlChild);
            const child = yield this._executeGroup(childData);
            const resultData = results.map((result) => {
                const id = result[column];
                const newData = child.filter((data) => data[column] === id);
                return ({
                    [column]: id,
                    data: newData
                });
            });
            return resultData;
        });
    }
    /**
     *
     * update data in the database
     * @override Method
     * @param {object} data
     * @return {this} this
     */
    update(data) {
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
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    insert(data) {
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
     *
     * @override Method
     * @param {object} data for insert
     * @return {this} this
     */
    create(data) {
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
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrCreate(data) {
        const queryUpdate = this._queryUpdateModel(data);
        const queryInsert = this._queryInsertModel(data);
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
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    updateOrInsert(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
    *
    * @override Method
    * @param {object} data for update or create
    * @return {this} this
    */
    insertOrUpdate(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * @override Method
     * @param {object} data for update or create
     * @return {this} this
     */
    createOrUpdate(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * insert multiple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    createMultiple(data) {
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
     * insert muliple data into the database
     * @override Method
     * @param {array<object>} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data) {
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
    * @param {object} data create not exists data
    * @override Method
    * @return {this} this this
    */
    createNotExists(data) {
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
     * @override Method
     * @return {Promise<any>}
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const attributes = this.$attributes;
            if (attributes != null) {
                while (true) {
                    if (this.$state.get('WHERE')) {
                        const query = this._queryUpdateModel(attributes);
                        this.$state.set('UPDATE', [
                            `${this.$constants('UPDATE')}`,
                            `${this.$state.get('TABLE_NAME')}`,
                            `${query}`
                        ].join(' '));
                        this.$state.set('SAVE', 'UPDATE');
                        break;
                    }
                    const query = this._queryInsertModel(attributes);
                    this.$state.set('INSERT', [
                        `${this.$constants('INSERT')}`,
                        `${this.$state.get('TABLE_NAME')}`,
                        `${query}`
                    ].join(' '));
                    this.$state.set('SAVE', 'INSERT');
                    break;
                }
            }
            switch (this.$state.get('SAVE')) {
                case 'INSERT_MULTIPLE': return yield this._createMultipleModel();
                case 'INSERT': return yield this._createModel();
                case 'UPDATE': return yield this._updateModel();
                case 'INSERT_NOT_EXISTS': return yield this._insertNotExistsModel();
                case 'UPDATE_OR_INSERT': return yield this._updateOrInsertModel();
                default: throw new Error(`unknown this [${this.$state.get('SAVE')}]`);
            }
        });
    }
    /**
     *
     * fake data
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
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            const fields = yield this.queryStatement(sql);
            for (let row = 0; row < rows; row++) {
                this._assertError(this.$state.get('TABLE_NAME') === '' || this.$state.get('TABLE_NAME') == null, "unknow this table");
                let columnAndValue = {};
                for (const { Field: field, Type: type } of fields) {
                    const passed = ['id', '_id', 'uuid', 'deleted_at', 'deletedAt'].some(p => field.toLowerCase() === p);
                    if (passed)
                        continue;
                    columnAndValue = Object.assign(Object.assign({}, columnAndValue), { [field]: this.$utils.faker(type) });
                }
                data = [...data, columnAndValue];
            }
            const query = this._queryInsertMultipleModel(data);
            this.$state.set('INSERT', [
                `${this.$constants('INSERT')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${query}`
            ].join(' '));
            this.$state.set('SAVE', 'INSERT_MULTIPLE');
            return yield this.save();
        });
    }
    _valuePattern(value) {
        switch (this.$state.get('PATTERN')) {
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
        return this.$state.get('PATTERN') === this.$constants('PATTERN').snake_case;
    }
    _classToTableName(className, { singular = false } = {}) {
        if (className == null)
            className = this.constructor.name;
        const tb = className.replace(/([A-Z])/g, (str) => '_' + str.toLowerCase()).slice(1);
        if (singular)
            return tb;
        return pluralize_1.default.plural(tb);
    }
    _makeTableName() {
        const tb = this._classToTableName();
        this.$state.set('SELECT', `${this.$constants('SELECT')} *`);
        this.$state.set('FROM', `${this.$constants('FROM')}`);
        this.$state.set('TABLE_NAME', `\`${tb}\``);
        return this;
    }
    _tableName() {
        var _a;
        return (_a = this.$state.get('TABLE_NAME')) === null || _a === void 0 ? void 0 : _a.replace(/`/g, '');
    }
    _valueInRelation(relationModel) {
        var _a, _b;
        const relation = relationModel.relation;
        const model = (_a = relationModel.model) === null || _a === void 0 ? void 0 : _a.name;
        const table = relationModel.freezeTable
            ? relationModel.freezeTable
            : (_b = relationModel.query) === null || _b === void 0 ? void 0 : _b._tableName();
        const name = relationModel.name;
        const as = relationModel.as;
        this._assertError(!model || model == null, 'not found model');
        let localKey = relationModel.localKey
            ? relationModel.localKey
            : this.$state.get('PRIMARY_KEY');
        let foreignKey = relationModel.foreignKey
            ? relationModel.foreignKey
            : this._valuePattern([
                `${pluralize_1.default.singular(this.$state.get('TABLE_NAME').replace(/\`/g, ''))}`,
                `${this.$state.get('PRIMARY_KEY')}`
            ].join('_'));
        const checkRelationIsBelongsTo = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsTo
        ].every(r => r);
        if (checkRelationIsBelongsTo) {
            foreignKey = localKey;
            localKey = this._valuePattern([
                `${pluralize_1.default.singular(table !== null && table !== void 0 ? table : '')}`,
                `${this.$state.get('PRIMARY_KEY')}`
            ].join('_'));
        }
        const checkRelationIsBelongsToMany = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsToMany
        ].every(r => r);
        if (checkRelationIsBelongsToMany) {
            localKey = this._valuePattern([
                `${pluralize_1.default.singular(table !== null && table !== void 0 ? table : '')}`,
                `${this.$state.get('PRIMARY_KEY')}`
            ].join('_'));
            foreignKey = 'id';
        }
        return { name, as, relation, table, localKey, foreignKey, model };
    }
    _handleSoftDelete() {
        if (this.$state.get('SOFT_DELETE')) {
            const deletedAt = this._valuePattern(this.$state.get('SOFT_DELETE_FORMAT'));
            this.whereNull(deletedAt);
        }
        return this;
    }
    _buildQueryModel() {
        let sql = [];
        while (true) {
            this._handleSoftDelete();
            if (this.$state.get('INSERT')) {
                sql = [
                    this.$state.get('INSERT')
                ];
                break;
            }
            if (this.$state.get('UPDATE')) {
                sql = [
                    this.$state.get('UPDATE'),
                    this.$state.get('WHERE')
                ];
                break;
            }
            if (this.$state.get('DELETE')) {
                sql = [
                    this.$state.get('DELETE')
                ];
                break;
            }
            sql = [
                this.$state.get('SELECT'),
                this.$state.get('FROM'),
                this.$state.get('TABLE_NAME'),
                this.$state.get('JOIN'),
                this.$state.get('WHERE'),
                this.$state.get('GROUP_BY'),
                this.$state.get('HAVING'),
                this.$state.get('ORDER_BY'),
                this.$state.get('LIMIT'),
                this.$state.get('OFFSET')
            ];
            break;
        }
        const filterSql = sql.filter(data => data !== '' || data == null);
        const query = filterSql.join(' ');
        return query;
    }
    _showOnly(data) {
        let result = [];
        const hasNameRelation = this.$state.get('WITH').map((w) => { var _a; return (_a = w.as) !== null && _a !== void 0 ? _a : w.name; });
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
    _execute({ sql, type, message, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.queryStatement(sql);
            if (!result.length)
                return this._returnEmpty(type, result, message, options);
            const relations = this.$state.get('WITH');
            if (!relations.length)
                return (yield this._returnResult(type, result)) || this._returnEmpty(type, result, message, options);
            for (const relation of relations) {
                const relationIsBelongsToMany = relation.relation === this.$constants('RELATIONSHIP').belongsToMany;
                if (relationIsBelongsToMany) {
                    result = yield this._belongsToMany(result, relation);
                    continue;
                }
                const dataFromRelation = yield this._relation(result, relation);
                result = this._relationMapData(result, dataFromRelation, relation);
            }
            if (this.$state.get('HIDDEN').length)
                this._hiddenColumnModel(result);
            return (yield this._returnResult(type, result)) || this._returnEmpty(type, result, message, options);
        });
    }
    _executeGroup(dataParents, type = 'GET') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataParents.length)
                return this._returnEmpty(type, dataParents);
            const relations = this.$state.get('WITH');
            if (relations.length) {
                for (const relation of relations) {
                    if (relation.relation === this.$constants('RELATIONSHIP').belongsToMany) {
                        return this._belongsToMany(dataParents, relation);
                    }
                    let dataChilds = yield this._relation(dataParents, relation);
                    dataParents = this._relationMapData(dataParents, dataChilds, relation);
                }
            }
            if ((_a = this.$state.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                this._hiddenColumnModel(dataParents);
            const resultData = yield this._returnResult(type, dataParents);
            return resultData || this._returnEmpty(type, dataParents);
        });
    }
    _relationMapData(dataParents, dataChilds, relations) {
        const { name, as, relation, localKey, foreignKey } = this._valueInRelation(relations);
        const keyRelation = as !== null && as !== void 0 ? as : name;
        for (const dataParent of dataParents) {
            const relationIsHasOneOrBelongsTo = [
                this.$constants('RELATIONSHIP').hasOne,
                this.$constants('RELATIONSHIP').belongsTo
            ].some(r => r === relation);
            dataParent[keyRelation] = [];
            if (relationIsHasOneOrBelongsTo)
                dataParent[keyRelation] = null;
            if (!dataChilds.length)
                continue;
            for (const dataChild of dataChilds) {
                if (dataChild[foreignKey] === dataParent[localKey]) {
                    const relationIsHasOneOrBelongsTo = [
                        this.$constants('RELATIONSHIP').hasOne,
                        this.$constants('RELATIONSHIP').belongsTo
                    ].some(r => r === relation);
                    if (relationIsHasOneOrBelongsTo) {
                        dataParent[keyRelation] = dataParent[keyRelation] || dataChild;
                        continue;
                    }
                    if (dataParent[keyRelation] == null)
                        dataParent[keyRelation] = [];
                    dataParent[keyRelation].push(dataChild);
                }
            }
        }
        return dataParents;
    }
    _handleRelationsExists(relation) {
        var _a;
        this._assertError(!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length), `unknown [relation]`);
        const { localKey, foreignKey } = this._valueInRelation(relation);
        const query = relation.query;
        this._assertError(query == null, `unknown callback query in [relation : '${relation.name}']`);
        const clone = new Model().clone(query);
        if (clone.$state.get('WITH').length) {
            for (const r of clone.$state.get('WITH')) {
                if (r.query == null)
                    continue;
                const sql = clone._handleRelationsExists(r);
                clone.whereExists(sql);
            }
        }
        const sql = clone
            .bind(this.$pool.get())
            .whereReference(`\`${this._tableName()}\`.\`${localKey}\``, `\`${query._tableName()}\`.\`${foreignKey}\``)
            .toString();
        return sql;
    }
    _queryRelationsExists() {
        var _a;
        const relations = this.$state.get('WITH');
        for (const index in relations) {
            const relation = relations[index];
            if (!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length))
                continue;
            const { localKey, foreignKey } = this._valueInRelation(relation);
            const query = relation.query;
            this._assertError(query == null, `unknown callback query in [relation : '${relation.name}']`);
            let clone = new Model().clone(query);
            if (clone.$state.get('WITH').length) {
                for (const r of clone.$state.get('WITH')) {
                    if (r.query == null)
                        continue;
                    const sql = clone._handleRelationsExists(r);
                    clone.whereExists(sql);
                }
            }
            const sql = clone
                .bind(this.$pool.get())
                .whereReference(`\`${this._tableName()}\`.\`${localKey}\``, `\`${query._tableName()}\`.\`${foreignKey}\``)
                .toString();
            this.whereExists(sql);
        }
        const sql = this._buildQueryModel();
        return sql;
    }
    _relation(parents, relation) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!((_a = Object.keys(relation)) === null || _a === void 0 ? void 0 : _a.length))
                return [];
            const { localKey, foreignKey } = this._valueInRelation(relation);
            const localKeyId = parents.map((parent) => {
                const data = parent[localKey];
                if (!parent.hasOwnProperty(localKey)) {
                    this._assertError(data == null, `unknown relationship without primary or foreign key in relation : [${relation === null || relation === void 0 ? void 0 : relation.name}]`);
                }
                return data;
            }).filter((data) => data != null);
            const dataPerentId = Array.from(new Set(localKeyId)) || [];
            if (!dataPerentId.length && this.$state.get('WITH_EXISTS'))
                return [];
            const query = yield relation.query;
            this._assertError(query == null, `unknown callback query in [relation : ${relation.name}]`);
            const dataFromRelation = yield query
                .bind(this.$pool.get())
                .whereIn(foreignKey, dataPerentId)
                .debug(this.$state.get('DEBUG'))
                .get();
            return dataFromRelation;
        });
    }
    _handleBelongsToMany(dataFromParent, relation, pivotTable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$state.get('WITH_EXISTS')) {
                let { name, localKey, foreignKey, model, table } = this._valueInRelation(relation);
                const localKeyId = dataFromParent.map((parent) => {
                    const data = parent[localKey];
                    if (!parent.hasOwnProperty(localKey)) {
                        this._assertError(data == null, "unknown relationship without primary or foreign key");
                    }
                    return data;
                }).filter((data) => data != null);
                const dataPerentId = Array.from(new Set(localKeyId)).join(',') || [];
                if (!dataPerentId.length && this.$state.get('WITH_EXISTS'))
                    return [];
                const modelOther = new relation.model();
                const other = this._classToTableName(modelOther.constructor.name, { singular: true });
                const otherlocalKey = 'id';
                const otherforeignKey = this._valuePattern(`${other}Id`);
                const sqldataChilds = [
                    `${this.$constants('SELECT')}`,
                    `*`,
                    `${this.$constants('FROM')}`,
                    `${pivotTable}`,
                    `${this.$constants('WHERE')}`,
                    `${otherforeignKey} ${this.$constants('IN')} (${dataPerentId})`
                ].join(' ');
                let dataChilds = yield this.queryStatement(sqldataChilds);
                const otherId = dataChilds.map((sub) => sub[otherforeignKey]).filter((data) => data != null);
                const otherArrId = Array.from(new Set(otherId)) || [];
                const otherdataChilds = yield this.queryStatement(modelOther
                    .bind(this.$pool.get())
                    .whereIn(otherlocalKey, otherArrId)
                    .debug(this.$state.get('DEBUG'))
                    .toString());
                dataChilds.forEach((sub) => {
                    sub[other] = [];
                    otherdataChilds.forEach((otherSub) => {
                        if (otherSub[otherlocalKey] === sub[otherforeignKey]) {
                            sub[other] = otherSub;
                        }
                    });
                });
                dataFromParent.forEach((dataPerent) => {
                    if (dataPerent[name] == null)
                        dataPerent[name] = [];
                    dataChilds.forEach((sub) => {
                        if (sub[localKey] === dataPerent[otherforeignKey]) {
                            dataPerent[name].push(sub);
                        }
                    });
                });
                if (this.$state.get('HIDDEN').length)
                    this._hiddenColumnModel(dataFromParent);
                return dataFromParent;
            }
            let { name, localKey, foreignKey } = this._valueInRelation(relation);
            const localKeyId = dataFromParent.map((parent) => {
                const data = parent[localKey];
                if (!parent.hasOwnProperty(localKey)) {
                    this._assertError(data == null, "unknown relationship without primary or foreign key");
                }
                return data;
            }).filter((data) => data != null);
            const dataPerentId = Array.from(new Set(localKeyId)).join(',') || [];
            if (!dataPerentId.length && this.$state.get('WITH_EXISTS'))
                return [];
            const modelOther = new relation.model();
            const other = this._classToTableName(modelOther.constructor.name, { singular: true });
            const otherlocalKey = 'id';
            const otherforeignKey = this._valuePattern(`${other}Id`);
            const sqldataChilds = [
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${pivotTable}`,
                `${this.$constants('WHERE')}`,
                `${foreignKey} ${this.$constants('IN')} (${dataPerentId})`
            ].join(' ');
            let dataChilds = yield this.queryStatement(sqldataChilds);
            const otherId = dataChilds.map((sub) => sub[otherforeignKey]).filter((data) => data != null);
            const otherArrId = Array.from(new Set(otherId)) || [];
            const otherdataChilds = yield this.queryStatement(modelOther
                .bind(this.$pool.get())
                .whereIn(otherlocalKey, otherArrId)
                .debug(this.$state.get('DEBUG'))
                .toString());
            dataChilds.forEach((sub) => {
                sub[other] = [];
                otherdataChilds.forEach((otherSub) => {
                    if (otherSub[otherlocalKey] === sub[otherforeignKey]) {
                        sub[other] = otherSub;
                    }
                });
            });
            dataFromParent.forEach((dataPerent) => {
                if (dataPerent[name] == null)
                    dataPerent[name] = [];
                dataChilds.forEach((sub) => {
                    if (sub[foreignKey] === dataPerent[localKey]) {
                        dataPerent[name].push(sub);
                    }
                });
            });
            if (this.$state.get('HIDDEN').length)
                this._hiddenColumnModel(dataFromParent);
            return dataFromParent;
        });
    }
    _belongsToMany(dataFromParent, relation) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const local = this._classToTableName(this.constructor.name, { singular: true });
            const modelOther = new relation.model();
            const other = this._classToTableName(modelOther.constructor.name, { singular: true });
            try {
                const pivotTable = (_a = relation.freezeTable) !== null && _a !== void 0 ? _a : `${local}_${other}`;
                return yield this._handleBelongsToMany(dataFromParent, relation, pivotTable);
            }
            catch (err) {
                try {
                    const pivotTable = (_b = relation.freezeTable) !== null && _b !== void 0 ? _b : `${other}_${local}`;
                    return yield this._handleBelongsToMany(dataFromParent, relation, pivotTable);
                }
                catch (e) {
                    throw new Error(err.message);
                }
            }
        });
    }
    _pagination(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const currentPage = +(this.$state.get('PAGE'));
            this.select([
                `${this.$constants('COUNT')}(${this.$state.get('PRIMARY_KEY')})`,
                `${this.$constants('AS')}`,
                `total`
            ].join(' '));
            const limit = Number(this.$state.get('PER_PAGE'));
            this._assertError(limit < 1, "minimun less 1 of limit");
            const sql = this._buildQueryModel();
            const res = yield this.queryStatement(sql);
            const total = (_a = res.shift().total) !== null && _a !== void 0 ? _a : 0;
            let lastPage = Math.ceil(total / limit) || 0;
            lastPage = lastPage > 1 ? lastPage : 1;
            const nextPage = currentPage + 1;
            const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
            const totalPage = (_b = data === null || data === void 0 ? void 0 : data.length) !== null && _b !== void 0 ? _b : 0;
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
                return this.$utils.snakeCase(this._result({
                    meta,
                    data
                }));
            }
            return this._result({
                meta,
                data
            });
        });
    }
    _result(data) {
        this.$state.get('RESULT', data);
        return data;
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
                default: {
                    throw new Error('Missing method first get or pagination');
                }
            }
            if (this._isPatternSnakeCase()) {
                const empty = this.$utils.snakeCase(this._result(emptyData));
                const hook = this.$state.get('HOOK');
                if (hook === null || hook === void 0 ? void 0 : hook.length)
                    for (let i = 0; i < hook.length; i++)
                        yield hook[i](empty);
                return empty;
            }
            const empty = this._result(emptyData);
            const hook = this.$state.get('HOOK');
            if (hook === null || hook === void 0 ? void 0 : hook.length)
                for (let i = 0; i < hook.length; i++)
                    yield hook[i](empty);
            return empty;
        });
    }
    _returnResult(type, data) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = Object.keys(this.$state.get('REGISTRY'))) === null || _a === void 0 ? void 0 : _a.length) {
                for (const d of data) {
                    for (const name in this.$state.get('REGISTRY')) {
                        const registry = this.$state.get('REGISTRY');
                        d[name] = registry[name];
                    }
                }
            }
            if ((_b = this.$state.get('ONLY')) === null || _b === void 0 ? void 0 : _b.length) {
                data = this._showOnly(data);
            }
            let result = null;
            switch (type) {
                case 'FIRST': {
                    if (this.$state.get('PLUCK')) {
                        const pluck = this.$state.get('PLUCK');
                        const newData = data.shift();
                        const checkProperty = newData.hasOwnProperty(pluck);
                        this._assertError(!checkProperty, `can't find property '${pluck}' of result`);
                        result = this._result(newData[pluck]);
                        break;
                    }
                    result = this._result((_c = data.shift()) !== null && _c !== void 0 ? _c : null);
                    break;
                }
                case 'FIRST_OR_ERROR': {
                    if (this.$state.get('PLUCK')) {
                        const pluck = this.$state.get('PLUCK');
                        const newData = data.shift();
                        const checkProperty = newData.hasOwnProperty(pluck);
                        this._assertError(!checkProperty, `can't find property '${pluck}' of result`);
                        result = (_d = this._result(newData[pluck])) !== null && _d !== void 0 ? _d : null;
                        break;
                    }
                    result = this._result((_e = data.shift()) !== null && _e !== void 0 ? _e : null);
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
                        result = this._result(r);
                        break;
                    }
                    if (this.$state.get('PLUCK')) {
                        const pluck = this.$state.get('PLUCK');
                        const newData = data.map((d) => d[pluck]);
                        this._assertError(newData.every((d) => d == null), `can't find property '${pluck}' of result`);
                        result = this._result(newData);
                        break;
                    }
                    result = this._result(data);
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
            const hook = this.$state.get('HOOK');
            if (hook === null || hook === void 0 ? void 0 : hook.length)
                for (let i = 0; i < hook.length; i++)
                    yield hook[i](result);
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
    _attach(name, dataId, fields) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!Array.isArray(dataId), `this ${dataId} is not an array`);
            const relation = (_a = this.$state.get('RELATION')) === null || _a === void 0 ? void 0 : _a.find((data) => data.name === name);
            this._assertError(!relation, `unknown name relation ['${name}'] in model`);
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
            const relation = this.$state.get('RELATION').find((data) => data.name === name);
            this._assertError(!relation, `unknown name relation [${name}] in model`);
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
        if (this.$state.get('TIMESTAMP')) {
            const updatedAt = this._valuePattern(this.$state.get('TIMESTAMP_FORMAT').UPDATED_AT);
            objects = Object.assign(Object.assign({}, objects), { [updatedAt]: this.$utils.timestamp() });
        }
        const keyValue = Object.entries(objects).map(([column, value]) => {
            if (typeof value === 'string')
                value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
            return `${column} = ${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return `${this.$constants('SET')} ${keyValue}`;
    }
    _queryInsertModel(objects) {
        const hasTimestamp = this.$state.get('TIMESTAMP');
        if (hasTimestamp) {
            const format = this.$state.get('TIMESTAMP_FORMAT');
            const createdAt = this._valuePattern(format.CREATED_AT);
            const updatedAt = this._valuePattern(format.UPDATED_AT);
            objects = Object.assign(Object.assign({}, objects), { [createdAt]: this.$utils.timestamp(), [updatedAt]: this.$utils.timestamp() });
        }
        const hasUUID = objects.hasOwnProperty(this.$state.get('UUID_FORMAT'));
        if (this.$state.get('UUID') && !hasUUID) {
            const uuidFormat = this.$state.get('UUID_FORMAT');
            objects = Object.assign(Object.assign({}, objects), { [uuidFormat]: this.$utils.generateUUID() });
        }
        const columns = Object.keys(objects).map((column) => `\`${column}\``);
        const values = Object.values(objects).map((value) => {
            if (typeof value === 'string')
                value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
            return `${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return [
            `(${columns})`,
            `${this.$constants('VALUES')}`,
            `(${values})`
        ].join(' ');
    }
    _queryInsertMultipleModel(data) {
        var _a;
        let values = [];
        let columns = Object.keys((_a = [...data]) === null || _a === void 0 ? void 0 : _a.shift()).map((column) => `\`${column}\``);
        for (let objects of data) {
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
                objects = Object.assign(Object.assign({}, objects), { [uuidFormat]: this.$utils.generateUUID() });
                columns = [
                    ...columns,
                    `\`${uuidFormat}\``
                ];
            }
            const v = Object.values(objects).map((value) => {
                if (typeof value === 'string')
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
            `${values.join(',')}`
        ].join(' ');
    }
    _insertNotExistsModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this.$state.get('WHERE'), "can't insert [insertNotExists] without where condition");
            this._handleSoftDelete();
            let sql = [
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
                `*`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`,
                `${this.$constants('LIMIT')} 1)`,
                `${this.$constants('AS')} 'exists'`
            ].join(' ');
            let check = false;
            const [{ exists: result }] = yield this.queryStatement(sql);
            check = !!parseInt(result);
            switch (check) {
                case false: {
                    const [result, id] = yield this.actionStatement({
                        sql: this.$state.get('INSERT'),
                        returnId: true
                    });
                    if (result) {
                        const sql = [
                            `${this.$state.get('SELECT')}`,
                            `${this.$state.get('FROM')}`,
                            `${this.$state.get('TABLE_NAME')}`,
                            `${this.$constants('WHERE')} ${this.$state.get('TABLE_NAME')}.\`id\` = '${id}'`
                        ].join(' ');
                        const data = yield this.queryStatement(sql);
                        return (data === null || data === void 0 ? void 0 : data.shift()) || null;
                    }
                    return null;
                }
                case true: {
                    return null;
                }
                default: {
                    return null;
                }
            }
        });
    }
    _createModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result, id] = yield this.actionStatement({
                sql: this.$state.get('INSERT'),
                returnId: true
            });
            if (this.$state.get('VOID'))
                return null;
            if (result) {
                const sql = [
                    `${this.$state.get('SELECT')}`,
                    `${this.$state.get('FROM')}`,
                    `${this.$state.get('TABLE_NAME')}`,
                    `${this.$constants('WHERE')} ${this.$state.get('TABLE_NAME')}.\`id\` = ${id}`
                ].join(' ');
                const data = yield this.queryStatement(sql);
                const result = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                this.$state.set('RESULT', result);
                const hook = this.$state.get('HOOK');
                if (hook === null || hook === void 0 ? void 0 : hook.length)
                    for (let i = 0; i < hook.length; i++)
                        yield hook[i](result);
                return result;
            }
            const hook = this.$state.get('HOOK');
            if (hook === null || hook === void 0 ? void 0 : hook.length)
                for (let i = 0; i < hook.length; i++)
                    yield hook[i](result || []);
            return null;
        });
    }
    _createMultipleModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result, id] = yield this.actionStatement({
                sql: this.$state.get('INSERT'),
                returnId: true
            });
            if (this.$state.get('VOID'))
                return null;
            if (result) {
                const arrayId = [...Array(result)].map((_, i) => i + id);
                const sql = [
                    `${this.$state.get('SELECT')}`,
                    `${this.$state.get('FROM')}`,
                    `${this.$state.get('TABLE_NAME')}`,
                    `${this.$constants('WHERE')} id`,
                    `${this.$constants('IN')} (${arrayId})`
                ].join(' ');
                const data = yield this.queryStatement(sql);
                const resultData = data || null;
                this.$state.set('RESULT', resultData);
                return resultData;
            }
            return null;
        });
    }
    _updateOrInsertModel() {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this.$state.get('WHERE'), "Can't update or insert [updateOrInsert] without where condition");
            const clone = new Model().copyModel(this, { where: true });
            const check = (yield clone.exists()) || false;
            switch (check) {
                case false: {
                    const [result, id] = yield this.actionStatement({
                        sql: this.$state.get('INSERT'),
                        returnId: true
                    });
                    if (this.$state.get('VOID'))
                        return null;
                    if (result) {
                        const sql = new Model().copyModel(this).where('id', id).toString();
                        const data = yield this.queryStatement(sql);
                        const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'insert' }) || null;
                        this.$state.set('RESULT', resultData);
                        return resultData;
                    }
                    return null;
                }
                case true: {
                    const result = yield this.actionStatement({
                        sql: new Model().copyModel(this, { update: true }).toString()
                    });
                    if (this.$state.get('VOID'))
                        return null;
                    if (result) {
                        const sql = new Model().copyModel(this, { where: true }).toString();
                        const data = yield this.queryStatement(sql);
                        if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                            for (const val of data) {
                                val.action_status = 'update';
                            }
                            return data || [];
                        }
                        return Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'update' }) || null;
                    }
                    return null;
                }
                default: {
                    return null;
                }
            }
        });
    }
    _updateModel(ignoreWhere = false) {
        return __awaiter(this, void 0, void 0, function* () {
            this._assertError(!this.$state.get('WHERE') && !ignoreWhere, "can't update [update] without where condition");
            const sql = this._buildQueryModel();
            if (this.$state.get('VOID'))
                return null;
            if (!this.$state.get('VOID')) {
                const [result] = yield this.actionStatement({ sql, returnId: true });
                if (!result)
                    return null;
                let data = yield this.queryStatement([
                    `${this.$state.get('SELECT')}`,
                    `${this.$state.get('FROM')}`,
                    `${this.$state.get('TABLE_NAME')}`,
                    `${this.$state.get('WHERE')}`
                ].join(' '));
                if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                    data = data || [];
                }
                else {
                    data = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                }
                this.$state.set('RESULT', data);
                return data;
            }
            const [result] = yield this.actionStatement({ sql, returnId: true });
            if (!result)
                return null;
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
    _functionRelationName() {
        const functionName = [...this.$logger.get()][this.$logger.get().length - 2];
        return functionName.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`);
    }
    _handleRelationsQuery(nameRelation, relation) {
        this.$state.set('RELATION', [...this.$state.get('RELATION'), relation]);
        this.with(nameRelation);
        const r = this.$state.get('WITH').find((data) => data.name === nameRelation);
        this._assertError(r == null, `relation ${nameRelation} not be register !`);
        this._assertError(!Object.values(this.$constants('RELATIONSHIP')).includes(r.relation), `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
        return r;
    }
    _validateMethod(method) {
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
                const methodsNotAllowed = [
                    'create',
                    'createNotExists',
                    'updateOrCreate',
                    'updateOrInsert',
                    'insertOrUpdate',
                    'update'
                ];
                const findMethodNotAllowed = methodCallings.find((methodCalling) => methodsNotAllowed.includes(methodCalling));
                this._assertError(methodCallings.some((methodCalling) => methodsNotAllowed.includes(methodCalling)), `this method ${method} can't using method : [ ${findMethodNotAllowed} ]`);
                break;
            }
        }
    }
    _initialModel() {
        this.$state = (() => {
            let db = new Map(Object.entries(Object.assign({}, this.$constants('MODEL'))));
            let original = new Map(Object.entries(Object.assign({}, this.$constants('MODEL'))));
            return {
                original: () => original,
                get: (key) => {
                    if (key == null)
                        return db;
                    this._assertError(!db.has(key), `can't get this [${key}]`);
                    return db.get(key);
                },
                set: (key, value) => {
                    this._assertError(!db.has(key), `can't set this [${key}]`);
                    db.set(key, value);
                },
                clone: (data) => {
                    db = new Map(Object.entries(Object.assign({}, data)));
                }
            };
        })();
        this._makeTableName();
        return this;
    }
}
exports.Model = Model;
exports.default = Model;
