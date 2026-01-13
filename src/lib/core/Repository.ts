import { TRawStringQuery } from "../types";
import { Model } from "./Model";
import { type T } from "./UtilityTypes";

class RepositoryFactory<
  TS extends Record<string, any> = Record<string, any>,
  TR = unknown,
  M extends Model<TS, TR> = Model<TS, TR>
> {
  constructor(private _model: { new (): Model<TS, TR> }) {}

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
   *       select : { id: true, name: true },
   *       where : {
   *           id: 1
   *       }
   *   })
   *
   *  const user = await userRepository.findOne()
   */
  async first<
    K  = {},
    S  extends T.SelectOptions<M>   | undefined = undefined,
    SR extends T.RelationOptions<M> | undefined = undefined,
    E  extends T.ExceptOptions<M>   | undefined = undefined,
    SRS extends Record<string, TRawStringQuery> | undefined = undefined
  >(
    options: T.RepositoryOptions<M, S, SR, E, SRS> = {}
  ): Promise<T.ResultFiltered<M, K, S, SR, E, SRS> | null> {

    const instance = this._handlerRequest(options);

    if (!instance) {
      throw new Error("The instance is not initialized");
    }

    return await instance.first() as unknown as Promise<T.ResultFiltered<M, K, S, SR, E, SRS> | null>
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
   *       select : { id: true, name: true },
   *       where : {
   *           id: 1
   *       }
   *   })
   *
   *  const user = await userRepository.findOne()
   */
  async findOne<
    K = {},
    S  extends T.SelectOptions<M>   | undefined = undefined,
    SR extends T.RelationOptions<M> | undefined = undefined,
    E  extends T.ExceptOptions<M>   | undefined = undefined,
    SRS extends Record<string, TRawStringQuery> | undefined = undefined
  >(
    options: T.RepositoryOptions<M, S, SR, E, SRS> = {}
  ): Promise<T.ResultFiltered<M, K, S, SR, E, SRS> | null> {
    return await this.first(options);
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
   *       select : { id: true, name: true },
   *       where : {
   *           id: 1
   *       }
   *   })
   *
   *  const users = await userRepository.get()
   */
  async get<
    K = {},
    S  extends T.SelectOptions<M>   | undefined = undefined,
    SR extends T.RelationOptions<M> | undefined = undefined,
    E  extends T.ExceptOptions<M>   | undefined = undefined,
    SRS extends Record<string, TRawStringQuery> | undefined = undefined
  >(
    options: T.RepositoryOptions<M, S, SR, E, SRS> = {}
  ): Promise<T.ResultFiltered<M, K, S, SR, E, SRS>[]> {
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return (await instance.get()) as unknown as Promise<
      T.ResultFiltered<M, K, S, SR, E, SRS>[]
    >;
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
   *       select : { id: true, name: true },
   *       where : {
   *           id: 1
   *       }
   *   })
   *
   *  const users = await userRepository.findMany()
   */
  async findMany<
    K = {},
    S  extends T.SelectOptions<M>   | undefined = undefined,
    SR extends T.RelationOptions<M> | undefined = undefined,
    E  extends T.ExceptOptions<M>   | undefined = undefined,
    SRS extends Record<string, TRawStringQuery> | undefined = undefined
  >(
    options: T.RepositoryOptions<M, S, SR, E, SRS> = {}
  ): Promise<T.ResultFiltered<M, K, S, SR, E, SRS>[]> {
    return await this.get(options);
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
   *       select : { id: true, name: true },
   *       where : {
   *           id: 1
   *       }
   *   })
   *
   *  const users = await userRepository.pagination({ page : 1 , limit : 2 })
   */
  async pagination<
    K = {},
    S  extends T.SelectOptions<M>   | undefined = undefined,
    SR extends T.RelationOptions<M> | undefined = undefined,
    E  extends T.ExceptOptions<M>   | undefined = undefined,
    SRS extends Record<string, TRawStringQuery> | undefined = undefined
  >(
    options: Omit<Partial<T.RepositoryOptions<M, S, SR, E, SRS>> & { page?: number },'offset'> = {}
  ): Promise<T.PaginateResultFiltered<M, K, S, SR, E, SRS>> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return (await instance.pagination({
      limit: options.limit,
      page: options.page,
    })) as unknown as Promise<T.PaginateResultFiltered<M, K, S, SR, E, SRS>>;
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
   *       select : { id: true, name: true },
   *       where : {
   *           id: 1
   *       }
   *   })
   *
   *  const users = await userRepository.paginate({ page : 1 , limit : 2 })
   */
  async paginate<
    K = {},
    S  extends T.SelectOptions<M>   | undefined = undefined,
    SR extends T.RelationOptions<M> | undefined = undefined,
    E  extends T.ExceptOptions<M>   | undefined = undefined,
    SRS extends Record<string, TRawStringQuery> | undefined = undefined
  >(
    options: Omit<Partial<T.RepositoryOptions<M, S, SR, E, SRS>> & { page?: number },'offset'> = {}
  ): Promise<T.PaginateResultFiltered<M, K, S, SR, E, SRS>> {
    //@ts-ignore
    return await this.pagination(options);
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
  async exists(
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    >
  ): Promise<boolean> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return await instance.exists();
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
  toString(
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): string {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return instance.toString();
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
  async toJSON(
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<string> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");
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
  async toArray<K extends T.ColumnKeys<M> | `${string}.${string}`>(
    column: K,
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<(K extends keyof T.Result<M> ? T.Result<M>[K] : unknown)[]> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return await instance.toArray(column);
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
  async count(
    column: T.ColumnKeys<M> | `${string}.${string}`,
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<number> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");
    return await instance.count(column as string);
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
  async avg(
    column: T.ColumnKeys<M> | `${string}.${string}`,
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<number> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");
    return await instance.avg(column as string);
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
  async sum(
    column: T.ColumnKeys<M> | `${string}.${string}`,
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<number> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return await instance.sum(column as string);
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
  async max(
    column: T.ColumnKeys<M> | `${string}.${string}`,
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<number> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

    return await instance.max(column as string);
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
  async min(
    column: T.ColumnKeys<M> | `${string}.${string}`,
    options: Partial<
      Omit<T.RepositoryOptions<M>, "relations" | "relationQuery">
    > = {}
  ): Promise<number> {
    //@ts-ignore
    const instance = this._handlerRequest(options);

    if (instance == null) throw new Error("The instance is not initialized");

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
   * @return {promise<T.Result<M>>}
   */
  async create({
    data,
    debug,
    transaction,
    noReturn,
  }: T.RepositoryCreate<M>): Promise<T.Result<M>> {
    if (!Object.keys(data).length) throw new Error("The data must be required");

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if(noReturn != null && noReturn) {
      instance.void()
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    return (await instance
      .create(data as Record<string, any>)
      .save()) as Promise<T.Result<M>>;
  }

  /**
   * The 'insert' method is used to insert a new record into a database table associated.
   *
   * It simplifies the process of creating and inserting records.
   * @type     {object}  options
   * @property {object} options.data
   * @property {?boolean} options.debug
   * @property {?transaction} options.transaction
   * @return {promise<T.Result<M>>}
   */
  async insert({ data, debug , transaction , noReturn }: T.RepositoryCreate<M>): Promise<T.Result<M>> {
    return await this.create({
      data,
      debug,
      transaction,
      noReturn
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
  async createNotExists({
    data,
    where,
    debug,
    noReturn,
    transaction
  }: T.RepositoryCreateOrThings<M>): Promise<T.Result<M> | null> {
    let instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if(noReturn != null && noReturn) {
      instance.void()
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if (where == null || !Object.keys(where).length)
      throw new Error(
        "The method createNotExists can't use without where condition"
      );

    instance.where(where);

    return (await instance
      .createNotExists(data as Record<string, any>)
      .save()) as Promise<T.Result<M> | null>;
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
  async insertNotExists({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateOrThings<M>): Promise<T.Result<M> | null> {
    return await this.createNotExists({
      data,
      where,
      debug,
      transaction,
      noReturn
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
   * @return {promise<TS[]>}
   */
  async createMultiple({
    data,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateMultiple<M>): Promise<T.Result<M>[]> {
    if (!Object.keys(data).length) throw new Error("The data must be required");

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if(noReturn != null && noReturn) {
      instance.void()
    }

    return (await instance.createMultiple(data as any[]).save()) as Promise<
      T.Result<M>[]
    >;
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
  async insertMultiple({
    data,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateMultiple<M>): Promise<T.Result<M>[]> {
    return await this.createMultiple({
      data,
      debug,
      transaction,
      noReturn
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
   * @return {promise<T.Result<M>>}
   */
  async createOrUpdate({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateOrThings<M>): Promise<T.Result<M>> {
    if (where == null || !Object.keys(where).length)
      throw new Error(
        "The method createOrUpdate can't use without where condition"
      );

    let instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if(noReturn != null && noReturn) {
      instance.void()
    }

    instance.where(where);

    return (await instance
      .createOrUpdate(data as Record<string, any>)
      .save()) as Promise<T.Result<M>>;
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
   * @return {promise<T.Result<M>>}
   */
  async insertOrUpdate({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateOrThings<M>): Promise<T.Result<M>> {
    return await this.createOrUpdate({
      data,
      where,
      debug,
      transaction,
      noReturn
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
   * @return {promise<T.Result<M>>}
   */
  async createOrSelect({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateOrThings<M>): Promise<T.Result<M>> {
    if (where == null || !Object.keys(where).length) {
      throw new Error(
        "The method createOrSelect can't use without where condition"
      );
    }

    let instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if (noReturn != null && noReturn) {
      instance.void();
    }

    instance.where(where);

    return (await instance
      .createOrSelect(data as Record<string, any>)
      .save()) as Promise<T.Result<M>>;
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
   * @return {promise<T.Result<M>>}
   */
  async insertOrSelect({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryCreateOrThings<M>): Promise<T.Result<M>> {
    return await this.createOrSelect({
      data,
      where,
      debug,
      transaction,
      noReturn
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
   * @return {promise<T.Result<M>>}
   */
  async update({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryUpdate<M>): Promise<T.Result<M>> {
    if (where == null || !Object.keys(where).length) {
      throw new Error("The method update can't use without where condition");
    }

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if (noReturn != null && noReturn) {
      instance.void();
    }

    instance.where(where);

    return (await instance
      .update(data as Record<string, any>)
      .save()) as Promise<T.Result<M>>;
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
   * @return {promise<T.Result<M>[]>}
   */
  async updateMany({
    data,
    where,
    debug,
    transaction,
    noReturn
  }: T.RepositoryUpdate<M>): Promise<T.Result<M>[]> {
    if (where == null || !Object.keys(where).length) {
      throw new Error(
        "The method updateMany can't use without where condition"
      );
    }

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if (noReturn != null && noReturn) {
      instance.void();
    }

    instance.where(where);

    return (await instance
      .updateMany(data as Record<string, any>)
      .save()) as Promise<T.Result<M>[]>;
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
  async updateCases({
    cases,
    debug,
    transaction,
    noReturn
  }: T.RepositoryUpdateMultiple<M>): Promise<T.Result<M>[]> {
    if (!cases.length) {
      throw new Error(
        "The method updateCases can't use without cases condition"
      );
    }

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    if (noReturn != null && noReturn) {
      instance.void();
    }

    return await instance.updateCases(cases as any[]).save() as Promise<T.Result<M>[]>;
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
  async delete({
    where,
    debug,
    transaction,
  }: T.RepositoryDelete<M>): Promise<boolean> {
    if (where == null || !Object.keys(where).length) {
      throw new Error("The method delete can't use without where condition");
    }

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    if (transaction != null) {
      instance.bind(transaction);
    }

    instance.where(where);

    return await instance.delete();
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
  async deleteMany({
    where,
    debug,
    transaction,
  }: T.RepositoryDelete<M>): Promise<boolean> {
    if (where == null || !Object.keys(where).length) {
      throw new Error(
        "The method deleteMany can't use without where condition"
      );
    }

    const instance = new this._model() as Model;

    if (debug != null && debug) {
      instance.debug();
    }

    instance.where(where);

    if (transaction != null) {
      instance.bind(transaction);
    }

    return await instance.deleteMany();
  }

  private _handleRelationQuery({
    instance,
    name,
    options,
    exists,
  }: {
    instance: Model;
    name: string;
    options: any;
    exists?: boolean;
  }) {
    const callbackRelation = instance.findWithQuery(name);

    if (callbackRelation == null) return null;

    if (options == null) {
      const instanceRelation = this._handlerRequest({
        instance: callbackRelation,
      });

      if (instanceRelation == null) return null;

      if (exists) {
        instance.relationQueryExists(name, () => instanceRelation);
      } else {
        instance.relationQuery(name, () => instanceRelation);
      }

      return callbackRelation;
    }

    const instanceRelation = this._handlerRequest({
      ...options,
      instance: callbackRelation,
    });

    if (instanceRelation == null) return null;

    if (exists) {
      instance.relationQueryExists(name, () => instanceRelation);
    } else {
      instance.relationQuery(name, () => instanceRelation);
    }

    return callbackRelation;
  }

  private _handlerRequest(
    options: Partial<T.RepositoryOptions<M> & { instance?: Model }>
  ) {
    let {
      cache,
      select,
      selectRaw,
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
      using,
      audit,
      instance,
    } = options;

    instance = (
      instance == null ? (new this._model() as Model) : instance
    ) as M;

    const registryRelations: any[] = [];

    if (relations != null) {
      const filterRelations: string[] = [];

      for (const name in relations) {
        const value = relations[name]

        if (typeof value === "boolean" && value) {
          filterRelations.push(name);
          continue;
        }

        const cb = this._handleRelationQuery({
          instance,
          name,
          options: { relations: value, ...value },
        });

        if (cb) registryRelations.push({ name, cb });
      }

      instance.relations(...(filterRelations as any[]));
    }

    if (relationsExists != null) {
      const filterRelations: string[] = [];

      for (const name in relationsExists) {
        const value = relationsExists[name]

        if (typeof value === "boolean" && value) {
          filterRelations.push(name);
          continue;
        }

        const cb = this._handleRelationQuery({
          instance,
          name,
          options: { ...value },
          exists: true,
        });

        if (cb) registryRelations.push({ name, cb });
      }

      instance.relationsExists(...(filterRelations as any[]));
    }

    if (cache != null) {
      instance.cache({
        key: cache.key,
        expires: cache.expires,
      });
    }

    if (select != null) {
      if (select === "*") {
        instance.select("*");
      } else {
        for (const column in select) {
          const value = select[column];

          const callbackRelation = this._handleRelationQuery({
            instance,
            name: column,
            options: { select: value },
          });

          if (callbackRelation != null) continue;

          if (value === true) instance.select(column);
        }
      }
    }

    if( selectRaw != null) {
      for (const column in selectRaw) {
        const value = selectRaw[column];
        instance.selectRaw(`${value.replace(/\s+AS\s+[\w$]+$/i, '')} AS ${column}`);
      }
    }

    if (except != null) {
      for (const column in except) {
        const value = except[column];

        const callbackRelation = this._handleRelationQuery({
          instance,
          name: column,
          options: { except: value },
        });

        if (callbackRelation != null) continue;

        if (value === true) {
          instance.except(column);
        }
      }
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
      for (const column in where) {
        const value = where[column];
        if (value === true || value === false) {
          const isRelation = instance.findWithQuery(column);

          if (isRelation) {
            if (value === true) instance.whereHas(column, (q) => q);
            if (value === false) {
              instance.whereNotHas(column, (q) => q);
            }
            delete where[column];
            continue;
          }
        }
        const callbackRelation = this._handleRelationQuery({
          instance,
          name: column,
          options: { where: value },
        });

        if (callbackRelation == null) continue;

        delete where[column];
      }

      instance.whereObject(where as Record<string, any>);
    }

    if (whereRaw != null) {
      for (const raw of whereRaw) {
        instance.whereRaw(raw);
      }
    }

    if (whereQuery != null) {
      instance.whereQuery((query: Model) => {
        //@ts-ignore
        return query.whereObject(whereQuery);
      });
    }

    if (groupBy != null) {
      for (const column in groupBy) {
        const value = groupBy[column];

        const callbackRelation = this._handleRelationQuery({
          instance,
          name: column,
          options: { groupBy: value },
        });

        if (callbackRelation != null) continue;

        instance.groupBy(column);
      }
    }

    if (having != null) {
      instance.having(having);
    }

    if (orderBy != null) {
      for (const column in orderBy) {
        const value = orderBy[column];

        const callbackRelation = this._handleRelationQuery({
          instance,
          name: column,
          options: { orderBy: value },
        });

        if (callbackRelation != null) continue;

        instance.orderBy(column, value as "ASC" | "DESC");
      }
    }

    if (limit != null) {
      instance.limit(limit);
    }

    if (offset != null) {
      instance.offset(offset);
    }

    if (when != null && when.condition) {
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
        when: callbackWhen,
      } = when.query() as T.RepositoryOptions<M>;

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
        when: callbackWhen,
        instance,
      }) as M;
    }

    if (using) using(instance as M);

    if (debug) instance.debug();

    if (hooks != null && Array.isArray(hooks)) {
      hooks.forEach((hook) => instance.hook(hook));
    }

    if (audit != null && Object.keys(audit).length) {
      instance.audit(audit.userId, audit.metadata);
    }

    return instance as M;
  }
}

/**
 *
 * The 'Repository' is a class that encapsulates all database operations related to a specific model.
 *
 * It provides methods for querying, inserting, updating, and deleting records in the database associated with the model.
 *
 * @param {Model} model A class constructor for a model
 * @returns {RepositoryFactory<T,R>}
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
export const Repository = <M extends Model<any, any>>(
  model: new () => M
): RepositoryFactory<T.SchemaModel<M>, T.RelationModel<M>, M> => {
  return new RepositoryFactory<
    T.SchemaModel<M>, 
    T.RelationModel<M>, 
    M
  >(model);
};

export default Repository;
