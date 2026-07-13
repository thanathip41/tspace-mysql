import pathSystem             from "path";
import fsSystem               from "fs";
import { BaseDriver }         from "..";
import { SqliteQueryBuilder } from "./SqliteQueryBuilder";
import type { 
  TConnection, 
  TPoolEvent 
} from "../../../types";

type SqliteConnectionOptions = {
  database : string;
};

export class SqliteDriver extends BaseDriver {
  private IS_TRX_ACTIVE = false;
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  public connect(this: SqliteDriver) {
    const options  = this.options as SqliteConnectionOptions;
    const sqlite   = this.import("better-sqlite3");

    const configs = {
      path  : pathSystem.resolve(options.database),
      dir   : pathSystem.dirname(pathSystem.resolve(options.database))
    }

    if (!fsSystem.existsSync(configs.dir)) {
      fsSystem.mkdirSync(configs.dir, { recursive: true });
    }
    
    this.pool = new sqlite(configs.path);

    this.poolTrx = new sqlite(configs.path);

    return {
      database : () => options.database,
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: SqliteQueryBuilder,
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

      try {

        let results = null

        const command = this._detectQueryType(sql);

        if(command === 'SELECT') {
          results = this.pool.prepare(sql).all();
        } else if (command === 'UNKNOWN') {
          results = this.pool.exec(sql);
        } else {
          results = this.pool.prepare(sql).run();
        }

        this._detectEventQuery({ start, sql });

        this.meta(results, sql);

        return resolve(this.returning(results));

      } catch (err) {
        return reject(err);
      }
    });
  }

  private async _connection(): Promise<TConnection> {
  
    const conn = await this.poolTrx;

    let started    = false;
    let closed     = false;
    let commited   = false;
    let rollbacked = false;

    const query = async (sql: string) => {

      const start: number = Date.now();

      let results = null

      const command = this._detectQueryType(sql);

      if(command === 'SELECT') {
        results = conn.prepare(sql).all();
      } else if (command === 'UNKNOWN') {
        results = conn.exec(sql);
      } else {
        results = conn.prepare(sql).run();
      }

      this._detectEventQuery({ start, sql });
      
      this.meta(results, sql);
      
      return this.returning(results);
      
    }

    const startTransaction = async () => {

      if (closed) {
        throw new Error(this.MESSAGE_TRX_CLOSED)
      }
      // SQLite does NOT support concurrent transactions on the same connection.
      // This loop blocks execution until the previous transaction finishes (commit/rollback).
      // Without this, multiple BEGIN statements can overlap and cause:
      // "Cannot start a transaction within a transaction".
      while(this.IS_TRX_ACTIVE) {
        await new Promise(r => setTimeout(r, 1000));
      };

      this.IS_TRX_ACTIVE = true;

      await conn.exec('BEGIN IMMEDIATE');
      started = true;
      closed  = false;
      
      setTimeout(() => {
        if(commited || rollbacked) return;
        console.log(this.MESSAGE_TRX_TIMEOUT);
        rollback().catch(() => null);
      }, 1000 * this.TRX_TIMEOUT);

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
      this.IS_TRX_ACTIVE = false;

      await conn.exec('COMMIT');
      await end();

      return;
    }

    const rollback = async () => {

      if (closed) return;

      if(!started) {
        throw new Error(this.MESSAGE_TRX_NOT_STARTED);
      }

      rollbacked = true;
      this.IS_TRX_ACTIVE = false;

      await conn.exec('ROLLBACK');
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

      started = false;
      closed = true;
      this.IS_TRX_ACTIVE = false;

      return;
    }

    const release = async () => {
      if(closed) return;
      return;
    }

    return {
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: SqliteQueryBuilder,
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

    if (command === "INSERT") {
      const insertIds = results.changes > 1
        ? [...Array(results.changes)].map((_, i) => results.lastInsertRowid - i) 
        : [results.lastInsertRowid];

      results.$meta = {
        command,
        insertIds,
        affected: true,
      };
    }

    if (command === "UPDATE" || command === "DELETE") {
      results.$meta = {
        command,
        insertIds: [],
        affected: Boolean(results.changes),
      };
    }
  }
  
  protected returning(results: any) {
    if (Array.isArray(results)) return results;

    return results;
  }
}
