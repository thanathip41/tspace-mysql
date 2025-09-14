import { EventEmitter }     from 'events'
import { Tool }             from '../tools'
import { MysqlDriver }      from './Driver/mysql/MysqlDriver';
import { PostgresDriver }   from './Driver/postgres/PostgresDriver';
import { MariadbDriver }    from './Driver/mariadb/MariadbDriver';
import Config, { 
  loadOptionsEnvironment 
} from "../config";
import type { 
  TDriver, 
  TOptions, 
  TPoolConnected, 
  TPoolCusterConnected 
} from "../types";

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

  public clusterConnected() {

    if (this.CLUSTER != null) {
      return this.CLUSTER;
    }

    const options = Object.fromEntries(this.OPTIONS);

    const parseList = (value: string) => String(value).split(',').map(v => v.trim());
    const getValue = (arr: any[], index: number) => arr[index] != null ? arr[index] : arr[arr.length - 1];

    const hostList = parseList(options.host);
    const hosts: string[] = [];
    const ports: number[] = [];
    const types: string[] = [];

    hostList.forEach(h => {
      let type = 'master';
      let host = h;
      let port = null;

      if (h.includes('@')) {
        [type, host] = h.split('@');
      }

      if (host.includes(':')) {
        const [hostname, portStr] = host.split(':');
        host = hostname;
        port = parseInt(portStr);
      }

      hosts.push(host);
      ports.push(port ?? 3306);
      types.push(type);
    });

    const usernames = parseList(options.user);
    const passwords = parseList(options.password);

    type TOptions = {
      host: string;
      port: number;
      username: string;
      password: string;
    };

    const writerOptions: {
      host: string;
      port: number;
      username: string;
      password: string;
    }[] = hosts
      .map((host, i) => {
        if (types[i] !== 'master') return null;
        return {
          host,
          port: getValue(ports, i),
          username: getValue(usernames, i),
          password: getValue(passwords, i)
        };
      })
      .filter(Boolean) as TOptions[];

    const writers = writerOptions.map((opt,i) => {
      return {
        pool : {
          type: 'master',
          node: +i+1,
          host: opt.host,
          port: opt.port,
          username: opt.username
        },
        ...new PoolConnection().connected({
          ...options,
          ...opt
        })
      }
    });

    const readerOptions = hosts
      .map((host, i) => {
        if (types[i] !== 'slave') return null;
        return {
          host,
          port: getValue(ports, i),
          username: getValue(usernames, i),
          password: getValue(passwords, i)
        };
      })
      .filter(Boolean) as TOptions[];

    const readers = readerOptions.map((opt,i) => {
      return {
         pool : {
          type: 'slave',
          node: +i+1,
          host: opt.host,
          port: opt.port,
          username: opt.username
        },
        ...new PoolConnection().connected({
          ...options,
          ...opt
        })
      }
    });

    if (!writers.length) {
      throw new Error('No master nodes found. Please verify your cluster config.');
    }
    
    if (!readers.length) {
      throw new Error('No slave nodes found. Please verify your cluster config.');
    }

    this.CLUSTER = {
      masters: writers,
      slaves: readers
    }

    return this.CLUSTER;
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
