import { BaseDriver } from "..";
import { PostgresQueryBuilder } from "./PostgresQueryBuilder";
import type { TConnection, TPoolEvent } from "../../../types";

export class PostgresDriver extends BaseDriver {
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  public connect(this: PostgresDriver) {
    const pg = this.import("pg");

    const BIGINT_OID = 20;
    const NUMERIC_OID = 1700;

    pg.types.setTypeParser(BIGINT_OID, (val: string) => parseInt(val, 10));
    pg.types.setTypeParser(NUMERIC_OID, (val: string | null) =>
      val === null ? null : parseFloat(val)
    );

    this.pool = new pg.Pool({
      host: this.options.host,
      port: this.options.port,
      database: this.options.database,
      user: this.options.user || this.options.username,
      password: this.options.password,
      
      max: this.options.connectionLimit,
      connectionTimeoutMillis: this.options.connectTimeout,
      idleTimeoutMillis: this.options.connectTimeout,
      keepAlive: this.options.enableKeepAlive ?? true,
      allowExitOnIdle: false,
    });

    this.pool.connect((err: any) => {
      if (err == null || !err) return;

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
  private _connection(): Promise<TConnection> {
    let closeTransaction = false;

    return new Promise((resolve, reject) => {
      this.pool.connect((err: any, connection: any, release: any) => {
        if (err) return reject(err);

        const query = (sql: string) => {
          const start: number = Date.now();
          return new Promise<any[]>((ok, fail) => {
            if (closeTransaction) {
              return fail(new Error(this.MESSAGE_TRX_CLOSED));
            }

            connection.query(sql, (err: any, results: any) => {
              if (err) {
                return fail(err);
              }

              this._detectEventQuery({ start, sql });

              this.meta(results, sql);

              return ok(this.returning(results));
            });
          });
        };

        const startTransaction = async () => {
          if (closeTransaction) {
            throw new Error(this.MESSAGE_TRX_CLOSED);
          }
          await query("BEGIN").catch((err) => reject(err));

          return;
        };

        const commit = async () => {
          if (closeTransaction) {
            throw new Error(this.MESSAGE_TRX_CLOSED);
          }
          await query("COMMIT").catch((err) => reject(err));

          await end();

          return;
        };

        const rollback = async () => {
          if (closeTransaction) {
            throw new Error(this.MESSAGE_TRX_CLOSED);
          }
          await query("ROLLBACK").catch((err) => reject(err));

          await end();

          return;
        };

        const end = async () => {
          await new Promise<void>((resolve) =>
            setTimeout(() => {
              if (!closeTransaction) {
                closeTransaction = true;

                // After commit the transaction, you can't perform any actions with this transaction.
                release();

                // After destroying the connection, it will be removed from the connection this.pool.
                this.pool.end();
              }

              return resolve();
            }, 500)
          );

          return;
        };

        return resolve({
          on: (event: TPoolEvent, data: any) => this.on(event, data),
          query,
          queryBuilder: PostgresQueryBuilder,
          startTransaction,
          commit,
          rollback,
          end,
        });
      });
    });
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
      command,
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
