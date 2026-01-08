import { QueryBuilder } from "..";
import { Blueprint }    from "../../Blueprint";
import { StateManager } from "../../StateManager";

export class MysqlQueryBuilder extends QueryBuilder {
  constructor(state: StateManager) {
    super(state);
  }
  public select = () => {
    const combindSQL = [
      this.bindSelect(this.$state.get("SELECT")),
      this.bindFrom({
        from: !this.$state.get("FROM").length
          ? [this.$state.get("TABLE_NAME")].map(String)
          : [this.$state.get("TABLE_NAME"), ...this.$state.get("FROM")].map(String),
        alias: this.$state.get("ALIAS"),
        rawAlias: this.$state.get("RAW_ALIAS"),
      }),
      this.bindJoin(this.$state.get("JOIN")),
      this.bindWhere(this.$state.get("WHERE")),
      this.bindGroupBy(this.$state.get("GROUP_BY")),
      this.bindHaving(this.$state.get("HAVING")),
      this.bindOrderBy(this.$state.get("ORDER_BY")),
      this.bindLimit(this.$state.get("LIMIT")),
      this.bindOffset(this.$state.get("OFFSET")),
      this.bindRowLevelLock(this.$state.get("ROW_LEVEL_LOCK")),
    ];

    let sql = this.format(combindSQL).trimEnd();

    if (this.$state.get("UNION").length) {
      sql = `(${sql}) ${this.$state
        .get("UNION")
        .map((union: string) => `${this.$constants("UNION")} (${union})`)
        .join(" ")}`;
    }

    if (this.$state.get("UNION_ALL").length) {
      sql = `(${sql}) ${this.$state
        .get("UNION_ALL")
        .map((union: string) => `${this.$constants("UNION_ALL")} (${union})`)
        .join(" ")}`;
    }

    if (this.$state.get("CTE").length) {
      sql = `${this.$constants("WITH")} ${this.$state
        .get("CTE")
        .join(", ")} ${sql}`;
    }

    return sql;
  };

  public insert() {
    const query = this.$state.get("INSERT");
    if (!query) return '';

    const table = this.$state.get("TABLE_NAME");
    const columns = `(${query.columns})`;
    
    const values = query.values.map(v => `(${v})`).join(', ');

    const sql = this.format([
      this.$constants("INSERT"),
      table,
      columns,
      this.$constants("VALUES"),
      values
    ]);

    return sql;
  }

  public update() {
    const query = this.$state.get("UPDATE")
    if(query == null) {
      return '';
    }

    const sql = this.format([
      `${this.$constants("UPDATE")}`,
      `${this.$state.get("TABLE_NAME")}`,
      `${this.$constants("SET")}`,
      `${query}`,
      this.bindWhere(this.$state.get("WHERE")),
      this.bindOrderBy(this.$state.get("ORDER_BY")),
      this.bindLimit(this.$state.get("LIMIT")),
    ]);
    
    return sql;
  }

  public remove() {
    const query = this.$state.get("DELETE");

    if(!query) {
      throw new Error("Bad query builder: DELETE state not found. Please check your query configuration.") 
    }

    let sql = this.format([
      this.$constants("DELETE"),
      this.$constants("FROM"),
      this.$state.get("TABLE_NAME"),
      this.bindWhere(this.$state.get("WHERE")),
      this.bindOrderBy(this.$state.get("ORDER_BY")),
      this.bindLimit(this.$state.get("LIMIT")),
    ]);


    if (this.$state.get("CTE").length) {
      sql = `${this.$constants("WITH")} ${this.$state
        .get("CTE")
        .join(", ")} ${sql}`;
    }

    return sql;
  }

  public any() {
    if (this.$state.get("INSERT")) return this.insert();
    if (this.$state.get("UPDATE")) return this.update();
    if (this.$state.get("DELETE")) return this.remove();
    return this.select();
  }

  public getColumns({ database, table }: { database: string; table: string }) {
    const sql = [
      `SELECT 
          COLUMN_NAME as "Field", 
          COLUMN_TYPE as "ColumnType",
          DATA_TYPE as "Type",
          IS_NULLABLE as "Nullable",
          COLUMN_DEFAULT as "Default"
        `,
      `FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME    = '${table.replace(/\`/g, "")}'
          AND TABLE_SCHEMA  = '${database}'
        ORDER BY ORDINAL_POSITION
        `,
    ];

    return this.format(sql);
  }

