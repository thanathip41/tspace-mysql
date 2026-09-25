import { AbstractDB }   from "./Abstracts/AbstractDB";
import { StateManager } from "./StateManager";
import { Package }      from "../core/Package";

import Pool, { 
  PoolConnection 
} from "./Pool";

import type {
  TConstant,
  TBackup,
  TBackupTableToFile,
  TBackupToFile,
  TPoolConnected,
  TConnectionOptions,
  TConnectionTransaction,
  TRawStringQuery,
  TFreezeStringQuery,
  TDriver,
  TPoolEvent,
  TConnection,
} from "../types";

/**
 * The 'DB' class is a component of the database system
 * @param {string?} table table name
 * @example
 * new DB('users').findMany().then(results => console.log(results))
 */
class DB extends AbstractDB {
  constructor(table?: string) {
    super();

    this._initialDB();

    if (table) this.table(table);
  }

  /**
   * The 'instance' method is used get instance.
   * @override
   * @static
   * @returns {DB} instance of the DB
   */
  public static get instance(): DB {
    return new this();
  }

  /**
   * The 'initialize' method is used to initialize the database,
   * and check if it is connected properly.
   *
   * @returns {promise<void>}
   */
  public async initialize(): Promise<void> {
    const sql = `${this.$constants("SELECT")} 1`
    await this.query(sql)
    .catch(async () => {
      await new Promise(r => setTimeout(r, 3000));
      await this.query(sql)
    })
    return;
  }

  /**
   * The 'initialize' method is used to initialize the database,
   * and check if it is connected properly.
   *
   * @returns {promise<void>}
   */
  public static async initialize(): Promise<void> {
    return await new this().initialize();
  }

  /**
   * This 'event' method ensures the pool is initialized before attaching
   * the given callback to the specified pool event.
   *
   * @async
   * @template TPoolEvent
   * @param {TPoolEvent} event - The name of the pool event to listen for.
   * @param {(data: any) => any} callback - A callback function invoked when the event is emitted.
   * @returns {Promise<void>} A promise that resolves once the event listener is registered.
   */
  public async event(event: TPoolEvent, callback: (data: any) => any): Promise<void> {
    await this.initialize();
    if (Pool.instance == null) return;

    Pool.instance.on(event, callback);
    return;
  }

  /**
   *
   * This 'event' method ensures the pool is initialized before attaching
   * the given callback to the specified pool event.
   *
   * @async
   * @template TPoolEvent
   * @param {TPoolEvent} event - The name of the pool event to listen for.
   * @param {(data: any) => any} callback - A callback function invoked when the event is emitted.
   * @returns {Promise<void>} A promise that resolves once the event listener is registered.
   */
  public static async event(
    event: TPoolEvent,
    callback: (data: any) => any,
  ): Promise<void> {
    return new this().event(event, callback);
  }

  /**
   * The 'query' method is used to execute sql statement
   *
   * @param {string} sql
   * @param {Record<string,any>} parameters
   * @returns {Promise<T>}
   * 
   * @example
   * Execute a query without parameters:
   * ```ts
   * const users = await db.query(
   *   'SELECT * FROM users'
   * );
   * ```
   *
   * @example
   * Execute a query with named parameters:
   * ```ts
   * const user = await db.query(
   *   'SELECT * FROM users WHERE id = :id',
   *   { id: 1 }
   * );
   * ```
   *
   * @example
   * Execute a query with multiple parameters:
   * ```ts
   * const users = await db.query(
   *   'SELECT * FROM users WHERE status = :status AND age >= :age',
   *   {
   *     status: 'active',
   *     age: 18,
   *   }
   * );
   * ```
   *
   * @example
   * Use an array parameter:
   * ```ts
   * const users = await db.query(
   *   'SELECT * FROM users WHERE id IN :ids',
   *   {
   *     ids: [1, 2, 3],
   *   }
   * );
   * ```
   * 
   * @example
   * Positional parameters using `?` placeholders:
   * ```ts
   * const users = await db.query<User[]>(
   *   'SELECT * FROM users WHERE id = ? AND status = ?',
   *   [1, 'active']
   * );
   * ```
   */
  public async query<T = any>(
    sql: string,
    parameters: 
      | (boolean | number | string | any[] | null)[]
      | Record<string, any> = {}
  ): Promise<T> {

    const boundSql = this.$utils
    .bindingParameters(
      sql,
      parameters,
      { raw : false }
    );

    return await this.rawQuery(boundSql);
  }

