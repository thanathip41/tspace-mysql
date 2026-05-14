import { QueryBuilder } from "..";
import { Blueprint }    from "../../Blueprint";
import { StateManager } from "../../StateManager";

import { 
  type TStateWhereCondition 
} from "../../../types";

export class MongodbQueryBuilder extends QueryBuilder {
  constructor(state: StateManager) {
    super(state);
  }
  public select = () => {

    let PIPELINE : any[] = []

    if(
      this.$state.get('SELECT')?.length && 
      !this.$state.get('SELECT').some(v => v === '*')
    ) {

      const parseSelect = (arr: string[]) => {
        const result: Record<string, boolean> = {};

        for (const str of arr) {
          const match = str.match(/`[^`]+`\.`([^`]+)`/);
          if (!match) continue;

          const key = match[1];

          result[key] = true;
        }
        
        return result;
      };

      const project = parseSelect(this.$state.get('SELECT'))

      if(Object.keys(project).length) {
        PIPELINE.push({
          $project : project
        })
      }
    }

    if(this.$state.get('JOIN')?.length) {
      
      const parseJoin = (join: string) => {
        const type =
          /LEFT JOIN/i.test(join) ? "LEFT" :
          /RIGHT JOIN/i.test(join) ? "RIGHT" :
          "INNER"

        const regex =
          /(INNER|LEFT|RIGHT)\s+JOIN\s+`(\w+)`\s+ON\s+`(\w+)`\.`(\w+)`\s*=\s*`(\w+)`\.`(\w+)`/i

        const match = join.match(regex)
        if (!match) return null

        const [, , from, localTable, localField, foreignTable, foreignField] = match

        return {
          type,
          from,
          localField,
          foreignField,
          as: from
        }
      }

      const joins = this.$state.get('JOIN')
    
      for (const join of joins) {
        const parsed = parseJoin(join);

        if (!parsed) continue

        if (parsed.type === "RIGHT") {
          throw new Error("RIGHT JOIN is not supported in MongoDB aggregation pipeline.");
        }

        PIPELINE.push({
          $lookup: {
            from: parsed.from,
            localField: parsed.localField,
            foreignField: parsed.foreignField,
            as: parsed.as
          }
        })

        PIPELINE.push({
          $unwind: {
            path: `$${parsed.as}`,
            preserveNullAndEmptyArrays: parsed.type === "INNER" ? false : true
          }
        })
        
      }
      
    }

    if(this.$state.get('WHERE')?.length) {
      PIPELINE.push({
        $match : this._parseWheres(this.$state.get('WHERE'))
      })
    }

    if(
      this.$state.get('SELECT')?.length && 
      !this.$state.get('SELECT').some(v => v === '*')
    ) {


      const aggregate = this.$state.get('SELECT')
      .map(col => {
        const match = col.match(/\b(COUNT|AVG|SUM|MAX|MIN)\s*\((.*?)\)\s+AS\s+`?(\w+)`?/i);
        if (!match) return null;

        return {
          fn: match[1].toUpperCase(),
          field: String(match[2].match(/`[^`]+`\.`([^`]+)`/)?.[1] ?? ''),
          as: match[3]
        };
      })
      .find(Boolean);

      if (aggregate) {
        switch (aggregate.fn) {

          case 'COUNT':
            PIPELINE.push({
              $count: aggregate.as
            });
            break;

          case 'SUM':
            PIPELINE.push({
              $group: {
                _id: null,
                [aggregate.as]: { $sum: `$${aggregate.field}` }
              }
            });
            break;

          case 'AVG':
            PIPELINE.push({
              $group: {
                _id: null,
                [aggregate.as]: { $avg: `$${aggregate.field}` }
              }
            });
            break;

          case 'MAX':
            PIPELINE.push({
              $group: {
                _id: null,
                [aggregate.as]: { $max: `$${aggregate.field}` }
              }
            });
            break;

          case 'MIN':
            PIPELINE.push({
              $group: {
                _id: null,
                [aggregate.as]: { $min: `$${aggregate.field}` }
              }
            });
            break;
        }
      }
    }
      
    if(this.$state.get('ORDER_BY').length) {
        PIPELINE.push({ 
          $sort : this.$state.get('ORDER_BY')
        })
    }

    if(this.$state.get('OFFSET')) {
        PIPELINE.push({ 
          $skip : this.$state.get('OFFSET')
        })
    }

    if(this.$state.get('LIMIT')) {
        PIPELINE.push({
          $limit : this.$state.get('LIMIT')
        })
    }

    const collection = this.$state.get('TABLE_NAME')?.replace(/\`/g, "");

    const pipeline = `db.${collection}.aggregate(${JSON.stringify(PIPELINE)}).toArray()`;

    return pipeline;
    
  };

  public insert() {
    const query = this.$state.get("INSERT");

    if (!query) return '';

    const parseInsert = (input: {
      columns: string[];
      values: string[];
    }) => {

      const normalizeColumn = (col: string) =>
        col.replace(/`/g, '').split('.').pop() || '';

      const splitValues = (str: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuote = false;

        for (let i = 0; i < str.length; i++) {
          const char = str[i];

          if (char === "'") {
            inQuote = !inQuote;
            continue;
          }

          if (char === ',' && !inQuote) {
            result.push(current.trim());
            current = '';
            continue;
          }

          current += char;
        }

        if (current) result.push(current.trim());

        return result;
      };

      const parseValue = (val: string): any => {
        const v = val.trim();

        if (!isNaN(Number(v))) return Number(v);

        if (v.toLowerCase() === 'true') return true;
        if (v.toLowerCase() === 'false') return false;
        if (v.toLowerCase() === 'null') return null;

        return v;
      };

      const columns = input.columns.map(normalizeColumn);

      return input.values.map(row => {
        const values = splitValues(row).map(parseValue);

        const obj: Record<string, any> = {
          "_id" : this._objectId()
        };

        columns.forEach((col, i) => {
          obj[col] = values[i];
        })

        return obj;
      });
    };

    const collection = this.$state.get('TABLE_NAME')?.replace(/\`/g, "");

    return `db.${collection}.insertMany(${JSON.stringify(parseInsert(query))})`;
  }

  public update() {
    const query = this.$state.get("UPDATE") as string[];
    if (!query || !query.length) return '';

    const parseValue = (val: string): any => {
      const v = val.trim().replace(/^'|'$/g, '');

      if (!isNaN(Number(v))) return Number(v);
      if (v.toLowerCase() === 'true') return true;
      if (v.toLowerCase() === 'false') return false;
      if (v.toLowerCase() === 'null') return null;

      return v;
    };

    const parseSet = (input: string[]) => {
      const result: Record<string, any> = {};

      input.forEach(pair => {
        const [key, value] = pair.split('=');

        const k = key.replace(/`/g, '').split('.').pop()?.trim() || '';
        result[k] = parseValue(value);
      });

