import { QueryBuilder } from "..";
import { Blueprint }    from "../../Blueprint";
import { StateManager } from "../../StateManager";
import { 
  type TStateWhereCondition 
} from "../../../types";

export class SqliteQueryBuilder extends QueryBuilder {
  constructor(state: StateManager) {
    super(state);
  }
  public select = () => {
    const combindSQL = [
      this.bindSelect(this.$state.get("SELECT")),
      this.bindFrom({
        from: !this.$state.get("FROM").length
          ? [this.$state.get("TABLE_NAME")].filter(Boolean).map(String)
          : [this.$state.get("TABLE_NAME"), ...this.$state.get("FROM")].filter(Boolean).map(String),
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
    const sql = [`
      SELECT
        ti.name AS "Field",
        ti.type AS "ColumnType",
        LOWER(ti.type) AS "Type",
        CASE WHEN ti."notnull" = 0 THEN 'YES' ELSE 'NO' END AS "Nullable",
        ti.dflt_value AS "Default"
      FROM sqlite_master AS m
      JOIN pragma_table_info(m.name) AS ti
      WHERE m.type = 'table'
        AND m.name = '${table.replace(/["`]/g, "")}'
      ORDER BY ti.cid
    `];

    return this.format(sql);
  }

  public getSchema({ database, table }: { database: string; table: string }) {
    const sql = [`
      SELECT
        ti.name AS "Field",

        CASE 
          WHEN ti.pk = 1 THEN 'PRI'
          WHEN il."unique" = 1 THEN 'UNI'
          ELSE NULL
        END AS "Key",

        ti.type AS "Type",

        CASE 
          WHEN ti."notnull" = 0 THEN 'YES'
          ELSE 'NO'
        END AS "Nullable",

        CASE 
          WHEN ti.dflt_value = 'CURRENT_TIMESTAMP' THEN 'IS_CONST:CURRENT_TIMESTAMP'
          ELSE ti.dflt_value
        END AS "Default",

        NULL AS "Extra",

        CASE 
          WHEN ti.type LIKE '%(%' 
            THEN substr(ti.type, instr(ti.type, '(') + 1, instr(ti.type, ')') - instr(ti.type, '(') - 1)
          ELSE NULL
        END AS "TypeValue"

      FROM sqlite_master AS m
      JOIN pragma_table_info(m.name) AS ti

      LEFT JOIN pragma_index_list(m.name) AS il
        ON il."unique" = 1

      LEFT JOIN pragma_index_info(il.name) AS ii
        ON ii.name = ti.name

      WHERE m.type = 'table'
        AND m.name = '${table.replace(/["`]/g, "")}'

      GROUP BY ti.cid

      ORDER BY ti.cid
    `];

    return this.format(sql);
  }

  public getTables(database: string) {
    const sql = [
      `SELECT name AS table_name
      FROM sqlite_master
      WHERE type = 'table'`,
    ];

    return this.format(sql);
  }

  public hasTable({ database, table }: { database: string; table: string }) {
    
    const sql = [`
      SELECT EXISTS(
        SELECT 1
        FROM sqlite_master
        WHERE type = 'table'
          AND name = '${table.replace(/["`]/g, "")}'
      ) AS "IS_EXISTS"
    `];

    return this.format(sql);
  }

  public createDatabase(database: string) {
    throw new Error("Method not implemented.");
    return '';
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
        `(${schema.join(", ")})`
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
      `\`${table.replace(/`/g, "")}\` (${columns.join(", ")})`,
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
    const sql = [`
      SELECT
        'fk_' || m.name || '_' || f."from" AS "Constraint",
        m.name AS "ChildTable",
        f."from" AS "ChildColumn",
        f."table" AS "ParentTable",
        f."to" AS "ParentColumn"
      FROM sqlite_master AS m
      JOIN pragma_foreign_key_list(m.name) AS f
      WHERE m.type = 'table'
        AND m.name NOT LIKE 'sqlite_%'
        AND f."table" = '${table.replace(/"/g, "")}'
    `];