  /**
   * The 'query' method is used to execute sql statement
   *
   * @static
   * @param {string} sql
   * @param {Record<string,any>} parameters
   * @returns {Promise<T>}
   * 
   * @example
   * Execute a query without parameters:
   * ```ts
   * const users = await db.query(
   *   'SELECT * FROM users'
   * );
   * ```
   *
   * @example
   * Execute a query with named parameters:
   * ```ts
   * const user = await db.query(
   *   'SELECT * FROM users WHERE id = :id',
   *   { id: 1 }
   * );
   * ```
   *
   * @example
   * Execute a query with multiple parameters:
   * ```ts
   * const users = await db.query(
   *   'SELECT * FROM users WHERE status = :status AND age >= :age',
   *   {
   *     status: 'active',
   *     age: 18,
   *   }
   * );
   * ```
   *
   * @example
   * Use an array parameter:
   * ```ts
   * const users = await db.query(
   *   'SELECT * FROM users WHERE id IN :ids',
   *   {
   *     ids: [1, 2, 3],
   *   }
   * );
   * ```
   * 
   * @example
   * Positional parameters using `?` placeholders:
   * ```ts
   * const users = await db.query<User[]>(
   *   'SELECT * FROM users WHERE id = ? AND status = ?',
   *   [1, 'active']
   * );
   * ```
   */
  public static async query<T = any>(
    sql: string,
    parameters: 
      | (boolean | number | string | any[] | null)[]
      | Record<string, any> = {}
  ): Promise<T> {
    return await new this().query(sql,parameters);
  }

  /**
   * The 'stream' method is used to executes a SQL statement and asynchronously yields result rows.
   *
   * @param {string} sql - The SQL statement to execute.
   * @returns {AsyncGenerator<T>} An async generator that yields result rows.
   * 
   * @example
   * ```ts
   * import { DB } from "tspace-mysql";
   * 
   * for await (const row of DB.stream('SELECT * FROM users')) {
   *   console.log(row);
   * }
   * ```
   */
  public async *stream<T = any>(
    sql: string,
    parameters:
    | (boolean | number | string | any[] | null)[]
    | Record<string, any> = {}
  ): AsyncGenerator<T> {

    const boundSql = this.$utils
    .bindingParameters(
      sql,
      parameters,
      { raw : false }
    );

    yield* await this.$pool.stream(boundSql);
  }

  /**
   * The 'stream' method is used to executes a SQL statement and asynchronously yields result rows.
   *
   * @static
   * @param {string} sql - The SQL statement to execute.
   * @returns {AsyncGenerator<T>} An async generator that yields result rows.
   * 
   * @example
   * ```ts
   * import { DB } from "tspace-mysql";
   * 
   * for await (const row of DB.stream('SELECT * FROM users')) {
   *   console.log(row);
   * }
   */
  public static async *stream<T = any>(
    sql: string,
    parameters:
      | (boolean | number | string | any[] | null)[]
      | Record<string, any> = {}
  ): AsyncGenerator<T> {
    yield* new this().stream(sql,parameters);
  }

  /**
   * The 'from' method is used to define the from table name.
   * @param {string} table table name
   * @returns {this} this
   */
  public static from(table: string): DB {
    return new this().from(table);
  }

  /**
   * The 'table' method is used to define the table name.
   * @param   {string} table table name
   * @returns {DB} DB
   */
  public static table(table: string): DB {
    return new this().table(table);
  }

