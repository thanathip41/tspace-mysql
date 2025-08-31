import { EventEmitter }     from 'events'
import { Tool }             from '../tools'
import { MysqlDriver }      from './Driver/mysql/MysqlDriver';
import { PostgresDriver }   from './Driver/postgres/PostgresDriver';
import { MariadbDriver }    from './Driver/mariadb/MariadbDriver';

import Config, { loadOptionsEnvironment } from "../config";

import type { TDriver, TOptions, TPoolConnected, TPoolCusterConnected, TPoolCusterOptions } from "../types";

export class PoolConnection extends EventEmitter {
  private OPTIONS : Map<string, any>    = this._loadOptions();
  private POOL    : TPoolConnected | null = null
  private CLUSTER : TPoolCusterConnected | null  = null;

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

  public connected(configs ?: Record<string,any>): TPoolConnected {

    if(this.POOL != null) {
      return this.POOL;
    }

    const options = configs ?? Object.fromEntries(this.OPTIONS);

    switch (this._driver()) {
      case "mysql":
      case "mysql2": {
        this.POOL = new MysqlDriver(options).connect();
        break
      }

      case "pg":
      case "postgres": {
        this.POOL = new PostgresDriver(options).connect();
        break
      }

      case 'mariadb': {
          this.POOL = new MariadbDriver(options).connect();
          break
      }

      default:
        throw new Error("No default driver specified");
    }

    return this.POOL
  }

  public disconnected(): void {
    const options = Object.fromEntries(this.OPTIONS);

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

  public clusterConnected () {

    if(this.CLUSTER != null) {
      return this.CLUSTER;
    }

    const options = Object.fromEntries(this.OPTIONS);
    const hostWriter   = String(options.host).split(',')[0]
    const hostReaders  = String(options.host).split(',').slice(1)

    const writer = new PoolConnection().connected({
      ...options,
      host : hostWriter
    });

    const readers = hostReaders.map((hostReader: string) => {
      return new PoolConnection().connected({ 
        ...options, host: hostReader 
      })
    })

    this.CLUSTER = {
      writer,
      readers
    }

    return this.CLUSTER
  }

  private _defaultOptions() {
    return new Map<string, number | boolean | string>(
      Object.entries({
        connectionLimit       : Number(Config.CONNECTION_LIMIT),
        dateStrings           : Boolean(Config.DATE_STRINGS),
        connectTimeout        : Number(Config.TIMEOUT),
        waitForConnections    : Boolean(Config.WAIT_FOR_CONNECTIONS),
        queueLimit            : Number(Config.QUEUE_LIMIT),
        charset               : String(Config.CHARSET),
        host                  : String(Config.HOST),
        port                  : Number(Config.PORT),
        database              : String(Config.DATABASE),
        user                  : String(Config.USERNAME),
        password              : String(Config.PASSWORD),
        multipleStatements    : Boolean(Config.MULTIPLE_STATEMENTS),
        enableKeepAlive       : Boolean(Config.ENABLE_KEEP_ALIVE),
        keepAliveInitialDelay : Number(Config.KEEP_ALIVE_DELAY),
        // ------------------ custom ----------------------------
        driver                : String(Config.DRIVER ?? "mysql2"),
        cluster               : Boolean(Config.CLUSTER ?? false)
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
const pool = new PoolConnection();

export { loadOptionsEnvironment };
export { pool as Pool };

export default pool
