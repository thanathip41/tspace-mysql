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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const AbstractBuilder_1 = require("./Abstracts/AbstractBuilder");
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
     * The 'distinct' method is used to apply the DISTINCT keyword to a database query.
     *
     * It allows you to retrieve unique values from one or more columns in the result set, eliminating duplicate rows.
     * @return {this} this
     */
    distinct() {
        this.$state.set('DISTINCT', true);
        return this;
    }
    /**
     * The 'select' method is used to specify which columns you want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be included in the result set of a database query.
     * @param {string[]} ...columns
     * @return {this} this
     */
    select(...columns) {
        if (!columns.length) {
            this.$state.set('SELECT', ['*']);
            return this;
        }
        let select = columns.map((column) => {
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
     * The 'selectRaw' method is used to specify which columns you want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be included in the result set of a database query.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string[]} ...columns
     * @return {this} this
     */
    selectRaw(...columns) {
        if (!columns.length)
            return this;
        let select = columns.map((column) => {
            if (column === '*')
                return column;
            if (column.includes('`*`'))
                return column.replace('`*`', '*');
            if (column.includes(this.$constants('RAW')))
                return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '').replace(/'/g, '');
            return column;
        });
        if (this.$state.get('DISTINCT') && select.length) {
            this.$state.set('SELECT', select);
            return this;
        }
        this.$state.set('SELECT', [...this.$state.get('SELECT'), ...select]);
        return this;
    }
    /**
     * The 'selectObject' method is used to specify which columns you want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be included in the result set to 'Object' of a database query.
     * @param {string} object table name
     * @param {string} alias as name of the column
     * @return {this} this
     */
    selectObject(object, alias) {
        if (!Object.keys(object).length)
            throw new Error("The method 'selectObject' is not supported for empty object");
        let maping = [];
        for (const [key, value] of Object.entries(object)) {
            if (/\./.test(value)) {
                const [table, c] = value.split('.');
                maping = [...maping, `'${key}'`, `\`${table}\`.\`${c}\``];
                continue;
            }
            maping = [...maping, `'${key}'`, `\`${this.getTableName()}\`.\`${value}\``];
        }
        const json = `${this.$constants('JSON_OBJECT')}(${maping.join(' , ')}) ${this.$constants('AS')} \`${alias}\``;
        this.$state.set('SELECT', [...this.$state.get('SELECT'), json]);
        return this;
    }
    /**
     * The 'sleep' method is used to delay the query.
     *
     * @param {number} second - The number of seconds to sleep
     * @return {this} this
     */
    sleep(second) {
        const sql = `SELECT SLEEP(${second}) as sleep`;
        this.$state.set('JOIN', [
            ...this.$state.get('JOIN'), [
                `${this.$constants('INNER_JOIN')}`,
                `(${sql}) ${this.$constants('AS')} temp`,
                `${this.$constants('ON')}`,
                `1=1`
            ]
                .join(' ')
        ]);
        return this;
    }
    /**
     * The 'returnType' method is used covert the results to type 'object' or 'array'.
     *
     * @param {string} type - The types 'object' | 'array'
     * @return {this} this
     */
    returnType(type) {
        this.$state.set('RETURN_TYPE', type);
        return this;
    }
    /**
     * The 'pluck' method is used to retrieve the value of a single column from the first result of a query.
     *
     * It is often used when you need to retrieve a single value,
     * such as an ID or a specific attribute, from a query result.
     * @param {string} column
     * @return {this}
     */
    pluck(column) {
        this.$state.set('PLUCK', column);
        return this;
    }
    /**
     * The 'except' method is used to specify which columns you don't want to retrieve from a database table.
     *
     * It allows you to choose the specific columns that should be not included in the result set of a database query.
     * @param {...string} columns
     * @return {this} this
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
     * The 'exceptTimestamp' method is used to timestamp columns (created_at , updated_at) you don't want to retrieve from a database table.
     *
     * @return {this} this
     */
    exceptTimestamp() {
        this.$state.set('EXCEPTS', ['created_at', 'updated_at']);
        return this;
    }
    /**
     * The 'void' method is used to specify which you don't want to return a result from database table.
     *
     * @return {this} this
     */
    void() {
        this.$state.set('VOID', true);
        return this;
    }
    /**
     * The 'only' method is used to specify which columns you don't want to retrieve from a result.
     *
     * It allows you to choose the specific columns that should be not included in the result.
     * @param {...string} columns show only colums selected
     * @return {this} this
     */
    only(...columns) {
        this.$state.set('ONLY', columns);
        return this;
    }
    /**
     * The 'chunk' method is used to process a large result set from a database query in smaller, manageable "chunks" or segments.
     *
     * It's particularly useful when you need to iterate over a large number of database records without loading all of them into memory at once.
     *
     * This helps prevent memory exhaustion and improves the performance of your application when dealing with large datasets.
     * @param {number} chunk
     * @return {this} this
     */
    chunk(chunk) {
        this.$state.set('CHUNK', chunk);
        return this;
    }
    /**
     * The 'when' method is used to specify if condition should be true will be next to the actions
     * @param {string | number | undefined | null | Boolean} condition when condition true will return query callback
     * @return {this} this
     */
    when(condition, callback) {
        if (!condition)
            return this;
        const cb = callback(this);
        if (cb instanceof Promise)
            throw new Error("'when' is not supported a Promise");
        return this;
    }
    /**
     * The 'where' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * If has only 2 arguments default operator '='
     * @param {string} column if arguments is object
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    where(column, operator, value) {
        if (typeof column === 'object') {
            return this.whereObject(column);
        }
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
                `${this.bindColumn(String(column))}`,
                `${operator}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhere' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * If has only 2 arguments default operator '='
     * @param {string} column
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    orWhere(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
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
                `${this.bindColumn(String(column))}`,
                `${operator}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereRaw' method is used to add a raw SQL condition to a database query.
     *
     * It allows you to include custom SQL expressions as conditions in your query,
     * which can be useful for situations where you need to perform complex or custom filtering that cannot be achieved using Laravel's standard query builder methods.
     * @param {string} sql where column with raw sql
     * @return {this} this
     */
    whereRaw(sql) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${sql}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereRaw' method is used to add a raw SQL condition to a database query.
     *
     * It allows you to include custom SQL expressions as conditions in your query,
     * which can be useful for situations where you need to perform complex or custom filtering that cannot be achieved using Laravel's standard query builder methods.
     * @param {string} sql where column with raw sql
     * @return {this} this
     */
    orWhereRaw(sql) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${sql}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereObject' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions in object that records in the database must meet in order to be included in the result set.
     *
     * This method is defalut operator '=' only
     * @param {Object} columns
     * @return {this}
     */
    whereObject(columns) {
        for (const column in columns) {
            const operator = '=';
            const value = this.$utils.escape(columns[column]);
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                    `${this.bindColumn(String(column))}`,
                    `${operator}`,
                    `${this._checkValueHasRaw(value)}`
                ].join(' ')
            ]);
        }
        return this;
    }
    /**
     * The 'whereJSON' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions in that records json in the database must meet in order to be included in the result set.
     * @param    {string} column
     * @param    {object}  property object { key , value , operator }
     * @property {string}  property.key
     * @property {string}  property.value
     * @property {string?} property.operator
     * @return   {this}
     */
    whereJSON(column, { key, value, operator }) {
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}->>'$.${key}'`,
                `${operator == null ? "=" : operator.toLocaleUpperCase()}`,
                `${this._checkValueHasRaw(value)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereJSON' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions in that records json in the database must meet in order to be included in the result set.
     * @param    {string} column
     * @param    {object}  property object { key , value , operator }
     * @property {string}  property.key
     * @property {string}  property.value
     * @property {string?} property.operator
     * @return   {this}
     */
    whereJson(column, { key, value, operator }) {
        return this.whereJSON(column, { key, value, operator });
    }
    /**
     *
     * The 'whereExists' method is used to add a conditional clause to a database query that checks for the existence of related records in a subquery or another table.
     *
     * It allows you to filter records based on whether a specified condition is true for related records.
     * @param {string} sql
     * @return {this}
     */
    whereExists(sql) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.$constants('EXISTS')}`,
                `(${sql})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     *
     * The 'whereExists' method is used to add a conditional clause to a database query that checks for the existence of related records in a subquery or another table.
     *
     * It allows you to filter records based on whether a specified condition is true for related records.
     * @param {string} sql
     * @return {this}
     */
    whereNotExists(sql) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.$constants('NOT')} ${this.$constants('EXISTS')}`,
                `(${sql})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     *
     * @param {number} id
     * @return {this} this
     */
    whereId(id, column = 'id') {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)} = ${this.$utils.escape(id)}`,
            ].join(' ')
        ]);
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
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)} = ${this.$utils.escape(email)}`,
            ].join(' ')
        ]);
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
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)} = ${this.$utils.escape(userId)}`,
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereIn' method is used to add a conditional clause to a database query that checks if a specified column's value is included in a given array of values.
     *
     * This method is useful when you want to filter records based on a column matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`This 'whereIn' method is required array only`);
        const values = array.length
            ? `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`
            : this.$constants(this.$constants('NULL'));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereIn' method is used to add a conditional clause to a database query that checks if a specified column's value is included in a given array of values.
     *
     * This method is useful when you want to filter records based on a column matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`This 'orWhereIn' method is required array only`);
        const values = array.length
            ? `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`
            : this.$constants(this.$constants('NULL'));
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereNotIn' method is used to add a conditional clause to a database query that checks if a specified column's value is not included in a given array of values.
     *
     * This method is the opposite of whereIn and is useful when you want to filter records based on a column not matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereNotIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`This 'whereNotIn' method is required array only`);
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('NOT_IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereNotIn' method is used to add a conditional clause to a database query that checks if a specified column's value is not included in a given array of values.
     *
     * This method is the opposite of whereIn and is useful when you want to filter records based on a column not matching any of the values provided in an array.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereNotIn(column, array) {
        if (!Array.isArray(array))
            throw new Error(`This 'orWhereNotIn' method is required array only`);
        if (!array.length)
            return this;
        const values = `${array.map((value) => this._checkValueHasRaw(this.$utils.escape(value))).join(',')}`;
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('NOT_IN')}`,
                `(${values})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery))
            throw new Error(`This "${subQuery}" is invalid. Sub query is should contain 1 column(s)`);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereNotSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve not some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    whereNotSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery))
            throw new Error(`This "${subQuery}" is invalid. Sub query is should contain 1 column(s)`);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('NOT_IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery))
            throw new Error(`This "${subQuery}" is invalid. Sub query is should contain 1 column(s)`);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereNotSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
     *
     * Subqueries also known as nested queries, are queries that are embedded within the main query.
     *
     * They are often used when you need to perform a query to retrieve not some values and then use those values as part of the condition in the main query.
     * @param {string} column
     * @param {string} subQuery
     * @return {this}
     */
    orWhereNotSubQuery(column, subQuery) {
        if (!this.$utils.isSubQuery(subQuery))
            throw new Error(`This "${subQuery}" is invalid sub query (Sub query Operand should contain 1 column(s) not select * )`);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('NOT_IN')}`,
                `(${subQuery})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value being within a certain numeric or date range.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereBetween(column, array) {
        if (!Array.isArray(array))
            throw new Error("Value is't array");
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                    `${this.bindColumn(column)}`,
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
                `${this.bindColumn(column)}`,
                `${this.$constants('BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value being within a certain numeric or date range.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereBetween(column, array) {
        if (!Array.isArray(array))
            throw new Error("Value is't array");
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                    `${this.bindColumn(column)}`,
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
                `${this.bindColumn(column)}`,
                `${this.$constants('BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereNotBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value does not fall within a specified range of values.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    whereNotBetween(column, array) {
        if (!Array.isArray(array))
            throw new Error("Value is't array");
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                    `${this.bindColumn(column)}`,
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
                `${this.bindColumn(column)}`,
                `${this.$constants('NOT_BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereNotBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
     *
     * This method is useful when you want to filter records based on a column's value does not fall within a specified range of values.
     * @param {string} column
     * @param {array} array
     * @return {this}
     */
    orWhereNotBetween(column, array) {
        if (!Array.isArray(array))
            throw new Error("Value is't array");
        if (!array.length) {
            this.$state.set('WHERE', [
                ...this.$state.get('WHERE'),
                [
                    this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                    `${this.bindColumn(column)}`,
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
                `${this.bindColumn(column)}`,
                `${this.$constants('NOT_BETWEEN')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
                `${this.$constants('AND')}`,
                `${this._checkValueHasRaw(this.$utils.escape(value2))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereNull' method is used to add a conditional clause to a database query that checks if a specified column's value is NULL.
     *
     * This method is helpful when you want to filter records based on whether a particular column has a NULL value.
     * @param {string} column
     * @return {this}
     */
    whereNull(column) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IS_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereNull' method is used to add a conditional clause to a database query that checks if a specified column's value is NULL.
     *
     * This method is helpful when you want to filter records based on whether a particular column has a NULL value.
     * @param {string} column
     * @return {this}
     */
    orWhereNull(column) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IS_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereNotNull' method is used to add a conditional clause to a database query that checks if a specified column's value is not NULL.
     *
     * This method is useful when you want to filter records based on whether a particular column has a non-null value.
     * @param {string} column
     * @return {this}
     */
    whereNotNull(column) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IS_NOT_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereNotNull' method is used to add a conditional clause to a database query that checks if a specified column's value is not NULL.
     *
     * This method is useful when you want to filter records based on whether a particular column has a non-null value.
     * @param {string} column
     * @return {this}
     */
    orWhereNotNull(column) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.bindColumn(column)}`,
                `${this.$constants('IS_NOT_NULL')}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereSensitive' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * The where method is need to perform a case-sensitive comparison in a query.
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
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${this.$constants('BINARY')}`,
                `${this.bindColumn(column)}`,
                `${operator}`,
                `${this._checkValueHasRaw(this.$utils.escape(value))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereStrict' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * The where method is need to perform a case-sensitive comparison in a query.
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    whereStrict(column, operator, value) {
        return this.whereSensitive(column, operator, value);
    }
    /**
     * The 'orWhereSensitive' method is used to add conditions to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * The where method is need to perform a case-sensitive comparison in a query.
     * @param {string} column
     * @param {string?} operator = < > != !< !>
     * @param {any?} value
     * @return {this}
     */
    orWhereSensitive(column, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `${this.$constants('BINARY')}`,
                `${this.bindColumn(column)}`,
                `${operator}`,
                `${this._checkValueHasRaw(this.$utils.escape(value))}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereQuery' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {Function} callback callback query
     * @return {this}
     */
    whereQuery(callback) {
        var _a;
        const db = new DB_1.DB((_a = this.$state.get('TABLE_NAME')) === null || _a === void 0 ? void 0 : _a.replace(/`/g, ''));
        const repository = callback(db);
        if (repository instanceof Promise)
            throw new Error('"whereQuery" is not supported a Promise');
        if (!(repository instanceof DB_1.DB))
            throw new Error(`Unknown callback query: '${repository}'`);
        const where = (repository === null || repository === void 0 ? void 0 : repository.$state.get('WHERE')) || [];
        if (!where.length)
            return this;
        const query = where.join(' ');
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `(${query})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'whereGroup' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {function} callback callback query
     * @return {this}
     */
    whereGroup(callback) {
        return this.whereQuery(callback);
    }
    /**
     * The 'orWhereQuery' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {function} callback callback query
     * @return {this}
     */
    orWhereQuery(callback) {
        var _a;
        const db = new DB_1.DB((_a = this.$state.get('TABLE_NAME')) === null || _a === void 0 ? void 0 : _a.replace(/`/g, ''));
        const repository = callback(db);
        if (repository instanceof Promise)
            throw new Error('"whereQuery" is not supported a Promise');
        if (!(repository instanceof DB_1.DB))
            throw new Error(`Unknown callback query: '[${repository}]'`);
        const where = (repository === null || repository === void 0 ? void 0 : repository.$state.get('WHERE')) || [];
        if (!where.length)
            return this;
        const query = where.join(' ');
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                `(${query})`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereGroup' method is used to add conditions to a database query to create a grouped condition.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     * @param {function} callback callback query
     * @return {this}
     */
    orWhereGroup(callback) {
        return this.orWhereQuery(callback);
    }
    /**
     * The 'whereAny' method is used to add conditions to a database query,
     * where either the original condition or the new condition must be true.
     *
     * If has only 2 arguments default operator '='
     * @param {string[]} columns
     * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
     * @param {any?} value
     * @return {this}
     */
    whereAny(columns, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.whereQuery((query) => {
            for (const index in columns) {
                const column = columns[index];
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
     * @return {this}
     */
    whereAll(columns, operator, value) {
        [value, operator] = this._valueAndOperator(value, operator, arguments.length === 2);
        value = this.$utils.escape(value);
        value = this._valueTrueFalse(value);
        this.whereQuery((query) => {
            for (const column of columns)
                query.where(column, operator, value);
            return query;
        });
        return this;
    }
    /**
     * The 'whereCases' method is used to add conditions with cases to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * @param {Array<{when , then}>} cases used to add conditions when and then
     * @param {string?} elseCase else when end of conditions
     * @return {this}
     */
    whereCases(cases, elseCase) {
        if (!cases.length)
            return this;
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
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                [
                    this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                    '(',
                    this.$constants('CASE'),
                    query.join(' '),
                    elseCase == null ? '' : `ELSE ${elseCase}`,
                    this.$constants('END'),
                    ')'
                ].join(' ')
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orWhereCases' method is used to add conditions with cases to a database query.
     *
     * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
     *
     * @param {Array<{when , then}>} cases used to add conditions when and then
     * @param {string?} elseCase else when end of conditions
     * @return {this}
     */
    orWhereCases(cases, elseCase) {
        if (!cases.length)
            return this;
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
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                [
                    this.$state.get('WHERE').length ? `${this.$constants('OR')}` : '',
                    '(',
                    this.$constants('CASE'),
                    query.join(' '),
                    elseCase == null ? '' : `ELSE ${elseCase}`,
                    this.$constants('END'),
                    ')'
                ].join(' ')
            ].join(' ')
        ]);
        return this;
    }
    /**
     * select by cases
     * @param {array} cases array object [{ when : 'id < 7' , then : 'id is than under 7'}]
     * @param {string} as assign name
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
        this.$state.set('SELECT', [...this.$state.get('SELECT'), `${query.join(' ')} ${this.$constants('AS')} ${as}`]);
        return this;
    }
    /**
     * The 'join' method is used to perform various types of SQL joins between two or more database tables.
     *
     * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @example
     * await new DB('users')
     * .select('users.id as userId','posts.id as postId','email')
     * .join('users.id','posts.id')
     * .join('posts.category_id','categories.id')
     * .where('users.id',1)
     * .where('posts.id',2)
     * .get()
     * @return {this}
     */
    join(localKey, referenceKey) {
        var _a;
        const table = (_a = referenceKey.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        this.$state.set('JOIN', [
            ...this.$state.get('JOIN'),
            [
                `${this.$constants('INNER_JOIN')}`,
                `\`${table}\` ${this.$constants('ON')}`,
                `${this.bindColumn(localKey)} = ${this.bindColumn(referenceKey)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
    * The 'join' method is used to perform various types of SQL joins between two or more database tables.
    *
    * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
    * @param    {object}  property object { localKey , foreignKey , sqlr }
    * @property {string} property.localKey local key in current table
    * @property {string} property.foreignKey reference key in next table
    * @property {string} property.sql sql string
    * @example
    * await new DB('users')
    * .joinSubQuery({ localKey : 'id' , foreignKey : 'userId' , sql : '....sql'})
    * .get()
    * @return {this}
    */
    joinSubQuery({ localKey, foreignKey, sql }) {
        this.$state.set('JOIN', [
            ...this.$state.get('JOIN'),
            [
                `${this.$constants('INNER_JOIN')}`,
                `(${sql}) as subquery`,
                `${this.$constants('ON')}`,
                `${this.bindColumn(localKey)} = subquery.\`${foreignKey}\``
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'rightJoin' method is used to perform a right join operation between two database tables.
     *
     * A right join, also known as a right outer join, retrieves all rows from the right table and the matching rows from the left table.
     *
     * If there is no match in the left table, NULL values are returned for columns from the left table
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @return {this}
     */
    rightJoin(localKey, referenceKey) {
        var _a;
        const table = (_a = referenceKey.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        this.$state.set('JOIN', [
            ...this.$state.get('JOIN'),
            [
                `${this.$constants('RIGHT_JOIN')}`,
                `\`${table}\` ${this.$constants('ON')}`,
                `${this.bindColumn(localKey)} = ${this.bindColumn(referenceKey)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'leftJoin' method is used to perform a left join operation between two database tables.
     *
     * A left join retrieves all rows from the left table and the matching rows from the right table.
     *
     * If there is no match in the right table, NULL values are returned for columns from the right table.
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @return {this}
     */
    leftJoin(localKey, referenceKey) {
        var _a;
        const table = (_a = referenceKey.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        this.$state.set('JOIN', [
            ...this.$state.get('JOIN'),
            [
                `${this.$constants('LEFT_JOIN')}`,
                `\`${table}\` ${this.$constants('ON')}`,
                `${this.bindColumn(localKey)} = ${this.bindColumn(referenceKey)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'crossJoin' method performs a cross join operation between two or more tables.
     *
     * A cross join, also known as a Cartesian join, combines every row from the first table with every row from the second table.
     * @param {string} localKey local key in current table
     * @param {string} referenceKey reference key in next table
     * @return {this}
     */
    crossJoin(localKey, referenceKey) {
        var _a;
        const table = (_a = referenceKey.split('.')) === null || _a === void 0 ? void 0 : _a.shift();
        this.$state.set('JOIN', [
            ...this.$state.get('JOIN'),
            [
                `${this.$constants('CROSS_JOIN')}`,
                `\`${table}\` ${this.$constants('ON')}`,
                `${this.bindColumn(localKey)} = ${this.bindColumn(referenceKey)}`
            ].join(' ')
        ]);
        return this;
    }
    /**
     * The 'orderBy' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction (ascending or descending) for each column.
     * @param {string} column
     * @param {string?} order by default order = 'asc' but you can used 'asc' or  'desc'
     * @return {this}
     */
    orderBy(column, order = 'ASC') {
        if (typeof column !== 'string')
            return this;
        if (column.includes(this.$constants('RAW')) || /\./.test(column)) {
            column = column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
            if (/\./.test(column))
                column = this.bindColumn(column);
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `\`${column}\` ${order.toUpperCase()}`
        ]);
        return this;
    }
    /**
     * The 'orderByRaw' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction (ascending or descending) for each column.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string} column
     * @param {string?} order [order=asc] asc, desc
     * @return {this}
     */
    orderByRaw(column, order = this.$constants('ASC')) {
        if (column.includes(this.$constants('RAW'))) {
            column = column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `${column} ${order.toUpperCase()}`
        ]);
        return this;
    }
    /**
     * The 'random' method is used to retrieve random records from a database table or to randomize the order in which records are returned in the query result set.
     *
     * @return {this}
     */
    random() {
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `${this.$constants('RAND')}`
        ]);
        return this;
    }
    /**
     * The 'inRandom' method is used to retrieve random records from a database table or to randomize the order in which records are returned in the query result set.
     *
     * @return {this}
     */
    inRandom() {
        return this.random();
    }
    /**
     * The 'latest' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction descending for each column.
     * @param {string?} columns [column=id]
     * @return {this}
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
     * The 'latestRaw' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction descending for each column.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string?} columns [column=id]
     * @return {this}
     */
    latestRaw(...columns) {
        let orderBy = '`id`';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderBy = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return column;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `${orderBy} ${this.$constants('DESC')}`
        ]);
        return this;
    }
    /**
     * The 'oldest' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction ascending for each column.
     * @param {string?} columns [column=id]
     * @return {this}
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
     * The 'oldestRaw' method is used to specify the order in which the results of a database query should be sorted.
     *
     * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction ascending for each column.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string?} columns [column=id]
     * @return {this}
     */
    oldestRaw(...columns) {
        let orderBy = '`id`';
        if (columns === null || columns === void 0 ? void 0 : columns.length) {
            orderBy = columns.map(column => {
                if (column.includes(this.$constants('RAW')))
                    return column === null || column === void 0 ? void 0 : column.replace(this.$constants('RAW'), '');
                return column;
            }).join(', ');
        }
        this.$state.set('ORDER_BY', [
            ...this.$state.get('ORDER_BY'),
            `${orderBy} ${this.$constants('ASC')}`
        ]);
        return this;
    }
    /**
     * The groupBy method is used to group the results of a database query by one or more columns.
     *
     * It allows you to aggregate data based on the values in specified columns, often in conjunction with aggregate functions like COUNT, SUM, AVG, and MAX.
     *
     * Grouping is commonly used for generating summary reports, calculating totals, and performing other aggregate operations on data.
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
        this.$state.set('GROUP_BY', [
            ...this.$state.get('GROUP_BY'),
            `${groupBy}`
        ]);
        return this;
    }
    /**
     * The groupBy method is used to group the results of a database query by one or more columns.
     *
     * It allows you to aggregate data based on the values in specified columns, often in conjunction with aggregate functions like COUNT, SUM, AVG, and MAX.
     *
     * Grouping is commonly used for generating summary reports, calculating totals, and performing other aggregate operations on data.
     *
     * This method allows you to specify raw-sql parameters for the query.
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
        this.$state.set('GROUP_BY', [
            ...this.$state.get('GROUP_BY'),
            `${groupBy}`
        ]);
        return this;
    }
    /**
     * The 'having' method is used to add a conditional clause to a database query that filters the result set after the GROUP BY operation has been applied.
     *
     * It is typically used in conjunction with the GROUP BY clause to filter aggregated data based on some condition.
     *
     * The having clause allows you to apply conditions to aggregated values, such as the result of COUNT, SUM, AVG, or other aggregate functions.
     * @param {string} condition
     * @return {this}
     */
    having(condition) {
        if (condition.includes(this.$constants('RAW'))) {
            condition = condition === null || condition === void 0 ? void 0 : condition.replace(this.$constants('RAW'), '');
        }
        this.$state.set('HAVING', `${this.$constants('HAVING')} ${condition}`);
        return this;
    }
    /**
     * The 'havingRaw' method is used to add a conditional clause to a database query that filters the result set after the GROUP BY operation has been applied.
     *
     * It is typically used in conjunction with the GROUP BY clause to filter aggregated data based on some condition.
     *
     * The having clause allows you to apply conditions to aggregated values, such as the result of COUNT, SUM, AVG, or other aggregate functions.
     *
     * This method allows you to specify raw-sql parameters for the query.
     * @param {string} condition
     * @return {this}
     */
    havingRaw(condition) {
        return this.having(condition);
    }
    /**
     * The 'limit' method is used to limit the number of records returned by a database query.
     *
     * It allows you to specify the maximum number of rows to retrieve from the database table.
     * @param {number=} number [number=1]
     * @return {this}
     */
    limit(number = 1) {
        this.$state.set('LIMIT', `${this.$constants('LIMIT')} ${number}`);
        return this;
    }
    /**
     * The 'limit' method is used to limit the number of records returned by a database query.
     *
     * It allows you to specify the maximum number of rows to retrieve from the database table.
     * @param {number=} number [number=1]
     * @return {this}
     */
    take(number = 1) {
        return this.limit(number);
    }
    /**
     * The offset method is used to specify the number of records to skip from the beginning of a result set.
     *
     * It is often used in combination with the limit method for pagination or to skip a certain number of records when retrieving data from a database table.
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
     * The offset method is used to specify the number of records to skip from the beginning of a result set.
     *
     * It is often used in combination with the limit method for pagination or to skip a certain number of records when retrieving data from a database table.
     * @param {number=} number [number=1]
     * @return {this}
     */
    skip(number = 1) {
        return this.offset(number);
    }
    /**
     * The 'hidden' method is used to specify which columns you want to hidden result.
     * It allows you to choose the specific columns that should be hidden in the result.
     * @param {...string} columns
     * @return {this} this
     */
    hidden(...columns) {
        this.$state.set('HIDDEN', columns);
        return this;
    }
    /**
     * The 'update' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove one record that match certain criteria.
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data} using name column(s)
     * @return {this} this
     */
    update(data, updateNotExists = []) {
        this.limit(1);
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
     * The 'updateMany' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove more records that match certain criteria.
     * @param {object} data
     * @param {array?} updateNotExists options for except update some records in your ${data} using name column(s)
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
     * The 'updateNotExists' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It method will be update record if data is empty or null in the column values
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
     * The 'insert' method is used to insert a new record into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @param {object} data
     * @return {this} this
     */
    insert(data) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
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
     * The 'create' method is used to insert a new record into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @param {object} data
     * @return {this} this
     */
    create(data) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
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
     * The 'createMultiple' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records with an array.
     * @param {array} data create multiple data
     * @return {this} this this
     */
    createMultiple(data) {
        if (!Object.keys(data).length)
            throw new Error('This method must be required');
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
     * The 'insertMultiple' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records with an array.
     * @param {array} data create multiple data
     * @return {this} this this
     */
    insertMultiple(data) {
        return this.createMultiple(data);
    }
    /**
     * The 'createNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but without raising an error or exception if duplicates are encountered.
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
     * The 'insertNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but without raising an error or exception if duplicates are encountered.
     * @param {object} data insert not exists data
     * @return {this} this this
     */
    insertNotExists(data) {
        this.createNotExists(data);
        return this;
    }
    /**
     * The 'createOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but if exists should be returns a result.
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
     * The 'insertOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but if exists should be returns a result.
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrSelect(data) {
        this.createOrSelect(data);
        return this;
    }
    /**
     * The 'updateOrCreate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrCreate(data) {
        this.limit(1);
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
     * The 'updateOrInsert' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data insert or update data
     * @return {this} this this
     */
    updateOrInsert(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     * The 'insertOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data insert or update data
     * @return {this} this this
     */
    insertOrUpdate(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * The 'createOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @param {object} data create or update data
     * @return {this} this this
     */
    createOrUpdate(data) {
        this.updateOrCreate(data);
        return this;
    }
    /**
     *
     * @param {{when : Object , columns : Object}[]} cases update multiple data specific columns by cases update
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.when
     * @property {Record<string,string | number | boolean | null | undefined>}  cases.columns
     * @return {this} this
     */
    updateMultiple(cases) {
        if (!cases.length)
            throw new Error(`The method 'updateMultiple' must not be empty.`);
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
        for (let i = cases.length - 1; i >= 0; i--) {
            const c = cases[i];
            if (c.when == null || !Object.keys(c.when).length)
                throw new Error(`This 'when' property is missing some properties`);
            if (c.columns == null || !Object.keys(c.columns).length)
                throw new Error(`This 'columns' property is missing some properties`);
            const when = Object.entries(c.when).map(([key, value]) => {
                value = this.$utils.escape(value);
                value = this._valueTrueFalse(value);
                return `${this.bindColumn(key)} = '${value}'`;
            });
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
                : typeof value === 'string' && value.includes(this.$constants('RAW'))
                    ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
                    : `'${this.$utils.covertBooleanToNumber(value)}'`}`;
        });
        const query = `${this.$constants('SET')} ${keyValue.join(', ')}`;
        this.$state.set('UPDATE', [
            `${this.$constants('UPDATE')}`,
            `${this.$state.get('TABLE_NAME')}`,
            `${query}`
        ].join(' '));
        this.$state.set('SAVE', 'UPDATE');
        return this;
    }
    /**
     * The 'toString' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @return {string} return sql query
     */
    toString() {
        const sql = this._queryBuilder().any();
        return this._resultHandler(sql);
    }
    /**
     * The 'toSQL' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @return {string} return sql query
     */
    toSQL() {
        return this.toString();
    }
    /**
     * The 'toRawSQL' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @return {string}
    */
    toRawSQL() {
        return this.toString();
    }
    /**
     * The 'getTableName' method is used to get table name
     * @return {string} return table name
     */
    getTableName() {
        return this.$state.get('TABLE_NAME').replace(/\`/g, '');
    }
    /**
     * The 'getSchema' method is used to get schema information
     * @return {this} this this
     */
    getSchema() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('COLUMNS')}`,
                `${this.$constants('FROM')}`,
                `\`${this.$state.get('TABLE_NAME').replace(/\`/g, '')}\``
            ].join(' ');
            return yield this._queryStatement(sql);
        });
    }
    /**
     * The 'bindColumn' method is used to concat table and column -> `users`.`id`
     * @param {string} column
     * @return {string} return table.column
     */
    bindColumn(column) {
        if (!/\./.test(column)) {
            return `\`${this.getTableName().replace(/`/g, '')}\`.\`${column.replace(/`/g, '')}\``;
        }
        const [table, c] = column.split('.');
        return `\`${table.replace(/`/g, '')}\`.\`${c.replace(/`/g, '')}\``;
    }
    /**
     * The 'debug' method is used to console.log raw SQL query that would be executed by a query builder
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    debug(debug = true) {
        this.$state.set('DEBUG', debug);
        return this;
    }
    /**
     * The 'dd' method is used to console.log raw SQL query that would be executed by a query builder
     * @param {boolean} debug debug sql statements
     * @return {this} this this
     */
    dd(debug = true) {
        this.$state.set('DEBUG', debug);
        return this;
    }
    /**
     * The 'hook' method is used function when execute returns a result to callback function
     * @param {Function} func function for callback result
     * @return {this}
    */
    hook(func) {
        if (typeof func !== "function")
            throw new Error(`this '${func}' is not a function`);
        this.$state.set('HOOKS', [...this.$state.get('HOOKS'), func]);
        return this;
    }
    /**
     * The 'before' method is used function when execute returns a result to callback function
     * @param {Function} func function for callback result
     * @return {this}
    */
    before(func) {
        if (typeof func !== "function")
            throw new Error(`this '${func}' is not a function`);
        this.$state.set('HOOKS', [...this.$state.get('HOOKS'), func]);
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
     * @param {string} env load environment using with command line arguments
     * @return {this} this
     */
    loadEnv(env) {
        if (env === null)
            return this;
        const options = (0, connection_1.loadOptionsEnvironment)();
        const pool = new connection_1.PoolConnection({
            host: String(options.host),
            port: Number(options.port),
            database: String(options.database),
            user: String(options.username),
            password: String(options.password)
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
     * This 'rawQuery' method is used to execute sql statement
     *
     * @param {string} sql
     * @return {promise<any>}
     */
    rawQuery(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._queryStatement(sql);
        });
    }
    /**
     * This 'query' method is used to execute sql statement
     *
     * @param {string} sql
     * @return {promise<any>}
     */
    query(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._queryStatement(sql);
        });
    }
    /**
     *
     * plus value then update
     * @param {string} column
     * @param {number} value
     * @return {promise<any>}
     */
    increment() {
        return __awaiter(this, arguments, void 0, function* (column = 'id', value = 1) {
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
    decrement() {
        return __awaiter(this, arguments, void 0, function* (column = 'id', value = 1) {
            const query = `${this.$constants('SET')} ${column} = ${column} - ${value}`;
            this.$state.set('UPDATE', [
                `${this.$constants('UPDATE')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${query}`
            ].join(' '));
            return yield this._update(true);
        });
    }
    version() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._queryStatement(`${this.$constants('SELECT')} VERSION() as version`);
            return result[0].version;
        });
    }
    /**
     * The 'all' method is used to retrieve all records from a database table associated.
     *
     * It returns an array instances, ignore all condition.
     * @return {promise<any>}
     */
    all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._queryStatement([
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' '));
        });
    }
    /**
     * The 'find' method is used to retrieve a single record from a database table by its primary key.
     *
     * This method allows you to quickly fetch a specific record by specifying the primary key value, which is typically an integer id.
     * @param {number} id
     * @return {promise<any>}
     */
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._queryStatement([
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
     * The 'pagination' method is used to perform pagination on a set of database query results obtained through the Query Builder.
     *
     * It allows you to split a large set of query results into smaller, more manageable pages,
     * making it easier to display data in a web application and improve user experience
     * @param {?object} paginationOptions
     * @param {number} paginationOptions.limit default 15
     * @param {number} paginationOptions.page default 1
     * @return {promise<Pagination>}
     */
    pagination(paginationOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let limit = 15;
            let page = 1;
            if (paginationOptions != null) {
                limit = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.limit) || limit;
                page = (paginationOptions === null || paginationOptions === void 0 ? void 0 : paginationOptions.page) || page;
            }
            limit = limit > 1000 ? 1000 : limit;
            const currentPage = page;
            const nextPage = currentPage + 1;
            const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;
            const offset = (page - 1) * limit;
            this.limit(limit);
            this.offset(offset);
            let sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
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
            const total = yield new DB_1.DB()
                .copyBuilder(this, { where: true, join: true })
                .bind(this.$pool.get())
                .debug(this.$state.get('DEBUG'))
                .count();
            let lastPage = Math.ceil(total / limit) || 0;
            lastPage = lastPage > 1 ? lastPage : 1;
            const totalPage = (_b = result === null || result === void 0 ? void 0 : result.length) !== null && _b !== void 0 ? _b : 0;
            return {
                meta: {
                    total: total,
                    limit: limit,
                    total_page: totalPage,
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
     * The 'paginate' method is used to perform pagination on a set of database query results obtained through the Query Builder.
     *
     * It allows you to split a large set of query results into smaller, more manageable pages,
     * making it easier to display data in a web application and improve user experience
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
     * The 'first' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @param {Function?} cb callback function return query sql
     * @return {promise<object | null>}
     */
    first(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            this.limit(1);
            let sql = this._queryBuilder().select();
            if (cb) {
                const callbackSql = cb(sql);
                if (callbackSql == null || callbackSql === '')
                    throw new Error('Please provide a callback for execution');
                sql = callbackSql;
            }
            const result = yield this._queryStatement(sql);
            if (this.$state.get('VOID'))
                return null;
            if ((_b = this.$state.get('HIDDEN')) === null || _b === void 0 ? void 0 : _b.length)
                this._hiddenColumn(result);
            if (this.$state.get('PLUCK')) {
                const pluck = this.$state.get('PLUCK');
                const newData = result === null || result === void 0 ? void 0 : result.shift();
                const checkProperty = newData.hasOwnProperty(pluck);
                if (!checkProperty)
                    throw new Error(`can't find property '${pluck}' of result`);
                const r = newData[pluck] || null;
                yield this.$utils.hookHandle(this.$state.get('HOOKS'), r);
                return r;
            }
            if (this.$state.get('RETURN_TYPE') != null) {
                const returnType = this.$state.get('RETURN_TYPE');
                return this._resultHandler(returnType === 'object'
                    ? result[0]
                    : returnType === 'array' ? result : [result]);
            }
            const r = result[0] || null;
            yield this.$utils.hookHandle(this.$state.get('HOOKS'), r);
            return this._resultHandler(r);
        });
    }
    /**
     *
     * The 'findOne' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @param {Function?} cb callback function return query sql
     * @return {promise<object | null>}
     */
    findOne(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.first(cb);
        });
    }
    /**
     * The 'firstOrError' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     *
     * If record is null, this method will throw an error
     * @return {promise<object | Error>}
     */
    firstOrError(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            let sql = this._queryBuilder().select();
            if (!sql.includes(this.$constants('LIMIT')))
                sql = `${sql} ${this.$constants('LIMIT')} 1`;
            else
                sql = sql.replace(this.$state.get('LIMIT'), `${this.$constants('LIMIT')} 1`);
            const result = yield this._queryStatement(sql);
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
                    if (options == null)
                        throw { message, code: 400 };
                    throw Object.assign({ message }, options);
                }
                yield this.$utils.hookHandle(this.$state.get('HOOKS'), data);
                return this._resultHandler(data);
            }
            const data = (result === null || result === void 0 ? void 0 : result.shift()) || null;
            if (data == null) {
                if (options == null) {
                    throw { message, code: 400 };
                }
                throw Object.assign({ message }, options);
            }
            yield this.$utils.hookHandle(this.$state.get('HOOKS'), data);
            return this._resultHandler(data);
        });
    }
    /**
     * The 'findOneOrError' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     *
     * If record is null, this method will throw an error
     * execute data return object | null
     * @return {promise<object | null>}
     */
    findOneOrError(message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.firstOrError(message, options);
        });
    }
    /**
     * The 'get' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     * @param {Function?} cb callback function return query sql
     * @return {promise<any[]>}
     */
    get(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if ((_a = this.$state.get('EXCEPTS')) === null || _a === void 0 ? void 0 : _a.length)
                this.select(...yield this.exceptColumns());
            let sql = this._queryBuilder().select();
            if (cb) {
                const callbackSql = cb(sql);
                if (callbackSql == null || callbackSql === '')
                    throw new Error('Please provide a callback for execution');
                sql = callbackSql;
            }
            const result = yield this._queryStatement(sql);
            if (this.$state.get('VOID'))
                return [];
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
                yield this.$utils.hookHandle(this.$state.get('HOOKS'), data || []);
                return this._resultHandler(data || []);
            }
            if (this.$state.get('PLUCK')) {
                const pluck = this.$state.get('PLUCK');
                const newData = result.map((d) => d[pluck]);
                if (newData.every((d) => d == null)) {
                    throw new Error(`can't find property '${pluck}' of result`);
                }
                yield this.$utils.hookHandle(this.$state.get('HOOKS'), newData || []);
                return this._resultHandler(newData || []);
            }
            yield this.$utils.hookHandle(this.$state.get('HOOKS'), result || []);
            if (this.$state.get('RETURN_TYPE') != null) {
                const returnType = this.$state.get('RETURN_TYPE');
                return this._resultHandler(returnType === 'object'
                    ? result[0]
                    : returnType === 'array' ? result : [result]);
            }
            return this._resultHandler(result || []);
        });
    }
    /**
     * The 'findMany' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     * @param {Function?} cb callback function return query sql
     * @return {promise<any[]>}
     */
    findMany(cb) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get(cb);
        });
    }
    /**
     *
     * The 'toJSON' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns a JSON formatted
     * @return {promise<string>}
     */
    toJSON() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            if (this.$state.get('HIDDEN').length)
                this._hiddenColumn(result);
            return this._resultHandler(JSON.stringify(result));
        });
    }
    /**
     * The 'toArray' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns an array formatted
     * @param {string=} column [column=id]
     * @return {promise<Array>}
     */
    toArray() {
        return __awaiter(this, arguments, void 0, function* (column = 'id') {
            this.selectRaw(`${this.bindColumn(column)}`);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            const toArray = result.map((data) => data[column]);
            return this._resultHandler(toArray);
        });
    }
    /**
     * The 'exists' method is used to determine if any records exist in the database table that match the query conditions.
     *
     * It returns a boolean value indicating whether there are any matching records.
     * @return {promise<boolean>}
     */
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.limit(1);
            this.selectRaw('1');
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement([
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}`,
                `(${sql})`,
                `${this.$constants('AS')} \`aggregate\``
            ].join(' '));
            return Boolean(this._resultHandler(!!((_a = result === null || result === void 0 ? void 0 : result.shift()) === null || _a === void 0 ? void 0 : _a.aggregate) || false));
        });
    }
    /**
     * The 'count' method is used to retrieve the total number of records that match the specified query conditions.
     *
     * It returns an integer representing the count of records.
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    count() {
        return __awaiter(this, arguments, void 0, function* (column = 'id') {
            const distinct = this.$state.get('DISTINCT');
            column = column === '*'
                ? '*'
                : distinct
                    ? `${this.$constants('DISTINCT')} ${this.bindColumn(column)}`
                    : `${this.bindColumn(column)}`;
            this.selectRaw(`${this.$constants('COUNT')}(${column}) ${this.$constants('AS')} \`aggregate\``);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            return Number(this._resultHandler(result.reduce((prev, cur) => { var _a; return prev + Number((_a = cur === null || cur === void 0 ? void 0 : cur.aggregate) !== null && _a !== void 0 ? _a : 0); }, 0) || 0));
        });
    }
    /**
     * The 'avg' method is used to calculate the average value of a numeric column in a database table.
     *
     * It calculates the mean value of the specified column for all records that match the query conditions and returns the result as a floating-point number.
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    avg() {
        return __awaiter(this, arguments, void 0, function* (column = 'id') {
            const distinct = this.$state.get('DISTINCT');
            column = distinct ? `${this.$constants('DISTINCT')} ${this.bindColumn(column)}` : `${this.bindColumn(column)}`;
            this.selectRaw(`${this.$constants('AVG')}(${column}) ${this.$constants('AS')} \`aggregate\``);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            return Number(this._resultHandler((result.reduce((prev, cur) => { var _a; return prev + Number((_a = cur === null || cur === void 0 ? void 0 : cur.aggregate) !== null && _a !== void 0 ? _a : 0); }, 0) || 0) / result.length));
        });
    }
    /**
     * The 'sum' method is used to calculate the sum of values in a numeric column of a database table.
     *
     * It computes the total of the specified column's values for all records that match the query conditions and returns the result as a numeric value.
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    sum() {
        return __awaiter(this, arguments, void 0, function* (column = 'id') {
            const distinct = this.$state.get('DISTINCT');
            column = distinct ? `${this.$constants('DISTINCT')} ${this.bindColumn(column)}` : `${this.bindColumn(column)}`;
            this.selectRaw(`${this.$constants('SUM')}(${column}) ${this.$constants('AS')} \`aggregate\``);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            return Number(this._resultHandler(result.reduce((prev, cur) => { var _a; return prev + Number((_a = cur === null || cur === void 0 ? void 0 : cur.aggregate) !== null && _a !== void 0 ? _a : 0); }, 0) || 0));
        });
    }
    /**
     * The 'max' method is used to retrieve the maximum value of a numeric column in a database table.
     *
     * It finds the highest value in the specified column among all records that match the query conditions and returns that value.
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    max() {
        return __awaiter(this, arguments, void 0, function* (column = 'id') {
            var _a;
            const distinct = this.$state.get('DISTINCT');
            column = distinct ? `${this.$constants('DISTINCT')} ${this.bindColumn(column)}` : `${this.bindColumn(column)}`;
            this.selectRaw(`${this.$constants('MAX')}(${column}) ${this.$constants('AS')} \`aggregate\``);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            return Number(this._resultHandler(((_a = result.sort((a, b) => (b === null || b === void 0 ? void 0 : b.aggregate) - (a === null || a === void 0 ? void 0 : a.aggregate))[0]) === null || _a === void 0 ? void 0 : _a.aggregate) || 0));
        });
    }
    /**
     * The 'min' method is used to retrieve the minimum (lowest) value of a numeric column in a database table.
     *
     * It finds the smallest value in the specified column among all records that match the query conditions and returns that value.
     * @param {string=} column [column=id]
     * @return {promise<number>}
     */
    min() {
        return __awaiter(this, arguments, void 0, function* (column = 'id') {
            var _a;
            const distinct = this.$state.get('DISTINCT');
            column = distinct ? `${this.$constants('DISTINCT')} ${this.bindColumn(column)}` : `${this.bindColumn(column)}`;
            this.selectRaw(`${this.$constants('MIN')}(${column}) ${this.$constants('AS')} \`aggregate\``);
            const sql = this._queryBuilder().select();
            const result = yield this._queryStatement(sql);
            return Number(this._resultHandler(((_a = result.sort((a, b) => (a === null || a === void 0 ? void 0 : a.aggregate) - (b === null || b === void 0 ? void 0 : b.aggregate))[0]) === null || _a === void 0 ? void 0 : _a.aggregate) || 0));
        });
    }
    /**
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one record that match certain criteria.
     * @return {promise<boolean>}
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.$state.get('WHERE').length) {
                throw new Error("can't delete without where condition");
            }
            this.limit(1);
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            if (result)
                return Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
            return Boolean(this._resultHandler(false));
        });
    }
    /**
     * The 'deleteMany' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove more records that match certain criteria.
     * @return {promise<boolean>}
     */
    deleteMany() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.$state.get('WHERE').length) {
                throw new Error("can't delete without where condition");
            }
            this.$state.set('DELETE', [
                `${this.$constants('DELETE')}`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
            ].join(' '));
            const result = yield this._actionStatement({ sql: this._queryBuilder().delete() });
            if (result)
                return Boolean(this._resultHandler((_a = !!result) !== null && _a !== void 0 ? _a : false));
            return Boolean(this._resultHandler(false));
        });
    }
    /**
     *
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one or more records that match certain criteria.
     *
     * This method should be ignore the soft delete
     * @return {promise<boolean>}
     */
    forceDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
     * The 'getGroupBy' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns record an Array-Object key by column *grouping results in column
     * @param {string} column
     * @return {promise<Array>}
     */
    getGroupBy(column) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const sqlGroups = [
                `${this.$constants('SELECT')}`,
                `*`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this.$constants('WHERE')} id`,
                `${this.$constants('IN')}`,
                `(${data.map((a) => `\'${a}\'`).join(',') || ['0']})`
            ].join(' ');
            const groups = yield this._queryStatement(sqlGroups);
            const resultData = results.map((result) => {
                const id = result[column];
                const newData = groups.filter((data) => data[column] === id);
                return ({
                    [column]: id,
                    data: newData
                });
            });
            return this._resultHandler(resultData);
        });
    }
    /**
     *
     * The 'getGroupBy' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns record an Array-Object key by column *grouping results in column
     * @param {string} column
     * @return {promise<Array>}
     */
    findGroupBy(column) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getGroupBy(column);
        });
    }
    /**
     * The 'save' method is used to persist a new 'Model' or new 'DB' instance or update an existing model instance in the database.
     *
     * It's a versatile method that can be used in various scenarios, depending on whether you're working with a new or existing record.
     * @return {Promise<any>} promise
     */
    save() {
        return __awaiter(this, void 0, void 0, function* () {
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
     * The 'makeSelectStatement' method is used to make select statement.
     * @return {Promise<string>} string
     */
    makeSelectStatement() {
        return __awaiter(this, void 0, void 0, function* () {
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('SELECT')}`,
                    `${columns.join(', ')}`,
                    `${this.$constants('FROM')}`,
                    `\`${this.getTableName()}\``,
                ].join(' ');
            };
            const schemaTable = yield this.getSchema();
            const columns = schemaTable.map(column => this.bindColumn(column.Field));
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
            const makeStatement = (columns) => {
                return [
                    `${this.$constants('INSERT')}`,
                    `\`${this.getTableName()}\``,
                    `(${columns.join(', ')})`,
                    `${this.$constants('VALUES')}`,
                    `(${Array(columns.length).fill('`?`').join(' , ')})`
                ].join(' ');
            };
            const schemaTable = yield this.getSchema();
            const columns = schemaTable.map(column => `\`${column.Field}\``);
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
            const schemaTable = yield this.getSchema();
            const columns = schemaTable.map(column => `${this.bindColumn(column.Field)} = '?'`);
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
                    `${this.bindColumn('id')} = \`?\``
                ].join(' ');
            };
            return makeStatement();
        });
    }
    /**
     *
     * The 'makeCreateTableStatement' method is used to make create table statement.
     * @return {Promise<string>} string
     */
    makeCreateTableStatement() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const columns = yield this.showSchema();
            return makeStatement(columns);
        });
    }
    /**
     * The 'showTables' method is used to show schema table.
     *
     * @return {Promise<Array>}
     */
    showTables() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('TABLES')}`
            ].join(' ');
            const results = yield this._queryStatement(sql);
            return results
                .map(table => String(Object.values(table)[0]))
                .filter(d => d != null || d !== '');
        });
    }
    /**
     *
     * The 'showColumns' method is used to show columns table.
     *
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    showColumns() {
        return __awaiter(this, arguments, void 0, function* (table = this.$state.get('TABLE_NAME')) {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('COLUMNS')}`,
                `${this.$constants('FROM')}`,
                `\`${table.replace(/\`/g, '')}\``
            ].join(' ');
            const rawColumns = yield this._queryStatement(sql);
            const columns = rawColumns.map((column) => column.Field);
            return columns;
        });
    }
    /**
     * The 'showSchema' method is used to show schema table.
     *
     * @param {string=} table [table= current table name]
     * @return {Promise<Array>}
     */
    showSchema() {
        return __awaiter(this, arguments, void 0, function* (table = this.$state.get('TABLE_NAME')) {
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('COLUMNS')}`,
                `${this.$constants('FROM')}`,
                `\`${table.replace(/\`/g, '')}\``
            ].join(' ');
            const raws = yield this._queryStatement(sql);
            return raws.map((r) => {
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
        });
    }
    /**
     * The 'showSchemas' method is used to show schema table.
     *
     * @param {string=} table [table= current table name]
     * @return {Promise<Array>}
     */
    showSchemas() {
        return __awaiter(this, arguments, void 0, function* (table = this.$state.get('TABLE_NAME')) {
            return this.showSchema(table);
        });
    }
    /**
     *
     * The 'showValues' method is used to show values table.
     *
     * @param {string=} table table name
     * @return {Promise<Array>}
     */
    showValues() {
        return __awaiter(this, arguments, void 0, function* (table = this.$state.get('TABLE_NAME')) {
            const sql = [
                `${this.$constants('SELECT')}`,
                '*',
                `${this.$constants('FROM')}`,
                `\`${table.replace(/\`/g, '')}\``
            ].join(' ');
            const raw = yield this._queryStatement(sql);
            const values = raw.map((value) => {
                return `(${Object.values(value).map((v) => {
                    if (typeof v === 'object' && v != null && !Array.isArray(v))
                        return `'${JSON.stringify(v)}'`;
                    return v == null ? this.$constants('NULL') : `'${v}'`;
                }).join(', ')})`;
            });
            return values;
        });
    }
    /**
     *
     * The 'faker' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @param {number} rows number of rows
     * @return {promise<any>}
     */
    faker(rows, cb) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = [];
            const sql = [
                `${this.$constants('SHOW')}`,
                `${this.$constants('FIELDS')}`,
                `${this.$constants('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`
            ].join(' ');
            const fields = yield this._queryStatement(sql);
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
                if (cb) {
                    data = [...data, cb(columnAndValue, row)];
                    continue;
                }
                data = [...data, columnAndValue];
            }
            yield this.createMultiple(data).save();
            return;
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
            yield this._queryStatement(sql);
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
            yield this._queryStatement(sql);
            return true;
        });
    }
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
            for (const tableName of tableNames) {
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
                removeExcepts.push(hasDot ? removeExcept.map(r => `${tableName}.${r}`) : removeExcept);
            }
            return removeExcepts.flat();
        });
    }
    _updateHandler(column, value) {
        return DB_1.DB.raw([
            this.$constants('CASE'),
            this.$constants('WHEN'),
            `(\`${column}\` = "" ${this.$constants('OR')} \`${column}\` ${this.$constants('IS_NULL')})`,
            this.$constants('THEN'),
            `"${value !== null && value !== void 0 ? value : ""}" ${this.$constants('ELSE')} \`${column}\``,
            this.$constants('END')
        ].join(' '));
    }
    copyBuilder(instance, options) {
        if (!(instance instanceof Builder))
            throw new Error('Value is not a instanceof Builder');
        const copy = Object.fromEntries(instance.$state.get());
        const newInstance = new Builder();
        newInstance.$state.clone(copy);
        newInstance.$state.set('SAVE', '');
        newInstance.$state.set('DEBUG', false);
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
    _queryBuilder() {
        return this._buildQueryStatement();
    }
    _buildQueryStatement() {
        const buildSQL = (sql) => sql.filter(s => s !== '' || s == null).join(' ').replace(/\s+/g, ' ');
        const bindSelect = (values) => {
            if (!values.length) {
                if (!this.$state.get('DISTINCT'))
                    return `${this.$constants('SELECT')} *`;
                return `${this.$constants('SELECT')} ${this.$constants('DISTINCT')} *`;
            }
            const findIndex = values.indexOf('*');
            if (findIndex > -1) {
                const removed = values.splice(findIndex, 1);
                values.unshift(removed[0]);
            }
            return `${this.$constants('SELECT')} ${values.join(', ')}`;
        };
        const bindJoin = (values) => {
            if (!Array.isArray(values) || !values.length)
                return null;
            return values.join(' ');
        };
        const bindWhere = (values) => {
            if (!Array.isArray(values) || !values.length)
                return null;
            return `${this.$constants('WHERE')} ${values.map(v => v.replace(/^\s/, '').replace(/\s+/g, ' ')).join(' ')}`;
        };
        const bindOrderBy = (values) => {
            if (!Array.isArray(values) || !values.length)
                return null;
            return `${this.$constants('ORDER_BY')} ${values.map(v => v.replace(/^\s/, '').replace(/\s+/g, ' ')).join(', ')}`;
        };
        const bindGroupBy = (values) => {
            if (!Array.isArray(values) || !values.length)
                return null;
            return `${this.$constants('GROUP_BY')} ${values.map(v => v.replace(/^\s/, '').replace(/\s+/g, ' ')).join(', ')}`;
        };
        const select = () => {
            return buildSQL([
                bindSelect(this.$state.get('SELECT')),
                this.$state.get('FROM'),
                this.$state.get('TABLE_NAME'),
                bindJoin(this.$state.get('JOIN')),
                bindWhere(this.$state.get('WHERE')),
                bindGroupBy(this.$state.get('GROUP_BY')),
                this.$state.get('HAVING'),
                bindOrderBy(this.$state.get('ORDER_BY')),
                this.$state.get('LIMIT'),
                this.$state.get('OFFSET')
            ]);
        };
        const insert = () => buildSQL([this.$state.get('INSERT')]);
        const update = () => {
            return buildSQL([
                this.$state.get('UPDATE'),
                bindWhere(this.$state.get('WHERE')),
                bindOrderBy(this.$state.get('ORDER_BY')),
                this.$state.get('LIMIT')
            ]);
        };
        const remove = () => {
            return buildSQL([
                this.$state.get('DELETE'),
                bindWhere(this.$state.get('WHERE')),
                bindOrderBy(this.$state.get('ORDER_BY')),
                this.$state.get('LIMIT')
            ]);
        };
        return {
            select,
            insert,
            update,
            delete: remove,
            where: () => bindWhere(this.$state.get('WHERE')),
            any: () => {
                if (this.$state.get('INSERT'))
                    return insert();
                if (this.$state.get('UPDATE'))
                    return update();
                if (this.$state.get('DELETE'))
                    return remove();
                return select();
            }
        };
    }
    _resultHandler(data) {
        this.$state.set('RESULT', data);
        this.$state.reset();
        this.$logger.reset();
        return data;
    }
    whereReference(tableAndLocalKey, tableAndForeignKey) {
        this.$state.set('WHERE', [
            ...this.$state.get('WHERE'),
            [
                this.$state.get('WHERE').length ? `${this.$constants('AND')}` : '',
                `${tableAndLocalKey} = ${tableAndForeignKey}`
            ].join(' ')
        ]);
        return this;
    }
    _queryStatement(sql) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.$state.get('DEBUG'))
                this.$utils.consoleDebug(sql);
            const result = yield this.$pool.query(sql);
            return result;
        });
    }
    _actionStatement(_a) {
        return __awaiter(this, arguments, void 0, function* ({ sql, returnId = false }) {
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
    _insertNotExists() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE').length)
                throw new Error("Can't insert not exists without where condition");
            let sql = [
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
                `*`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this._queryBuilder().where()}`,
                `${this.$constants('LIMIT')} 1)`,
                `${this.$constants('AS')} 'exists'`
            ].join(' ');
            const [{ exists: result }] = yield this._queryStatement(sql);
            const check = !!Number.parseInt(result);
            switch (check) {
                case false: {
                    const [result, id] = yield this._actionStatement({
                        sql: this.$state.get('INSERT'),
                        returnId: true
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(undefined);
                    const sql = new Builder()
                        .copyBuilder(this, { select: true })
                        .where('id', id)
                        .toString();
                    const data = yield this._queryStatement(sql);
                    return this._resultHandler((data === null || data === void 0 ? void 0 : data.shift()) || null);
                }
                default: return this._resultHandler(null);
            }
        });
    }
    _insert() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result, id] = yield this._actionStatement({
                sql: this.$state.get('INSERT'),
                returnId: true
            });
            if (this.$state.get('VOID') || !result)
                return this._resultHandler(undefined);
            const sql = new Builder()
                .copyBuilder(this, { select: true })
                .where('id', id)
                .toString();
            const data = yield this._queryStatement(sql);
            const resultData = (data === null || data === void 0 ? void 0 : data.shift()) || null;
            this.$state.set('RESULT', resultData);
            return this._resultHandler(resultData);
        });
    }
    _checkValueHasRaw(value) {
        return typeof value === 'string' && value.startsWith(this.$constants('RAW'))
            ? `${this.$utils.covertBooleanToNumber(value)}`.replace(this.$constants('RAW'), '')
            : `'${this.$utils.covertBooleanToNumber(value)}'`;
    }
    _insertMultiple() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result, id] = yield this._actionStatement({
                sql: this._queryBuilder().insert(),
                returnId: true
            });
            if (this.$state.get('VOID') || !result)
                return this._resultHandler(undefined);
            const arrayId = [...Array(result)].map((_, i) => i + id);
            const sql = new Builder()
                .copyBuilder(this, { select: true })
                .whereIn('id', arrayId)
                .toString();
            const data = yield this._queryStatement(sql);
            const resultData = data || null;
            return this._resultHandler(resultData);
        });
    }
    _insertOrSelect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE').length) {
                throw new Error("Can't create or select without where condition");
            }
            let sql = [
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
                `1`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this._queryBuilder().where()}`,
                `${this.$constants('LIMIT')} 1)`,
                `${this.$constants('AS')} 'exists'`
            ].join(' ');
            let check = false;
            const [{ exists: result }] = yield this._queryStatement(sql);
            check = !!parseInt(result);
            switch (check) {
                case false: {
                    const [result, id] = yield this._actionStatement({
                        sql: this._queryBuilder().insert(),
                        returnId: true
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(undefined);
                    const sql = new Builder()
                        .copyBuilder(this, { select: true })
                        .where('id', id)
                        .toString();
                    const data = yield this._queryStatement(sql);
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'insert' }) || null;
                    return this._resultHandler(resultData);
                }
                case true: {
                    const sql = new Builder()
                        .copyBuilder(this, { select: true, where: true })
                        .toString();
                    const data = yield this._queryStatement(sql);
                    if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                        for (const val of data) {
                            val.$action = 'select';
                        }
                        return this._resultHandler(data || []);
                    }
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'select' }) || null;
                    return this._resultHandler(resultData);
                }
                default: {
                    return this._resultHandler(null);
                }
            }
        });
    }
    _updateOrInsert() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.$state.get('WHERE').length) {
                throw new Error("Can't update or insert without where condition");
            }
            let sql = [
                `${this.$constants('SELECT')}`,
                `${this.$constants('EXISTS')}(${this.$constants('SELECT')}`,
                `1`,
                `${this.$state.get('FROM')}`,
                `${this.$state.get('TABLE_NAME')}`,
                `${this._queryBuilder().where()}`,
                `${this.$constants('LIMIT')} 1)`,
                `${this.$constants('AS')} 'exists'`
            ].join(' ');
            let check = false;
            const [{ exists: result }] = yield this._queryStatement(sql);
            check = !!parseInt(result);
            switch (check) {
                case false: {
                    const [result, id] = yield this._actionStatement({
                        sql: this._queryBuilder().insert(),
                        returnId: true
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(undefined);
                    const sql = new Builder()
                        .copyBuilder(this, { select: true })
                        .where('id', id)
                        .toString();
                    const data = yield this._queryStatement(sql);
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'insert' }) || null;
                    return this._resultHandler(resultData);
                }
                case true: {
                    const result = yield this._actionStatement({
                        sql: this._queryBuilder().update()
                    });
                    if (this.$state.get('VOID') || !result)
                        return this._resultHandler(null);
                    const data = yield this._queryStatement(new Builder().copyBuilder(this, { select: true, where: true }).toString());
                    if ((data === null || data === void 0 ? void 0 : data.length) > 1) {
                        for (const val of data) {
                            val.$action = 'update';
                        }
                        return this._resultHandler(data || []);
                    }
                    const resultData = Object.assign(Object.assign({}, data === null || data === void 0 ? void 0 : data.shift()), { $action: 'update' }) || null;
                    return this._resultHandler(resultData);
                }
                default: {
                    return this._resultHandler(null);
                }
            }
        });
    }
    _update() {
        return __awaiter(this, arguments, void 0, function* (ignoreWhere = false) {
            if (!this.$state.get('WHERE').length && !ignoreWhere)
                throw new Error("can't update without where condition");
            const result = yield this._actionStatement({
                sql: this._queryBuilder().update()
            });
            if (this.$state.get('VOID') || !result)
                return this._resultHandler(undefined);
            const sql = this._queryBuilder().select();
            const data = yield this._queryStatement(sql);
            if ((data === null || data === void 0 ? void 0 : data.length) > 1)
                return this._resultHandler(data || []);
            const res = (data === null || data === void 0 ? void 0 : data.shift()) || null;
            return this._resultHandler(res);
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
        this.$utils.covertDataToDateIfDate(data);
        const values = Object.entries(data).map(([column, value]) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                value = this.$utils.escapeActions(value);
            }
            return `${this.bindColumn(column)} = ${value == null || value === this.$constants('NULL')
                ? this.$constants('NULL')
                : this._checkValueHasRaw(value)}`;
        });
        return `${this.$constants('SET')} ${values}`;
    }
    _queryInsert(data) {
        this.$utils.covertDataToDateIfDate(data);
        const columns = Object.keys(data).map((column) => this.bindColumn(column));
        const values = Object.values(data).map((value) => {
            if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                value = this.$utils.escapeActions(value);
            }
            return `${value == null || value === this.$constants('NULL')
                ? this.$constants('NULL')
                : this._checkValueHasRaw(value)}`;
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
            this.$utils.covertDataToDateIfDate(data);
            const vals = Object.values(objects).map((value) => {
                if (typeof value === 'string' && !(value.includes(this.$constants('RAW')))) {
                    value = this.$utils.escapeActions(value);
                }
                return `${value == null || value === this.$constants('NULL')
                    ? this.$constants('NULL')
                    : this._checkValueHasRaw(value)}`;
            });
            values.push(`(${vals.join(',')})`);
        }
        const columns = Object.keys((_a = [...data]) === null || _a === void 0 ? void 0 : _a.shift()).map((column) => this.bindColumn(column));
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
            throw new Error(`The arguments are required. Please check the your arguments in method 'where' or etc methods.`);
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
                reset: () => {
                    logger = [];
                    return;
                },
                check: (data) => logger.indexOf(data) != -1
            };
        })();
        this.$constants = (name) => {
            if (name == null)
                return constants_1.CONSTANTS;
            if (!constants_1.CONSTANTS.hasOwnProperty(name.toUpperCase()))
                throw new Error(`Not found that constant : '${name}'`);
            return constants_1.CONSTANTS[name.toUpperCase()];
        };
    }
}
exports.Builder = Builder;
exports.default = Builder;