  /**
   * The 'alias' method is used to set the table name.
   *
   * @param   {string} sql raw sql from make a new alias for this table
   * @param   {string} alias alias name
   * @returns {DB} DB
   */
  public static alias(sql: string, alias: string): DB {
    return new this().alias(sql, alias);
  }

  /**
   * The 'jsonObject' method is used to specify select data to JSON objects.
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  public jsonObject(object: Record<string, string>, alias: string): string {
    if (!Object.keys(object).length)
      throw new Error(
        "The method 'jsonObject' is not supported for empty object",
      );

    let maping: string[] = [];
    for (const [key, value] of Object.entries(object)) {
      if (/\./.test(value)) {
        const [table, c] = value.split(".");
        maping = [...maping, `'${key}'`, `\`${table}\`.\`${c}\``];
        continue;
      }
      maping = [
        ...maping,
        `'${key}'`,
        `\`${this.getTableName()}\`.\`${value}\``,
      ];
    }

    return `${this.$constants("JSON_OBJECT")}(${maping.join(
      " , ",
    )}) ${this.$constants("AS")} \`${alias}\``;
  }

  /**
   * The 'jsonObject' method is used to specify select data to JSON objects.
   * @static
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  public static jsonObject(object: Record<string, string>, alias: string): string {
    return new this().jsonObject(object, alias);
  }

  /**
   * The 'JSONObject' method is used to specify select data to JSON objects.
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  public JSONObject(object: Record<string, string>, alias: string): string {
    return this.jsonObject(object, alias);
  }

  /**
   * The 'JSONObject' method is used to specify select data to JSON objects.
   * @static
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  public static JSONObject(object: Record<string, string>, alias: string): string {
    return new this().jsonObject(object, alias);
  }

  /**
   * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
   * @param {string} key
   * @returns {string | object} string || object
   */
  public constants(key?: keyof TConstant): string | object {
    return this.$constants(key);
  }

  /**
   * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
   * @static
   * @param {string} key
   * @returns {string | object} string || object
   */
  public static constants(key?: keyof TConstant): string | Record<string, any> {
    return new this().constants(key);
  }

  /**
   * cases query
   * @param {arrayObject} cases array object {when , then }
   * @param {string?} final else condition
   * @returns {string} string
   */
  public caseUpdate(
    cases: { when: string; then: string }[],
    final?: string,
  ): string | [] {
    if (!cases.length) return [];

    let query: Array<string> = [];

    for (const c of cases) {
      if (c.when == null) throw new Error(`can't find when condition`);
      if (c.then == null) throw new Error(`can't find then condition`);

      query = [
        ...query,
        `${this.$constants("WHEN")} ${c.when} ${this.$constants("THEN")} ${
          c.then
        }`,
      ];
    }

    return [
      this.$constants("RAW"),
      this.$constants("CASE"),
      query.join(" "),
      final == null ? "" : `ELSE ${final}`,
      this.$constants("END"),
    ].join(" ");
  }

  /**
   * select by cases
   * @static
   * @param {arrayObject} cases array object {when , then }
   * @param {string?} final else condition
   * @returns {this}
   */
  public static caseUpdate(
    cases: { when: string; then: string }[],
    final?: string,
  ): string | [] {
    return new this().caseUpdate(cases, final);
  }

  /**
   * The 'generateUUID' methid is used to generate a universal unique identifier.
   * @returns {string} string
   */
  public generateUUID(): string {
    return this.$utils.generateUUID();
  }

  /**
   * The 'generateUUID' methid is used to generate a universal unique identifier.
   * @static
   * @returns {string} string
   */
  public static generateUUID(): string {
    return new this().generateUUID();
  }

  /**
   * The 'snakeCase' methid is used to covert value to snakeCase pattern.
   * @returns {string} string
   */
  public snakeCase(value: string): string {
    return this.$utils.snakeCase(value);
  }

  /**
   * The 'snakeCase' methid is used to covert value to snake_case pattern.
   * @returns {string} string
   */
  public static snakeCase(value: string): string {
    return new this().$utils.snakeCase(value);
  }