      return result;
    };

    const collection = this.$state.get('TABLE_NAME')?.replace(/`/g, "");

    const update = {
      $set: parseSet(query)
    };

    const filter = this._parseWheres(this.$state.get('WHERE'))

    return `db.${collection}.updateMany(${JSON.stringify(filter)}, ${JSON.stringify(update)})`;
  }

  public remove() {
    const isDelete = this.$state.get("DELETE");

    if (!isDelete) {
      throw new Error(
        "Bad query builder: DELETE state not enabled. Please check your query configuration."
      );
    }

    const collection = this.$state
      .get("TABLE_NAME")
      ?.replace(/`/g, "");

    const filter = this._parseWheres(this.$state.get('WHERE'))

    return `db.${collection}.deleteMany(${JSON.stringify(filter)})`
  }

  public any() {
    if (this.$state.get("INSERT")) return this.insert();
    if (this.$state.get("UPDATE")) return this.update();
    if (this.$state.get("DELETE")) return this.remove();
    return this.select();
  }

  public getColumns({ database, table }: { database: string; table: string }) {
    throw new Error("Method not implemented.");
    return '';
  }

  public getSchema({ database, table }: { database: string; table: string }) {
    throw new Error("Method not implemented.");
    return '';
  }

  public getTables(database: string) {
    throw new Error("Method not implemented.");
    return '';
  }

  public hasTable({ database, table }: { database: string; table: string }) {
    throw new Error("Method not implemented.");
    return '';
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
    throw new Error("Method not implemented.");
    return '';
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
    throw new Error("Method not implemented.");
    return '';
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
    throw new Error("Method not implemented.");
    return '';
  }

  public getChildFKs({ database, table }: { database: string; table: string }) {
    throw new Error("Method not implemented.");
    return '';
  }

  public getFKs({ database, table }: { database: string; table: string }) {
    throw new Error("Method not implemented.");
    return '';
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
    throw new Error("Method not implemented.");
    return '';
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
    throw new Error("Method not implemented.");
    return '';
  }

  public dropFK({
    table,
    constraint,
  }: {
    table: string;
    constraint: string;
  }) {
    throw new Error("Method not implemented.");
    return '';
  }

  public getIndexes({ database, table }: { database: string; table: string }) {
    throw new Error("Method not implemented.");
    return '';
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
    throw new Error("Method not implemented.");
    return '';
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
    
    throw new Error("Method not implemented.");
    return '';
  }

  public dropIndex({
    table,
    name,
  }: {
    table   : string;
    name   : string;
  }) {
    
    throw new Error("Method not implemented.");
    return '';
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

    throw new Error("Method not implemented.");
    return '';
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

    throw new Error("Method not implemented.");
    return '';
  }

  public dropUnique({
    table,
    name,
  }: {
    table   : string;
    name   : string;
  }) {
    
    throw new Error("Method not implemented.");
    return '';
  }

  public hasPrimaryKey({
    database,
    table,
  }: {
    database: string;
    table: string;
  }): string {

    throw new Error("Method not implemented.");
    return '';
  }

  public addPrimaryKey({
    table,
    columns,
  }: {
    table   : string;
    columns : string[];
  }): string {

    throw new Error("Method not implemented.");
    return '';
  }

  public dropPrimaryKey({ table }: {
    table : string
  }) {
    
    throw new Error("Method not implemented.");
    return '';
  }

  public getDatabase(database: string): string {
    throw new Error("Method not implemented.");
    return '';
  }

  public dropDatabase(database: string): string {
    throw new Error("Method not implemented.");
    return '';
  }

  public dropView(view: string): string {
    throw new Error("Method not implemented.");
    return '';
  }

  public dropTable(table: string): string {
    const sql: string = [
      `${this.$constants("DROP_TABLE")}`,
      `\`${table.replace(/`/g, "")}\``
    ].join(" ")

    return this.format(sql);
  }

  public truncate(table: string): string {
    return `db.${table}.deleteMany({})`;
  }

  public sleep(second: number): string {
    throw new Error("Method not implemented.");
    return '';
  }

  public format(pipeline: (string | null)[] | string) {
    if (typeof pipeline === "string") pipeline = [pipeline];

    return pipeline
      .filter((s) => s !== "" || s == null)
      .join(" ")
      .replace(/\s+/g, " ");
  }

  public getActiveConnections () : string {
    throw new Error("Method not implemented.");
    return '';
  }

  public getMaxConnections () : string {
    throw new Error("Method not implemented.");
    return '';
  }

  protected bindJoin(values: string[]) {
    return "";
  }

  protected bindWhere(values: any[]) {
    return "";
  }

  protected bindOrderBy(values: string[]) {
    
    return ``;
  }

  protected bindGroupBy(values: string[]) {
    return ``;
  }

  protected bindSelect(
    values: string[],
    { distinct }: { distinct?: string } = {}
  ) {

    
    return ``;
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
  
    return ``;
  }

  protected bindLimit(limit: string | number | null) {
  
    return ``;
  }

  protected bindOffset(offset: string | number | null) {
    return ``;
  }

  protected bindHaving(having: string | null) {
    return ``;
  }

  protected bindRowLevelLock(mode: "FOR_UPDATE" | "FOR_SHARE" | null) {
    
    return '';
  }

  private _objectId () {
  
      const timestamp = Math.floor(Date.now() / 1000)
      .toString(16)
      .padStart(8, '0');
  
      const random = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
  
      const counter = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
  
      return timestamp + random + counter;
  };

  private _parseWheres = (wheres: TStateWhereCondition[] = []) => {

    const normalizeColumn = (column: string = '') => {
      const clean = column.replace(/`/g, '');
      return clean.split('.').pop() || '';
    };
      
    const parseValue = (value: any): any => {
      if (Array.isArray(value)) return value.map(parseValue);

      if (typeof value === 'string') {
        const trimmed = value.trim();
        const unquoted = trimmed.replace(/^'+|'+$/g, '');

        if (!isNaN(Number(unquoted))) return Number(unquoted);
        if (unquoted.toLowerCase() === 'true') return true;
        if (unquoted.toLowerCase() === 'false') return false;

        return unquoted;
      }

      return value;
    };

    const likeToRegex = (value: any): string => {
      const v = parseValue(value);
      return '^' + v.replace(/%/g, '.*').replace(/_/g, '.') + '$';
    };

    const buildCondition = (w: TStateWhereCondition): any => {
      const field = normalizeColumn(w.column ?? '');
      const op = (w.operator || '=').toUpperCase();
      const val = w.value;

      const baseCondition = (() => {
        switch (op) {
          case '=':
            return { [field]: parseValue(val) };

          case '!=':
          case '<>':
            return { [field]: { $ne: parseValue(val) } };

          case '>':
            return { [field]: { $gt: parseValue(val) } };

          case '>=':
            return { [field]: { $gte: parseValue(val) } };

          case '<':
            return { [field]: { $lt: parseValue(val) } };

          case '<=':
            return { [field]: { $lte: parseValue(val) } };

          case 'IN':
            return { [field]: { $in: (val || []).map(parseValue) } };

          case 'NOT IN':
            return { [field]: { $nin: (val || []).map(parseValue) } };

          case 'IS NULL':
            return { [field]: null };

          case 'IS NOT NULL':
            return { [field]: { $ne: null } };

          case 'BETWEEN':
            if (!Array.isArray(val)) return {};
            return {
              [field]: {
                $gte: parseValue(val[0]),
                $lte: parseValue(val[1])
              }
            };

          case 'LIKE':
            return {
              [field]: {
                $regex: likeToRegex(val),
                $options: 'i'
              }
            };

          case 'NOT LIKE':
            return {
              [field]: {
                $not: {
                  $regex: likeToRegex(val),
                  $options: 'i'
                }
              }
            };

          case 'EXISTS':
            return { [field]: { $exists: Boolean(val) } };

          default:
            throw new Error(`Unsupported operator: ${op}`);
        }
      })();

      if (w.nested && Array.isArray(w.nested)) {
        const nestedGroup = buildGroup(w.nested);

        const conditionType = (w.condition || this.$constants('AND')).toUpperCase();

        if (conditionType === this.$constants('OR')) {
          return {
            $or: [baseCondition, nestedGroup]
          };
        }

        return {
          $and: [baseCondition, nestedGroup]
        };
      }

      return baseCondition;
    };

    const buildGroup = (lists: TStateWhereCondition[] = []): any => {
      if (!lists.length) return {};

      const groups: any[] = [];

      for (const w of lists) {
        const cond = buildCondition(w);

        if (!cond) continue;

        const type = (w.condition || this.$constants('AND')).toUpperCase();

        if (groups.length === 0) {
          groups.push(cond);
          continue;
        }

        if (type === this.$constants('OR')) {
          const last = groups.pop();

          groups.push({
            $or: [last, cond]
          });
        } else {
          const last = groups.pop();
          groups.push({
            $and: [last, cond]
          });
        }
      }

      return groups[0] || {};
    };

    return buildGroup(wheres);
  };
  
}
