"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const fs_1 = __importDefault(require("fs"));
const sql_formatter_1 = require("sql-formatter");
const AbstractDatabase_1 = __importDefault(require("./AbstractDatabase"));
const utils_1 = __importDefault(require("../utils"));
const constants_1 = require("../constants");
const DB_1 = __importDefault(require("./DB"));
const connection_1 = require("../connection");
class Database extends AbstractDatabase_1.default {
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
        this.$db.set('PLUCK', column);
        return this;
    }
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    except(...columns) {
        this.$db.set('EXCEPT', columns.length ? columns : ['id']);
        return this;
    }
    /**
     * data will return void
     * @return {this} this
     */
    void() {
        this.$db.set('VOID', true);
        return this;
    }
    /**
     *
     * @param {...string} columns show only colums selected
     * @return {this} this
     */
    only(...columns) {
        this.$db.set('ONLY', columns);
        return this;
    }
    /**
     *
     * @param {string=} column [column=id]
     * @return {this} this
     */
    distinct(column = 'id') {
        this.$db.set('SELECT', [
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
        if (columns?.length)
            select = columns.join(', ');
        this.$db.set('SELECT', `${this.$constants('SELECT')} ${select}`);
        return this;
    }
    /**
     * chunks data from array
     * @param {number} chunk
     * @return {this} this
     */
    chunk(chunk) {
        this.$db.set('CHUNK', chunk);
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
    where(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${operator} '${value}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${operator} '${value}'`
        ].join(' '));
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
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${operator} '${value}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('OR')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${operator} '${value}'`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} sql where column with raw sql
     * @return {this} this
     */
    whereRaw(sql) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${sql}`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${sql}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} query where column with raw sql
     * @return {this} this
     */
    orWhereRaw(sql) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${sql}`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('OR')}`,
            `${sql}`
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
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${tableAndLocalKey} = ${tableAndForeignKey}`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
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
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this.$constants('EXISTS')}`,
                `(${sql})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this.$constants('EXISTS')}`,
            `(${sql})`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {number} id
     * @param {string?} column custom it *if column is not id
     * @return {this} this
     */
    whereId(id, column = 'id') {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} = '${id}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} = '${id}'`
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
        email = this.$utils.escape(email);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} = '${email}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} = '${email}'`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {number} id
     * @param {string?} column custom it *if column is not user_id
     * @return {this}
     */
    whereUser(id, column = 'user_id') {
        id = this.$utils.escape(id);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} = '${id}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} = '${id}'`
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
            array = ['0'];
        const values = `${array.map((value) => `\'${value}\'`).join(',')}`;
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${values})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${values})`
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
        const sql = this.$db.get('WHERE');
        if (!Array.isArray(array))
            throw new Error(`[${array}] is't array`);
        if (!array.length)
            array = ['0'];
        const values = `${array.map((value) => `\'${value}\'`).join(',')}`;
        if (!sql.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${values})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('OR')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${values})`
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
        const sql = this.$db.get('WHERE');
        if (!Array.isArray(array))
            throw new Error(`[${array}] is't array`);
        if (!array.length)
            array = ['0'];
        const values = `${array.map((value) => `\'${value}\'`).join(',')}`;
        if (!sql.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('NOT_IN')} (${values})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('NOT_IN')} (${values})`
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
        const whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils.escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${subQuery})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${subQuery})`
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
        const whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils.escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${subQuery})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('NOT_IN')} (${subQuery})`
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
        const whereSubQuery = this.$db.get('WHERE');
        subQuery = this.$utils.escapeSubQuery(subQuery);
        if (!whereSubQuery.includes(this.$constants('WHERE'))) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${subQuery})`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('OR')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IN')} (${subQuery})`
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
            array = ['0', '0'];
        let [value1, value2] = array;
        value1 = this.$utils.escape(value1);
        value2 = this.$utils.escape(value2);
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('BETWEEN')}`,
                `'${value1}' ${this.$constants('AND')} '${value2}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('BETWEEN')}`,
            `'${value1}' ${this.$constants('AND')} '${value2}'`
        ].join(' '));
        return this;
    }
    /**
     * where null using NULL
     * @param {string} column
     * @return {this}
     */
    whereNull(column) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IS_NULL')}`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IS_NULL')}`
        ].join(' '));
        return this;
    }
    /**
     * where not null using NULL
     * @param {string} column
     * @return {this}
     */
    whereNotNull(column) {
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IS_NOT_NULL')}`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `${this._bindTableAndColumnInQueryWhere(column)} ${this.$constants('IS_NOT_NULL')}`
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
        if (!this._queryWhereIsExists()) {
            this.$db.set('WHERE', [
                `${this.$constants('WHERE')}`,
                `BINARY ${this._bindTableAndColumnInQueryWhere(column)} ${operator} '${value}'`
            ].join(' '));
            return this;
        }
        this.$db.set('WHERE', [
            `${this.$db.get('WHERE')}`,
            `${this.$constants('AND')}`,
            `BINARY ${this._bindTableAndColumnInQueryWhere(column)} ${operator} '${value}'`
        ].join(' '));
        return this;
    }
    /**
     * where group query
     * @param {function} callback callback query
     * @return {this}
     */
    whereQuery(callback) {
        const db = new DB_1.default();
        const repository = callback(db);
        if (!(repository instanceof DB_1.default)) {
            throw new Error(`unknown callback query: '[${repository}]'`);
        }
        const where = repository?.$db.get('WHERE') || '';
        if (where === '') {
            throw new Error(`unknown callback query with where condition`);
        }
        if (this._queryWhereIsExists()) {
            const query = where.replace('WHERE', '');
            this.$db.set('WHERE', [
                `${this.$db.get('WHERE')}`,
                `${this.$constants('AND')}`,
                `(${query})`
            ].join(' '));
            return this;
        }
        const query = where.replace('WHERE', '');
        this.$db.set('WHERE', [
            `${this.$constants('WHERE')}`,
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
        this.$db.set('SELECT', `${this.$db.get('SELECT')}, ${query.join(' ')} ${this.$constants('AS')} ${as}`);
        return this;
    }
    /**
     *
     * @param {string} condition
     * @return {this}
     */
    having(condition) {
        this.$db.set('HAVING', condition);
        return this;
    }
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    join(pk, fk) {
        const table = fk.split('.')?.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                `${this.$db.get('JOIN')}`,
                `${this.$constants('INNER_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
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
        const table = fk.split('.')?.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                `${this.$db.get('JOIN')}`,
                `${this.$constants('RIGHT_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
            `${this.$constants('RIGHT_JOIN')}`,
            `${table} ${this.$constants('ON')} ${pk} = ${fk}`
        ].join(''));
        return this;
    }
    /**
     *
     * @param {string} pk talbe.pk
     * @param {string} fk talbe.fk
     * @return {this}
     */
    leftJoin(pk, fk) {
        const table = fk.split('.')?.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                `${this.$db.get('JOIN')}`,
                `${this.$constants('LEFT_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
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
        const table = fk.split('.')?.shift();
        if (this.$db.get('JOIN')) {
            this.$db.set('JOIN', [
                `${this.$db.get('JOIN')}`,
                `${this.$constants('CROSS_JOIN')}`,
                `${table} ${this.$constants('ON')} ${pk} = ${fk}`
            ].join(' '));
            return this;
        }
        this.$db.set('JOIN', [
            `${this.$constants('CROSS_JOIN')}`,
            `${table} ${this.$constants('ON')} ${pk} = ${fk}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @return {this}
     */
    orderBy(column, order = this.$constants('ASC')) {
        this.$db.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${column} ${order.toUpperCase()}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string?} column [column=id]
     * @return {this}
     */
    latest(column = 'id') {
        if (this.$db.get('ORDER_BY')) {
            this.$db.set('ORDER_BY', [
                `${this.$db.get('ORDER_BY')}`,
                `,${column} ${this.$constants('DESC')}`
            ].join(' '));
            return this;
        }
        this.$db.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${column} ${this.$constants('DESC')}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string?} column [column=id]
     * @return {this}
     */
    oldest(column = 'id') {
        if (this.$db.get('ORDER_BY')) {
            this.$db.set('ORDER_BY', [
                `${this.$db.get('ORDER_BY')}`,
                `,${column} ${this.$constants('ASC')}`
            ].join(' '));
            return this;
        }
        this.$db.set('ORDER_BY', [
            `${this.$constants('ORDER_BY')}`,
            `${column} ${this.$constants('ASC')}`
        ].join(' '));
        return this;
    }
    /**
     *
     * @param {string?} column [column=id]
     * @return {this}
     */
    groupBy(column = 'id') {
        this.$db.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${column}`);
        return this;
    }
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    limit(number = 1) {
        this.$db.set('LIMIT', `${this.$constants('LIMIT')} ${number}`);
        return this;
    }
    /**
     *
     * @param {number=} number [number=1]
     * @return {this}
     */
    offset(number = 1) {
        this.$db.set('OFFSET', `${this.$constants('OFFSET')} ${number}`);
        return this;
    }
    /**
     *
     * @param {...string} columns
     * @return {this} this
     */
    hidden(...columns) {
        this.$db.set('HIDDEN', columns);
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
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    insert(data) {
        const query = this._queryInsert(data);
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
     * insert data into the database
     * @param {object} data
     * @return {this} this
     */
    create(data) {
        const query = this._queryInsert(data);
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
     * insert muliple data into the database
     * @param {array} data create multiple data
     * @return {this} this this
     */
    createMultiple(data) {
        const query = this._queryInsertMultiple(data);
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
     * @param {array} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data) {
        const query = this._queryInsertMultiple(data);
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
        this.$db.set('DEBUG', debug);
        return this;
    }
    /**
     *
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    dd(debug = true) {
        this.$db.set('DEBUG', debug);
        return this;
    }
    /**
     *
     * @param {object} data create not exists data
     * @return {this} this this
     */
    createNotExists(data) {
        const query = this._queryInsert(data);
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_NOT_EXISTS');
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
     * check data if exists if exists then update. if not exists insert
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrCreate(data) {
        const queryUpdate = this._queryUpdate(data);
        const queryInsert = this._queryInsert(data);
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
        const { host, port, database, username: user, password, ...others } = options;
        const pool = new connection_1.PoolConnection({
            host,
            port,
            database,
            user,
            password,
            ...others
        });
        this.$pool.set(pool.connection());
        return this;
    }
    /**
     *
     * @param {Function} pool pool connection database
     * @return {this} this
     */
    pool(pool) {
        if (!pool?.hasOwnProperty('query')) {
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
        if (!connection?.hasOwnProperty('query')) {
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
    async exceptColumns() {
        const sql = [
            `${this.$constants('SHOW')}`,
            `${this.$constants('COLUMNS')}`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`
        ].join(' ');
        const rawColumns = await this._queryStatement(sql);
        const columns = rawColumns.map((column) => column.Field);
        const removeExcept = columns.filter((column) => !this.$db.get('EXCEPT').includes(column));
        return removeExcept.join(', ');
    }
    /**
     * execute sql statements with raw sql query
     * @param {string} sql sql execute return data
     * @return {promise<any>}
     */
    async rawQuery(sql) {
        return await this._queryStatement(sql);
    }
    /**
     *
     * plus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    async increment(column = 'id', value = 1) {
        const query = `${this.$constants('SET')} ${column} = ${column} + ${value}`;
        this.$db.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        return await this._update(true);
    }
    /**
     *
     * minus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    async decrement(column = 'id', value = 1) {
        const query = `${this.$constants('SET')} ${column} = ${column} - ${value}`;
        this.$db.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        return await this._update(true);
    }
    /**
     * execute data without condition
     * @return {promise<any>}
     */
    async all() {
        return await this._queryStatement([
            `${this.$constants('SELECT')}`,
            `*`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`
        ].join(' '));
    }
    /**
     *
     * execute data with where by id
     * @param {number} id
     * @return {promise<any>}
     */
    async find(id) {
        const result = await this._queryStatement([
            `${this.$constants('SELECT')}`,
            `*`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$constants('WHERE')} id = ${id}`
        ].join(' '));
        return result?.shift() || null;
    }
    /**
     *
     * execute data page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
     */
    async pagination(paginationOptions) {
        let limit = 15;
        let page = 1;
        if (paginationOptions != null) {
            limit = paginationOptions?.limit || limit;
            page = paginationOptions?.page || page;
        }
        const currentPage = page;
        const nextPage = currentPage + 1;
        const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
        const offset = (page - 1) * limit;
        let sql = this._buildQuery();
        if (!sql.includes(this.$constants('LIMIT'))) {
            sql = [
                `${sql}`,
                `${this.$constants('LIMIT')}`,
                `${limit}`,
                `${this.$constants('OFFSET')} ${offset}`
            ].join(' ');
        }
        else {
            sql = sql.replace(this.$db.get('LIMIT'), `${limit} ${this.$constants('OFFSET')} ${offset}`);
        }
        const result = await this._queryStatement(sql);
        if (this.$db.get('HIDDEN')?.length)
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
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('COUNT')}(*)`,
            `${this.$constants('AS')} total`
        ].join(' '));
        sql = this._buildQuery();
        const count = await this._queryStatement(sql);
        const total = count.shift().total || 0;
        let lastPage = Math.ceil(total / limit) || 0;
        lastPage = lastPage > 1 ? lastPage : 1;
        const totalPage = result?.length ?? 0;
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
            data: result ?? []
        };
    }
    /**
     *
     * execute data useing page & limit
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit
     * @param {number} paginationOptions.page
     * @return {promise<Pagination>}
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
     * execute data return object | null
     * @return {promise<object | null>}
     */
    async first() {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        let sql = this._buildQuery();
        if (!sql.includes(this.$constants('LIMIT')))
            sql = `${sql} ${this.$constants('LIMIT')} 1`;
        else
            sql = sql.replace(this.$db.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
        const result = await this._queryStatement(sql);
        if (this.$db.get('HIDDEN')?.length)
            this._hiddenColumn(result);
        if (this.$db.get('PLUCK')) {
            const pluck = this.$db.get('PLUCK');
            const newData = result?.shift();
            const checkProperty = newData.hasOwnProperty(pluck);
            if (!checkProperty)
                throw new Error(`can't find property '${pluck}' of result`);
            return newData[pluck] || null;
        }
        return result?.shift() || null;
    }
    /**
     *
     * execute data return object | throw rror
     * @return {promise<object | null>}
     */
    async findOne() {
        return await this.first();
    }
    /**
     *
     * execute data return object | throw Error
     * @return {promise<object | Error>}
     */
    async firstOrError(message, options) {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        let sql = this._buildQuery();
        if (!sql.includes(this.$constants('LIMIT')))
            sql = `${sql} ${this.$constants('LIMIT')} 1`;
        else
            sql = sql.replace(this.$db.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
        const result = await this._queryStatement(sql);
        if (this.$db.get('HIDDEN')?.length)
            this._hiddenColumn(result);
        if (this.$db.get('PLUCK')) {
            const pluck = this.$db.get('PLUCK');
            const newData = result?.shift();
            const checkProperty = newData.hasOwnProperty(pluck);
            if (!checkProperty)
                throw new Error(`can't find property '${pluck}' of result`);
            const data = newData[pluck] || null;
            if (data == null) {
                if (options == null) {
                    throw { message, code: 400 };
                }
                throw { message, ...options };
            }
            return data;
        }
        const data = result?.shift() || null;
        if (data == null) {
            if (options == null) {
                throw { message, code: 400 };
            }
            throw { message, ...options };
        }
        return data;
    }
    /**
     *
     * execute data return object | null
     * @return {promise<object | null>}
     */
    async findOneOrError(message, options) {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        let sql = this._buildQuery();
        if (!sql.includes(this.$constants('LIMIT')))
            sql = `${sql} ${this.$constants('LIMIT')} 1`;
        else
            sql = sql.replace(this.$db.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
        const result = await this._queryStatement(sql);
        if (this.$db.get('HIDDEN')?.length)
            this._hiddenColumn(result);
        if (this.$db.get('PLUCK')) {
            const pluck = this.$db.get('PLUCK');
            const newData = result?.shift();
            const checkProperty = newData.hasOwnProperty(pluck);
            if (!checkProperty)
                throw new Error(`can't find property '${pluck}' of result`);
            return newData[pluck] || null;
        }
        return result?.shift() || null;
    }
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    async get() {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        if (this.$db.get('HIDDEN')?.length)
            this._hiddenColumn(result);
        if (this.$db.get('CHUNK')) {
            const data = result.reduce((resultArray, item, index) => {
                const chunkIndex = Math.floor(index / this.$db.get('CHUNK'));
                if (!resultArray[chunkIndex])
                    resultArray[chunkIndex] = [];
                resultArray[chunkIndex].push(item);
                return resultArray;
            }, []);
            return data || [];
        }
        if (this.$db.get('PLUCK')) {
            const pluck = this.$db.get('PLUCK');
            const newData = result.map((d) => d[pluck]);
            if (newData.every((d) => d == null)) {
                throw new Error(`can't find property '${pluck}' of result`);
            }
            return newData || [];
        }
        return result || [];
    }
    /**
     *
     * execute data return Array
     * @return {promise<Array<any>>}
     */
    async findMany() {
        return await this.get();
    }
    /**
     *
     * execute data return json of result
     * @return {promise<string>}
     */
    async toJSON() {
        if (this.$db.get('EXCEPT')?.length)
            this.select(await this.exceptColumns());
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        if (this.$db.get('HIDDEN')?.length)
            this._hiddenColumn(result);
        return JSON.stringify(result);
    }
    /**
     *
     * execute data return array of results
     * @param {string=} column [column=id]
     * @return {promise<Array>}
     */
    async toArray(column = 'id') {
        this.$db.set('SELECT', `${this.$constants('SELECT')} ${column}`);
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        const toArray = result.map((data) => data[column]);
        return toArray;
    }
    /**
     *
     * execute data return number of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    async count(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('COUNT')}(${column})`,
            `${this.$constants('AS')} total`
        ].join(' '));
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        return result?.shift()?.total || 0;
    }
    /**
     *
     * execute data return result is exists
     * @return {promise<boolean>}
     */
    async exists() {
        const result = await this._queryStatement([
            `${this.$constants('SELECT')}`,
            `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
            `*`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`,
            `${this.$constants('LIMIT')} 1) ${this.$constants('AS')} 'exists'`
        ].join(' '));
        return !!result?.shift()?.exists || false;
    }
    /**
     *
     * execute data return average of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    async avg(column = 'id') {
        this.$db.set('SELECT', [
            `${this.$constants('SELECT')}`,
            `${this.$constants('AVG')}(${column})`,
            `${this.$constants('AS')} avg`
        ].join(' '));
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        return result?.shift()?.avg || 0;
    }
    /**
     *
     * execute data return summary of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    async sum(column = 'id') {
        this.$db.set('SELECT', `${this.$constants('SELECT')} ${this.$constants('SUM')}(${column}) ${this.$constants('AS')} sum`);
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        return result?.shift()?.sum || 0;
    }
    /**
     *
     * execute data return maximum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    async max(column = 'id') {
        this.$db.set('SELECT', `${this.$constants('SELECT')} ${this.$constants('MAX')}(${column}) ${this.$constants('AS')} max`);
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        return result?.shift()?.max || 0;
    }
    /**
     *
     * execute data return minimum of results
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    async min(column = 'id') {
        this.$db.set('SELECT', `${this.$constants('SELECT')} ${this.$constants('MIN')}(${column}) ${this.$constants('AS')} min`);
        const sql = this._buildQuery();
        const result = await this._queryStatement(sql);
        return result?.shift()?.min || 0;
    }
    /**
     *
     * delete data from database
     * @return {promise<boolean>}
     */
    async delete() {
        if (!this.$db.get('WHERE')) {
            throw new Error("can't delete without where condition");
        }
        this.$db.set('DELETE', [
            `${this.$constants('DELETE')}`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`
        ].join(' '));
        const result = await this._actionStatement({ sql: this.$db.get('DELETE') });
        if (result)
            return !!result ?? false;
        return false;
    }
    /**
     *
     * delete data from database ignore where condition
     * @return {promise<boolean>}
     */
    async forceDelete() {
        this.$db.set('DELETE', [
            `${this.$constants('DELETE')}`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`
        ].join(' '));
        const result = await this._actionStatement({ sql: this.$db.get('DELETE') });
        if (result)
            return !!result ?? false;
        return false;
    }
    /**
     *
     * execute data return Array *grouping results in column
     * @param {string} column
     * @return {promise<Array>}
     */
    async getGroupBy(column) {
        this.$db.set('GROUP_BY', `${this.$constants('GROUP_BY')} ${column}`);
        this.$db.set('SELECT', [
            `${this.$db.get('SELECT')}`,
            `, ${this.$constants('GROUP_CONCAT')}(id)`,
            `${this.$constants('AS')} data`
        ].join(' '));
        const sql = this._buildQuery();
        const results = await this._queryStatement(sql);
        let data = [];
        results.forEach((result) => {
            const splits = result?.data?.split(',') ?? '0';
            splits.forEach((split) => data = [...data, split]);
        });
        const sqlGroups = [
            `${this.$constants('SELECT')}`,
            `*`,
            `${this.$constants('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$constants('WHERE')} id ${this.$constants('IN')}`,
            `(${data.map((a) => `\'${a}\'`).join(',') || ['0']})`
        ].join(' ');
        const groups = await this._queryStatement(sqlGroups);
        const resultData = results.map((result) => {
            const id = result[column];
            const newData = groups.filter((data) => data[column] === id);
            return ({
                [column]: id,
                data: newData
            });
        });
        return resultData;
    }
    /**
     *
     * execute data return grouping results by index
     * @param {string} column
     * @return {promise<Array>}
     */
    async findManyGroupBy(column) {
        return await this.getGroupBy(column);
    }
    /**
     * execute data when save *action [insert , update]
     * @return {Promise<any>} promise
     */
    async save() {
        const attributes = this.$attributes;
        if (Object.keys(attributes)?.length) {
            while (true) {
                if (this.$db.get('WHERE')) {
                    const query = this._queryUpdate(attributes);
                    this.$db.set('UPDATE', [
                        `${this.$constants('UPDATE')}`,
                        `${this.$db.get('TABLE_NAME')}`,
                        `${query}`
                    ].join(' '));
                    this.$db.set('SAVE', 'UPDATE');
                    break;
                }
                const query = this._queryInsert(attributes);
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
            case 'INSERT_MULTIPLE': return await this._createMultiple();
            case 'INSERT': return await this._create();
            case 'UPDATE': return await this._update();
            case 'INSERT_NOT_EXISTS': return await this._insertNotExists();
            case 'UPDATE_OR_INSERT': return await this._updateOrInsert();
        }
    }
    /**
     *
     * show columns in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    async showColumns(table = this.$db.get('TABLE_NAME')) {
        const sql = [
            `${this.$constants('SHOW')}`,
            `${this.$constants('COLUMNS')}`,
            `${this.$constants('FROM')}`,
            `\`${table.replace(/\`/g, '')}\``
        ].join(' ');
        const rawColumns = await this._queryStatement(sql);
        const columns = rawColumns.map((column) => column.Field);
        return columns;
    }
    /**
     *
     * show schemas in table
     * @param {string=} table [table= current table name]
     * @return {Promise<Array>}
     */
    async showSchemas(table = this.$db.get('TABLE_NAME')) {
        const sql = [
            `${this.$constants('SHOW')}`,
            `${this.$constants('COLUMNS')}`,
            `${this.$constants('FROM')}`,
            `\`${table.replace(/\`/g, '')}\``
        ].join(' ');
        const raw = await this._queryStatement(sql);
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
    }
    /**
     *
     * show values in table
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    async showValues(table = this.$db.get('TABLE_NAME')) {
        const sql = [
            `${this.$constants('SELECT')}`,
            '*',
            `${this.$constants('FROM')}`,
            `\`${table.replace(/\`/g, '')}\``
        ].join(' ');
        const raw = await this._queryStatement(sql);
        const values = raw.map((value) => {
            return `(${Object.values(value).map((v) => {
                return v == null ? 'NULL' : `'${v}'`;
            }).join(',')})`;
        });
        return values;
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
    async backup({ database, to }) {
        const tables = await this._queryStatement('SHOW TABLES');
        let backup = [];
        for (const t of tables) {
            const table = String(Object.values(t).shift());
            const schemas = await this.showSchemas(table);
            const createTableSQL = [
                `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                `\`${database}.${table}\``,
                `(${schemas.join(',')})`,
                `${this.$constants('ENGINE')}`,
            ];
            const values = await this.showValues(table);
            let valueSQL = [];
            if (values.length) {
                const columns = await this.showColumns(table);
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
        await this._queryStatement(`${this.$constants('CREATE_DATABASE_NOT_EXISTS')} \`${database}\``);
        for (const b of backup) {
            await this._queryStatement(b.table);
            if (b.values) {
                await this._queryStatement(b.values);
            }
        }
        return true;
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
    async backupToFile({ filePath, database, connection }) {
        const tables = await this._queryStatement('SHOW TABLES');
        let backup = [];
        for (const t of tables) {
            const table = String(Object.values(t)?.shift());
            const schemas = await this.showSchemas(table);
            const createTableSQL = [
                `${this.$constants('CREATE_TABLE_NOT_EXISTS')}`,
                `\`${table}\``,
                `(${schemas.join(',')})`,
                `${this.$constants('ENGINE')};`,
            ];
            const values = await this.showValues(table);
            let valueSQL = [];
            if (values.length) {
                const columns = await this.showColumns(table);
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
        if (connection != null && Object.keys(connection)?.length)
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
            keywordCase: 'upper',
            linesBetweenQueries: 1,
        }));
        return;
    }
    /**
     *
     * fake data
     * @param {number} rows number of rows
     * @return {promise<any}
     */
    async faker(rows = 1) {
        let data = [];
        for (let row = 0; row < rows; row++) {
            if (this.$db.get('TABLE_NAME') === '' || this.$db.get('TABLE_NAME') == null) {
                throw new Error("unknow this table");
            }
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('FIELDS')}`,
                `${this.$constants('FROM')}`,
                `${this.$db.get('TABLE_NAME')}`
            ].join(' ');
            const fields = await this._queryStatement(sql);
            let columnAndValue = {};
            for (const { Field: field, Type: type } of fields) {
                const passed = field.toLowerCase() === 'id' ||
                    field.toLowerCase() === '_id' ||
                    field.toLowerCase() === 'uuid';
                if (passed)
                    continue;
                columnAndValue = {
                    ...columnAndValue,
                    [field]: this.$utils.faker(type)
                };
            }
            data = [...data, columnAndValue];
        }
        const query = this._queryInsertMultiple(data);
        this.$db.set('INSERT', [
            `${this.$constants('INSERT')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$db.set('SAVE', 'INSERT_MULTIPLE');
        return this.save();
    }
    /**
     *
     * truncate of table
     * @return {promise<boolean>}
     */
    async truncate() {
        const sql = [
            `${this.$constants('TRUNCATE_TABLE')}`,
            `${this.$db.get('TABLE_NAME')}`
        ].join(' ');
        await this._queryStatement(sql);
        return true;
    }
    /**
     *
     * drop of table
     * @return {promise<boolean>}
     */
    async drop() {
        const sql = [
            `${this.$constants('DROP_TABLE')}`,
            `${this.$db.get('TABLE_NAME')}`
        ].join(' ');
        await this._queryStatement(sql);
        return true;
    }
    _queryWhereIsExists() {
        return this.$db.get('WHERE')?.includes(this.$constants('WHERE')) || false;
    }
    _bindTableAndColumnInQueryWhere(column) {
        return `${this.$db.get('TABLE_NAME')}.\`${column}\``;
    }
    async _insertNotExists() {
        if (!this.$db.get('WHERE'))
            throw new Error("Can't insert not exists without where condition");
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
        const [{ exists: result }] = await this._queryStatement(sql);
        const check = !!Number.parseInt(result);
        switch (check) {
            case false: {
                const [result, id] = await this._actionStatement({
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
                    const data = await this._queryStatement(sql);
                    return data?.shift() || null;
                }
                return null;
            }
            case true: {
                if (this.$db.get('VOID'))
                    return Promise.resolve();
                return null;
            }
            default: {
                if (this.$db.get('VOID'))
                    return Promise.resolve();
                return null;
            }
        }
    }
    _setupPool() {
        let pool = connection_1.Pool;
        return {
            load: () => pool,
            get: async (sql) => await pool.query(sql),
            set: (newConnection) => {
                pool = newConnection;
                return;
            }
        };
    }
    async _queryStatement(sql) {
        if (this.$db.get('DEBUG'))
            this.$utils.consoleDebug(sql);
        return await this.$pool.get(sql);
    }
    async _actionStatement({ sql, returnId = false }) {
        try {
            if (this.$db.get('DEBUG'))
                this.$utils.consoleDebug(sql);
            if (returnId) {
                const result = await this.$pool.get(sql);
                return [result.affectedRows, result.insertId];
            }
            const { affectedRows: result } = await this.$pool.get(sql);
            return result;
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async _create() {
        const [result, id] = await this._actionStatement({
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
            const data = await this._queryStatement(sql);
            const result = data?.shift() || null;
            this.$db.set('RESULT', result);
            return result;
        }
        return null;
    }
    async _createMultiple() {
        const [result, id] = await this._actionStatement({
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
            const data = await this._queryStatement(sql);
            const resultData = data || null;
            this.$db.set('RESULT', resultData);
            return resultData;
        }
        return null;
    }
    async _updateOrInsert() {
        if (!this.$db.get('WHERE')) {
            throw new Error("Can't update or insert without where condition");
        }
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
        const [{ exists: result }] = await this._queryStatement(sql);
        check = !!parseInt(result);
        switch (check) {
            case false: {
                const [result, id] = await this._actionStatement({
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
                    const data = await this._queryStatement(sql);
                    const resultData = { ...data?.shift(), action_status: 'insert' } || null;
                    this.$db.set('RESULT', resultData);
                    return resultData;
                }
                return null;
            }
            case true: {
                const result = await this._actionStatement({
                    sql: [
                        `${this.$db.get('UPDATE')}`,
                        `${this.$db.get('WHERE')}`
                    ].join(' ')
                });
                if (this.$db.get('VOID'))
                    return Promise.resolve();
                if (result) {
                    const data = await this._queryStatement([
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
    async _update(ignoreWhere = false) {
        if (!this.$db.get('WHERE') && !ignoreWhere)
            throw new Error("can't update without where condition");
        const result = await this._actionStatement({
            sql: [
                `${this.$db.get('UPDATE')}`, `${this.$db.get('WHERE')}`
            ].join(' ')
        });
        if (this.$db.get('VOID'))
            return Promise.resolve();
        if (!result)
            return null;
        const sql = [
            `${this.$db.get('SELECT')}`,
            `${this.$db.get('FROM')}`,
            `${this.$db.get('TABLE_NAME')}`,
            `${this.$db.get('WHERE')}`
        ].join(' ');
        const data = await this._queryStatement(sql);
        if (data?.length > 1)
            return data || [];
        const res = data?.shift() || null;
        this.$db.set('RESULT', res);
        return res;
    }
    _hiddenColumn(data) {
        const hidden = this.$db.get('HIDDEN');
        if (Object.keys(data)?.length) {
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
            return `${column} = ${value == null || value === 'NULL'
                ? 'NULL'
                : typeof value === 'string' && value.startsWith(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return `${this.$constants('SET')} ${values}`;
    }
    _queryInsert(data) {
        const columns = Object.keys(data).map((column) => `\`${column}\``);
        const values = Object.values(data).map((value) => {
            return `${value == null || value === 'NULL'
                ? 'NULL'
                : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        return [
            `(${columns})`,
            `${this.$constants('VALUES')}`,
            `(${values})`
        ].join(' ');
    }
    _queryInsertMultiple(data) {
        let values = [];
        for (let objects of data) {
            const vals = Object.values(objects).map((value) => {
                return `${value == null || value === 'NULL'
                    ? 'NULL'
                    : typeof value === 'string' && value.includes(this.$constants('RAW'))
                        ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                        : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
            });
            values.push(`(${vals.join(',')})`);
        }
        const columns = Object.keys([...data]?.shift()).map((column) => `\`${column}\``);
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
        return sql.filter(s => s !== '' || s == null).join(' ');
    }
    _setupLogger() {
        let logger = [];
        return {
            get: () => logger,
            set: (data) => {
                logger = [...logger, data];
                return;
            },
            check: (data) => logger.indexOf(data) != -1
        };
    }
    _initialConnection() {
        this.$pool = this._setupPool();
        this.$logger = this._setupLogger();
        this.$utils = utils_1.default;
        this.$constants = (name) => {
            if (!name)
                return constants_1.CONSTANTS;
            if (!constants_1.CONSTANTS.hasOwnProperty(name.toUpperCase()))
                throw new Error(`not found constants : ${name}`);
            return constants_1.CONSTANTS[name.toUpperCase()];
        };
    }
}
exports.Database = Database;
exports.default = Database;