  /**
   * The 'camelCase' methid is used to covert value to camelCase pattern.
   * @returns {string} string
   */
  public camelCase(value: string): string {
    return this.$utils.camelCase(value);
  }

  /**
   * The 'camelCase' methid is used to covert value to camelCase pattern.
   * @returns {string} string
   */
  public static camelCase(value: string): string {
    return new this().$utils.camelCase(value);
  }

  /**
   * The 'escape' methid is used to escaping SQL injections.
   * @returns {string} string
   */
  public escape(value: string): string {
    return this.$utils.escape(value, { hard : true });
  }

  /**
   * The 'escape' methid is used to escaping SQL injections.
   * @returns {string} string
   */
  public static escape(value: string): string {
    return new this().escape(value);
  }

  /**
   * The 'escapeXSS' methid is used to escaping XSS characters.
   * @returns {string} string
   */
  public escapeXSS(value: string): string {
    return this.$utils.escapeXSS(value);
  }

  /**
   * The 'escapeXSS' methid is used to escaping XSS characters.
   * @returns {string} string
   */
  public static escapeXSS(value: string): string {
    return new this().escapeXSS(value);
  }

  /**
   * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
   * Creates a raw SQL query with optional parameter bindings.
   *
   * @param sql - The raw SQL string. Use `?` placeholders for parameters.
   * @param parameters - Values to bind to the placeholders.
   * @returns A raw SQL query object.
   *
   * @example
   * // Select a computed column using CONCAT
   * const users = await DB
   *   .from('users')
   *   .select(
   *     'id',
   *     DB.raw(
   *       `CONCAT(firstName, ' - ', lastName) AS fullName`
   *      // `CONCAT(?, ' - ', ?) AS fullName,['firstName', 'lastName']`
   *     )
   *   )
   *   .findOne();
   */
  public raw(
    sql: string,
    parameters: 
      | (boolean | number | string | any[] | null)[]
      | Record<string, any> = {}
  ): TRawStringQuery {

    const boundSql = this.$utils.bindingParameters(sql,parameters);

    return `${this.$constants("RAW")}${boundSql}` as TRawStringQuery;
  }

  /**
   * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
   * Creates a raw SQL query with optional parameter bindings.
   *
   * @static
   * @param sql - The raw SQL string. Use `?` placeholders for parameters.
   * @param parameters - Values to bind to the placeholders.
   * @returns A raw SQL query object.
   *
   * @example
   * // Select a computed column using CONCAT
   * const users = await DB
   *   .from('users')
   *   .select(
   *     'id',
   *     DB.raw(
   *       `CONCAT(firstName, ' - ', lastName) AS fullName`
   *       // `CONCAT(?, ' - ', ?) AS fullName,['firstName', 'lastName']`
   *     )
   *   )
   *   .findOne();
   */
  public static raw(
    sql: string,
    parameters: 
      | (boolean | number | string | any[] | null)[]
      | Record<string, any> = {}
  ): TRawStringQuery {
    return `${new this().raw(sql, parameters)}` as TRawStringQuery;
  }

  /**
   * The 'freeze' methid is used to freeze the column without any pattern.
   *
   * @param {string} column
   * @returns {string} string
   */
  public freeze(column: string): TFreezeStringQuery {
    return `${this.$constants("FREEZE")}${column}` as TFreezeStringQuery;
  }

  /**
   * The 'freeze' methid is used to freeze the column without any pattern.
   *
   * @static
   * @param {string} column
   * @returns {string} string
   */
  public static freeze(column: string): TFreezeStringQuery {
    return new this().freeze(column) as TFreezeStringQuery;
  }

  /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.driver
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @returns {Connection}
   */
  public getConnection(options?: TConnectionOptions): TPoolConnected {
    
    if (options == null) {
      const pool = new PoolConnection();
      return pool.connect();
    }

    const {
      driver,
      host,
      port,
      database,
      username: user,
      password,
      ...others
    } = options;

    const pool = new PoolConnection({
      driver,
      host,
      port,
      database,
      user,
      password,
      ...others,
    });

    return pool.connect();
  }

