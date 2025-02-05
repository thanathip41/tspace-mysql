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
    TRepositoryUpdateMultiple,
    TRelationResults
} from "../types"

class RepositoryHandler<TS extends Record<string,any> = any, TR = unknown> {

    constructor(private _model: { new(): Model<TS, TR> }) {}
    /**
     * 
     * The 'first' method is used to retrieve the first record that matches the query conditions. 
     * 
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async first<K , R = TRelationResults<TR>>(options : TRepositoryRequest<TS,TR> = {}) : Promise<(unknown extends TS ? Record<string, any> : TS & K & Partial<R extends any ? TS & Partial<R> : R>) | null> {

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
      * @property {?object} options.select
     * @property {?object} options.omit
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
    async findOne<K , R = TRelationResults<TR>>(options : TRepositoryRequest<TS,TR> = {}) : Promise<(unknown extends TS ? Record<string, any> : TS & K & Partial<R extends any ? TS & Partial<R> : R>) | null> {
        return await this.first(options)
    }

    /**
     * 
     * The 'get' method is used to retrieve the get record that matches the query conditions. 
     * 
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async get<K,R = TRelationResults<TR>>(options : TRepositoryRequest<TS,TR> = {}) : Promise<(unknown extends TS ? Record<string, any> : TS & K & Partial<TR extends any ? TS & Partial<R> : R>)[]> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async findMany<K,R = TRelationResults<TR>>(options : TRepositoryRequest<TS,TR> = {}) : Promise<(unknown extends TS ? Record<string, any> : TS & K & Partial<TR extends any ? TS & Partial<R> : R>)[]> {
        return await this.get(options)
    }

    /**
     * 
     * The 'pagination' method is used to perform pagination on a set of database query results obtained through the Query Builder. 
     * 
     * It allows you to split a large set of query results into smaller, more manageable pages, 
     * making it easier to display data in a web application and improve user experience.
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async pagination<K,R = TRelationResults<TR>>(options : TRepositoryRequestPagination<TS,TR> = {}) : Promise<TPagination<(TS & K & Partial<R extends any ? TS & Partial<R> : R>)>> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async paginate<K,R = TRelationResults<TR>>(options : TRepositoryRequestPagination<TS,TR> = {}) : Promise<TPagination<(TS & K & Partial<R extends any ? TS & Partial<R> : R>)>> {
        return await this.pagination(options)
    }

    /**
     * The 'exists' method is used to determine if any records exist in the database table that match the query conditions. 
     * 
     * It returns a boolean value indicating whether there are any matching records.
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async exists (options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<boolean> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    toString (options : TRepositoryRequestAggregate<TS,TR> = {}) : string {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async toJSON (options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<string> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async toArray (column : (keyof Partial<TS> | `${string}.${string}`), options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<(any)[]> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async count (column : (keyof Partial<TS> | `${string}.${string}`), options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<number> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async avg (column : (keyof Partial<TS> | `${string}.${string}`), options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<number> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async sum (column : (keyof Partial<TS> | `${string}.${string}`), options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<Number> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async max (column : (keyof Partial<TS> | `${string}.${string}`), options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<Number> {

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
     * @property {?object} options.select
     * @property {?object} options.omit
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
    async min (column : (keyof Partial<TS> | `${string}.${string}`), options : TRepositoryRequestAggregate<TS,TR> = {}) : Promise<Number> {

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
     * @return {promise<TS>}
     */
    async create ({
        data,
        debug,
        transaction
    } : TRepositoryCreate<TS>): Promise<TS> {

        if(!Object.keys(data).length) throw new Error('The data must be required')

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.create(data as Record<string,any>).save() as Promise<TS>
    }

