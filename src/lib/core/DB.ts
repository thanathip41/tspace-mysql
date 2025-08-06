import { format } from "sql-formatter";
import { AbstractDB } from "./Abstracts/AbstractDB";
import { proxyHandler } from "./Handlers/Proxy";
import { StateHandler } from "./Handlers/State";
import { Tool } from "../tools";
import { PoolConnection } from "./Pool";
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
} from "../types";

/**
 * 'DB' Class is a component of the database system
 * @param {string?} table table name
 * @example
 * new DB('users').findMany().then(results => console.log(results))
 */
class DB extends AbstractDB {
  constructor(table?: string) {
    super();

    this._initialDB();

    if (table) this.table(table);

    return new Proxy(this, proxyHandler);
  }

  /**
   * The 'instance' method is used get instance.
   * @override
   * @static
   * @returns {DB} instance of the DB
   */
  static get instance(): DB {
    return new this();
  }

  /**
   * The 'query' method is used to execute sql statement
   *
   * @param {string} sql
   * @param {Record<string,any>} parameters
   * @returns {promise<any[]>}
   */
  async query(sql: string, parameters: Record<string, any> = {}): Promise<any> {
    if (Object.keys(parameters).length) {
      let bindSql = sql;
      for (const key in parameters) {
        const parameter = parameters[key];

        if (parameter === null) {
          bindSql = bindSql.replace(`:${key}`, this.$constants("NULL"));
          continue;
        }

        if (parameter === true || parameter === false) {
          bindSql = bindSql.replace(
            `:${key}`,
            `'${parameter === true ? 1 : 0}'`
          );
          continue;
        }

        bindSql = bindSql.replace(
          `:${key}`,
          Array.isArray(parameter)
            ? `(${parameter.map((p) => `'${this.escape(p)}'`).join(",")})`
            : `'${this.escape(parameter)}'`
        );
      }
      return await this.rawQuery(bindSql);
    }
    return await this.rawQuery(sql);
  }

  /**
   * The 'query' method is used to execute sql statement
   *
   * @param {string} sql
   * @param {Record<string,any>} parameters
   * @returns {promise<any[]>}
   */
  static async query(
    sql: string,
    parameters: Record<string, any> = {}
  ): Promise<any[]> {
    return await new this().query(sql, parameters);
  }

  /**
   * The 'from' method is used to define the from table name.
   * @param {string} table table name
   * @returns {this} this
   */
  static from(table: string): DB {
    return new this().from(table);
  }

  /**
   * The 'table' method is used to define the table name.
   * @param   {string} table table name
   * @returns {DB} DB
   */
  static table(table: string): DB {
    return new this().table(table);
  }

  /**
   * The 'alias' method is used to set the table name.
   *
   * @param   {string} sql raw sql from make a new alias for this table
   * @param   {string} alias alias name
   * @returns {DB} DB
   */
  static alias(sql: string, alias: string): DB {
    return new this().alias(sql, alias);
  }

  /**
   * The 'jsonObject' method is used to specify select data to JSON objects.
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  jsonObject(object: Record<string, string>, alias: string): string {
    if (!Object.keys(object).length)
      throw new Error(
        "The method 'jsonObject' is not supported for empty object"
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
      " , "
    )}) ${this.$constants("AS")} \`${alias}\``;
  }

  /**
   * The 'jsonObject' method is used to specify select data to JSON objects.
   * @static
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  static jsonObject(object: Record<string, string>, alias: string): string {
    return new this().jsonObject(object, alias);
  }

  /**
   * The 'JSONObject' method is used to specify select data to JSON objects.
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  JSONObject(object: Record<string, string>, alias: string): string {
    return this.jsonObject(object, alias);
  }

  /**
   * The 'JSONObject' method is used to specify select data to JSON objects.
   * @static
   * @param {string} object table name
   * @param {string} alias
   * @returns {string} string
   */
  static JSONObject(object: Record<string, string>, alias: string): string {
    return new this().jsonObject(object, alias);
  }

  /**
   * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
   * @param {string} key
   * @returns {string | object} string || object
   */
  constants(key?: keyof TConstant): string | object {
    return this.$constants(key);
  }

  /**
   * The 'constants' method is used to return constants with key or none in 'DB' or 'Model'.
   * @static
   * @param {string} key
   * @returns {string | object} string || object
   */
  static constants(key?: keyof TConstant): string | Record<string, any> {
    return new this().constants(key);
  }