  /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.driver
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @returns {Connection}
   */
  public static getConnection(
    options?: TConnectionOptions,
  ): TPoolConnected {
    return new this().getConnection(options);
  }

  /**
   * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
   *
   * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
   *
   * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
   * ensuring data integrity.
   * @param   {object} options
   * @property {number | undefined} options.primaryId
   * @property {number | undefined} options.nodeId
   * @returns {ConnectionTransaction} object - Connection for the transaction
   * @type     {object} connection
   * @property {function} connection.query - execute query sql then release connection to pool
   * @property {function} connection.startTransaction - start transaction of query
   * @property {function} connection.commit - commit transaction of query
   * @property {function} connection.rollback - rollback transaction of query
   */
  public async beginTransaction(options?: {
    primaryId?: number;
    nodeId?: number;
  }): Promise<TConnectionTransaction> {
    if (this.$cluster) {
      const cluster = new PoolConnection().clusterConnect();

      const masters = cluster.masters;

      if (!masters.length) {
        throw new Error("No Master available in cluster");
      }

      const length = masters.length;

      let selectedIndex: number = 0;

      if (options?.nodeId != null) {
        if (options.nodeId > length) {
          throw new Error(
            `Invalid nodeId ${options.nodeId}. Cluster has only ${length} master node(s).`,
          );
        }
        selectedIndex = options.nodeId - 1;
      } else if (options?.primaryId != null) {
        selectedIndex = Math.round(options.primaryId % length);
      }

      const writer = masters[selectedIndex];

      if (writer == null) {
        throw new Error("No Master available in cluster");
      }

      return await writer.connection();
    }

    return await this.$pool.transaction();
  }

  /**
   * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
   *
   * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
   *
   * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
   * ensuring data integrity.
   * @param   {object} options
   * @property {number | undefined} options.primaryId
   * @property {number | undefined} options.nodeId
   * @static
   * @returns {ConnectionTransaction} object - Connection for the transaction
   * @type     {object} connection
   * @property {function} connection.query - execute query sql then release connection to pool
   * @property {function} connection.startTransaction - start transaction of query
   * @property {function} connection.commit - commit transaction of query
   * @property {function} connection.rollback - rollback transaction of query
   */
  public static async beginTransaction(options?: {
    primaryId?: number;
    nodeId?: number;
  }): Promise<TConnectionTransaction> {
    return await new this().beginTransaction(options);
  }

