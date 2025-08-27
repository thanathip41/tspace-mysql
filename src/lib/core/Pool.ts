import { EventEmitter }     from 'events'
import { Tool }             from '../tools'
import { MysqlDriver }      from './Driver/mysql/MysqlDriver';
import { PostgresDriver }   from './Driver/postgres/PostgresDriver';
import { MariadbDriver }    from './Driver/mariadb/MariadbDriver';

import options, { loadOptionsEnvironment } from "../config";

import type { TDriver, TOptions, TPoolConnected } from "../types";

export class PoolConnection extends EventEmitter {
  private OPTIONS = this._loadOptions();

  /**
   *
   * @Init a options connection pool
   */
  constructor(options?: TOptions) {
    super();
    if (options) {
      this.OPTIONS = new Map<string, number | boolean | string>(
        Object.entries({
          ...Object.fromEntries(this.OPTIONS),
          ...JSON.parse(JSON.stringify(options)),
        })
      );
    }
  }

  public connected(): TPoolConnected {
    const options = Object.fromEntries(this.OPTIONS);

    switch (this._driver()) {
      case "mysql":
      case "mysql2": {
        return new MysqlDriver(options).connect();
      }

      case "pg":
      case "postgres": {
        return new PostgresDriver(options).connect();
      }

      case 'mariadb': {
          return new MariadbDriver(options).connect()
      }

      default:
        throw new Error("No default driver specified");
    }
  }

  public disconnected(): void {
    switch (this._driver()) {
      case "mysql":
      case "mysql2": {
        return new MysqlDriver(options).disconnect();
      }

      case 'pg':
      case 'postgres': {
          return new PostgresDriver(options).disconnect()
      }

      case 'mariadb': {
          return new MariadbDriver(options).disconnect()
      }

      default:
        throw new Error("No default driver specified");
    }
  }

  private _defaultOptions() {
    return new Map<string, number | boolean | string>(
      Object.entries({
        connectionLimit: Number(options.CONNECTION_LIMIT),
        dateStrings: Boolean(options.DATE_STRINGS),
        connectTimeout: Number(options.TIMEOUT),
        waitForConnections: Boolean(options.WAIT_FOR_CONNECTIONS),
        queueLimit: Number(options.QUEUE_LIMIT),
        charset: String(options.CHARSET),
        host: String(options.HOST),
        port: Number(options.PORT),
        database: String(options.DATABASE),
        user: String(options.USERNAME),
        password: String(options.PASSWORD),
        multipleStatements: Boolean(options.MULTIPLE_STATEMENTS),
        enableKeepAlive: Boolean(options.ENABLE_KEEP_ALIVE),
        keepAliveInitialDelay: Number(options.KEEP_ALIVE_DELAY),
        driver: String(options.DRIVER ?? "mysql2"),
      })
    );
  }

  private _loadOptions() {
    try {
      /**
       *  @source data
       *  source db {
       *       host               = localhost
       *       port               = 3306
       *       database           = npm
       *       user               = root
       *       password           =
       *       connectionLimit    =
       *       dateStrings        =
       *       connectTimeout     =
       *       waitForConnections =
       *       queueLimit         =
       *       charset            =
       *   }
       */
      const dbOptionsPath = Tool.path.join(Tool.path.resolve(), "db.tspace");
      const dbOptionsExists = Tool.fs.existsSync(dbOptionsPath);

      if (!dbOptionsExists) return this._defaultOptions();

      const dbOptions: string = Tool.fs.readFileSync(dbOptionsPath, "utf8");

      const options = this._convertStringToObject(dbOptions);

      if (options == null) return this._defaultOptions();

      return new Map<string, number | boolean | string>(
        Object.entries(options)
      );
    } catch (e) {
      return this._defaultOptions();
    }
  }

  private _convertStringToObject(
    str: string,
    target = "db"
  ): Record<string, any> | null {
    if (str.toLocaleLowerCase().includes("#ignore")) return null;
    str = str.trim();
    const sources: string[] = str.split("\n\n");
    if (!sources.length) return null;
    const lines: string[] = sources[0].split("\r\n");
    if (!lines.length) return null;
    const sourceObj: Record<string, any> = {};
    let targetKey: string = "";
    for (const line of lines) {
      let [key, value] = line.split("=");
      const sourceKey: any = key.match(/source\s+(\w+)/);
      const sourceKeyClose: any = key.match(/}/g);

      if (sourceKey != null) {
        targetKey = sourceKey[1];
        continue;
      }

      if (sourceKeyClose != null && sourceKeyClose.length) {
        targetKey = "";
        continue;
      }

      if (key == null || value == null) continue;

      key = key.trim();
      value = value.trim();
      if (!sourceObj.hasOwnProperty(targetKey)) sourceObj[targetKey] = {};
      sourceObj[targetKey][key] = value;
    }

    return this._covertKeyTypeToCorrectType(sourceObj[target]) || null;
  }

  private _covertKeyTypeToCorrectType(
    data: Record<string, any>
  ): Record<string, any> {
    for (const [key, value] of Object.entries(data)) {
      if (value == null) continue;
      if (
        typeof value === "string" &&
        ["true", "false"].some((v) => value.toLowerCase() === v)
      ) {
        data[key] = JSON.parse(value.toLowerCase());
        continue;
      }
      if (/^[0-9]+$/.test(value)) data[key] = +value;
    }
    return data;
  }
  private _driver() {
    return String(this.OPTIONS.get("driver") ?? "mysql2") as TDriver;
  }
}

/**
 *
 * Connection to database when service is started
 *
 * @returns   {Connection} Connection
 * @property  {Function} Connection.query
 * @property  {Function} Connection.connection
 */
const pool = new PoolConnection().connected();

export { loadOptionsEnvironment };
export { pool as Pool };

export default pool;