  public getSchema({ database, table }: { database: string; table: string }) {
    const sql = [
      `
        SELECT 
          COLUMN_NAME AS "Field", 
          CASE 
            WHEN COLUMN_KEY = '' THEN NULL 
            ELSE COLUMN_KEY
          END AS "Key",
          COALESCE(NULLIF(COLUMN_TYPE, ''), DATA_TYPE) AS "Type",
          IS_NULLABLE AS "Nullable",
          CASE 
            WHEN COLUMN_DEFAULT = 'CURRENT_TIMESTAMP' THEN 'IS_CONST:CURRENT_TIMESTAMP' 
            ELSE COLUMN_DEFAULT 
          END AS "Default",
          CASE 
            WHEN EXTRA = 'DEFAULT_GENERATED' OR EXTRA = '' THEN NULL 
            ELSE EXTRA 
          END AS "Extra",
          CASE WHEN DATA_TYPE = 'enum' 
            THEN REPLACE(SUBSTRING(COLUMN_TYPE, 6, LENGTH(COLUMN_TYPE)-6), '''', '') 
              WHEN COLUMN_TYPE LIKE '%(%)%' 
                THEN SUBSTRING_INDEX(SUBSTRING_INDEX(COLUMN_TYPE, '(', -1), ')', 1) 
            ELSE NULL 
          END AS "TypeValue"
        FROM 
          INFORMATION_SCHEMA.COLUMNS
        WHERE 
          TABLE_NAME    = '${table.replace(/\`/g, "")}'
          AND TABLE_SCHEMA  = '${database}'
        ORDER BY 
          ORDINAL_POSITION
        `,
    ];

    return this.format(sql);
  }

  public getTables(database: string) {
    const sql = [
      `
        SELECT 
          TABLE_NAME AS "Tables"
        FROM 
          INFORMATION_SCHEMA.TABLES
        WHERE 
          TABLE_SCHEMA   = '${database.replace(/\`/g, "")}'
          AND TABLE_TYPE = 'BASE TABLE'
      `,
    ];

    return this.format(sql);
  }

  public getTable({ database, table }: { database: string; table: string }) {
    const sql = [
      `
        SELECT 
          TABLE_NAME AS "Table"
        FROM 
          INFORMATION_SCHEMA.TABLES
        WHERE 
          TABLE_SCHEMA   = '${database.replace(/\`/g, "")}' 
          AND TABLE_NAME = '${table.replace(/\`/g, "")}'
          AND TABLE_TYPE = 'BASE TABLE'
      `,
    ];

    return this.format(sql);
  }