  /**
   * Execute a database transaction.
   *
   * This method will:
   * - Acquire a connection from the pool
   * - Start a transaction
   * - Execute the provided handler
   * - Commit if successful
   * - Rollback if any error occurs
   *
   * @template T
   * @param {(conn: TConnection) => Promise<T>} handler - Async function that receives the transaction connection.
   * All queries inside this handler MUST use the provided `conn` instance.
   *
   * @returns {Promise<T>} The result returned from the handler.
   *
   */
  public async transaction<T>(handler: (conn: TConnection) => Promise<T>): Promise<T> {
    const trx = await this.$pool.transaction();
    
    try {
      await trx.startTransaction();
      const results = await handler(trx);
      await trx.commit();
      return results;
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

   /**
   * Execute a database transaction.
   *
   * This method will:
   * - Acquire a connection from the pool
   * - Start a transaction
   * - Execute the provided handler
   * - Commit if successful
   * - Rollback if any error occurs
   *
   * @template T
   * @param {(conn: TConnection) => Promise<T>} handler - Async function that receives the transaction connection.
   * All queries inside this handler MUST use the provided `conn` instance.
   *
   * @returns {Promise<T>} The result returned from the handler.
   *
   */
  public static async transaction<T>(handler: (conn: TConnection) => Promise<T>): Promise<T> {
    return await new this().transaction(handler);
  }


  /**
   * The 'getActiveConnections' method is used to return active connections
   *
   * @returns {Promise<number>} this
   */
  public async getActiveConnections () : Promise<number> {
    const current = await new DB()
    .query(this._queryBuilder().getActiveConnections());

    return Number(current[0]?.Connections || 0)
  }

  /**
   * The 'getActiveConnections' method is used to return active connections
   *
   * @returns {Promise<number>} this
   */
  public static async getActiveConnections () : Promise<number> {
    return await new this().getActiveConnections();
  }

  /**
   * The 'getMaxConnections' method is used to return max connections
   *
   * @returns {Promise<number>} this
   */
  public async getMaxConnections () : Promise<number> {
    const current = await new DB()
    .query(this._queryBuilder().getMaxConnections());

    return Number(current[0]?.MaxConnections || 0)
  }

  /**
   * The 'getMaxConnections' method is used to return max connections
   *
   * @returns {Promise<number>} this
   */
  public static async getMaxConnections () : Promise<number> {
    return await new this().getMaxConnections()
  }

  /**
   *
   * This 'backup' method is used to backup database intro new database same server or to another server
   * @type     {Object} backup
   * @property {string} backup.database clone current 'db' in connection to this database
   * @property {string[]} backup.excludes
   * @type     {object?} backup.to
   * @property {string} backup.to.host
   * @property {number} backup.to.port
   * @property {string} backup.to.username
   * @property {string} backup.to.password
   * @returns {Promise<void>}
   */
  public async backup({ database , excludes , to }: TBackup): Promise<void> {

    const qb = this._queryBuilder();

    const db = await new DB()
    .query(qb.getDatabase(database));

    if (Object.values(db[0] ?? []).length) {
      throw new Error(`This database : '${database}' is already exists`);
    }

    const raws = await this.getTables();

    const tables = raws.filter(r => !excludes?.includes(r));

    await new DB()
    .query(qb.createDatabase(database));

    const connTarget = new DB().getConnection({
      ...(to ?? this.$credentials),
      database,
    });

    for (const table of tables) {

      const schema = await new DB()
        .debug(this.$state.get("DEBUG"))
        .showSchema(table);

      await new DB()
      .debug(this.$state.get("DEBUG"))
      .bind(connTarget)
      .query(
        qb.createTable({
          database,
          table,
          schema,
        }),
      );

      const pageSize = 1000;
      let offset = 0;

      while (true) {

        const values = await new DB(table)
          .debug(this.$state.get("DEBUG"))
          .limit(pageSize)
          .offset(offset)
          .get();

        if (!values.length) {
          break;
        }

        await new DB(table)
          .debug(this.$state.get("DEBUG"))
          .createMultiple([...values])
          .bind(connTarget)
          .void()
          .save();

        offset += values.length;

        if (values.length < pageSize) {
          break;
        }
      }

    }

    return;
  }

  /**
   *
   * This 'backup' method is used to backup database intro new database same server or to another server
   * @type     {Object} backup
   * @property {string} backup.database clone current 'db' in connection to this database
   * @property {string[]} backup.excludes
   * @type     {object?} backup.to
   * @property {string} backup.to.host
   * @property {number} backup.to.port
   * @property {string} backup.to.username
   * @property {string} backup.to.password
   * @returns {Promise<void>}
   */
  public static async backup({ database, excludes , to }: TBackup): Promise<void> {
    return new this().backup({ database, excludes, to });
  }

  /**
   *
   * This 'backupToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string?} backup.database
   * @property {string} backup.filePath
   * @property {string[]} backup.excludes
   * @property {boolean?} backup.value
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  public async backupToFile({
    filePath,
    excludes,
    only,
    database = `dump_${+new Date()}`,
    value = false
  }: TBackupToFile): Promise<void> {
   
    const raws = only ? only : await this.getTables();

    const tables = raws.filter(r => !excludes?.includes(r));

    const backupSQL = await this._backupToSQL({ tables, database , value })

    const backupMap = backupSQL.map(
      (b) => {
        return {
          name : b.name,
          table:
            [
              `\n--`,
              `-- Table structure for table '${b.name}'`,
              `--\n`,
              `${this.$utils.sqlFormatted(b.table())}`,
            ].join("\n") + ";",

          values: b.values().length
            ? [
                `\n--`,
                `-- Dumping data for table '${b.name}'`,
                `--\n`,
                `${b
                  .values()
                  .map((v) => v)
                  .join("\n")}`,
              ].join("\n")
            : "",
        };
      },
    );

    const qb = this._queryBuilder();
      
    let sql: string[] = [
      `--`,
      `-- tspace-mysql SQL Dump`,
      `-- https://www.npmjs.com/package/tspace-mysql`,
      `--`,
      `-- Driver: '${this.$driver}'`,
      `-- Generation Time: ${new Date()}\n`,
      `--`,
      `-- Database: '${database}'`,
      `--\n`,
      `${qb.createDatabase(database)};`,
      `${qb.useDatabase(database)};`,
      `--\n`,
      `-- --------------------------------------------------------`,
    ].map(v => qb.format(v));

    await Package.fs.promises.mkdir(
      Package.path.dirname(filePath),
      { recursive: true },
    );

    const stream = Package.fs.createWriteStream(filePath, {
      encoding: "utf8",
    });

    const write = async (data: string): Promise<void> => {
      if (stream.write(data)) {
        return;
      }

      await new Promise<void>((resolve) => {
        stream.once("drain", resolve);
      });
    };

    try {

      stream.write(sql.join('\n'));
      stream.write("\n");

      for (let i = 0; i < backupMap.length; i++) {
        const b = backupMap[i];

        await write(b.table);

        if (b.values) {
          await write("\n");
          await write(b.values);
        }

        await write("\n");

        const progress = Math.round(
          ((i + 1) / backupMap.length) * 100,
        );

        console.log(`[${progress}%] write table: ${b.name}`);
      }

      stream.end();

      await new Promise<void>((resolve) => {
        stream.once("finish", resolve);
      });

    } catch (error) {
      stream.destroy();
      throw error;
    }
   

    return;
  }

  /**
   *
   * This 'backupToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string?} backup.database
   * @property {string} backup.filePath
   * @property {string[]} backup.excludes
   * @property {boolean?} backup.value
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  public static async backupToFile({
    filePath,
    database,
    excludes,
    only,
    value
  }: TBackupToFile): Promise<void> {

    if(excludes) {
      return new this().backupToFile({ filePath, database, excludes , value });
    };

    return new this().backupToFile({ filePath, database, only , value });
  }

  private async _backupToSQL({
    tables,
    database,
    value
  }: {
    tables: string[];
    database: string;
    value : boolean;
  }) {
    const backup: Array<{
      table: () => string;
      values: () => string[];
      name: string;
    }> = [];

    for (const table of tables) {
      const schema = await this.showSchema(table);

      if(!value) {
          backup.push({
          name: table ?? "",

          table: () => {
            const createTable = this._queryBuilder().createTable({
              database,
              table,
              schema
            });

            return `${createTable}`
          },

          values: () => [],
        });

        continue;
      }

      const str: string[] = [];
      const pageSize = 100;
      let offset = 0;

      while (true) {
        const values = await this.table(table)
          .limit(pageSize)
          .offset(offset)
          .get();

        if (!values.length) break;

        const sql = this.table(table)
          .createMultiple([...values])
          .toString();

        str.push(`${sql};`);

        offset += pageSize;

        if (values.length < pageSize) {
          break;
        }
      }

      backup.push({
        name: table ?? "",

        table: () => {
          const createTable = this._queryBuilder().createTable({
            database,
            table,
            schema
          });

          return `${createTable}`
        },

        values: () => str,
      });
    }

    return backup;
  }

  private _initialDB() {
    this.$state = new StateManager("db");
    return this;
  }
}

export { DB };
export default DB;
