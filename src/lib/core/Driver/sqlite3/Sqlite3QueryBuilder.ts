import { QueryBuilder } from "..";
import { StateHandler } from "../../Handlers/State";

export class Sqlite3QueryBuilder extends QueryBuilder {
    
    constructor(state : StateHandler) {
        super(state)
    }
    public select = () => {
        const combindSQL = [
            this.bindSelect(this.$state.get("SELECT")),
            this.bindFrom({
                from : this.$constants("FROM"),
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
            this.bindOffset(this.$state.get("OFFSET"))
        ];

        let sql  = this.format(combindSQL).trimEnd()

        if (this.$state.get("UNION").length) {
            sql = `(${sql}) ${this.$state.get("UNION").map((union: string) => `${this.$constants("UNION")} (${union})`).join(" ")}`;
        }

        if (this.$state.get("UNION_ALL").length) {
            sql = `(${sql}) ${this.$state.get("UNION_ALL").map((union: string) => `${this.$constants("UNION_ALL")} (${union})`).join(" ")}`;
        }

        if (this.$state.get("CTE").length) {
            sql = `${this.$constants("WITH")} ${this.$state.get("CTE").join(", ")} ${sql}`;
        }

        return sql;
    };

    public insert () {
      const sql = this.format([this.$state.get("INSERT")]);
      return sql;
    };

    public update() {
      const sql = this.format([
        this.$state.get("UPDATE"),
        this.bindWhere(this.$state.get("WHERE")),
        this.bindOrderBy(this.$state.get("ORDER_BY")),
        this.bindLimit(this.$state.get("LIMIT")),
      ]);
      return sql;
    };

    public remove () {
      const sql = this.format([
        this.$state.get("DELETE"),
        this.bindWhere(this.$state.get("WHERE")),
        this.bindOrderBy(this.$state.get("ORDER_BY")),
        this.bindLimit(this.$state.get("LIMIT")),
      ]);
      return sql;
    };

    public any () {
        if (this.$state.get("INSERT")) return  this.insert();
        if (this.$state.get("UPDATE")) return  this.update();
        if (this.$state.get("DELETE")) return  this.remove();
        return this.select();
    }

    public columns ({ database, table } : { 
      database : string; 
      table    : string;
    }) {
      const sql = [
        `SELECT 
          COLUMN_NAME as "Field", 
          DATA_TYPE as "Type",
          IS_NULLABLE as "Null",
          COLUMN_DEFAULT as "Default"
        `,
        `FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = '${table.replace(/\`/g, "")}'
          AND table_schema = '${database}'
        `,
      ];

      return this.format(sql);
    }

    public schema ({ database, table } : { 
      database  : string; 
      table     : string;
    }) {
      const sql = [
        `SELECT 
          COLUMN_NAME as "Field", 
          DATA_TYPE as "Type",
          IS_NULLABLE as "Null",
          COLUMN_DEFAULT as "Default"
        `,
        `FROM INFORMATION_SCHEMA.COLUMNS
        WHERE table_name = '${table.replace(/\`/g, "")}'
          AND table_schema = '${database}'
        `,
      ];

      return this.format(sql);
    }

    public fk ({ database , table , fk } : { 
      database  : string; 
      table     : string;
      fk        : string;
    }) {
      const sql = [
        `
        SELECT 
          TABLE_SCHEMA as "Database", 
          TABLE_NAME as "Table", 
          CONSTRAINT_NAME as "Fk"
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        `,
        `
        WHERE REFERENCED_TABLE_NAME IS NOT NULL
          AND TABLE_SCHEMA    = '${database}'
          AND TABLE_NAME      = '${table}'
          AND CONSTRAINT_NAME = '${fk}'
        `
      ]

      return this.format(sql);
    }

    public format (sql: (string | null)[] | string) {
      if(typeof sql === 'string') sql = [sql];
      
      let formated = sql
      .filter((s) => s !== "" || s == null)
      .join(" ")
      .replace(/\s+/g, " ");

      return formated.replace('TRUNCATE','DELETE')
    }

    protected bindJoin (values: string[]) {
      if (!Array.isArray(values) || !values.length) return null;

      return values.join(" ");
    };

    protected bindWhere (values: string[]) {
      if (!Array.isArray(values) || !values.length) return null;

      return `${this.$constants("WHERE")} ${values
        .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
        .join(" ")}`;
    };

    protected bindOrderBy (values: string[]) {
      if (!Array.isArray(values) || !values.length) return null;

      return `${this.$constants("ORDER_BY")} ${values
        .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
        .join(", ")}`;
    };

    protected bindGroupBy (values: string[]) {
      if (!Array.isArray(values) || !values.length) return null;

      return `${this.$constants("GROUP_BY")} ${values
        .map((v) => v.replace(/^\s/, "").replace(/\s+/g, " "))
        .join(", ")}`;
    };

    protected bindSelect (values: string[], { distinct }: { distinct ?: string } = {}) {
      if (!values.length) {
        if (!distinct)
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

    protected bindFrom ({
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
    };

    protected bindLimit (limit: string | number) {
      if (limit === "" || limit == null) return "";

      return `${this.$constants("LIMIT")} ${limit}`;
    };

    protected bindOffset (offset: string) {
      return offset
    };

    protected bindHaving (having: string) {
      return having
    };
}