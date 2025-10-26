import { EventEmitter } from "events";
import { StateManager } from "../StateManager";
import { Tool }         from "../../tools";
import { CONSTANTS }    from "../../constants";
import { Blueprint }    from "../Blueprint";

import type { 
  TConstant, 
  TPoolConnected 
} from "../../types";
export abstract class BaseDriver extends EventEmitter {
  private SLOW_QUERY_EXECUTE_TIME = 1000 * 15;
  private SLOW_QUERY_LIMIT_LENGTH = 1000 * 2;
  protected pool!: any;
  protected options!: Record<string, any>;
  protected MESSAGE_TRX_CLOSED = "The transaction has either been closed";
  protected abstract connect(): TPoolConnected;
  protected abstract disconnect(pool:any): void;
  protected abstract meta(results: any, sql: string): void;
  protected abstract returning(results: any): any;

  protected import(mod: string) {
    return Tool.import(mod);
  }
  protected _detectEventQuery({ start, sql }: { start: number; sql: string }) {
    const duration = Date.now() - start;

    if (duration > this.SLOW_QUERY_EXECUTE_TIME) {
      if (sql.length > this.SLOW_QUERY_LIMIT_LENGTH) {
        sql = `${sql.slice(0, this.SLOW_QUERY_LIMIT_LENGTH)}.......`;
      }

      console.log(this._messageSlowQuery(duration, sql));

      this.emit("slowQuery", {
        sql,
        execution: duration,
      });
    }

    this.emit("query", {
      sql,
      execution: duration,
    });

    this.emit(this._detectQueryType(sql).toLocaleLowerCase(), {
      sql,
      execution: duration,
    });
  }

  protected _messageSlowQuery(duration: number, sql: string): string {
    const message = `\n\x1b[1m\x1b[31mWARING:\x1b[0m \x1b[1m\x1b[29mSlow query detected: Execution time: ${duration} ms\x1b[0m \n\x1b[33m${sql};\x1b[0m`;

    return message;
  }

  protected _detectQueryType(query: string) {
    const selectRegex = /^SELECT\b/i;
    const updateRegex = /^UPDATE\b/i;
    const insertRegex = /^INSERT\b/i;
    const deleteRegex = /^DELETE\b/i;

    if (selectRegex.test(query)) return "SELECT";
    if (updateRegex.test(query)) return "UPDATE";
    if (insertRegex.test(query)) return "INSERT";
    if (deleteRegex.test(query)) return "DELETE";

    return "";
  }

  protected _onPoolConnect(pool: any): void {
    const delay = 0;

    setTimeout(() => {
      pool.getConnection((err: any, connection: any): void => {
        if (err) {
          const message = this._messageError.bind(this);

          process.nextTick(() => {
            if (String(err.message).includes("Pool is close")) {
              return;
            }
            console.log(
              message(
                err.message == null || err.message === ""
                  ? err.code
                  : err.message
              )
            );
            if (this.options.CONNECTION_ERROR) return process.exit();
          });

          return;
        }

        this.emit("connected", connection);

        if (this.options.CONNECTION_SUCCESS) {
          connection.query(
            `SHOW VARIABLES LIKE 'version%'`,
            (err: any, results: any[]) => {
              connection.release();
              if (err) return;
              const message = [
                results.find((v) => v?.Variable_name === "version"),
                results.find((v) => v?.Variable_name === "version_comment"),
              ]
                .map((v) => v?.Value)
                .join(" - ");

              console.log(this._messageConnected.bind(this)(`${message}`));
            }
          );
        }
      });
    }, delay);

    return;
  }

  protected _messageConnected(message: string): string {
    return `
            \x1b[1m\x1b[32m
            Connection established to the database. 
            Version : ${message ?? ""} \x1b[0m
            ------------------------------- \x1b[34m
                HOST     : ${this.options.host}         
                PORT     : ${this.options.port}        
                DATABASE : ${this.options.database}
                USERNAME : ${this.options.user}          
                PASSWORD : ${this.options.password} \x1b[0m 
            -------------------------------
        `;
  }

