import { Model } from "./Model"
import type { TRelationModel, TSchemaModel } from "./UtilityTypes"
import type { 
    TPagination, 
    TRepositoryRequest, 
    TRepositoryRequestHandler,
    TRepositoryRequestPagination, 
    TRepositoryRequestAggregate,
    TRepositoryCreateMultiple, 
    TRepositoryCreateOrThings, 
    TRepositoryCreate, 
    TRepositoryDelete, 
    TRepositoryUpdate,
    TRepositoryUpdateMultiple
} from "../types"

class RepositoryHandler<T extends Record<string,any> = any, R = unknown> {

    constructor(private _model: { new(): Model<T, R> }) {}
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
    async first<K>(options : TRepositoryRequest<T,R> = {}) : Promise<T & K & Partial<R extends any ? T & R : R> | null> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        // @ts-ignore
        return await instance.first()
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
    async findOne<K>(options : TRepositoryRequest<T,R> = {}) : Promise<T & K & Partial<R extends any ? T & R : R> | null> {
        return await this.first(options)
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
    async get<K>(options : TRepositoryRequest<T,R>) : Promise<(T & K & Partial<R>)[]> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        // @ts-ignore
        return await instance.get()
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
    async findMany<K>(options : TRepositoryRequest<T,R> = {}) : Promise<(T & K & Partial<R>)[]> {
        return await  this.get(options)
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
    async pagination<K>(options : TRepositoryRequestPagination<T,R> = {}) : Promise<TPagination<Partial<(T & K & Partial<R>)>[]>> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.pagination({
            limit : options.limit,
            page : options.page
        }) 
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
    async paginate<K> (options : TRepositoryRequestPagination<T,R> = {}) : Promise<TPagination<Partial<(T & K & Partial<R>)>[]>> {
        return await this.pagination(options)
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
    async exists (options : TRepositoryRequestAggregate<T,R> = {}) : Promise<boolean> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.exists()
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
    toString (options : TRepositoryRequestAggregate<T,R> = {}) : string {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return instance.toString()
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
    async toJSON (options : TRepositoryRequestAggregate<T,R> = {}) : Promise<string> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.toJSON()
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
    async toArray (column : (keyof Partial<T> | `${string}.${string}`), options : TRepositoryRequestAggregate<T,R> = {}) : Promise<(any)[]> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.toArray(column as string)
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
    async count (column : (keyof Partial<T> | `${string}.${string}`), options : TRepositoryRequestAggregate<T,R> = {}) : Promise<number> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.count(column as string)
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
    async avg (column : (keyof Partial<T> | `${string}.${string}`), options : TRepositoryRequestAggregate<T,R> = {}) : Promise<number> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.avg(column as string)
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
    async sum (column : (keyof Partial<T> | `${string}.${string}`), options : TRepositoryRequestAggregate<T,R> = {}) : Promise<Number> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.sum(column as string)
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
    async max (column : (keyof Partial<T> | `${string}.${string}`), options : TRepositoryRequestAggregate<T,R> = {}) : Promise<Number> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.max(column as string)
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
    async min (column : (keyof Partial<T> | `${string}.${string}`), options : TRepositoryRequestAggregate<T,R> = {}) : Promise<Number> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

        if(options.debug != null && options.debug) instance.debug()
        
        return await instance.min(column as string)
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
    async create ({
        data,
        debug,
        transaction
    } : TRepositoryCreate<T>): Promise<T> {

        if(!Object.keys(data).length) throw new Error('The data must be required')

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.create(data as Record<string,any>).save() as Promise<T>
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
    async insert ({
        data,
        debug,
    } : TRepositoryCreate<T>): Promise<T> {
        return await this.create({
            data,
            debug
        })
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
    async createNotExists ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<T>): Promise<T | null> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createNotExists can't use without where condition")

        instance.where(where)

        return await instance.createNotExists(data as Record<string,any>).save() as Promise<T | null>

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
    async insertNotExists ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<T>): Promise<T | null> {

        return await this.createNotExists({
            data,
            where,
            debug
        })

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
    async createMultiple ({
        data,
        debug,
        transaction
    } : TRepositoryCreateMultiple<T>): Promise<T[]> {

        if(!Object.keys(data).length) throw new Error('The data must be required')

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.createMultiple(data as any[]).save() as Promise<T[]>
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
    async insertMultiple ({
        data,
        debug,
    } : TRepositoryCreateMultiple<T>): Promise<T[]> {

        return await this.createMultiple({
            data,
            debug
        })
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
    async createOrUpdate ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<T>): Promise<T> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createOrUpdate can't use without where condition")

        instance.where(where)

        return await instance.createOrUpdate(data as Record<string,any>).save() as Promise<T>

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
    async insertOrUpdate ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<T>): Promise<T> {

        return await this.createOrUpdate({
            data,
            where,
            debug
        })

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
    async createOrSelect ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<T>): Promise<T> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createOrSelect can't use without where condition")

        instance.where(where)

        return await instance.createOrSelect(data as Record<string,any>).save() as Promise<T>

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
    async insertOrSelect ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<T>): Promise<T> {

        return await this.createOrSelect({
            data,
            where,
            debug
        })

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
    async update ({
        data,
        where,
        debug,
        transaction
    } : TRepositoryUpdate<T>): Promise<T> {

        if(where == null || !Object.keys(where).length) throw new Error("The method update can't use without where condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.update(data as Record<string,any>).save() as Promise<T>

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
    async updateMany ({
        data,
        where,
        debug,
        transaction
    } : TRepositoryUpdate<T>): Promise<T[]> {

        if(where == null  || !Object.keys(where).length) throw new Error("The method updateMany can't use without where condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.updateMany(data as Record<string,any>).save() as Promise<T[]>

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
    async updateMultiple ({
        cases,
        debug,
        transaction
    } : TRepositoryUpdateMultiple<T>): Promise<T[]> {

        if(!cases.length) throw new Error("The method updateMultiple can't use without cases condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.updateMultiple(cases as any).save() as Promise<T[]>

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
    async delete ({
        where,
        debug,
        transaction
    } : TRepositoryDelete<T>): Promise<boolean> {

        if(where == null  || !Object.keys(where).length) throw new Error("The method delete can't use without where condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.delete()
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
    async deleteMany ({
        where,
        debug,
        transaction
    } : TRepositoryDelete<T>): Promise<boolean> {

        if(where == null  || !Object.keys(where).length) throw new Error("The method deleteMany can't use without where condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        instance.where(where)

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.deleteMany()
    }

    private _handlerRequest (options : TRepositoryRequestHandler<T,R>) {

        let {
            select,
            join,
            leftJoin,
            rightJoin,
            where,
            whereRaw,
            whereQuery,
            groupBy,
            having,
            orderBy,
            limit,
            offset,
            relations,
            relationsExists,
            relationQuery,
            when,
            instance
        } = options

        instance = instance == null ? new this._model() as Model : instance

        if(select != null) {
            if(select === '*')  instance.select(select)
            else instance.select(...select as string[])
        }

        if(join != null) {
            for(const v of join) {
                instance.join(v.localKey , v.referenceKey)
            }
        }

        if(leftJoin != null) {
            for(const v of leftJoin) {
                instance.leftJoin(v.localKey , v.referenceKey)
            }
        }

        if(rightJoin != null) {
            for(const v of rightJoin) {
                instance.rightJoin(v.localKey , v.referenceKey)
            }
        }

        if(where != null) {
            // @ts-ignore
            instance.whereObject(where)
        }

        if(whereRaw != null) {
            for(const raw of whereRaw) {
                instance.whereRaw(raw)
            }
        }

        if(whereQuery != null) {
            instance.whereQuery((query : Model) => {
                // @ts-ignore
                return query.whereObject(whereQuery)
            })
        }

        if(groupBy != null) {
            instance.groupBy(...groupBy as string[])
        }

        if(having != null) {
            instance.having(having)
        }

        if(orderBy != null) {
            for(const column  in orderBy) {
                //@ts-ignore
                const orderby = orderBy[column]
                instance.orderBy(column , orderby)
            }
        }

        if(limit != null) {
            instance.limit(limit)
        }

        if(offset != null) {
            instance.offset(offset)
        }

        if(relations != null) {
            instance.with(...relations as any[])
        }

        if(relationsExists != null) {
            instance.withExists(...relationsExists as any[])
        }

        if(relationQuery != null && relationQuery.name) {
            const cbRelation = instance.findWithQuery(relationQuery.name as any) as Model

            if(cbRelation != null) {
                
                const { 
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
                    when
                } = relationQuery.callback() as any
    
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
                    instance : cbRelation
                })

                if(instanceRelation != null) {
                    instance.withQuery(relationQuery.name as any , () => instanceRelation)
                }
            }
            
        }

        if(when != null && when.condition) {

            const { 
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
                when : whenCb
            } = when.callback()

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
                when : whenCb,
                instance
            }) as any
        }

        return instance
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
export class Repository {
    /**
     * 
     * The 'bind' method is used to bind the model to the repository
     * @param {Model} model A class constructor for a model
     * @returns {RepositoryHandler<T,R>}
     */
    bind<M extends Model>(
        model: new () => M
    ): RepositoryHandler<TSchemaModel<M>, TRelationModel<M>> {

        if(!(model?.prototype instanceof Model)) {

            throw new TypeError(
                `The Repository can only bind to a model, but the argument provided is not a Model.`
            );
        }

        return new RepositoryHandler<
            TSchemaModel<M>, 
            TRelationModel<M>
        >(model as new() => Model<TSchemaModel<M>,TRelationModel<M>>);
    }
    
    /**
     * 
     * The 'bind' method is used to bind the model to the repository
     * @static
     * @param {Model} model A class constructor for a model
     * @returns {RepositoryHandler<T,R>}
     */
    static bind<M extends Model>(
        model: new () => M
    ): RepositoryHandler<TSchemaModel<M>, TRelationModel<M>> {
        return new this().bind(model);
    }
}
