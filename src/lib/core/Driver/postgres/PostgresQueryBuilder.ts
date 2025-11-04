import { QueryBuilder } from "..";
import { Blueprint }    from "../../Blueprint";
import { StateManager } from "../../StateManager";

export class PostgresQueryBuilder extends QueryBuilder {
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
    const sql = this.format([this.$state.get("INSERT"), "RETURNING *"]);
    return sql;
  }

  public update() {
    const sql = this.format([
      this.$state.get("UPDATE"),
      this.bindWhere(this.$state.get("WHERE")),
      this.bindOrderBy(this.$state.get("ORDER_BY")),
      "RETURNING *",
    ]);
    return sql;
  }

  public remove() {
    const sql = this.format([
      this.$state.get("DELETE"),
      this.bindWhere(this.$state.get("WHERE")),
      this.bindOrderBy(this.$state.get("ORDER_BY")),
      "RETURNING *",
    ]);
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
          CASE 
            WHEN CHARACTER_MAXIMUM_LENGTH IS NOT NULL THEN 
              DATA_TYPE || '(' || CHARACTER_MAXIMUM_LENGTH || ')'
            WHEN NUMERIC_PRECISION IS NOT NULL THEN 
              DATA_TYPE || '(' || NUMERIC_PRECISION || COALESCE(',' || NUMERIC_SCALE, '') || ')'
            ELSE DATA_TYPE
          END AS "ColumnType",
          DATA_TYPE as "Type",
          IS_NULLABLE as "Nullable",
          COLUMN_DEFAULT as "Default"
        `,
      `FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_NAME  = '${table.replace(/\`/g, "")}'
          AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
        ORDER BY ORDINAL_POSITION
        `,
    ];

    return this.format(sql);
  }

  public getSchema({ database, table }: { database: string; table: string }) {
    const sql = [
      `SELECT 
        COLUMN_NAME as "Field", 
        CASE
            WHEN column_default LIKE 'nextval(%' THEN 'PRI'
            ELSE NULL
        END AS "Key",
        CASE
          WHEN 
            DATA_TYPE = 'character varying' AND CHARACTER_MAXIMUM_LENGTH IS NOT NULL
            THEN DATA_TYPE || '(' || CHARACTER_MAXIMUM_LENGTH || ')'
          ELSE DATA_TYPE
        END AS "Type",
        IS_NULLABLE as "Nullable",

        CASE
          WHEN COLUMN_DEFAULT LIKE 'nextval(%' THEN NULL
          WHEN COLUMN_DEFAULT = 'CURRENT_TIMESTAMP' THEN 'IS_CONST:CURRENT_TIMESTAMP'
          ELSE COLUMN_DEFAULT
        END AS "Default",

        CASE
          WHEN COLUMN_DEFAULT LIKE 'nextval(%' THEN 'AUTO_INCREMENT'
          ELSE NULL
        END AS "Extra"
      FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${table.replace(/\`/g, "")}'
          AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
        ORDER BY ORDINAL_POSITION
        `,
    ];

    return this.format(sql);
  }

  public getTables(database: string) {
    const sql = [
      `
      SELECT 
        TABLE_NAME AS "Tables"
      FROM INFORMATION_SCHEMA.TABLES
      WHERE 
        TABLE_SCHEMA NOT IN ('PG_CATALOG','INFORMATION_SCHEMA')
        AND TABLE_TYPE = 'BASE TABLE'
        AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
      `,
    ];

    return this.format(sql);
  }

  public getTable({ database, table }: { database: string; table: string }) {
    const sql = [
      `
      SELECT 
        TABLE_NAME AS "TABLES"
      FROM INFORMATION_SCHEMA.TABLES
      WHERE 
        TABLE_SCHEMA NOT IN ('PG_CATALOG','INFORMATION_SCHEMA')
        AND TABLE_TYPE = 'BASE TABLE'
        AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
        AND TABLE_NAME LIKE '${table.replace(/\`/g, "")}'
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

      const { formatedAttributes, formatedType } =
        this._formatedTypeAndAttributes({
          type,
          attributes,
          key,
        });

      columns = [
        ...columns,
        `\`${key}\` ${formatedType} ${formatedAttributes.join(" ")}`,
      ];
    }

    const sql = [
      `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
      `${table} (${columns.join(", ")})`,
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
    const { formatedAttributes, formatedType } =
      this._formatedTypeAndAttributes({
        type,
        attributes,
        key: column,
      });

    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("ADD"),
      "COLUMN",
      `\`${column}\` ${formatedType} ${
        formatedAttributes != null && formatedAttributes.length
          ? `${formatedAttributes.join(" ")}`
          : ""
      }`,
      `${after ? "" : ""}`,
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
    const { formatedAttributes, formatedType } =
      this._formatedTypeAndAttributes({
        type,
        attributes,
        key: column,
      });

    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("ALTER_COLUMN"),
      `\`${column}\``,
      `TYPE ${formatedType}`,
    ];

    const sqlAttr = [];

    for (const formatedAttribute of formatedAttributes) {
      if (
        formatedAttribute.startsWith("PRIMARY KEY") ||
        formatedAttribute.startsWith("NULL")
      ) {
        continue;
      }

      sqlAttr.push(
        [
          this.$constants("ALTER_TABLE"),
          `\`${table}\``,
          this.$constants("ALTER_COLUMN"),
          `\`${column}\``,
          `SET ${formatedAttribute}`,
        ].join(" ")
      );
    }

    if (!sqlAttr.length) {
      return this.format(sql);
    }

    return [this.format(sql), this.format(sqlAttr)].join("; ");
  }

  public getFKs({ database, table }: { database: string; table: string }) {
    const sql = [
      `
        SELECT
          ccu.TABLE_NAME AS "RefTable",
          ccu.COLUMN_NAME AS "RefColumn",
          kcu.COLUMN_NAME AS "Column",
          tc.CONSTRAINT_NAME AS "Constraint"
        FROM 
          INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS tc
        JOIN 
          INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS kcu
          ON tc.CONSTRAINT_NAME  = kcu.CONSTRAINT_NAME
          AND tc.TABLE_SCHEMA    = kcu.TABLE_SCHEMA
        JOIN 
          INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS ccu
          ON ccu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
          AND ccu.TABLE_SCHEMA   = tc.TABLE_SCHEMA
        WHERE 
          tc.CONSTRAINT_TYPE     = 'FOREIGN KEY'
          AND tc.TABLE_CATALOG   = '${database.replace(/\`/g, "")}'
          AND tc.TABLE_NAME      = '${table.replace(/\`/g, "")}'
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
          SELECT 
            1
          FROM 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE 
            POSITION_IN_UNIQUE_CONSTRAINT IS NOT NULL
            AND TABLE_CATALOG    = '${database.replace(/\`/g, "")}'
            AND TABLE_NAME       = '${table.replace(/\`/g, "")}'
            AND CONSTRAINT_NAME  = '${constraint}'
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

  public getIndexes({ database, table }: { database: string; table: string }) {
    const sql = [
      `
      SELECT
        DISTINCT ON (a.ATTNAME, i.RELNAME)
        a.ATTNAME AS "Column",
        i.RELNAME AS "IndexName",
        UPPER(am.AMNAME) AS "IndexType",
        CASE WHEN a.ATTNOTNULL = false THEN 'YES' ELSE 'NO' END AS "Nullable",
        CASE WHEN ix.INDISUNIQUE = true THEN 'YES' ELSE 'NO' END AS "Unique"
      FROM 
        INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      JOIN 
        PG_CLASS t ON t.RELNAME = kcu.TABLE_NAME
      JOIN
        PG_NAMESPACE n ON t.RELNAMESPACE = n.OID
      JOIN
        PG_INDEX ix ON t.OID = ix.INDRELID
      JOIN
        PG_CLASS i ON i.OID = ix.INDEXRELID
      JOIN
        PG_AM am ON i.RELAM = am.OID
      JOIN
        LATERAL (
          SELECT
            UNNEST(ix.INDKEY) AS ATTR_NUM,
            GENERATE_SERIES(1, ARRAY_LENGTH(ix.INDKEY, 1)) AS NUMBER
        ) AS seq ON TRUE
      JOIN
        PG_ATTRIBUTE a ON a.ATTRELID = t.OID AND a.ATTNUM = seq.ATTR_NUM
      WHERE 
        t.RELKIND              = 'r'
        AND kcu.TABLE_CATALOG  = '${database.replace(/\`/g, "")}'
        AND t.RELNAME          = '${table.replace(/\`/g, "")}'
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
          SELECT 1
          FROM 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
          JOIN 
            PG_CLASS t ON t.RELNAME = kcu.TABLE_NAME
          JOIN
            PG_NAMESPACE n ON t.RELNAMESPACE = n.OID
          JOIN
            PG_INDEX ix ON t.OID = ix.INDRELID
          JOIN
            PG_CLASS i ON i.OID = ix.INDEXRELID
          WHERE 
            t.RELKIND             = 'r'
            AND kcu.TABLE_CATALOG = '${database.replace(/\`/g, "")}'
            AND t.RELNAME         = '${table.replace(/\`/g, "")}'
            AND i.RELNAME         = '${index}'
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
      `\`${index.replace(/`/g, "")}\``,
      `${this.$constants("ON")}`,
      `${table}(\`${key.replace(/`/g, "")}\`)`,
    ];

    return this.format(sql);
  }

  public getDatabase(database: string): string {
    const sql: string = [
      `SELECT 
        DATNAME AS Database
      FROM PG_DATABASE
      WHERE DATNAME = '${database.replace(/`/g, "")}'`,
    ].join(" ");

    return this.format(sql);
  }
  public dropDatabase(database: string): string {
    const sql: string = `${this.$constants(
      "DROP_DATABASE"
    )} "${database.replace(/`/g, "")}"`;

    return this.format(sql);
  }
  public dropView(view: string): string {
    const sql: string = `${this.$constants("DROP_VIEW")} "${view.replace(
      /`/g,
      ""
    )}"`;

    return this.format(sql);
  }
  public dropTable(table: string): string {
    const sql: string = `${this.$constants("DROP_TABLE")} "${table.replace(
      /`/g,
      ""
    )}"`;

    return this.format(sql);
  }

  public sleep(second: number): string {
    return `PG_SLEEP(${second})`;
  }

  public format(sql: (string | null)[] | string) {
    if (typeof sql === "string") sql = [sql];

    const formated = sql
      .filter((s) => s !== "" || s == null)
      .join(" ")
      .replace(/\s+/g, " ");

    const replaceBackticksWithDoubleQuotes = (sqlString: string) => {
      const updateRegex = /^UPDATE\b/i;
      const insertRegex = /^INSERT\b/i;
      const deleteRegex = /^DELETE\b/i;
      const truncateRegex = /^TRUNCATE\b/i;

      if (
        insertRegex.test(sqlString) ||
        updateRegex.test(sqlString) ||
        deleteRegex.test(sqlString) ||
        truncateRegex.test(sqlString)
      ) {
        return sqlString
          .replace(/`[\w_]+`\.`([\w_]+)`/g, "`$1`")
          .replace(/`([^`]+)`/g, '"$1"');
      }

      return sqlString.replace(/`([^`]+)`/g, '"$1"');
    };
    return replaceBackticksWithDoubleQuotes(formated);
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

  private _formatedTypeAndAttributes({
    type,
    attributes,
    key,
  }: {
    type: string;
    attributes: string[];
    key: string;
  }) {
    let formatedType = type;
    let formatedAttributes = attributes;

    if (type.startsWith("INT") && attributes.some((v) => v === "PRIMARY KEY")) {
      formatedType = "SERIAL";
      formatedAttributes = attributes.filter((attr) => {
        return !attr.startsWith("AUTO_INCREMENT");
      });
    }

    if (type.startsWith("TINYINT")) {
      formatedType = "SMALLINT";
    }

    if (type.startsWith("LONGTEXT")) {
      formatedType = "TEXT";
    }

    if (type.startsWith("ENUM")) {
      const enums = type.replace("ENUM", "");

      const totalLength = enums
        .slice(1, -1)
        .split(",")
        .map((s) => s.replace(/'/g, ""))
        .reduce((sum, item) => sum + item.length, 0);

      formatedType = `VARCHAR(${totalLength}) CHECK (${key} IN ${enums})`;
    }

    if (type.startsWith("BOOLEAN")) {
      formatedAttributes = attributes.map((attr) => {
        if (attr.startsWith("DEFAULT")) {
          return attr.replace(/\b0\b/, "false").replace(/\b1\b/, "true");
        }

        return attr;
      });
    }

    return {
      formatedType,
      formatedAttributes,
    };
  }
}
