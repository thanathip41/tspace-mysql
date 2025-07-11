import { AbstractBuilder }  from "./Abstracts/AbstractBuilder";
import { utils }            from "../utils";
import { DB }               from "./DB";
import { StateHandler }     from "./Handlers/State";
import { Join }             from "./Join";
import { CONSTANTS }        from "../constants";
import { 
  Pool, 
  PoolConnection, 
  loadOptionsEnvironment 
} from "./Pool";
import {
  TPagination,
  TConnectionOptions,
  TConnection,
  TConnectionTransaction,
} from "../types";

class Builder extends AbstractBuilder {
  constructor() {
    super();
    this._initialConnection();
  }

  /**
   * The 'instance' method is used get instance.
   * @static
   * @returns {Builder} instance of the Builder
   */
  static get instance(): Builder {
    return new this();
  }

  /**
   * The 'unset' method is used to drop a property as desired.
   * @param {object} options
   * @property {boolean | undefined} options.select
   * @property {boolean | undefined} options.where
   * @property {boolean | undefined} options.join
   * @property {boolean | undefined} options.limit
   * @property {boolean | undefined} options.offset
   * @property {boolean | undefined} options.orderBy
   * @property {boolean | undefined} options.groupBy
   * @property {boolean | undefined} options.having
   * @returns {this} this
   */
  unset(options: {
    select?: boolean;
    where?: boolean;
    join?: boolean;
    limit?: boolean;
    offset?: boolean;
    orderBy?: boolean;
    groupBy?: boolean;
    having?: boolean;
    alias?: boolean;
  }): this {
    if (options?.select != null && options.select)
      this.$state.set("SELECT", []);
    if (options?.join != null && options.join) this.$state.set("JOIN", []);
    if (options?.where != null && options.where) this.$state.set("WHERE", []);
    if (options?.groupBy != null && options.groupBy)
      this.$state.set("GROUP_BY", []);
    if (options?.having != null && options.having)
      this.$state.set("HAVING", "");
    if (options?.orderBy != null && options.orderBy)
      this.$state.set("ORDER_BY", []);
    if (options?.limit != null && options.limit) this.$state.set("LIMIT", "");
    if (options?.offset != null && options.offset)
      this.$state.set("OFFSET", "");
    if (options?.alias != null && options.alias)
      this.$state.set("RAW_ALIAS", "");

    return this;
  }

  /**
   * The 'CTEs' method is used to create common table expressions(CTEs).
   *
   * @returns {string} return sql query
   */
  CTEs(as: string, callback: (query: Builder) => Builder): this {
    const query = callback(new DB().from(this.getTableName()));

    this.$state.set("CTE", [
      ...this.$state.get("CTE"),
      `${as} AS (${query.toSQL()})`,
    ]);

    return this;
  }

  /**
   * The 'getQueries' method is used to retrieve the raw SQL queries that would be executed.
   *
   * @returns {string} return sql query
   */
  getQueries(): string[] {
    return this.$state.get("QUERIES");
  }

  /**
   * The 'distinct' method is used to apply the DISTINCT keyword to a database query.
   *
   * It allows you to retrieve unique values from one or more columns in the result set, eliminating duplicate rows.
   * @returns {this} this
   */
  distinct(): this {
    this.$state.set("DISTINCT", true);

    return this;
  }

