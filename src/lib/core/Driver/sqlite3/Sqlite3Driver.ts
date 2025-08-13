import { BaseDriver } from "..";
import { Sqlite3QueryBuilder } from "./Sqlite3QueryBuilder";
import type { TConnection, TPoolEvent } from "../../../types";

export class Sqlite3Driver extends BaseDriver {
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  public connect(this: Sqlite3Driver) {
    const sqlite3 = this.import("sqlite3");
   
    sqlite3.verbose();

    this.pool = new sqlite3.Database(this.options.database);

    return {
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: Sqlite3QueryBuilder,
      query: (sql: string) => this._query(sql),
      connection: () => this._connection(),
    };
  }

  public disconnect(): void {
    this.pool.end(() => {
      this.pool = undefined;
    });
  }

  private _query(sql: string, params: any[] = []): Promise<any[]> {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      if (sql.trim().toUpperCase().startsWith("SELECT")) {
        this.pool.all(sql, params, (err:any, rows:any) => {
          if (err) return reject(err);
          this._detectEventQuery({ start, sql, results: this.returning(rows) });
          this.meta(rows, sql);
          resolve(rows);
        });
      } else {
        this.pool.run(sql, params, function (err:any) {
          if (err) return reject(err);
          //@ts-expect-error
          const results = { lastID: this.lastID, changes: this.changes };
          resolve(results as any);
        });
      }
    });
  }
  private async _connection() {
    let closeTransaction = false;

    const query = async (sql: string, params: any[] = []) => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      return await this._query(sql, params);
    };

    const startTransaction = async () => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      await query("BEGIN TRANSACTION");
    };

    const commit = async () => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      await query("COMMIT");
      closeTransaction = true;
    };

    const rollback = async () => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      await query("ROLLBACK");
      closeTransaction = true;
    };

    const end = async () => {
      closeTransaction = true;
    };

    return {
      on: (event: string, data: any) => this.on(event, data),
      query,
      queryBuilder: Sqlite3QueryBuilder,
      startTransaction,
      commit,
      rollback,
      end,
    };
  }

  protected meta(results: any, sql: string): void {
    if (Array.isArray(results)) return;
    if(results == null) return;
    if (results.$meta == null) results.$meta = {};

    const command = this._detectQueryType(sql);

    results.$meta = {
      command,
    };

    if (command === "INSERT") {
      const insertIds =
        results.affectedRows <= 1
          ? [results.affectedRows]
          : [...Array(results.affectedRows)].map(
              (_, i) => results.insertId - i
            );

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