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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const Model_1 = require("./Model");
class RepositoryHandler {
    constructor(_model) {
        this._model = _model;
    }
    /**
     *
     * The 'first' method is used to retrieve the first record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {string[]} options.relations
     * @property {string[]} options.relationExists
     * @property {?{condition,callback}} options.relationQuery
     * @property {?boolean} options.debug
     * @returns {promise<Object | null>}
     *
     * @example
     * import { Repository , TRepository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository = new Repository<User>().bind(User)
     *
     *  const user = await userRepository.findOne({
     *       select : ['id','name'],
     *       where : {
     *           id: 1
     *       }
     *   })
     *
     *  const user = await userRepository.findOne()
     */
    first() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.first();
        });
    }
    /**
     *
     * The 'findOne' method is used to retrieve the findOne record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {string[]} options.relations
     * @property {string[]} options.relationExists
     * @property {?{condition,callback}} options.relationQuery
     * @property {?boolean} options.debug
     * @returns {promise<Object | null>}
     *
     * @example
     * import { Repository , TRepository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository = new Repository<User>().bind(User)
     *
     *  const user = await userRepository.findOne({
     *       select : ['id','name'],
     *       where : {
     *           id: 1
     *       }
     *   })
     *
     *  const user = await userRepository.findOne()
     */
    findOne() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.first(options);
        });
    }
    /**
     *
     * The 'get' method is used to retrieve the get record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {string[]} options.relations
     * @property {string[]} options.relationExists
     * @property {?{condition,callback}} options.relationQuery
     * @property {?boolean} options.debug
     * @returns {promise<Object>[]}
     *
     * @example
     * import { Repository , TRepository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository = new Repository<User>().bind(User)
     *
     *  const users = await userRepository.get({
     *       select : ['id','name'],
     *       where : {
     *           id: 1
     *       }
     *   })
     *
     *  const users = await userRepository.get()
     */
    get() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.get();
        });
    }
    /**
     *
     * The 'get' method is used to retrieve the get record that matches the query conditions.
     *
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?string[]} options.relations
     * @property {string[]} options.relationExists
     * @property {?{condition,callback}} options.relationQuery
     * @property {?boolean} options.debug
     * @returns {promise<object>[]}
     *
     * @example
     * import { Repository , TRepository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository = new Repository<User>().bind(User)
     *
     *  const users = await userRepository.findMany({
     *       select : ['id','name'],
     *       where : {
     *           id: 1
     *       }
     *   })
     *
     *  const users = await userRepository.findMany()
     */
    findMany() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.get(options);
        });
    }
    /**
     *
     * The 'pagination' method is used to perform pagination on a set of database query results obtained through the Query Builder.
     *
     * It allows you to split a large set of query results into smaller, more manageable pages,
     * making it easier to display data in a web application and improve user experience.
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?string[]} options.relations
     * @property {string[]} options.relationExists
     * @property {?{condition,callback}} options.relationQuery
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @returns {promise<{ meta , data[]}>}
     *
     * @example
     * import { Repository , TRepository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository = new Repository<User>().bind(User)
     *
     *  const users = await userRepository.pagination({
     *       select : ['id','name'],
     *       where : {
     *           id: 1
     *       }
     *   })
     *
     *  const users = await userRepository.pagination({ page : 1 , limit : 2 })
     */
    pagination() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.pagination({
                limit: options.limit,
                page: options.page
            });
        });
    }
    /**
     *
     * The 'paginate' method is used to perform pagination on a set of database query results obtained through the Query Builder.
     *
     * It allows you to split a large set of query results into smaller, more manageable pages,
     * making it easier to display data in a web application and improve user experience
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?string[]} options.relations
     * @property {string[]} options.relationExists
     * @property {?{condition,callback}} options.relationQuery
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @returns {promise<{ meta , data[]}>}
     *
     * @example
     * import { Repository , TRepository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository = new Repository<User>().bind(User)
     *
     *  const users = await userRepository.paginate({
     *       select : ['id','name'],
     *       where : {
     *           id: 1
     *       }
     *   })
     *
     *  const users = await userRepository.paginate({ page : 1 , limit : 2 })
     */
    paginate() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.pagination(options);
        });
    }
    /**
     * The 'exists' method is used to determine if any records exist in the database table that match the query conditions.
     *
     * It returns a boolean value indicating whether there are any matching records.
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     */
    exists() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.exists();
        });
    }
    /**
     * The 'toString' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
     *
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @returns {string}
     */
    toString(options = {}) {
        const instance = this._handlerRequest(options);
        if (instance == null)
            throw new Error('The instance is not initialized');
        if (options.debug != null && options.debug)
            instance.debug();
        return instance.toString();
    }
    /**
     * The 'toJSON' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns a JSON formatted.
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @returns {string} json
     */
    toJSON() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.toJSON();
        });
    }
    /**
     * The 'toArray' method is used to execute a database query and retrieve the result set that matches the query conditions.
     *
     * It retrieves multiple records from a database table based on the criteria specified in the query.
     *
     * It returns an array formatted.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @return {promise<any[]>}
     */
    toArray(column_1) {
        return __awaiter(this, arguments, void 0, function* (column, options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.toArray(column);
        });
    }
    /**
     * The 'count' method is used to retrieve the total number of records that match the specified query conditions.
     *
     * It returns an integer representing the count of records.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @return {promise<any[]>}
     */
    count(column_1) {
        return __awaiter(this, arguments, void 0, function* (column, options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.count(column);
        });
    }
    /**
     * The 'avg' method is used to retrieve the total number of records that match the specified query conditions.
     *
     * It returns an integer representing the avg of records.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @return {promise<any[]>}
     */
    avg(column_1) {
        return __awaiter(this, arguments, void 0, function* (column, options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.avg(column);
        });
    }
    /**
     * The 'sum' method is used to retrieve the total number of records that match the specified query conditions.
     *
     * It returns an integer representing the sum of records.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @return {promise<any[]>}
     */
    sum(column_1) {
        return __awaiter(this, arguments, void 0, function* (column, options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.sum(column);
        });
    }
    /**
     * The 'max' method is used to retrieve the maximum value of a numeric column in a database table.
     *
     * It finds the highest value in the specified column among all records that match the query conditions and returns that value.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @return {promise<any[]>}
     */
    max(column_1) {
        return __awaiter(this, arguments, void 0, function* (column, options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.max(column);
        });
    }
    /**
     * The 'min' method is used to retrieve the minimum (lowest) value of a numeric column in a database table.
     *
     * It finds the smallest value in the specified column among all records that match the query conditions and returns that value.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?string[]} options.select
     * @property {?object[]} options.orderBy
     * @property {?string[]} options.groupBy
     * @property {?string} options.having
     * @property {?number} options.limit
     * @property {?number} options.offset
     * @property {?object} options.where
     * @property {?string[]} options.whereRaw
     * @property {?object} options.whereQuery
     * @property {?{condition,callback}} options.when
     * @property {?{localKey , referenceKey}[]} options.join
     * @property {?{localKey , referenceKey}[]} options.rightJoin
     * @property {?{localKey , referenceKey}[]} options.leftJoin
     * @property {?boolean} options.debug
     * @property {?number} options.page
     * @return {promise<any[]>}
     */
    min(column_1) {
        return __awaiter(this, arguments, void 0, function* (column, options = {}) {
            const instance = this._handlerRequest(options);
            if (instance == null)
                throw new Error('The instance is not initialized');
            if (options.debug != null && options.debug)
                instance.debug();
            return yield instance.min(column);
        });
    }
    /**
     * The 'create' method is used to insert a new record into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @type     {object}  options
     * @property {object} options.data
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T>}
     */
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, debug, transaction }) {
            if (!Object.keys(data).length)
                throw new Error('The data must be required');
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (transaction != null) {
                instance.bind(transaction);
            }
            return yield instance.create(data).save();
        });
    }
    /**
     * The 'insert' method is used to insert a new record into a database table associated.
     *
     * It simplifies the process of creating and inserting records.
     * @type     {object}  options
     * @property {object} options.data
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T>}
     */
    insert(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, debug, }) {
            return yield this.create({
                data,
                debug
            });
        });
    }
    /**
     * The 'createNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but without raising an error or exception if duplicates are encountered.
     *
     * @type     {object}  options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T | null>}
     */
    createNotExists(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug }) {
            let instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (where == null || !Object.keys(where).length)
                throw new Error("The method createNotExists can't use without where condition");
            instance.where(where);
            return yield instance.createNotExists(data).save();
        });
    }
    /**
     * The 'insertNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but without raising an error or exception if duplicates are encountered.
     *
     * @type     {object}  options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T | null>}
     */
    insertNotExists(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug }) {
            return yield this.createNotExists({
                data,
                where,
                debug
            });
        });
    }
    /**
     * The 'createMultiple' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records with an array.
     * @type     {object}  options
     * @property {object[]} options.data
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T[]>}
     */
    createMultiple(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, debug, transaction }) {
            if (!Object.keys(data).length)
                throw new Error('The data must be required');
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (transaction != null) {
                instance.bind(transaction);
            }
            return yield instance.createMultiple(data).save();
        });
    }
    /**
     * The 'createMultiple' method is used to insert a new records into a database table associated.
     *
     * It simplifies the process of creating and inserting records with an array.
     * @type     {object}  options
     * @property {object[]} options.data
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T[]>}
     */
    insertMultiple(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, debug, }) {
            return yield this.createMultiple({
                data,
                debug
            });
        });
    }
    /**
     *
     * The 'createOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
     *
     * This method is particularly useful when you want to update a record based on certain conditions and,
     * if the record matching those conditions doesn't exist, create a new one with the provided data.
     * @type     {object}  options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @return {promise<T>}
     */
    createOrUpdate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug }) {
            let instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (where == null || !Object.keys(where).length)
                throw new Error("The method createOrUpdate can't use without where condition");
            instance.where(where);
            return yield instance.createOrUpdate(data).save();
        });
    }
    /**
    *
    * The 'insertOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
    *
    * This method is particularly useful when you want to update a record based on certain conditions and,
    * if the record matching those conditions doesn't exist, create a new one with the provided data.
    * @type     {object}  options
    * @property {object} options.data
    * @property {object} options.where
    * @property {?boolean} options.debug
    * @return {promise<T>}
    */
    insertOrUpdate(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug }) {
            return yield this.createOrUpdate({
                data,
                where,
                debug
            });
        });
    }
    /**
     *
     * The 'createOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but if exists should be returns a result.
     * @type     {object}  options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @return {promise<T>}
     */
    createOrSelect(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug }) {
            let instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (where == null || !Object.keys(where).length)
                throw new Error("The method createOrSelect can't use without where condition");
            instance.where(where);
            return yield instance.createOrSelect(data).save();
        });
    }
    /**
     *
     * The 'insertOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
     *
     * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
     * but if exists should be returns a result.
     * @type     {object}  options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T>}
     */
    insertOrSelect(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug }) {
            return yield this.createOrSelect({
                data,
                where,
                debug
            });
        });
    }
    /**
     * The 'update' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove one record that match certain criteria.
     * @type     {object} options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T>}
     */
    update(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug, transaction }) {
            if (where == null || !Object.keys(where).length)
                throw new Error("The method update can't use without where condition");
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (transaction != null) {
                instance.bind(transaction);
            }
            instance.where(where);
            return yield instance.update(data).save();
        });
    }
    /**
     * The 'updateMany' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove more records that match certain criteria.
     * @type     {object} options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T>}
     */
    updateMany(_a) {
        return __awaiter(this, arguments, void 0, function* ({ data, where, debug, transaction }) {
            if (where == null || !Object.keys(where).length)
                throw new Error("The method updateMany can't use without where condition");
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (transaction != null) {
                instance.bind(transaction);
            }
            instance.where(where);
            return yield instance.updateMany(data).save();
        });
    }
    /**
     * The 'updateMultiple' method is used to update existing records in a database table that are associated.
     *
     * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
     *
     * It allows you to remove more records that match certain criteria.
     * @type     {object} options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<T[]>}
     * @example
     * const saveUpdateMultiple = await userRepository.updateMultiple({
     *   cases : [
     *     {
     *       when : {
     *         id: 1
     *       },
     *       columns : {
     *         name : 'name-edit-in-multiple : id 1 '
     *       }
     *     },
     *     {
     *       when : {
     *         id : 2
     *       },
     *       columns : {
     *         name : 'name-edit-in-multiple : id 2'
     *       }
     *     }
     *   ],
     *  where : {
     *     id : Operator.in([1,2])
     *  }
     * })
     *
     */
    updateMultiple(_a) {
        return __awaiter(this, arguments, void 0, function* ({ cases, debug, transaction }) {
            if (!cases.length)
                throw new Error("The method updateMultiple can't use without cases condition");
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (transaction != null) {
                instance.bind(transaction);
            }
            return yield instance.updateMultiple(cases).save();
        });
    }
    /**
     * The 'delete' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one record that match certain criteria.
     * @type     {object} options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<boolean>}
     */
    delete(_a) {
        return __awaiter(this, arguments, void 0, function* ({ where, debug, transaction }) {
            if (where == null || !Object.keys(where).length)
                throw new Error("The method delete can't use without where condition");
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            if (transaction != null) {
                instance.bind(transaction);
            }
            instance.where(where);
            return yield instance.delete();
        });
    }
    /**
     * The 'deleteMany' method is used to delete records from a database table based on the specified query conditions.
     *
     * It allows you to remove one record that match certain criteria.
     * @type     {object} options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<boolean>}
     */
    deleteMany(_a) {
        return __awaiter(this, arguments, void 0, function* ({ where, debug, transaction }) {
            if (where == null || !Object.keys(where).length)
                throw new Error("The method deleteMany can't use without where condition");
            const instance = new this._model();
            if (debug != null && debug) {
                instance.debug();
            }
            instance.where(where);
            if (transaction != null) {
                instance.bind(transaction);
            }
            return yield instance.deleteMany();
        });
    }
    _handlerRequest(options) {
        let { select, join, leftJoin, rightJoin, where, whereRaw, whereQuery, groupBy, having, orderBy, limit, offset, relations, relationsExists, relationQuery, when, instance } = options;
        instance = instance == null ? new this._model() : instance;
        if (select != null) {
            if (select === '*')
                instance.select(select);
            else
                instance.select(...select);
        }
        if (join != null) {
            for (const v of join) {
                instance.join(v.localKey, v.referenceKey);
            }
        }
        if (leftJoin != null) {
            for (const v of leftJoin) {
                instance.leftJoin(v.localKey, v.referenceKey);
            }
        }
        if (rightJoin != null) {
            for (const v of rightJoin) {
                instance.rightJoin(v.localKey, v.referenceKey);
            }
        }
        if (where != null) {
            // @ts-ignore
            instance.whereObject(where);
        }
        if (whereRaw != null) {
            for (const raw of whereRaw) {
                instance.whereRaw(raw);
            }
        }
        if (whereQuery != null) {
            instance.whereQuery((query) => {
                // @ts-ignore
                return query.whereObject(whereQuery);
            });
        }
        if (groupBy != null) {
            instance.groupBy(...groupBy);
        }
        if (having != null) {
            instance.having(having);
        }
        if (orderBy != null) {
            for (const column in orderBy) {
                const orderby = orderBy[column];
                instance.orderBy(column, orderby);
            }
        }
        if (limit != null) {
            instance.limit(limit);
        }
        if (offset != null) {
            instance.offset(offset);
        }
        if (relations != null) {
            instance.with(...relations);
        }
        if (relationsExists != null) {
            instance.withExists(...relationsExists);
        }
        if (relationQuery != null && relationQuery.name) {
            const cbRelation = instance.findWithQuery(relationQuery.name);
            if (cbRelation != null) {
                const { select, join, leftJoin, rightJoin, where, whereQuery, groupBy, having, orderBy, limit, offset, relations, when } = relationQuery.callback();
                const instanceRelation = this._handlerRequest({
                    select,
                    join,
                    leftJoin,
                    rightJoin,
                    where,
                    whereQuery,
                    groupBy,
                    having,
                    orderBy,
                    limit,
                    offset,
                    relations,
                    when,
                    instance: cbRelation
                });
                if (instanceRelation != null) {
                    instance.withQuery(relationQuery.name, () => instanceRelation);
                }
            }
        }
        if (when != null && when.condition) {
            const { select, join, leftJoin, rightJoin, where, whereQuery, groupBy, having, orderBy, limit, offset, relations, relationQuery, when: whenCb } = when.callback();
            instance = this._handlerRequest({
                select,
                join,
                leftJoin,
                rightJoin,
                where,
                whereQuery,
                groupBy,
                having,
                orderBy,
                limit,
                offset,
                relations,
                relationQuery,
                when: whenCb,
                instance
            });
        }
        return instance;
    }
}
/**
 *
 * The 'Repository' is a class that encapsulates all database operations related to a specific model.
 *
 * It provides methods for querying, inserting, updating, and deleting records in the database associated with the model.
 *
 * @example
 * import { Repository } from 'tspace-mysql'
 * import { User } from '../Models/User'
 *
 * const userRepository = new Repository().bind(User) // or Repository.bind(User)
 *
 * const user = await userRepository.findOne()
 * const users = await userRepository.findMany()
 *
 */
class Repository {
    /**
     *
     * The 'bind' method is used to bind the model to the repository
     * @param {Model} model A class constructor for a model
     * @returns {RepositoryHandler<T,R>}
     */
    bind(model) {
        if (!((model === null || model === void 0 ? void 0 : model.prototype) instanceof Model_1.Model)) {
            throw new TypeError(`The Repository can only bind to a model, but the argument provided is not a Model.`);
        }
        return new RepositoryHandler(model);
    }
    /**
     *
     * The 'bind' method is used to bind the model to the repository
     * @static
     * @param {Model} model A class constructor for a model
     * @returns {RepositoryHandler<T,R>}
     */
    static bind(model) {
        return new this().bind(model);
    }
}
exports.Repository = Repository;
//# sourceMappingURL=Repository.js.map