    return this.format(sql);
  }

  public getFKs({ database, table }: { database: string; table: string }) {
    const sql = [`
      SELECT
        f."table"  AS "RefTable",
        f."to"     AS "RefColumn",
        f."from"   AS "Column",
        'fk_' || m.name || '_' || f."from" AS "Constraint"
      FROM sqlite_master AS m
      JOIN pragma_foreign_key_list(m.name) AS f
      WHERE m.type = 'table'
        AND m.name = '${table.replace(/["`]/g, "")}'
        AND f."table" IS NOT NULL
    `];

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
    
    const sql = [`
      SELECT EXISTS(
        SELECT 1
        FROM sqlite_master AS m
        JOIN pragma_foreign_key_list(m.name) AS f
        WHERE m.type = 'table'
          AND m.name = '${table.replace(/["`]/g, "")}'
          AND ('fk_' || m.name || '_' || f."from") = '${constraint.replace(/["`]/g, "")}'
      ) AS "IS_EXISTS"
    `];

    return this.format(sql);
  }

  public addFK({
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
    const sql = [`
      SELECT
        ii.name AS "Column",
        il.name AS "IndexName",
        il.origin AS "IndexType",
        CASE WHEN ti."notnull" = 0 THEN 'YES' ELSE 'NO' END AS "Nullable",
        CASE WHEN il."unique" = 1 THEN 'YES' ELSE 'NO' END AS "Unique"
      FROM sqlite_master AS m
      JOIN pragma_index_list(m.name) AS il
      JOIN pragma_index_info(il.name) AS ii
      LEFT JOIN pragma_table_info(m.name) AS ti
        ON ti.name = ii.name
      WHERE m.type = 'table'
        AND m.name = '${table.replace(/["`]/g, "")}'
        AND il.origin != 'pk'
    `];

    return this.format(sql);
  }

  public hasIndex({
    database,
    table,
    name,
  }: {
    database: string;
    table: string;
    name: string;
  }) {
    const sql = [`
      SELECT EXISTS(
        SELECT 1
        FROM sqlite_master AS m
        JOIN pragma_index_list(m.name) AS il
        WHERE m.type = 'table'
          AND m.name = '${table.replace(/["`]/g, "")}'
          AND il.name = '${name.replace(/["`]/g, "")}'
          AND il.origin != 'pk'
      ) AS "IS_EXISTS"
    `];

    return this.format(sql);
  }

  public addIndex({
    table,
    name,
    columns,
  }: {
    table   : string;
    name   : string;
    columns : string[];
  }) {
    
    const cols = columns
    .map(col => `\`${col}\``)
    .join(", ");

    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("ADD_INDEX"),
      `\`${name}\``,
      `(${cols})`
    ];

    return this.format(sql);
  }

  public dropIndex({
    table,
    name,
  }: {
    table   : string;
    name   : string;
  }) {
    
    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("DROP"),
      this.$constants("INDEX"),
      `\`${name}\``
    ];

    return this.format(sql);
  }

  public hasUnique({
    database,
    table,
    name,
  }: {
    database: string;
    table: string;
    name: string;
  }) {
    const sql = [`
      SELECT EXISTS(
        SELECT 1
        FROM sqlite_master AS m
        WHERE m.type = 'table'
          AND m.name = '${table.replace(/["`]/g, "")}'
          AND (
            ('${name}' = 'PRIMARY KEY' AND m.sql LIKE '%PRIMARY KEY%')
            OR
            ('${name}' = 'UNIQUE' AND EXISTS (
              SELECT 1 FROM pragma_index_list(m.name) il WHERE il."unique" = 1
            ))
            OR
            ('${name}' = 'FOREIGN KEY' AND EXISTS (
              SELECT 1 FROM pragma_foreign_key_list(m.name)
            ))
          )
      ) AS "IS_EXISTS"
    `];

    return this.format(sql);
  }

  public addUnique({
    table,
    name,
    columns
  }: {
    table   : string;
    name  : string;
    columns : string[];
  }) {

    const cols = columns
    .map(col => `\`${col}\``)
    .join(", ");

    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("ADD_CONSTRAINT"),
      `\`${name}\``,
      this.$constants("UNIQUE"),
      `(${cols})`
    ];

    return this.format(sql);
  }

  public dropUnique({
    table,
    name,
  }: {
    table   : string;
    name   : string;
  }) {
    
    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("DROP"),
      this.$constants("INDEX"),
      `\`${name}\``
    ];

    return this.format(sql);
  }

  public hasPrimaryKey({
    database,
    table,
  }: {
    database: string;
    table: string;
  }): string {

    const sql = `
      SELECT EXISTS(
        SELECT 1
        FROM pragma_table_info('${table.replace(/["'`]/g, "")}')
        WHERE pk = 1
      ) AS IS_EXISTS
    `;

    return this.format(sql);
  }

  public addPrimaryKey({
    table,
    columns,
  }: {
    table   : string;
    columns : string[];
  }): string {

    const cols = columns
    .map(col => `\`${col}\``)
    .join(", ");

    const sql = `
      ${this.$constants('ALTER_TABLE')} \`${table}\`
      ${this.$constants('ADD')} ${this.$constants('PRIMARY_KEY')} (${cols})
    `;

    return this.format(sql);
  }

  public dropPrimaryKey({ table }: {
    table : string
  }) {
    
    const sql = [
      this.$constants("ALTER_TABLE"),
      `\`${table}\``,
      this.$constants("DROP"),
      this.$constants("PRIMARY_KEY")
    ];

    return this.format(sql);
  }

  public getDatabase(database: string): string {
    const sql: string = [
      `SELECT '${database.replace(/`/g, "")}' AS DB`,
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
      `DELETE FROM "${table}"`,
    ].join(" ")
    
    return this.format(sql);
  }

  public sleep(second: number): string {
    return `SLEEP(${second})`;
  }

  public format(sql: (string | null)[] | string) {
    if (typeof sql === "string") sql = [sql];

    const formated = sql
      .filter((s) => s !== "" || s == null)
      .join(" ")
      .replace(/\s+/g, " ");

    const replaceBackticksWithDoubleQuotes = (sqlString: string) => {
      const updateRegex   = /^UPDATE\b/i;
      const insertRegex   = /^INSERT\b/i;
      const deleteRegex   = /^DELETE\b/i;
      const truncateRegex = /^TRUNCATE\b/i;

       if (updateRegex.test(sqlString)) {
        sqlString = sqlString.replace(
          /(SET\s+)(.*?)(\s+WHERE)/is,
          (_, start, setPart, end) => {
            const cleaned = setPart.replace(/`[\w$_]+`\./g, '');
            return start + cleaned + end;
          }
        );
      }

      if (
        insertRegex.test(sqlString) ||
        deleteRegex.test(sqlString) ||
        truncateRegex.test(sqlString)
      ) {
        return sqlString
          .replace(/`[\w$_]+`\.`([\w$_]+)`/g, "`$1`")
          .replace(/`([^`]+)`/g, '"$1"');
      }

      return sqlString.replace(/`([^`]+)`/g, '"$1"');
    };
    
    return replaceBackticksWithDoubleQuotes(formated);
  }

  public getActiveConnections () : string {
    const sql: string = `SELECT 1 AS Connections`

    return this.format(sql);
  }

  public getMaxConnections () : string {
    const sql: string = `SELECT 151 AS MaxConnections`
    return this.format(sql);
  }

  protected bindJoin(values: string[]) {
    if (!Array.isArray(values) || !values.length) return null;

    return values.join(" ");
  }

  protected bindWhere(values: any[]) {
    if (!Array.isArray(values) || !values.length) return null;

    const serializeWhere = (wheres: TStateWhereCondition[]): string => {

      const resolveValue = ({ operator , value }: { operator : string | null , value : any}) => {

        let valueStr = '';

        if (operator?.toUpperCase() === this.$constants('IN') && Array.isArray(value)) {
          valueStr = `(${value.map((v) => v).join(',')})`;
        } else if (
          operator?.toUpperCase() === this.$constants('IS_NULL') ||
          operator?.toUpperCase() === this.$constants('IS_NOT_NULL')
        ) {
          valueStr = '';
        } else {
          valueStr = `${value}`;
        }

        return valueStr
      }

      const conditionToSQL = (cond: TStateWhereCondition, isFirst: boolean = false): string => {
   
        const { column = '', operator = '' , condition , value , nested } = cond

        if (nested && nested.length) {
          const nestedSQL = nested
          .map((c) => conditionToSQL(c))
          .join(' ');

          const valueStr = resolveValue({ operator, value });

          if(!isFirst) {
            return `${condition ?? this.$constants('AND')} (${column} ${operator} ${valueStr} ${nestedSQL})`;
          }

          return `(${column} ${operator} ${valueStr} ${nestedSQL})`;
        }

        const valueStr = resolveValue({ operator, value });

        if(!isFirst) {
          return `${condition ?? this.$constants('AND')} ${column} ${operator} ${valueStr}`.trim();
        } 

        return `${column} ${operator} ${valueStr}`.trim();
      };

      return wheres.map((cond, i) => conditionToSQL(cond, !i)).join(' ');
    };

    return `${this.$constants("WHERE")} ${serializeWhere(values)}`
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

  protected bindRowLevelLock(rowLevelLock : {
    mode       : "FOR_UPDATE" | "FOR_SHARE" | null,
    skipLocked : boolean | null,
    nowait     : boolean | null
  }) {
    
    // SQLite does NOT support SELECT … FOR UPDATE or SKIP LOCKED
    return '';
  }

  private _formatedTypeAndAttributes({
      table,
      type,
      attributes,
      key,
      changed
    }: {
      changed?: boolean;
      table?: string;
      type: string;
      attributes: string[];
      key: string;
    }) {
      let formatedType = type;
      let formatedAttributes = attributes;
      let raws : string | null = null;

      if (type.startsWith("INT") && !attributes.some((v) => v === "PRIMARY KEY")) {
        formatedType = "INTEGER";
      }
  
      if (type.startsWith("INT") && attributes.some((v) => v === "PRIMARY KEY")) {
        formatedType = "INTEGER";
        formatedAttributes = attributes.filter((attr) => {
          return !attr.startsWith("AUTO_INCREMENT");
        });
      }
      
      if (type.startsWith("TINYINT")) {
        formatedType = "SMALLINT";
      }
  
      if (type.startsWith("LONGTEXT") || type.startsWith("MEDIUMTEXT")) {
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
        raws
      };
    }
}
