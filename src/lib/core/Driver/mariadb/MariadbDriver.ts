import { BaseDriver }           from "..";
import { MariadbQueryBuilder }  from "./MariadbQueryBuilder";
import type { 
  TConnection, 
  TPoolEvent 
} from "../../../types";

type MariadbConnectionOptions = {
  host                    : string;
  port                    : number;
  database                : string;
  user                    : string;
  username                : string;
  password                : string;
  connectionLimit         ?: number;
  connectTimeout          ?: number;
}

export class MariadbDriver extends BaseDriver {
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  
  public connect(this: MariadbDriver) {
    const options = this.options as MariadbConnectionOptions;
    const mariadb = this.import("mariadb");

    const configs = {

      host             : options.host,
      port             : options.port,
      database         : options.database,
      user             : options.user || options.username,
      password         : options.password,

      connectionLimit  : options.connectionLimit ?? 20,
      connectTimeout   : options.connectTimeout ?? 1000 * 60,

      minimumIdle      : Math.max(2, Math.floor((options.connectionLimit ?? 20) / 3)),
      acquireTimeout   : 1000 * 20,
      idleTimeout      : 1000 * 60,
      queryTimeout     : 1000 * 60,

      pipelining       : true,
      bigIntAsNumber   : true,
      insertIdAsNumber : true,
    }

    this.pool = mariadb.createPool(configs);

    this.poolTrx = mariadb.createPool({
      ...configs,
      connectionLimit : configs.connectionLimit * 1.5
    });

    this.pool.getConnection().catch(async (err:any) => {
      if(!err) return;
      
      if(
        err?.message?.includes('Unknown database') || 
        err?.message.includes('(conn:-1, no: 45028, SQLState: HY000) pool timeout')
      ) {

        const db = await mariadb.createConnection({
          host                  : options.host,
          port                  : options.port,
          user                  : options.user || options.username,
          password              : options.password,
        })

        const sql = new MariadbQueryBuilder({} as any).createDatabase(options.database);

        await db.query(sql);

        await db.end();

        return
      }

      const message = this._messageError.bind(this)

      process.nextTick(() => {
          if(String(err.message).includes('Pool is close')) {
              return
          }
          console.log(message(err.message == null || err.message === '' ? err.code : err.message))     
          if(this.options.CONNECTION_ERROR) return process.exit()
      })

    })

    return {
      database : () => options.database,
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: MariadbQueryBuilder,
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

  private async _query(sql: string): Promise<any[]> {

    const start: number = Date.now();

    const results = await this.pool.query(sql);

    this._detectEventQuery({ start, sql });

    this.meta(results, sql);

    return this.returning(results)
  }
  
  private async _connection(): Promise<TConnection> {

    const conn = await this.poolTrx.getConnection();
    let started    = false;
    let closed     = false;
    let commited   = false;
    let rollbacked = false;

    const query = async (sql: string) => {

      const start: number = Date.now();

      const results = await conn.query(sql);

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
      queryBuilder: MariadbQueryBuilder,
      query,
      startTransaction,
      commit,
      rollback,
      end,
      release
    }
  }

  private async _end(): Promise<void> {
    await this.pool.end()
    this.pool = undefined;
  }
  
  protected meta (results : any, sql : string) : void {

    if (Array.isArray(results)) return;

    if (results.$meta == null) results.$meta = {}

    const command = this._detectQueryType(sql)

    results.$meta = {
      command
    }

    if(command === 'INSERT') {
      const insertIds = results.affectedRows <= 1 
        ? [results.insertId]
        : [...Array(results.affectedRows)].map((_, i) => results.insertId + i)

      results.$meta = {
        ...results.$meta,
        insertIds,
        affected: true
      }
    }

    if(command === 'UPDATE' || command === 'DELETE') {
      results.$meta = {
        ...results.$meta,
        insertIds: [],
        affected: Boolean(results.affectedRows)
      }
    }
  }
  protected returning (results : any) {
    
    if(Array.isArray(results)) return results

    return results
  }
}