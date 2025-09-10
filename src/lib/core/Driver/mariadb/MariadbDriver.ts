import { BaseDriver }           from "..";
import { MariadbQueryBuilder }  from "./MariadbQueryBuilder";
import type { 
  TConnection, 
  TPoolEvent 
} from "../../../types";

type MariadbConnectionOptions = {
  connectionLimit         : string,
  dateStrings             : boolean,
  connectTimeout          : number,
  waitForConnections      : boolean,
  queueLimit              : number,
  charset                 : string,
  host                    : string,
  port                    : number,
  database                : string,
  user                    : string,
  username                : string,
  password                : string,
  multipleStatements      ?: boolean,
  enableKeepAlive         ?: boolean,
  keepAliveInitialDelay   ?: boolean,
}

export class MariadbDriver extends BaseDriver {
  constructor(options: Record<string, any>) {
    super();
    this.options = options;
  }
  public connect(this: MariadbDriver) {
    const options = this.options as MariadbConnectionOptions;
    const mysql = this.import("mariadb");

    this.pool = mysql.createPool({
    
      host: options.host,
      port: options.port,
      database: options.database,
      user: options.user || options.username,
      password: options.password,

      bigIntAsNumber: true,
      insertIdAsNumber: true,
      connectionLimit: options.connectionLimit,
      connectTimeout: options.connectTimeout,
    });

   
    this.pool.getConnection().catch((err: any) => {
      const message = this._messageError.bind(this);

      process.nextTick(() => {
        console.log(message(err?.message));
        return process.exit();
      });
    });

    return {
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      queryBuilder: MariadbQueryBuilder,
      query: (sql: string) => this._query(sql),
      connection: () => this._connection(),
    };
  }

  public disconnect(): void {
    this.pool.end(() => {
      this.pool = undefined;
    });
  }

  private async _query(sql: string): Promise<any[]> {
    const start: number = Date.now();
    const results = await this.pool.query(sql);
    this._detectEventQuery({ start, sql, results : this.returning(results) });
    this.meta(results, sql);
    return this.returning(results)
  }
  private async _connection(): Promise<TConnection> {
    let closeTransaction = false;

    const connection = await this.pool.getConnection();

    const query = async (sql: string) => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      const start = Date.now();
      const results = await connection.query(sql);
      this._detectEventQuery({ start, sql, results : this.returning(results) });
      this.meta(results, sql);
      return this.returning(results);
    };

    const startTransaction = async () => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      await connection.beginTransaction();
    };

    const commit = async () => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      await connection.commit();
      await end();
    };

    const rollback = async () => {
      if (closeTransaction) throw new Error(this.MESSAGE_TRX_CLOSED);
      await connection.rollback();
      await end();
    };

    const end = async () => {
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          if(!closeTransaction) {
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

    return {
      on: (event: TPoolEvent, data: any) => this.on(event, data),
      query,
      queryBuilder: MariadbQueryBuilder,
      startTransaction,
      commit,
      rollback,
      end,
    };
  }
  
  protected meta (results : any, sql : string) : void {
    if(Array.isArray(results)) return
    if(results.$meta == null) results.$meta = {}

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