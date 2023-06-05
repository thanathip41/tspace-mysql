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
exports.Builder = void 0;
const fs_1 = __importDefault(require("fs"));
const sql_formatter_1 = require("sql-formatter");
const AbstractBuilder_1 = require("./AbstractBuilder");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const DB_1 = require("./DB");
const connection_1 = require("../connection");
class Builder extends AbstractBuilder_1.AbstractBuilder {
    constructor() {
        super();
        this._initialConnection();
    }
    /**
     *
     * @param {string} column
     * @return {this}
     */
    pluck(column) {
        this.$state.set('PLUCK', column);
        return this;
    }
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    except(...columns) {
        this.$state.set('EXCEPT', columns.length ? columns : ['id']);
        return this;
    }
    /**
     * data alaways will return void
     * @return {this} this
     */
    void() {
        this.$state.set('VOID', true);
        return this;
    }
    /**
     *
     * @param {...string} columns show only colums selected
     * @return {this} this
     */
    only(...columns) {
        this.$state.set('ONLY', columns);
        return this;
    }
    /**
     *
     * @param {string=} column [column=id]
     * @return {this} this
     */
    distinct(column = 'id') {
        this.$state.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('DISTINCT')}`,
            `${column}`
        ].join(' '));
        return this;
    }
    /**
     * select data form table
     * @param {Array<string>} ...columns
     * @return {this} this
     */
    select(...columns) {
        let select = '*';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            select = columns.map((column) => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '').replace(/'/g, '');
                return `\`${column}\``;
            }).join(', ');
        }
        this.$state.set('SELECT', `${this.$constants('SELECT')} ${select}`);
        return this;
    }
    selectRaw(...columns) {
        let select = '*';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            select = columns.map((column) => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '').replace(/'/g, '');
                return column;
            }).join(', ');
        }
        this.$state.set('SELECT', `${this.$constants('SELECT')} ${select}`);
        return this;
    }
    /**
     * chunks data from array
     * @param {number} chunk
     * @return {this} this
     */
    chunk(chunk) {
        this.$state.set('CHUNK', chunk);
        return this;
    }
    /**
     *
     * @param {string | number | undefined | null | Boolean} condition when condition true will return query callback
     * @return {this} this
     */
    when(condition, callback) {
        if (condition)
            callback(this);
        return this;
    }
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    resetWhere() {
        this.$state.set('WHERE', '');
        return this;
    }
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    where(column, operator, value) {
        if (typeof column === 'object' && column !== null && !Array.isArray(column)) {
            return this.whereObject(column);
        }
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${operator}`,
            `${this._checkValueHasRaw(value)}`
        ].join(' '));
        return this;
    }
    /**
     * where using object operator only '='
     * @param {Object} columns
     * @return {this}
     */
    whereObject(columns) {
        for (const column in columns) {
            const operator = '=';
            const value = this.$utils.escape(columns[column]);
            this.$state.set('WHERE', [
                this._queryWhereIsExists()
                    ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                    : `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)}`,
                `${operator}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' '));
        }
        return this;
    }
    /**
     * if has 2 arguments  default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    orWhere(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('OR')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${operator}`,
            `${this._checkValueHasRaw(value)}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} sql where column with raw sql
     * @return {this} this
     */
    whereRaw(sql) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${sql}`,
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} query where column with raw sql
     * @return {this} this
     */
    orWhereRaw(sql) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('OR')}`
                : `${this.$constants('WHERE')}`,
            `${sql}`,
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} tableAndLocalKey
     * @param {string?} tableAndForeignKey
     * @return {this}
     */
    whereReference(tableAndLocalKey, tableAndForeignKey) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${tableAndLocalKey} = ${tableAndForeignKey}`
        ].join(' '));
        return this;
    }
    /**
     *
     * where exists
     * @param {string} sql
     * @return {this}
     */
    whereExists(sql) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this.$constants('EXISTS')}`,
            `(${sql})`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {number} id
     * @return {this} this
     */
    whereId(id, column = 'id') {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} = ${id}`,
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} email where using email
     * @return {this}
     */
    whereEmail(email) {
        const column = 'email';
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} = ${this.$utils.escape(email)}`,
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {number} userId
     * @param {string?} column custom it *if column is not user_id
     * @return {this}
     */
    whereUser(userId, column = 'user_id') {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} = ${this.$utils.escape(userId)}`,
        ].join(' '));
        return this;
    }
    /**
     * using array value where in value in array
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`[${array}] is't array`);
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')}`,
            `${this.$constants('IN')}`,
            `(${values})`
        ].join(' '));
        return this;
    }
    /**
     * or where in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`[${array}] is't array`);
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('OR')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')}`,
            `${this.$constants('IN')}`,
            `(${values})`
        ].join(' '));
        return this;
    }
    /**
     * where not in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereNotIn(column, array) {
        const sql = this.$state.get('WHERE');
        if (!Array.isArray(array))
            throw new Error(`[${array}] is't array`);
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('NOT_IN')}`,
            `(${values})`
        ].join(' '));
        return this;
    }
    /**
     * where not in data using array values
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereNotIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`[${array}] is't array`);
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('OR')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('NOT_IN')}`,
            `(${values})`
        ].join(' '));
        return this;
    }
    /**
     * where sub query using sub query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereSubQuery(column, subQuery) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('IN')}`,
            `(${this.$utils.escape(subQuery)})`
        ].join(' '));
        return this;
    }
    /**
     * where not sub query using sub query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereNotSubQuery(column, subQuery) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('NOT_IN')}`,
            `(${this.$utils.escape(subQuery)})`
        ].join(' '));
        return this;
    }
    /**
     * or where not sub query using query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereSubQuery(column, subQuery) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('OR')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('IN')}`,
            `(${this.$utils.escape(subQuery)})`
        ].join(' '));
        return this;
    }
    /**
     * or where not sub query using query sql
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereNotSubQuery(column, subQuery) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('OR')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('NOT_IN')}`,
            `(${this.$utils.escape(subQuery)})`
        ].join(' '));
        return this;
    }
    /**
     * where between using [value1, value2]
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereBetween(column, array) {
        if (!Array.isArray(array))
            throw new Error("Value is't array");
        if (!array.length)
            return this;
        const [value1, value2] = array;
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('BETWEEN')}`,
            `'${this.$utils.escape(value1)}' ${this.$constants('AND')} '${this.$utils.escape(value2)}'`
        ].join(' '));
        return this;
    }
    /**
     * where null using NULL
     * @param {string} column
     * @return {this}
     */
    whereNull(column) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('IS_NULL')}`
        ].join(' '));
        return this;
    }
    /**
     * where not null using NULL
     * @param {string} column
     * @return {this}
     */
    whereNotNull(column) {
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `${this._bindTableAndColumnInQueryWhere(column)}`,
            `${this.$constants('IS_NOT_NULL')}`
        ].join(' '));
        return this;
    }
    /**
     * where sensitive (uppercase, lowercase)
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereSensitive(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `BINARY ${this._bindTableAndColumnInQueryWhere(column)}`,
            `${operator}`,
            `${this._checkValueHasRaw(this.$utils.escape(value))}`
        ].join(' '));
        return this;
    }
    /**
     * where Strict (uppercase, lowercase)
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereStrict(column, operator, value) {
        return this.whereSensitive(column, operator, value);
    }
    /**
     * where group query
     * @param {function} callback callback query
     * @return {this}
     */
    whereQuery(callback) {
        var _a;
        const db = new DB_1.DB((_a = this.$state.get('TABLE_NAME')) === null || _a === void 0 ? void 0 : _a.replace(/`/g, ''));
        const repository = callback(db);
        if (!(repository instanceof DB_1.DB)) {
            throw new Error(`unknown callback query: '[${repository}]'`);
        }
        const where = (repository === null || repository === void 0 ? void 0 : repository.$state.get('WHERE')) || '';
        if (where === '')
            return this;
        const query = where.replace('WHERE', '');
        this.$state.set('WHERE', [
            this._queryWhereIsExists()
                ? `${this.$state.get('WHERE')} ${this.$constants('AND')}`
                : `${this.$constants('WHERE')}`,
            `(${query})`
        ].join(' '));
        return this;
    }
    /**
     * select by cases
     * @param {array} cases array object [{ when : 'id < 7' , then : 'id is than under 7'}]
     * @param {string} as
     * @return {this}
     */
    case(cases, as) {
        let query = [this.$constants('CASE')];
        for (let i = 0; i < cases.length; i++) {
            const c = cases[i];
            if (cases.length - 1 === i) {
                if (c.then == null)
                    throw new Error(`can't find then condition`);
                query = [
                    ...query,
                    `${this.$constants('ELSE')} '${c.then}'`,
                    `${this.$constants('END')}`
                ];
                continue;
            }
            if (c.when == null)
                throw new Error(`can't find when condition`);
            if (c.then == null)
                throw new Error(`can't find then condition`);
            query = [
                ...query,
                `${this.$constants('WHEN')} ${c.when} ${this.$constants('THEN')} '${c.then}'`
            ];
        }
        if (query.length <= 1)
            return this;
        this.$state.set('SELECT', `${this.$state.get('SELECT')}, ${query.join(' ')} ${this.$constants('AS')} ${as}`);
        return this;
    }
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    join(pk, fk) {
        var _a;
        const table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$state.get('JOIN')) {
            this.$state.set('JOIN', [
                `${this.$state.get('JOIN')}`,
                `${this.$constants('INNER_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$state.set('JOIN', [
            `${this.$constants('INNER_JOIN')}`,
            `${table} ${this.$constants('ON')} ${pk} = ${fk}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    rightJoin(pk, fk) {
        var _a;
        const table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$state.get('JOIN')) {
            this.$state.set('JOIN', [
                `${this.$state.get('JOIN')}`,
                `${this.$constants('RIGHT_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$state.set('JOIN', [
            `${this.$constants('RIGHT_JOIN')}`,
            `${table} ${this.$constants('ON')} ${pk} = ${fk}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    leftJoin(pk, fk) {
        var _a;
        const table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$state.get('JOIN')) {
            this.$state.set('JOIN', [
                `${this.$state.get('JOIN')}`,
                `${this.$constants('LEFT_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$state.set('JOIN', [
            `${this.$constants('LEFT_JOIN')}`,
            `${table} ${this.$constants('ON')} ${pk} = ${fk}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    crossJoin(pk, fk) {
        var _a;
        const table = (_a = fk.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        if (this.$state.get('JOIN')) {
            this.$state.set('JOIN', [
                `${this.$state.get('JOIN')}`,
                `${this.$constants('CROSS_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$state.set('JOIN', [
            `${this.$constants('CROSS_JOIN')}`,
            `${table} ${this.$constants('ON')} ${pk} = ${fk}`
        ].join(' '));
        return this;
    }
    /**
     * sort the result in ASC or DESC order.
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @return {this}
     */
    orderBy(column, order = this.$constants('ASC')) {
        if (typeof column !== 'string')
            return this;
        if (column.includes(this.$constants('RAW'))) {
            column = column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
            this.$state.set('ORDER_BY', [
                `${this.$constants('ORDER_BY')}`,
                `${column} ${order.toUpperCase()}`
            ].join(' '));
            return this;
        }
        this.$state.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `\`${column}\` ${order.toUpperCase()}`
        ].join(' '));
        return this;
    }
    /**
     * sort the result in ASC or DESC order. can using with raw query
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @return {this}
     */
    orderByRaw(column, order = this.$constants('ASC')) {
        if (column.includes(this.$constants('RAW'))) {
            column = column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
        }
        this.$state.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${column} ${order.toUpperCase()}`
        ].join(' '));
        return this;
    }
    /**
     * sort the result in using DESC for order by.
     * @param {string?} columns [column=id]
     * @return {this}
     */
    latest(...columns) {
        let orderByDefault = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderByDefault = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return `\`${column}\``;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${orderByDefault} ${this.$constants('DESC')}`
        ].join(' '));
        return this;
    }
    /**
     * sort the result in using DESC for order by. can using with raw query
     * @param {string?} columns [column=id]
     * @return {this}
     */
    latestRaw(...columns) {
        let orderByDefault = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderByDefault = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return column;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${orderByDefault} ${this.$constants('DESC')}`
        ].join(' '));
        return this;
    }
    /**
     * sort the result in using ASC for order by.
     * @param {string?} columns [column=id]
     * @return {this}
     */
    oldest(...columns) {
        let orderByDefault = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderByDefault = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return `\`${column}\``;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${orderByDefault} ${this.$constants('ASC')}`
        ].join(' '));
        return this;
    }
    /**
     * sort the result in using ASC for order by. can using with raw query
     * @param {string?} columns [column=id]
     * @return {this}
     */
    oldestRaw(...columns) {
        let orderByDefault = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderByDefault = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return column;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${orderByDefault} ${this.$constants('ASC')}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string?} columns [column=id]
     * @return {this}
     */
    groupBy(...columns) {
        let groupBy = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            groupBy = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return `\`${column}\``;
            }).join(', ');
        }
        this.$state.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${groupBy}`);
        return this;
    }
    /**
    *
    * @param {string?} columns [column=id]
    * @return {this}
    */
    groupByRaw(...columns) {
        let groupBy = 'id';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            groupBy = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return column;
            }).join(', ');
        }
        this.$state.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${groupBy}`);
        return this;
    }
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    having(condition) {
        if (condition.includes(this.$constants('RAW'))) {
            condition = condition === null || condition === void 0 ? void 0 : condition.replace(this.$constants('RAW'), '');
            this.$state.set('HAVING', `${this.$constants('HAVING')} ${condition}`);
            return this;
        }
        this.$state.set('HAVING', `${this.$constants('HAVING')} \`${condition}\``);
        return this;
    }
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    havingRaw(condition) {
        if (condition.includes(this.$constants('RAW'))) {
            condition = condition === null || condition === void 0 ? void 0 : condition.replace(this.$constants('RAW'), '');
        }
        this.$state.set('HAVING', `${this.$constants('HAVING')} ${condition}`);
        return this;
    }
    /**
     *  sort the result in random order.
     * @return {this}
     */
    random() {
        this.$state.set('ORDER_BY', `${this.$constants('ORDER_BY')} ${this.$constants('RAND')}`);
        return this;
    }
    /**
     *  sort the result in random order.
     * @return {this}
     */
    inRandom() {
        return this.random();
    }
    /**
     * limit data
     * @param {number=} number [number=1]
     * @return {this}
     */
    limit(number = 1) {
        this.$state.set('LIMIT', `${this.$constants('LIMIT')} ${number}`);
        return this;
    }
    /**
     * limit data
     * @param {number=} number [number=1]
     * @return {this}
     */
    take(number = 1) {
        return this.limit(number);
    }
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    offset(number = 1) {
        this.$state.set('OFFSET', `${this.$constants('OFFSET')} ${number}`);
        if (!this.$state.get('LIMIT'))
            this.$state.set('LIMIT', `${this.$constants('LIMIT')} ${number}`);
        return this;
    }
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    skip(number = 1) {
        return this.offset(number);
    }
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    hidden(...columns) {
        this.$state.set('HIDDEN', columns);
        return this;
    }
    /**
     *
     * update data in the database
     * @param {object} data
     * @return {this} this
     */
    update(data) {
        const query = this._queryUpdate(data);
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
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    insert(data) {
        const query = this._queryInsert(data);
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
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    create(data) {
        const query = this._queryInsert(data);
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
     * insert muliple data into the database
     * @param {array} data create multiple data
     * @return {this} this this
     */
    createMultiple(data) {
        const query = this._queryInsertMultiple(data);
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
     * @param {array} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data) {
        const query = this._queryInsertMultiple(data);
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
     * @return {string} return sql query
     */
    toString() {
        return this._buildQuery();
    }
    /**
     *
     * @return {string} return sql query
     */
    toSQL() {
        return this._buildQuery();
    }
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    debug(debug = true) {
        this.$state.set('DEBUG', debug);
        return this;
    }
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    dd(debug = true) {
        this.$state.set('DEBUG', debug);
        return this;
    }
    /**
     * hook function when execute returned result to callback function
     * @param {Function} func function for callback result
     * @return {this}
    */
    hook(func) {
        if (typeof func !== "function")
            throw new Error(`this '${func}' is not a function`);
        this.$state.set('HOOK', [...this.$state.get('HOOK'), func]);
        return this;
    }
    /**
     * hook function when execute returned result to callback function
     * @param {Function} func function for callback result
     * @return {this}
    */
    before(func) {
        if (typeof func !== "function")
            throw new Error(`this '${func}' is not a function`);
        this.$state.set('HOOK', [...this.$state.get('HOOK'), func]);
        return this;
    }
    /**
     *
     * @param {object} data create not exists data
     * @return {this} this this
     */
    createNotExists(data) {
        const query = this._queryInsert(data);
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
     * @param {object} data insert not exists data
     * @return {this} this this
     */
    insertNotExists(data) {
        this.createNotExists(data);
        return this;
    }
    /**
     *
     * check data if exists if exists then return result. if not exists insert data
     * @param {object} data insert data
     * @return {this} this this
     */
    createOrSelect(data) {
        const queryInsert = this._queryInsert(data);
        this.$state.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${queryInsert}`
        ].join(' '));
        this.$state.set('SAVE', 'INSERT_OR_SELECT');
        return this;
    }
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrSelect(data) {
        this.createOrSelect(data);
        return this;
    }
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrCreate(data) {
        const queryUpdate = this._queryUpdate(data);
        const queryInsert = this._queryInsert(data);
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
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrInsert(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrUpdate(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * check data if exists if exists then update. if not exists insert
     * @param {object} data create or update data
     * @return {this} this this
     */
    createOrUpdate(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * @param {Object} options options for connection database with credentials
     * @param {string} option.host
     * @param {number} option.port
     * @param {string} option.database
     * @param {string} option.user
     * @param {string} option.password
     * @return {this} this
     */
    connection(options) {
        const { host, port, database, username: user, password } = options, others = __rest(options, ["host", "port", "database", "username", "password"]);
        const pool = new connection_1.PoolConnection(Object.assign({ host,
            port,
            database,
            user,
            password }, others));
        this.$pool.set(pool.connection());
        return this;
    }
    /**
     *
     * @param {Function} pool pool connection database
     * @return {this} this
     */
    pool(pool) {
        if (!(pool === null || pool === void 0 ? void 0 : pool.hasOwnProperty('query'))) {
            throw new Error('pool must have a query property');
        }
        this.$pool.set(pool);
        return this;
    }
    /**
     * make sure this connection has same transaction in pool connection
     * @param {object} connection pool database
     * @return {this} this
     */
    bind(connection) {
        if (!(connection === null || connection === void 0 ? void 0 : connection.hasOwnProperty('query'))) {
            throw new Error('connection must have a query property');
        }
        if (typeof connection.query !== 'function') {
            throw new Error('connection must have a query function');
        }
        this.$pool.set(connection);
        return this;
    }
    /**
     * exceptColumns for method except
     * @return {promise<string>} string
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
            return removeExcept.join(', ');
        });
    }
    /**
     * execute sql statements with raw sql query
     * @param {string} sql sql execute return data
     * @return {promise<any>}
     */
    rawQuery(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryStatement(sql);
        });
    }
    /**
     *
     * plus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    increment(column = 'id', value = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `${this.$constants('SET')} ${column} = ${column} + ${value}`;
            this.$state.set('UPDATE', [
                `${this.$constants('UPDATE')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${query}`
            ].join(' '));
            return yield this._update(true);
        });
    }
    /**
     *
     * minus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    decrement(column = 'id', value = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `${this.$constants('SET')} ${column} = ${column} - ${value}`;
            this.$state.set('UPDATE', [
                `${this.$constants('UPDATE')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${query}`
            ].join(' '));
            return yield this._update(true);
        });
    }
    /**
     * execute data without condition
     * @return {promise<any>}
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryStatement([
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' '));
        });
    }
    /**
     *
     * execute data with where by primary key default = id
     * @param {number} id
     * @return {promise<any>}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.queryStatement([
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')} id = ${id}`
            ].join(' '));
            return (result === null || result === void 0 ? void 0 : result.shift()) || null;
        });
    }
    /**
     *
     * execute data page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit default 15
     * @param {number} paginationOptions.page default 1
     * @return {promise<Pagination>}
     */
    pagination(paginationOptions) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let limit = 15;
            let page = 1;
            if (paginationOptions != null) {
                limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
            }
            const currentPage = page;
            const nextPage = currentPage + 1;
            const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
            const offset = (page - 1) * limit;
            let sql = this._buildQuery();
            sql = sql.replace(this.$state.get('LIMIT'), `${limit} ${this.$constants('OFFSET')} ${offset}`);
            if (!sql.includes(this.$constants('LIMIT'))) {
                sql = [
                    `${sql}`,
                    `${this.$constants('LIMIT')}`,
                    `${limit}`,
                    `${this.$constants('OFFSET')} ${offset}`
                ].join(' ');
            }
            const result = yield this.queryStatement(sql);
            if ((_a = this.$state.get('HIDDEN')) === null || _a === void 0 ? void 0 : _a.length)
                this._hiddenColumn(result);
            if (!result.length)
                return {
                    meta: {
                        total: 0,
                        limit,
                        total_page: 0,
                        current_page: currentPage,
                        last_page: 0,
                        next_page: 0,
                        prev_page: 0
                    },
                    data: []
                };
            this.$state.set('SELECT', [
                `${this.$constants('SELECT')}`,
                `${this.$constants('COUNT')}(*)`,
                `${this.$constants('AS')} total`
            ].join(' '));
            sql = this._buildQuery();
            const count = yield this.queryStatement(sql);
            const total = count.shift().total || 0;
            let lastPage = Math.ceil(total / limit) || 0;
            lastPage = lastPage > 1 ? lastPage : 1;
            const totalPage = (_b = result === null || result === void 0 ? void 0 : result.length) !== null && _b !== void 0 ? _b : 0;
            return {
                meta: {
                    total_page: totalPage,
                    total,
                    limit,
                    current_page: currentPage,
                    last_page: lastPage,
                    next_page: nextPage,
                    prev_page: prevPage
                },
                data: result !== null && result !== void 0 ? result : []
            };
        });
    }
    /**
     *
     * execute data useing page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    paginate(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            let limit = 15;
            let page = 1;
            if (paginationOptions != null) {
                limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
            }
            return yield this.pagination({ limit, page });
        });
    }
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    first() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            this.limit(1);
            let sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            if ((_b = this.$state.get('HIDDEN')) === null || _b === void 0 ? void 0 : _b.length)
                this._hiddenColumn(result);
            if (this.$state.get('PLUCK')) {
                const pluck = this.$state.get('PLUCK');
                const newData = result === null || result === void 0 ? void 0 : result.shift();
                const checkProperty = newData.hasOwnProperty(pluck);
                if (!checkProperty)
                    throw new Error(`can't find property '${pluck}' of result`);
                const r = newData[pluck] || null;
                const hook = this.$state.get('HOOK');
                for (let i in hook)
                    yield hook[i](r);
                return r;
            }
            const r = (result === null || result === void 0 ? void 0 : result.shift()) || null;
            const hook = this.$state.get('HOOK');
            for (let i in hook)
                yield hook[i](r);
            return r;
        });
    }
    /**
     *
     * execute data return object | throw rror
     * @return {promise<object | null>}
     */
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.first();
        });
    }
    /**
     *
     * execute data return object | throw Error
     * @return {promise<object | Error>}
     */
    firstOrError(message, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            let sql = this._buildQuery();
            if (!sql.includes(this.$constants('LIMIT')))
                sql = `${sql} ${this.$constants('LIMIT')} 1`;
            else
                sql = sql.replace(this.$state.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
            const result = yield this.queryStatement(sql);
            if ((_b = this.$state.get('HIDDEN')) === null || _b === void 0 ? void 0 : _b.length)
                this._hiddenColumn(result);
            if (this.$state.get('PLUCK')) {
                const pluck = this.$state.get('PLUCK');
                const newData = result === null || result === void 0 ? void 0 : result.shift();
                const checkProperty = newData.hasOwnProperty(pluck);
                if (!checkProperty)
                    throw new Error(`can't find property '${pluck}' of result`);
                const data = newData[pluck] || null;
                if (data == null) {
                    if (options == null) {
                        throw { message, code: 400 };
                    }
                    throw Object.assign({ message }, options);
                }
                const hook = this.$state.get('HOOK');
                for (let i in hook)
                    yield hook[i](data);
                return data;
            }
            const data = (result === null || result === void 0 ? void 0 : result.shift()) || null;
            if (data == null) {
                if (options == null) {
                    throw { message, code: 400 };
                }
                throw Object.assign({ message }, options);
            }
            const hook = this.$state.get('HOOK');
            for (let i in hook)
                yield hook[i](data);
            return data;
        });
    }
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    findOneOrError(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.firstOrError(message, options);
        });
    }
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    get() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            if ((_b = this.$state.get('HIDDEN')) === null || _b === void 0 ? void 0 : _b.length)
                this._hiddenColumn(result);
            if (this.$state.get('CHUNK')) {
                const data = result.reduce((resultArray, item, index) => {
                    const chunkIndex = Math.floor(index / this.$state.get('CHUNK'));
                    if (!resultArray[chunkIndex])
                        resultArray[chunkIndex] = [];
                    resultArray[chunkIndex].push(item);
                    return resultArray;
                }, []);
                const hook = this.$state.get('HOOK');
                for (let i in hook)
                    yield hook[i](data || []);
                return data || [];
            }
            if (this.$state.get('PLUCK')) {
                const pluck = this.$state.get('PLUCK');
                const newData = result.map((d) => d[pluck]);
                if (newData.every((d) => d == null)) {
                    throw new Error(`can't find property '${pluck}' of result`);
                }
                const hook = this.$state.get('HOOK');
                for (let i in hook)
                    yield hook[i](newData || []);
                return newData || [];
            }
            const hook = this.$state.get('HOOK');
            for (let i in hook)
                yield hook[i](result || []);
            return result || [];
        });
    }
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    findMany() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get();
        });
    }
    /**
     *
     * execute data return json of result
     * @return {promise<string>}
     */
    toJSON() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((_a = this.$state.get('EXCEPT')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(yield this.exceptColumns());
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            if ((_b = this.$state.get('HIDDEN')) === null || _b === void 0 ? void 0 : _b.length)
                this._hiddenColumn(result);
            return JSON.stringify(result);
        });
    }
    /**
     *
     * execute data return array of results
     * @param {string=} column [column=id]
     * @return {promise<Array>}
     */
    toArray(column = 'id') {
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('SELECT', `${this.$constants('SELECT')} ${column}`);
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            const toArray = result.map((data) => data[column]);
            return toArray;
        });
    }
    /**
     *
     * execute data return number of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    count(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('SELECT', [
                `${this.$constants('SELECT')}`,
                `${this.$constants('COUNT')}(${column})`,
                `${this.$constants('AS')} total`
            ].join(' '));
            const sql = this._buildQuery();
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
            const result = yield this.queryStatement([
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
                `*`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`,
                `${this.$constants('LIMIT')} 1) ${this.$constants('AS')} 'exists'`
            ].join(' '));
            return !!((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.exists) || false;
        });
    }
    /**
     *
     * execute data return average of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    avg(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('SELECT', [
                `${this.$constants('SELECT')}`,
                `${this.$constants('AVG')}(${column})`,
                `${this.$constants('AS')} avg`
            ].join(' '));
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.avg) || 0;
        });
    }
    /**
     *
     * execute data return summary of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    sum(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('SELECT', `${this.$constants('SELECT')} ${this.$constants('SUM')}(${column}) ${this.$constants('AS')} sum`);
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.sum) || 0;
        });
    }
    /**
     *
     * execute data return maximum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    max(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('SELECT', `${this.$constants('SELECT')} ${this.$constants('MAX')}(${column}) ${this.$constants('AS')} max`);
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.max) || 0;
        });
    }
    /**
     *
     * execute data return minimum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    min(column = 'id') {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('SELECT', `${this.$constants('SELECT')} ${this.$constants('MIN')}(${column}) ${this.$constants('AS')} min`);
            const sql = this._buildQuery();
            const result = yield this.queryStatement(sql);
            return ((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.min) || 0;
        });
    }
    /**
     *
     * delete data from database
     * @return {promise<boolean>}
     */
    delete() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE')) {
                throw new Error("can't delete without where condition");
            }
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`
            ].join(' '));
            const result = yield this.actionStatement({ sql: this.$state.get('DELETE') });
            if (result)
                return (_a = !!result) !== null && _a !== void 0 ? _a : false;
            return false;
        });
    }
    /**
     *
     * delete data from database ignore where condition
     * @return {promise<boolean>}
     */
    forceDelete() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`
            ].join(' '));
            const result = yield this.actionStatement({ sql: this.$state.get('DELETE') });
            if (result)
                return (_a = !!result) !== null && _a !== void 0 ? _a : false;
            return false;
        });
    }
    /**
     *
     * execute data return Array *grouping results in column
     * @param {string} column
     * @return {promise<Array>}
     */
    getGroupBy(column) {
        return __awaiter(this, void 0, void 0, function* () {
            this.$state.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${column}`);
            this.$state.set('SELECT', [
                `${this.$state.get('SELECT')}`,
                `, ${this.$constants('GROUP_CONCAT')}(id)`,
                `${this.$constants('AS')} data`
            ].join(' '));
            const sql = this._buildQuery();
            const results = yield this.queryStatement(sql);
            let data = [];
            results.forEach((result) => {
                var _a, _b;
                const splits = (_b = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : '0';
                splits.forEach((split) => data = [...data, split]);
            });
            const sqlGroups = [
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')} id ${this.$constants('IN')}`,
                `(${data.map((a) => `\'${a}\'`).join(',') || ['0']})`
            ].join(' ');
            const groups = yield this.queryStatement(sqlGroups);
            const resultData = results.map((result) => {
                const id = result[column];
                const newData = groups.filter((data) => data[column] === id);
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
     * execute data return grouping results by index
     * @param {string} column
     * @return {promise<Array>}
     */
    findManyGroupBy(column) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getGroupBy(column);
        });
    }
    /**
     * execute data when save *action [insert , update]
     * @return {Promise<any>} promise
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const attributes = this.$attributes;
            if (attributes != null) {
                while (true) {
                    if (this.$state.get('WHERE')) {
                        const query = this._queryUpdate(attributes);
                        this.$state.set('UPDATE', [
                            `${this.$constants('UPDATE')}`,
                            `${this.$state.get('TABLE_NAME')}`,
                            `${query}`
                        ].join(' '));
                        this.$state.set('SAVE', 'UPDATE');
                        break;
                    }
                    const query = this._queryInsert(attributes);
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
                case 'INSERT_MULTIPLE': return yield this._insertMultiple();
                case 'INSERT': return yield this._insert();
                case 'UPDATE': return yield this._update();
                case 'INSERT_NOT_EXISTS': return yield this._insertNotExists();
                case 'UPDATE_OR_INSERT': return yield this._updateOrInsert();
                case 'INSERT_OR_SELECT': return yield this._insertOrSelect();
                default: throw new Error(`unknown this [${this.$state.get('SAVE')}]`);
            }
        });
    }
    /**
     *
     * show columns in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    showColumns(table = this.$state.get('TABLE_NAME')) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('COLUMNS')}`,
                `${this.$constants('FROM')}`,
                `\`${table.replace(/\`/g, '')}\``
            ].join(' ');
            const rawColumns = yield this.queryStatement(sql);
            const columns = rawColumns.map((column) => column.Field);
            return columns;
        });
    }
    /**
     *
     * show schemas in table
     * @param {string=} table [table= current table name]
     * @return {Promise<Array>}
     */
    showSchemas(table = this.$state.get('TABLE_NAME')) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('COLUMNS')}`,
                `${this.$constants('FROM')}`,
                `\`${table.replace(/\`/g, '')}\``
            ].join(' ');
            const raw = yield this.queryStatement(sql);
            const schemas = raw.map((r) => {
                const schema = [];
                schema.push(`${r.Field}`);
                schema.push(`${r.Type}`);
                if (r.Null === 'YES') {
                    schema.push(`NULL`);
                }
                if (r.Null === 'NO') {
                    schema.push(`NOT NULL`);
                }
                if (r.Key === 'PRI') {
                    schema.push(`PRIMARY KEY`);
                }
                if (r.Key === 'UNI') {
                    schema.push(`UNIQUE`);
                }
                if (r.Default) {
                    schema.push(`DEFAULT '${r.Default}'`);
                }
                if (r.Extra) {
                    schema.push(`${r.Extra.toUpperCase()}`);
                }
                return schema.join(' ');
            });
            return schemas;
        });
    }
    /**
     *
     * show values in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    showValues(table = this.$state.get('TABLE_NAME')) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SELECT')}`,
                '*',
                `${this.$constants('FROM')}`,
                `\`${table.replace(/\`/g, '')}\``
            ].join(' ');
            const raw = yield this.queryStatement(sql);
            const values = raw.map((value) => {
                return `(${Object.values(value).map((v) => {
                    return v == null ? 'NULL' : `'${v}'`;
                }).join(',')})`;
            });
            return values;
        });
    }
    /**
     *
     * backup this database intro new database same server or to another server
     * @param {Object} backupOptions
     * @param {string} backup.database
     * @param {object?} backup.to
     * @param {string} backup.to.host
     * @param {number} backup.to.port
     * @param {string} backup.to.database
     * @param {string} backup.to.username
     * @param {string} backup.to.password

     * @return {Promise<boolean>}
     */
    backup({ database, to }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tables = yield this.queryStatement('SHOW TABLES');
            let backup = [];
            for (const t of tables) {
                const table = String(Object.values(t).shift());
                const schemas = yield this.showSchemas(table);
                const createTableSQL = [
                    `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                    `\`${database}.${table}\``,
                    `(${schemas.join(',')})`,
                    `${this.$constants('ENGINE')}`,
                ];
                const values = yield this.showValues(table);
                let valueSQL = [];
                if (values.length) {
                    const columns = yield this.showColumns(table);
                    valueSQL = [
                        `${this.$constants('INSERT')}`,
                        `\`${database}.${table}\``,
                        `(${columns.map((column) => `\`${column}\``).join(',')})`,
                        `${this.$constants('VALUES')} ${values.join(',')}`
                    ];
                }
                backup = [
                    ...backup,
                    {
                        table: createTableSQL.join(' '),
                        values: valueSQL.join(' '),
                    }
                ];
            }
            if (to != null && Object.keys(to).length)
                this.connection(to);
            yield this.queryStatement(`${this.$constants('CREATE_DATABASE_NOT_EXISTS')} \`${database}\``);
            for (const b of backup) {
                yield this.queryStatement(b.table);
                if (b.values) {
                    yield this.queryStatement(b.values);
                }
            }
            return true;
        });
    }
    /**
     *
     * backup database intro file
     * @param {Object}  backupOptions
     * @param {string}  backup.database
     * @param {object?} backup.filePath
     * @param {object?} backup.connection
     * @param {string}  backup.connection.host
     * @param {number}  backup.connection.port
     * @param {string}  backup.connection.database
     * @param {string}  backup.connection.username
     * @param {string}  backup.connection.password

     * @return {Promise<boolean>}
     */
    backupToFile({ filePath, database, connection }) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const tables = yield this.queryStatement(this.$constants('SHOW_TABLES'));
            let backup = [];
            for (const t of tables) {
                const table = String((_a = Object.values(t)) === null || _a === void 0 ? void 0 : _a.shift());
                const schemas = yield this.showSchemas(table);
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
                backup = [
                    ...backup,
                    {
                        table: createTableSQL.join(' '),
                        values: valueSQL.join(' ')
                    }
                ];
            }
            if (connection != null && ((_b = Object.keys(connection)) === null || _b === void 0 ? void 0 : _b.length))
                this.connection(connection);
            let sql = [
                `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`,
                `START TRANSACTION;`,
                `SET time_zone = "+00:00";`,
                `${this.$constants('CREATE_DATABASE_NOT_EXISTS')} \`${database}\`;`,
                `USE \`${database}\`;`
            ];
            for (const b of backup) {
                sql = [...sql, b.table];
                if (b.values) {
                    sql = [...sql, b.values];
                }
            }
            fs_1.default.writeFileSync(filePath, (0, sql_formatter_1.format)([...sql, 'COMMIT;'].join('\n'), {
                language: 'spark',
                tabWidth: 2,
                linesBetweenQueries: 1,
            }));
            return;
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
                if (this.$state.get('TABLE_NAME') === '' || this.$state.get('TABLE_NAME') == null) {
                    throw new Error("Unknow this table name");
                }
                let columnAndValue = {};
                for (const { Field: field, Type: type } of fields) {
                    const passed = field.toLowerCase() === 'id' ||
                        field.toLowerCase() === '_id' ||
                        field.toLowerCase() === 'uuid';
                    if (passed)
                        continue;
                    columnAndValue = Object.assign(Object.assign({}, columnAndValue), { [field]: this.$utils.faker(type) });
                }
                data = [...data, columnAndValue];
            }
            const query = this._queryInsertMultiple(data);
            this.$state.set('INSERT', [
                `${this.$constants('INSERT')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${query}`
            ].join(' '));
            this.$state.set('SAVE', 'INSERT_MULTIPLE');
            return this.save();
        });
    }
    /**
     *
     * truncate of table
     * @return {promise<boolean>}
     */
    truncate() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('TRUNCATE_TABLE')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            yield this.queryStatement(sql);
            return true;
        });
    }
    /**
     *
     * drop of table
     * @return {promise<boolean>}
     */
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('DROP_TABLE')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            yield this.queryStatement(sql);
            return true;
        });
    }
    _queryWhereIsExists() {
        var _a;
        return ((_a = this.$state.get('WHERE')) === null || _a === void 0 ? void 0 : _a.includes(this.$constants('WHERE'))) || false;
    }
    _bindTableAndColumnInQueryWhere(column) {
        return `${this.$state.get('TABLE_NAME')}.\`${column}\``;
    }
    _insertNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE'))
                throw new Error("Can't insert not exists without where condition");
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
            const [{ exists: result }] = yield this.queryStatement(sql);
            const check = !!Number.parseInt(result);
            switch (check) {
                case false: {
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
                            `${this.$constants('WHERE')} id = ${id}`
                        ].join(' ');
                        const data = yield this.queryStatement(sql);
                        return (data === null || data === void 0 ? void 0 : data.shift()) || null;
                    }
                    return null;
                }
                default: return null;
            }
        });
    }
    queryStatement(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$state.get('DEBUG'))
                this.$utils.consoleDebug(sql);
            const result = yield this.$pool.query(sql);
            return result;
        });
    }
    actionStatement({ sql, returnId = false }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$state.get('DEBUG'))
                this.$utils.consoleDebug(sql);
            if (returnId) {
                const result = yield this.$pool.query(sql);
                return [result.affectedRows, result.insertId];
            }
            const { affectedRows: result } = yield this.$pool.query(sql);
            return result;
        });
    }
    _insert() {
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
                    `${this.$constants('WHERE')} id = ${id}`
                ].join(' ');
                const data = yield this.queryStatement(sql);
                const result = (data === null || data === void 0 ? void 0 : data.shift()) || null;
                this.$state.set('RESULT', result);
                return result;
            }
            return null;
        });
    }
    _checkValueHasRaw(value) {
        return typeof value === 'string' && value.startsWith(this.$constants('RAW'))
            ? value.replace(`${this.$constants('RAW')} `, '').replace(this.$constants('RAW'), '')
            : `'${value}'`;
    }
    _insertMultiple() {
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
    _insertOrSelect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE')) {
                throw new Error("Can't create or select without where condition");
            }
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
                    if (this.$state.get('VOID'))
                        return null;
                    if (result) {
                        const sql = [
                            `${this.$state.get('SELECT')}`,
                            `${this.$state.get('FROM')}`,
                            `${this.$state.get('TABLE_NAME')}`,
                            `${this.$constants('WHERE')} id = ${id}`
                        ].join(' ');
                        const data = yield this.queryStatement(sql);
                        const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'insert' }) || null;
                        this.$state.set('RESULT', resultData);
                        return resultData;
                    }
                    return null;
                }
                case true: {
                    const data = yield this.queryStatement([
                        `${this.$state.get('SELECT')}`,
                        `${this.$state.get('FROM')}`,
                        `${this.$state.get('TABLE_NAME')}`,
                        `${this.$state.get('WHERE')}`
                    ].join(' '));
                    if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                        for (const val of data) {
                            val.action_status = 'select';
                        }
                        return data || [];
                    }
                    return Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'select' }) || null;
                }
                default: {
                    return null;
                }
            }
        });
    }
    _updateOrInsert() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE')) {
                throw new Error("Can't update or insert without where condition");
            }
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
                    if (this.$state.get('VOID'))
                        return null;
                    if (result) {
                        const sql = [
                            `${this.$state.get('SELECT')}`,
                            `${this.$state.get('FROM')}`,
                            `${this.$state.get('TABLE_NAME')}`,
                            `${this.$constants('WHERE')} id = ${id}`
                        ].join(' ');
                        const data = yield this.queryStatement(sql);
                        const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { action_status: 'insert' }) || null;
                        this.$state.set('RESULT', resultData);
                        return resultData;
                    }
                    return null;
                }
                case true: {
                    const result = yield this.actionStatement({
                        sql: [
                            `${this.$state.get('UPDATE')}`,
                            `${this.$state.get('WHERE')}`
                        ].join(' ')
                    });
                    if (this.$state.get('VOID'))
                        return null;
                    if (result) {
                        const data = yield this.queryStatement([
                            `${this.$state.get('SELECT')}`,
                            `${this.$state.get('FROM')}`,
                            `${this.$state.get('TABLE_NAME')}`,
                            `${this.$state.get('WHERE')}`
                        ].join(' '));
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
    _update(ignoreWhere = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE') && !ignoreWhere)
                throw new Error("can't update without where condition");
            const result = yield this.actionStatement({
                sql: [
                    `${this.$state.get('UPDATE')}`, `${this.$state.get('WHERE')}`
                ].join(' ')
            });
            if (this.$state.get('VOID'))
                return null;
            if (!result)
                return null;
            const sql = [
                `${this.$state.get('SELECT')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$state.get('WHERE')}`
            ].join(' ');
            const data = yield this.queryStatement(sql);
            if ((data === null || data === void 0 ? void 0 : data.length) > 1)
                return data || [];
            const res = (data === null || data === void 0 ? void 0 : data.shift()) || null;
            this.$state.set('RESULT', res);
            return res;
        });
    }
    _hiddenColumn(data) {
        var _a;
        const hidden = this.$state.get('HIDDEN');
        if ((_a = Object.keys(data)) === null || _a === void 0 ? void 0 : _a.length) {
            hidden.forEach((column) => {
                data.forEach((objColumn) => {
                    delete objColumn[column];
                });
            });
        }
        return data;
    }
    _queryUpdate(data) {
        const values = Object.entries(data).map(([column, value]) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW'))))
                value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
            return `\`${column}\` = ${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return `${this.$constants('SET')} ${values}`;
    }
    _queryInsert(data) {
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
        return [
            `(${columns})`,
            `${this.$constants('VALUES')}`,
            `(${values})`
        ].join(' ');
    }
    _queryInsertMultiple(data) {
        var _a;
        let values = [];
        for (let objects of data) {
            const vals = Object.values(objects).map((value) => {
                if (typeof value === 'string')
                    value = value === null || value === void 0 ? void 0 : value.replace(/'/g, '');
                return `${value == null || value === 'NULL'
                    ? 'NULL'
                    : typeof value === 'string' && value.includes(this.$constants('RAW'))
                        ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                        : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
            });
            values.push(`(${vals.join(',')})`);
        }
        const columns = Object.keys((_a = [...data]) === null || _a === void 0 ? void 0 : _a.shift()).map((column) => `\`${column}\``);
        return [
            `(${columns})`,
            `${this.$constants('VALUES')}`,
            `${values.join(',')}`
        ].join(' ');
    }
    _valueAndOperator(value, operator, useDefault = false) {
        if (useDefault)
            return [operator, '='];
        if (operator == null)
            throw new Error('bad arguments');
        if (operator.toUpperCase() === this.$constants('LIKE')) {
            operator = operator.toUpperCase();
        }
        return [value, operator];
    }
    _valueTrueFalse(value) {
        if (value === true)
            return 1;
        if (value === false)
            return 0;
        return value;
    }
    _buildQuery() {
        let sql = [];
        while (true) {
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
        return sql.filter(s => s !== '' || s == null).join(' ');
    }
    _initialConnection() {
        this.$utils = utils_1.utils;
        this.$pool = (() => {
            let pool = connection_1.Pool;
            return {
                query: (sql) => __awaiter(this, void 0, void 0, function* () { return yield pool.query(sql); }),
                get: () => pool,
                set: (newConnection) => {
                    pool = newConnection;
                    return;
                }
            };
        })();
        this.$logger = (() => {
            let logger = [];
            return {
                get: () => logger,
                set: (data) => {
                    logger = [...logger, data];
                    return;
                },
                check: (data) => logger.indexOf(data) != -1
            };
        })();
        this.$constants = (name) => {
            if (name == null)
                return constants_1.CONSTANTS;
            if (!constants_1.CONSTANTS.hasOwnProperty(name.toUpperCase()))
                throw new Error(`not found constants : ${name}`);
            return constants_1.CONSTANTS[name.toUpperCase()];
        };
    }
}
exports.Builder = Builder;
exports.default = Builder;
