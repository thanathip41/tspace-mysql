import { Model } from "./Model";
import { TRelationModel, TShemaModel } from "./UtilityTypes";
import { TPagination, TRepositoryRequest, TRepositoryRequestPagination, TRepositoryRequestAggregate, TRepositoryCreateMultiple, TRepositoryCreateOrThings, TRepositoryCreate, TRepositoryDelete, TRepositoryUpdate, TRepositoryUpdateMultiple } from "../types";
declare class RepositoryHandler<T extends Record<string, any> = any, R = unknown> {
    private _model;
    constructor(_model: {
        new (): Model<T, R>;
    });
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
    first<K>(options?: TRepositoryRequest<T, R>): Promise<T & K & Partial<R extends any ? T & R : R> | null>;
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
    findOne<K>(options?: TRepositoryRequest<T, R>): Promise<T & K & Partial<R extends any ? T & R : R> | null>;
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
    get<K>(options?: TRepositoryRequest<T, R>): Promise<(T & K & Partial<R>)[]>;
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
    findMany<K>(options?: TRepositoryRequest<T, R>): Promise<(T & K & Partial<R>)[]>;
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
    pagination<K>(options?: TRepositoryRequestPagination<T, R>): Promise<TPagination<Partial<(T & K & Partial<R>)>[]>>;
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
    paginate<K>(options?: TRepositoryRequestPagination<T, R>): Promise<TPagination<Partial<(T & K & Partial<R>)>[]>>;
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
    exists(options?: TRepositoryRequestAggregate<T, R>): Promise<boolean>;
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
    toString(options?: TRepositoryRequestAggregate<T, R>): string;
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
    toJSON(options?: TRepositoryRequestAggregate<T, R>): Promise<string>;
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
    toArray(column: (keyof Partial<T> | `${string}.${string}`), options?: TRepositoryRequestAggregate<T, R>): Promise<(any)[]>;
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
    count(column: (keyof Partial<T> | `${string}.${string}`), options?: TRepositoryRequestAggregate<T, R>): Promise<number>;
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
    avg(column: (keyof Partial<T> | `${string}.${string}`), options?: TRepositoryRequestAggregate<T, R>): Promise<number>;
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
    sum(column: (keyof Partial<T> | `${string}.${string}`), options?: TRepositoryRequestAggregate<T, R>): Promise<Number>;
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
    max(column: (keyof Partial<T> | `${string}.${string}`), options?: TRepositoryRequestAggregate<T, R>): Promise<Number>;
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
    min(column: (keyof Partial<T> | `${string}.${string}`), options?: TRepositoryRequestAggregate<T, R>): Promise<Number>;
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
    create({ data, debug, transaction }: TRepositoryCreate<T>): Promise<T>;
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
    insert({ data, debug, }: TRepositoryCreate<T>): Promise<T>;
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
    createNotExists({ data, where, debug }: TRepositoryCreateOrThings<T>): Promise<T | null>;
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
    insertNotExists({ data, where, debug }: TRepositoryCreateOrThings<T>): Promise<T | null>;
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
    createMultiple({ data, debug, transaction }: TRepositoryCreateMultiple<T>): Promise<T[]>;
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
    insertMultiple({ data, debug, }: TRepositoryCreateMultiple<T>): Promise<T[]>;
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
    createOrUpdate({ data, where, debug }: TRepositoryCreateOrThings<T>): Promise<T>;
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
    insertOrUpdate({ data, where, debug }: TRepositoryCreateOrThings<T>): Promise<T>;
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
    createOrSelect({ data, where, debug }: TRepositoryCreateOrThings<T>): Promise<T>;
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
    insertOrSelect({ data, where, debug }: TRepositoryCreateOrThings<T>): Promise<T>;
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
    update({ data, where, debug, transaction }: TRepositoryUpdate<T>): Promise<T>;
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
    updateMany({ data, where, debug, transaction }: TRepositoryUpdate<T>): Promise<T[]>;
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
     */
    updateMultiple({ cases, where, debug, transaction }: TRepositoryUpdateMultiple<T[]>): Promise<T[]>;
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
    delete({ where, debug, transaction }: TRepositoryDelete<T>): Promise<boolean>;
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
    deleteMany({ where, debug, transaction }: TRepositoryDelete<T>): Promise<boolean>;
    private _handlerRequest;
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
export declare class Repository {
    /**
     *
     * The 'bind' method is used to bind the model to the repository
     * @param {Model} model A class constructor for a model
     * @returns {RepositoryHandler<T,R>}
     */
    bind<M extends Model>(model: new () => M): RepositoryHandler<TShemaModel<M>, TRelationModel<M>>;
    /**
     *
     * The 'bind' method is used to bind the model to the repository
     * @static
     * @param {Model} model A class constructor for a model
     * @returns {RepositoryHandler<T,R>}
     */
    static bind<M extends Model>(model: new () => M): RepositoryHandler<TShemaModel<M>, TRelationModel<M>>;
}
export {};