  /**
   * The 'select' method is used to specify which columns you want to retrieve from a database table.
   *
   * It allows you to choose the specific columns that should be included in the result set of a database query.
   * @param {string[]} ...columns
   * @returns {this} this
   */
  select(...columns: string[]): this {
    if (!columns.length) {
      this.$state.set("SELECT", ["*"]);
      return this;
    }

    let select: string[] = columns.map((column: string) => {
      if (column.includes(this.$constants("RAW"))) {
        return column?.replace(this.$constants("RAW"), "").replace(/'/g, "");
      }

      return this.bindColumn(column);
    });

    select = [...this.$state.get("SELECT"), ...select];

    if (this.$state.get("DISTINCT") && select.length) {
      select[0] = String(select[0]).includes(this.$constants("DISTINCT"))
        ? select[0]
        : `${this.$constants("DISTINCT")} ${select[0]}`;
    }

    this.$state.set("SELECT", select);

    return this;
  }

  /**
   * The 'selectRaw' method is used to specify which columns you want to retrieve from a database table.
   *
   * It allows you to choose the specific columns that should be included in the result set of a database query.
   *
   * This method allows you to specify raw-sql parameters for the query.
   * @param {string[]} ...columns
   * @returns {this} this
   */
  selectRaw(...columns: string[]): this {
    if (!columns.length) return this;

    let select: string[] = columns.map((column: string) => {
      if (column === "*") return column;
      if (column.includes("`*`")) return column.replace("`*`", "*");
      if (column.includes(this.$constants("RAW")))
        return column?.replace(this.$constants("RAW"), "").replace(/'/g, "");
      return column;
    });

    select = [...this.$state.get("SELECT"), ...select];

    if (this.$state.get("DISTINCT") && select.length) {
      select[0] = String(select[0]).includes(this.$constants("DISTINCT"))
        ? select[0]
        : `${this.$constants("DISTINCT")} ${select[0]}`;
    }

    this.$state.set("SELECT", select);

    return this;
  }

  /**
   * The 'select1' method is used to select 1 from database table.
   *
   * @returns {this} this
   */
  select1(): this {
    this.$state.set("SELECT", [..."1"]);

    return this;
  }

  /**
   * The 'selectObject' method is used to specify which columns you want to retrieve from a database table.
   *
   * It allows you to choose the specific columns that should be included in the result set to 'Object' of a database query.
   * @param {string} object table name
   * @param {string} alias as name of the column
   * @returns {this} this
   */
  selectObject(
    object: Record<string, string | `${string}.${string}`>,
    alias: string
  ): this {
    if (!Object.keys(object).length)
      throw new Error(
        "The method 'selectObject' is not supported for empty object"
      );

    let maping: string[] = [];
    for (const [key, value] of Object.entries(object)) {
      maping = [...maping, `'${key}'`, this.bindColumn(value)];
    }

    const json = [
      `${this.$constants("JSON_OBJECT")}(${maping.join(", ")})`,
      `${this.$constants("AS")} \`${alias}\``,
    ].join(" ");

    this.$state.set("SELECT", [...this.$state.get("SELECT"), json]);

    return this;
  }

  /**
   * The 'selectObject' method is used to specify which columns you want to retrieve from a database table.
   *
   * It allows you to choose the specific columns that should be included in the result set to 'Object' of a database query.
   * @param {string} object table name
   * @param {string} alias as name of the column
   * @returns {this} this
   */
  selectArray(
    object: Record<string, `${string}.${string}`>,
    alias: string
  ): this {
    if (!Object.keys(object).length)
      throw new Error(
        "The method 'selectArray' is not supported for empty object"
      );

    let maping: string[] = [];

    for (const [key, value] of Object.entries(object)) {
      if (/\./.test(value)) {
        const [table, c] = value.split(".");
        maping = [...maping, `'${key}'`, `\`${table}\`.\`${c}\``];
        continue;
      }
      maping = [
        ...maping,
        `'${key}'`,
        `\`${this.getTableName()}\`.\`${value}\``,
      ];
    }

    const json = `
            ${this.$constants("CASE")}
            ${this.$constants("WHEN")} COUNT(${
      Object.values(maping)[1]
    }) = 0 ${this.$constants("THEN")} ${this.$constants("JSON_ARRAY")}()
            ${this.$constants("ELSE")} ${this.$constants("JSON_ARRAYAGG")}(
                ${this.$constants("JSON_OBJECT")}(${maping.join(" , ")})
            )
            ${this.$constants("END")}
            ${this.$constants("AS")} \`${alias}\`
        `;

    this.$state.set("SELECT", [...this.$state.get("SELECT"), json]);

    return this;
  }

  /**
   * The 'table' method is used to set the table name.
   *
   * @param   {string} table table name
   * @returns {this} this
   */
  table(table: string): this {
    this.$state.set("TABLE_NAME", `\`${table}\``);
    return this;
  }

  /**
   * The 'from' method is used to set the table name.
   *
   * @param {string} table table name
   * @returns {this} this
   */
  from(table: string): this {
    this.$state.set("TABLE_NAME", `\`${table}\``);
    return this;
  }

  /**
   * The 'fromRaw' method is used to set the table name.
   *
   * @param   {string} alias alias name
   * @param   {string} from from sql raw sql from make a new alias for this table
   * @returns {this} this
   */
  fromRaw(alias: string, from?: string): this {
    this.$state.set("ALIAS", alias);

    if (from) {
      this.$state.set("RAW_ALIAS", from);
    }

    return this;
  }

  /**
   * The 'alias' method is used to set the table name.
   *
   * @param   {string} alias alias name
   * @param   {string} from from sql raw sql from make a new alias for this table
   * @returns {this} this
   */
  alias(alias: string, from?: string): this {
    this.$state.set("ALIAS", alias);

    if (from) {
      this.$state.set("RAW_ALIAS", from);
    }

    return this;
  }

  /**
   * The 'as' method is used to set the table name.
   *
   * @param   {string} alias alias name
   * @param   {string} from from sql raw sql from make a new alias for this table
   * @returns {this} this
   */
  as(alias: string, from?: string): this {
    this.$state.set("ALIAS", alias);

    if (from) {
      this.$state.set("RAW_ALIAS", from);
    }

    return this;
  }

  /**
   * The 'sleep' method is used to delay the query.
   *
   * @param {number} second - The number of seconds to sleep
   * @returns {this} this
   */
  sleep(second: number): this {
    const sql = `(SELECT SLEEP(${second}) as sleep)`;

    this.$state.set("JOIN", [
      ...this.$state.get("JOIN"),
      [
        `${this.$constants("INNER_JOIN")}`,
        `${sql} ${this.$constants("AS")} temp`,
        `${this.$constants("ON")}`,
        `1=1`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'returnType' method is used covert the results to type 'object' or 'array'.
   *
   * @param {string} type - The types 'object' | 'array'
   * @returns {this} this
   */
  returnType(type: "object" | "array"): this {
    this.$state.set("RETURN_TYPE", type);

    return this;
  }

  /**
   * The 'pluck' method is used to retrieve the value of a single column from the first result of a query.
   *
   * It is often used when you need to retrieve a single value,
   * such as an ID or a specific attribute, from a query result.
   * @param {string} column
   * @returns {this}
   */
  pluck(column: string): this {
    this.$state.set("PLUCK", column);

    return this;
  }

  /**
   * The 'except' method is used to specify which columns you don't want to retrieve from a database table.
   *
   * It allows you to choose the specific columns that should be not included in the result set of a database query.
   * @param {...string} columns
   * @returns {this} this
   */
  except(...columns: string[]): this {
    if (!columns.length) return this;

    const exceptColumns = this.$state.get("EXCEPTS");

    this.$state.set("EXCEPTS", [...columns, ...exceptColumns]);

    return this;
  }

  /**
   * The 'exceptTimestamp' method is used to timestamp columns (created_at , updated_at) you don't want to retrieve from a database table.
   *
   * @returns {this} this
   */
  exceptTimestamp(): this {
    this.$state.set("EXCEPTS", ["created_at", "updated_at"]);

    return this;
  }

  /**
   * The 'void' method is used to specify which you don't want to return a result from database table.
   *
   * @returns {this} this
   */
  void(): this {
    this.$state.set("VOID", true);
    return this;
  }

  /**
   * The 'only' method is used to specify which columns you don't want to retrieve from a result.
   *
   * It allows you to choose the specific columns that should be not included in the result.
   *
   * @param {...string} columns show only colums selected
   * @returns {this} this
   */
  only(...columns: string[]): this {
    this.$state.set("ONLY", columns);

    return this;
  }

  /**
   * The 'chunk' method is used to process a large result set from a database query in smaller, manageable "chunks" or segments.
   *
   * It's particularly useful when you need to iterate over a large number of database records without loading all of them into memory at once.
   *
   * This helps prevent memory exhaustion and improves the performance of your application when dealing with large datasets.
   * @param {number} chunk
   * @returns {this} this
   */
  chunk(chunk: number): this {
    this.$state.set("CHUNK", chunk);

    return this;
  }

  /**
   * The 'when' method is used to specify if condition should be true will be next to the actions
   * @param {string | number | undefined | null | Boolean} condition when condition true will return query callback
   * @returns {this} this
   */
  when(
    condition: string | number | undefined | null | Boolean,
    callback: (query: Builder) => Builder
  ): this {
    if (!condition) return this;

    const cb = callback(this);

    if (cb instanceof Promise)
      throw new Error("'when' is not supported a Promise");

    return this;
  }

  /**
   * The 'where' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * If has only 2 arguments default operator '='
   * @param {string} column if arguments is object
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this}
   */
  where(
    column: string | Record<string, any>,
    operator?: any,
    value?: any
  ): this {
    if (typeof column === "object") {
      return this.whereObject(column);
    }

    [value, operator] = this._valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    if (value === null) {
      return this.whereNull(column);
    }

    if (Array.isArray(value)) {
      return this.whereIn(column, value);
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${operator}`,
        `${this._checkValueHasRaw(value)}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhere' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * If has only 2 arguments default operator '='
   * @param {string} column
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this}
   */
  orWhere(column: string, operator?: any, value?: any): this {
    [value, operator] = this._valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    if (value === null) {
      return this.orWhereNull(column);
    }

    if (Array.isArray(value)) {
      return this.orWhereIn(column, value);
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${operator}`,
        `${this._checkValueHasRaw(value)}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereDay' method is used to add a "where" clause that filters results based on the day part of a date column.
   *
   * It is especially useful for querying records that fall within a specific day.
   * @param {string} column
   * @param {number} day
   * @returns {this}
   */
  whereDay(column: string, day: number): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `DAY(${this.bindColumn(String(column))})`,
        `=`,
        `'${`00${this.$utils.escape(day)}`.slice(-2)}'`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereMonth' method is used to add a "where" clause that filters results based on the month part of a date column.
   *
   * It is especially useful for querying records that fall within a specific month.
   * @param {string} column
   * @param {number} month
   * @returns {this}
   */
  whereMonth(column: string, month: number): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `MONTH(${this.bindColumn(String(column))})`,
        `=`,
        `'${`00${this.$utils.escape(month)}`.slice(-2)}'`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereYear' method is used to add a "where" clause that filters results based on the year part of a date column.
   *
   * It is especially useful for querying records that fall within a specific year.
   * @param {string} column
   * @param {number} year
   * @returns {this}
   */
  whereYear(column: string, year: number): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `YEAR(${this.bindColumn(String(column))})`,
        `=`,
        `'${`0000${this.$utils.escape(year)}`.slice(-4)}'`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereRaw' method is used to add a raw SQL condition to a database query.
   *
   * It allows you to include custom SQL expressions as conditions in your query,
   * which can be useful for situations where you need to perform complex or custom filtering that cannot be achieved using Laravel's standard query builder methods.
   * @param {string} sql where column with raw sql
   * @returns {this} this
   */
  whereRaw(sql: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${sql}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereRaw' method is used to add a raw SQL condition to a database query.
   *
   * It allows you to include custom SQL expressions as conditions in your query,
   * which can be useful for situations where you need to perform complex or custom filtering that cannot be achieved using Laravel's standard query builder methods.
   * @param {string} sql where column with raw sql
   * @returns {this} this
   */
  orWhereRaw(sql: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${sql}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereObject' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions in object that records in the database must meet in order to be included in the result set.
   *
   * This method is defalut operator '=' only
   * @param {Object} columns
   * @returns {this}
   */
  whereObject(columns: Record<string, any>): this {
    for (const column in columns) {
      const operator = "=";
      const value = this.$utils.escape(columns[column]);

      const useOp = this._checkValueHasOp(value);

      if (useOp == null) {
        this.where(column, operator, value);
        continue;
      }

      switch (useOp.op) {
        case "IN": {
          this.whereIn(
            column,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "|IN": {
          this.orWhereIn(
            column,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "QUERY": {
          this.whereSubQuery(column, useOp.value);
          break;
        }

        case "!QUERY": {
          this.orWhereSubQuery(column, useOp.value);
          break;
        }

        case "NOT IN": {
          this.whereNotIn(
            column,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "|NOT IN": {
          this.orWhereNotIn(
            column,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "IS NULL": {
          this.whereNull(column);
          break;
        }

        case "|IS NULL": {
          this.orWhereNull(column);
          break;
        }

        case "IS NOT NULL": {
          this.whereNotNull(column);
          break;
        }

        case "|IS NOT NULL": {
          this.orWhereNotNull(column);
          break;
        }

        default: {
          if (useOp.op.includes("|")) {
            this.orWhere(column, useOp.op.replace("|", ""), useOp.value);
            break;
          }

          this.where(column, useOp.op, useOp.value);
        }
      }
    }

    return this;
  }

  /**
   * The 'whereJSON' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions in that records json in the database must meet in order to be included in the result set.
   * @param    {string} column
   * @param    {object}  property object { key , value , operator }
   * @property {string}  property.key
   * @property {string}  property.value
   * @property {string?} property.operator
   * @returns   {this}
   */
  whereJSON(
    column: string,
    { key, value, operator }: { key: string; value: string; operator?: string }
  ): this {
    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}->>'$.${key}'`,
        `${operator == null ? "=" : operator.toLocaleUpperCase()}`,
        `${this._checkValueHasRaw(value)}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereJSON' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions in that records json in the database must meet in order to be included in the result set.
   * @param    {string} column
   * @param    {object}  property object { key , value , operator }
   * @property {string}  property.key
   * @property {string}  property.value
   * @property {string?} property.operator
   * @returns   {this}
   */
  whereJson(
    column: string,
    { key, value, operator }: { key: string; value: string; operator?: string }
  ): this {
    return this.whereJSON(column, { key, value, operator });
  }

  /**
   *
   * The 'whereExists' method is used to add a conditional clause to a database query that checks for the existence of related records in a subquery or another table.
   *
   * It allows you to filter records based on whether a specified condition is true for related records.
   * @param {string} sql
   * @returns {this}
   */
  whereExists(sql: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.$constants("EXISTS")}`,
        `(${sql})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   *
   * The 'whereExists' method is used to add a conditional clause to a database query that checks for the existence of related records in a subquery or another table.
   *
   * It allows you to filter records based on whether a specified condition is true for related records.
   * @param {string} sql
   * @returns {this}
   */
  whereNotExists(sql: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.$constants("NOT")} ${this.$constants("EXISTS")}`,
        `(${sql})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   *
   * @param {number} id
   * @returns {this} this
   */
  whereId(id: number, column: string = "id"): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)} = ${this.$utils.escape(id)}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   *
   * @param {string} email where using email
   * @returns {this}
   */
  whereEmail(email: string): this {
    const column: string = "email";

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)} = ${this.$utils.escape(email)}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   *
   * @param {number} userId
   * @param {string?} column custom it *if column is not user_id
   * @returns {this}
   */
  whereUser(userId: number, column: string = "user_id"): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)} = ${this.$utils.escape(userId)}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereIn' method is used to add a conditional clause to a database query that checks if a specified column's value is included in a given array of values.
   *
   * This method is useful when you want to filter records based on a column matching any of the values provided in an array.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereIn(column: string, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    const values = array.length
      ? `${array
          .map((value: string) =>
            this._checkValueHasRaw(this.$utils.escape(value))
          )
          .join(",")}`
      : this.$constants(this.$constants("NULL"));

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("IN")}`,
        `(${values})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereIn' method is used to add a conditional clause to a database query that checks if a specified column's value is included in a given array of values.
   *
   * This method is useful when you want to filter records based on a column matching any of the values provided in an array.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereIn(column: string, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    const values = array.length
      ? `${array
          .map((value: string) =>
            this._checkValueHasRaw(this.$utils.escape(value))
          )
          .join(",")}`
      : this.$constants(this.$constants("NULL"));

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("IN")}`,
        `(${values})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereNotIn' method is used to add a conditional clause to a database query that checks if a specified column's value is not included in a given array of values.
   *
   * This method is the opposite of whereIn and is useful when you want to filter records based on a column not matching any of the values provided in an array.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereNotIn(column: string, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) return this;

    const values = `${array
      .map((value: string) => this._checkValueHasRaw(this.$utils.escape(value)))
      .join(",")}`;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("NOT_IN")}`,
        `(${values})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereNotIn' method is used to add a conditional clause to a database query that checks if a specified column's value is not included in a given array of values.
   *
   * This method is the opposite of whereIn and is useful when you want to filter records based on a column not matching any of the values provided in an array.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereNotIn(column: string, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) return this;

    const values = `${array
      .map((value: string) => this._checkValueHasRaw(this.$utils.escape(value)))
      .join(",")}`;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("NOT_IN")}`,
        `(${values})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
   *
   * Subqueries also known as nested queries, are queries that are embedded within the main query.
   *
   * They are often used when you need to perform a query to retrieve some values and then use those values as part of the condition in the main query.
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  whereSubQuery(
    column: string, 
    subQuery: string, 
    options: { operator?: typeof CONSTANTS['EQ'] | typeof CONSTANTS['IN'] } = { operator: CONSTANTS['IN'] }
  ): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        options.operator,
        `(${subQuery})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereNotSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
   *
   * Subqueries also known as nested queries, are queries that are embedded within the main query.
   *
   * They are often used when you need to perform a query to retrieve not some values and then use those values as part of the condition in the main query.
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  whereNotSubQuery(
    column: string, 
    subQuery: string,
    options: { operator?: typeof CONSTANTS['NOT_EQ'] | typeof CONSTANTS['NOT_IN'] } = { operator: CONSTANTS['NOT_IN'] }
  ): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        options.operator,,
        `(${subQuery})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
   *
   * Subqueries also known as nested queries, are queries that are embedded within the main query.
   *
   * They are often used when you need to perform a query to retrieve some values and then use those values as part of the condition in the main query.
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  orWhereSubQuery(
    column: string, 
    subQuery: string,
    options: { operator?: typeof CONSTANTS['EQ'] | typeof CONSTANTS['IN'] } = { operator: CONSTANTS['IN'] }
  ): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        options.operator,
        `(${subQuery})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereNotSubQuery' method is used to add a conditional clause to a database query that involves a subquery.
   *
   * Subqueries also known as nested queries, are queries that are embedded within the main query.
   *
   * They are often used when you need to perform a query to retrieve not some values and then use those values as part of the condition in the main query.
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  orWhereNotSubQuery(
    column: string, 
    subQuery: string,
    options: { operator?: typeof CONSTANTS['NOT_EQ'] | typeof CONSTANTS['NOT_IN'] } = { operator: CONSTANTS['NOT_IN'] }
  ): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        options.operator,
        `(${subQuery})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
   *
   * This method is useful when you want to filter records based on a column's value being within a certain numeric or date range.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereBetween(column: string, array: any[]): this {
    if (!Array.isArray(array)) throw new Error("Value is't array");

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
          `${this.bindColumn(column)}`,
          `${this.$constants("BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ].join(" "),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("BETWEEN")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value2))}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
   *
   * This method is useful when you want to filter records based on a column's value being within a certain numeric or date range.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereBetween(column: string, array: any[]): this {
    if (!Array.isArray(array)) throw new Error("Value is't array");

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
          `${this.bindColumn(column)}`,
          `${this.$constants("BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ].join(" "),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("BETWEEN")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value2))}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereNotBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
   *
   * This method is useful when you want to filter records based on a column's value does not fall within a specified range of values.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereNotBetween(column: string, array: any[]): this {
    if (!Array.isArray(array)) throw new Error("Value is't array");

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
          `${this.bindColumn(column)}`,
          `${this.$constants("NOT_BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ].join(" "),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("NOT_BETWEEN")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value2))}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereNotBetween' method is used to add a conditional clause to a database query that checks if a specified column's value falls within a specified range of values.
   *
   * This method is useful when you want to filter records based on a column's value does not fall within a specified range of values.
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereNotBetween(column: string, array: any[]): this {
    if (!Array.isArray(array)) throw new Error("Value is't array");

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
          `${this.bindColumn(column)}`,
          `${this.$constants("NOT_BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ].join(" "),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("NOT_BETWEEN")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this._checkValueHasRaw(this.$utils.escape(value2))}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereNull' method is used to add a conditional clause to a database query that checks if a specified column's value is NULL.
   *
   * This method is helpful when you want to filter records based on whether a particular column has a NULL value.
   * @param {string} column
   * @returns {this}
   */
  whereNull(column: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("IS_NULL")}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereNull' method is used to add a conditional clause to a database query that checks if a specified column's value is NULL.
   *
   * This method is helpful when you want to filter records based on whether a particular column has a NULL value.
   * @param {string} column
   * @returns {this}
   */
  orWhereNull(column: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("IS_NULL")}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereNotNull' method is used to add a conditional clause to a database query that checks if a specified column's value is not NULL.
   *
   * This method is useful when you want to filter records based on whether a particular column has a non-null value.
   * @param {string} column
   * @returns {this}
   */
  whereNotNull(column: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("IS_NOT_NULL")}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereNotNull' method is used to add a conditional clause to a database query that checks if a specified column's value is not NULL.
   *
   * This method is useful when you want to filter records based on whether a particular column has a non-null value.
   * @param {string} column
   * @returns {this}
   */
  orWhereNotNull(column: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(column)}`,
        `${this.$constants("IS_NOT_NULL")}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereSensitive' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * The where method is need to perform a case-sensitive comparison in a query.
   * @param {string} column
   * @param {string?} operator = < > != !< !>
   * @param {any?} value
   * @returns {this}
   */
  whereSensitive(column: string, operator?: any, value?: any): this {
    [value, operator] = this._valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.$constants("BINARY")}`,
        `${this.bindColumn(column)}`,
        `${operator}`,
        `${this._checkValueHasRaw(this.$utils.escape(value))}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereStrict' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * The where method is need to perform a case-sensitive comparison in a query.
   * @param {string} column
   * @param {string?} operator = < > != !< !>
   * @param {any?} value
   * @returns {this}
   */
  whereStrict(column: string, operator?: any, value?: any): this {
    return this.whereSensitive(column, operator, value);
  }

  /**
   * The 'orWhereSensitive' method is used to add conditions to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * The where method is need to perform a case-sensitive comparison in a query.
   * @param {string} column
   * @param {string?} operator = < > != !< !>
   * @param {any?} value
   * @returns {this}
   */
  orWhereSensitive(column: string, operator?: any, value?: any): this {
    [value, operator] = this._valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );
    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.$constants("BINARY")}`,
        `${this.bindColumn(column)}`,
        `${operator}`,
        `${this._checkValueHasRaw(this.$utils.escape(value))}`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereQuery' method is used to add conditions to a database query to create a grouped condition.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   * @param {Function} callback callback query
   * @returns {this}
   */
  whereQuery(callback: Function): this {
    const db: DB = new DB(this.$state.get("TABLE_NAME")?.replace(/`/g, ""));

    const repository: DB = callback(db);

    if (repository instanceof Promise)
      throw new Error('"whereQuery" is not supported a Promise');

    if (!(repository instanceof DB))
      throw new Error(`Unknown callback query: '${repository}'`);

    const where: string[] = repository?.$state.get("WHERE") || [];

    if (!where.length) return this;

    const query: string = where.join(" ");

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `(${query})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'whereGroup' method is used to add conditions to a database query to create a grouped condition.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   * @param {function} callback callback query
   * @returns {this}
   */
  whereGroup(callback: Function): this {
    return this.whereQuery(callback);
  }

  /**
   * The 'orWhereQuery' method is used to add conditions to a database query to create a grouped condition.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   * @param {function} callback callback query
   * @returns {this}
   */
  orWhereQuery(callback: Function): this {
    const db: DB = new DB(this.$state.get("TABLE_NAME")?.replace(/`/g, ""));

    const repository: DB = callback(db);

    if (repository instanceof Promise)
      throw new Error('"whereQuery" is not supported a Promise');

    if (!(repository instanceof DB))
      throw new Error(`Unknown callback query: '[${repository}]'`);

    const where: string[] = repository?.$state.get("WHERE") || [];

    if (!where.length) return this;

    const query: string = where.join(" ");

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `(${query})`,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereGroup' method is used to add conditions to a database query to create a grouped condition.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   * @param {function} callback callback query
   * @returns {this}
   */
  orWhereGroup(callback: Function): this {
    return this.orWhereQuery(callback);
  }

  /**
   * The 'whereAny' method is used to add conditions to a database query,
   * where either the original condition or the new condition must be true.
   *
   * If has only 2 arguments default operator '='
   * @param {string[]} columns
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this}
   */
  whereAny(columns: string[], operator?: any, value?: any): this {
    [value, operator] = this._valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    this.whereQuery((query: DB) => {
      for (const index in columns) {
        const column = columns[index];

        if (+index === 0) {
          query.where(column, operator, value);
          continue;
        }
        query.orWhere(column, operator, value);
      }
      return query;
    });

    return this;
  }

  /**
   * The 'whereAll' method is used to clause to a database query.
   *
   * This method allows you to specify conditions that the retrieved records must meet.
   *
   * If has only 2 arguments default operator '='
   * @param {string[]} columns
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this}
   */
  whereAll(columns: string[], operator?: any, value?: any): this {
    [value, operator] = this._valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);
    value = this.$utils.covertBooleanToNumber(value);

    this.whereQuery((query: DB) => {
      for (const column of columns) query.where(column, operator, value);
      return query;
    });

    return this;
  }

  /**
   * The 'whereCases' method is used to add conditions with cases to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * @param {Array<{when , then}>} cases used to add conditions when and then
   * @param {string?} elseCase else when end of conditions
   * @returns {this}
   */
  whereCases(cases: { when: string; then: string }[], elseCase?: string): this {
    if (!cases.length) return this;

    let query: Array<string> = [];

    for (const c of cases) {
      if (c.when == null) throw new Error(`can't find when condition`);
      if (c.then == null) throw new Error(`can't find then condition`);

      query = [
        ...query,
        `${this.$constants("WHEN")} ${c.when} ${this.$constants("THEN")} ${
          c.then
        }`,
      ];
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        [
          this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
          "(",
          this.$constants("CASE"),
          query.join(" "),
          elseCase == null ? "" : `ELSE ${elseCase}`,
          this.$constants("END"),
          ")",
        ].join(" "),
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orWhereCases' method is used to add conditions with cases to a database query.
   *
   * It allows you to specify conditions that records in the database must meet in order to be included in the result set.
   *
   * @param {Array<{when , then}>} cases used to add conditions when and then
   * @param {string?} elseCase else when end of conditions
   * @returns {this}
   */
  orWhereCases(
    cases: { when: string; then: string }[],
    elseCase?: string
  ): this {
    if (!cases.length) return this;

    let query: Array<string> = [];

    for (const c of cases) {
      if (c.when == null) throw new Error(`can't find when condition`);
      if (c.then == null) throw new Error(`can't find then condition`);

      query = [
        ...query,
        `${this.$constants("WHEN")} ${c.when} ${this.$constants("THEN")} ${
          c.then
        }`,
      ];
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        [
          this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
          "(",
          this.$constants("CASE"),
          query.join(" "),
          elseCase == null ? "" : `ELSE ${elseCase}`,
          this.$constants("END"),
          ")",
        ].join(" "),
      ].join(" "),
    ]);

    return this;
  }

  /**
   * select by cases
   * @param {array} cases array object [{ when : 'id < 7' , then : 'id is than under 7'}]
   * @param {string} as assign name
   * @returns {this}
   */
  case(cases: { when: string; then: string }[], as: string): this {
    let query: string[] = [this.$constants("CASE")];

    for (let i: number = 0; i < cases.length; i++) {
      const c = cases[i];
      if (cases.length - 1 === i) {
        if (c.then == null) throw new Error(`can't find then condition`);
        query = [
          ...query,
          `${this.$constants("ELSE")} '${c.then}'`,
          `${this.$constants("END")}`,
        ];
        continue;
      }
      if (c.when == null) throw new Error(`can't find when condition`);
      if (c.then == null) throw new Error(`can't find then condition`);

      query = [
        ...query,
        `${this.$constants("WHEN")} ${c.when} ${this.$constants("THEN")} '${
          c.then
        }'`,
      ];
    }

    if (query.length <= 1) return this;

    this.$state.set("SELECT", [
      ...this.$state.get("SELECT"),
      `${query.join(" ")} ${this.$constants("AS")} ${as}`,
    ]);

    return this;
  }

  /**
   * The 'join' method is used to perform various types of SQL joins between two or more database tables.
   *
   * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
   * @param {string} localKey local key in current table
   * @param {string} referenceKey reference key in next table
   * @example
   * await new DB('users')
   * .select('users.id as userId','posts.id as postId','email')
   * .join('users.id','posts.id')
   * .join('posts.category_id','categories.id')
   * .where('users.id',1)
   * .where('posts.id',2)
   * .get()
   * @returns {this}
   */
  join(
    localKey: `${string}.${string}` | ((join: Join) => Join),
    referenceKey?: `${string}.${string}`
  ): this {
    this._handleJoin("INNER_JOIN", localKey, referenceKey);

    return this;

    //     const callback = localKey(new Join(this,'INNER_JOIN'))

    //     this.$state.set('JOIN', [
    //             ...this.$state.get('JOIN'),
    //             callback['toString']()
    //         ]
    //     )

    //     return this
    // }

    // let table = referenceKey?.split('.')?.shift()
    // const alias = table?.split('|')?.pop()

    // if(alias != null) {
    //     table = table?.split('|')?.shift()
    //     referenceKey =  String(referenceKey?.split('|')?.pop() ?? referenceKey) as `${string}.${string}`
    // }

    // this.$state.set('JOIN', [
    //         ...this.$state.get('JOIN'),
    //         [
    //             `${this.$constants('INNER_JOIN')}`,
    //             alias == null
    //                 ? `\`${table}\``
    //                 : `\`${table}\` ${this.$constants('AS')} \`${alias}\``
    //             ,
    //             `${this.$constants('ON')}`,
    //             `${this.bindColumn(localKey)} = ${this.bindColumn(String(referenceKey))}`
    //         ].join(' ')
    //     ]
    // )

    // return this
  }

  /**
   * The 'rightJoin' method is used to perform a right join operation between two database tables.
   *
   * A right join, also known as a right outer join, retrieves all rows from the right table and the matching rows from the left table.
   *
   * If there is no match in the left table, NULL values are returned for columns from the left table
   * @param {string} localKey local key in current table
   * @param {string} referenceKey reference key in next table
   * @returns {this}
   */
  rightJoin(
    localKey: `${string}.${string}` | ((join: Join) => Join),
    referenceKey?: `${string}.${string}`
  ): this {
    this._handleJoin("RIGHT_JOIN", localKey, referenceKey);

    return this;
  }

  /**
   * The 'leftJoin' method is used to perform a left join operation between two database tables.
   *
   * A left join retrieves all rows from the left table and the matching rows from the right table.
   *
   * If there is no match in the right table, NULL values are returned for columns from the right table.
   * @param {string} localKey local key in current table
   * @param {string} referenceKey reference key in next table
   * @returns {this}
   */
  leftJoin(
    localKey: `${string}.${string}` | ((join: Join) => Join),
    referenceKey?: `${string}.${string}`
  ): this {
    this._handleJoin("LEFT_JOIN", localKey, referenceKey);

    return this;
  }

  /**
   * The 'crossJoin' method performs a cross join operation between two or more tables.
   *
   * A cross join, also known as a Cartesian join, combines every row from the first table with every row from the second table.
   * @param {string} localKey local key in current table
   * @param {string} referenceKey reference key in next table
   * @returns {this}
   */
  crossJoin(
    localKey: `${string}.${string}` | ((join: Join) => Join),
    referenceKey?: `${string}.${string}`
  ): this {
    this._handleJoin("CROSS_JOIN", localKey, referenceKey);

    return this;
  }

  /**
   * The 'joinSubQuery' method is used to perform various types of SQL joins between two or more database tables.
   *
   * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
   * @param    {object}  property object { localKey , foreignKey , sqlr }
   * @property {string} property.localKey local key in current table
   * @property {string} property.foreignKey reference key in next table
   * @property {string} property.sql sql string
   * @example
   * await new DB('users')
   * .joinSubQuery({ localKey : 'id' , foreignKey : 'userId' , sql : '....sql'})
   * .get()
   * @returns {this}
   */
  joinSubQuery({
    localKey,
    foreignKey,
    sql,
  }: {
    localKey: string;
    foreignKey: string;
    sql: string;
  }): this {
    this.$state.set("JOIN", [
      ...this.$state.get("JOIN"),
      [
        `${this.$constants("INNER_JOIN")}`,
        `(${sql}) as subquery`,
        `${this.$constants("ON")}`,
        `${this.bindColumn(localKey)} = subquery.\`${foreignKey}\``,
      ].join(" "),
    ]);

    return this;
  }

  /**
   * The 'orderBy' method is used to specify the order in which the results of a database query should be sorted.
   *
   * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction (ascending or descending) for each column.
   * @param {string} column
   * @param {string?} order by default order = 'asc' but you can used 'asc' or  'desc'
   * @returns {this}
   */
  orderBy(
    column: string,
    order: "ASC" | "asc" | "DESC" | "desc" = "ASC"
  ): this {
    const orderBy = [column]
      .map((c) => {
        if (/\./.test(c)) return this.bindColumn(c.replace(/'/g, ""));
        if (c.includes(this.$constants("RAW")))
          return c?.replace(this.$constants("RAW"), "");
        return this.bindColumn(c);
      })
      .join(", ");

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${orderBy} ${order.toUpperCase()}`,
    ]);

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `\`${column}\` ${order.toUpperCase()}`,
    ]);

    return this;
  }

  /**
   * The 'orderByRaw' method is used to specify the order in which the results of a database query should be sorted.
   *
   * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction (ascending or descending) for each column.
   *
   * This method allows you to specify raw-sql parameters for the query.
   * @param {string} column
   * @param {string?} order [order=asc] asc, desc
   * @returns {this}
   */
  orderByRaw(
    column: string,
    order: "ASC" | "asc" | "DESC" | "desc" = "ASC"
  ): this {
    if (column.includes(this.$constants("RAW"))) {
      column = column?.replace(this.$constants("RAW"), "");
    }

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${column} ${order.toUpperCase()}`,
    ]);

    return this;
  }

  /**
   * The 'random' method is used to retrieve random records from a database table or to randomize the order in which records are returned in the query result set.
   *
   * @returns {this}
   */
  random(): this {
    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${this.$constants("RAND")}`,
    ]);

    return this;
  }

  /**
   * The 'inRandom' method is used to retrieve random records from a database table or to randomize the order in which records are returned in the query result set.
   *
   * @returns {this}
   */
  inRandom(): this {
    return this.random();
  }

  /**
   * The 'latest' method is used to specify the order in which the results of a database query should be sorted.
   *
   * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction descending for each column.
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  latest(...columns: string[]): this {
    let orderBy = "`id`";

    if (columns?.length) {
      orderBy = columns
        .map((c) => {
          if (/\./.test(c)) return this.bindColumn(c);
          if (c.includes(this.$constants("RAW")))
            return c?.replace(this.$constants("RAW"), "");
          return `\`${c}\``;
        })
        .join(", ");
    }

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${orderBy} ${this.$constants("DESC")}`,
    ]);

    return this;
  }

  /**
   * The 'latestRaw' method is used to specify the order in which the results of a database query should be sorted.
   *
   * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction descending for each column.
   *
   * This method allows you to specify raw-sql parameters for the query.
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  latestRaw(...columns: string[]): this {
    let orderBy = "`id`";

    if (columns?.length) {
      orderBy = columns
        .map((column) => {
          if (column.includes(this.$constants("RAW")))
            return column?.replace(this.$constants("RAW"), "");
          return column;
        })
        .join(", ");
    }

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${orderBy} ${this.$constants("DESC")}`,
    ]);

    return this;
  }

  /**
   * The 'oldest' method is used to specify the order in which the results of a database query should be sorted.
   *
   * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction ascending for each column.
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  oldest(...columns: string[]): this {
    let orderBy = "`id`";

    if (columns?.length) {
      orderBy = columns
        .map((c) => {
          if (/\./.test(c)) return this.bindColumn(c);
          if (c.includes(this.$constants("RAW")))
            return c?.replace(this.$constants("RAW"), "");
          return `\`${c}\``;
        })
        .join(", ");
    }

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${orderBy} ${this.$constants("ASC")}`,
    ]);

    return this;
  }

  /**
   * The 'oldestRaw' method is used to specify the order in which the results of a database query should be sorted.
   *
   * This method allows you to specify one or more columns by which the result set should be ordered, as well as the sorting direction ascending for each column.
   *
   * This method allows you to specify raw-sql parameters for the query.
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  oldestRaw(...columns: string[]): this {
    let orderBy = "`id`";

    if (columns?.length) {
      orderBy = columns
        .map((column) => {
          if (column.includes(this.$constants("RAW")))
            return column?.replace(this.$constants("RAW"), "");
          return column;
        })
        .join(", ");
    }

    this.$state.set("ORDER_BY", [
      ...this.$state.get("ORDER_BY"),
      `${orderBy} ${this.$constants("ASC")}`,
    ]);

    return this;
  }

  /**
   * The groupBy method is used to group the results of a database query by one or more columns.
   *
   * It allows you to aggregate data based on the values in specified columns, often in conjunction with aggregate functions like COUNT, SUM, AVG, and MAX.
   *
   * Grouping is commonly used for generating summary reports, calculating totals, and performing other aggregate operations on data.
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  groupBy(...columns: string[]): this {
    let groupBy = "id";

    if (columns?.length) {
      groupBy = columns
        .map((c) => {
          if (/\./.test(c)) return this.bindColumn(c.replace(/'/g, ""));
          if (c.includes(this.$constants("RAW")))
            return c?.replace(this.$constants("RAW"), "");
          return this.bindColumn(c);
        })
        .join(", ");
    }

    this.$state.set("GROUP_BY", [...this.$state.get("GROUP_BY"), `${groupBy}`]);

    return this;
  }

  /**
   * The groupBy method is used to group the results of a database query by one or more columns.
   *
   * It allows you to aggregate data based on the values in specified columns, often in conjunction with aggregate functions like COUNT, SUM, AVG, and MAX.
   *
   * Grouping is commonly used for generating summary reports, calculating totals, and performing other aggregate operations on data.
   *
   * This method allows you to specify raw-sql parameters for the query.
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  groupByRaw(...columns: string[]): this {
    let groupBy = "id";

    if (columns?.length) {
      groupBy = columns
        .map((column) => {
          if (column.includes(this.$constants("RAW")))
            return column?.replace(this.$constants("RAW"), "");
          return column;
        })
        .join(", ");
    }

    this.$state.set("GROUP_BY", [...this.$state.get("GROUP_BY"), `${groupBy}`]);

    return this;
  }

  /**
   * The 'having' method is used to add a conditional clause to a database query that filters the result set after the GROUP BY operation has been applied.
   *
   * It is typically used in conjunction with the GROUP BY clause to filter aggregated data based on some condition.
   *
   * The having clause allows you to apply conditions to aggregated values, such as the result of COUNT, SUM, AVG, or other aggregate functions.
   * @param {string} condition
   * @returns {this}
   */
  having(condition: string): this {
    if (condition.includes(this.$constants("RAW"))) {
      condition = condition?.replace(this.$constants("RAW"), "");
    }

    this.$state.set("HAVING", `${this.$constants("HAVING")} ${condition}`);

    return this;
  }

  /**
   * The 'havingRaw' method is used to add a conditional clause to a database query that filters the result set after the GROUP BY operation has been applied.
   *
   * It is typically used in conjunction with the GROUP BY clause to filter aggregated data based on some condition.
   *
   * The having clause allows you to apply conditions to aggregated values, such as the result of COUNT, SUM, AVG, or other aggregate functions.
   *
   * This method allows you to specify raw-sql parameters for the query.
   * @param {string} condition
   * @returns {this}
   */
  havingRaw(condition: string): this {
    return this.having(condition);
  }
  /**
   * The 'limit' method is used to limit the number of records returned by a database query.
   *
   * It allows you to specify the maximum number of rows to retrieve from the database table.
   * @param {number=} number [number=1]
   * @returns {this}
   */
  limit(number: number = 1): this {
    number = this.$utils.softNumber(number);

    if (number === -1) number = 2 ** 31 - 1; // int 32 bit

    if (number < 0 || number === -0) number = 0;

    this.$state.set("LIMIT", number);

    return this;
  }
  /**
   * The 'limit' method is used to limit the number of records returned by a database query.
   *
   * It allows you to specify the maximum number of rows to retrieve from the database table.
   * @param {number=} number [number=1]
   * @returns {this}
   */
  take(number: number = 1): this {
    return this.limit(number);
  }

  /**
   * The offset method is used to specify the number of records to skip from the beginning of a result set.
   *
   * It is often used in combination with the limit method for pagination or to skip a certain number of records when retrieving data from a database table.
   * @param {number=} number [number=1]
   * @returns {this}
   */
  offset(number: number = 1): this {
    number = this.$utils.softNumber(number);

    if (number < 0 || number === -0) number = 0;

    this.$state.set("OFFSET", `${this.$constants("OFFSET")} ${number}`);

    if (!this.$state.get("LIMIT")) this.$state.set("LIMIT", number);

    return this;
  }
  /**
   * The offset method is used to specify the number of records to skip from the beginning of a result set.
   *
   * It is often used in combination with the limit method for pagination or to skip a certain number of records when retrieving data from a database table.
   * @param {number=} number [number=1]
   * @returns {this}
   */
  skip(number: number = 1): this {
    return this.offset(number);
  }
  /**
   * The 'hidden' method is used to specify which columns you want to hidden result.
   * It allows you to choose the specific columns that should be hidden in the result.
   * @param {...string} columns
   * @returns {this} this
   */
  hidden(...columns: string[]): this {
    this.$state.set("HIDDEN", columns);
    return this;
  }

  /**
   * The 'update' method is used to update existing records in a database table that are associated.
   *
   * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
   *
   * It allows you to remove one record that match certain criteria.
   * @param {object} data
   * @param {array?} updateNotExists options for except update some records in your ${data} using name column(s)
   * @returns {this} this
   */
  update(data: Record<string, any>, updateNotExists: string[] = []): this {
    this.limit(1);

    if (!Object.keys(data).length)
      throw new Error("This method must be required");

    if (updateNotExists.length) {
      for (const c of updateNotExists) {
        for (const column in data) {
          if (c !== column) continue;
          const value = data[column];
          data[column] = this._updateHandler(column, value);
          break;
        }
      }
    }

    const query = this._queryUpdate(data);

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "UPDATE");

    return this;
  }

  /**
   * The 'updateMany' method is used to update existing records in a database table that are associated.
   *
   * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
   *
   * It allows you to remove more records that match certain criteria.
   * @param {object} data
   * @param {array?} updateNotExists options for except update some records in your ${data} using name column(s)
   * @returns {this} this
   */
  updateMany(data: Record<string, any>, updateNotExists: string[] = []): this {
    if (!Object.keys(data).length)
      throw new Error("This method must be required");

    if (updateNotExists.length) {
      for (const c of updateNotExists) {
        for (const column in data) {
          if (c !== column) continue;
          const value = data[column];
          data[column] = this._updateHandler(column, value);
          break;
        }
      }
    }

    const query = this._queryUpdate(data);

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "UPDATE");

    return this;
  }

  /**
   *
   * The 'updateMultiple' method is used to update existing records in a database table that are associated.
   *
   * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
   *
   * It allows you to remove more records that match certain criteria.
   * @param {{when : Object , columns : Object}[]} cases update multiple data specific columns by cases update
   * @property {Record<string,string | number | boolean | null | undefined>}  cases.when
   * @property {Record<string,string | number | boolean | null | undefined>}  cases.columns
   * @returns {this} this
   */
  updateMultiple(
    cases: { when: Record<string, any>; columns: Record<string, any> }[]
  ): this {
    if (!cases.length)
      throw new Error(`The method 'updateMultiple' must not be empty.`);

    this.limit(cases.length);

    const updateColumns: Record<string, any> = cases.reduce(
      (columns: Record<string, any[]>, item) => {
        return (
          item.columns &&
            Object.keys(item.columns).forEach(
              (key) =>
                (columns[key] = [
                  this.$constants("RAW"),
                  this.$constants("CASE"),
                  `${this.$constants("ELSE")} ${this.bindColumn(key)}`,
                  this.$constants("END"),
                ])
            ),
          columns
        );
      },
      {}
    );

    const columns: Record<string, any> = cases.reduce(
      (columns: Record<string, string>, item) => {
        return (
          item.columns &&
            Object.keys(item.columns).forEach((key) => (columns[key] = "")),
          columns
        );
      },
      {}
    );

    for (let i = cases.length - 1; i >= 0; i--) {
      const c = cases[i];

      if (c.when == null || !Object.keys(c.when).length)
        throw new Error(`This 'when' property is missing some properties`);
      if (c.columns == null || !Object.keys(c.columns).length)
        throw new Error(`This 'columns' property is missing some properties`);

      const when = Object.entries(c.when).map(([key, value]) => {
        value = this.$utils.escape(value);
        value = this.$utils.covertBooleanToNumber(value);
        return `${this.bindColumn(key)} = '${value}'`;
      });

      for (const [key, value] of Object.entries(c.columns)) {
        if (updateColumns[key] == null) continue;
        const startIndex = updateColumns[key].indexOf(this.$constants("CASE"));
        const str = `${this.$constants("WHEN")} ${when.join(
          ` ${this.$constants("AND")} `
        )} ${this.$constants("THEN")} '${value}'`;
        updateColumns[key].splice(startIndex + 1, 0, str);
      }
    }

    for (const key in columns) {
      if (updateColumns[key] == null) continue;
      columns[key] = `( ${updateColumns[key].join(" ")} )`;
    }

    const keyValue = Object.entries(columns).map(([column, value]) => {
      if (
        typeof value === "string" &&
        !value.includes(this.$constants("RAW"))
      ) {
        value = this.$utils.escapeActions(value);
      }
      return `${this.bindColumn(column)} = ${
        value == null || value === this.$constants("NULL")
          ? this.$constants("NULL")
          : typeof value === "string" && value.includes(this.$constants("RAW"))
          ? `${this.$utils.covertBooleanToNumber(value)}`.replace(
              this.$constants("RAW"),
              ""
            )
          : `'${this.$utils.covertBooleanToNumber(value)}'`
      }`;
    });

    const query = `${this.$constants("SET")} ${keyValue.join(", ")}`;

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "UPDATE");

    return this;
  }

  /**
   * The 'updateNotExists' method is used to update existing records in a database table that are associated.
   *
   * It simplifies the process of updating records by allowing you to specify the values to be updated using a single call.
   *
   * It method will be update record if data is empty or null in the column values
   * @param {object} data
   * @returns {this} this
   */
  updateNotExists(data: Record<string, any>): this {
    this.limit(1);

    if (!Object.keys(data).length)
      throw new Error("This method must be required");

    for (const column in data) {
      const value = data[column];
      data[column] = this._updateHandler(column, value);
    }

    const query = this._queryUpdate(data);

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "UPDATE");

    return this;
  }

  /**
   * The 'insert' method is used to insert a new record into a database table associated.
   *
   * It simplifies the process of creating and inserting records.
   * @param {object} data
   * @returns {this} this
   */
  insert(data: Record<string, any>): this {
    if (!Object.keys(data).length)
      throw new Error("This method must be required");

    const query = this._queryInsert(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "INSERT");

    return this;
  }

  /**
   * The 'create' method is used to insert a new record into a database table associated.
   *
   * It simplifies the process of creating and inserting records.
   * @param {object} data
   * @returns {this} this
   */
  create(data: Record<string, any>): this {
    if (!Object.keys(data).length)
      throw new Error("This method must be required");

    const query = this._queryInsert(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "INSERT");

    return this;
  }

  /**
   * The 'createMultiple' method is used to insert a new records into a database table associated.
   *
   * It simplifies the process of creating and inserting records with an array.
   * @param {array} data create multiple data
   * @returns {this} this this
   */
  createMultiple(data: any[]): this {
    if (!Object.keys(data).length)
      throw new Error("This method must be required");

    const query = this._queryInsertMultiple(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "INSERT_MULTIPLE");

    return this;
  }

  /**
   * The 'insertMultiple' method is used to insert a new records into a database table associated.
   *
   * It simplifies the process of creating and inserting records with an array.
   * @param {array} data create multiple data
   * @returns {this} this this
   */
  insertMultiple(data: any[]): this {
    return this.createMultiple(data);
  }

  /**
   * The 'createNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
   *
   * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
   * but without raising an error or exception if duplicates are encountered.
   * @param {object} data create not exists data
   * @returns {this} this this
   */
  createNotExists(data: Record<string, any>): this {
    const query: string = this._queryInsert(data);
    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );
    this.$state.set("SAVE", "INSERT_NOT_EXISTS");

    return this;
  }

  /**
   * The 'insertNotExists' method to insert data into a database table while ignoring any duplicate key constraint violations.
   *
   * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
   * but without raising an error or exception if duplicates are encountered.
   * @param {object} data insert not exists data
   * @returns {this} this this
   */
  insertNotExists(data: Record<string, any> & { length?: never }): this {
    this.createNotExists(data);
    return this;
  }

  /**
   * The 'createOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
   *
   * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
   * but if exists should be returns a result.
   * @param {object} data insert data
   * @returns {this} this this
   */
  createOrSelect(data: Record<string, any> & { length?: never }): this {
    const queryInsert: string = this._queryInsert(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${queryInsert}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "INSERT_OR_SELECT");

    return this;
  }

  /**
   * The 'insertOrSelect' method to insert data into a database table while select any duplicate key constraint violations.
   *
   * This method is particularly useful when you want to insert records into a table and ensure that duplicates are not inserted,
   * but if exists should be returns a result.
   * @param {object} data insert or update data
   * @returns {this} this this
   */
  insertOrSelect(data: Record<string, any> & { length?: never }): this {
    this.createOrSelect(data);
    return this;
  }

  /**
   * The 'updateOrCreate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
   *
   * This method is particularly useful when you want to update a record based on certain conditions and,
   * if the record matching those conditions doesn't exist, create a new one with the provided data.
   * @param {object} data insert or update data
   * @returns {this} this this
   */
  updateOrCreate(data: Record<string, any> & { length?: never }): this {
    this.limit(1);

    const queryUpdate: string = this._queryUpdate(data);
    const queryInsert: string = this._queryInsert(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${queryInsert}`,
      ].join(" ")
    );

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${queryUpdate}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "UPDATE_OR_INSERT");

    return this;
  }

  /**
   * The 'updateOrInsert' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
   *
   * This method is particularly useful when you want to update a record based on certain conditions and,
   * if the record matching those conditions doesn't exist, create a new one with the provided data.
   * @param {object} data insert or update data
   * @returns {this} this this
   */
  updateOrInsert(data: Record<string, any> & { length?: never }): this {
    this.updateOrCreate(data);
    return this;
  }

  /**
   * The 'insertOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
   *
   * This method is particularly useful when you want to update a record based on certain conditions and,
   * if the record matching those conditions doesn't exist, create a new one with the provided data.
   * @param {object} data insert or update data
   * @returns {this} this this
   */
  insertOrUpdate(data: Record<string, any> & { length?: never }): this {
    this.updateOrCreate(data);
    return this;
  }

  /**
   *
   * The 'createOrUpdate' method allows you to update an existing record in a database table if it exists or create a new record if it does not exist.
   *
   * This method is particularly useful when you want to update a record based on certain conditions and,
   * if the record matching those conditions doesn't exist, create a new one with the provided data.
   * @param {object} data create or update data
   * @returns {this} this this
   */
  createOrUpdate(data: Record<string, any> & { length?: never }): this {
    this.updateOrCreate(data);
    return this;
  }

  /**
   * The 'toString' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
   *
   * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
   * @returns {string} return sql query
   */
  toString(): string {
    const sql = this._queryBuilder().any();
    return this._resultHandler(sql);
  }

  /**
   * The 'toSQL' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
   *
   * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
   * @returns {string} return sql query
   */
  toSQL(): string {
    return this.toString();
  }

  /**
   * The 'toRawSQL' method is used to retrieve the raw SQL query that would be executed by a query builder instance without actually executing it.
   *
   * This method is particularly useful for debugging and understanding the SQL queries generated by your application.
   * @returns {string}
   */
  toRawSQL(): string {
    return this.toString();
  }

  /**
   * The 'getTableName' method is used to get table name
   * @returns {string} return table name
   */
  getTableName(): string {
    return this.$state.get("TABLE_NAME").replace(/\`/g, "");
  }

  /**
   * The 'getColumns' method is used to get columns
   * @returns {this} this this
   */
  async getColumns(): Promise<string[]> {
    const sql: string = [
      `${this.$constants("SHOW")}`,
      `${this.$constants("COLUMNS")}`,
      `${this.$constants("FROM")}`,
      `\`${this.$state.get("TABLE_NAME").replace(/\`/g, "")}\``,
    ].join(" ");

    const rawColumns = await this._queryStatement(sql);

    const columns = rawColumns.map((column: { Field: string }) => column.Field);

    return columns;
  }

  /**
   * The 'getSchema' method is used to get schema information
   * @returns {this} this this
   */
  async getSchema(): Promise<any[]> {
    const sql: string = [
      `${this.$constants("SHOW")}`,
      `${this.$constants("COLUMNS")}`,
      `${this.$constants("FROM")}`,
      `\`${this.$state.get("TABLE_NAME").replace(/\`/g, "")}\``,
    ].join(" ");

    return await this._queryStatement(sql);
  }

  /**
   * The 'bindColumn' method is used to concat table and column -> `users`.`id`
   * @param {string} column
   * @returns {string} return table.column
   */
  bindColumn(column: string): string {
    if (!/\./.test(column)) {
      if (column === "*") return "*";

      const alias = this.$state.get("ALIAS");

      if (this.getTableName() === "") {
        return `\`${column.replace(/`/g, "")}\``;
      }

      return [
        alias == null || alias === ""
          ? `\`${this.getTableName().replace(/`/g, "")}\``
          : `\`${alias.replace(/`/g, "")}\``,
        ".",
        `\`${column.replace(/`/g, "")}\``,
      ].join("");
    }

    const [table, c] = column.split(".");

    if (c === "*") {
      return `\`${table.replace(/`/g, "")}\`.*`;
    }

    return `\`${table.replace(/`/g, "")}\`.\`${c.replace(/`/g, "")}\``;
  }

  /**
   * The 'debug' method is used to console.log raw SQL query that would be executed by a query builder
   * @param {boolean} debug debug sql statements
   * @returns {this} this this
   */
  debug(debug: boolean = true): this {
    this.$state.set("DEBUG", debug);
    return this;
  }

  /**
   * The 'dd' method is used to console.log raw SQL query that would be executed by a query builder
   * @param {boolean} debug debug sql statements
   * @returns {this} this this
   */
  dd(debug: boolean = true): this {
    this.$state.set("DEBUG", debug);
    return this;
  }

  /**
   * The 'hook' method is used function when execute returns a result to callback function
   * @param {Function} func function for callback result
   * @returns {this}
   */
  hook(func: Function): this {
    if (typeof func !== "function")
      throw new Error(`this '${func}' is not a function`);

    this.$state.set("HOOKS", [...this.$state.get("HOOKS"), func]);
    return this;
  }

  /**
   * The 'before' method is used function when execute returns a result to callback function
   * @param {Function} func function for callback result
   * @returns {this}
   */
  before(func: Function): this {
    if (typeof func !== "function")
      throw new Error(`this '${func}' is not a function`);

    this.$state.set("HOOKS", [...this.$state.get("HOOKS"), func]);
    return this;
  }

  /**
   *
   * @param {Object} options options for connection database with credentials
   * @param {string} option.host
   * @param {number} option.port
   * @param {string} option.database
   * @param {string} option.user
   * @param {string} option.password
   * @returns {this} this
   */
  connection(options: TConnectionOptions): this {
    const {
      host,
      port,
      database,
      username: user,
      password,
      ...others
    } = options;

    const pool = new PoolConnection({
      host,
      port,
      database,
      user,
      password,
      ...others,
    });

    this.$pool.set(pool.connected());

    return this;
  }

  /**
   *
   * @param {string} env load environment using with command line arguments
   * @returns {this} this
   */
  loadEnv(env?: string): this {
    if (env === null) return this;

    const options = loadOptionsEnvironment();

    const pool = new PoolConnection({
      host: String(options.host),
      port: Number(options.port),
      database: String(options.database),
      user: String(options.username),
      password: String(options.password),
    });

    this.$pool.set(pool.connected());

    return this;
  }

  /**
   *
   * @param {Function} pool pool connection database
   * @returns {this} this
   */
  pool(pool: TConnection): this {
    if (!pool?.hasOwnProperty("query")) {
      throw new Error("pool must have a query property");
    }

    this.$pool.set(pool);
    return this;
  }

  /**
   * make sure this connection has same transaction in pool connection
   * @param {object} connection pool database
   * @returns {this} this
   */
  bind(connection: TConnection | TConnectionTransaction): this {
    if (!connection?.hasOwnProperty("query")) {
      throw new Error("connection must have a query property");
    }

    if (typeof connection.query !== "function") {
      throw new Error("connection must have a query function");
    }

    this.$pool.set(connection);

    return this;
  }

  /**
   * This 'rawQuery' method is used to execute sql statement
   *
   * @param {string} sql
   * @returns {promise<any>}
   */
  async rawQuery(sql: string): Promise<any> {
    return await this._queryStatement(sql);
  }

  /**
   * This 'rawQuery' method is used to execute sql statement
   *
   * @param {string} sql
   * @returns {promise<any>}
   */
  static rawQuery(sql: string): Promise<any> {
    return new this().rawQuery(sql);
  }

  /**
   *
   * plus value then update
   * @param {string} column
   * @param {number} value
   * @returns {promise<any>}
   */
  async increment(column: string = "id", value: number = 1): Promise<any> {
    const query = `${this.$constants("SET")} ${column} = ${column} + ${value}`;
    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    return await this._update(true);
  }

  /**
   *
   * minus value then update
   * @param {string} column
   * @param {number} value
   * @returns {promise<any>}
   */
  async decrement(column: string = "id", value: number = 1): Promise<any> {
    const query = `${this.$constants("SET")} ${column} = ${column} - ${value}`;
    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );
    return await this._update(true);
  }

  async version(): Promise<string> {
    const result = await this._queryStatement(
      `${this.$constants("SELECT")} VERSION() as version`
    );
    return result[0].version;
  }

  /**
   * The 'all' method is used to retrieve all records from a database table associated.
   *
   * It returns an array instances, ignore all condition.
   * @returns {promise<any>}
   */
  async all(): Promise<any> {
    return await this._queryStatement(
      [
        `${this.$constants("SELECT")}`,
        `*`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );
  }

  /**
   * The 'find' method is used to retrieve a single record from a database table by its primary key.
   *
   * This method allows you to quickly fetch a specific record by specifying the primary key value, which is typically an integer id.
   * @param {number} id
   * @returns {promise<any>}
   */
  async find(id: number): Promise<Record<string, any> | null> {
    this.where("id", id);

    return await this.first();
  }

  /**
   * The 'pagination' method is used to perform pagination on a set of database query results obtained through the Query Builder.
   *
   * It allows you to split a large set of query results into smaller, more manageable pages,
   * making it easier to display data in a web application and improve user experience
   * @param {?object} paginationOptions
   * @param {number} paginationOptions.limit default 15
   * @param {number} paginationOptions.page default 1
   * @returns {promise<Pagination>}
   */
  async pagination(paginationOptions?: {
    limit?: number;
    page?: number;
  }): Promise<TPagination> {
    let limit = 15;
    let page = 1;

    if (paginationOptions != null) {
      limit = paginationOptions?.limit || limit;
      page = paginationOptions?.page || page;
    }

    const currentPage: number = page;
    const nextPage: number = currentPage + 1;
    const prevPage: number = currentPage - 1 === 0 ? 1 : currentPage - 1;
    const offset: number = (page - 1) * limit;

    this.limit(limit);
    this.offset(offset);

    let sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    if (this.$state.get("HIDDEN")?.length) this._hiddenColumn(result);

    if (!result.length)
      return {
        //@ts-ignore
        meta: {
          total: 0,
          limit,
          total_page: 0,
          current_page: currentPage,
          last_page: 0,
          next_page: 0,
          prev_page: 0,
        },
        data: [],
      };

    const total = await new DB()
      .copyBuilder(this, { where: true, join: true })
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .unset({ alias: true })
      .count();

    let lastPage: number = Math.ceil(total / limit) || 0;
    lastPage = lastPage > 1 ? lastPage : 1;

    const totalPage = result?.length ?? 0;

    return {
      //@ts-ignore
      meta: {
        total: total,
        limit: limit,
        total_page: totalPage,
        current_page: currentPage,
        last_page: lastPage,
        next_page: nextPage,
        prev_page: prevPage,
      },
      data: result ?? [],
    };
  }

  /**
   * The 'paginate' method is used to perform pagination on a set of database query results obtained through the Query Builder.
   *
   * It allows you to split a large set of query results into smaller, more manageable pages,
   * making it easier to display data in a web application and improve user experience
   * @param {?object} paginationOptions
   * @param {number} paginationOptions.limit
   * @param {number} paginationOptions.page
   * @returns {promise<Pagination>}
   */
  async paginate(paginationOptions?: {
    limit?: number;
    page?: number;
  }): Promise<TPagination> {
    let limit = 15;
    let page = 1;

    if (paginationOptions != null) {
      limit = paginationOptions?.limit || limit;
      page = paginationOptions?.page || page;
    }

    return await this.pagination({ limit, page });
  }

  /**
   *
   * The 'first' method is used to retrieve the first record that matches the query conditions.
   *
   * It allows you to retrieve a single record from a database table that meets the specified criteria.
   * @param {Function?} cb callback function return query sql
   * @returns {promise<object | null>}
   */
  async first(cb?: Function): Promise<Record<string, any> | null> {
    if (this.$state.get("EXCEPTS")?.length)
      this.select(...(await this.exceptColumns()));

    this.limit(1);

    let sql: string = this._queryBuilder().select();

    if (cb) {
      const callbackSql = cb(sql);
      if (callbackSql == null || callbackSql === "")
        throw new Error("Please provide a callback for execution");
      sql = callbackSql;
    }

    const result: any[] = await this._queryStatement(sql);

    if (this.$state.get("VOID")) return null;

    if (this.$state.get("HIDDEN")?.length) this._hiddenColumn(result);

    if (this.$state.get("PLUCK")) {
      const pluck = this.$state.get("PLUCK");
      const newData = result?.shift();
      const checkProperty = newData.hasOwnProperty(pluck);
      if (!checkProperty)
        throw new Error(`can't find property '${pluck}' of result`);

      const r = newData[pluck] || null;

      await this.$utils.hookHandle(this.$state.get("HOOKS"), r);

      return r;
    }

    if (this.$state.get("RETURN_TYPE") != null) {
      const returnType = this.$state.get("RETURN_TYPE");

      return this._resultHandler(
        returnType === "object"
          ? result[0]
          : returnType === "array"
          ? result
          : [result]
      );
    }

    const r = result[0] || null;

    await this.$utils.hookHandle(this.$state.get("HOOKS"), r);

    return this._resultHandler(r);
  }

  /**
   *
   * The 'findOne' method is used to retrieve the first record that matches the query conditions.
   *
   * It allows you to retrieve a single record from a database table that meets the specified criteria.
   * @param {Function?} cb callback function return query sql
   * @returns {promise<object | null>}
   */
  async findOne(cb?: Function): Promise<Record<string, any> | null> {
    return await this.first(cb);
  }

  /**
   * The 'firstOrError' method is used to retrieve the first record that matches the query conditions.
   *
   * It allows you to retrieve a single record from a database table that meets the specified criteria.
   *
   * If record is null, this method will throw an error
   * @returns {promise<object | Error>}
   */
  async firstOrError(
    message: string,
    options?: Record<string, any>
  ): Promise<Record<string, any>> {
    if (this.$state.get("EXCEPTS")?.length)
      this.select(...(await this.exceptColumns()));

    this.limit(1);

    let sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    if (this.$state.get("HIDDEN")?.length) this._hiddenColumn(result);

    if (this.$state.get("PLUCK")) {
      const pluck = this.$state.get("PLUCK");
      const newData = result?.shift();
      const checkProperty = newData.hasOwnProperty(pluck);
      if (!checkProperty)
        throw new Error(`can't find property '${pluck}' of result`);

      const data = newData[pluck] || null;

      if (data == null) {
        if (options == null) throw { message, code: 400 };
        throw { message, ...options };
      }

      await this.$utils.hookHandle(this.$state.get("HOOKS"), data);

      return this._resultHandler(data);
    }

    const data = result?.shift() || null;

    if (data == null) {
      if (options == null) {
        throw { message, code: 400 };
      }

      throw { message, ...options };
    }

    await this.$utils.hookHandle(this.$state.get("HOOKS"), data);

    return this._resultHandler(data);
  }

  /**
   * The 'findOneOrError' method is used to retrieve the first record that matches the query conditions.
   *
   * It allows you to retrieve a single record from a database table that meets the specified criteria.
   *
   * If record is null, this method will throw an error
   * execute data return object | null
   * @returns {promise<object | null>}
   */
  async findOneOrError(
    message: string,
    options?: Record<string, any>
  ): Promise<Record<string, any>> {
    return this.firstOrError(message, options);
  }

  /**
   * The 'get' method is used to execute a database query and retrieve the result set that matches the query conditions.
   *
   * It retrieves multiple records from a database table based on the criteria specified in the query.
   * @param {Function?} cb callback function return query sql
   * @returns {promise<any[]>}
   */
  async get(cb?: Function): Promise<any[]> {
    if (this.$state.get("EXCEPTS")?.length)
      this.select(...(await this.exceptColumns()));

    let sql: string = this._queryBuilder().select();

    if (cb) {
      const callbackSql = cb(sql);
      if (callbackSql == null || callbackSql === "")
        throw new Error("Please provide a callback for execution");
      sql = callbackSql;
    }

    const result: any[] = await this._queryStatement(sql);

    if (this.$state.get("VOID")) return [];

    if (this.$state.get("HIDDEN")?.length) this._hiddenColumn(result);

    if (this.$state.get("CHUNK")) {
      const data = result.reduce(
        (resultArray: any[][], item: any, index: number) => {
          const chunkIndex = Math.floor(index / this.$state.get("CHUNK"));
          if (!resultArray[chunkIndex]) resultArray[chunkIndex] = [];
          resultArray[chunkIndex].push(item);

          return resultArray;
        },
        []
      );

      await this.$utils.hookHandle(this.$state.get("HOOKS"), data || []);

      return this._resultHandler(data || []);
    }

    if (this.$state.get("PLUCK")) {
      const pluck = this.$state.get("PLUCK");
      const newData = result.map((d: any) => d[pluck]);
      if (newData.every((d: any) => d == null)) {
        throw new Error(`can't find property '${pluck}' of result`);
      }

      await this.$utils.hookHandle(this.$state.get("HOOKS"), newData || []);

      return this._resultHandler(newData || []);
    }

    await this.$utils.hookHandle(this.$state.get("HOOKS"), result || []);

    if (this.$state.get("RETURN_TYPE") != null) {
      const returnType = this.$state.get("RETURN_TYPE");
      return this._resultHandler(
        returnType === "object"
          ? result[0]
          : returnType === "array"
          ? result
          : [result]
      );
    }

    return this._resultHandler(result || []);
  }

  /**
   * The 'findMany' method is used to execute a database query and retrieve the result set that matches the query conditions.
   *
   * It retrieves multiple records from a database table based on the criteria specified in the query.
   * @param {Function?} cb callback function return query sql
   * @returns {promise<any[]>}
   */
  async findMany(cb?: Function): Promise<any[]> {
    return await this.get(cb);
  }

  /**
   *
   * The 'toJSON' method is used to execute a database query and retrieve the result set that matches the query conditions.
   *
   * It retrieves multiple records from a database table based on the criteria specified in the query.
   *
   * It returns a JSON formatted
   * @returns {promise<string>}
   */
  async toJSON(): Promise<string> {
    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    if (this.$state.get("HIDDEN").length) this._hiddenColumn(result);

    return this._resultHandler(JSON.stringify(result));
  }

  /**
   * The 'toArray' method is used to execute a database query and retrieve the result set that matches the query conditions.
   *
   * It retrieves multiple records from a database table based on the criteria specified in the query.
   *
   * It returns an array formatted
   * @param {string=} column [column=id]
   * @returns {promise<Array>}
   */
  async toArray(column: string = "id"): Promise<any[]> {
    this.selectRaw(`${this.bindColumn(column)}`);

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    const toArray: any[] = result.map(
      (data: Record<string, any>) => data[column]
    );

    return this._resultHandler(toArray);
  }

  /**
   * The 'exists' method is used to determine if any records exist in the database table that match the query conditions.
   *
   * It returns a boolean value indicating whether there are any matching records.
   * @returns {promise<boolean>}
   */
  async exists(): Promise<boolean> {
    const sql = new Builder()
      .copyBuilder(this, { where: true, limit: true, join: true })
      .selectRaw("1")
      .limit(1)
      .toString();

    const result = await this._queryStatement(
      [
        `${this.$constants("SELECT")}`,
        `${this.$constants("EXISTS")}`,
        `(${sql})`,
        `${this.$constants("AS")} \`aggregate\``,
      ].join(" ")
    );

    return Boolean(this._resultHandler(!!result?.shift()?.aggregate || false));
  }

  /**
   * The 'count' method is used to retrieve the total number of records that match the specified query conditions.
   *
   * It returns an integer representing the count of records.
   * @param {string=} column [column=id]
   * @returns {promise<number>}
   */
  async count(column: string = "id"): Promise<number> {
    const distinct = this.$state.get("DISTINCT");

    column =
      column === "*"
        ? "*"
        : distinct
        ? `${this.$constants("DISTINCT")} ${this.bindColumn(column)}`
        : `${this.bindColumn(column)}`;

    this.selectRaw(
      `${this.$constants("COUNT")}(${column}) ${this.$constants(
        "AS"
      )} \`aggregate\``
    );

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    return Number(
      this._resultHandler(
        result.reduce((prev, cur) => prev + Number(cur?.aggregate ?? 0), 0) || 0
      )
    );
  }

  /**
   * The 'avg' method is used to calculate the average value of a numeric column in a database table.
   *
   * It calculates the mean value of the specified column for all records that match the query conditions and returns the result as a floating-point number.
   * @param {string=} column [column=id]
   * @returns {promise<number>}
   */
  async avg(column: string = "id"): Promise<number> {
    const distinct = this.$state.get("DISTINCT");

    column = distinct
      ? `${this.$constants("DISTINCT")} ${this.bindColumn(column)}`
      : `${this.bindColumn(column)}`;

    this.selectRaw(
      `${this.$constants("AVG")}(${column}) ${this.$constants(
        "AS"
      )} \`aggregate\``
    );

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    return Number(
      this._resultHandler(
        (result.reduce((prev, cur) => prev + Number(cur?.aggregate ?? 0), 0) ||
          0) / result.length
      )
    );
  }

  /**
   * The 'sum' method is used to calculate the sum of values in a numeric column of a database table.
   *
   * It computes the total of the specified column's values for all records that match the query conditions and returns the result as a numeric value.
   * @param {string=} column [column=id]
   * @returns {promise<number>}
   */
  async sum(column: string = "id"): Promise<number> {
    const distinct = this.$state.get("DISTINCT");

    column = distinct
      ? `${this.$constants("DISTINCT")} ${this.bindColumn(column)}`
      : `${this.bindColumn(column)}`;

    this.selectRaw(
      `${this.$constants("SUM")}(${column}) ${this.$constants(
        "AS"
      )} \`aggregate\``
    );

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    return Number(
      this._resultHandler(
        result.reduce((prev, cur) => prev + Number(cur?.aggregate ?? 0), 0) || 0
      )
    );
  }

  /**
   * The 'max' method is used to retrieve the maximum value of a numeric column in a database table.
   *
   * It finds the highest value in the specified column among all records that match the query conditions and returns that value.
   * @param {string=} column [column=id]
   * @returns {promise<number>}
   */
  async max(column: string = "id"): Promise<number> {
    const distinct = this.$state.get("DISTINCT");

    column = distinct
      ? `${this.$constants("DISTINCT")} ${this.bindColumn(column)}`
      : `${this.bindColumn(column)}`;

    this.selectRaw(
      `${this.$constants("MAX")}(${column}) ${this.$constants(
        "AS"
      )} \`aggregate\``
    );

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    return Number(
      this._resultHandler(
        result.sort((a, b) => b?.aggregate - a?.aggregate)[0]?.aggregate || 0
      )
    );
  }

  /**
   * The 'min' method is used to retrieve the minimum (lowest) value of a numeric column in a database table.
   *
   * It finds the smallest value in the specified column among all records that match the query conditions and returns that value.
   * @param {string=} column [column=id]
   * @returns {promise<number>}
   */
  async min(column: string = "id"): Promise<number> {
    const distinct = this.$state.get("DISTINCT");

    column = distinct
      ? `${this.$constants("DISTINCT")} ${this.bindColumn(column)}`
      : `${this.bindColumn(column)}`;

    this.selectRaw(
      `${this.$constants("MIN")}(${column}) ${this.$constants(
        "AS"
      )} \`aggregate\``
    );

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    return Number(
      this._resultHandler(
        result.sort((a, b) => a?.aggregate - b?.aggregate)[0]?.aggregate || 0
      )
    );
  }

  /**
   * The 'delete' method is used to delete records from a database table based on the specified query conditions.
   *
   * It allows you to remove one record that match certain criteria.
   * @returns {promise<boolean>}
   */
  async delete(): Promise<boolean> {
    if (!this.$state.get("WHERE").length) {
      throw new Error("can't delete without where condition");
    }

    this.limit(1);

    this.$state.set(
      "DELETE",
      [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );

    const result = await this._actionStatement({
      sql: this._queryBuilder().delete(),
    });

    if (result) return Boolean(this._resultHandler(!!result || false));

    return Boolean(this._resultHandler(false));
  }

  /**
   * The 'deleteMany' method is used to delete records from a database table based on the specified query conditions.
   *
   * It allows you to remove more records that match certain criteria.
   * @returns {promise<boolean>}
   */
  async deleteMany(): Promise<boolean> {
    if (!this.$state.get("WHERE").length) {
      throw new Error("can't delete without where condition");
    }

    this.$state.set(
      "DELETE",
      [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );

    const result = await this._actionStatement({
      sql: this._queryBuilder().delete(),
    });

    if (result) return Boolean(this._resultHandler(!!result || false));

    return Boolean(this._resultHandler(false));
  }

  /**
   *
   * The 'delete' method is used to delete records from a database table based on the specified query conditions.
   *
   * It allows you to remove one or more records that match certain criteria.
   *
   * This method should be ignore the soft delete
   * @returns {promise<boolean>}
   */
  async forceDelete(): Promise<boolean> {
    this.$state.set(
      "DELETE",
      [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );

    const result = await this._actionStatement({
      sql: this._queryBuilder().delete(),
    });

    if (result) return Boolean(this._resultHandler(!!result || false));

    return Boolean(this._resultHandler(!!result || false));
  }

  /**
   * The 'getGroupBy' method is used to execute a database query and retrieve the result set that matches the query conditions.
   *
   * It retrieves multiple records from a database table based on the criteria specified in the query.
   *
   * It returns record to new Map
   * @param {string} column
   * @example
   *  const results = await new DB('posts')
   * .getGroupBy('user_id')
   *
   *  // you can find with user id in the results
   *  const postsByUserId1 = results.get(1)
   * @returns {promise<Array>}
   */
  async getGroupBy(column: string): Promise<Map<string | number, any[]>> {
    if (this.$state.get("EXCEPTS")?.length)
      this.select(...((await this.exceptColumns()) as any[]));

    const results = await new Builder()
      .copyBuilder(this, {
        where: true,
        limit: true,
        join: true,
        orderBy: true,
      })
      .select(column)
      .selectRaw(
        [
          `${this.$constants("GROUP_CONCAT")}(${this.bindColumn("id")})`,
          `${this.$constants("AS")} \`aggregate\``,
        ].join(" ")
      )
      .groupBy(column)
      .oldest()
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .get();

    const ids: number[] = [];

    for (const r of results) {
      const splits: number[] = (r?.aggregate?.split(",") ?? []).map(
        (v: string) => Number(v)
      );
      ids.push(...splits);
    }

    const grouping = await new Builder()
      .whereIn("id", ids)
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .get();

    const result = grouping.reduce((map, data) => {
      const id = data[column];
      if (!map.has(id)) {
        map.set(id, []);
      }
      map.get(id)!.push(data);
      return map;
    }, new Map());

    return this._resultHandler(result);
  }

  /**
   * The 'findGroupBy' method is used to execute a database query and retrieve the result set that matches the query conditions.
   *
   * It retrieves multiple records from a database table based on the criteria specified in the query.
   *
   * It returns record to new Map
   * @param {string} column
   * @example
   *  const results = await new DB('posts')
   * .findGroupBy('user_id')
   *
   *  // you can find with user id in the results
   *  const postsByUserId1 = results.get(1)
   * @returns {promise<Array>}
   */
  async findGroupBy(column: string): Promise<Map<string | number, any[]>> {
    return await this.getGroupBy(column);
  }

  /**
   * The 'save' method is used to persist a new 'Model' or new 'DB' instance or update an existing model instance in the database.
   *
   * It's a versatile method that can be used in various scenarios, depending on whether you're working with a new or existing record.
   * @returns {Promise<any>} promise
   */
  async save({ waitMs = 0 } = {}): Promise<
    Record<string, any> | any[] | null | undefined
  > {
    this.$state.set("AFTER_SAVE", waitMs);

    switch (this.$state.get("SAVE")) {
      case "INSERT":
        return await this._insert();
      case "UPDATE":
        return await this._update();
      case "INSERT_MULTIPLE":
        return await this._insertMultiple();
      case "INSERT_NOT_EXISTS":
        return await this._insertNotExists();
      case "UPDATE_OR_INSERT":
        return await this._updateOrInsert();
      case "INSERT_OR_SELECT":
        return await this._insertOrSelect();
      default:
        throw new Error(`unknown this [${this.$state.get("SAVE")}]`);
    }
  }

  /**
   *
   * The 'makeSelectStatement' method is used to make select statement.
   * @returns {Promise<string>} string
   */
  async makeSelectStatement(): Promise<string> {
    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("SELECT")}`,
        `${columns.join(", ")}`,
        `${this.$constants("FROM")}`,
        `\`${this.getTableName()}\``,
      ].join(" ");
    };

    const schemaTable = await this.getSchema();
    const columns = schemaTable.map((column) => this.bindColumn(column.Field));

    return makeStatement(columns);
  }

  /**
   *
   * The 'makeInsertStatement' method is used to make insert table statement.
   * @returns {Promise<string>} string
   */
  async makeInsertStatement(): Promise<string> {
    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("INSERT")}`,
        `\`${this.getTableName()}\``,
        `(${columns.join(", ")})`,
        `${this.$constants("VALUES")}`,
        `(${Array(columns.length).fill("`?`").join(" , ")})`,
      ].join(" ");
    };

    const schemaTable = await this.getSchema();
    const columns = schemaTable.map((column) => `\`${column.Field}\``);

    return makeStatement(columns);
  }

  /**
   *
   * The 'makeUpdateStatement' method is used to make update table statement.
   * @returns {Promise<string>} string
   */
  async makeUpdateStatement(): Promise<string> {
    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("UPDATE")}`,
        `\`${this.getTableName()}\``,
        `${this.$constants("SET")}`,
        `(${columns.join(", ")})`,
        `${this.$constants("WHERE")}`,
        `${this.bindColumn("id")} = '?'`,
      ].join(" ");
    };

    const schemaTable = await this.getSchema();
    const columns = schemaTable.map(
      (column) => `${this.bindColumn(column.Field)} = '?'`
    );

    return makeStatement(columns);
  }

  /**
   *
   * The 'makeDeleteStatement' method is used to make delete statement.
   * @returns {Promise<string>} string
   */
  async makeDeleteStatement(): Promise<string> {
    const makeStatement = () => {
      return [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `\`${this.getTableName()}\``,
        `${this.$constants("WHERE")}`,
        `${this.bindColumn("id")} = \`?\``,
      ].join(" ");
    };

    return makeStatement();
  }

  /**
   *
   * The 'makeCreateTableStatement' method is used to make create table statement.
   * @returns {Promise<string>} string
   */
  async makeCreateTableStatement(): Promise<string> {
    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
        `\`${this.getTableName()}\``,
        `(`,
        `\n${columns?.join(",\n")}`,
        `\n)`,
        `${this.$constants("ENGINE")}`,
      ].join(" ");
    };

    const columns = await this.showSchema();

    return makeStatement(columns);
  }

  /**
   * The 'showTables' method is used to show schema table.
   *
   * @returns {Promise<Array>}
   */
  async showTables(): Promise<string[]> {
    const sql: string = [
      `${this.$constants("SHOW")}`,
      `${this.$constants("TABLES")}`,
    ].join(" ");

    const results: any[] = await this._queryStatement(sql);

    return results
      .map((table) => String(Object.values(table)[0]))
      .filter((d) => d != null || d !== "");
  }
  /**
   *
   * The 'showColumns' method is used to show columns table.
   *
   * @param {string=} table table name
   * @returns {Promise<Array>}
   */
  async showColumns(
    table: string = this.$state.get("TABLE_NAME")
  ): Promise<string[]> {
    const sql: string = [
      `${this.$constants("SHOW")}`,
      `${this.$constants("COLUMNS")}`,
      `${this.$constants("FROM")}`,
      `\`${table.replace(/\`/g, "")}\``,
    ].join(" ");

    const rawColumns: any[] = await this._queryStatement(sql);

    const columns = rawColumns.map((column: { Field: string }) => column.Field);

    return columns;
  }

  /**
   * The 'showSchema' method is used to show schema table.
   *
   * @param {string=} table [table= current table name]
   * @returns {Promise<Array>}
   */
  async showSchema(
    table: string = this.$state.get("TABLE_NAME")
  ): Promise<string[]> {
    const sql: string = [
      `${this.$constants("SHOW")}`,
      `${this.$constants("COLUMNS")}`,
      `${this.$constants("FROM")}`,
      `\`${table.replace(/\`/g, "")}\``,
    ].join(" ");

    const raws: any[] = await this._queryStatement(sql);

    return raws.map((r: Record<string, any>) => {
      const schema: string[] = [];

      schema.push(`\`${r.Field}\``);

      schema.push(`${r.Type}`);

      if (r.Null === "YES") {
        schema.push(`NULL`);
      }

      if (r.Null === "NO") {
        schema.push(`NOT NULL`);
      }

      if (r.Key === "PRI") {
        schema.push(`PRIMARY KEY`);
      }

      if (r.Key === "UNI") {
        schema.push(`UNIQUE`);
      }

      if (r.Default) {
        schema.push(`DEFAULT '${r.Default}'`);
      }

      if (r.Extra) {
        schema.push(`${r.Extra.toUpperCase()}`);
      }

      return schema.join(" ");
    });
  }

  /**
   * The 'showSchemas' method is used to show schema table.
   *
   * @param {string=} table [table= current table name]
   * @returns {Promise<Array>}
   */
  async showSchemas(
    table: string = this.$state.get("TABLE_NAME")
  ): Promise<string[]> {
    return this.showSchema(table);
  }

  /**
   *
   * The 'showValues' method is used to show values table.
   *
   * @param {string=} table table name
   * @returns {Promise<Array>}
   */
  async showValues(
    table: string = this.$state.get("TABLE_NAME")
  ): Promise<string[]> {
    const sql: string = [
      `${this.$constants("SELECT")}`,
      "*",
      `${this.$constants("FROM")}`,
      `\`${table.replace(/\`/g, "")}\``,
    ].join(" ");

    const raw = await this._queryStatement(sql);

    const values = raw.map((value: any) => {
      return `(${Object.values(value)
        .map((v: any) => {
          if (this.$utils.typeOf(v) === "date")
            return `'${this.$utils.timestamp(v)}'`;

          if (
            this.$utils.typeOf(v) === "object" &&
            v != null &&
            !Array.isArray(v)
          )
            return `'${JSON.stringify(v)}'`;

          return v == null ? this.$constants("NULL") : `'${v}'`;
        })
        .join(", ")})`;
    });

    return values;
  }

  /**
   *
   * The 'faker' method is used to insert a new records into a database table associated.
   *
   * It simplifies the process of creating and inserting records.
   * @param {number} rows number of rows
   * @returns {promise<any>}
   */
  async faker(
    rows: number,
    cb?: (results: Record<string, any>, index: number) => Record<string, any>
  ): Promise<void> {
    if (
      this.$state.get("TABLE_NAME") === "" ||
      this.$state.get("TABLE_NAME") == null
    ) {
      throw new Error("Unknow this table name");
    }

    const sql: string = [
      `${this.$constants("SHOW")}`,
      `${this.$constants("FIELDS")}`,
      `${this.$constants("FROM")}`,
      `${this.$state.get("TABLE_NAME")}`,
    ].join(" ");

    const fields: Array<{ Field: string; Type: string }> =
      await this._queryStatement(sql);

    const fakers: any[] = [];

    const uuid = "uuid";

    const passed = (field: string) => ["id", "_id"].some((p) => field === p);

    for (let row = 0; row < rows; row++) {
      let columnAndValue: Record<string, any> = {};

      for (const { Field: field, Type: type } of fields) {
        if (passed(field)) continue;

        columnAndValue = {
          ...columnAndValue,
          [field]:
            field === uuid
              ? this.$utils.faker("uuid")
              : this.$utils.faker(type),
        };
      }

      if (cb) {
        fakers.push(cb(columnAndValue, row));
        continue;
      }

      fakers.push(columnAndValue);
    }

    const chunked = this.$utils.chunkArray([...fakers], 500);

    const promises: Function[] = [];

    const table = this.getTableName();

    for (const data of chunked) {
      promises.push(() => {
        return new DB(table)
          .debug(this.$state.get("DEBUG"))
          .createMultiple([...data])
          .void()
          .save();
      });
    }

    await Promise.allSettled(promises.map((v) => v()));

    return;
  }

  /**
   * The 'truncate' method is used to clear all data in the table.
   *
   * @param {object} option
   * @property {boolean} option.force
   * @returns {promise<boolean>}
   */
  async truncate({
    force = false,
  }: { force?: boolean } = {}): Promise<boolean> {
    if (
      this.$state.get("TABLE_NAME") == null ||
      this.$state.get("TABLE_NAME") === ""
    ) {
      console.log(`Please set the your table name`);
      return false;
    }

    const sql: string = [
      `${this.$constants("TRUNCATE_TABLE")}`,
      `${this.$state.get("TABLE_NAME")}`,
    ].join(" ");

    if (!force) {
      console.log(
        `Truncating will delete all data from the table '${this.$state.get(
          "TABLE_NAME"
        )}'. Are you sure you want to proceed?. Please confirm if you want to force the operation.`
      );
      return false;
    }

    await this._queryStatement(sql);

    return true;
  }

  /**
   *
   * The 'drop' method is used to drop the table.
   *
   * @param {object} option
   * @property {boolean} option.force
   * @returns {promise<boolean>}
   */
  async drop({ force = false }: { force?: boolean } = {}): Promise<boolean> {
    if (
      this.$state.get("TABLE_NAME") == null ||
      this.$state.get("TABLE_NAME") === ""
    ) {
      console.log(`Please set the your table name`);
      return false;
    }

    const sql: string = [
      `${this.$constants("DROP_TABLE")}`,
      `${this.$state.get("TABLE_NAME")}`,
    ].join(" ");

    if (!force) {
      console.log(
        `Droping will drop the table '${this.$state.get(
          "TABLE_NAME"
        )}'. Are you sure you want to proceed?. Please confirm if you want to force the operation.`
      );
      return false;
    }

    await this._queryStatement(sql);

    return true;
  }

  protected async exceptColumns(): Promise<string[]> {
    const excepts = this.$state.get("EXCEPTS");
    const hasDot = excepts.some((except: string) => /\./.test(except));
    const names = excepts
      .map((except: string) => {
        if (/\./.test(except)) return except.split(".")[0];
        return null;
      })
      .filter((d: null) => d != null);

    const tableNames = names.length
      ? [...new Set(names)]
      : [this.$state.get("TABLE_NAME")];

    const removeExcepts: string[][] = [];

    for (const tableName of tableNames) {
      const sql: string = [
        `${this.$constants("SHOW")}`,
        `${this.$constants("COLUMNS")}`,
        `${this.$constants("FROM")}`,
        `${tableName}`,
      ].join(" ");

      const rawColumns = await this._queryStatement(sql);

      const columns = rawColumns.map(
        (column: { Field: string }) => column.Field
      );

      const removeExcept = columns.filter((column: string) => {
        return excepts.every((except: string) => {
          if (/\./.test(except)) {
            const [table, _] = except.split(".");
            return except !== `${table}.${column}`;
          }
          return except !== column;
        });
      });
      removeExcepts.push(
        hasDot ? removeExcept.map((r) => `${tableName}.${r}`) : removeExcept
      );
    }

    return removeExcepts.flat();
  }

  protected _updateHandler(
    column: string,
    value?: string | number | null | boolean
  ): string {
    return DB.raw(
      [
        this.$constants("CASE"),
        this.$constants("WHEN"),
        `(\`${column}\` = "" ${this.$constants(
          "OR"
        )} \`${column}\` ${this.$constants("IS_NULL")})`,
        this.$constants("THEN"),
        `"${value ?? ""}" ${this.$constants("ELSE")} \`${column}\``,
        this.$constants("END"),
      ].join(" ")
    );
  }

  protected copyBuilder(
    instance: Builder,
    options?: {
      update?: boolean;
      insert?: boolean;
      delete?: boolean;
      where?: boolean;
      limit?: boolean;
      orderBy?: boolean;
      join?: boolean;
      offset?: boolean;
      groupBy?: boolean;
      select?: boolean;
      having?: boolean;
    }
  ): Builder {
    if (!(instance instanceof Builder))
      throw new Error("Value is not a instanceof Builder");

    const copy = Object.fromEntries(instance.$state.get());

    const newInstance = new Builder();

    newInstance.$state.clone(copy);
    newInstance.$state.set("SAVE", "");
    newInstance.$state.set("DEBUG", false);

    if (options?.insert == null || !options.insert)
      newInstance.$state.set("INSERT", "");
    if (options?.update == null || !options.update)
      newInstance.$state.set("UPDATE", "");
    if (options?.delete == null || !options.delete)
      newInstance.$state.set("DELETE", "");
    if (options?.where == null || !options.where)
      newInstance.$state.set("WHERE", []);
    if (options?.limit == null || !options.limit)
      newInstance.$state.set("LIMIT", "");
    if (options?.offset == null || !options.offset)
      newInstance.$state.set("OFFSET", "");
    if (options?.groupBy == null || !options.groupBy)
      newInstance.$state.set("GROUP_BY", "");
    if (options?.orderBy == null || !options.orderBy)
      newInstance.$state.set("ORDER_BY", []);
    if (options?.select == null || !options.select)
      newInstance.$state.set("SELECT", []);
    if (options?.join == null || !options.join)
      newInstance.$state.set("JOIN", []);
    if (options?.having == null || !options.having)
      newInstance.$state.set("HAVING", "");

    return newInstance;
  }

  protected _queryBuilder() {
    return this._buildQueryStatement();
  }

  protected _buildQueryStatement() {
    const buildSQL = (sql: (string | null)[]) =>
      sql
        .filter((s) => s !== "" || s == null)
        .join(" ")
        .replace(/\s+/g, " ");

    const bindJoin = (values: string[]) => {
      if (!Array.isArray(values) || !values.length) return null;

      return values.join(" ");
    };

    const bindWhere = (values: string[]) => {
      if (!Array.isArray(values) || !values.length) return null;

      return `${this.$constants("WHERE")} ${values
        .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
        .join(" ")}`;
    };

    const bindOrderBy = (values: string[]) => {
      if (!Array.isArray(values) || !values.length) return null;

      return `${this.$constants("ORDER_BY")} ${values
        .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
        .join(", ")}`;
    };

    const bindGroupBy = (values: string[]) => {
      if (!Array.isArray(values) || !values.length) return null;

      return `${this.$constants("GROUP_BY")} ${values
        .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
        .join(", ")}`;
    };

    const bindSelect = (values: string[]) => {
      if (!values.length) {
        if (!this.$state.get("DISTINCT"))
          return `${this.$constants("SELECT")} *`;

        return `${this.$constants("SELECT")} ${this.$constants("DISTINCT")} *`;
      }

      const findIndex = values.indexOf("*");

      if (findIndex > -1) {
        const removed = values.splice(findIndex, 1);
        values.unshift(removed[0]);
      }

      return `${this.$constants("SELECT")} ${values.join(", ")}`;
    };

    const bindFrom = ({
      from,
      table,
      alias,
      rawAlias,
    }: {
      from: string;
      table: string;
      alias: string | null;
      rawAlias: string | null;
    }) => {
      if (alias != null && alias !== "") {
        if (rawAlias != null && rawAlias !== "") {
          const raw = String(rawAlias)
            .replace(/^\(\s*|\s*\)$/g, "")
            .trim();
          const normalizedRawAlias =
            raw.startsWith("(") && raw.endsWith(")") ? raw.slice(1, -1) : raw;
          return `${from} (${normalizedRawAlias}) ${this.$constants(
            "AS"
          )} \`${alias}\``;
        }

        return `${from} ${table} ${this.$constants("AS")} \`${alias}\``;
      }

      return `${from} ${table}`;
    };

    const bindLimit = (limit: string | number) => {
      if (limit === "" || limit == null) return "";

      return `${this.$constants("LIMIT")} ${limit}`;
    };

    const select = () => {
      const sql = buildSQL([
        bindSelect(this.$state.get("SELECT")),
        bindFrom({
          from: this.$constants("FROM"),
          table: this.$state.get("TABLE_NAME"),
          alias: this.$state.get("ALIAS"),
          rawAlias: this.$state.get("RAW_ALIAS"),
        }),
        bindJoin(this.$state.get("JOIN")),
        bindWhere(this.$state.get("WHERE")),
        bindGroupBy(this.$state.get("GROUP_BY")),
        this.$state.get("HAVING"),
        bindOrderBy(this.$state.get("ORDER_BY")),
        bindLimit(this.$state.get("LIMIT")),
        this.$state.get("OFFSET"),
      ]).trimEnd();

      if (this.$state.get("CTE").length) {
        return `WITH ${this.$state.get("CTE")} ${sql}`;
      }

      return sql;
    };

    const insert = () => buildSQL([this.$state.get("INSERT")]);

    const update = () => {
      return buildSQL([
        this.$state.get("UPDATE"),
        bindWhere(this.$state.get("WHERE")),
        bindOrderBy(this.$state.get("ORDER_BY")),
        bindLimit(this.$state.get("LIMIT")),
      ]);
    };

    const remove = () => {
      return buildSQL([
        this.$state.get("DELETE"),
        bindWhere(this.$state.get("WHERE")),
        bindOrderBy(this.$state.get("ORDER_BY")),
        bindLimit(this.$state.get("LIMIT")),
      ]);
    };

    return {
      select,
      insert,
      update,
      delete: remove,
      where: () => bindWhere(this.$state.get("WHERE")),
      any: () => {
        if (this.$state.get("INSERT")) return insert();
        if (this.$state.get("UPDATE")) return update();
        if (this.$state.get("DELETE")) return remove();
        return select();
      },
    };
  }

  protected _resultHandler(data: any) {
    if (!this.$state.get("VOID")) {
      this.$state.set("RESULT", data);
    }

    this.$state.reset();
    this.$logger.reset();

    return data;
  }

  protected _resultHandlerExists(data: any) {
    if (!this.$state.get("VOID")) {
      this.$state.set("RESULT", data);
    }

    this.$state.reset();
    this.$logger.reset();

    return data;
  }

  whereReference(tableAndLocalKey: string, tableAndForeignKey?: string): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${tableAndLocalKey} = ${tableAndForeignKey}`,
      ].join(" "),
    ]);

    return this;
  }

  protected async _queryStatement(sql: string): Promise<any[]> {
    if (this.$state.get("DEBUG")) this.$utils.consoleDebug(sql);

    const result = await this.$pool.query(sql);

    return result;
  }

  protected async _actionStatement({
    sql,
    returnId = false,
  }: {
    sql: string;
    returnId?: boolean;
  }) {
    if (this.$state.get("DEBUG")) this.$utils.consoleDebug(sql);

    if (returnId) {
      const result = await this.$pool.query(sql);
      return [result.affectedRows, result.insertId];
    }

    const { affectedRows: result } = await this.$pool.query(sql);

    return result;
  }

  private async _insertNotExists() {
    if (!this.$state.get("WHERE").length)
      throw new Error("Can't insert not exists without where condition");

    let sql: string = [
      `${this.$constants("SELECT")}`,
      `${this.$constants("EXISTS")}(${this.$constants("SELECT")}`,
      `*`,
      `${this.$constants("FROM")}`,
      `${this.$state.get("TABLE_NAME")}`,
      `${this._queryBuilder().where()}`,
      `${this.$constants("LIMIT")} 1)`,
      `${this.$constants("AS")} 'exists'`,
    ].join(" ");

    const [{ exists: result }] = await this._queryStatement(sql);

    const check: boolean = !!Number.parseInt(result);

    switch (check) {
      case false: {
        const [result, id] = await this._actionStatement({
          sql: this.$state.get("INSERT"),
          returnId: true,
        });

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(undefined);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        const data = await new Builder()
          .copyBuilder(this, { select: true })
          .where("id", id)
          .first();

        return this._resultHandler(data);
      }

      default:
        return this._resultHandler(null);
    }
  }

  private async _insert() {
    const [result, id] = await this._actionStatement({
      sql: this.$state.get("INSERT"),
      returnId: true,
    });

    if (this.$state.get("VOID") || !result)
      return this._resultHandler(undefined);

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    const results = await new Builder()
      .copyBuilder(this, { select: true })
      .where("id", id)
      .first();

    return this._resultHandler(results);
  }

  protected _checkValueHasRaw(value: any) {
    const detectedValue =
      typeof value === "string" && value.includes(this.$constants("RAW"))
        ? `${this.$utils.covertBooleanToNumber(value)}`.replace(
            this.$constants("RAW"),
            ""
          )
        : `'${this.$utils.covertBooleanToNumber(value)}'`;

    return detectedValue;
  }

  protected _checkValueHasOp(str: string) {
    if (typeof str !== "string") str = String(str);

    if (
      !str.includes(this.$constants("OP")) ||
      !str.includes(this.$constants("VALUE"))
    ) {
      return null;
    }

    const opRegex = new RegExp(`\\${this.$constants("OP")}\\(([^)]+)\\)`);
    const valueRegex = new RegExp(`\\${this.$constants("VALUE")}\\(([^)]+)\\)`);

    const opMatch = str.match(opRegex);
    const valueMatch = str.match(valueRegex);

    const op = opMatch ? opMatch[1] : "";
    const value = valueMatch ? valueMatch[1] : "";

    return {
      op: op.replace(this.$constants("OP"), ""),
      value: value?.replace(this.$constants("VALUE"), "") ?? "",
    };
  }

  private async _insertMultiple() {
    const [result, id] = await this._actionStatement({
      sql: this._queryBuilder().insert(),
      returnId: true,
    });

    if (this.$state.get("VOID") || !result)
      return this._resultHandler(undefined);

    const arrayId = [...Array(result)].map((_, i) => i + id);

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    const resultData = await new Builder()
      .copyBuilder(this, { select: true, limit: true })
      .whereIn("id", arrayId)
      .get();

    return this._resultHandler(resultData);
  }

  private async _insertOrSelect() {
    if (!this.$state.get("WHERE").length) {
      throw new Error("Can't create or select without where condition");
    }

    let sql: string = [
      `${this.$constants("SELECT")}`,
      `${this.$constants("EXISTS")}(${this.$constants("SELECT")}`,
      `1`,
      `${this.$constants("FROM")}`,
      `${this.$state.get("TABLE_NAME")}`,
      `${this._queryBuilder().where()}`,
      `${this.$constants("LIMIT")} 1)`,
      `${this.$constants("AS")} 'exists'`,
    ].join(" ");

    let check: boolean = false;

    const [{ exists: result }] = await this._queryStatement(sql);

    check = !!parseInt(result);

    switch (check) {
      case false: {
        const [result, id] = await this._actionStatement({
          sql: this._queryBuilder().insert(),
          returnId: true,
        });

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(undefined);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        const data = await new Builder()
          .copyBuilder(this, { select: true })
          .where("id", id)
          .first();

        const resultData = data == null ? null : { ...data, $action: "insert" };

        return this._resultHandler(resultData);
      }
      case true: {
        const sql = new Builder()
          .copyBuilder(this, { select: true, where: true })
          .toString();

        const data = await this._queryStatement(sql);

        if (data?.length > 1) {
          for (const val of data) {
            val.$action = "select";
          }
          return this._resultHandler(data || []);
        }

        const resultData = { ...data[0], $action: "select" };

        return this._resultHandler(resultData);
      }
      default: {
        return this._resultHandler(null);
      }
    }
  }

  private async _updateOrInsert() {
    if (!this.$state.get("WHERE").length) {
      throw new Error("Can't update or insert without where condition");
    }

    let sql: string = [
      `${this.$constants("SELECT")}`,
      `${this.$constants("EXISTS")}(${this.$constants("SELECT")}`,
      `1`,
      `${this.$constants("FROM")}`,
      `${this.$state.get("TABLE_NAME")}`,
      `${this._queryBuilder().where()}`,
      `${this.$constants("LIMIT")} 1)`,
      `${this.$constants("AS")} 'exists'`,
    ].join(" ");

    let check: boolean = false;

    const [{ exists: result }] = await this._queryStatement(sql);

    check = !!parseInt(result);

    switch (check) {
      case false: {
        const [result, id] = await this._actionStatement({
          sql: this._queryBuilder().insert(),
          returnId: true,
        });

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(undefined);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        const data = await new Builder()
          .copyBuilder(this, { select: true })
          .where("id", id)
          .first();

        const resultData = data == null ? null : { ...data, $action: "insert" };

        return this._resultHandler(resultData);
      }
      case true: {
        const result = await this._actionStatement({
          sql: this._queryBuilder().update(),
        });

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(null);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        const data = await this._queryStatement(
          new Builder()
            .copyBuilder(this, { select: true, where: true })
            .toString()
        );

        if (data?.length > 1) {
          for (const val of data) {
            val.$action = "update";
          }
          return this._resultHandler(data || []);
        }

        const resultData = { ...data[0], $action: "update" };

        return this._resultHandler(resultData);
      }
      default: {
        return this._resultHandler(null);
      }
    }
  }

  private async _update(ignoreWhere = false) {
    if (!this.$state.get("WHERE").length && !ignoreWhere)
      throw new Error("can't update without where condition");

    const result = await this._actionStatement({
      sql: this._queryBuilder().update(),
    });

    if (this.$state.get("VOID") || !result)
      return this._resultHandler(undefined);

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    const sql: string = this._queryBuilder().select();

    const data = await this._queryStatement(sql);

    if (data?.length > 1) return this._resultHandler(data || []);

    const res = data?.shift() || null;

    return this._resultHandler(res);
  }

  private _hiddenColumn(data: Array<{ [x: string]: Object }>) {
    const hidden: string[] = this.$state.get("HIDDEN");
    if (Object.keys(data)?.length) {
      hidden.forEach((column: string | number) => {
        data.forEach((objColumn: Record<string, any>) => {
          delete objColumn[column];
        });
      });
    }
    return data;
  }

  private _queryUpdate(data: Record<string, any>) {
    this.$utils.covertDateToDateString(data);

    const values = Object.entries(data).map(([column, value]) => {
      if (
        typeof value === "string" &&
        !value.includes(this.$constants("RAW"))
      ) {
        value = this.$utils.escapeActions(value);
      }
      return `${this.bindColumn(column)} = ${
        value == null || value === this.$constants("NULL")
          ? this.$constants("NULL")
          : this._checkValueHasRaw(value)
      }`;
    });

    return `${this.$constants("SET")} ${values}`;
  }

  private _queryInsert(data: Record<string, any>) {
    data = this.$utils.covertDateToDateString(data);

    const columns: string[] = Object.keys(data).map((column: string) =>
      this.bindColumn(column)
    );

    const values = Object.values(data).map((value: any) => {
      if (
        typeof value === "string" &&
        !value.includes(this.$constants("RAW"))
      ) {
        value = this.$utils.escapeActions(value);
      }
      return `${
        value == null || value === this.$constants("NULL")
          ? this.$constants("NULL")
          : this._checkValueHasRaw(value)
      }`;
    });

    return [`(${columns})`, `${this.$constants("VALUES")}`, `(${values})`].join(
      " "
    );
  }

  private _queryInsertMultiple(data: any[]) {
    let values: string[] = [];

    for (let objects of data) {
      this.$utils.covertDateToDateString(objects);

      const vals = Object.values(objects).map((value) => {
        if (
          typeof value === "string" &&
          !value.includes(this.$constants("RAW"))
        ) {
          value = this.$utils.escapeActions(value);
        }
        return `${
          value == null || value === this.$constants("NULL")
            ? this.$constants("NULL")
            : this._checkValueHasRaw(value)
        }`;
      });
      values.push(`(${vals.join(",")})`);
    }

    const columns: string[] = Object.keys([...data]?.shift()).map(
      (column: string) => this.bindColumn(column)
    );

    return [
      `(${columns})`,
      `${this.$constants("VALUES")}`,
      `${values.join(",")}`,
    ].join(" ");
  }

  protected _valueAndOperator(
    value: string,
    operator: string,
    useDefault = false
  ): any[] {
    if (useDefault) return [operator, "="];

    if (operator == null) {
      return [[], "="];
    }

    if (operator.toUpperCase() === this.$constants("LIKE")) {
      operator = operator.toUpperCase();
    }

    return [value, operator];
  }

  private _handleJoin(
    type:
      | "INNER_JOIN"
      | "LEFT_JOIN"
      | "RIGHT_JOIN"
      | "CROSS_JOIN" = "INNER_JOIN",
    localKey: `${string}.${string}` | ((join: Join) => Join),
    referenceKey?: `${string}.${string}`
  ): this {
    if (typeof localKey === "function") {
      const callback = localKey(new Join(this, type));

      this.$state.set("JOIN", [
        ...this.$state.get("JOIN"),
        callback["toString"](),
      ]);

      return this;
    }

    let table = referenceKey?.split(".")?.shift();

    const aliasRef = /\|/.test(String(table));

    if (aliasRef) {
      const tableRef = table?.split("|")?.shift();

      table = `\`${tableRef}\` ${this.$constants("AS")} \`${table
        ?.split("|")
        ?.pop()}\``;

      referenceKey = String(
        referenceKey?.split("|")?.pop() ?? referenceKey
      ) as `${string}.${string}`;
    }

    const alias = /\|/.test(String(localKey));

    if (alias) {
      localKey = String(
        localKey?.split("|")?.pop() ?? localKey
      ) as `${string}.${string}`;
    }

    this.$state.set("JOIN", [
      ...this.$state.get("JOIN"),
      [
        `${this.$constants(type)}`,
        aliasRef ? `${table}` : table?.includes('`') ? `${table}`: `\`${table}\``,
        `${this.$constants("ON")}`,
        `${this.bindColumn(localKey)} = ${this.bindColumn(
          String(referenceKey)
        )}`,
      ].join(" "),
    ]);

    return this;
  }

  private _initialConnection() {
    this.$utils = utils;

    this.$pool = (() => {
      let pool = Pool;

      return {
        query: async (sql: string) => await pool.query(sql),
        get: () => pool,
        set: (newConnection: TConnection) => {
          pool = newConnection;
          return;
        },
      };
    })();

    this.$state = new StateHandler("default");

    this.$logger = (() => {
      let logger: any[] = [];
      return {
        get: (): any[] => logger,
        set: (data: string): void => {
          logger = [...logger, data];
          return;
        },
        reset: () => {
          logger = [];
          return;
        },
        check: (data: string): boolean => logger.indexOf(data) != -1,
      };
    })();

    this.$constants = (name) => {
      if (name == null) return CONSTANTS;

      if (!CONSTANTS.hasOwnProperty(name))
        throw new Error(`Not found that constant : '${name}'`);

      return CONSTANTS[name];
    };
  }
}

export { Builder };
export default Builder;