    /**
     * The 'insert' method is used to insert a new record into a database table associated. 
     * 
     * It simplifies the process of creating and inserting records.
     * @type     {object}  options
     * @property {object} options.data
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<TS>}
     */
    async insert ({
        data,
        debug,
    } : TRepositoryCreate<TS>): Promise<TS> {
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
    } : TRepositoryCreateOrThings<TS>): Promise<TS | null> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createNotExists can't use without where condition")

        instance.where(where)

        return await instance.createNotExists(data as Record<string,any>).save() as Promise<TS | null>

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
    } : TRepositoryCreateOrThings<TS>): Promise<TS | null> {

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
     * @return {promise<TS[]>}
     */
    async createMultiple ({
        data,
        debug,
        transaction
    } : TRepositoryCreateMultiple<TS>): Promise<TS[]> {

        if(!Object.keys(data).length) throw new Error('The data must be required')

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.createMultiple(data as any[]).save() as Promise<TS[]>
    }

    /**
     * The 'createMultiple' method is used to insert a new records into a database table associated. 
     * 
     * It simplifies the process of creating and inserting records with an array.
     * @type     {object}  options
     * @property {object[]} options.data
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<TS[]>}
     */
    async insertMultiple ({
        data,
        debug,
    } : TRepositoryCreateMultiple<TS>): Promise<TS[]> {

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
     * @return {promise<TS>}
     */
    async createOrUpdate ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<TS>): Promise<TS> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createOrUpdate can't use without where condition")

        instance.where(where)

        return await instance.createOrUpdate(data as Record<string,any>).save() as Promise<TS>

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
     * @return {promise<TS>}
     */
    async insertOrUpdate ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<TS>): Promise<TS> {

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
     * @return {promise<TS>}
     */
    async createOrSelect ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<TS>): Promise<TS> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createOrSelect can't use without where condition")

        instance.where(where)

        return await instance.createOrSelect(data as Record<string,any>).save() as Promise<TS>

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
     * @return {promise<TS>}
     */
    async insertOrSelect ({
        data,
        where,
        debug
    } : TRepositoryCreateOrThings<TS>): Promise<TS> {

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
     * @return {promise<TS>}
     */
    async update ({
        data,
        where,
        debug,
        transaction
    } : TRepositoryUpdate<TS>): Promise<TS> {

        if(where == null || !Object.keys(where).length) throw new Error("The method update can't use without where condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.update(data as Record<string,any>).save() as Promise<TS>

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
     * @return {promise<TS>}
     */
    async updateMany ({
        data,
        where,
        debug,
        transaction
    } : TRepositoryUpdate<TS>): Promise<TS[]> {

        if(where == null  || !Object.keys(where).length) throw new Error("The method updateMany can't use without where condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.updateMany(data as Record<string,any>).save() as Promise<TS[]>

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
     * @return {promise<TS[]>}
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
    } : TRepositoryUpdateMultiple<TS>): Promise<TS[]> {

        if(!cases.length) throw new Error("The method updateMultiple can't use without cases condition")

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.updateMultiple(cases as any).save() as Promise<TS[]>

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
    } : TRepositoryDelete<TS>): Promise<boolean> {

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
    } : TRepositoryDelete<TS>): Promise<boolean> {

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

    private _handleRelationQuery ({ instance , name , options } : { instance : Model , name : string , options : any }) {
        
        const cbRelation = instance.findWithQuery(name)
    
        if(cbRelation == null) return null

        if(options == null) {

            const instanceRelation = this._handlerRequest({
                instance : cbRelation
            })

            if(instanceRelation == null) return null

            instance.relationQuery(name, () => instanceRelation)

            return cbRelation
    
        }

        const instanceRelation = this._handlerRequest({
            ...options,
            instance : cbRelation
        })

    
        if(instanceRelation == null) return null

        instance.relationQuery(name, () => instanceRelation)

        return cbRelation
        
    }

    private _handlerRequest (options : TRepositoryRequestHandler<TS,TR>) {

        let {
            cache,
            select,
            omit,
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
            when,
            instance
        } = options

        instance = (instance == null ? new this._model() as Model : instance) as Model

        if(relations != null) {
            const filterRelations : string[] = []

            for(const name in relations) {

                const value = relations[name]
               
                if(typeof value === 'boolean') {

                    if(value) {
                        filterRelations.push(name)
                    }
                    continue
                }

                this._handleRelationQuery({
                    instance,
                    name,
                    options : value
                })
            }

            instance.relations(...filterRelations as any[])
        }

        if(relationsExists != null) {
            
            const filterRelations : string[] = []

            for(const name in relationsExists) {

                const value = relationsExists[name]
               
                if(typeof value === 'boolean') {

                    if(value) {
                        filterRelations.push(name)
                    }
                    continue
                }

                this._handleRelationQuery({
                    instance,
                    name,
                    options : value
                })
            }

            instance.relationsExists(...filterRelations as any[])
        }

        if(cache != null) {
            instance.cache({
                key : cache.key,
                expires: cache.expires
            })
        }

        if(select != null) {
            if(select === '*') {
                //@ts-ignore
                instance.select(select)
            }
            else {
                const selects : string[] = []

                for(const column in select) {
    
                    //@ts-ignore
                    const value = select[column]
                    
                    const cbRelation = this._handleRelationQuery({
                        instance,
                        name : column,
                        options : { select: value }
                    })

                    if(cbRelation == null) {
                        selects.push(column)
                        continue
                    }
                }
                instance.select(...selects)
            }
        }

        if(omit != null) {
            const omits : string[] = []

            for(const column in omit) {

                //@ts-ignore
                const value = omit[column]
                
                const cbRelation = this._handleRelationQuery({
                    instance,
                    name : column,
                    options : { omit: value }
                })

                if(cbRelation == null) {
                    omits.push(column)
                    continue
                }
            }

            instance.except(...omits)
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

            for(const column in where) {

                //@ts-ignore
                const value = where[column]
      
                const cbRelation = this._handleRelationQuery({
                    instance,
                    name : column,
                    options : { where: value }
                })

                if(cbRelation == null) {
                    continue
                }

                //@ts-ignore
                delete where[column]
            }

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
                when : whenCb
            } = when.query()

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
 * 
 * 
 * The 'bind' method is used to bind the model to the repository
 * @param {Model} model A class constructor for a model
 * @returns {RepositoryHandler<T,R>}
 * 
 * @example
 * import { Repository } from 'tspace-mysql'
 * import { User } from '../Models/User'
 * 
 * const userRepository = Repository(User)
 * 
 * const user = await userRepository.findOne()
 * const users = await userRepository.findMany()
 * 
 */
export const Repository = <M extends Model>(model: new () => M) : RepositoryHandler<TSchemaModel<M>, TRelationModel<M>> => {
    return new RepositoryHandler<
        TSchemaModel<M>, 
        TRelationModel<M>
    >(model as new() => Model<TSchemaModel<M>,TRelationModel<M>>);
}

export default Repository