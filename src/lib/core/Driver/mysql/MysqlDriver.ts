import { BaseDriver } from "..";
import { MysqlQueryBuilder } from "./MysqlQueryBuilder";
import type { TConnection, TPoolEvent } from "../../../types";

type MysqlConnectionOptions = {
  connectionLimit: string;
  dateStrings: boolean;
  connectTimeout: number;
  waitForConnections: boolean;
  queueLimit: number;
  charset: string;
  host: string;
  port: number;
  database: string;
  user: string;
  username: string;
  password: string;
  multipleStatements?: boolean;
  enableKeepAlive?: boolean;
  keepAliveInitialDelay?: boolean;
};

export class MysqlDriver extends BaseDriver {
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  public connect(this: MysqlDriver) {
    const options = this.options as MysqlConnectionOptions;
    const mysql = this.import("mysql2");

    this.pool = mysql.createPool({
      host: options.host,
      port: options.port,
      database: options.database,
      user: options.user || options.username,
      password: options.password,

      connectionLimit: options.connectionLimit,
      dateStrings: options.dateStrings,
      connectTimeout: options.connectTimeout,
      waitForConnections: options.waitForConnections,
      queueLimit: options.queueLimit,
      charset: options.charset,
      multipleStatements: options.multipleStatements,
      enableKeepAlive: options.enableKeepAlive,
      keepAliveInitialDelay: options.keepAliveInitialDelay,
    });

    this._onPoolConnect(this.pool);

    this.pool.on("release", (connection: unknown) => {
      this.emit("release", connection);
    });

    return {
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: MysqlQueryBuilder,
      query: (sql: string) => this._query(sql),
      connection: () => this._connection(),
    };
  }

  public disconnect(): void {
    this.pool.end(() => {
      this.pool = undefined;
    });
  }

  private _query(sql: string): Promise<any[]> {
    const start: number = Date.now();
    return new Promise<any[]>((resolve, reject) => {
      return this.pool.query(sql, (err: any, results: any[]) => {
        if (err) return reject(err);
        this._detectEventQuery({ start, sql, results : this.returning(results) });
        this.meta(results, sql);
        return resolve(this.returning(results));
      });
    });
  }
  private _connection(): Promise<TConnection> {
    let closeTransaction: boolean = false;
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err: any, connection: any) => {
        if (err) return reject(err);

        const query = (sql: string) => {
          const start: number = Date.now();
          return new Promise<any[]>((ok, fail) => {
            if (closeTransaction) {
              return fail(new Error(this.MESSAGE_TRX_CLOSED));
            }

            connection.query(sql, (err: any, results: any[]) => {
              connection.release();

              if (err) {
                return fail(err);
              }

              this._detectEventQuery({ start, sql, results : this.returning(results) });

              this.meta(results, sql);
              return ok(this.returning(results));
            });
          });
        };

        const startTransaction = async () => {
          if (closeTransaction) {
            throw new Error(this.MESSAGE_TRX_CLOSED);
          }
          await query("START TRANSACTION").catch((err) => reject(err));

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

          // when rollback will end of transction
          await end();

          return;
        };

        const end = async () => {
          await new Promise<void>((resolve) =>
            setTimeout(() => {
              if (!closeTransaction) {
                closeTransaction = true;

                // After commit the transaction, you can't perform any actions with this transaction.
                connection.destroy();

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
          queryBuilder: MysqlQueryBuilder,
          startTransaction,
          commit,
          rollback,
          end,
        });
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
