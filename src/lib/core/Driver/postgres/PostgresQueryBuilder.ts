import { QueryBuilder } from "..";
import { Blueprint } from "../../Blueprint";
import { StateHandler } from "../../Handlers/State";

export class PostgresQueryBuilder extends QueryBuilder {
  constructor(state: StateHandler) {
    super(state);
  }
  public select = () => {
    const combindSQL = [
      this.bindSelect(this.$state.get("SELECT")),
      this.bindFrom({
        from: this.$constants("FROM"),
        table: this.$state.get("TABLE_NAME"),
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
          IS_NULLABLE as "Null",
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
              ELSE ''
          END AS "Key",
          CASE
            WHEN 
              DATA_TYPE = 'character varying' AND CHARACTER_MAXIMUM_LENGTH IS NOT NULL
              THEN DATA_TYPE || '(' || CHARACTER_MAXIMUM_LENGTH || ')'
            ELSE DATA_TYPE
          END AS "Type",
          IS_NULLABLE as "Null",

          CASE
              WHEN COLUMN_DEFAULT LIKE 'nextval(%' THEN NULL
              WHEN COLUMN_DEFAULT = 'CURRENT_TIMESTAMP' THEN 'IS_CONST:CURRENT_TIMESTAMP'
              ELSE COLUMN_DEFAULT
          END AS "Default",

          
          '' As "Extra"
        `,
      `FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = '${table.replace(/\`/g, "")}'
          AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
        ORDER BY ORDINAL_POSITION
        `,
    ];

    return this.format(sql);
  }

  public getTables(database: string) {
    const sql = [
      `SELECT TABLE_NAME AS "Tables"
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'public'
        AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
        AND TABLE_TYPE = 'BASE TABLE'
      `,
    ];

    return this.format(sql);
  }

  public getTable({ database, table }: { database: string; table: string }) {
    const sql = [
      `SELECT TABLE_NAME AS "TABLES"
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = 'public'
        AND TABLE_CATALOG = '${database.replace(/\`/g, "")}'
        AND TABLE_TYPE = 'BASE TABLE'
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
        `CREATE SCHEMA IF NOT EXISTS \`${database.replace(/`/g, "")}\`;`,
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
          CCU.TABLE_NAME AS "RefTable",
          CCU.COLUMN_NAME AS "RefColumn",
          KCU.COLUMN_NAME AS "Column",
          TC.CONSTRAINT_NAME AS "Constraint"

        FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC

        JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU
          ON TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
          AND TC.TABLE_SCHEMA   = KCU.TABLE_SCHEMA

        JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS CCU
          ON CCU.CONSTRAINT_NAME = TC.CONSTRAINT_NAME
          AND CCU.TABLE_SCHEMA   = TC.TABLE_SCHEMA

        WHERE TC.CONSTRAINT_TYPE = 'FOREIGN KEY'
          AND TC.TABLE_CATALOG   = '${database.replace(/\`/g, "")}'
          AND TC.TABLE_NAME      = '${table}'
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
          WHERE POSITION_IN_UNIQUE_CONSTRAINT IS NOT NULL
          AND TABLE_CATALOG    = '${database.replace(/\`/g, "")}'
          AND TABLE_NAME       = '${table}'
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

   public getIndexes({
    database,
    table
  }: {
    database: string;
    table   : string;
  }) {
    const sql = [
      `
        SELECT *
        FROM PG_INDEXES
        WHERE SCHEMANAME = '${database.replace(/\`/g, "")}'
        AND TABLENAME = '${table.replace(/\`/g, "")}'
      `
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
    database = "public";

    const sql = [
      `
        SELECT EXISTS( 
          SELECT 1
          FROM PG_INDEXES
          WHERE SCHEMANAME = '${database.replace(/\`/g, "")}'
          AND TABLENAME = '${table.replace(/\`/g, "")}'
          AND INDEXNAME = '${index}'
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
    table,
    alias,
    rawAlias,
  }: {
    from: string;
    table: string;
    alias: string | null;
    rawAlias: string | null;
  }) {
    if (alias != null && alias !== "") {
      if (rawAlias != null && rawAlias !== "") {
        const raw = String(rawAlias)
          .replace(/^\(\s*|\s*\)$/g, "")
          .trim();
        const normalizedRawAlias =
          raw.startsWith("(") && raw.endsWith(")") ? raw.slice(1, -1) : raw;
        raw.startsWith("(") && raw.endsWith(")") ? raw.slice(1, -1) : raw;

        return `${from} (${normalizedRawAlias}) ${this.$constants(
          "AS"
        )} \`${alias}\``;
      }

      return `${from} ${table} ${this.$constants("AS")} \`${alias}\``;
    }

    return `${from} ${table}`;
  }

  protected bindLimit(limit: string | number) {
    if (limit === "" || limit == null) return "";

    return `${this.$constants("LIMIT")} ${limit}`;
  }

  protected bindOffset(offset: string) {
    return offset;
  }

  protected bindHaving(having: string) {
    return having;
  }

  protected bindRowLevelLock(mode: string) {
    return mode;
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
