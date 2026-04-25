import mysql2                from "mysql2";
import { BaseDriver }        from "..";
import { MysqlQueryBuilder } from "./MysqlQueryBuilder";
import type { 
  TConnection, 
  TPoolEvent 
} from "../../../types";

type MysqlConnectionOptions = {
  host                    : string;
  port                    : number;
  database                : string;
  user                    : string;
  username                : string;
  password                : string;

  connectionLimit         : number;
  dateStrings             : boolean;
  connectTimeout          : number;
};

export class MysqlDriver extends BaseDriver {
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  public connect(this: MysqlDriver) {
    const options  = this.options as MysqlConnectionOptions;

    const configs = {

      host                  : options.host,
      port                  : options.port,
      database              : options.database,
      user                  : options.user || options.username,
      password              : options.password,

      connectionLimit       : options.connectionLimit ?? 20,
      connectTimeout        : options.connectTimeout ?? 1000 * 60,
      dateStrings           : options.dateStrings ?? false,

      waitForConnections    : true,
      queueLimit            : 0,

      enableKeepAlive       : true,
      keepAliveInitialDelay : 1000 * 20,
     
      maxIdle               : Math.max(2, Math.floor((options.connectionLimit ?? 20) / 3)),
      idleTimeout           : 1000 * 60,
  
      charset               : 'utf8mb4',

    }
    
    this.pool = mysql2.createPool(configs);

    this.poolTrx = mysql2.createPool({
      ...configs,
      connectionLimit : configs.connectionLimit * 1.5
    });

    this.pool.getConnection((err : any , connection:any) : void => {
      if(err) {
          const message = this._messageError.bind(this)

          process.nextTick(() => {
              if(String(err.message).includes('Pool is close')) {
                  return
              }
              console.log(message(err.message == null || err.message === '' ? err.code : err.message))     
              if(this.options.CONNECTION_ERROR) return process.exit()
          })

          return
      }

      if(this.options.CONNECTION_SUCCESS) {
          connection.query(`SHOW VARIABLES LIKE 'version%'`, (err: any, results : any[]) => {
              connection.release()
              if (err) return
              const message = [
                  results.find(v => v?.Variable_name === 'version'),
                  results.find(v => v?.Variable_name === 'version_comment')   
              ].map(v => v?.Value).join(' - ')

              console.log(this._messageConnected.bind(this)(`${message}`))
          })
      }
    })

    this.pool.on("release", (connection: unknown) => {
      this.emit("release", connection);
    });

    return {
      database : () => options.database,
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: MysqlQueryBuilder,
      query: (sql: string) => this._query(sql),
      connection: () => this._connection(),
      end: () => this._end()
    };
  }

  public disconnect(pool:any): void {
    if(pool == null) return;
    pool?.end(() => {
      pool = undefined;
    });
  }

  private _query(sql: string): Promise<any[]> {

    const start: number = Date.now();

    return new Promise<any[]>((resolve, reject) => {

      return this.pool.query(sql, (err: any, results: any[]) => {

        if (err) return reject(err);

        this._detectEventQuery({ start, sql });

        this.meta(results, sql);

        return resolve(this.returning(results));
      });
    });
  }
  private async _connection(): Promise<TConnection> {
  
    const conn = await this.poolTrx.promise().getConnection();

    let started    = false;
    let closed     = false;
      let commited = false;
    let rollbacked = false;

    const query = async (sql: string) => {

      const start: number = Date.now();

      const [ results ] = await conn.query(sql);

      this._detectEventQuery({ start, sql });
      
      this.meta(results, sql);
      
      return this.returning(results);
      
    }

    const startTransaction = async () => {

      await conn.beginTransaction();
      started = true;
      closed  = false;

      return;
    }

    const commit = async () => {

      if (closed) {
        throw new Error(this.MESSAGE_TRX_CLOSED)
      }

      if(!started) {
        throw new Error(this.MESSAGE_TRX_NOT_STARTED);
      }

      commited = true;
      await conn.commit();
      await end();

      return;
    }

    const rollback = async () => {

      if (closed) {
        throw new Error(this.MESSAGE_TRX_CLOSED)
      }

      if(!started) {
        throw new Error(this.MESSAGE_TRX_NOT_STARTED);
      }

      rollbacked = true
      await conn.rollback();
      await end();

      return;
    }

    const end = async () => {

      if (closed) return;

      if(!started) {
        throw new Error(this.MESSAGE_TRX_NOT_STARTED);
      }

      if(!commited && !rollbacked) {
        await rollback();
        return;
      }

      await conn.release();
      started = false;
      closed = true;

      return;
    }

    const release = async () => {
      if(closed) return;
      await conn.release()
      return;
    }

    return {
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: MysqlQueryBuilder,
      query,
      startTransaction,
      commit,
      rollback,
      end,
      release
    }
  }

  private async _end(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.pool.end((err:any) => {
        if(err) return reject(err);
        this.pool = undefined;
        return resolve();
      });
    });
  }

  protected meta(results: any, sql: string): void {

    if (Array.isArray(results)) return;

    if (results.$meta == null) results.$meta = {};

    const command = this._detectQueryType(sql);

    results.$meta = {
      command
    };

    if (command === "INSERT") {
       const insertIds = results.affectedRows <= 1 
        ? [results.insertId]
        : [...Array(results.affectedRows)].map((_, i) => results.insertId + i)

      results.$meta = {
        ...results.$meta,
        insertIds,
        affected: true,
      };
    }

    if (command === "UPDATE" || command === "DELETE") {
      results.$meta = {
        ...results.$meta,
        insertIds: [],
        affected: Boolean(results.affectedRows),
      };
    }
  }
  
  protected returning(results: any) {
    if (Array.isArray(results)) return results;

    return results;
  }
}