  protected _messageError(message: string): string {
    return `
            \x1b[1m\x1b[31m
            Connection lost to database ! \x1b[0m
            ------------------------------- \x1b[33m
                HOST     : ${this.options.host}         
                PORT     : ${this.options.port}        
                DATABASE : ${this.options.database} 
                USERNAME : ${this.options.user}          
                PASSWORD : ${this.options.password} \x1b[0m 
            -------------------------------
            \x1b[1m\x1b[31mError Message 
            : ${message ?? ""} \x1b[0m
        `;
  }
}
export abstract class QueryBuilder {
  protected $constants = (name: keyof TConstant): string => {
    if (!CONSTANTS.hasOwnProperty(name))
      throw new Error(`Not found that constant : '${name}'`);

    return CONSTANTS[name] as string;
  };
  protected $state!: StateManager;

  constructor(state: StateManager) {
    this.$state = state;
  }

  public abstract select(): string;
  public abstract insert(): string;
  public abstract update(): string;
  public abstract remove(): string;

  public abstract any(): string;

  public abstract getColumns({
    database,
    table,
  }: {
    database: string;
    table: string;
  }): string;

  public abstract getSchema({
    database,
    table,
  }: {
    database: string;
    table: string;
  }): string;

  public abstract getTables(database: string): string;

  public abstract getTable({
    database,
    table,
  }: {
    database: string;
    table: string;
  }): string;

  public abstract createTable({
    database,
    table,
    schema,
  }: {
    database: string;
    table: string;
    schema: Record<string, Blueprint> | string[];
  }): string;

  public abstract addColumn({
    table,
    column,
    type,
    attributes,
    after,
  }: {
    table: string;
    column: string;
    type: string;
    attributes: string[];
    after: string;
  }): string;

  public abstract changeColumn({
    table,
    column,
    type,
    attributes,
  }: {
    table: string;
    column: string;
    type: string;
    attributes: string[];
  }): string;

  public abstract getFKs({
    database,
    table,
  }: {
    database: string;
    table: string;
  }): string;

  public abstract hasFK({
    database,
    table,
    constraint,
  }: {
    database: string;
    table: string;
    constraint: string;
  }): string;

  public abstract createFK({
    table,
    tableRef,
    key,
    constraint,
    foreign,
  }: {
    table: string;
    tableRef: string;
    key: string;
    constraint: string;
    foreign: {
      references: string;
      onDelete: string;
      onUpdate: string;
    };
  }): string;

  public abstract getIndexes({
    database,
    table
  }: {
    database : string;
    table    : string;
  }): string;

  public abstract hasIndex({
    database,
    table,
    index,
  }: {
    database: string;
    table: string;
    index: string;
  }): string;

  public abstract createIndex({
    table,
    index,
    key,
  }: {
    table: string;
    index: string;
    key: string;
  }): string;

  public abstract getDatabase(database: string): string;
  public abstract dropDatabase(database: string): string;
  public abstract dropView(view: string): string;
  public abstract dropTable(table: string): string;
  public abstract sleep(second : number) : string;

  public abstract format(sql: (string | null)[] | string): string;

  protected abstract bindJoin(values: string[]): string | null;
  protected abstract bindWhere(values: string[]): string | null;
  protected abstract bindOrderBy(values: string[]): string | null;
  protected abstract bindGroupBy(values: string[]): string | null;
  protected abstract bindSelect(
    values: string[],
    opts?: { distinct?: string }
  ): string;
  protected abstract bindFrom(args: {
    from: string[];
    alias: string | null;
    rawAlias: string | null;
  }): string;
  protected abstract bindLimit(limit: string | number): string;
  protected abstract bindOffset(offset: string): string;
  protected abstract bindHaving(having: string): string;
}
