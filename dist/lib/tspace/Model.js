"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const pluralize_1 = __importDefault(require("pluralize"));
const AbstractModel_1 = require("./AbstractModel");
const DB_1 = require("./DB");
const ProxyHandler_1 = require("./ProxyHandler");
class Model extends AbstractModel_1.AbstractModel {
    tableName;
    constructor() {
        super();
        /**
         *
         * Get initialize for model
         */
        this._initialModel();
        /**
         *
         * Define Setup for model
         */
        this.define();
        return new Proxy(this, ProxyHandler_1.proxyHandler);
    }
    /**
     *
     * define for initialize of models
     * @return {void} void
     */
    define() { }
    /**
     *
     * Assign function callback in model
     * @return {this} this
     */
    useRegistry() {
        this.$db.set('REGISTRY', {
            ...this.$db.get('REGISTRY'),
            attach: this._attach,
            detach: this._detach
        });
        return this;
    }
    /**
    *
    * Assign function callback in model
    * @return {this} this
    */
    usePrimaryKey(primary) {
        this.$db.set('PRIMARY_KEY', primary);
        return this;
    }
    /**
     * Assign in model uuid when creating
     * @param {string?} column [column=uuid] custom column replace this
     * @return {this} this
     */
    useUUID(column) {
        this.$db.set('UUID', true);
        if (column)
            this.$db.set('UUID_FORMAT', column);
        return this;
    }
    /**
     * Assign in model console.log sql statement
     * @return {this} this
     */
    useDebug() {
        this.$db.set('DEBUG', true);
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
        this.$db.set('PATTERN', pattern);
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
        this.$db.set('SOFT_DELETE', true);
        if (column)
            this.$db.set('SOFT_DELETE_FORMAT', column);
        return this;
    }
    /**
     *
     * Assign timestamp when insert || updated created_at and update_at in table
     * @param {object} timestampFormat
     * @property {string} timestampFormat.createdAt  - change column of created at
     * @property {string} timestampFormat.updatedAt - change column of updated at
     * @return {this} this
     */
    useTimestamp(timestampFormat) {
        this.$db.set('TIMESTAMP', true);
        if (timestampFormat) {
            this.$db.set('TIMESTAMP_FORMAT', {
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
        this.$db.set('TABLE_NAME', `\`${table}\``);
        this.$db.get('SELECT', `${this.$constants('SELECT')} *`);
        this.$db.get('FROM', `${this.$constants('FROM')}'`);
        return this;
    }
    /**
     *
     * Assign table name in model with signgular pattern
     * @return {this} this
     */
    useTableSingular() {
        const table = this._classToTableName(this.constructor?.name, { singular: true });
        this.$db.set('TABLE_NAME', `\`${pluralize_1.default.singular(table)}\``);
        this.$db.get('SELECT', `${this.$constants('SELECT')} *`);
        this.$db.get('FROM', `${this.$constants('FROM')}'`);
        return this;
    }
    /**
     *
     * Assign table name in model with pluarl pattern
     * @return {this} this
     */
    useTablePlural() {
        const table = this._classToTableName(this.constructor?.name);
        this.$db.set('TABLE_NAME', `\`${pluralize_1.default.plural(table)}\``);
        this.$db.get('SELECT', `${this.$constants('SELECT')} *`);
        this.$db.get('FROM', `${this.$constants('FROM')}'`);
        return this;
    }
    /**
     *
     * Clone instance of model
     * @override Method
     * @return {this} this
     */
    clone(instance) {
        if (!(instance instanceof Model)) {
            throw new Error('value is not a instanceof Model');
        }
        const copy = Object.fromEntries(instance.$db.get());
        this.$db.clone(copy);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     * @param {boolean} condition
     * @return {this} this
     */
    ignoreSoftDelete(condition = false) {
        this.$db.set('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign ignore delete_at in model
     *  @param {boolean} condition
     * @return {this} this
     */
    disableSoftDelete(condition = false) {
        this.$db.set('SOFT_DELETE', condition);
        return this;
    }
    /**
     * Assign build in function to result of data
     * @param {object} func
     * @return {this} this
     */
    registry(func) {
        this.$db.set('REGISTRY', {
            ...func,
            attach: this._attach,
            detach: this._detach
        });
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
            const relation = this.$db.get('RELATION')?.find((data) => data.name === name);
            this._assertError(relation == null, `relation ${name} not be register !`);
            const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation);
            this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
            if (relation.query == null)
                relation.query = new relation.model();
            return relation;
        });
        relations.sort((cur, prev) => cur.relation.length - prev.relation.length);
        const setRelations = this.$db.get('WITH').length
            ? [...relations.map((w) => {
                    const exists = this.$db.get('WITH').find((r) => r.name === w.name);
                    if (exists)
                        return null;
                    return w;
                }).filter((d) => d != null),
                ...this.$db.get('WITH')]
            : relations;
        this.$db.set('WITH', setRelations);
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
        this.$db.set('WITH_EXISTS', true);
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
        const relation = this.$db.get('WITH').find((data) => data.name === nameRelation);
        this._assertError(relation == null, `relation ${nameRelation} not be register !`);
        const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation);
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
            const relation = this.$db.get('RELATION')?.find((data) => data.name === name);
            this._assertError(relation == null, `relation ${name} not be register !`);
            const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation);
            this._assertError(!relationHasExists, `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
            if (relation.query == null)
                relation.query = new relation.model();
            return relation;
        });
        relations.sort((cur, prev) => cur.relation.length - prev.relation.length);
        const setRelations = this.$db.get('WITH').length
            ? [...relations.map((w) => {
                    const exists = this.$db.get('WITH').find((r) => r.name === w.name);
                    if (exists)
                        return null;
                    return w;
                }).filter((d) => d != null), ...this.$db.get('WITH')]
            : relations;
        this.$db.set('WITH', setRelations);
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
        this.$db.set('WITH_EXISTS', true);
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
        const relation = this.$db.get('WITH').find((data) => data.name === nameRelation);
        this._assertError(relation == null, `relation ${nameRelation} not be register !`);
        const relationHasExists = Object.values(this.$constants('RELATIONSHIP'))?.includes(relation.relation);
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
        this.$db.set('RELATION', [...this.$db.get('RELATION'), relation]);
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
        this.$db.set('RELATION', [...this.$db.get('RELATION'), relation]);
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
        this.$db.set('RELATION', [...this.$db.get('RELATION'), relation]);
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
        this.$db.set('RELATION', [...this.$db.get('RELATION'), relation]);
        return this;
    }
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    hasOneQuery({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
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
        r.query = callback(new r.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    hasManyQuery({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
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
        r.query = callback(new r.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    belongsToQuery({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
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
        r.query = callback(new r.model());
        return this;
    }
    /**
     * Assign the relation in model Objects
     * @param     {object}   relations registry relation in your model
     * @property  {string}   relation.name
     * @property  {string}   relation.as
     * @property  {class}    relation.model
     * @property  {string}   relation.localKey
     * @property  {string}   relation.foreignKey
     * @property  {string}   relation.freezeTable
     * @param     {function} callback callback query relation of model
     * @return    {this}     this
     */
    belongsToManyQuery({ name, as, model, localKey, foreignKey, freezeTable }, callback) {
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
        r.query = callback(new r.model());
        return this;
    }
    /**
     * return only in trashed (data has been remove)
     * @return {promise}
     */
    async trashed() {
        this.whereNotNull(this._valuePattern(this.$db.get('SOFT_DELETE_FORMAT')));
        const sql = this._buildQueryModel();
        return await this._execute({ sql, type: 'GET' });
    }
    /**
     * return all only in trashed (data has been remove)
     * @return {promise}
     */
    async onlyTrashed() {
        this.$db.set('SOFT_DELETE', false);
        this.whereNotNull(this._valuePattern(this.$db.get('SOFT_DELETE_FORMAT')));
        const sql = this._buildQueryModel();
        return await this._execute({ sql, type: 'GET' });
    }
    /**
     * restore data in trashed
     * @return {promise}
     */
    async restore() {
        const updatedAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').UPDATED_AT);
        const deletedAt = this._valuePattern(this.$db.get('SOFT_DELETE_FORMAT'));
        const query = this.$db.get('TIMESTAMP')
            ? `${deletedAt} = NULL , ${updatedAt} = '${this.$utils.timestamp()}'`
            : `${deletedAt} = NULL`;
        this.$db.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `SET ${query}`
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE');
        return await this.save();
    }
    /**
     *
     * @override Method
     * @return {promise<string>}
    */
    async exceptColumns() {
        const sql = [
            `${this.$constants('SHOW')}`,
            `${this.$constants('COLUMNS')}`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`
        ].join(' ');
        const rawColumns = await this._queryStatementModel(sql);
        const columns = rawColumns.map((column) => column.Field);
        const removeExcept = columns.filter((column) => !this.$db.get('EXCEPT').includes(column));
        return removeExcept.join(',');
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
    async toJSON() {
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        if (this.$db.get('HIDDEN').length)
            this._hiddenColumnModel(result);
        return JSON.stringify(result);
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<Array>}
    */
    async toArray(column = 'id') {
        this.$db.set('SELECT', `${this.$constants('SELECT')} ${column}`);
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        const toArray = result.map((data) => data[column]);
        return toArray;
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    async avg(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('AVG')}(${column})`,
            `${this.$constants('AS')} avg`
        ].join(' '));
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        return result?.shift()?.avg || 0;
    }
    /**
     *
     * @override Method
     * @param {string} column [column=id]
     * @return {promise<number>}
    */
    async sum(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('SUM')}(${column})`,
            `${this.$constants('AS')} sum`
        ].join(' '));
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        return result?.shift()?.sum || 0;
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    async max(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('MAX')}(${column})`,
            `${this.$constants('AS')} max`
        ].join(' '));
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        return result?.shift()?.max || 0;
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    async min(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('MIN')}(${column})`,
            `${this.$constants('AS')} min`
        ].join(' '));
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        return result?.shift()?.min || 0;
    }
    /**
     *
     * @override Method
     * @param {string=} column [column=id]
     * @return {promise<number>}
    */
    async count(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('COUNT')}(${column})`,
            `${this.$constants('AS')} total`
        ].join(' '));
        const sql = this._buildQueryModel();
        const result = await this._queryStatementModel(sql);
        return result?.shift()?.total || 0;
    }
    /**
     * delete data from the database
     * @override Method
     * @return {promise<boolean>}
     */
    async delete() {
        if (!this.$db.get('WHERE'))
            throw new Error("can't delete without where condition");
        if (this.$db.get('SOFT_DELETE')) {
            const deletedAt = this._valuePattern(this.$db.get('SOFT_DELETE_FORMAT'));
            const query = `${deletedAt} = '${this.$utils.timestamp()}'`;
            let sql = [
                `${this.$constants('UPDATE')}`,
                `${this.$db.get('TABLE_NAME')}`,
                `${this.$constants('SET')}`,
                `${query}`
            ].join(' ');
            if (this.$db.get('TIMESTAMP')) {
                const updatedAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').UPDATED_AT);
                sql = `${sql} , ${updatedAt} = '${this.$utils.timestamp()}'`;
            }
            this.$db.set('UPDATE', `${sql} ${this.$db.get('WHERE')}`);
            const result = await this._actionStatementModel({ sql: this.$db.get('UPDATE') });
            return !!result ?? false;
        }
        this.$db.set('DELETE', [
            `${this.$constants('DELETE')}`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`
        ].join(' '));
        const result = await this._actionStatementModel({ sql: this.$db.get('DELETE') });
        return !!result ?? false;
    }
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    async first() {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        let sql = this._buildQueryModel();
        if (!sql.includes(this.$constants('LIMIT'))) {
            sql = `${sql} ${this.$constants('LIMIT')} 1`;
            if (this.$db.get('WITH_EXISTS')) {
                sql = this._queryRelationsExists();
            }
            return await this._execute({ sql, type: 'FIRST' });
        }
        sql = sql.replace(this.$db.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
        if (this.$db.get('WITH_EXISTS')) {
            sql = this._queryRelationsExists();
        }
        return await this._execute({ sql, type: 'FIRST' });
    }
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    async findOne() {
        return await this.first();
    }
    /**
     *
     * @override Method
     * @return {promise<object | Error>}
    */
    async firstOrError(message, options) {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        let sql = this._buildQueryModel();
        if (!sql.includes(this.$constants('LIMIT'))) {
            sql = `${sql} ${this.$constants('LIMIT')} 1`;
            return await this._execute({ sql, type: 'FIRST_OR_ERROR', message, options });
        }
        sql = sql.replace(this.$db.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
        if (this.$db.get('WITH_EXISTS')) {
            sql = this._queryRelationsExists();
        }
        return await this._execute({ sql, type: 'FIRST_OR_ERROR', message, options });
    }
    /**
     *
     * @override Method
     * @return {promise<any>}
    */
    async findOneOrError(message, options) {
        return this.firstOrError(message, options);
    }
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    async all() {
        const sql = [
            `${this.$constants('SELECT')}`,
            `*`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`
        ].join(' ');
        const result = await this._queryStatementModel(sql);
        return result;
    }
    /**
     *
     * @override Method
     * @return {promise<object | null>}
    */
    async find(id) {
        const sql = [
            `${this.$constants('SELECT')}`,
            `*`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$constants('WHERE')}`,
            `${this.$db.get('PRIMARY_KEY')} = ${id}`
        ].join(' ');
        const result = await this._queryStatementModel(sql);
        return result?.shift() || null;
    }
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    async get() {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        let sql = this._buildQueryModel();
        if (this.$db.get('WITH_EXISTS')) {
            sql = this._queryRelationsExists();
        }
        return await this._execute({ sql, type: 'GET' });
    }
    /**
     *
     * @override Method
     * @return {promise<array>}
    */
    async findMany() {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        const sql = this._buildQueryModel();
        return await this._execute({ sql, type: 'GET' });
    }
    /**
     *
     * @override Method
     * @param {?object} paginationOptions by default page = 1 , limit = 15
     * @property {number} paginationOptions.limit
     * @property {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    async pagination(paginationOptions) {
        let limit = 15;
        let page = 1;
        if (paginationOptions != null) {
            limit = paginationOptions?.limit || limit;
            page = paginationOptions?.page || page;
        }
        this._assertError(this.$logger?.check('limit'), `this '[pagination]' can't support '[limit]' method`);
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        const offset = (page - 1) * limit;
        this.$db.set('PER_PAGE', limit);
        this.$db.set('PAGE', page);
        let sql = this._buildQueryModel();
        if (this.$db.get('WITH_EXISTS')) {
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
            return await this._execute({ sql, type: 'PAGINATION' });
        }
        sql = sql.replace(this.$db.get('LIMIT'), [
            `${this.$constants('LIMIT')}`,
            `${limit}`,
            `${this.$constants('OFFSET')}`,
            `${offset}`
        ].join(' '));
        return await this._execute({ sql, type: 'PAGINATION' });
    }
    /**
    *
    * @override Method
    * @param    {?object} paginationOptions by default page = 1 , limit = 15
    * @property {number}  paginationOptions.limit
    * @property {number}  paginationOptions.page
    * @return   {promise<Pagination>}
    */
    async paginate(paginationOptions) {
        let limit = 15;
        let page = 1;
        if (paginationOptions != null) {
            limit = paginationOptions?.limit || limit;
            page = paginationOptions?.page || page;
        }
        return await this.pagination({ limit, page });
    }
    /**
     *
     * @override Method
     * @param {string} column
     * @return {Promise<array>}
     */
    async getGroupBy(column) {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        this.$db.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${column}`);
        this.$db.set('SELECT', [
            `${this.$db.get('SELECT')},`,
            `${this.$constants('GROUP_CONCAT')}(id)`,
            `${this.$constants('AS')} data`
        ].join(' '));
        const sql = this._buildQueryModel();
        const results = await this._queryStatementModel(sql);
        let data = [];
        results.forEach((result) => {
            const splits = result?.data?.split(',') ?? '0';
            splits.forEach((split) => data = [...data, split]);
        });
        const sqlChild = [
            `${this.$constants('SELECT')}`,
            `*`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$constants('WHERE')} id`,
            `${this.$constants('IN')}`,
            `(${data.map((a) => `\'${a}\'`).join(',') || ['0']})`
        ].join(' ');
        const childData = await this._queryStatementModel(sqlChild);
        const child = await this._executeGroup(childData);
        const resultData = results.map((result) => {
            const id = result[column];
            const newData = child.filter((data) => data[column] === id);
            return ({
                [column]: id,
                data: newData
            });
        });
        return resultData;
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
        this.$db.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE');
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
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT');
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
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT');
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
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${queryInsert}`
        ].join(' '));
        this.$db.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${queryUpdate}`
        ].join(' '));
        this.$db.set('SAVE', 'UPDATE_OR_INSERT');
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
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
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
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this;
    }
    /**
     *
     * @override Method
     * @return {Promise<any>}
     */
    async save() {
        const attributes = this.$attributes;
        if (Object.keys(attributes)?.length) {
            while (true) {
                if (this.$db.get('WHERE')) {
                    const query = this._queryUpdateModel(attributes);
                    this.$db.set('UPDATE', [
                        `${this.$constants('UPDATE')}`,
                        `${this.$db.get('TABLE_NAME')}`,
                        `${query}`
                    ].join(' '));
                    this.$db.set('SAVE', 'UPDATE');
                    break;
                }
                const query = this._queryInsertModel(attributes);
                this.$db.set('INSERT', [
                    `${this.$constants('INSERT')}`,
                    `${this.$db.get('TABLE_NAME')}`,
                    `${query}`
                ].join(' '));
                this.$db.set('SAVE', 'INSERT');
                break;
            }
        }
        switch (this.$db.get('SAVE')) {
            case 'INSERT_MULTIPLE': return await this._createMultipleModel();
            case 'INSERT': return await this._createModel();
            case 'UPDATE': return await this._updateModel();
            case 'INSERT_NOT_EXISTS': return await this._insertNotExistsModel();
            case 'UPDATE_OR_INSERT': return await this._updateOrInsertModel();
            default: throw new Error(`unknown this [${this.$db.get('SAVE')}]`);
        }
    }
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    async faker(rows = 1) {
        let data = [];
        for (let row = 0; row < rows; row++) {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('FIELDS')}`,
                `${this.$constants('FROM')}`,
                `${this.$db.get('TABLE_NAME')}`
            ].join(' ');
            const fields = await this._queryStatementModel(sql);
            let columnAndValue = {};
            for (const { Field: field, Type: type } of fields) {
                const check = [
                    field.toLowerCase() === 'id',
                    field.toLowerCase() === '_id',
                    field.toLowerCase() === 'uuid'
                ].some(f => f);
                if (check)
                    continue;
                columnAndValue = {
                    ...columnAndValue,
                    [field]: this.$utils.faker(type)
                };
            }
            data = [...data, columnAndValue];
        }
        const query = this._queryInsertMultipleModel(data);
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return await this.save();
    }
    async _queryStatementModel(sql) {
        if (this.$db.get('DEBUG'))
            this.$utils.consoleDebug(sql);
        const result = await this.$pool.get(sql);
        this._registry(result);
        return result;
    }
    async _actionStatementModel({ sql, returnId = false }) {
        if (this.$db.get('DEBUG'))
            this.$utils.consoleDebug(sql);
        if (returnId) {
            const result = await this.$pool.get(sql);
            return [result.affectedRows, result.insertId];
        }
        const { affectedRows: result } = await this.$pool.get(sql);
        return result;
    }
    _valuePattern(value) {
        switch (this.$db.get('PATTERN')) {
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
        return this.$db.get('PATTERN') === this.$constants('PATTERN').snake_case;
    }
    _classToTableName(className, { singular = false } = {}) {
        if (className == null)
            className = this.constructor.name;
        const tb = className.replace(/([A-Z])/g, (str) => '_' + str.toLowerCase()).slice(1);
        if (singular)
            return tb;
        return pluralize_1.default.plural(tb);
    }
    _tableName() {
        const tb = this._classToTableName();
        this.$db.set('SELECT', `${this.$constants('SELECT')} *`);
        this.$db.set('FROM', `${this.$constants('FROM')}`);
        this.$db.set('TABLE_NAME', `\`${tb}\``);
        return this;
    }
    _valueInRelation(relationModel) {
        const relation = relationModel.relation;
        const model = relationModel.model?.name;
        const table = relationModel.freezeTable
            ? relationModel.freezeTable
            : relationModel.query?.tableName;
        const name = relationModel.name;
        const as = relationModel.as;
        this._assertError(!model || model == null, 'not found model');
        let localKey = relationModel.localKey
            ? relationModel.localKey
            : this.$db.get('PRIMARY_KEY');
        let foreignKey = relationModel.foreignKey
            ? relationModel.foreignKey
            : this._valuePattern([
                `${pluralize_1.default.singular(this.$db.get('TABLE_NAME').replace(/\`/g, ''))}`,
                `${this.$db.get('PRIMARY_KEY')}`
            ].join('_'));
        const checkRelationIsBelongsTo = [
            relationModel.localKey == null,
            relationModel.foreignKey == null,
            relation === this.$constants('RELATIONSHIP').belongsTo
        ].every(c => c);
        if (checkRelationIsBelongsTo) {
            foreignKey = localKey;
            localKey = this._valuePattern([
                `${pluralize_1.default.singular(table)}`,
                `${this.$db.get('PRIMARY_KEY')}`
            ].join('_'));
        }
        return { name, as, relation, table, localKey, foreignKey, model };
    }
    _buildQueryModel() {
        let sql = [];
        while (true) {
            if (this.$db.get('SOFT_DELETE')) {
                const deletedAt = this._valuePattern(this.$db.get('SOFT_DELETE_FORMAT'));
                this.whereNull(deletedAt);
            }
            if (this.$db.get('INSERT')) {
                sql = [
                    this.$db.get('INSERT')
                ];
                break;
            }
            if (this.$db.get('UPDATE')) {
                sql = [
                    this.$db.get('UPDATE'),
                    this.$db.get('WHERE')
                ];
                break;
            }
            if (this.$db.get('DELETE')) {
                sql = [
                    this.$db.get('DELETE')
                ];
                break;
            }
            sql = [
                this.$db.get('SELECT'),
                this.$db.get('FROM'),
                this.$db.get('TABLE_NAME'),
                this.$db.get('JOIN'),
                this.$db.get('WHERE'),
                this.$db.get('GROUP_BY'),
                this.$db.get('HAVING'),
                this.$db.get('ORDER_BY'),
                this.$db.get('LIMIT'),
                this.$db.get('OFFSET')
            ];
            break;
        }
        const filterSql = sql.filter(data => data !== '' || data == null);
        const query = filterSql.join(' ');
        return query;
    }
    _showOnly(data) {
        let result = [];
        const hasNameRelation = this.$db.get('WITH').map((w) => w.as ?? w.name);
        data.forEach((d) => {
            let newData = {};
            this.$db.get('ONLY').forEach((only) => {
                if (d.hasOwnProperty(only))
                    newData = { ...newData, [only]: d[only] };
            });
            hasNameRelation.forEach((name) => {
                if (name)
                    newData = { ...newData, [name]: d[name] };
            });
            result = [...result, newData];
        });
        return result;
    }
    async _execute({ sql, type, message, options }) {
        let result = await this._queryStatementModel(sql);
        const emptyData = this._returnEmpty(type, result, message, options);
        if (!result.length)
            return emptyData;
        const relations = this.$db.get('WITH');
        if (!relations.length)
            return this._returnResult(type, result) || emptyData;
        for (const relation of relations) {
            const relationIsBelongsToMany = relation.relation === this.$constants('RELATIONSHIP').belongsToMany;
            if (relationIsBelongsToMany) {
                result = await this._belongsToMany(result, relation);
                continue;
            }
            const dataFromRelation = await this._relation(result, relation);
            result = this._relationMapData(result, dataFromRelation, relation);
        }
        if (this.$db.get('HIDDEN').length)
            this._hiddenColumnModel(result);
        return this._returnResult(type, result) || emptyData;
    }
    async _executeGroup(dataParents, type = 'GET') {
        const emptyData = this._returnEmpty(type, dataParents);
        if (!dataParents.length)
            return emptyData;
        const relations = this.$db.get('WITH');
        if (relations.length) {
            for (const relation of relations) {
                if (relation.relation === this.$constants('RELATIONSHIP').belongsToMany) {
                    return this._belongsToMany(dataParents, relation);
                }
                let dataChilds = await this._relation(dataParents, relation);
                dataParents = this._relationMapData(dataParents, dataChilds, relation);
            }
        }
        if (this.$db.get('HIDDEN')?.length)
            this._hiddenColumnModel(dataParents);
        const resultData = this._returnResult(type, dataParents);
        return resultData || emptyData;
    }
    _relationMapData(dataParents, dataChilds, relations) {
        const { name, as, relation, localKey, foreignKey } = this._valueInRelation(relations);
        const keyRelation = as ?? name;
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
        this._assertError(!Object.keys(relation)?.length, `unknown [relation]`);
        const { localKey, foreignKey } = this._valueInRelation(relation);
        const query = relation.query;
        this._assertError(query == null, `unknown callback query in [relation : '${relation.name}']`);
        const clone = new Model().clone(query);
        if (clone.$db.get('WITH').length) {
            for (const r of clone.$db.get('WITH')) {
                if (r.query == null)
                    continue;
                const sql = clone._handleRelationsExists(r);
                clone.whereExists(sql);
            }
        }
        const sql = clone
            .bind(this.$pool.load())
            .whereReference(`\`${this.tableName}\`.\`${localKey}\``, `\`${query.tableName}\`.\`${foreignKey}\``)
            .toString();
        return sql;
    }
    _queryRelationsExists() {
        const relations = this.$db.get('WITH');
        for (const index in relations) {
            const relation = relations[index];
            if (!Object.keys(relation)?.length)
                continue;
            const { localKey, foreignKey } = this._valueInRelation(relation);
            const query = relation.query;
            this._assertError(query == null, `unknown callback query in [relation : '${relation.name}']`);
            let clone = new Model().clone(query);
            if (clone.$db.get('WITH').length) {
                for (const r of clone.$db.get('WITH')) {
                    if (r.query == null)
                        continue;
                    const sql = clone._handleRelationsExists(r);
                    clone.whereExists(sql);
                }
            }
            const sql = clone
                .bind(this.$pool.load())
                .whereReference(`\`${this.tableName}\`.\`${localKey}\``, `\`${query.tableName}\`.\`${foreignKey}\``)
                .toString();
            this.whereExists(sql);
        }
        const sql = this._buildQueryModel();
        return sql;
    }
    async _relation(parents, relation) {
        if (!Object.keys(relation)?.length)
            return [];
        const { localKey, foreignKey } = this._valueInRelation(relation);
        const localKeyId = parents.map((parent) => {
            const data = parent[localKey];
            if (!parent.hasOwnProperty(localKey)) {
                this._assertError(data == null, "unknown relationship without primary or foreign key");
            }
            return data;
        }).filter((data) => data != null);
        const dataPerentId = Array.from(new Set(localKeyId)) || [];
        if (!dataPerentId.length && this.$db.get('WITH_EXISTS'))
            return [];
        const query = await relation.query;
        this._assertError(query == null, `unknown callback query in [relation : '${relation.name}']`);
        const dataFromRelation = await query
            .bind(this.$pool.load())
            .whereIn(foreignKey, dataPerentId)
            .debug(this.$db.get('DEBUG'))
            .get();
        return dataFromRelation;
    }
    async _handleBelongsToMany(dataFromParent, relation, pivotTable) {
        let { name, localKey, foreignKey } = this._valueInRelation(relation);
        const localKeyId = dataFromParent.map((parent) => {
            const data = parent[localKey];
            if (!parent.hasOwnProperty(localKey)) {
                this._assertError(data == null, "unknown relationship without primary or foreign key");
            }
            return data;
        }).filter((data) => data != null);
        const dataPerentId = Array.from(new Set(localKeyId)).join(',') || [];
        if (!dataPerentId.length && this.$db.get('WITH_EXISTS'))
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
        let dataChilds = await this._queryStatementModel(sqldataChilds);
        const otherId = dataChilds.map((sub) => sub[otherforeignKey]).filter((data) => data != null);
        const otherArrId = Array.from(new Set(otherId)) || [];
        const otherdataChilds = await this._queryStatementModel(modelOther
            .bind(this.$pool.load())
            .whereIn(otherlocalKey, otherArrId)
            .debug(this.$db.get('DEBUG'))
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
        if (this.$db.get('HIDDEN').length)
            this._hiddenColumnModel(dataFromParent);
        return dataFromParent;
    }
    async _belongsToMany(dataFromParent, relation) {
        const local = this.$utils.columnRelation(this.constructor.name);
        const modelOther = new relation.model();
        const other = this._classToTableName(modelOther.constructor.name, { singular: true });
        try {
            const pivotTable = relation.freezeTable ?? `${local}_${other}`;
            return await this._handleBelongsToMany(dataFromParent, relation, pivotTable);
        }
        catch (err) {
            try {
                const pivotTable = relation.freezeTable ?? `${other}_${local}`;
                return await this._handleBelongsToMany(dataFromParent, relation, pivotTable);
            }
            catch (e) {
                throw new Error(err.message);
            }
        }
    }
    async _pagination(data) {
        const currentPage = +(this.$db.get('PAGE'));
        this.select([
            `${this.$constants('COUNT')}(${this.$db.get('PRIMARY_KEY')})`,
            `${this.$constants('AS')}`,
            `total`
        ].join(' '));
        const limit = Number(this.$db.get('PER_PAGE'));
        this._assertError(limit < 1, "minimun less 1 of limit");
        const sql = this._buildQueryModel();
        const res = await this._queryStatementModel(sql);
        const total = res.shift().total ?? 0;
        let lastPage = Math.ceil(total / limit) || 0;
        lastPage = lastPage > 1 ? lastPage : 1;
        const nextPage = currentPage + 1;
        const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
        const totalPage = data?.length ?? 0;
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
    }
    _result(data) {
        this.$db.get('RESULT', data);
        return data;
    }
    _returnEmpty(type, result, message, options) {
        let emptyData = null;
        switch (type) {
            case 'FIRST': {
                emptyData = null;
                break;
            }
            case 'FIRST_OR_ERROR': {
                if (!result?.length) {
                    if (options == null) {
                        throw {
                            message,
                            code: 400
                        };
                    }
                    throw {
                        message,
                        ...options
                    };
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
                        limit: Number(this.$db.get('PER_PAGE')),
                        totalPage: 0,
                        currentPage: Number(this.$db.get('PAGE')),
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
            return this.$utils.snakeCase(this._result(emptyData));
        }
        return this._result(emptyData);
    }
    _returnResult(type, data) {
        if (Object.keys(this.$db.get('REGISTRY'))?.length) {
            data?.forEach((d) => {
                for (const name in this.$db.get('REGISTRY')) {
                    const registry = this.$db.get('REGISTRY');
                    d[name] = registry[name];
                }
            });
        }
        if (this.$db.get('ONLY')?.length) {
            data = this._showOnly(data);
        }
        switch (type) {
            case 'FIRST': {
                if (this.$db.get('PLUCK')) {
                    const pluck = this.$db.get('PLUCK');
                    const newData = data.shift();
                    const checkProperty = newData.hasOwnProperty(pluck);
                    this._assertError(!checkProperty, `can't find property '${pluck}' of result`);
                    return this._result(newData[pluck]);
                }
                return this._result(data.shift() ?? null);
            }
            case 'FIRST_OR_ERROR': {
                if (this.$db.get('PLUCK')) {
                    const pluck = this.$db.get('PLUCK');
                    const newData = data.shift();
                    const checkProperty = newData.hasOwnProperty(pluck);
                    this._assertError(!checkProperty, `can't find property '${pluck}' of result`);
                    const result = this._result(newData[pluck]) ?? null;
                    return result;
                }
                const result = this._result(data.shift() ?? null);
                if (result == null)
                    throw new Error();
                return result;
            }
            case 'GET': {
                if (this.$db.get('CHUNK')) {
                    const result = data.reduce((resultArray, item, index) => {
                        const chunkIndex = Math.floor(index / this.$db.get('CHUNK'));
                        if (!resultArray[chunkIndex])
                            resultArray[chunkIndex] = [];
                        resultArray[chunkIndex].push(item);
                        return resultArray;
                    }, []);
                    return this._result(result);
                }
                if (this.$db.get('PLUCK')) {
                    const pluck = this.$db.get('PLUCK');
                    const newData = data.map((d) => d[pluck]);
                    this._assertError(newData.every((d) => d == null), `can't find property '${pluck}' of result`);
                    return this._result(newData);
                }
                return this._result(data);
            }
            case 'PAGINATION': {
                return this._pagination(data);
            }
            default: {
                throw new Error('Missing method first get or pagination');
            }
        }
    }
    _hiddenColumnModel(object) {
        const hidden = this.$db.get('HIDDEN');
        if (object?.length) {
            hidden.forEach((column) => {
                object.forEach((objColumn) => {
                    delete objColumn[column];
                });
            });
        }
        return object;
    }
    async _attach(name, dataId, fields) {
        this._assertError(!Array.isArray(dataId), `this ${dataId} is not an array`);
        const relation = this.$db.get('RELATION')?.find((data) => data.name === name);
        this._assertError(!relation, `unknown name relation ['${name}'] in model`);
        const thisTable = this.$utils.columnRelation(this.constructor.name);
        const relationTable = this._classToTableName(relation.model.name, { singular: true });
        const result = this.$db.get('RESULT');
        try {
            const pivotTable = `${thisTable}_${relationTable}`;
            const success = await new DB_1.DB().table(pivotTable).createMultiple(dataId.map((id) => {
                return {
                    [this._valuePattern(`${relationTable}Id`)]: id,
                    [this._valuePattern(`${thisTable}Id`)]: result.id,
                    ...fields
                };
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
                const success = await new DB_1.DB().table(pivotTable).createMultiple(dataId.map((id) => {
                    return {
                        [this._valuePattern(`${relationTable}Id`)]: id,
                        [this._valuePattern(`${thisTable}Id`)]: result.id,
                        ...fields
                    };
                })).save();
                return success;
            }
            catch (e) {
                throw new Error(e.message);
            }
        }
    }
    async _detach(name, dataId) {
        this._assertError(!Array.isArray(dataId), `this ${dataId} is not an array`);
        const relation = this.$db.get('RELATION').find((data) => data.name === name);
        this._assertError(!relation, `unknown name relation [${name}] in model`);
        const thisTable = this.$utils.columnRelation(this.constructor.name);
        const relationTable = this._classToTableName(relation.model.name, { singular: true });
        const result = this.$db.get('RESULT');
        try {
            const pivotTable = `${thisTable}_${relationTable}`;
            for (const id of dataId) {
                await new DB_1.DB().table(pivotTable)
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
                    await new DB_1.DB().table(pivotTable)
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
    }
    _queryUpdateModel(objects) {
        if (this.$db.get('TIMESTAMP')) {
            const updatedAt = this._valuePattern(this.$db.get('TIMESTAMP_FORMAT').UPDATED_AT);
            objects = { ...objects,
                [updatedAt]: this.$utils.timestamp(),
            };
        }
        const keyValue = Object.entries(objects).map(([column, value]) => {
            return `${column} = ${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return `${this.$constants('SET')} ${keyValue}`;
    }
    _queryInsertModel(objects) {
        const hasTimestamp = this.$db.get('TIMESTAMP');
        if (hasTimestamp) {
            const format = this.$db.get('TIMESTAMP_FORMAT');
            const createdAt = this._valuePattern(format.CREATED_AT);
            const updatedAt = this._valuePattern(format.UPDATED_AT);
            objects = { ...objects,
                [createdAt]: this.$utils.timestamp(),
                [updatedAt]: this.$utils.timestamp(),
            };
        }
        const hasUUID = objects.hasOwnProperty(this.$db.get('UUID_FORMAT'));
        if (this.$db.get('UUID') && !hasUUID) {
            const uuidFormat = this.$db.get('UUID_FORMAT');
            objects = {
                ...objects,
                [uuidFormat]: this.$utils.generateUUID()
            };
        }
        const columns = Object.keys(objects).map((column) => `\`${column}\``);
        const values = Object.values(objects).map((value) => {
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
        let values = [];
        let columns = Object.keys([...data]?.shift()).map((column) => `\`${column}\``);
        for (let objects of data) {
            const hasTimestamp = this.$db.get('TIMESTAMP');
            if (hasTimestamp) {
                const format = this.$db.get('TIMESTAMP_FORMAT');
                const createdAt = this._valuePattern(format.CREATED_AT);
                const updatedAt = this._valuePattern(format.UPDATED_AT);
                objects = { ...objects,
                    [createdAt]: this.$utils.timestamp(),
                    [updatedAt]: this.$utils.timestamp(),
                };
                columns = [
                    ...columns,
                    `\`${createdAt}\``,
                    `\`${updatedAt}\``
                ];
            }
            const hasUUID = objects.hasOwnProperty(this.$db.get('UUID_FORMAT'));
            if (this.$db.get('UUID') && !hasUUID) {
                const uuidFormat = this.$db.get('UUID_FORMAT');
                objects = {
                    ...objects,
                    [uuidFormat]: this.$utils.generateUUID()
                };
                columns = [
                    ...columns,
                    `\`${uuidFormat}\``
                ];
            }
            const v = Object.values(objects).map((value) => {
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
    _registry(func) {
        if (Object.keys(this.$db.get('REGISTRY'))?.length) {
            func?.forEach((fn) => {
                for (const name in this.$db.get('REGISTRY')) {
                    const registry = this.$db.get('REGISTRY');
                    fn[name] = registry[name];
                }
            });
        }
        return this;
    }
    async _insertNotExistsModel() {
        this._assertError(!this.$db.get('WHERE'), "can't insert [insertNotExists] without where condition");
        let sql = [
            `${this.$constants('SELECT')}`,
            `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
            `*`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`,
            `${this.$constants('LIMIT')} 1)`,
            `${this.$constants('AS')} 'exists'`
        ].join(' ');
        let check = false;
        const [{ exists: result }] = await this._queryStatementModel(sql);
        check = !!parseInt(result);
        switch (check) {
            case false: {
                const [result, id] = await this._actionStatementModel({
                    sql: this.$db.get('INSERT'),
                    returnId: true
                });
                if (result) {
                    const sql = [
                        `${this.$db.get('SELECT')}`,
                        `${this.$db.get('FROM')}`,
                        `${this.$db.get('TABLE_NAME')}`,
                        `${this.$constants('WHERE')} id = ${id}`
                    ].join(' ');
                    const data = await this._queryStatementModel(sql);
                    return data?.shift() || null;
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
    }
    async _createModel() {
        const [result, id] = await this._actionStatementModel({
            sql: this.$db.get('INSERT'),
            returnId: true
        });
        if (this.$db.get('VOID'))
            return Promise.resolve();
        if (result) {
            const sql = [
                `${this.$db.get('SELECT')}`,
                `${this.$db.get('FROM')}`,
                `${this.$db.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')} id = ${id}`
            ].join(' ');
            const data = await this._queryStatementModel(sql);
            const result = data?.shift() || null;
            this.$db.set('RESULT', result);
            return result;
        }
        return null;
    }
    async _createMultipleModel() {
        const [result, id] = await this._actionStatementModel({
            sql: this.$db.get('INSERT'),
            returnId: true
        });
        if (this.$db.get('VOID'))
            return Promise.resolve();
        if (result) {
            const arrayId = [...Array(result)].map((_, i) => i + id);
            const sql = [
                `${this.$db.get('SELECT')}`,
                `${this.$db.get('FROM')}`,
                `${this.$db.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')} id`,
                `${this.$constants('IN')} (${arrayId})`
            ].join(' ');
            const data = await this._queryStatementModel(sql);
            const resultData = data || null;
            this.$db.set('RESULT', resultData);
            return resultData;
        }
        return null;
    }
    async _updateOrInsertModel() {
        this._assertError(!this.$db.get('WHERE'), "can't update or insert [updateOrInsert] without where condition");
        let sql = '';
        let check = false;
        sql = [
            `${this.$constants('SELECT')}`,
            `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
            `*`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`,
            `${this.$constants('LIMIT')} 1)`,
            `${this.$constants('AS')} 'exists'`
        ].join(' ');
        const [{ exists: result }] = await this._queryStatementModel(sql);
        check = !!Number.parseInt(result);
        switch (check) {
            case false: {
                const [result, id] = await this._actionStatementModel({
                    sql: this.$db.get('INSERT'),
                    returnId: true
                });
                if (this.$db.get('VOID'))
                    return Promise.resolve();
                if (result) {
                    const sql = [
                        `${this.$db.get('SELECT')}`,
                        `${this.$db.get('FROM')}`,
                        `${this.$db.get('TABLE_NAME')}`,
                        `${this.$constants('WHERE')} id = ${id}`
                    ].join(' ');
                    const data = await this._queryStatementModel(sql);
                    const resultData = { ...data?.shift(), action_status: 'insert' } || null;
                    this.$db.set('RESULT', resultData);
                    return resultData;
                }
                return null;
            }
            case true: {
                const result = await this._actionStatementModel({
                    sql: [
                        `${this.$db.get('UPDATE')}`,
                        `${this.$db.get('WHERE')}`
                    ].join(' ')
                });
                if (this.$db.get('VOID'))
                    return Promise.resolve();
                if (result) {
                    const data = await this._queryStatementModel([
                        `${this.$db.get('SELECT')}`,
                        `${this.$db.get('FROM')}`,
                        `${this.$db.get('TABLE_NAME')}`,
                        `${this.$db.get('WHERE')}`
                    ].join(' '));
                    if (data?.length > 1) {
                        for (const val of data) {
                            val.action_status = 'update';
                        }
                        return data || [];
                    }
                    return { ...data?.shift(), action_status: 'update' } || null;
                }
                return null;
            }
            default: {
                return null;
            }
        }
    }
    async _updateModel(ignoreWhere = false) {
        this._assertError(!this.$db.get('WHERE') && !ignoreWhere, "can't update [update] without where condition");
        const [result] = await this._actionStatementModel({ sql: [
                `${this.$db.get('UPDATE')}`,
                `${this.$db.get('WHERE')}`
            ].join(' '), returnId: true });
        if (this.$db.get('VOID'))
            return Promise.resolve();
        if (!result)
            return null;
        const data = await this._queryStatementModel([
            `${this.$db.get('SELECT')}`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`
        ].join(' '));
        if (data?.length > 1)
            return data || [];
        const res = data?.shift() || null;
        this.$db.set('RESULT', res);
        return res;
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
        this.$db.set('RELATION', [...this.$db.get('RELATION'), relation]);
        this.with(nameRelation);
        const r = this.$db.get('WITH').find((data) => data.name === nameRelation);
        this._assertError(r == null, `relation ${nameRelation} not be register !`);
        this._assertError(!Object.values(this.$constants('RELATIONSHIP')).includes(r.relation), `unknown relationship in [${this.$constants('RELATIONSHIP')}] !`);
        return r;
    }
    _initialModel() {
        this.$db = this._setupModel();
        this._tableName();
        return this;
    }
    _setupModel() {
        let db = new Map(Object.entries({ ...this.$constants('MODEL') }));
        return {
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
                db = new Map(Object.entries({ ...data }));
            }
        };
    }
}
exports.Model = Model;
exports.default = Model;
