import { Model } from "./Model"
import type { 
    T
} from "./UtilityTypes"

class RepositoryHandler<
    TS extends Record<string, any> = Record<string, any>, 
    TR = unknown, 
    TM extends Model<TS, TR> = Model<TS, TR>
> {
    constructor(private _model: { new(): Model<TS, TR> }) {}
    /**
     * 
     * The 'first' method is used to retrieve the first record that matches the query conditions. 
     * 
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
     * import { Repository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository =  Repository(User)
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
    async first<K>(options : T.RepositoryOptions<TM> = {}) : Promise<T.Result<TM,K> | null> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')
 
        return await instance.first();
    }

    /**
     * 
     * The 'findOne' method is used to retrieve the findOne record that matches the query conditions. 
     * 
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
     * import { Repository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository =  Repository(User)
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
    async findOne<K>(options : T.RepositoryOptions<TM> = {}) : Promise<T.Result<TM,K> | null> {
        return await this.first(options)
    }

    /**
     * 
     * The 'get' method is used to retrieve the get record that matches the query conditions. 
     * 
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?Object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
     * import { Repository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository =  Repository(User)
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
    async get<K>(options : T.RepositoryOptions<TM> = {}) : Promise<(T.Result<TM,K>)[]> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')
        
        return await instance.get()
    }

    /**
     * 
     * The 'get' method is used to retrieve the get record that matches the query conditions. 
     * 
     * It allows you to retrieve a single record from a database table that meets the specified criteria.
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
     * import { Repository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository =  Repository(User)
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
    async findMany<K>(options : T.RepositoryOptions<TM> = {}) : Promise<T.Result<TM,K>[]> {
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
     * @property {?object} options.except
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
     * import { Repository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository =  Repository(User)
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
    async pagination<K>(options : Partial<T.RepositoryOptions<TM>> & { page ?: number } = {}) : Promise<T.PaginateResult<TM,K>> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')

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
     * @property {?object} options.except
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
     * import { Repository } from 'tspace-mysql'
     * import { User } from '../Models/User'
     *
     * const userRepository =  Repository(User)
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
    async paginate<K>(options : Partial<T.RepositoryOptions<TM>> & { page ?: number } = {}) : Promise<T.PaginateResult<TM,K>> {
        return await this.pagination(options)
    }

    /**
     * The 'exists' method is used to determine if any records exist in the database table that match the query conditions. 
     * 
     * It returns a boolean value indicating whether there are any matching records.
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    async exists (options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>>) : Promise<boolean> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')
        
        return await instance.exists()
    }

    /**
     * The 'toString' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it. 
     * 
     * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    toString (options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}) : string {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized')
        
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
     * @property {?object} options.except
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
    async toJSON (options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}) : Promise<string> {

        const instance = this._handlerRequest(options);

        if(instance == null) throw new Error('The instance is not initialized');
;        
        return await instance.toJSON();
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
     * @property {?object} options.except
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
    async toArray (
        column : (keyof Partial<TS> | `${string}.${string}`), 
        options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}
    ) : Promise<(T.Result<TM>)[]> {

        const instance = this._handlerRequest(options)

        if(instance == null) throw new Error('The instance is not initialized');
        
        return await instance.toArray(column as string)
    }

    /**
     * The 'count' method is used to retrieve the total number of records that match the specified query conditions. 
     * 
     * It returns an integer representing the count of records.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    async count (
        column : (keyof Partial<TS> | `${string}.${string}`), 
        options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}
    ) : Promise<number> {

        const instance = this._handlerRequest(options);

        if(instance == null) throw new Error('The instance is not initialized');
;        
        return await instance.count(column as string)
    }

    /**
     * The 'avg' method is used to retrieve the total number of records that match the specified query conditions. 
     * 
     * It returns an integer representing the avg of records.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    async avg (
        column : (keyof Partial<TS> | `${string}.${string}`), 
        options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}
    ) : Promise<number> {

        const instance = this._handlerRequest(options);

        if(instance == null) throw new Error('The instance is not initialized');
;        
        return await instance.avg(column as string)
    }

    /**
     * The 'sum' method is used to retrieve the total number of records that match the specified query conditions. 
     * 
     * It returns an integer representing the sum of records.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    async sum (
        column : (keyof Partial<TS> | `${string}.${string}`), 
        options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}
    ) : Promise<number> {

        const instance = this._handlerRequest(options);

        if(instance == null) throw new Error('The instance is not initialized');

        return await instance.sum(column as string)
    }

    /**
     * The 'max' method is used to retrieve the maximum value of a numeric column in a database table. 
     * 
     * It finds the highest value in the specified column among all records that match the query conditions and returns that value.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    async max (
        column : (keyof Partial<TS> | `${string}.${string}`), 
        options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}
    ) : Promise<number> {

        const instance = this._handlerRequest(options);

        if(instance == null) throw new Error('The instance is not initialized');

        return await instance.max(column as string)
    }

    /**
     * The 'min' method is used to retrieve the minimum (lowest) value of a numeric column in a database table. 
     * 
     * It finds the smallest value in the specified column among all records that match the query conditions and returns that value.
     * @param    {string} column
     * @type     {?object}  options
     * @property {?object} options.select
     * @property {?object} options.except
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
    async min (
        column : (keyof Partial<TS> | `${string}.${string}`), 
        options : Partial<Omit<T.RepositoryOptions<TM>,'relations' | 'relationQuery'>> = {}
    ) : Promise<number> {

        const instance = this._handlerRequest(options);

        if(instance == null) throw new Error('The instance is not initialized');

        return await instance.min(column as string);
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
    } : T.RepositoryCreate<TM>): Promise<T.Result<TM>> {

        if(!Object.keys(data).length) throw new Error('The data must be required')

        const instance = new this._model() as Model
        
        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.create(data as Record<string,any>).save() as Promise<T.Result<TM>>
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
    } : T.RepositoryCreate<TM>): Promise<T.Result<TM>> {
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
    } : T.RepositoryCreateOrThings<TM>): Promise<T.Result<TM> | null> {

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(where == null  || !Object.keys(where).length) throw new Error("The method createNotExists can't use without where condition")

        instance.where(where)

        return await instance.createNotExists(data as Record<string,any>).save() as Promise<T.Result<TM> | null>

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
    } : T.RepositoryCreateOrThings<TM>): Promise<T.Result<TM> | null> {

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
    } : T.RepositoryCreateMultiple<TM>): Promise<T.Result<TM>[]> {

        if(!Object.keys(data).length) throw new Error('The data must be required')

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        return await instance.createMultiple(data as any[]).save() as Promise<T.Result<TM>[]>
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
    } : T.RepositoryCreateMultiple<TM>): Promise<T.Result<TM>[]> {

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
    } : T.RepositoryCreateOrThings<TM>): Promise<T.Result<TM>> {

        if(where == null  || !Object.keys(where).length) throw new Error("The method createOrUpdate can't use without where condition")

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

       
        instance.where(where)

        return await instance.createOrUpdate(data as Record<string,any>).save() as Promise<T.Result<TM>>

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
    } : T.RepositoryCreateOrThings<TM>): Promise<T.Result<TM>> {

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
    } : T.RepositoryCreateOrThings<TM>): Promise<T.Result<TM>> {

        if(where == null  || !Object.keys(where).length) {
            throw new Error("The method createOrSelect can't use without where condition")
        }

        let instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        instance.where(where)

        return await instance.createOrSelect(data as Record<string,any>).save() as Promise<T.Result<TM>>

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
    } : T.RepositoryCreateOrThings<TM>): Promise<T.Result<TM>> {

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
    } : T.RepositoryUpdate<TM>): Promise<T.Result<TM>> {

        if(where == null || !Object.keys(where).length) {
            throw new Error("The method update can't use without where condition")
        }

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.update(data as Record<string,any>).save() as Promise<T.Result<TM>>

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
    } : T.RepositoryUpdate<TM>): Promise<T.Result<TM>[]> {

        if(where == null  || !Object.keys(where).length) {
            throw new Error("The method updateMany can't use without where condition")
        }

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug()
        }

        if(transaction != null) {
            instance.bind(transaction)
        }

        instance.where(where)

        return await instance.updateMany(data as Record<string,any>).save() as Promise<T.Result<TM>[]>

    }

    /**
     * The 'updateCases' method is used to update records in a table based on specific conditions.
     *
     * This method allows updating multiple rows at once by specifying an array of update cases.
     * Each case defines which records to update (`when`) and the new values to apply (`columns`).
     *
     * @type     {object} options
     * @property {object} options.data
     * @property {object} options.where
     * @property {?boolean} options.debug
     * @property {?transaction} options.transaction
     * @return {promise<TS[]>}
     * @example
     * const saveUpdateMultiple = await userRepository.updateCases({
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
    async updateCases ({
        cases,
        debug,
        transaction
    } : T.RepositoryUpdateMultiple<TM>): Promise<T.Result<TM>[]> {

        if(!cases.length) {
            throw new Error("The method updateCases can't use without cases condition")
        }

        const instance = new this._model() as Model

        if(debug != null && debug) {
            instance.debug();
        }

        if(transaction != null) {
            instance.bind(transaction);
        }

        //@ts-ignore
        return await instance.updateCases(cases).save() as Promise<T.Result<TM>[]>

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
    } : T.RepositoryDelete<TM>): Promise<boolean> {

        if(where == null  || !Object.keys(where).length) {
            throw new Error("The method delete can't use without where condition")
        }

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
    } : T.RepositoryDelete<TM>): Promise<boolean> {

        if(where == null  || !Object.keys(where).length) {
            throw new Error("The method deleteMany can't use without where condition")
        }

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

    private _handleRelationQuery ({ instance , name , options , exists } : { 
        instance : Model , 
        name : string , 
        options : any , 
        exists ?: boolean 
    }) {
        
        const cbRelation = instance.findWithQuery(name)
    
        if(cbRelation == null) return null

        if(options == null) {

            const instanceRelation = this._handlerRequest({
                instance : cbRelation
            })

            if(instanceRelation == null) return null

            if(exists) {
                instance.relationQueryExists(name, () => instanceRelation)
            } else {
                instance.relationQuery(name, () => instanceRelation)
            }

            return cbRelation
    
        }

        const instanceRelation = this._handlerRequest({
            ...options,
            instance : cbRelation
        })

        if(instanceRelation == null) return null

        if(exists) {
            instance.relationQueryExists(name, () => instanceRelation)
        } else {
            instance.relationQuery(name, () => instanceRelation)
        }

        return cbRelation
    }


    private _handlerRequest (options :   Partial<T.RepositoryOptions<TM> & { instance ?: Model }>) {

        let {
            cache,
            select,
            except,
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
            hooks,
            debug,
            model,
            audit,
            instance
        } = options

        instance = (instance == null ? new this._model() as Model : instance) as TM

        const registryRelations :any[] = [];

        if(relations != null) {
            const filterRelations : string[] = []

            for(const name in relations) {

                const value = relations[name]
               
                if(typeof value === 'boolean' && value) {
                    filterRelations.push(name)
                    continue
                }

                const cb = this._handleRelationQuery({
                    instance,
                    name,
                    options : { relations: value , ...value }
                })

                if(cb) registryRelations.push({ name, cb })

            }

            instance.relations(...filterRelations as any[])
        }

        if(relationsExists != null) {
            
            const filterRelations : string[] = []

            for(const name in relationsExists) {

                const value = relationsExists[name]
               
                if(typeof value === 'boolean' && value) {
                    filterRelations.push(name)
                    continue
                }

                const cb = this._handleRelationQuery({
                    instance,
                    name,
                    options : { ...value },
                    exists : true
                })

                if(cb) registryRelations.push({ name, cb })
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
            if (select === '*') {
                instance.select('*')
            } else {
                for(const column in select) {

                    const value = select[column]
                    
                    const cbRelation = this._handleRelationQuery({
                        instance,
                        name : column,
                        options : { select : value }
                    })

                    if(cbRelation != null) continue

                    if (value === true) instance.select(column)

                }
            }
        }

    
        if(except != null) {
            for(const column in except) {

                const value = except[column]
                
                const cbRelation = this._handleRelationQuery({
                    instance,
                    name : column,
                    options : { except: value }
                })

                if(cbRelation != null) continue

               if(value === true) {
                instance.except(column)
               }
            }
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
                const value = where[column];
                if(value === true || value === false) {
                    
                    const isRelation = instance.findWithQuery(column);

                    if(isRelation) {
                        if(value === true) instance.whereHas(column,(q) => q);
                        if(value === false) {
                            console.log('where not Has')
                            instance.whereNotHas(column,(q) => q);
                        }
                        delete where[column];
                        continue
                    }
                }
                const cbRelation = this._handleRelationQuery({
                    instance,
                    name : column,
                    options : { where: value }
                })
              
                if(cbRelation == null) continue
                
                delete where[column]
            }

            instance.whereObject(where as Record<string,any>)
        }

        if(whereRaw != null) {
            for(const raw of whereRaw) {
                instance.whereRaw(raw)
            }
        }

        if(whereQuery != null) {
            instance.whereQuery((query : Model) => {
                //@ts-ignore
                return query.whereObject(whereQuery)
            })
        }

        if(groupBy != null) {
             for(const column in groupBy) {

                const value = groupBy[column]
                
                const cbRelation = this._handleRelationQuery({
                    instance,
                    name : column,
                    options : { groupBy : value }
                })

                if(cbRelation != null) continue

                instance.groupBy(column)
            }
        }

        if(having != null) {
            instance.having(having)
        }

        if(orderBy != null) {
            for(const column  in orderBy) {

                const value = orderBy[column]
                
                const cbRelation = this._handleRelationQuery({
                    instance,
                    name : column,
                    options : { orderBy : value }
                })

                if(cbRelation != null) continue

                instance.orderBy(column , value as 'ASC' | 'DESC')
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
            } = when.query() as T.RepositoryOptions<TM>

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
            }) as TM
        }

        if(model) model(instance as TM);

        if(debug) instance.debug();

        if(hooks != null && Array.isArray(hooks)) {
            hooks.forEach(hook => instance.hook(hook))
        }

        if(audit != null && Object.keys(audit).length) {
            instance.audit(audit.userId,audit.metadata)
        }

        return instance as TM
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
export const Repository = <M extends Model<any,any>>
(model: new () => M): RepositoryHandler<
    T.SchemaModel<M>, T.RelationModel<M>, M
> => {
    return new RepositoryHandler<
        T.SchemaModel<M>, 
        T.RelationModel<M>,
        M
    >(model);
}

export default Repository
