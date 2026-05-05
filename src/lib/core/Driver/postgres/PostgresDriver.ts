import { BaseDriver } from "..";
import { PostgresQueryBuilder } from "./PostgresQueryBuilder";
import type { 
  TConnection, 
  TPoolEvent 
} from "../../../types";

type PostgressConnectionOptions = {
  host                    : string;
  port                    : number;
  database                : string;
  user                    : string;
  username                : string;
  password                : string;
  connectionLimit         ?: number;
  connectTimeout          ?: number;
}

export class PostgresDriver extends BaseDriver {

  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }

  public connect(this: PostgresDriver) {
    const options  = this.options as PostgressConnectionOptions;
    const pg       = this.import("pg");

    const BIGINT_OID  = 20;
    const NUMERIC_OID = 1700;

    pg.types.setTypeParser(BIGINT_OID, (val: string) => parseInt(val, 10));

    pg.types.setTypeParser(NUMERIC_OID, (v: string | null) => {
      return v === null ? null : parseFloat(v);
    });


    const configs = {
      host                    : options.host,
      port                    : options.port,
      database                : options.database,
      user                    : options.user || options.username,
      password                : options.password,
      
      max                     : options.connectionLimit ?? 20,
      min                     : Math.max(2, Math.floor((options.connectionLimit ?? 20) / 3)),

      connectionTimeoutMillis : options.connectTimeout ?? 1000 * 60,
      keepAlive               : true,
      allowExitOnIdle         : false,
      
      idleTimeoutMillis       : 1000 * 60,
      statement_timeout       : 1000 * 60,
      query_timeout           : 1000 * 60,
    }

    this.pool = new pg.Pool(configs);

    this.poolTrx = new pg.Pool({
      ...configs,
      connectionLimit : configs.max * 1.5
    });

    this.pool.connect(async (err: any) => {
      if (err == null || !err) return;

       if(err?.message?.includes(`database "${options.database}" does not exist`)) {
      
        const db = new pg.Client({
          host                  : options.host,
          port                  : options.port,
          user                  : options.user || options.username,
          password              : options.password,
          database              : "postgres",
        })
        
        await db.connect();

        const sql = new PostgresQueryBuilder({} as any).createDatabase(options.database);
        
        await db.query(sql);
        await db.end();

        return
      }

      const message = this._messageError.bind(this);

      process.nextTick(() => {
        console.log(message(err?.message));
        return process.exit();
      });
    });

    return {
      database : () => this.options.database,
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: PostgresQueryBuilder,
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
      return this.pool.query(sql, (err: any, results: any) => {
        if (err) return reject(err);
        this._detectEventQuery({ start, sql });
        this.meta(results, sql);
        return resolve(this.returning(results));
      });
    });
  }
  private async _connection(): Promise<TConnection> {

    const conn = await this.poolTrx.connect();

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

      await conn.query('BEGIN');
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
      await conn.query('COMMIT');
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

      rollbacked = true;
      await conn.query('ROLLBACK');
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
      queryBuilder: PostgresQueryBuilder,
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
      const insertIds = (results.rows ?? []).map((v: { id: number }) => v.id);

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
        affected: Boolean(results.rowCount),
      };
    }
  }

  protected returning(results: any) {
    if (
      ["DELETE", "UPDATE", "INSERT"]
      .some((v) => results?.$meta?.command === v)
    ) {
      return results;
    }

    const { rows } = results;

    return rows;
  }
}