  /**
   * cases query
   * @param {arrayObject} cases array object {when , then }
   * @param {string?} final else condition
   * @returns {string} string
   */
  caseUpdate(
    cases: { when: string; then: string }[],
    final?: string
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
  static caseUpdate(
    cases: { when: string; then: string }[],
    final?: string
  ): string | [] {
    return new this().caseUpdate(cases, final);
  }

  /**
   * The 'generateUUID' methid is used to generate a universal unique identifier.
   * @returns {string} string
   */
  generateUUID(): string {
    return this.$utils.generateUUID();
  }

  /**
   * The 'generateUUID' methid is used to generate a universal unique identifier.
   * @static
   * @returns {string} string
   */
  static generateUUID(): string {
    return new this().generateUUID();
  }

  /**
   * The 'snakeCase' methid is used to covert value to snakeCase pattern.
   * @returns {string} string
   */
  snakeCase(value: string): string {
    return this.$utils.snakeCase(value);
  }

  /**
   * The 'snakeCase' methid is used to covert value to snake_case pattern.
   * @returns {string} string
   */
  static snakeCase(value: string): string {
    return new this().$utils.snakeCase(value);
  }

  /**
   * The 'camelCase' methid is used to covert value to camelCase pattern.
   * @returns {string} string
   */
  camelCase(value: string): string {
    return this.$utils.camelCase(value);
  }

  /**
   * The 'camelCase' methid is used to covert value to camelCase pattern.
   * @returns {string} string
   */
  static camelCase(value: string): string {
    return new this().$utils.camelCase(value);
  }

  /**
   * The 'escape' methid is used to escaping SQL injections.
   * @returns {string} string
   */
  escape(value: string): string {
    return this.$utils.escape(value, true);
  }

  /**
   * The 'escape' methid is used to escaping SQL injections.
   * @returns {string} string
   */
  static escape(value: string): string {
    return new this().escape(value);
  }

  /**
   * The 'escapeXSS' methid is used to escaping XSS characters.
   * @returns {string} string
   */
  escapeXSS(value: string): string {
    return this.$utils.escapeXSS(value);
  }

  /**
   * The 'escapeXSS' methid is used to escaping XSS characters.
   * @returns {string} string
   */
  static escapeXSS(value: string): string {
    return new this().escapeXSS(value);
  }

  /**
   * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
   * @param {string} sql
   * @returns {string} string
   */
  raw(sql: string): TRawStringQuery {
    return `${this.$constants("RAW")}${sql}` as TRawStringQuery;
  }

  /**
   * The 'raw' methid is used to allow for raw sql queries to some method in 'DB' or 'Model'.
   * @static
   * @param {string} sql
   * @returns {string} string
   */
  static raw(sql: string): TRawStringQuery {
    return `${new this().raw(sql)}` as TRawStringQuery;
  }

  /**
   * The 'freeze' methid is used to freeze the column without any pattern.
   *
   * @param {string} column
   * @returns {string} string
   */
  freeze(column: string): TFreezeStringQuery {
    return `${this.$constants("FREEZE")}${column}` as TFreezeStringQuery;
  }

  /**
   * The 'freeze' methid is used to freeze the column without any pattern.
   *
   * @static
   * @param {string} column
   * @returns {string} string
   */
  static freeze(column: string): TFreezeStringQuery {
    return new this().freeze(column) as TFreezeStringQuery;
  }

  /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @returns {Connection}
   */
  async getConnection(options?: TConnectionOptions): Promise<TPoolConnected> {
    if (options == null) {
      const pool = await this.$pool.get();
      return await pool.newConnection();
    }

    const {
      host,
      port,
      database,
      username: user,
      password,
      ...others
    } = options;

    const pool = new PoolConnection({
      host,
      port,
      database,
      user,
      password,
      ...others,
    });

    return pool.connected();
  }

  /**
   * The 'getConnection' method is used to get a pool connection.
   * @param {Object} options options for connection database with credentials
   * @property {string} option.host
   * @property {number} option.port
   * @property {string} option.database
   * @property {string} option.username
   * @property {string} option.password
   * @returns {Connection}
   */
  static async getConnection(
    options: TConnectionOptions
  ): Promise<TPoolConnected> {
    return new this().getConnection(options);
  }

  /**
   * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
   *
   * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
   *
   * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
   * ensuring data integrity.
   * @returns {ConnectionTransaction} object - Connection for the transaction
   * @type     {object} connection
   * @property {function} connection.query - execute query sql then release connection to pool
   * @property {function} connection.startTransaction - start transaction of query
   * @property {function} connection.commit - commit transaction of query
   * @property {function} connection.rollback - rollback transaction of query
   */
  async beginTransaction(): Promise<TConnectionTransaction> {
    const pool = new PoolConnection().connected()
    return await pool.connection();
  }

  /**
   * The 'beginTransaction' is a method used to initiate a database transaction within your application's code.
   *
   * A database transaction is a way to group multiple database operations (such as inserts, updates, or deletes) into a single unit of work.
   *
   * Transactions are typically used when you want to ensure that a series of database operations either all succeed or all fail together,
   * ensuring data integrity.
   * @static
   * @returns {ConnectionTransaction} object - Connection for the transaction
   * @type     {object} connection
   * @property {function} connection.query - execute query sql then release connection to pool
   * @property {function} connection.startTransaction - start transaction of query
   * @property {function} connection.commit - commit transaction of query
   * @property {function} connection.rollback - rollback transaction of query
   */
  static async beginTransaction(): Promise<TConnectionTransaction> {
    return await new this().beginTransaction();
  }

  /**
   * The 'removeProperties' method is used to removed some properties.
   *
   * @param {Array | Record} data
   * @param {string[]} propertiesToRemoves
   * @returns {Array | Record} this
   */
  removeProperties(
    data: any[] | Record<string, any>,
    propertiesToRemoves: string[]
  ): Array<any> | Record<string, any> {
    const setNestedProperty = (obj: any, path: string, value: any) => {
      const segments = path.split(".");
      let currentObj = obj;

      for (let i = 0; i < segments.length - 1; i++) {
        const segment = segments[i];

        if (!currentObj.hasOwnProperty(segment)) {
          currentObj[segment] = {};
        }

        currentObj = currentObj[segment];
      }

      const lastSegment = segments[segments.length - 1];
      currentObj[lastSegment] = value;
    };

    const remove = (
      obj: Record<string, any>,
      propertiesToRemoves: string[]
    ) => {
      const temp = JSON.parse(JSON.stringify(obj));

      for (const property of propertiesToRemoves) {
        if (property == null) continue;

        const properties = property.split(".");
        let current = temp;
        let afterProp = "";
        const props: string[] = [];
        for (let i = 0; i < properties.length - 1; i++) {
          const prop = properties[i];

          if (current[prop] == null) continue;

          props.push(prop);

          if (typeof current[prop] === "object" && current[prop] != null) {
            current = current[prop];
            afterProp = prop;
            continue;
          }

          delete current[prop];
          afterProp = prop;
        }

        const lastProp = properties[properties.length - 1];

        if (Array.isArray(current)) {
          setNestedProperty(
            temp,
            props.join("."),
            this.removeProperties(current, [afterProp, lastProp])
          );
          continue;
        }

        if (current[lastProp] == null) continue;

        delete current[lastProp];
      }

      return temp;
    };

    if (Array.isArray(data)) {
      return data.map((obj) => remove(obj, propertiesToRemoves));
    }

    return remove(data, propertiesToRemoves);
  }

  /**
   * The 'removeProperties' method is used to removed some properties.
   *
   * @param {Array | Record} data
   * @param {string[]} propertiesToRemoves
   * @returns {Array | Record} this
   */
  static removeProperties(
    data: any[] | Record<string, any>,
    propertiesToRemoves: string[]
  ): Array<any> | Record<string, any> {
    return new this().removeProperties(data, propertiesToRemoves);
  }

  /**
   *
   * This 'cloneDB' method is used to clone current database to new database
   * @param {string} database clone current database to new database name
   * @returns {Promise<boolean>}
   */
  async cloneDB(database: string): Promise<void> {
    const db = await this._queryStatement(
      `${this.$constants("SHOW_DATABASES")} ${this.$constants(
        "LIKE"
      )} '${database}'`
    );

    if (Object.values(db[0] ?? []).length)
      throw new Error(`This database : '${database}' is already exists`);

    const tables = await this.showTables();

    const backup = await this._backup({ tables, database });

    await this._queryStatement(
      `${this.$constants("CREATE_DATABASE_NOT_EXISTS")} \`${database}\``
    );

    const creating = async ({
      table,
      values,
    }: {
      table: string;
      values?: string;
    }) => {
      try {
        await this._queryStatement(table);
        if (values != null && values !== "") await this._queryStatement(values);
      } catch (e) {}
    };

    await Promise.all(
      backup.map((b) => creating({ table: b.table, values: b.values }))
    );

    return;
  }

  /**
   *
   * This 'cloneDB' method is used to clone current database to new database
   * @param {string} database clone current database to new database name
   * @returns {Promise<boolean>}
   */
  static async cloneDB(database: string): Promise<void> {
    return new this().cloneDB(database);
  }

  /**
   *
   * This 'backup' method is used to backup database intro new database same server or to another server
   * @type     {Object} backup
   * @property {string} backup.database clone current 'db' in connection to this database
   * @type     {object?} backup.to
   * @property {string} backup.to.host
   * @property {number} backup.to.port
   * @property {string} backup.to.username
   * @property {string} backup.to.password
   * @returns {Promise<void>}
   */
  async backup({ database, to }: TBackup): Promise<void> {
    if (to != null && Object.keys(to).length)
      this.connection({ ...to, database });

    return this.cloneDB(database);
  }

  /**
   *
   * This 'backup' method is used to backup database intro new database same server or to another server
   * @type     {Object} backup
   * @property {string} backup.database clone current 'db' in connection to this database
   * @type     {object?} backup.to
   * @property {string} backup.to.host
   * @property {number} backup.to.port
   * @property {string} backup.to.username
   * @property {string} backup.to.password
   * @returns {Promise<void>}
   */
  static async backup({ database, to }: TBackup): Promise<void> {
    return new this().backup({ database, to });
  }

  /**
   *
   * This 'backupToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string} backup.database
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  async backupToFile({
    filePath,
    database = `dump_${+new Date()}`,
    connection,
  }: TBackupToFile): Promise<void> {
    await this.$utils.wait(1000 * 3);

    const tables = await this.showTables();

    const backup = (await this._backup({ tables, database })).map((b) => {
      return {
        table: [
          `\n--`,
          `-- Table structure for table '${b.name}'`,
          `--\n`,
          `${format(b.table, {
            language: "spark",
            tabWidth: 2,
            linesBetweenQueries: 1,
          })}`,
        ].join("\n"),
        values:
          b.values !== ""
            ? [
                `\n--`,
                `-- Dumping data for table '${b.name}'`,
                `--\n`,
                `${b.values}`,
              ].join("\n")
            : "",
      };
    });

    if (connection != null && Object.keys(connection)?.length)
      this.connection(connection);

    let sql: string[] = [
      `--`,
      `-- tspace-mysql SQL Dump`,
      `-- https://www.npmjs.com/package/tspace-mysql`,
      `--`,
      `-- Host: mysql-db`,
      `-- Generation Time: ${new Date()}\n`,
      `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`,
      `START TRANSACTION;`,
      `--`,
      `-- Database: '${database}'`,
      `--\n`,
      `${this.$constants("CREATE_DATABASE_NOT_EXISTS")} \`${database}\`;`,
      `USE \`${database}\`;`,
      `-- --------------------------------------------------------`,
    ];

    for (const b of backup) {
      sql = [...sql, b.table];
      if (b.values) {
        sql = [...sql, b.values];
      }
    }

    Tool.fs.writeFileSync(filePath, [...sql, "COMMIT;"].join("\n"));

    return;
  }

  /**
   *
   * This 'backupToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string} backup.database
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */

  static async backupToFile({
    filePath,
    database,
    connection,
  }: TBackupToFile): Promise<void> {
    return new this().backupToFile({ filePath, database, connection });
  }

  /**
   *
   * This 'backupSchemaToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string} backup.database
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  async backupSchemaToFile({
    filePath,
    database = `dump_${+new Date()}`,
    connection,
  }: TBackupToFile): Promise<void> {
    if (connection != null && Object.keys(connection)?.length)
      this.connection(connection);

    await this.$utils.wait(1000 * 3);

    const tables = await this.showTables();

    const backup = (await this._backup({ tables, database })).map((b) => {
      return {
        table:
          format(b.table, {
            language: "spark",
            tabWidth: 2,
            linesBetweenQueries: 1,
          }) + "\n",
      };
    });

    let sql: string[] = [
      `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";`,
      `START TRANSACTION;`,
      `SET time_zone = "+00:00";`,
      `${this.$constants("CREATE_DATABASE_NOT_EXISTS")} \`${database}\`;`,
      `USE \`${database}\`;`,
    ];

    for (const b of backup) sql = [...sql, b.table];

    Tool.fs.writeFileSync(filePath, [...sql, "COMMIT;"].join("\n"));

    return;
  }

  /**
   *
   * This 'backupSchemaToFile' method is used to backup database intro new ${file}.sql
   *
   * @type {Object}  backup
   * @property {string} backup.database
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  static async backupSchemaToFile({
    filePath,
    database,
    connection,
  }: TBackupToFile): Promise<void> {
    return new this().backupSchemaToFile({ filePath, database, connection });
  }

  /**
   *
   * This 'backupTableToFile' method is used to backup database intro new ${file}.sql
   *
   * @type {Object}  backup
   * @property {string} backup.database
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  async backupTableToFile({
    filePath,
    table,
    connection,
  }: TBackupTableToFile): Promise<void> {
    if (connection != null && Object.keys(connection)?.length)
      this.connection(connection);

    /**
     *
     * wait for the connection to new db connected
     */
    await this.$utils.wait(1000 * 5);

    const schemas = await this.showSchema(table);

    const createTableSQL: string[] = [
      `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
      `\`${table}\``,
      `(${schemas.join(",")})`,
      `${this.$constants("ENGINE")};`,
    ];

    const values = await this.showValues(table);

    let valueSQL: string[] = [];

    if (values.length) {
      const columns = await this.showColumns(table);
      valueSQL = [
        `${this.$constants("INSERT")}`,
        `\`${table}\``,
        `(${columns.map((column: string) => `\`${column}\``).join(",")})`,
        `${this.$constants("VALUES")} ${values.join(",")};`,
      ];
    }

    const sql = [
      format(createTableSQL.join(" "), {
        language: "mysql",
        tabWidth: 2,
        linesBetweenQueries: 1,
      }) + "\n",
      valueSQL.join(" "),
    ];

    Tool.fs.writeFileSync(filePath, [...sql, "COMMIT;"].join("\n"));

    return;
  }

  /**
   *
   * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string} backup.table
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  static async backupTableToFile({
    filePath,
    table,
    connection,
  }: TBackupTableToFile): Promise<void> {
    return new this().backupTableToFile({ filePath, table, connection });
  }

  /**
   *
   * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string} backup.database
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  async backupTableSchemaToFile({
    filePath,
    table,
    connection,
  }: TBackupTableToFile): Promise<void> {
    const schemas = await this.showSchema(table);
    const createTableSQL: string[] = [
      `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
      `\`${table}\``,
      `(${schemas.join(",")})`,
      `${this.$constants("ENGINE")};`,
    ];

    const sql = [createTableSQL.join(" ")];

    if (connection != null && Object.keys(connection)?.length)
      this.connection(connection);

    await this.$utils.wait(1000 * 5);

    Tool.fs.writeFileSync(
      filePath,
      format(sql.join("\n"), {
        language: "spark",
        tabWidth: 2,
        linesBetweenQueries: 1,
      })
    );

    return;
  }

  /**
   *
   * This 'backupTableSchemaToFile' method is used to backup database intro new ${file}.sql
   * @type {Object}  backup
   * @property {string} backup.table
   * @property {string} backup.filePath
   * @type     {object?} backup.connection
   * @property {string} backup.connection.host
   * @property {number} backup.connection.port
   * @property {number} backup.connection.database
   * @property {string} backup.connection.username
   * @property {string} backup.connection.password
   * @returns {Promise<void>}
   */
  static async backupTableSchemaToFile({
    filePath,
    table,
    connection,
  }: TBackupTableToFile): Promise<void> {
    return new this().backupTableSchemaToFile({ filePath, table, connection });
  }

  private async _backup({
    tables,
    database,
  }: {
    tables: string[];
    database: string;
  }) {
    const backup: Array<{ table: string; values: string; name: string }> = [];

    for (const table of tables) {
      const schemas = await this.showSchema(table);
      const createTableSQL: string[] = [
        `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
        `\`${database}\`.\`${table}\``,
        `(${schemas.join(", ")})`,
        `${this.$constants("ENGINE")};`,
      ];
      const values = await this.showValues(table);

      let valueSQL: string[] = [];
      if (values.length) {
        const columns = await this.showColumns(table);
        valueSQL = [
          `${this.$constants("INSERT")}`,
          `\`${database}\`.\`${table}\``,
          `(${columns.map((column: string) => `\`${column}\``).join(", ")})`,
          `${this.$constants("VALUES")}`,
          `\n${values.join(",\n")};`,
        ];
      }
      backup.push({
        name: table == null ? "" : table,
        table: createTableSQL.join(" "),
        values: valueSQL.join(" "),
      });
    }

    return backup;
  }

  private _initialDB() {
    this.$state = new StateHandler("db");
    return this;
  }
}

export { DB };
export default DB;