  public createTable({
    database,
    table,
    schema,
  }: {
    database: string;
    table: string;
    schema: Record<string, Blueprint> | string[];
  }) {
    let columns: Array<any> = [];

    if (Array.isArray(schema)) {
      const sql = [
        `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
        `\`${database.replace(/`/g, "")}\`.\`${table.replace(/`/g, "")}\``,
        `(${schema.join(", ")})`,
        `${this.$constants("ENGINE")}`,
      ];

      return this.format(sql);
    }

    const detectSchema = (schema: Blueprint<any>) => {
      try {
        return {
          type: schema?.type ?? schema["_type"] ?? null,
          attributes: schema?.attributes ?? schema["_attributes"] ?? null,
        };
      } catch (e) {
        return {
          type: null,
          attributes: null,
        };
      }
    };

    for (const key in schema) {
      const data = schema[key];

      const { type, attributes } = detectSchema(data);

      if (type == null || attributes == null) continue;

      columns = [...columns, `\`${key}\` ${type} ${attributes.join(" ")}`];
    }

    const sql = [
      `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
      `\`${table.replace(/`/g, "")}\` (${columns.join(", ")})`,
      `${this.$constants("ENGINE")}`,
    ];

    return this.format(sql);
  }

  public addColumn({
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
  }) {
    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("ADD"),
      `\`${column}\` ${type} ${
        attributes != null && attributes.length ? `${attributes.join(" ")}` : ""
      }`,
      this.$constants("AFTER"),
      `\`${after}\``,
    ];

    return this.format(sql);
  }

  public changeColumn({
    table,
    column,
    type,
    attributes,
  }: {
    table: string;
    column: string;
    type: string;
    attributes: string[];
  }) {
    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table.replace(/`/g, "")}\``,
      this.$constants("CHANGE"),
      `\`${column}\``,
      `\`${column}\` ${type} ${
        attributes != null && attributes.length
          ? `${attributes
              .filter((v: string) => !["PRIMARY KEY"].includes(v))
              .join(" ")}`
          : ""
      }`,
    ];

    return this.format(sql);
  }

  public getChildFKs({ database, table }: { database: string; table: string }) {
    const sql = [
      `
      SELECT 
        CONSTRAINT_NAME        AS "Constraint",
        TABLE_NAME             AS "ChildTable",
        COLUMN_NAME            AS "ChildColumn",
        REFERENCED_TABLE_NAME  AS "ParentTable",
        REFERENCED_COLUMN_NAME AS "ParentColumn"
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE 
        REFERENCED_TABLE_NAME = '${table.replace(/`/g, "")}'
        AND TABLE_SCHEMA = '${database.replace(/`/g, "")}'
        `,
    ];

    return this.format(sql);
  }

  public getFKs({ database, table }: { database: string; table: string }) {
    const sql = [
      `
        SELECT 
          REFERENCED_TABLE_NAME   AS "RefTable",
          REFERENCED_COLUMN_NAME  AS "RefColumn",
          COLUMN_NAME             AS "Column",
          CONSTRAINT_NAME         As "Constraint"
        FROM 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE 
          REFERENCED_TABLE_NAME IS NOT NULL
          AND TABLE_SCHEMA  = '${database.replace(/`/g, "")}'
          AND TABLE_NAME    = '${table.replace(/`/g, "")}'
        `,
    ];

    return this.format(sql);
  }

  public hasFK({
    database,
    table,
    constraint,
  }: {
    database: string;
    table: string;
    constraint: string;
  }) {
    const sql = [
      `
        SELECT EXISTS( 
          SELECT 1
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE REFERENCED_TABLE_NAME IS NOT NULL
          AND TABLE_SCHEMA    = '${database.replace(/`/g, "")}'
          AND TABLE_NAME      = '${table.replace(/`/g, "")}'
          AND CONSTRAINT_NAME = '${constraint}'
        ) AS "IS_EXISTS"
        `,
    ];

    return this.format(sql);
  }

  public createFK({
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
  }) {
    const sql = [
      `${this.$constants("ALTER_TABLE")}`,
      `\`${table}\``,
      `${this.$constants("ADD_CONSTRAINT")}`,
      `\`${constraint}\``,
      `${this.$constants("FOREIGN_KEY")}(\`${key}\`)`,
      `${this.$constants("REFERENCES")} \`${tableRef}\`(\`${
        foreign.references
      }\`)`,
      `${this.$constants("ON_DELETE")} ${foreign.onDelete}`,
      `${this.$constants("ON_UPDATE")} ${foreign.onUpdate}`,
    ].join(" ");

    return this.format(sql);
  }

  public dropFK({
    table,
    constraint,
  }: {
    table: string;
    constraint: string;
  }) {
    const sql = [
      `${this.$constants("ALTER_TABLE")}`,
      `\`${table}\``,
      `DROP FOREIGN KEY`,
      `\`${constraint}\``,
    ].join(" ");

    return this.format(sql);
  }

  public getIndexes({ database, table }: { database: string; table: string }) {
    const sql = [
      `
      SELECT 
        s.COLUMN_NAME AS "Column",
        s.INDEX_NAME  AS "IndexName",
        s.INDEX_TYPE  AS "IndexType",
        CASE WHEN s.NULLABLE = 'YES' THEN 'YES' ELSE 'NO' END AS "Nullable",
        CASE WHEN s.NON_UNIQUE = 0 THEN 'YES' ELSE 'NO' END AS "Unique"
      FROM 
        INFORMATION_SCHEMA.STATISTICS s
      LEFT JOIN 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
          ON s.TABLE_SCHEMA = k.TABLE_SCHEMA
          AND s.TABLE_NAME = k.TABLE_NAME
          AND s.COLUMN_NAME = k.COLUMN_NAME
          AND k.REFERENCED_TABLE_NAME IS NOT NULL
      WHERE 
        k.REFERENCED_TABLE_NAME IS NULL
        AND s.TABLE_SCHEMA   = '${database.replace(/`/g, "")}'
        AND s.TABLE_NAME = '${table.replace(/`/g, "")}'
      `,
    ];

    return this.format(sql);
  }

  public hasIndex({
    database,
    table,
    index,
  }: {
    database: string;
    table: string;
    index: string;
  }) {
    const sql = [
      `
        SELECT EXISTS(
          SELECT 
            1
          FROM 
            INFORMATION_SCHEMA.STATISTICS s
          LEFT JOIN 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE k
              ON s.TABLE_SCHEMA = k.TABLE_SCHEMA
              AND s.TABLE_NAME = k.TABLE_NAME
              AND s.COLUMN_NAME = k.COLUMN_NAME
              AND k.REFERENCED_TABLE_NAME IS NOT NULL
          WHERE 
            k.REFERENCED_TABLE_NAME IS NULL
            AND s.TABLE_SCHEMA = '${database.replace(/`/g, "")}'
            AND s.TABLE_NAME   = '${table.replace(/`/g, "")}'
            AND s.INDEX_NAME   = '${index}'
        ) AS "IS_EXISTS"
      `,
    ];

    return this.format(sql);
  }

  public createIndex({
    table,
    index,
    key,
  }: {
    table: string;
    index: string;
    key: string;
  }) {
    const sql = [
      `${this.$constants("CREATE_INDEX")}`,
      `\`${index}\``,
      `${this.$constants("ON")}`,
      `${table}(\`${key}\`)`,
    ];

    return this.format(sql);
  }

  public getDatabase(database: string): string {
    const sql: string = [
      `${this.$constants("SHOW_DATABASES")}`,
      `${this.$constants("LIKE")}`,
      `'${database.replace(/`/g, "")}'`,
    ].join(" ");

    return this.format(sql);
  }

  public dropDatabase(database: string): string {
    const sql: string = [
      `${this.$constants("DROP_DATABASE")}`, 
      `\`${database.replace(/`/g, "")}\``
    ].join(" ")

    return this.format(sql);
  }

  public dropView(view: string): string {
    const sql: string = [
      `${this.$constants("DROP_VIEW")}`, 
      `\`${view.replace(/`/g,"")}\``
    ].join(" ")

    return this.format(sql);
  }

  public dropTable(table: string): string {
    const sql: string = [
      `${this.$constants("DROP_TABLE")}`,
      `\`${table.replace(/`/g, "")}\``
    ].join(" ")

    return this.format(sql);
  }

  public truncate(table: string): string {
    const sql: string = [
      `${this.$constants("TRUNCATE_TABLE")}`,
      `\`${table.replace(/`/g, "")}\``
    ].join(" ")
    
    return this.format(sql);
  }

  public sleep(second: number): string {
    return `SLEEP(${second})`;
  }

  public format(sql: (string | null)[] | string) {
    if (typeof sql === "string") sql = [sql];

    return sql
      .filter((s) => s !== "" || s == null)
      .join(" ")
      .replace(/\s+/g, " ");
  }

  protected bindJoin(values: string[]) {
    if (!Array.isArray(values) || !values.length) return null;

    return values.join(" ");
  }

  protected bindWhere(values: string[]) {
    if (!Array.isArray(values) || !values.length) return null;

    return `${this.$constants("WHERE")} ${values
      .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
      .join(" ")}`;
  }

  protected bindOrderBy(values: string[]) {
    if (!Array.isArray(values) || !values.length) return null;

    return `${this.$constants("ORDER_BY")} ${values
      .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
      .join(", ")}`;
  }

  protected bindGroupBy(values: string[]) {
    if (!Array.isArray(values) || !values.length) return null;

    return `${this.$constants("GROUP_BY")} ${values
      .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
      .join(", ")}`;
  }

  protected bindSelect(
    values: string[],
    { distinct }: { distinct?: string } = {}
  ) {
    if (!values.length) {
      if (!distinct) return `${this.$constants("SELECT")} *`;

      return `${this.$constants("SELECT")} ${this.$constants("DISTINCT")} *`;
    }

    const findIndex = values.indexOf("*");

    if (findIndex > -1) {
      const removed = values.splice(findIndex, 1);
      values.unshift(removed[0]);
    }

    return `${this.$constants("SELECT")} ${values.join(", ")}`;
  }

  protected bindFrom({
    from,
    alias,
    rawAlias,
  }: {
    from: string[];
    alias: string | null;
    rawAlias: string | null;
  }) {
    if (!from.length || from.every((f) => f == null || f === "")) {
      return "";
    }

    if (alias != null && alias !== "") {
      if (rawAlias != null && rawAlias !== "") {
        const raw = String(rawAlias)
          .replace(/^\(\s*|\s*\)$/g, "")
          .trim();
        const normalizedRawAlias =
          raw.startsWith("(") && raw.endsWith(")") ? raw.slice(1, -1) : raw;
        raw.startsWith("(") && raw.endsWith(")") ? raw.slice(1, -1) : raw;

        return `${this.$constants(
          "FROM"
        )} (${normalizedRawAlias}) ${this.$constants("AS")} \`${alias}\``;
      }

      return `${this.$constants("FROM")} ${from.join(", ")} ${this.$constants(
        "AS"
      )} \`${alias}\``;
    }

    return `${this.$constants("FROM")} ${from.join(", ")}`;
  }

  protected bindLimit(limit: string | number | null) {
    if (limit === "" || limit == null) return "";

    return `${this.$constants("LIMIT")} ${limit}`;
  }

  protected bindOffset(offset: string | number | null) {
    if (offset === "" || offset == null) return "";

    return `${this.$constants("OFFSET")} ${offset}`;
  }

  protected bindHaving(having: string | null) {
    if(having == null || having === '') return "";
    
    return `${this.$constants("HAVING")} ${having}`;
  }

  protected bindRowLevelLock(mode: "FOR_UPDATE" | "FOR_SHARE" | null) {
    if(mode == null) return '';

    const modeLock = mode === "FOR_UPDATE"
    ? this.$constants("ROW_LEVEL_LOCK").update
    : this.$constants("ROW_LEVEL_LOCK").share

    return modeLock;
  }
}
