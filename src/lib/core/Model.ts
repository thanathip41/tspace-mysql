import "reflect-metadata";
import pluralize            from "pluralize";
import { DB }               from "./DB";
import { Schema }           from "./Schema";
import { AbstractModel }    from "./Abstracts/AbstractModel";
import { proxyHandler }     from "./Handlers/Proxy";
import { RelationHandler }  from "./Handlers/Relation";
import { Blueprint }        from "./Blueprint";
import { StateHandler }     from "./Handlers/State";
import { Cache }            from "./Cache";
import { JoinModel }        from "./JoinModel";
import { CONSTANTS }        from "../constants";
import type { T }           from "./UtilityTypes";
import type {
  TCache,
  TExecute,
  TRelationOptions,
  TValidateSchema,
  TGlobalSetting,
  TPattern,
  TRelationQueryOptions,
  TModelConstructorOrObject,
  TRelationKeys,
  TDriver,
  TPoolConnected,
} from "../types";
import type { 
  TRelationQueryOptionsDecorator, 
} from "../types/decorator";
import { 
  REFLECT_META_SCHEMA, 
  REFLECT_META_RELATIONS, 
  REFLECT_META_TABLE, 
  REFLECT_META_VALIDATE_SCHEMA, 
  REFLECT_META_SOFT_DELETE, 
  REFLECT_META_PATTERN, 
  REFLECT_META_TIMESTAMP, 
  REFLECT_META_OBSERVER, 
  REFLECT_META_UUID 
} from "./Decorator";

let globalSettings: TGlobalSetting = {
  softDelete: false,
  debug: false,
  uuid: false,
  timestamp: false,
  pattern: false,
  logger: {
    selected: false,
    inserted: false,
    updated: false,
    deleted: false,
  },
};

/**
 *
 * 'Model' class is a representation of a database table
 * @generic {Type} TS
 * @generic {Type} TR
 * @example
 * import { Model, Blueprint, type T } from 'tspace-mysql'
 *
 * const schema = {
 *   id    : new Blueprint().int().primary().autoIncrement(),
 *   uuid  : new Blueprint().varchar(50).null(),
 *   email : new Blueprint().varchar(50).null(),
 *   name  : new Blueprint().varchar(255).null(),
 * }
 *
 * type TS = T.Schema<typeof Schema>
 *
 * class User extends Model<TS> {
 *  boot() {
 *   this.useSchema(schema)
 *  }
 * }
 *
 * const users = await new User().findMany()
 * console.log(users)
 */
class Model<
  TS extends Record<string, any> = any,
  TR = unknown
> extends AbstractModel<TS, TR> {
  constructor(protected $cache = Cache) {
    super();
    /**
     *
     * @Get initialize for model
     */
    this._initialModel();
    /**
     *
     * @define Setup for model
     */
    this.define();
    this.boot();

    return new Proxy(this, proxyHandler);
  }

  /**
   * The 'global' method is used setting global variables in models.
   * @static
   * @param {GlobalSetting} settings
   * @example
   * Model.global({
   *   softDelete : true,
   *   uuid       : true,
   *   timestamp  : true,
   *   debug      : true
   *   logger     : {
   *       selected : true,
   *       inserted : true,
   *       updated  : true,
   *       deleted  : true
   *   },
   * })
   * @returns {void} void
   */
  static global(settings: TGlobalSetting): void {
    globalSettings = Object.assign({}, globalSettings, settings);
    return;
  }

  /**
   * The 'table' method is used get table name.
   * @static
   * @returns {string} name of the table
   */
  static get table(): string {
    return new this().getTableName();
  }

  /**
   * The 'formatPattern' method is used to change the format of the pattern.
   * @param {object} data { data , pattern }
   * @property {Record | string} data
   * @property {string} parttern
   * @returns {Record | string} T
   */
  static formatPattern<T extends Record<string, any> | string>({
    data,
    pattern,
  }: {
    data: T;
    pattern: TPattern;
  }): T {
    const utils = new this().$utils;

    if (pattern === "snake_case") {
      if (typeof data === "string") {
        return data.replace(
          /([A-Z])/g,
          (str: string) => `_${str.toLocaleLowerCase()}`
        ) as T;
      }

      return utils.snakeCase({ ...data }) as T;
    }

    if (pattern === "camelCase") {
      if (typeof data === "string") {
        return data.replace(
          /(.(_|-|\s)+.)/g,
          (str: string) => str[0] + str[str.length - 1].toUpperCase()
        ) as T;
      }

      return utils.camelCase({ ...data }) as T;
    }

    return data;
  }

  /**
   * The 'instance' method is used get instance.
   * @override
   * @static
   * @returns {Model} instance of the Model
   */
  static get instance(): Model {
    return new this();
  }

  /**
   * The 'cache' method is used get the functions from the Cache
   * @returns {TCache} cache
   */
  static get cache(): TCache {
    return Cache;
  }

  protected useMiddleware(fun: Function): this {
    if (typeof fun !== "function")
      throw new Error(`this '${fun}' is not a function`);

    this.$state.set("MIDDLEWARES", [...this.$state.get("MIDDLEWARES"), fun]);
    return this;
  }

  /**
   * The 'globalScope' method is a feature that allows you to apply query constraints to all queries for a given model.
   *
   * @example
   *  class User extends Model {
   *     constructor() {
   *      super()
   *      this.globalScope(query => {
   *           return query.where('id' , '>' , 10)
   *      })
   *   }
   *  }
   * @returns {void} void
   */
  protected globalScope<M extends Model>(callback: (query: M) => M): this {
    const model = new Model().table(this.getTableName()) as M;

    const repository: Model = callback(model);

    if (repository instanceof Promise)
      throw new Error('"whereQuery" is not supported a Promise');

    if (!(repository instanceof Model))
      throw new Error(`Unknown callback query: '${repository}'`);

    this.$state.set("GLOBAL_SCOPE_QUERY", () => {
      const where: string[] = repository?.$state.get("WHERE") || [];
      const select: string[] = repository?.$state.get("SELECT") || [];
      const orderBy: string[] = repository?.$state.get("ORDER_BY") || [];
      const limit: string = repository?.$state.get("LIMIT");

      if (where.length) {
        this.$state.set("WHERE", [
          ...this.$state.get("WHERE"),
          [
            this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
            ...where,
          ].join(" "),
        ]);
      }

      if (select.length) {
        this.$state.set("SELECT", [...this.$state.get("SELECT"), ...select]);
      }

      if (orderBy.length) {
        this.$state.set("ORDER_BY", [
          ...this.$state.get("ORDER_BY"),
          ...orderBy,
        ]);
      }

      if (limit != null) {
        this.$state.set("LIMIT", limit);
      }
    });

    return this;
  }

  /**
   * The 'define' method is a special method that you can define within a model.
   * @example
   *  class User extends Model {
   *     define() {
   *       this.useUUID()
   *       this.usePrimaryKey('id')
   *       this.useTimestamp()
   *       this.useSoftDelete()
   *     }
   *  }
   * @returns {void} void
   */
  protected define(): void {}
  /**
   *  The 'boot' method is a special method that you can define within a model.
   *  @example
   *  class User extends Model {
   *     boot() {
   *       this.useUUID()
   *       this.usePrimaryKey('id')
   *       this.useTimestamp()
   *       this.useSoftDelete()
   *     }
   *  }
   * @returns {void} void
   */
  protected boot(): void {}

  /**
   * The "useObserve" method is used to pattern refers to a way of handling model events using observer classes.
   * Model events are triggered when certain actions occur on models,
   * such as creating, updating, deleting, or saving a record.
   *
   * Observers are used to encapsulate the event-handling logic for these events,
   * keeping the logic separate from the model itself and promoting cleaner, more maintainable code.
   * @param {Function} observer
   * @returns this
   * @example
   *
   * class UserObserve {
   *    public selected(results : unknown) {
   *       console.log({ results , selected : true })
   *    }
   *
   *    public created(results : unknown) {
   *       console.log({ results , created : true })
   *    }
   *
   *    public updated(results : unknown) {
   *       console.log({ results ,updated : true })
   *    }
   *
   *    public deleted(results : unknown) {
   *       console.log({ results ,deleted : true })
   *    }
   *   }
   *
   *   class User extends Model {
   *      constructor() {
   *          super()
   *          this.useObserver(UserObserve)
   *      }
   *   }
   */
  protected useObserver(
    observer: new () => {
      selected: Function;
      created: Function;
      updated: Function;
      deleted: Function;
    }
  ) {
    this.$state.set("OBSERVER", observer);
    return this;
  }

  /**
   * The "useLogger" method is used to keeping query data and changed in models.
   *
   * @type     {object}  options
   * @property {boolean} options.selected - default is false
   * @property {boolean} options.inserted - default is true
   * @property {boolean} options.updated  - default is true
   * @property {boolean} options.deleted  - default is true
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useLogger({
   *          selected : true,
   *          inserted : true,
   *          updated  : true,
   *          deleted  : true,
   *       })
   *   }
   * }
   * @returns {this} this
   */
  protected useLogger({
    selected = false,
    inserted = true,
    updated = true,
    deleted = true,
  } = {}): this {
    this.$state.set("LOGGER", ![
      selected,
      inserted,
      updated,
      deleted
    ].every(v => v === false));
    this.$state.set("LOGGER_OPTIONS", {
      selected,
      inserted,
      updated,
      deleted,
    });

    return this;
  }

  /**
   * The "useSchema" method is used to define the schema.
   *
   * It's automatically create, called when not exists table or columns.
   * @param {object} schema using Blueprint for schema
   * @example
   * import { Blueprint } from 'tspace-mysql';
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useSchema ({
   *            id          : new Blueprint().int().notNull().primary().autoIncrement(),
   *            uuid        : new Blueprint().varchar(50).null(),
   *            email       : new Blueprint().varchar(50).null(),
   *            name        : new Blueprint().varchar(255).null(),
   *            created_at  : new Blueprint().timestamp().null(),
   *            updated_at  : new Blueprint().timestamp().null()
   *         })
   *     }
   * }
   * @returns {this} this
   */
  protected useSchema(schema: Record<string, Blueprint>): this {
    this.$state.set("SCHEMA_TABLE", schema);
    return this;
  }

  /**
   *
   * The "useRegistry" method is used to define Function to results.
   *
   * It's automatically given Function to results.
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useRegistry()
   *     }
   * }
   */
  protected useRegistry(): this {
    this.$state.set("REGISTRY", {
      ...this.$state.get("REGISTRY"),
      $save: this._save.bind(this),
      $attach: this._attach.bind(this),
      $detach: this._detach.bind(this),
    });
    return this;
  }

  /**
   * The "useLoadRelationsInRegistry" method is used automatically called relations in your registry Model.
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useLoadRelationInRegistry()
   *     }
   * }
   */
  protected useLoadRelationsInRegistry(): this {
    const relations: string[] = this.$state
      .get("RELATIONS")
      .map((r: { name: string }) => String(r.name));

    if (relations.length)
      this.relations(...(Array.from(new Set(relations)) as any[]));

    return this;
  }

  /**
   * The "useBuiltInRelationFunctions" method is used to define the function.
   *
   * It's automatically given built-in relation functions to a results.
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useBuiltInRelationsFunction()
   *     }
   * }
   */
  protected useBuiltInRelationFunctions(): this {
    this.$state.set("FUNCTION_RELATION", true);

    return this;
  }

  /**
   * The "usePrimaryKey" method is add primary keys for database tables.
   *
   * @param {string} primary
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.usePrimaryKey()
   *     }
   * }
   */
  protected usePrimaryKey(primary: string): this {
    this.$state.set("PRIMARY_KEY", primary);
    return this;
  }

  /**
   * The "useUUID" method is a concept of using UUIDs (Universally Unique Identifiers) as column 'uuid' in table.
   *
   * It's automatically genarate when created a result.
   * @param {string?} column [column=uuid] make new name column for custom column replace uuid with this
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useUUID()
   *     }
   * }
   */
  protected useUUID(column?: string): this {
    this.$state.set("UUID", true);
    if (column) this.$state.set("UUID_FORMAT", column);
    return this;
  }

  /**
   * The "useDebug" method is viewer raw-sql logs when excute the results.
   * @returns {this} this
   */
  protected useDebug(): this {
    this.$state.set("DEBUG", true);
    return this;
  }
  /**
   * The "usePattern" method is used to assign pattern [snake_case , camelCase].
   * @param  {string} pattern
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.usePattern('camelCase')
   *     }
   * }
   */
  protected usePattern(pattern: "snake_case" | "camelCase"): this {
    const allowPattern = [
      this.$constants("PATTERN").snake_case,
      this.$constants("PATTERN").camelCase,
    ];

    if (!allowPattern.includes(pattern)) {
      throw this._assertError(
        `The 'tspace-mysql' support only pattern '${
          this.$constants("PATTERN").snake_case
        }', 
                '${this.$constants("PATTERN").camelCase}'`
      );
    }

    this.$state.set("PATTERN", pattern);

    this._makeTableName();

    return this;
  }

  /**
   * The "useCamelCase" method is used to assign pattern camelCase.
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.useCamelCase()
   *     }
   * }
   */
  protected useCamelCase(): this {
    this.$state.set("PATTERN", this.$constants("PATTERN").camelCase);
    this._makeTableName();
    return this;
  }

  /**
   * The "SnakeCase" method is used to assign pattern snake_case.
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        super()
   *        this.SnakeCase()
   *     }
   * }
   */
  protected useSnakeCase(): this {
    this.$state.set("PATTERN", this.$constants("PATTERN").snake_case);
    this._makeTableName();
    return this;
  }

  /**
   * The "useSoftDelete" refer to a feature that allows you to "soft delete" records from a database table instead of permanently deleting them.
   *
   * Soft deleting means that the records are not physically removed from the database but are instead marked as deleted by setting a timestamp in a dedicated column.
   *
   * This feature is particularly useful when you want to retain a record of deleted data and potentially recover it later,
   * or when you want to maintain referential integrity in your database
   * @param {string?} column default deleted_at
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        this.useSoftDelete('deletedAt')
   *     }
   * }
   */
  protected useSoftDelete(column?: string): this {
    this.$state.set("SOFT_DELETE", true);

    if (column) this.$state.set("SOFT_DELETE_FORMAT", column);

    return this;
  }

  /**
   * The "useTimestamp" method is used to assign a timestamp when creating a new record,
   * or updating a record.
   * @param {object} timestampFormat
   * @property {string} timestampFormat.createdAt  - change new name column replace by default [created at]
   * @property {string} timestampFormat.updatedAt - change new name column replace by default updated at
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        this.useTimestamp({
   *           createdAt : 'createdAt',
   *           updatedAt : 'updatedAt'
   *        })
   *     }
   * }
   */
  protected useTimestamp(timestampFormat?: {
    createdAt: string;
    updatedAt: string;
  }): this {
    this.$state.set("TIMESTAMP", true);

    if (timestampFormat) {
      this.$state.set("TIMESTAMP_FORMAT", {
        CREATED_AT: timestampFormat.createdAt,
        UPDATED_AT: timestampFormat.updatedAt,
      });
    }

    return this;
  }

  /**
   * This "useTable" method is used to assign the name of the table.
   * @param {string} table table name in database
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        this.useTable('setTableNameIsUser') // => 'setTableNameIsUser'
   *     }
   * }
   */
  protected useTable(table: string): this {
    this.$state.set("TABLE_NAME", `\`${table.replace(/\`/g, "")}\``);

    return this;
  }

  /**
   * This "useTableSingular" method is used to assign the name of the table with signgular pattern.
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        this.useTableSingular() // => 'user'
   *     }
   * }
   */
  protected useTableSingular(): this {
    const table = this._classToTableName(this.constructor?.name, {
      singular: true,
    });
    this.$state.set("TABLE_NAME", `\`${this._valuePattern(table)}\``);

    return this;
  }

  /**
   * This "useTablePlural " method is used to assign the name of the table with pluarl pattern
   * @returns {this} this
   * @example
   * class User extends Model {
   *     constructor() {
   *        this.useTablePlural() // => 'users'
   *     }
   * }
   */
  protected useTablePlural(): this {
    const table = this._classToTableName(this.constructor?.name);
    this.$state.set("TABLE_NAME", `\`${this._valuePattern(table)}\``);

    return this;
  }

  /**
   * This 'useValidationSchema' method is used to validate the schema when have some action create or update.
   * @param {Object<ValidateSchema>} schema types (String Number and Date)
   * @returns {this} this
   * @example
   * class User extends Model {
   *   constructor() {
   *     this.useValidationSchema({
   *      id : Number,
   *       uuid :  Number,
   *       name : {
   *           type : String,
   *           require : true
   *           // json : true,
   *           // enum : ["1","2","3"]
   *      },
   *      email : {
   *           type : String,
   *           require : true,
   *           length : 199,
   *           match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
   *           unique : true,
   *           fn : async (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
   *       },
   *       createdAt : Date,
   *       updatedAt : Date,
   *       deletedAt : Date
   *    })
   *  }
   * }
   */
  protected useValidationSchema(schema?: TValidateSchema): this {
    this.$state.set("VALIDATE_SCHEMA", true);
    this.$state.set("VALIDATE_SCHEMA_DEFINED", schema);
    return this;
  }

  /**
   * This 'useValidateSchema' method is used to validate the schema when have some action create or update.
   * @param {Object<ValidateSchema>} schema types (String Number and Date)
   * @returns {this} this
   * @example
   * class User extends Model {
   *   constructor() {
   *     this.useValidationSchema({
   *       id : Number,
   *       uuid :  string,
   *       name : {
   *           type : String,
   *           require : true
   *      },
   *      email : {
   *           type : String,
   *           require : true,
   *           length : 199,
   *           // json : true,
   *           // enum : ["1","2","3"]
   *           match: /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
   *           unique : true,
   *           fn : async (email : string) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
   *       },
   *       createdAt : Date,
   *       updatedAt : Date,
   *       deletedAt : Date
   *    })
   *  }
   * }
   */
  protected useValidateSchema(schema?: TValidateSchema): this {
    return this.useValidationSchema(schema);
  }

  /**
   * The "useHooks" method is used to assign hook function when execute returned results to callback function.
   * @param {Function[]} arrayFunctions functions for callback result
   * @returns {this} this
   * @example
   * class User extends Model {
   *   constructor() {
   *     this.useHook([(results) => console.log(results)])
   *   }
   * }
   */
  protected useHooks(arrayFunctions: Function[]): this {
    for (const func of arrayFunctions) {
      if (typeof func !== "function")
        throw this._assertError(`this 'function' is not a function`);
      this.$state.set("HOOKS", [...this.$state.get("HOOKS"), func]);
    }

    return this;
  }

  /**
   * The "beforeCreatingTable" method is used exection function when creating the table.
   * @param {Function} fn functions for executing before creating the table
   * @returns {this} this
   * @example
   * class User extends Model {
   *   constructor() {
   *     this.beforeCreatingTable(async () => {
   *         await new User()
   *          .create({
   *            ...columns
   *          })
   *          .save()
   *      })
   *   }
   * }
   */
  protected beforeCreatingTable(fn: () => Promise<any>): this {
    if (!(fn instanceof Function))
      throw this._assertError(`This '${fn}' is not a function.`);

    this.$state.set("BEFORE_CREATING_TABLE", fn);

    return this;
  }

  /**
   * The "whenCreatingTable" method is used exection function when creating the table.
   * @param {Function} fn functions for executing when creating the table
   * @returns {this} this
   * @example
   * class User extends Model {
   *   constructor() {
   *     this.whenCreatingTable(async () => {
   *         await new User()
   *          .create({
   *            ...columns
   *          })
   *          .save()
   *      })
   *   }
   * }
   */
  protected whenCreatingTable(fn: () => Promise<any>): this {
    if (!(fn instanceof Function))
      throw this._assertError(`This '${fn}' is not a function.`);

    this.$state.set("BEFORE_CREATING_TABLE", fn);

    return this;
  }

  /**
   * exceptColumns for method except
   * @override
   * @returns {promise<string>} string
   */
  protected async exceptColumns(): Promise<string[]> {
    const excepts = this.$state.get("EXCEPTS");
    const hasDot = excepts.some((except: string) => /\./.test(except));
    const names = excepts
    .map((except: string) => {
      if (/\./.test(except)) return except.split(".")[0];
      return null;
    })
    .filter(Boolean) as string[];

    const tableNames = names.length
      ? [...new Set(names)]
      : [this.$state.get("TABLE_NAME")];

    const removeExcepts: string[][] = [];

    const schemaColumns = this.getSchemaModel();

    for (const tableName of tableNames) {
      const isHasSchema = [
        schemaColumns != null,
        tableName.replace(/`/g, "") ===
          this.$state.get("TABLE_NAME").replace(/`/g, ""),
      ].every((d) => d);

      if (isHasSchema) {
        const columns = Object.keys(schemaColumns as Record<string, Blueprint>);
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
        continue;
      }

      const columns = await this.getColumns();

      const removeExcept = columns.map(v=> v.Field).filter((column: string) => {
        return excepts.every((except: string) => {
          if (/\./.test(except)) {
            const [table, _] = except.split(".");
            return except !== `${table}.${column}`;
          }
          return except !== column;
        });
      });
      removeExcepts.push(
        hasDot ? removeExcept.map((r) => `\`${tableName}\`.${r}`) : removeExcept
      );
    }

    return removeExcepts.flat();
  }

  /**
   * Build  method for relation in model
   * @param    {string} name name relation registry in your model
   * @param    {Function} callback query callback
   * @returns   {this}   this
   */
  protected buildMethodRelation<
    K extends T.RelationKeys<this>
  >(name: K, callback?: Function): this {
    this.relations(name);

    const relation: TRelationOptions<K> = this.$state
      .get("RELATIONS")
      .find((v: { name: string }) => v.name === name);

    if (relation == null) {
      throw this._assertError(
        `This Relation '${String(name)}' not be register in Model '${
          this.constructor?.name
        }'.`
      );
    }

    const relationHasExists = Object.values(
      this.$constants("RELATIONSHIP")
    )?.includes(relation.relation);

    if (!relationHasExists) {
      throw this._assertError(
        `Unknown relationship in '${this.$constants("RELATIONSHIP")}'.`
      );
    }

    if (callback == null) {
      relation.query = new relation.model();
      return this;
    }

    relation.query = callback(new relation.model());

    return this;
  }

  /**
   * The 'audit' method is used to sets the audit information for the tracking.
   *
   * @param {number} userId - The ID of the user performing the audit.
   * @param {Record<string, any>} [metadata] - Optional metadata to store with the audit.
   * @returns {this} this
   */
  audit (userId: number , metadata ?: Record<string,any>): this {
    if(metadata) this.$state.set("AUDIT_METADATA",metadata);

    this.$state.set("AUDIT",userId);

    return this;
  }

  meta(meta: "MAIN" | "SUBORDINATE") {
    this.$state.set("META", meta);
    return this;
  }

  /**
   * The 'typeOfSchema' method is used get type of schema.
   * @returns {TS} type of schema
   */
  typeOfSchema(): TS {
    return {} as TS;
  }

  /**
   * The 'typeOfRelation' method is used get type of relation.
   * @returns {TR} type of Relation
   */
  typeOfRelation(): TR {
    return {} as TR;
  }

  /**
   * The 'cache' method is used get data from cache.
   * @param {Object}  object
   * @property {string} key key of cache
   * @property {number} expires ms
   * @returns {this} this
   */
  cache({ key, expires }: { key: string; expires: number }): this {
    this.$state.set("CACHE", {
      key,
      expires,
    });

    return this;
  }

  /**
   *
   * @override
   * @param {string[]} ...columns
   * @returns {this} this
   */
  select<K extends T.ColumnKeys<this> | '*'>(...columns: K[]): this {
    if (!columns.length) {
      this.$state.set("SELECT", ["*"]);
      return this;
    }

    let select: string[] = columns.map((c) => {
      const column = String(c);

      if (column.includes(this.$constants("RAW"))) {
        return column?.replace(this.$constants("RAW"), "").replace(/'/g, "");
      }

      const virtualColumn = this._getBlueprintByKey(column, {
        mapQuery: true,
      });

      if (virtualColumn) {
        const sql = virtualColumn.sql?.select;
        if (sql == null) return this.bindColumn(column);

        if (sql.toLowerCase().includes(" as ")) {
          return sql;
        }

        return `${sql} ${this.$constants("AS")} ${column}`;
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

  addSelect<K extends T.ColumnKeys<this>>(...columns: K[]): this {

    let select: string[] = columns.map((c) => {
      const column = String(c);

      if (column.includes(this.$constants("RAW"))) {
        return column?.replace(this.$constants("RAW"), "").replace(/'/g, "");
      }

      return this.bindColumn(column);
    });

    this.$state.set("ADD_SELECT", [...select,...this.$state.get("ADD_SELECT")]);

    return this
  }

  /**
   *
   * @override
   * @param {...string} columns
   * @returns {this} this
   */
  hidden<K extends T.ColumnKeys<this>>(...columns: K[]): this {
    this.$state.set("HIDDEN", columns);
    return this;
  }

  /**
   *
   * @override
   * @param {...string} columns
   * @returns {this} this
   */
  except<K extends T.ColumnKeys<this>>(
    ...columns: K[]
  ): this {
    if (!columns.length) return this;

    const exceptColumns = this.$state.get("EXCEPTS");

    this.$state.set("EXCEPTS", [...columns, ...exceptColumns]);

    return this;
  }

  /**
   *
   * @override
   * @returns {this} this
   */
  exceptTimestamp(): this {
    let excepts: string[] = [];

    if (this.$state.get("SOFT_DELETE")) {
      const deletedAt: string = this._valuePattern(
        this.$state.get("SOFT_DELETE_FORMAT")
      );
      excepts = [...excepts, deletedAt];
    }

    const updatedAt: string = this._valuePattern(
      this.$state.get("TIMESTAMP_FORMAT").UPDATED_AT
    );
    const createdAt: string = this._valuePattern(
      this.$state.get("TIMESTAMP_FORMAT").CREATED_AT
    );

    excepts = [...excepts, createdAt, updatedAt];

    const exceptColumns = this.$state.get("EXCEPTS");

    this.$state.set("EXCEPTS", [...excepts, ...exceptColumns]);

    return this;
  }

  /**
   *
   * @override
   * @param {string} column
   * @param {string?} order by default order = 'asc' but you can used 'asc' or  'desc'
   * @returns {this}
   */
  orderBy<K extends T.ColumnKeys<this>>(
    column: K,
    order: "ASC" | "asc" | "DESC" | "desc" = "ASC"
  ): this {
    const virtualColumn = this._getBlueprintByKey(String(column), {
      mapQuery: true,
    });

    if (virtualColumn) {
      const sql = virtualColumn.sql?.where;

      if (sql) {
        this.$state.set("ORDER_BY", [
          ...this.$state.get("ORDER_BY"),
          `${sql} ${order.toUpperCase()}`,
        ]);

        return this;
      }
    }

    const orderBy = [column]
      .map((c: string) => {
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

    return this;
  }

  /**
   *
   * @override
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  latest<K extends T.ColumnKeys<this>>(
    ...columns: K[]
  ): this {
    let orderBy = "`id`";

    if (columns?.length) {
      orderBy = columns
        .map((c: string) => {
          if (/\./.test(c)) return this.bindColumn(c.replace(/'/g, ""));

          if (c.includes(this.$constants("RAW")))
            return c?.replace(this.$constants("RAW"), "");

          const virtualColumn = this._getBlueprintByKey(c, {
            mapQuery: true,
          });

          if (virtualColumn) {
            const sql = virtualColumn.sql?.orderBy;

            if (sql) return sql;
          }

          return this.bindColumn(c);
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
   *
   * @override
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  oldest<K extends T.ColumnKeys<this>>(
    ...columns: K[]
  ): this {
    let orderBy = "`id`";

    if (columns?.length) {
      orderBy = columns
        .map((c: string) => {
          if (/\./.test(c)) return this.bindColumn(c.replace(/'/g, ""));
          if (c.includes(this.$constants("RAW")))
            return c?.replace(this.$constants("RAW"), "");

          const virtualColumn = this._getBlueprintByKey(c, {
            mapQuery: true,
          });

          if (virtualColumn) {
            const sql = virtualColumn.sql?.orderBy;

            if (sql) return sql;
          }

          return this.bindColumn(c);
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
   *
   * @override
   * @param {string?} columns [column=id]
   * @returns {this}
   */
  groupBy<K extends T.ColumnKeys<this>>(
    ...columns: K[]
  ): this {
    let groupBy = "id";

    if (columns?.length) {
      groupBy = columns
        .map((c: string) => {
          if (/\./.test(c)) return this.bindColumn(c.replace(/'/g, ""));
          if (c.includes(this.$constants("RAW")))
            return c?.replace(this.$constants("RAW"), "");

          const virtualColumn = this._getBlueprintByKey(c, {
            mapQuery: true,
          });

          if (virtualColumn) {
            const sql = virtualColumn.sql?.groupBy;

            if (sql) return sql;
          }

          return this.bindColumn(c);
        })
        .join(", ");
    }

    this.$state.set("GROUP_BY", [...this.$state.get("GROUP_BY"), `${groupBy}`]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @returns {string} return table.column
   */
  bindColumn(column: string, pattern = true): string {
    if (!/\./.test(column)) {
      if (column === "*") return "*";

      const c = pattern ? this._valuePattern(column) : column;
      const alias = this.$state.get("ALIAS");

      return [
        alias == null || alias === ""
          ? `\`${this.getTableName().replace(/`/g, "")}\``
          : `\`${alias.replace(/`/g, "")}\``,
        ".",
        `\`${c.replace(/`/g, "")}\``,
      ].join("");
    }

    let [table, c] = column.split(".");

    c = pattern ? this._valuePattern(c) : c;

    if (c === "*") {
      return `\`${table.replace(/`/g, "")}\`.*`;
    }

    return `\`${table.replace(/`/g, "")}\`.\`${c.replace(/`/g, "")}\``;
  }

  /**
   *
   * @override
   * The 'makeSelectStatement' method is used to make select statement.
   * @returns {Promise<string>} string
   */
  async makeSelectStatement(): Promise<string> {
    const schemaModel = this.getSchemaModel();

    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("SELECT")}`,
        `${columns.join(", ")}`,
        `${this.$constants("FROM")}`,
        `\`${this.getTableName()}\``,
      ].join(" ");
    };

    if (schemaModel == null) {
      const schemaTable = await this.getSchema();
      const columns = schemaTable.map(
        (column) => `\`${this.getTableName()}\`.\`${column.Field}\``
      );

      return makeStatement(columns);
    }

    const columns = Object.keys(schemaModel).map(
      (column: string) => `\`${this.getTableName()}\`.\`${column}\``
    );

    return makeStatement(columns);
  }

  /**
   *
   * @override
   * The 'makeInsertStatement' method is used to make insert table statement.
   * @returns {Promise<string>} string
   */
  async makeInsertStatement(): Promise<string> {
    const schemaModel = this.getSchemaModel();

    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("INSERT")}`,
        `\`${this.getTableName()}\``,
        `(${columns.join(", ")})`,
        `${this.$constants("VALUES")}`,
        `(${Array(columns.length).fill("`?`").join(" , ")})`,
      ].join(" ");
    };

    if (schemaModel == null) {
      const schemaTable = await this.getSchema();
      const columns = schemaTable.map((column) =>
        this.bindColumn(column.Field)
      );

      return makeStatement(columns);
    }

    const columns = Object.keys(schemaModel).map((column: string) =>
      this.bindColumn(column)
    );

    return makeStatement(columns);
  }

  /**
   *
   * @override
   * The 'makeUpdateStatement' method is used to make update table statement.
   * @returns {Promise<string>} string
   */
  async makeUpdateStatement(): Promise<string> {
    const schemaModel = this.getSchemaModel();

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

    if (schemaModel == null) {
      const schemaTable = await this.getSchema();
      const columns = schemaTable.map(
        (column) => `${this.bindColumn(column.Field)} = '?'`
      );

      return makeStatement(columns);
    }

    const columns = Object.keys(schemaModel).map(
      (column: string) => `${this.bindColumn(column)} = '?'`
    );

    return makeStatement(columns);
  }

  /**
   *
   * @override
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
   * @override
   * The 'makeCreateTableStatement' method is used to make create table statement.
   * @returns {Promise<string>} string
   */
  async makeCreateTableStatement(): Promise<string> {
    const schemaModel = this.getSchemaModel();

    const makeStatement = (columns: string[]) => {
      return [
        `${this.$constants("CREATE_TABLE_NOT_EXISTS")}`,
        `\`${this.getTableName()}\``,
        `(`,
        `\n   ${columns?.join(",\n   ")}`,
        `\n)`,
        `${this.$constants("ENGINE")}`,
      ].join(" ");
    };

    if (schemaModel == null) {
      const columns = await this.showSchema();
      return makeStatement(columns);
    }

    let columns: string[] = [];

    for (const key in schemaModel) {
      const data = schemaModel[key];

      const { type, attributes } = Schema.detectSchema(data);

      if (type == null || attributes == null) continue;

      columns = [...columns, `${key} ${type} ${attributes?.join(" ")}`];
    }

    return makeStatement(columns);
  }

  /**
   *
   * Clone instance of model
   * @param {Model} instance instance of model
   * @returns {this} this
   */
  clone(instance: Model): this {
    const copy = Object.fromEntries(instance.$state.all());

    this.$state.clone(copy);

    return this;
  }

  /**
   *
   * Copy an instance of model
   * @param {Model} instance instance of model
   * @param {Object} options keep data
   * @returns {Model} Model
   */
  copyModel(
    instance: Model,
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
      relations?: boolean;
    }
  ): Model {
    if (!(instance instanceof Model)) {
      throw this._assertError("This instance is not an instanceof Model.");
    }

    const copy = Object.fromEntries(instance.$state.all());

    const newInstance = new Model();

    newInstance.$state.clone(copy);
    newInstance.$state.set("SAVE", "");
    newInstance.$state.set("DEBUG", false);
    newInstance.$state.set("LOGGER", false);
    newInstance.$state.set("AUDIT", null);
    newInstance.$state.set("AUDIT_METADATA", null);
  
    if (options?.relations == null || !options.relations)
      newInstance.$state.set("RELATIONS", []);
    if (options?.insert == null || !options.insert)
      newInstance.$state.set("INSERT", "");
    if (options?.update == null || !options.update)
      newInstance.$state.set("UPDATE", "");
    if (options?.delete == null || !options.delete)
      newInstance.$state.set("DELETE", "");
    if (options?.select == null || !options.select)
      newInstance.$state.set("SELECT", []);
    if (options?.join == null || !options.join)
      newInstance.$state.set("JOIN", []);
    if (options?.where == null || !options.where)
      newInstance.$state.set("WHERE", []);
    if (options?.groupBy == null || !options.groupBy)
      newInstance.$state.set("GROUP_BY", []);
    if (options?.having == null || !options.having)
      newInstance.$state.set("HAVING", "");
    if (options?.orderBy == null || !options.orderBy)
      newInstance.$state.set("ORDER_BY", []);
    if (options?.limit == null || !options.limit)
      newInstance.$state.set("LIMIT", "");
    if (options?.offset == null || !options.offset)
      newInstance.$state.set("OFFSET", "");

    return newInstance;
  }

  /**
   *
   * execute the query using raw sql syntax
   * @override
   * @param {string} sql
   * @returns {this} this
   */
  protected async _queryStatement(
    sql: string,
    { retry = false } = {}
  ): Promise<any[]> {
    try {
      sql = this._queryBuilder({ onFormat : true }).format([sql])

      const getResults = async (sql: string) => {
        if (this.$state.get("DEBUG")) {

          const startTime = +new Date();

          const results = await this.$pool.query(sql);

          const endTime = +new Date();

          this.$utils.consoleDebug(sql,retry);

          this.$state.set("QUERIES", [...this.$state.get("QUERIES"), sql]);

          this.$utils.consoleExec(startTime, endTime);

          return results;
        }

        return await this.$pool.query(sql);
      };

      let result = null;

      if (!this.$state.get("AUDIT") && this.$state.get("LOGGER")) {
        const { Logger } = await import("./Contracts/Logger")
        result = await Logger.tracking(this, { sql, fn: () => getResults(sql) })
      }

      if(this.$state.get("AUDIT")) {
        const { Audit } = await import("./Contracts/Audit")
        result = await Audit.tracking(this, { sql, fn: () => getResults(sql) })
      }

      return result == null ? await getResults(sql) : result;

    } catch (error: any) {
      if (this.$state.get("DEBUG")) this.$utils.consoleDebug(sql);

      if (this.$state.get("JOIN")?.length) throw error;

      const retry = Number(this.$state.get("RETRY"));

      await this._checkSchemaOrNextError(error, retry, error);

      this.$state.set("RETRY", retry + 1);

      return await this._queryStatement(sql, { retry: true });
    }
  }

  /**
   *
   * execute the query using raw sql syntax actions for insert update and delete
   * @override
   * @param {string} sql
   * @returns {this} this
   */
  protected async _actionStatement(sql: string): Promise<any> {
    try {

      sql = this._queryBuilder({ onFormat : true }).format([sql])

      const getResults = async (sql: string) => {
        if (this.$state.get("DEBUG")) {

          const startTime = +new Date();

          const results = await this.$pool.query(sql);
          
          const endTime = +new Date();

          this.$utils.consoleDebug(sql);

          this.$utils.consoleExec(startTime, endTime);

          this.$state.set("QUERIES", [...this.$state.get("QUERIES"), sql]);

          return results;
        }

        return await this.$pool.query(sql);
      };

      let result = null;

      if (!this.$state.get("AUDIT") && this.$state.get("LOGGER")) {
        const { Logger } = await import("./Contracts/Logger")
        result = await Logger.tracking(this, { sql, fn: () => getResults(sql) })
      }

      if(this.$state.get("AUDIT")) {
        const { Audit } = await import("./Contracts/Audit")
        result = await Audit.tracking(this, { sql, fn: () => getResults(sql) })
      }

      return result == null ? await getResults(sql) : result;
      
    } catch (error: unknown) {
      if (this.$state.get("DEBUG")) this.$utils.consoleDebug(sql);

      if (this.$state.get("JOIN")?.length) throw error;

      await this._checkSchemaOrNextError(
        error,
        Number(this.$state.get("RETRY"))
      );

      this.$state.set("RETRY", Number(this.$state.get("RETRY")) + 1);

      return await this._actionStatement(sql);
    }
  }

  /**
   * The 'CTEs' method is used to create common table expressions(CTEs).
   *
   * @override
   * @returns {string} return sql query
   */
  CTEs<M extends Model>(
    as: string,
    callback: (query: M) => M,
    bindModel?: new () => M
  ): this {
    const baseInstance = bindModel
      ? new bindModel()
      : (new Model().from(this.getTableName()) as M);

    const query = callback(baseInstance);

    this.$state.set("CTE", [...this.$state.get("CTE"), `${as} AS (${query})`]);

    return this;
  }

  /**
   * The 'disableSoftDelete' method is used to disable the soft delete.
   *
   * @param {boolean} condition
   * @returns {this} this
   */
  disableSoftDelete(condition: boolean = false): this {
    this.$state.set("SOFT_DELETE", condition);
    return this;
  }

  /**
   * The 'ignoreSoftDelete' method is used to disable the soft delete.
   * @param {boolean} condition
   * @returns {this} this
   */
  ignoreSoftDelete(condition: boolean = false): this {
    this.$state.set("SOFT_DELETE", condition);
    return this;
  }

  /**
   * The 'disableVoid' method is used to disable void.
   *
   * @returns {this} this
   */
  disableVoid(): this {
    this.$state.set("VOID", false);
    return this;
  }

  /**
   * The 'ignoreVoid' method is used to ignore void.
   *
   * @returns {this} this
   */
  ignoreVoid(): this {
    this.$state.set("VOID", false);
    return this;
  }

  /**
   * The 'disabledGlobalScope' method is used to disable globalScope.
   *
   * @returns {this} this
   */
  disabledGlobalScope(condition: boolean = false): this {
    this.$state.set("GLOBAL_SCOPE", condition);
    return this;
  }

  /**
   * The 'ignoreGlobalScope' method is used to disable globalScope.
   *
   * @returns {this} this
   */
  ignoreGlobalScope(condition: boolean = false): this {
    this.$state.set("GLOBAL_SCOPE", condition);
    return this;
  }

  /**
   * Assign build in function to result of data
   * @param {Record} func
   * @returns {this} this
   */
  registry(func: Record<string, Function>): this {
    this.$state.set("REGISTRY", {
      ...func,
      $save: this._save.bind(this),
      $attach: this._attach.bind(this),
      $detach: this._detach.bind(this),
    });

    return this;
  }

  /**
   * The 'with' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
   *
   * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
   * @returns {this} this
   * @example
   *   import { Model , TR } from 'tspace-mysql'
   *
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use 'with' for results of relationship
   *  await new User().with('posts').findMany()
   *
   */
  with<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set(
      "RELATIONS",
      this.$relation.apply(nameRelations, "default")
    );

    return this;
  }

  /**
   * The 'relations' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
   *
   * @param {...string} nameRelations ...name registry in models using (hasOne , hasMany , belongsTo , belongsToMany)
   * @returns {this} this
   * @example
   *   import { Model , TR } from 'tspace-mysql'
   *
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use 'with' for results of relationship
   *  await new User().relations('posts').findMany()
   *
   */
  relations<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    return this.with(...nameRelations);
  }

  /**
   * The 'withAll' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient
   * It's method ignore soft delete
   * @param {...string} nameRelations if data exists return empty
   * @returns {this} this
   */
  withAll<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set("RELATIONS", this.$relation.apply(nameRelations, "all"));

    return this;
  }

  /**
   * The 'relationsAll' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
   *
   * It's method ignore soft delete
   * @param {...string} nameRelations if data exists return empty
   * @returns {this} this
   */
  relationsAll<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    return this.withAll(...nameRelations);
  }

  /**
   * The 'withCount' method is used to eager load related (relations) data and count data in the relation.
   *
   * @param {...string} nameRelations if data exists return 0
   * @returns {this} this
   */
  withCount<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set("RELATIONS", this.$relation.apply(nameRelations, "count"));

    return this;
  }

  /**
   * The 'relationsCount' method is used to eager load related (relations) data and count data in the relation.
   *
   * @param {...string} nameRelations if data exists return 0
   * @returns {this} this
   */
  relationsCount<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set("RELATIONS", this.$relation.apply(nameRelations, "count"));

    return this;
  }

  /**
   * The 'withTrashed' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
   *
   * It's method return results only in trash (soft deleted)
   * @param {...string} nameRelations if data exists return blank
   * @returns {this} this
   */
  withTrashed<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set(
      "RELATIONS",
      this.$relation.apply(nameRelations, "trashed")
    );

    return this;
  }

  /**
   * The 'relationsTrashed' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient.
   *
   * It's method return results only in trash (soft deleted)
   * @param {...string} nameRelations if data exists return blank
   * @returns {this} this
   */
  relationsTrashed<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    return this.withTrashed(...nameRelations);
  }

  /**
   * The 'withExists' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient
   * It's method return only exists result of relation query
   * @param {...string} nameRelations
   * @returns {this} this
   * @example
   *   import { Model } from 'tspace-mysql'
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use with for results of relationship if relations is exists
   *  await new User().withExists('posts').findMany()
   */
  withExists<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set("RELATIONS_EXISTS", true);

    this.$state.set("RELATIONS", this.$relation.apply(nameRelations, "exists"));

    return this;
  }

  /**
   * The 'relationsExists' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient
   * It's method return only exists result of relation query
   * @param {...string} nameRelations
   * @returns {this} this
   * @example
   *   import { Model } from 'tspace-mysql'
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use with for results of relationship if relations is exists
   *  await new User().relationsExists('posts').findMany()
   */
  relationsExists<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    return this.withExists(...nameRelations);
  }

  /**
   * The 'has' method is used to eager load related (relations) data when retrieving records from a database.
   *
   * Eager loading allows you to retrieve a primary model and its related models in a more efficient
   * It's method return only exists result of relation query
   * @param {...string} nameRelations
   * @returns {this} this
   * @example
   *   import { Model } from 'tspace-mysql'
   *   import { TRelationOptions } from '../types';
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use with for results of relationship if relations is exists
   *  await new User().has('posts').findMany()
   */
  has<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    return this.withExists(...nameRelations);
  }

  /**
   * The 'withNotExists' method is used to eager load related (relations)  data when not exists relation from a database.
   *
   * It's method return only not exists result of relation query
   * @param {...string} nameRelations
   * @returns {this} this
   * @example
   *   import { Model } from 'tspace-mysql'
   *   import { pattern } from '../../tests/schema-spec';
   *   import { TRelationOptions } from '../types';
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use with for results of relationship if relations is exists
   *  await new User().withNotExists('posts').findMany()
   */
  withNotExists<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set("RELATIONS_EXISTS", true);

    this.$state.set(
      "RELATIONS",
      this.$relation.apply(nameRelations, "notExists")
    );

    return this;
  }

  /**
   * The 'relationsNotExists' method is used to eager load related (relations)  data when not exists relation from a database.
   *
   * It's method return only not exists result of relation query
   * @param {...string} nameRelations
   * @returns {this} this
   * @example
   *   import { Model } from 'tspace-mysql'
   *   import { pattern } from '../../tests/schema-spec';
   *   import { TRelationOptions } from '../types';
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *  // use with for results of relationship if relations is exists
   *  await new User().relationsNotExists('posts').findMany()
   */
  relationsNotExists<K extends T.RelationKeys<this>>(
    ...nameRelations: K[]
  ): this {
    if (!nameRelations.length) return this;

    this.$state.set("RELATIONS_EXISTS", true);

    this.$state.set(
      "RELATIONS",
      this.$relation.apply(nameRelations, "notExists")
    );

    return this;
  }

  /**
   *
   * The 'withQuery' method is particularly useful when you want to filter or add conditions records based on related data.
   *
   * Use relation '${name}' registry models then return callback queries
   * @param {string} nameRelation name relation in registry in your model
   * @param {function} callback query callback
   * @param {object} options pivot the query
   * @example
   *   import { Model } from 'tspace-mysql'
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *
   *   class Comment extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'users' , model : User })
   *           this.belongsTo({ name : 'post' , model : Post })
   *       }
   *   }
   *
   *   await new User().relations('posts')
   *   .withQuery('posts', (query : Post) => {
   *       return query.relations('comments','user')
   *       .withQuery('comments', (query : Comment) => {
   *           return query.relations('user','post')
   *       })
   *       .withQuery('user', (query : User) => {
   *           return query.relations('posts').withQuery('posts',(query : Post)=> {
   *               return query.relations('comments','user')
   *               // relation n, n, ...n
   *           })
   *       })
   *   })
   *  .findMany()
   * @returns {this} this
   */
  withQuery<
    K extends T.RelationKeys<this>,
    R extends T.Relations<this>,
  >(
    nameRelation: K,
    callback: (
      query: `$${K & string}` extends keyof R
      ? R[`$${K & string}`] extends (infer X)[]
        ? X
        : R[`$${K & string}`] extends Model
          ? R[`$${K & string}`]
          : Model
      : K extends keyof R
        ? R[K] extends (infer X)[]
          ? X
          : R[K] extends Model
            ? R[K]
            : Model
        : Model
  ) => any,
    options: { pivot: boolean } = { pivot: false }
  ): this {
    this.with(nameRelation);

    if (options.pivot) {
      this.$relation.callbackPivot(String(nameRelation), callback);
      return this;
    }

    this.$relation.callback(String(nameRelation), callback);

    return this;
  }

  withQueryExists<
    K extends T.RelationKeys<this>,
    R extends T.Relations<this>,
  >(
    nameRelation: K,
    callback: (
        query: `$${K & string}` extends keyof R
        ? R[`$${K & string}`] extends (infer X)[]
          ? X
          : R[`$${K & string}`] extends Model
            ? R[`$${K & string}`]
            : Model
        : K extends keyof R
          ? R[K] extends (infer X)[]
            ? X
            : R[K] extends Model
              ? R[K]
              : Model
          : Model
    ) => any,
    options: { pivot: boolean } = { pivot: false }
  ): this {
    this.withExists(nameRelation);

    if (options.pivot) {
      this.$relation.callbackPivot(String(nameRelation), callback);
      return this;
    }

    this.$relation.callback(String(nameRelation), callback);

    return this;
  }

  /**
   *
   * The 'relationQuery' method is particularly useful when you want to filter or add conditions records based on related data.
   *
   * Use relation '${name}' registry models then return callback queries
   * @param {string} nameRelation name relation in registry in your model
   * @param {function} callback query callback
   * @param {object} options pivot the query
   * @example
   *   import { Model } from 'tspace-mysql'
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *
   *   class Comment extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'users' , model : User })
   *           this.belongsTo({ name : 'post' , model : Post })
   *       }
   *   }
   *
   *   await new User().relations('posts')
   *   .relationQuery('posts', (query : Post) => {
   *       return query.relations('comments','user')
   *       .relationQuery('comments', (query : Comment) => {
   *           return query.relations('user','post')
   *       })
   *       .relationQuery('user', (query : User) => {
   *           return query.relations('posts').relationsQuery('posts',(query : Post)=> {
   *               return query.relations('comments','user')
   *               // relation n, n, ...n
   *           })
   *       })
   *   })
   *  .findMany()
   * @returns {this} this
   */
  relationQuery<
    K extends T.RelationKeys<this>,
    R extends T.Relations<this>,
  >(
    nameRelation: K,
    callback: (
      query: `$${K & string}` extends keyof R
      ? R[`$${K & string}`] extends (infer X)[]
        ? X
        : R[`$${K & string}`] extends Model
          ? R[`$${K & string}`]
          : Model
      : K extends keyof R
        ? R[K] extends (infer X)[]
          ? X
          : R[K] extends Model
            ? R[K]
            : Model
        : Model
  ) => any,
    options: { pivot: boolean } = { pivot: false }
  ): this {
    return this.withQuery(nameRelation, callback, options);
  }

  /**
   *
   * The 'relationQueryExists' method is particularly useful when you want to filter or add conditions records based on related data.
   *
   * Use relation '${name}' registry models then return callback queries
   * @param {string} nameRelation name relation in registry in your model
   * @param {function} callback query callback
   * @param {object} options pivot the query
   * @example
   *   import { Model } from 'tspace-mysql'
   *   class User extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'posts' , model : Post })
   *       }
   *   }
   *
   *   class Post extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'comments' , model : Comment })
   *           this.belongsTo({ name : 'user' , model : User })
   *       }
   *   }
   *
   *   class Comment extends Model {
   *       constructor(){
   *           super()
   *           this.hasMany({ name : 'users' , model : User })
   *           this.belongsTo({ name : 'post' , model : Post })
   *       }
   *   }
   *
   *   await new User().relations('posts')
   *   .relationQuery('posts', (query : Post) => {
   *       return query.relations('comments','user')
   *       .relationQuery('comments', (query : Comment) => {
   *           return query.relations('user','post')
   *       })
   *       .relationQuery('user', (query : User) => {
   *           return query.relations('posts').relationsQuery('posts',(query : Post)=> {
   *               return query.relations('comments','user')
   *               // relation n, n, ...n
   *           })
   *       })
   *   })
   *  .findMany()
   * @returns {this} this
   */
  relationQueryExists<
    K extends T.RelationKeys<this>,
    R extends T.Relations<this>,
  >(
    nameRelation: K,
    callback: (
      query: `$${K & string}` extends keyof R
        ? R[`$${K & string}`] extends (infer X)[]
          ? X
          : R[`$${K & string}`] extends Model
            ? R[`$${K & string}`]
            : Model
        : K extends keyof R
          ? R[K] extends (infer X)[]
            ? X
            : R[K] extends Model
              ? R[K]
              : Model
          : Model
    ) => any,
    options: { pivot: boolean } = { pivot: false }
  ): this {
    return this.withQueryExists(nameRelation, callback, options);
  }

  /**
   *
   * The 'findWithQuery' method is used to find instance call back from relation.
   *
   * @param {string} name name relation in registry in your model
   * @returns {Model} model instance
   */
  findWithQuery<K extends T.RelationKeys<this>>(
    name: K
  ): Model | null {
    const instance = this.$relation.returnCallback(String(name));

    return instance == null ? null : instance;
  }

  /**
   * The 'hasOne' relationship defines a one-to-one relationship between two database tables.
   *
   * It indicates that a particular record in the primary table is associated with one and only one record in the related table.
   *
   * This is typically used when you have a foreign key in the related table that references the primary table.
   *
   * @param    {object} relations registry relation in your model
   * @property {string} relation.name
   * @property {string} relation.as
   * @property {class}  relation.model
   * @property {string} relation.localKey
   * @property {string} relation.foreignKey
   * @property {string} relation.freezeTable
   * @returns  {this}   this
   */
  protected hasOne<K extends TR extends object ? TRelationKeys<TR> : string>({
    name,
    as,
    model,
    localKey,
    foreignKey,
    freezeTable,
  }: TRelationOptions<K>): this {
    this.$relation.hasOne({
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
    });

    return this;
  }

  /**
   * The 'hasMany' relationship defines a one-to-many relationship between two database tables.
   *
   * It indicates that a record in the primary table can be associated with multiple records in the related table.
   *
   * This is typically used when you have a foreign key in the related table that references the primary table.
   *
   * @param    {object} relations registry relation in your model
   * @property {string} relation.name
   * @property {string} relation.as
   * @property {class}  relation.model
   * @property {string} relation.localKey
   * @property {string} relation.foreignKey
   * @property {string} relation.freezeTable
   * @returns   {this}   this
   */
  protected hasMany<K extends TR extends object ? TRelationKeys<TR> : string>({
    name,
    as,
    model,
    localKey,
    foreignKey,
    freezeTable,
  }: TRelationOptions<K>): this {
    this.$relation.hasMany({
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
    });

    return this;
  }

  /**
   * The 'belongsTo' relationship defines a one-to-one or many-to-one relationship between two database tables.
   *
   * It indicates that a record in the related table belongs to a single record in the primary table.
   *
   * This is typically used when you have a foreign key in the primary table that references the related table.
   *
   * @param    {object} relations registry relation in your model
   * @property {string} relation.name
   * @property {string} relation.as
   * @property {class}  relation.model
   * @property {string} relation.localKey
   * @property {string} relation.foreignKey
   * @property {string} relation.freezeTable
   * @returns   {this}   this
   */
  protected belongsTo<K extends TR extends object ? TRelationKeys<TR> : string>({
    name,
    as,
    model,
    localKey,
    foreignKey,
    freezeTable,
  }: TRelationOptions<K>): this {
    this.$relation.belongsTo({
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
    });

    return this;
  }

  /**
   * The 'belongsToMany' relationship defines a many-to-many relationship between two database tables.
   *
   * It indicates that records in both the primary table and the related table can be associated
   * with multiple records in each other's table through an intermediate table.
   *
   * This is commonly used when you have a many-to-many relationship between entities, such as users and roles or products and categories.
   * @param    {object} relations registry relation in your model
   * @property {string} relation.name
   * @property {string} relation.as
   * @property {class}  relation.model
   * @property {string} relation.localKey
   * @property {string} relation.foreignKey
   * @property {string} relation.freezeTable freeae table name
   * @property {string} relation.pivot table name of pivot
   * @property {string} relation.oldVersion return value of old version
   * @property {class?} relation.modelPivot model for pivot
   * @returns  {this}   this
   */
  protected belongsToMany<K extends TR extends object ? TRelationKeys<TR> : string>({
    name,
    as,
    model,
    localKey,
    foreignKey,
    freezeTable,
    pivot,
    oldVersion,
    modelPivot,
  }: TRelationOptions<K>): this {
    this.$relation.belongsToMany({
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
      pivot,
      oldVersion,
      modelPivot,
    });

    return this;
  }

  /**
   * The 'belongsToManySingle' relationship defines a many-to-many relationship between two database tables.
   * But return object
   *
   * It indicates that records in both the primary table and the related table can be associated
   * with multiple records in each other's table through an intermediate table.
   *
   * This is commonly used when you have a many-to-many relationship between entities, such as users and roles or products and categories.
   * @param    {object} relations registry relation in your model
   * @property {string} relation.name
   * @property {string} relation.as
   * @property {class}  relation.model
   * @property {string} relation.localKey
   * @property {string} relation.foreignKey
   * @property {string} relation.freezeTable freeae table name
   * @property {string} relation.pivot table name of pivot
   * @property {string} relation.oldVersion return value of old version
   * @property {class?} relation.modelPivot model for pivot
   * @returns  {this}   this
   */
  protected belongsToManySingle<K extends TR extends object ? TRelationKeys<TR> : string>({
    name,
    as,
    model,
    localKey,
    foreignKey,
    freezeTable,
    pivot,
    oldVersion,
    modelPivot,
  }: TRelationOptions<K>): this {
    this.$relation.belongsToManySingle({
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
      pivot,
      oldVersion,
      modelPivot,
    });

    return this;
  }

  /**
   * The 'hasOneBuilder' method is useful for creating 'hasOne' relationship to function
   *
   * @param    {object}  relation registry relation in your model
   * @type     {object}  relation
   * @property {class}   model
   * @property {string?} name
   * @property {string?} as
   * @property {string?} localKey
   * @property {string?} foreignKey
   * @property {string?} freezeTable
   * @param    {Function?} callback callback of query
   * @returns  {this} this
   */
  protected hasOneBuilder(
    {
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
    }: TRelationQueryOptions,
    callback?: Function
  ): this {
    this.$relation.hasOneBuilder(
      {
        name,
        as,
        model,
        localKey,
        foreignKey,
        freezeTable,
      },
      callback
    );

    return this;
  }

  /**
   * The 'hasManyBuilder' method is useful for creating 'hasMany' relationship to function
   *
   * @param    {object}  relation registry relation in your model
   * @type     {object}  relation
   * @property {class}   model
   * @property {string?} name
   * @property {string?} as
   * @property {string?} localKey
   * @property {string?} foreignKey
   * @property {string?} freezeTable
   * @param    {function?} callback callback of query
   * @returns  {this} this
   */
  protected hasManyBuilder(
    {
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
    }: TRelationQueryOptions,
    callback?: Function
  ): this {
    this.$relation.hasManyBuilder(
      {
        name,
        as,
        model,
        localKey,
        foreignKey,
        freezeTable,
      },
      callback
    );

    return this;
  }

  /**
   * The 'belongsToBuilder' method is useful for creating 'belongsTo' relationship to function
   * @param    {object}  relation registry relation in your model
   * @type     {object}  relation
   * @property {class}   model
   * @property {string?} name
   * @property {string?} as
   * @property {string?} localKey
   * @property {string?} foreignKey
   * @property {string?} freezeTable
   * @param    {function?} callback callback of query
   * @returns  {this} this
   */
  protected belongsToBuilder(
    {
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
    }: TRelationQueryOptions,
    callback?: Function
  ): this {
    this.$relation.belongsToBuilder(
      {
        name,
        as,
        model,
        localKey,
        foreignKey,
        freezeTable,
      },
      callback
    );

    return this;
  }

  /**
   * The 'belongsToManyBuilder' method is useful for creating 'belongsToMany' relationship to function
   *
   * @param    {object}  relation registry relation in your model
   * @type     {object}  relation
   * @property {class}   model
   * @property {string?} name
   * @property {string?} as
   * @property {string?} localKey
   * @property {string?} foreignKey
   * @property {string?} freezeTable
   * @param    {function?} callback callback of query
   * @returns  {this} this
   */
  protected belongsToManyBuilder(
    {
      name,
      as,
      model,
      localKey,
      foreignKey,
      freezeTable,
      pivot,
      oldVersion,
      modelPivot,
    }: TRelationQueryOptions,
    callback?: Function
  ): this {
    this.$relation.belongsToManyBuilder(
      {
        name,
        as,
        model,
        localKey,
        foreignKey,
        freezeTable,
        pivot,
        oldVersion,
        modelPivot,
      },
      callback
    );

    return this;
  }

  /**
   * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
   *
   * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
   * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
   * @returns {this} this
   */
  onlyTrashed(): this {
    this.disableSoftDelete();

    const column = this._valuePattern(this.$state.get("SOFT_DELETE_FORMAT"));

    this.whereNotNull(column);

    return this;
  }

  /**
   * The 'trashed' method is used to specify that you want to retrieve only the soft-deleted records from a database table.
   *
   * Soft deleting is a feature that allows you to mark records as deleted without physically removing them from the database. Instead,
   * a special "deleted_at" timestamp column is set to a non-null value to indicate that the record has been deleted.
   * @returns {this} this
   */
  trashed(): this {
    return this.onlyTrashed();
  }

  /**
   * restore data in trashed
   * @returns {promise}
   */
  async restore(): Promise<T.Result<this>[]> {
    this.disableSoftDelete();

    const updatedAt: string = this._valuePattern(
      this.$state.get("TIMESTAMP_FORMAT").UPDATED_AT
    );

    const deletedAt: string = this._valuePattern(
      this.$state.get("SOFT_DELETE_FORMAT")
    );

    const query = this.$state.get("TIMESTAMP")
      ? `${deletedAt} = NULL , ${updatedAt} = '${this.$utils.timestamp()}'`
      : `${deletedAt} = NULL`;

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `SET ${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "UPDATE");

    return (await this.save()) as T.Result<this>[];
  }

  /**
   *
   * @returns {string} string
   */
  toTableName(): string {
    return this.getTableName();
  }

  /**
   *
   * @param {string} column
   * @returns {string} string
   */
  toTableNameAndColumn(column: string): string {
    return `\`${this.getTableName()}\`.\`${this._valuePattern(column)}\``;
  }

  /**
   * @override
   * @param {string | K} column if arguments is object
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this} this
   */
  where<K extends T.ColumnKeys<this>>(
    column: K | Record<string, any>,
    operator?: any,
    value?: any
  ): this {
    if (typeof column === "object") {
      return this.whereObject(column as any);
    }

    [value, operator] = this.$utils.valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.covertDateToDateString(value);

    value = this.$utils.escape(value);

    value = this.$utils.covertBooleanToNumber(value);

    const virtualColumn = this._getBlueprintByKey(String(column), {
      mapQuery: true,
    });

    if (virtualColumn) {
      const sql = virtualColumn.sql?.where;

      if (sql) {
        if (value === null) {
          return this.whereRaw(`${sql} ${this.$constants("IS_NULL")}`);
        }

        if (Array.isArray(value)) {
          const values = value
            ? `${value
                .map((value: string) =>
                  this.$utils.checkValueHasRaw(this.$utils.escape(value))
                )
                .join(",")}`
            : this.$constants(this.$constants("NULL"));

          return this.whereRaw(`${sql} ${this.$constants("IN")} (${values})`);
        }

        return this.whereRaw(`${sql} ${operator} '${value}'`);
      }
    }

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
        `${this.$utils.checkValueHasRaw(value)}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this}
   */
  orWhere<K extends T.ColumnKeys<this>>(
    column: K,
    operator?: any,
    value?: any
  ): this {
    [value, operator] = this.$utils.valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);

    value = this.$utils.covertBooleanToNumber(value);

    value = this.$utils.covertDateToDateString(value);

    const virtualColumn = this._getBlueprintByKey(String(column), {
      mapQuery: true,
    });

    if (virtualColumn) {
      const sql = virtualColumn.sql?.where;

      if (sql) {
        if (value === null) {
          return this.orWhereRaw(`${sql} ${this.$constants("IS_NULL")}`);
        }

        if (Array.isArray(value)) {
          const values = value
            ? `${value
                .map((value: string) =>
                  this.$utils.checkValueHasRaw(this.$utils.escape(value))
                )
                .join(",")}`
            : this.$constants(this.$constants("NULL"));

          return this.orWhereRaw(`${sql} ${this.$constants("IN")} (${values})`);
        }

        return this.orWhereRaw(`${sql} ${operator} '${value}'`);
      }
    }

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
        `${this.$utils.checkValueHasRaw(value)}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {number} day
   * @returns {this}
   */
  whereDay<K extends T.ColumnKeys<this>>(column: K, day: number): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `DAY(${this.bindColumn(String(column))})`,
        `=`,
        `'${`00${this.$utils.escape(day)}`.slice(-2)}'`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {number} month
   * @returns {this}
   */
  whereMonth<K extends T.ColumnKeys<this>>(column: K, month: number): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `MONTH(${this.bindColumn(String(column))})`,
        `=`,
        `'${`00${this.$utils.escape(month)}`.slice(-2)}'`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {number} year
   * @returns {this}
   */
  whereYear<K extends T.ColumnKeys<this>>(column: K, year: number): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `YEAR(${this.bindColumn(String(column))})`,
        `=`,
        `'${`0000${this.$utils.escape(year)}`.slice(-4)}'`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {Object} columns
   * @returns {this}
   */
  whereObject<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    columns: { [P in K & keyof T]: T[P] }
  ): this {
    for (let column in columns) {
      const operator = "=";

      //@ts-ignore
      const value = this.$utils.escape(columns[column]);

      const c = String(column);

      if (value === null) {
        this.whereNull(column);
        continue;
      }

      const useOp = this.$utils.checkValueHasOp(value);

      if (useOp == null) {
        this.where(column, operator, value);
        continue;
      }

      switch (useOp.op) {
       
        case "IN": {
          this.whereIn(
            c,
            Array.isArray(useOp.value) 
            ? useOp.value : useOp.value.split(",").map(v => Number.isNaN(+v) ? `${v}` 
            : +v)
          );
          break;
        }

        case "|IN": {
          this.orWhereIn(
            c,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "QUERY": {
          this.whereSubQuery(c, useOp.value);
          break;
        }

        case "!QUERY": {
          this.orWhereSubQuery(c, useOp.value);
          break;
        }

        case "NOT IN": {
          this.whereNotIn(
            c,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "|NOT IN": {
          this.orWhereNotIn(
            c,
            Array.isArray(useOp.value) ? useOp.value : useOp.value.split(",")
          );
          break;
        }

        case "IS NULL": {
          this.whereNull(c);
          break;
        }

        case "|IS NULL": {
          this.orWhereNull(c);
          break;
        }

        case "IS NOT NULL": {
          this.whereNotNull(c);
          break;
        }

        case "|IS NOT NULL": {
          this.orWhereNotNull(c);
          break;
        }

        default: {
          if (useOp.op.includes("|")) {
            this.orWhere(c, useOp.op.replace("|", ""), useOp.value);
            break;
          }

          this.where(c, useOp.op, useOp.value);
        }
      }
    }

    return this;
  }

  /**
   * @override
   * @param    {string} column
   * @param    {object}  property object { key , value , operator }
   * @property {string}  property.key
   * @property {string}  property.value
   * @property {string?} property.operator
   * @returns   {this}
   */
  whereJSON<K extends T.ColumnKeys<this>>(
    column: K,
    { key, value, operator }: { key: string; value: string; operator?: string }
  ): this {
    value = this.$utils.escape(value);

    value = this.$utils.covertBooleanToNumber(value);

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}->>'$.${key}'`,
        `${operator == null ? "=" : operator.toLocaleUpperCase()}`,
        `${this.$utils.checkValueHasRaw(value)}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param    {string} column
   * @param    {object}  property object { key , value , operator }
   * @property {string}  property.key
   * @property {string}  property.value
   * @property {string?} property.operator
   * @returns   {this}
   */
  whereJson<K extends T.ColumnKeys<this>>(
    column: K,
    { key, value, operator }: { key: string; value: string; operator?: string }
  ): this {
    return this.whereJSON(column, { key, value, operator });
  }

  /**
   * @override
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
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} sql
   * @returns {this}
   */
  whereExists(sql: string | Model): this {
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
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereIn<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    const values = array.length
      ? `${array
          .map((value: string) =>
            this.$utils.checkValueHasRaw(this.$utils.escape(value))
          )
          .join(",")}`
      : this.$constants(this.$constants("NULL"));

    const virtualColumn = this._getBlueprintByKey(String(column), {
      mapQuery: true,
    });

    if (virtualColumn) {
      const sql = virtualColumn.sql?.where;

      if (sql) {
        return this.whereRaw(`${sql} ${this.$constants("IN")} (${values})`);
      }
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("IN")}`,
        `(${values})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereIn<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    const values = array.length
      ? `${array
          .map((value: string) =>
            this.$utils.checkValueHasRaw(this.$utils.escape(value))
          )
          .join(",")}`
      : this.$constants(this.$constants("NULL"));

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("IN")}`,
        `(${values})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereNotIn<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) return this;

    const values = `${array
      .map((value: string) =>
        this.$utils.checkValueHasRaw(this.$utils.escape(value))
      )
      .join(",")}`;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("NOT_IN")}`,
        `(${values})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereNotIn<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) return this;

    const values = `${array
      .map((value: string) =>
        this.$utils.checkValueHasRaw(this.$utils.escape(value))
      )
      .join(",")}`;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("NOT_IN")}`,
        `(${values})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  whereSubQuery<K extends T.ColumnKeys<this>>(
    column: K,
    subQuery: string | Model,
    options: {
      operator?: (typeof CONSTANTS)["EQ"] | (typeof CONSTANTS)["IN"];
    } = { operator: CONSTANTS["IN"] }
  ): this {
    if (subQuery instanceof Model && !subQuery.$state.get("SELECT").length) {
      subQuery.select("id");
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        options.operator,
        `(${subQuery})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  whereNotSubQuery<K extends T.ColumnKeys<this>>(
    column: K,
    subQuery: string | Model,
    options: {
      operator?: (typeof CONSTANTS)["NOT_EQ"] | (typeof CONSTANTS)["NOT_IN"];
    } = { operator: CONSTANTS["NOT_IN"] }
  ): this {
    if (subQuery instanceof Model && !subQuery.$state.get("SELECT").length) {
      subQuery.select("id");
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        options.operator,
        `(${subQuery})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  orWhereSubQuery<K extends T.ColumnKeys<this>>(
    column: K,
    subQuery: string | Model,
    options: {
      operator?: (typeof CONSTANTS)["EQ"] | (typeof CONSTANTS)["IN"];
    } = { operator: CONSTANTS["IN"] }
  ): this {
    if (subQuery instanceof Model && !subQuery.$state.get("SELECT").length) {
      subQuery.select("id");
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        options.operator,
        `(${subQuery})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string} subQuery
   * @returns {this}
   */
  orWhereNotSubQuery<K extends T.ColumnKeys<this>>(
    column: K,
    subQuery: string | Model,
    options: {
      operator?: (typeof CONSTANTS)["NOT_EQ"] | (typeof CONSTANTS)["NOT_IN"];
    } = { operator: CONSTANTS["NOT_IN"] }
  ): this {
    if (subQuery instanceof Model && !subQuery.$state.get("SELECT").length) {
      subQuery.select("id");
    }

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        options.operator,
        `(${subQuery})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereBetween<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
          `${this.bindColumn(String(column))}`,
          `${this.$constants("BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ]
          .join(" ")
          .replace(/^\s+/, ""),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("BETWEEN")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value2))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereBetween<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
          `${this.bindColumn(String(column))}`,
          `${this.$constants("BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ]
          .join(" ")
          .replace(/^\s+/, ""),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("BETWEEN")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value2))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  whereNotBetween<K extends T.ColumnKeys<this>>(column: K, array: any[]): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
          `${this.bindColumn(String(column))}`,
          `${this.$constants("NOT_BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ]
          .join(" ")
          .replace(/^\s+/, ""),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("NOT_BETWEEN")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value2))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {array} array
   * @returns {this}
   */
  orWhereNotBetween<K extends T.ColumnKeys<this>>(
    column: K,
    array: any[]
  ): this {
    if (!Array.isArray(array)) array = [array];

    if (!array.length) {
      this.$state.set("WHERE", [
        ...this.$state.get("WHERE"),
        [
          this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
          `${this.bindColumn(String(column))}`,
          `${this.$constants("NOT_BETWEEN")}`,
          `${this.$constants(this.$constants("NULL"))}`,
          `${this.$constants("AND")}`,
          `${this.$constants(this.$constants("NULL"))}`,
        ]
          .join(" ")
          .replace(/^\s+/, ""),
      ]);

      return this;
    }

    const [value1, value2] = array;

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("NOT_BETWEEN")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value1))}`,
        `${this.$constants("AND")}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value2))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @returns {this}
   */
  whereNull<K extends T.ColumnKeys<this>>(column: K): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("IS_NULL")}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @returns {this}
   */
  orWhereNull<K extends T.ColumnKeys<this>>(column: K): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("IS_NULL")}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @returns {this}
   */
  whereNotNull<K extends T.ColumnKeys<this>>(column: K): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("IS_NOT_NULL")}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @returns {this}
   */
  orWhereNotNull<K extends T.ColumnKeys<this>>(column: K): this {
    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("OR")}` : "",
        `${this.bindColumn(String(column))}`,
        `${this.$constants("IS_NOT_NULL")}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string?} operator = < > != !< !>
   * @param {any?} value
   * @returns {this}
   */
  whereSensitive<K extends T.ColumnKeys<this>>(
    column: K,
    operator?: any,
    value?: any
  ): this {
    [value, operator] = this.$utils.valueAndOperator(
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
        `${this.bindColumn(String(column))}`,
        `${operator}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string?} operator = < > != !< !>
   * @param {any?} value
   * @returns {this}
   */
  whereStrict<K extends T.ColumnKeys<this>>(
    column: K,
    operator?: any,
    value?: any
  ): this {
    [value, operator] = this.$utils.valueAndOperator(
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
        `${this.bindColumn(String(column))}`,
        `${operator}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string} column
   * @param {string?} operator = < > != !< !>
   * @param {any?} value
   * @returns {this}
   */
  orWhereSensitive<K extends T.ColumnKeys<this>>(
    column: K,
    operator?: any,
    value?: any
  ): this {
    [value, operator] = this.$utils.valueAndOperator(
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
        `${this.bindColumn(String(column))}`,
        `${operator}`,
        `${this.$utils.checkValueHasRaw(this.$utils.escape(value))}`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * The 'whereHas' method is used to checks if a relationship exists.
   * Only get the parent models where the related model(s) match a given condition.
   * 
   * @param {string} nameRelation
   * @param {model} callback callback query
   * @returns {this}
   */
  whereHas<
    K extends T.RelationKeys<this>,
    R extends T.Relations<this>
  >(nameRelation: K,
    callback: (
      query: `$${K & string}` extends keyof R
      ? R[`$${K & string}`] extends (infer X)[]
      ? X
      : R[`$${K & string}`] extends Model
          ? R[`$${K & string}`]
          : Model
      : K extends keyof R
      ? R[K] extends (infer X)[]
          ? X
          : R[K] extends Model
          ? R[K]
          : Model
      : Model
    ) => any,
  ): this {
    const sql = this.$relation.getSqlExists(nameRelation as string, callback);

    if (sql == null) return this;

    this.whereExists(sql);

    return this;
  }

  /**
   * The 'whereNotHas' method is used to checks if a relationship not exists.
   * 
   * @param {string} nameRelation
   * @param {model} callback callback query
   * @returns {this}
   */
  whereNotHas<
    K extends T.RelationKeys<this>,
    R extends T.Relations<this>
  >(nameRelation: K,
    callback: (
      query: `$${K & string}` extends keyof R
      ? R[`$${K & string}`] extends (infer X)[]
      ? X
      : R[`$${K & string}`] extends Model
          ? R[`$${K & string}`]
          : Model
      : K extends keyof R
      ? R[K] extends (infer X)[]
          ? X
          : R[K] extends Model
          ? R[K]
          : Model
      : Model
    ) => any,
  ): this {
    const sql = this.$relation.getSqlExists(nameRelation as string, callback);

    if (sql == null) return this;

    this.whereNotExists(sql);

    return this;
  }

  /**
   * @override
   * @param {Function} callback callback query
   * @returns {this}
   */
  whereQuery<
    T extends Model,
    M = T extends this ? this : T extends Model ? T : this
  >(callback: (query: M) => M): this {
    const copy = new Model().copyModel(this) as M;

    const repository = callback(copy);

    if (repository instanceof Promise)
      throw this._assertError(
        'The "whereQuery" method is not supported a Promise'
      );

    if (!(repository instanceof Model))
      throw this._assertError(`Unknown callback query: '${repository}'`);

    const where: string[] = repository?.$state.get("WHERE") || [];

    if (!where.length) return this;

    const query: string = where.join(" ");

    this.$state.set("WHERE", [
      ...this.$state.get("WHERE"),
      [
        this.$state.get("WHERE").length ? `${this.$constants("AND")}` : "",
        `(${query})`,
      ]
        .join(" ")
        .replace(/^\s+/, ""),
    ]);

    return this;
  }

  /**
   * @override
   * @param {string[]} columns
   * @param {string?} operator ['=', '<', '>' ,'!=', '!<', '!>' ,'LIKE']
   * @param {any?} value
   * @returns {this}
   */
  whereAny<K extends T.ColumnKeys<this>>(
    columns: K[],
    operator?: any,
    value?: any
  ): this {
    [value, operator] = this.$utils.valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);

    value = this.$utils.covertBooleanToNumber(value);

    this.whereQuery((query: Model) => {
      for (const index in columns) {
        const column = String(columns[index]);

        if (+index === 0) {
          query.where(this.bindColumn(column), operator, value);
          continue;
        }
        query.orWhere(this.bindColumn(column), operator, value);
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
  whereAll<K extends T.ColumnKeys<this>>(
    columns: K[],
    operator?: any,
    value?: any
  ): this {
    [value, operator] = this.$utils.valueAndOperator(
      value,
      operator,
      arguments.length === 2
    );

    value = this.$utils.escape(value);

    value = this.$utils.covertBooleanToNumber(value);

    this.whereQuery((query: Model) => {
      for (const key in columns) {
        const column = String(columns[key]);
        query.where(this.bindColumn(column), operator, value);
      }
      return query;
    });

    return this;
  }

  /**
   * The 'when' method is used to specify if condition should be true will be next to the actions
   *
   * @override
   * @param {string | number | undefined | null | Boolean} condition when condition true will return query callback
   * @returns {this} this
   */
  when<
    T extends Model | unknown,
    M = T extends this ? this : T extends Model ? T : this
  >(
    condition: string | number | undefined | null | boolean,
    callback: (query: M) => M
  ): this {
    if (!condition) return this;

    const cb = callback(this as unknown as M);

    if (cb instanceof Promise)
      throw new Error("'when' does not support Promises");

    return this;
  }

  /**
   * This 'union' method is used to union statement sql
   *
   * @override
   * @param {string} sql
   * @returns {this} this
   */
  union(sql: string | Model): this {
    this.$state.set("UNION", [...this.$state.get("UNION"), `${sql}`]);

    return this;
  }

  /**
   * This 'union' method is used to union statement sql
   *
   * @override
   * @param {string} sql
   * @returns {this} this
   */
  unionAll(sql: string | Model): this {
    this.$state.set("UNION_ALL", [...this.$state.get("UNION_ALL"), `${sql}`]);

    return this;
  }

  /**
   * The 'joinModel' method is used to perform a join operation between two Models.
   *
   * Joins are used to combine data from different tables based on a specified condition, allowing you to retrieve data from related tables in a single query.
   *
   * @param   {TModelConstructorOrObject} m1  main Model
   * @param   {TModelConstructorOrObject} m2 reference Model
   * @returns {this}
   */
  joinModel(
    m1: TModelConstructorOrObject | ((join: JoinModel) => JoinModel),
    m2?: TModelConstructorOrObject
  ): this {
    if (typeof m1 === "function" && !this._isModel(m1)) {
      const cb = m1 as unknown as Function;

      const callback = cb(new JoinModel(this, "INNER_JOIN"));

      this.$state.set("JOIN", [
        ...this.$state.get("JOIN"),
        callback["toString"](),
      ]);

      return this;
    }

    if (m2 == null) return this;

    const {
      alias1,
      alias2,
      table1,
      table2,
      model1,
      model2,
      localKey,
      foreignKey,
    } = this._handleJoinModel(
      m1 as unknown as TModelConstructorOrObject,
      m2 as unknown as TModelConstructorOrObject
    );

    this.join(
      `${alias1 === "" ? table1 : `${table1}|${alias1}`}.${localKey}`,
      `${alias2 === "" ? table2 : `${table2}|${alias2}`}.${foreignKey}`
    );

    if (
      model1["$state"].get("MODEL_NAME") !== this["$state"].get("MODEL_NAME")
    ) {
      this.whereNull(
        `${alias1 === "" ? table1 : alias1}.${model1["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    if (model2["$state"].get("SOFT_DELETE")) {
      this.whereNull(
        `${alias2 === "" ? table2 : alias2}.${model2["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    return this;
  }

  /**
   * The 'rightJoinModel' method is used to perform a join operation between two Models.
   *
   * A right join, also known as a right outer join, retrieves all rows from the right table and the matching rows from the left table.
   *
   * If there is no match in the left table, NULL values are returned for columns from the left table
   * @param   {TModelConstructorOrObject} m1  main Model
   * @param   {TModelConstructorOrObject} m2  reference Model
   * @returns {this}
   */
  rightJoinModel(
    m1: TModelConstructorOrObject | ((join: JoinModel) => JoinModel),
    m2?: TModelConstructorOrObject
  ): this {
    if (typeof m1 === "function" && !this._isModel(m1)) {
      const cb = m1 as unknown as Function;

      const callback = cb(new JoinModel(this, "RIGHT_JOIN"));

      this.$state.set("JOIN", [
        ...this.$state.get("JOIN"),
        callback["toString"](),
      ]);

      return this;
    }

    if (m2 == null) return this;

    const {
      alias1,
      alias2,
      table1,
      table2,
      model1,
      model2,
      localKey,
      foreignKey,
    } = this._handleJoinModel(
      m1 as unknown as TModelConstructorOrObject,
      m2 as unknown as TModelConstructorOrObject
    );

    this.rightJoin(
      `${alias1 === "" ? table1 : `${table1}|${alias1}`}.${localKey}`,
      `${alias2 === "" ? table2 : `${table2}|${alias2}`}.${foreignKey}`
    );

    if (
      model1["$state"].get("MODEL_NAME") !== this["$state"].get("MODEL_NAME")
    ) {
      this.whereNull(
        `${alias1 === "" ? table1 : alias1}.${model1["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    if (model2["$state"].get("SOFT_DELETE")) {
      this.whereNull(
        `${alias2 === "" ? table2 : alias2}.${model2["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    return this;
  }

  /**
   * The 'leftJoinModel' method is used to perform a left join operation between two database tables.
   *
   * A left join retrieves all rows from the left table and the matching rows from the right table.
   *
   * If there is no match in the right table, NULL values are returned for columns from the right table.
   * @param   {TModelConstructorOrObject} m1  main Model
   * @param   {TModelConstructorOrObject} m2  reference Model
   * @returns {this}
   */
  leftJoinModel(
    m1: TModelConstructorOrObject | ((join: JoinModel) => JoinModel),
    m2?: TModelConstructorOrObject
  ): this {
    if (typeof m1 === "function" && !this._isModel(m1)) {
      const cb = m1 as unknown as Function;

      const callback = cb(new JoinModel(this, "LEFT_JOIN"));

      this.$state.set("JOIN", [
        ...this.$state.get("JOIN"),
        callback["toString"](),
      ]);

      return this;
    }

    if (m2 == null) return this;

    const {
      alias1,
      alias2,
      table1,
      table2,
      model1,
      model2,
      localKey,
      foreignKey,
    } = this._handleJoinModel(
      m1 as unknown as TModelConstructorOrObject,
      m2 as unknown as TModelConstructorOrObject
    );

    this.leftJoin(
      `${alias1 === "" ? table1 : `${table1}|${alias1}`}.${localKey}`,
      `${alias2 === "" ? table2 : `${table2}|${alias2}`}.${foreignKey}`
    );

    if (
      model1["$state"].get("MODEL_NAME") !== this["$state"].get("MODEL_NAME")
    ) {
      this.whereNull(
        `${alias1 === "" ? table1 : alias1}.${model1["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    if (model2["$state"].get("SOFT_DELETE")) {
      this.whereNull(
        `${alias2 === "" ? table2 : alias2}.${model2["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    return this;
  }

  /**
   * The 'crossJoinModel' method performs a cross join operation between two or more tables.
   *
   * A cross join, also known as a Cartesian join, combines every row from the first table with every row from the second table.
   *
   * @param   {TModelConstructorOrObject} m1  main Model
   * @param   {TModelConstructorOrObject} m2  reference Model
   * @returns {this}
   */
  crossJoinModel(
    m1: TModelConstructorOrObject | ((join: JoinModel) => JoinModel),
    m2?: TModelConstructorOrObject
  ): this {
    if (typeof m1 === "function" && !this._isModel(m1)) {
      const cb = m1 as unknown as Function;

      const callback = cb(new JoinModel(this, "CROSS_JOIN"));

      this.$state.set("JOIN", [
        ...this.$state.get("JOIN"),
        callback["toString"](),
      ]);

      return this;
    }

    if (m2 == null) return this;

    const {
      alias1,
      alias2,
      table1,
      table2,
      model1,
      model2,
      localKey,
      foreignKey,
    } = this._handleJoinModel(
      m1 as unknown as TModelConstructorOrObject,
      m2 as unknown as TModelConstructorOrObject
    );

    this.crossJoin(
      `${alias1 === "" ? table1 : `${table1}|${alias1}`}.${localKey}`,
      `${alias2 === "" ? table2 : `${table2}|${alias2}`}.${foreignKey}`
    );

    if (
      model1["$state"].get("MODEL_NAME") !== this["$state"].get("MODEL_NAME")
    ) {
      this.whereNull(
        `${alias1 === "" ? table1 : alias1}.${model1["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    if (model2["$state"].get("SOFT_DELETE")) {
      this.whereNull(
        `${alias2 === "" ? table2 : alias2}.${model2["$state"].get(
          "SOFT_DELETE_FORMAT"
        )}`
      );
    }

    return this;
  }

  private _handleJoinModel(
    m1: TModelConstructorOrObject,
    m2: TModelConstructorOrObject
  ) {
    let model1: Model = typeof m1 === "object" ? new m1.model() : new m1();
    let model2: Model = typeof m2 === "object" ? new m2.model() : new m2();
    let localKey: string =
      typeof m1 === "object"
        ? m1.key != null && m1.key !== ""
          ? String(m1.key)
          : ""
        : "";
    let foreignKey: string =
      typeof m2 === "object"
        ? m2.key != null && m2.key !== ""
          ? String(m2.key)
          : ""
        : "";
    let alias1: string =
      typeof m1 === "object"
        ? m1.alias != null && m1.alias !== ""
          ? m1.alias
          : ""
        : "";
    let alias2: string =
      typeof m2 === "object"
        ? m2.alias != null && m2.alias !== ""
          ? m2.alias
          : ""
        : "";

    if (alias1 !== "") {
      if (
        model1["$state"].get("MODEL_NAME") === this["$state"].get("MODEL_NAME")
      ) {
        this.alias(alias1);
      }
      model1.alias(alias1);
    }

    if (alias2 !== "") {
      model2.alias(alias2);
    }

    const table1 = model1.getTableName();
    const table2 = model2.getTableName();

    localKey = localKey === "" || localKey == null ? "id" : localKey;

    foreignKey =
      foreignKey === "" || foreignKey == null
        ? model2["_valuePattern"](`${pluralize.singular(table1)}_id`)
        : foreignKey;

    return {
      table1,
      table2,
      model1,
      model2,
      alias1,
      alias2,
      localKey,
      foreignKey,
    };
  }

  /**
   * @override
   * @returns {promise<boolean>} promise boolean
   */
  async delete(): Promise<boolean> {
    this._guardWhereCondition();

    this.limit(1);

    if (this.$state.get("SOFT_DELETE")) {
      const deletedAt = this._valuePattern(
        this.$state.get("SOFT_DELETE_FORMAT")
      );

      const sql = new Model()
        .copyModel(this, { where: true, limit: true })
        .update({
          [deletedAt]: this.$utils.timestamp(),
        })
        .bind(this.$pool.get())
        .debug(this.$state.get("DEBUG"))
        .toString();

      const result = await this._actionStatement(sql);

      const r = Boolean(this._resultHandler(!!result || false));

      await this._observer(r, "updated");

      return r;
    }

    this.$state.set(
      "DELETE",
      [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );

    const result = await this._actionStatement(this._queryBuilder().remove());

    const r = Boolean(this._resultHandler(!!result || false));

    await this._observer(r, "deleted");

    return r;
  }

  /**
   * @override
   * @returns {promise<boolean>} promise boolean
   */
  async deleteMany(): Promise<boolean> {
    this._guardWhereCondition();

    if (this.$state.get("SOFT_DELETE")) {
      const deletedAt = this._valuePattern(
        this.$state.get("SOFT_DELETE_FORMAT")
      );

      const sql = new Model()
        .copyModel(this, { where: true, limit: true })
        .debug(this.$state.get("DEBUG"))
        .bind(this.$pool.get())
        .updateMany({
          [deletedAt]: this.$utils.timestamp(),
        })
        .toString();

      const result = await this._actionStatement(sql);

      const r = Boolean(this._resultHandler(!!result || false));

      await this._observer(r, "updated");

      return r;
    }

    this.$state.set(
      "DELETE",
      [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );

    const result = await this._actionStatement(this._queryBuilder().remove());

    const r = Boolean(this._resultHandler(!!result || false));

    await this._observer(r, "deleted");

    return r;
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
    this.disableSoftDelete();

    this.$state.set(
      "DELETE",
      [
        `${this.$constants("DELETE")}`,
        `${this.$constants("FROM")}`,
        `${this.$state.get("TABLE_NAME")}`,
      ].join(" ")
    );

    const result = await this._actionStatement(this._queryBuilder().remove());

    if (result) return Boolean(this._resultHandler(!!result || false));

    return Boolean(this._resultHandler(!!result || false));
  }

  /**
   *
   * @override
   * @param {object} options
   * @property {boolean} options.latest
   * @property {boolean} options.oldest
   * @returns {string} return sql query
   */
  toString({
    latest = false,
    oldest = false,
  }: {
    latest?: boolean;
    oldest?: boolean;
  } = {}): string {
    if (oldest) {
      const queries = this.getQueries();
      return queries[0] ?? this.toString();
    }

    if (latest) {
      const queries = this.getQueries();
      return queries[queries.length - 1] ?? this.toString();
    }

    const sql = this._queryBuilder().any();

    return this._resultHandler(sql);
  }

  /**
   *
   * @override
   * @param {object} options
   * @property {boolean} options.latest
   * @property {boolean} options.oldest
   * @returns {string} return sql query
   */
  toSQL({
    latest = false,
    oldest = false,
  }: {
    latest?: boolean;
    oldest?: boolean;
  } = {}): string {
    return this.toString({ latest, oldest });
  }

  /**
   * @override
   * @param {string=} column [column=id]
   * @returns {promise<Array>}
   */
  async toArray<K extends T.ColumnKeys<this> | "id">(
    column?: K
  ): Promise<any[]> {
    if (column == null) column = "id" as K;

    this.selectRaw(`${this.bindColumn(column as string)}`);

    const sql: string = this._queryBuilder().select();

    const result: any[] = await this._queryStatement(sql);

    const toArray: any[] = result.map(
      (data: Record<string, any>) => data[column]
    );

    return this._resultHandler(toArray);
  }

  /**
   *
   * @override
   * @returns {promise<boolean>}
   */
  async exists(): Promise<boolean> {
    const sql = new Model()
      .copyModel(this, { where: true, limit: true, join: true })
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

    return Boolean(this._resultHandler(!!result[0]?.aggregate || false));
  }

  /**
   *
   * @override
   * @param {Function?} cb callback function return query sql
   * @returns {promise<Record<string,any> | null>} Record | null
   */
  async first<K>(cb?: Function): Promise<T.Result<this,K> | null> {

    this._validateMethod("first");

    if (this.$state.get("VOID")) return this._resultHandler(undefined);

    if (this.$state.get("EXCEPTS")?.length)
      this.select(...((await this.exceptColumns()) as any[]));

    this.limit(1);

    let sql = this._queryBuilder().select();

    if (this.$state.get("RELATIONS_EXISTS"))
      sql = String(this.$relation.loadExists());

    if (cb) {
      const callbackSql = cb(sql);

      if (callbackSql == null || callbackSql === "") {
        throw this._assertError("Please provide a callback for execution");
      }
      sql = callbackSql;
    }

    return await this._execute({
      sql,
      type: "FIRST",
    });
  }

  /**
   * @override
   * @param {Function?} cb callback function return query sql
   * @returns {promise<Record<string,any> | null>} Record | null
   */
  async findOne<K>(cb?: Function): Promise<T.Result<this,K> | null> {
    return await this.first(cb);
  }

  /**
   * @override
   * @returns {promise<object | Error>} Record | throw error
   */
  async firstOrError<K>(
    message?: string,
    options?: Record<string, any>
  ): Promise<T.Result<this,K>> {
    this._validateMethod("firstOrError");

    if (this.$state.get("EXCEPTS")?.length)
      this.select(...((await this.exceptColumns()) as any[]));

    this.limit(1);

    let sql = this._queryBuilder().select();

    if (this.$state.get("RELATIONS_EXISTS"))
      sql = String(this.$relation.loadExists());

    return await this._execute({
      sql,
      type: "FIRST_OR_ERROR",
      message: message == null ? "The data does not exist." : message,
      options,
    });
  }

  /**
   *
   * @override
   * @returns {promise<T.Result<this>>} Record | throw error
   */
  async findOneOrError<K>(
    message?: string,
    options?: Record<string, any>
  ): Promise<T.Result<this,K>> {
    return await this.firstOrError(message, options);
  }
  /**
   *
   * @override
   * @param {Function?} cb callback function return query sql
   * @returns {promise<array>} Array
   */
  async get<K>(cb?: Function): Promise<T.Result<this,K>[]> {
    this._validateMethod("get");

    if (this.$state.get("VOID")) return [];

    if (this.$state.get("EXCEPTS")?.length)
      this.select(...((await this.exceptColumns()) as any[]));

    let sql = this._queryBuilder().select();

    if (this.$state.get("RELATIONS_EXISTS"))
      sql = String(this.$relation.loadExists());

    if (cb) {
      const callbackSql = cb(sql);
      if (callbackSql == null || callbackSql === "") {
        throw this._assertError("Please provide a callback for execution");
      }

      sql = callbackSql;
    }

    return await this._execute({
      sql,
      type: "GET",
    });
  }

  /**
   *
   * @override
   * @param {Function?} cb callback function return query sql
   * @returns {promise<array>} Array
   */
  async findMany<K>(cb?: Function): Promise<T.Result<this,K>[]> {
    return await this.get(cb);
  }
  /**
   * @override
   * @param    {object?} paginationOptions by default page = 1 , limit = 15
   * @property {number} paginationOptions.limit
   * @property {number} paginationOptions.page
   * @returns  {promise<Pagination>} Pagination
   */
  async pagination<K>(paginationOptions?: {
    limit?: number;
    page?: number;
    alias?: boolean;
  }): Promise<T.ResultPaginate<this,K>> {
    this._validateMethod("pagination");

    let limit = 15;
    let page = 1;

    if (paginationOptions != null) {
      limit = this.$utils.softNumber(paginationOptions?.limit || limit);
      page = this.$utils.softNumber(paginationOptions?.page || page);
    }

    if (this.$state.get("EXCEPTS")?.length)
      this.select(...((await this.exceptColumns()) as any[]));

    const offset = (page - 1) * limit;

    this.$state.set("PAGE", page);

    this.limit(limit);

    this.offset(offset);

    let sql = this._queryBuilder().select();

    if (this.$state.get("RELATIONS_EXISTS"))
      sql = String(this.$relation.loadExists());

    return await this._execute({
      sql,
      type: "PAGINATION",
    });
  }

  /**
   *
   * @override
   * @param     {?object} paginationOptions by default page = 1 , limit = 15
   * @property  {number}  paginationOptions.limit
   * @property  {number}  paginationOptions.page
   * @returns   {promise<Pagination>} Pagination
   */
  async paginate<K>(paginationOptions?: {
    limit?: number;
    page?: number;
    alias?: boolean;
  }): Promise<T.ResultPaginate<this,K>> {
    return await this.pagination(paginationOptions);
  }

  /**
   * @override
   * @param {string} column
   * @example
   *  const results = await new Post()
   * .getGroupBy('user_id')
   *
   *  // you can find with user id in the results
   *  const postsByUserId1 = results.get(1)
   * @returns {Promise<object>} Object binding with your column pairs
   */
  async getGroupBy<K, C extends T.ColumnKeys<this>>(
    column: C
  ): Promise<
    Map<string | number,T.Result<this,K>[]>
  > {
    if (this.$state.get("EXCEPTS")?.length)
      this.select(...((await this.exceptColumns()) as any[]));

    const results = await new Model()
      .copyModel(this, {
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

    const grouping = await new Model()
      .copyModel(this, {
        relations: true,
      })
      .whereIn(this.$state.get("PRIMARY_KEY"), ids)
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
   * @override
   * @param {string} column
   * @example
   *  const results = await new Post()
   * .getGroupBy('user_id')
   *
   *  // you can find with user id in the results
   *  const postsByUserId1 = results.get(1)
   * @returns {Promise<object>} Object binding with your column pairs
   */
  async findGroupBy<K, C extends T.ColumnKeys<this>>(
    column: C
  ): Promise<
    Map<string | number,T.Result<this,K>[]>
  > {
    return await this.getGroupBy(column);
  }

  /**
   * @override
   * @param {object} data for insert
   * @returns {this} this
   */
  insert<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] }
  ): this {
    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    this.$state.set("DATA", data);

    const query = this._queryInsertModel(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `\`${this.getTableName()}\``,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "INSERT");

    return this;
  }

  /**
   * @override
   * @param {object} data for insert
   * @returns {this} this
   */
  create<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] }
  ): this {
    return this.insert(data);
  }

  /**
   * @override
   * @param {object} data
   * @param {array?} updateNotExists options for except update some records in your ${data}
   * @returns {this} this
   */
  update<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
    updateNotExists: T.ColumnKeys<this>[] = []
  ): this {
    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    if (updateNotExists.length) {
      for (const c of updateNotExists) {
        for (const column in data) {
          if (c !== column) continue;
          //@ts-ignore
          const value = this.$utils.escape(data[column])

          data = {
            ...data,
            [column]: this._updateHandler(column, value as any),
          };

          break;
        }
      }
    }

    this.$state.set("DATA", data);

    this.limit(1);

    const query = this._queryUpdateModel(data);

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
   * @override
   * @param {object} data
   * @param {array?} updateNotExists options for except update some records in your ${data}
   * @returns {this} this
   */
  updateMany<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
    updateNotExists: string[] = []
  ): this {
    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    if (updateNotExists.length) {
      for (const c of updateNotExists) {
        for (const column in data) {
          if (c !== column) continue;
          //@ts-ignore
          const value = data[column];
          data = {
            ...data,
            [column]: this._updateHandler(column, value as any),
          };
          break;
        }
      }
    }

    this.$state.set("DATA", data);

    const query = this._queryUpdateModel(data);

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
   * @override
   * @param {object} data
   * @returns {this} this
   */
  updateNotExists<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    this.limit(1);

    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    for (const column in data) {
      //@ts-ignore
      const value = data[column];
      data = {
        ...data,
        [column]: this._updateHandler(column, value as any),
      };
    }

    this.$state.set("DATA", data);

    const query = this._queryUpdateModel(data);

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
   * @override
   * @param {object} data for update or create
   * @returns {this} this
   */
  updateOrCreate<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    this.limit(1);

    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    const queryUpdate: string = this._queryUpdateModel(data);

    const queryInsert: string = this._queryInsertModel(data);

    this.$state.set("DATA", data);

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
   * @override
   * @param {object} data for update or create
   * @returns {this} this
   */
  updateOrInsert<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    return this.updateOrCreate(data);
  }

  /**
   * @override
   * @param {object} data for update or create
   * @returns {this} this
   */
  insertOrUpdate<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    return this.updateOrCreate(data);
  }

  /**
   * @override
   * @param {object} data for update or create
   * @returns {this} this
   */
  createOrUpdate<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    return this.updateOrCreate(data);
  }

  /**
   * @override
   * @param {object} data for create
   * @returns {this} this
   */
  createOrSelect<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    this.$state.set("DATA", data);

    const queryInsert: string = this._queryInsertModel(data);

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
   * @override
   * @param {object} data for update or create
   * @returns {this} this
   */
  insertOrSelect<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    return this.createOrSelect(data);
  }

  /**
   *
   * @override
   * @param {object} data create not exists data
   * @returns {this} this
   */
  createNotExists<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    if (!Object.keys(data).length) {
      throw this._assertError("This method must require at least 1 argument.");
    }

    this.$state.set("DATA", data);

    const query: string = this._queryInsertModel(data);

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
   *
   * @override
   * @param {object} data create not exists data
   * @returns {this} this this
   */
  insertNotExists<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] },
  ): this {
    return this.createNotExists(data);
  }

  /**
   * @override
   * @param {Record<string,any>[]} data create multiple data
   * @returns {this} this this
   */
  createMultiple<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] }[]
  ): this {
    if (!Array.isArray(data) || !data.length) {
      throw this._assertError("This method must require a non-empty array.");
    }

    this.$state.set("DATA", data);

    const query = this._queryInsertMultipleModel(data);

    this.$state.set(
      "INSERT",
      [
        `${this.$constants("INSERT")}`,
        `\`${this.getTableName()}\``,
        `${query}`,
      ].join(" ")
    );

    this.$state.set("SAVE", "INSERT_MULTIPLE");

    return this;
  }

  /**
   *
   * @override
   * @param {Record<string,any>[]} data create multiple data
   * @returns {this} this
   */
  createMany<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] }[]
  ): this {
    return this.createMultiple(data);
  }

  /**
   *
   * @override
   * @param {Record<string,any>[]} data create multiple data
   * @returns {this} this
   */
  insertMultiple<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] }[]
  ): this {
    return this.createMultiple(data);
  }

  /**
   *
   * @override
   * @param {Record<string,any>[]} data create multiple data
   * @returns {this} this
   */
  insertMany<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    data: { [P in K & keyof T]: T[P] }[]
  ): this {
    return this.createMultiple(data);
  }

  /**
   *
   * @override
   * @param {{when : Object , columns : Object}[]} cases update multiple data specific columns by cases update
   * @property {Record<string,string | number | boolean | null | undefined>}  cases.when
   * @property {Record<string,string | number | boolean | null | undefined>}  cases.columns
   * @returns {this} this
   */
  updateMultiple<K extends T.ColumnKeys<this>, T extends T.Columns<this>>(
    cases: {
      when   : { [P in K & keyof T]: T[P] };
      columns: { [P in K & keyof T]: T[P] };
    }[]
  ): this {
    if (!cases.length) {
      throw this._assertError("This method must require a non-empty array.");
    }

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

    if (this.$state.get("TIMESTAMP")) {
      const updatedAt: string = this._valuePattern(
        this.$state.get("TIMESTAMP_FORMAT").UPDATED_AT
      );
      columns[updatedAt] = [];
      updateColumns[updatedAt] = [
        this.$constants("RAW"),
        this.$constants("CASE"),
        `${this.$constants("ELSE")} ${this.bindColumn(updatedAt)}`,
        this.$constants("END"),
      ];
    }

    for (let i = cases.length - 1; i >= 0; i--) {
      const c = cases[i] as unknown as {
        when: Record<string, any>;
        columns: Record<string, any>;
      };

      if (c.when == null || !Object.keys(c.when).length) {
        throw this._assertError(
          `This 'when' property is missing some properties.`
        );
      }

      if (c.columns == null || !Object.keys(c.columns).length) {
        throw this._assertError(
          `This 'columns' property is missing some properties.`
        );
      }

      const when = Object.entries(c.when).map(([key, value]) => {
        value = this.$utils.escape(value);
        value = this.$utils.covertBooleanToNumber(value);
        return `${this.bindColumn(key)} = '${value}'`;
      });

      if (this.$state.get("TIMESTAMP")) {
        const updatedAt: string = this._valuePattern(
          this.$state.get("TIMESTAMP_FORMAT").UPDATED_AT
        );
        c.columns[updatedAt] =
          c.columns[updatedAt] === undefined
            ? this.$utils.timestamp()
            : this.$utils.covertDateToDateString(c.columns[updatedAt]);
      }

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
          : this.$utils.checkValueHasRaw(value)
      }`;
    });

    const query = `${this.$constants("SET")} ${keyValue.join(", ")}`;

    this.$state.set("DATA", columns);

    this.$state.set(
      "UPDATE",
      [
        `${this.$constants("UPDATE")}`,
        `${this.$state.get("TABLE_NAME")}`,
        `${query}`,
      ].join(" ")
    );

    this.whereRaw("1");

    this.$state.set("SAVE", "UPDATE");

    return this;
  }

  /**
   * The 'getSchemaModel' method is used get a schema model
   * @returns {Record<string, Blueprint> | null} Record<string, Blueprint> | null
   */
  getSchemaModel(): Record<string, Blueprint> | null {
    if (this.$schema == null) return this.$state.get("SCHEMA_TABLE");
    return this.$schema;
  }

  /**
   * The 'validation' method is used validate the column by validating
   * @param {ValidateSchema} schema
   * @returns {this} this
   */
  validation(schema?: TValidateSchema): this {
    this.$state.set("VALIDATE_SCHEMA", true);
    this.$state.set("VALIDATE_SCHEMA_DEFINED", schema);
    return this;
  }

  /**
   * The 'bindPattern' method is used to covert column relate with pattern
   * @param {string} column
   * @returns {string} return table.column
   */
  bindPattern(column: string): string {
    return this._valuePattern(column);
  }

  /**
   * @override
   * @returns {Promise<Record<string,any> | any[] | null | undefined>}
   */
  async save({ waitMs = 0 } = {}): Promise<any> {
    this._validateMethod("save");

    this.$state.set("AFTER_SAVE", waitMs);

    switch (String(this.$state.get("SAVE"))) {
      case "INSERT":
        return await this._insertModel();
      case "UPDATE":
        return await this._updateModel();
      case "INSERT_MULTIPLE":
        return await this._createMultipleModel();
      case "INSERT_NOT_EXISTS":
        return await this._insertNotExistsModel();
      case "UPDATE_OR_INSERT":
        return await this._updateOrInsertModel();
      case "INSERT_OR_SELECT":
        return await this._insertOrSelectModel();
      default:
        throw this._assertError(`Unknown this [${this.$state.get("SAVE")}]`);
    }
  }

  /**
   *
   * @override
   * @param {number} rows number of rows
   * @param {Function} callback function will be called data and index
   * @returns {promise<void>}
   */
  async faker<K>(
    rows: number,
    callback?: (results: T.Result<this,K>, index: number) => T.Result<this,K>
  ): Promise<void> {
    if (
      this.$state.get("TABLE_NAME") === "" ||
      this.$state.get("TABLE_NAME") == null
    ) {
      throw this._assertError("Unknow table.");
    }

    const schemaModel = this.getSchemaModel();

    const fields: Array<{ Field: string; Type: string }> =
      schemaModel == null
        ? await this.getSchema()
        : Object.entries(schemaModel)
            .map(([key, value]) => {
              return {
                Field: key,
                Type: value.type,
              };
            })
            .filter((v) => v != null);

    const fakers: any[] = [];

    const deletedAt = this._valuePattern(this.$state.get("SOFT_DELETE_FORMAT"));

    const uuid = this.$state.get("UUID_FORMAT");

    const passed = (field: string) =>
      ["id", "_id", deletedAt].some((p) => field === p);

    for (let row = 0; row < rows; row++) {
      let columnAndValue: Record<string, any> = {};

      for (const { Field: field, Type: type } of fields) {
        if (passed(field)) continue;

        const virtualColumn = this._getBlueprintByKey(field, {
          mapQuery: true,
          schemaColumns: schemaModel
        });

        if (virtualColumn) continue;

        columnAndValue = {
          ...columnAndValue,
          [field]:
            field === uuid
              ? this.$utils.faker("uuid")
              : this.$utils.faker(type),
        };
      }

      if (callback) {
        fakers.push(callback(columnAndValue as T.Result<this,K>, row));
        continue;
      }

      fakers.push(columnAndValue);
    }

    const chunkedData = this.$utils.chunkArray([...fakers], 1000);

    const promises: Function[] = [];

    const table = this.getTableName();

    for (const data of chunkedData) {
      promises.push(() => {
        return new DB()
          .from(table)
          .debug(this.$state.get("DEBUG"))
          .createMultiple([...data])
          .void()
          .save();
      });
    }

    await Promise.all(promises.map((v) => v()));

    return;
  }

  /**
   * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
   * @type     {object}  options
   * @property {boolean} options.force - forec always check all columns if not exists will be created
   * @property {boolean} options.log   - show log execution with sql statements
   * @property {boolean} options.foreign - check when has a foreign keys will be created
   * @property {boolean} options.changed - check when column is changed attribute will be change attribute
   * @property {boolean} options.index - add index to column
   * @returns {Promise<void>}
   */
  async sync({
    force = false,
    foreign = false,
    changed = false,
    index = false,
  } = {}): Promise<void> {
    return await new Schema()["syncExecute"]({
      models: [this],
      force,
      foreign,
      changed,
      index,
      log: this.$state.get("DEBUG"),
    });
  }

  /**
   * Builds model templates for CLI generation.
   *
   * @async
   * @function buildModelTemplate
   * @param {Object} [options={}] - The build options.
   * @param {boolean} [options.decorator] - Whether to include decorators in the generated model template.
   * @param {string} [options.env] - Environment name to load configuration from.
   * @returns {Promise<Array<{ model: string, template: string }>>} 
   */
  async buildModelTemplate({ decorator, env } : { 
    decorator?: boolean, 
    env ?: string
  } = {}) : Promise<{ model: string; template: string }[]> {
  
    const snakeCaseToPascal = (data: string ) => {
      let str : string[] = data.split('_')
      for(let i=0; i <str.length;i++) { 
          str[i] = str[i].slice(0,1).toUpperCase() + str[i].slice(1,str[i].length) 
      }
      return str.join('')
    }
  
    const detectRelation = (currentTable:string, fks:any[]) => {
      return fks.map(fk => {
        const { RefTable, Column } = fk
        if (currentTable !== RefTable && Column && Column.endsWith('_id')) {
          const inverse = 'hasMany'
          return {
            currentTable,
            relation: 'belongsTo',
            relatedTable: RefTable,
            fkColumn: Column,
            inverse
          }
        }
        return {
          currentTable,
          relation: 'unknown',
          relatedTable: RefTable,
          fkColumn: Column
        }
      })
    }
  
    const tableToModel = (table: string): string => {
      return pluralize.singular(
        table
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
      )
    }
  
    const mapRelations = (data: any[]): any[] => {
      const map: Record<string, any> = {};

      for (const t of data) {
        map[t.table] = { table: t.table, relations: [] };
      }

      for (const table of data) {
        for (const rel of table.relations) {
          if (rel.relatedTables) {
            map[table.table].relations.push({ type: rel.relation, target: rel.relatedTables });
          } else if (rel.relatedTable) {
            map[table.table].relations.push({ type: rel.relation, target: rel.relatedTable });
            if (rel.inverse) {
              map[rel.relatedTable].relations.push({ type: rel.inverse, target: table.table });
            }
          }
        }
      }

      return Object.values(map);
    }

    const buildDecorators = (relations: { type:string, target:string }[]) => {
      const results: any[] = []
      const imports : string[] = []
      for (const rel of relations) {
        if (rel.type === 'hasMany') {
          const modelName = tableToModel(rel.target)
          const propertyName = pluralize.plural(rel.target)
          results.push({
            schema: `@HasMany({ name: '${propertyName}', model: () => ${modelName} })`,
            property: `public ${propertyName} !: ${modelName}[]`
          })
          if(!imports.includes(modelName))
            imports.push(`import { ${modelName} } from './${modelName}'`);
        }

        if (rel.type === 'belongsTo') {
          const modelName = tableToModel(rel.target)
          const propertyName = pluralize.singular(rel.target)
          results.push({
            schema: `@BelongsTo({ name: '${propertyName}', model: () => ${modelName} })`,
            property: `public ${propertyName} !: ${modelName}`
          })
          if(!imports.includes(modelName))
            imports.push(`import { ${modelName} } from './${modelName}'`);
        }
      }
      return { results , imports }
    }

    const buildRelations = (relations: { type:string, target:string }[]) => {
      const types: any[] = [];
      const imports : string[] = [];
      const useds : any[] = [];

      for (const rel of relations) {
        if (rel.type === 'hasMany') {
          const modelName = tableToModel(rel.target)
          const propertyName = pluralize.plural(rel.target)
          types.push(`${propertyName} : ${modelName}[]`)
          useds.push(`this.hasMany({ name: '${propertyName}', model: ${modelName} })`)
          if(!imports.includes(modelName))
            imports.push(`import { ${modelName} } from './${modelName}'`);
        }

        if (rel.type === 'belongsTo') {
          const modelName = tableToModel(rel.target)
          const propertyName = pluralize.singular(rel.target)
          types.push(`${propertyName} : ${modelName}`);
          useds.push(`this.belongsTo({ name: '${propertyName}', model: ${modelName} })`);
          if(!imports.includes(modelName))
            imports.push(`import { ${modelName} } from './${modelName}'`);
        }
      }
      return { types , imports , useds }
    }

    const mapType = (type: string): string => {
      const mappings: Record<string, (string | RegExp)[]> = {
        'integer': ['int', 'integer'],
        'boolean': ['boolean', 'tinyint(1)'],
        'smallint': ['smallint', 'tinyint(1)'],
        'tinyint(1)': ['boolean'],
        'json': ['json'],
        'text': ['text', /^longtext$/i],
        'timestamp': ['timestamp without time zone', 'datetime'],
      }

      const normalizers: { test: RegExp; replace: string }[] = [
        { test: /^character varying/i, replace: 'varchar' },
        { test: /^timestamp without time zone/i, replace: 'timestamp' },
      ]

      for (const rule of normalizers) {
        if (rule.test.test(type)) {
          return type.replace(rule.test, rule.replace)
        }
      }

      for (const [canonical, aliases] of Object.entries(mappings)) {
        if (aliases.some(alias => typeof alias === 'string' ? alias === type : alias.test(type))) {
          return canonical
        }
      }

      return type
    }


    const options = new DB().loadOptionsEnv(env);

    const c = options == null 
      ? null 
      : await new DB().getConnection({
        driver: options.driver as TDriver,
        host: String(options.host),
        port: Number(options.port),
        database: String(options.database),
        username: String(options.username),
        password: String(options.password),
      })

    const tables = await new Model()
    .debug(this.$state.get('DEBUG'))
    .when(c != null, (q) => q.bind(c as TPoolConnected))
    .showTables();

    const rawRegistryRelations = await Promise.all(
      tables.map(async (table) => ({
        table,
        relations: detectRelation(
          table,
          await new Model()
          .debug(this.$state.get('DEBUG'))
          .when(c != null, (q) => q.bind(c as TPoolConnected))
          .getFKs(table)
          .catch(() => [])
        )
      }))
    )

    const registryRelations = mapRelations(rawRegistryRelations);

    const schemas : any[] = [];

    if(decorator) {

      for(const table of tables) {

        const model = snakeCaseToPascal(pluralize.singular(table));
        
        const columns = await new Model()
        .debug(this.$state.get('DEBUG'))
        .when(c != null, (q) => q.bind(c as TPoolConnected))
        .showSchema(table, { raw : true });
        
        let schema : any[] = [];

        for(const raw of columns) {
          const schemaColumn = [
              `@Column(() => `,
              `Blueprint.${/^[^()]*$/.test(raw.Type) 
                  ? raw.Type.includes('unsigned') 
                      ? 'int().unsigned()'
                      : `${mapType(raw.Type.toLocaleLowerCase())}()` 
                  : mapType(raw.Type.toLocaleLowerCase())
              }`,
              `${raw.Null === 'YES' ? '.null()' : '.notNull()'}`,
              raw.Key === 'PRI' ? '.primary()' : raw.Key === 'UNI' ? '.unique()' : '',
              raw.Default != null 
                ? `.default('${raw.Default.replace(/'/g,'').replace('IS_CONST:','').replace('::character varying','')}')`  : '',
              `${raw.Extra === 'auto_increment' ? '.autoIncrement()' : ''}`,
              `)`
          ] .join('')

          const detectType = (raws : any) => {
            const t = raws.Type.toLowerCase()
            const typeForNumber = ['INT','BIGINT','DOUBLE','FLOAT'].map(r => r.toLowerCase())
            const typeForBoolean = ['TINYINT','BOOLEAN'].map(r => r.toLowerCase())
            const typeForDate = ['DATE','DATETIME','TIMESTAMP'].map(r => r.toLowerCase())

            if (typeForNumber.some(v => t.includes(v))) return 'number'
            if (typeForBoolean.some(v => t.includes(v))) return 'boolean'
            if (typeForDate.some(v => t.includes(v))) return 'Date'
            if(t.includes('enum')) return `${String(raws.TypeValue).split(',').map(v => `'${v}'`).join(' | ')}`

            return 'string'
          }

          const publicColumn =  `public ${raw.Field} !: ${detectType(raw)}`

          schema.push({
            schema: schemaColumn,
            property: publicColumn
          })
        }

        const find = registryRelations.find(v => v.table === table)

        const { imports , results } = buildDecorators(find.relations)

        schemas.push({
          model,
          columns: [...schema,...(find == null ? []: results )],
          imports
        })
      }

      const templates : { model: string; template: string }[] = []

      for(const s of schemas) {

        let schema : string= '';

        const imports: string = s.imports
        .map((v:string)=> `${v};`)
        .join('\n')

        for(const index in s.columns) {
          const column = s.columns[index]
          const isLast = Number(index) + 1 === s.columns.length

          schema += `  ${column.schema} \n`
          schema += `  ${column.property}; ${isLast ? '\n': '\n\n'}`
        }

        const template = this.$utils.decoratorModelTemplate({
          model   : s.model,
          schema  : schema,
          imports : imports
        })

        templates.push({
          model: s.model,
          template
        })
      }

      return templates

    }

    // ------------- base model --------------------------------------
    for(const table of tables) {

      const model = snakeCaseToPascal(pluralize.singular(table));
      
      const columns = await new Model()
      .debug(this.$state.get('DEBUG'))
      .when(c != null, (q) => q.bind(c as TPoolConnected))
      .showSchema(table, { raw : true });
      
      let schema : any[] = [];

      for(const index in columns) {
        const raw = columns[index]
        const str = [
          `${raw.Field} : `,
          `Blueprint.${/^[^()]*$/.test(raw.Type) 
              ? raw.Type.includes('unsigned') 
                  ? 'int().unsigned()'
                  : `${raw.Type.toLocaleLowerCase()}()` 
              : raw.Type.toLocaleLowerCase()
          }`,
          `${raw.Null === 'YES' ? '.null()' : '.notNull()'}`,
          raw.Key === 'PRI' ? '.primary()' : raw.Key === 'UNI' ? '.unique()' : '',
          raw.Default != null 
            ? `.default('${raw.Default.replace('IS_CONST:','')}')`  : '',
          `${raw.Extra === 'auto_increment' ? '.autoIncrement()' : ''}`,
          `,`
        ].join('')

        const isLast = Number(index) + 1 === columns.length
        
        schema.push(isLast ? str.replace(/,\s*$/, "") : str);
      }

      const find = registryRelations.find(v => v.table === table)

      const { imports , types , useds  } = buildRelations(find.relations)

      schemas.push({
        model,
        schema,
        imports,
        useds,
        types, 
      })
    }
    
    const templates : { model: string; template: string }[] = []

    for(const s of schemas) {

      if(decorator) {
        let schema : string= '';

        const imports: string = s.imports
        .map((v:string)=> `${v};`)
        .join('\n')

        for(const index in s.columns) {
          const isLast = Number(index) + 1 === s.columns.length
          const column = s.columns[index]
          schema += `  ${column.schema} \n`
          schema += `  ${column.property}; ${isLast? '\n\n': '\n'}`
        }

        const template = this.$utils.decoratorModelTemplate({
          model   : s.model,
          schema  : schema,
          imports : imports
        })

        templates.push({
          model: s.model,
          template
        })

        continue
      } 

      const schema = `${s.schema.map((v:string) => '  ' + v).join('\n')}`

      const imports: string = s.imports.map((v:string) => `${v};`).join('\n')

      const types = `${s.types.map((v:string) => `  ${v};`).join('\n')}`

      const useds = `${s.useds.map((v:string) => `    ${v};`).join('\n')} \n`

      const template = this.$utils.baseModelTemplate({
        model   : s.model,
        schema  : schema,
        imports : imports,
        relation: {
          types,
          useds
        }
      })

      templates.push({
        model: s.model,
        template
      })
    }

    return templates
  }

  protected _valuePattern(column: string): string {
    if (column.startsWith(this.$constants("FREEZE"))) {
      return `${column
        .replace(this.$constants("FREEZE"), "")
        .replace(/`/g, "")}`;
    }

    if (column.startsWith(this.$constants("RAW"))) {
      return column.replace(this.$constants("RAW"), "").replace(/`/g, "");
    }

    switch (this.$state.get("PATTERN")) {
      case this.$constants("PATTERN").snake_case: {
        return column.replace(/([A-Z])/g, (str) => `_${str.toLowerCase()}`);
      }

      case this.$constants("PATTERN").camelCase: {
        return column.replace(
          /(.(_|-|\s)+.)/g,
          (str) => `${str[0]}${str[str.length - 1].toUpperCase()}`
        );
      }

      default:
        return column;
    }
  }

  private _isPatternSnakeCase() {
    return this.$state.get("PATTERN") === this.$constants("PATTERN").snake_case;
  }

  protected _classToTableName(
    className?: string | null,
    { singular = false } = {}
  ) {
    if (className == null) className = this.constructor.name;

    const tb = className
      .replace(/([A-Z])/g, (str: string) => "_" + str.toLowerCase())
      .slice(1);

    if (singular) return pluralize.singular(this._valuePattern(tb));

    return pluralize.plural(this._valuePattern(tb));
  }

  private _makeTableName() {
    const tableName = this._classToTableName();
    this.$state.set("TABLE_NAME", `\`${this._valuePattern(tableName)}\``);
    this.$state.set("MODEL_NAME", this.constructor.name);

    return this;
  }

  private _handleSoftDelete() {
    if (!this.$state.get("SOFT_DELETE")) return this;

    const deletedAt = this._valuePattern(this.$state.get("SOFT_DELETE_FORMAT"));
    const wheres = this.$state.get("WHERE");

    const softDeleteIsNull = [
      this.bindColumn(`${this.getTableName()}.${deletedAt}`),
      this.$constants("IS_NULL"),
    ].join(" ");

    if (!wheres.some((where: string) => where.includes(softDeleteIsNull))) {
      this.whereNull(deletedAt);
      return this;
    }

    return this;
  }

  private _handleGlobalScope() {
    if (!this.$state.get("GLOBAL_SCOPE")) return this;

    const globalScopeQuery = this.$state.get("GLOBAL_SCOPE_QUERY");

    if (globalScopeQuery != null && typeof globalScopeQuery === "function") {
      globalScopeQuery();
    }

    return this;
  }

  /**
   * @override
   * @return {this}
   */
  protected _handleSelect(): this {
    const selects = this.$state.get("SELECT") as string[];
    const addSelects = this.$state.get("ADD_SELECT") as string[];

    const hasStart = selects?.some((s) => s.includes("*"));

    if (hasStart) return this;

    if(selects.length && !addSelects.length) return this;

    if(selects.length && addSelects.length) {
      const columns = [...selects,...addSelects]
      this.$state.set("ADD_SELECT", []);
      this.$state.set("SELECT", [...new Set(columns)]);
      return this
    }

    const schemaColumns = this.getSchemaModel();

    if (schemaColumns == null) {
      if(addSelects.length) {
        this.$state.set("SELECT", 
          !selects.length 
            ? ['*']
            : [...selects,...addSelects]
        );
        this.$state.set("ADD_SELECT",[])
      }
      return this;
    }

    const columns: string[] = [];

    for (const key in schemaColumns) {
      const schemaColumn = schemaColumns[key];

      if (schemaColumn.sql != null) {
        const sql = schemaColumn.sql.select;

        if (sql == null) continue;

        if (sql.toLowerCase().includes(" as ")) {
          columns.push(sql);
          continue;
        }

        columns.push(`${sql} ${this.$constants("AS")} ${key}`);
        continue;
      }
      if (schemaColumn.column == null) {
        columns.push(this.bindColumn(key));
        continue;
      }
      columns.push(this.bindColumn(schemaColumn.column, false));
    }

    if (!columns.length) return this;

    if (addSelects.length) {
      columns.push(...addSelects.filter(c => !columns.includes(c)));
      this.$state.set("ADD_SELECT", []);
    }

    this.$state.set("SELECT", [...new Set(columns)]);

    return this;
  }

  /**
   *
   * generate sql statements
   * @override
   */
  protected _queryBuilder({ onFormat = false } = {}) {

    if(onFormat) return this._buildQueryStatement();
    
    this._handleGlobalScope();

    this._handleSelect();

    this._handleSoftDelete();

    return this._buildQueryStatement();
  }

  private _showOnly(data: any) {
    let result: any[] = [];
    const hasNameRelation = this.$state
      .get("RELATIONS")
      .map((w: any) => w.as ?? w.name);

    data.forEach((d: Record<string, any>) => {
      let newData: Record<string, any> = {};
      this.$state.get("ONLY").forEach((only: string) => {
        if (d.hasOwnProperty(only)) newData = { ...newData, [only]: d[only] };
      });

      hasNameRelation.forEach((name: string) => {
        if (name) newData = { ...newData, [name]: d[name] };
      });

      result = [...result, newData];
    });

    return result;
  }

  private async _validateSchema(
    data: Record<any, string>,
    action: "insert" | "update"
  ) {
    const validateSchema = this.$state.get("VALIDATE_SCHEMA") as boolean;

    if (!validateSchema) return;

    const schemaTable = this.getSchemaModel();

    if (schemaTable == null) {
      throw this._assertError(
        `This method "validateSchema" isn't validation without schema. Please use the method "useSchema" for define your schema.`
      );
    }

    const schemaTableDefined = this.$state.get(
      "VALIDATE_SCHEMA_DEFINED"
    ) as null;

    const schema =
      schemaTableDefined ??
      Object.keys(schemaTable).reduce((acc: Record<string, any>, key) => {
        acc[key] = schemaTable[key].valueType;
        return acc;
      }, {});

    if (schema == null || !Object.keys(schema).length) return;

    const regexDate = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
    const regexDateTime =
      /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;

    for (const column in schema) {
      if (data == null) continue;
      const s = schema[column];
      const r = data[column];

      const typeOf = (r: any) => this.$utils.typeOf(r);

      if (typeOf(s) !== "object") {
        if (r == null) continue;

        if (regexDate.test(r) || regexDateTime.test(r)) {
          if (typeOf(new Date(r)) === typeOf(new s())) continue;
          throw this._assertError(
            `This column "${column}" is must be type "${typeOf(new s())}".`
          );
        }

        if (typeOf(r) === typeOf(new s())) continue;
        throw this._assertError(
          `This column "${column}" is must be type "${typeOf(new s())}".`
        );
      }

      if (s.require && action === "insert" && (r === "" || r == null)) {
        throw this._assertError(`This column "${column}" is required.`);
      }

      if (r == null) continue;

      if (
        (regexDate.test(r) || regexDateTime.test(r)) &&
        typeOf(new Date(r)) !== typeOf(new s.type())
      ) {
        throw this._assertError(
          `This column "${column}" is must be type "${typeOf(new s.type())}".`
        );
      }

      if (typeOf(r) !== typeOf(new s.type())) {
        throw this._assertError(
          `This column "${column}" is must be type "${typeOf(new s.type())}".`
        );
      }

      if (s.json) {
        try {
          JSON.parse(r);
        } catch (_) {
          throw this._assertError(`This column "${column}" is must be JSON.`);
        }
      }

      if (s.length && `${r}`.length > s.length) {
        throw this._assertError(
          `This column "${column}" is more than "${s.length}" length of characters.`
        );
      }

      if (s.maxLength && `${r}`.length > s.maxLength) {
        throw this._assertError(
          `This column "${column}" is more than "${s.maxLength}" length of characters.`
        );
      }

      if (s.minLength && `${r}`.length < s.minLength) {
        throw this._assertError(
          `This column "${column}" is less than "${s.minLength}" length of characters`
        );
      }

      if (s.max && r > s.max)
        throw this._assertError(
          `This column "${column}" is more than "${s.max}"`
        );

      if (s.min && r < s.min)
        throw this._assertError(
          `This column "${column}" is less than "${s.min}"`
        );

      if (
        s.enum &&
        s.enum.length &&
        !s.enum.some((e: string | number) => e === r)
      ) {
        throw this._assertError(
          `This column "${column}" is must be in ${s.enum.map(
            (e: string | number) => `"${e}"`
          )}`
        );
      }

      if (s.match && !s.match.test(r)) {
        throw this._assertError(
          `This column "${column}" is not match a regular expression`
        );
      }

      if (s.fn) {
        const message = await s.fn(r)
        if(message) {
           throw this._assertError(message);
        }
      }

      if (s.unique && action === "insert") {
        const exist = await new Model()
          .copyModel(this, { select: true, where: true, limit: true })
          .where(column, r)
          .debug(this.$state.get("DEBUG"))
          .exists();

        if (exist)
          throw this._assertError(`This column "${column}" is duplicated`);
      }
    }

    return;
  }

  private async _getCache() {
    const cache = this.$state.get("CACHE");

    if (cache == null) return;

    const startTime = +new Date();

    const findCache = await this.$cache.get(cache.key);

    if (findCache == null) return;

    if (this.$state.get("DEBUG")) {
      this.$utils.consoleCache(
        JSON.stringify({
          driver: this.$cache.provider(),
          key: cache.key,
          expires: cache.expires,
          type: this.$utils.typeOf(findCache),
          length:
            Array.isArray(findCache) ||
            this.$utils.typeOf(findCache) === "string"
              ? findCache.length
              : undefined,
        })
      );
      const endTime = +new Date();
      this.$utils.consoleExec(startTime, endTime);
    }

    return findCache;
  }

  private async _setCache(data: any) {
    const cache = this.$state.get("CACHE");

    if (cache == null) return;

    const exists = await this.$cache.exists(cache.key);

    if (exists) return;

    await this.$cache.set(cache.key, data, cache.expires);
  }

  private async _execute({ sql, type, message, options }: TExecute) {
    const middlewares: Function[] = this.$state.get("MIDDLEWARES");

    if (middlewares.length) {
      await Promise.all(middlewares.map((fn) => fn()));
    }

    const relations = this.$state.get("RELATIONS");

    const cache = await this._getCache();

    if (cache != null) {
      return cache;
    }

    let result = await this._queryStatement(sql);

    if (!result.length) {
      return this._returnEmpty(type, result, message, options);
    }

    for (const relation of relations) {
      const loaded = (await this.$relation.load(result, relation)) ?? [];
      result = loaded;
    }

    if (this.$state.get("HIDDEN").length) this._hiddenColumnModel(result);

    return (
      (await this._returnResult(type, result)) ||
      this._returnEmpty(type, result, message, options)
    );
  }

  private async _pagination(data: any[]): Promise<any> {
    const currentPage: number = +this.$state.get("PAGE");

    const limit: number = Number(this.$state.get("LIMIT"));

    if (limit < 1) {
      throw this._assertError(
        "This pagination needed limit minimun less 1 for limit"
      );
    }

    const total = await new Model()
      .copyModel(this, { where: true, join: true })
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .unset({ alias: true })
      .count(this.$state.get("PRIMARY_KEY"));

    let lastPage: number = Math.ceil(total / limit) || 0;
    lastPage = lastPage > 1 ? lastPage : 1;

    const nextPage: number = currentPage + 1;
    const prevPage: number = currentPage - 1 === 0 ? 1 : currentPage - 1;
    const totalPage: number = data?.length ?? 0;

    const meta = {
      total,
      limit,
      totalPage,
      currentPage,
      lastPage,
      nextPage,
      prevPage,
    };

    if (this._isPatternSnakeCase()) {
      return this.$utils.snakeCase(
        this._resultHandler({
          meta,
          data,
        })
      );
    }

    return this._resultHandler({
      meta,
      data,
    });
  }

  private async _returnEmpty(
    type: string,
    result: any[],
    message?: string,
    options?: Record<string, any>
  ) {
    let emptyData = null;

    switch (type) {
      case "FIRST": {
        emptyData = null;
        break;
      }

      case "FIRST_OR_ERROR": {
        if (!result?.length) {
          if (options == null) {
            throw {
              message,
              code: 400,
            };
          }

          throw {
            message,
            ...options,
          };
        }

        break;
      }

      case "GET": {
        emptyData = [];
        break;
      }

      case "PAGINATION": {
        emptyData = {
          meta: {
            total: 0,
            limit: Number(this.$state.get("LIMIT")),
            totalPage: 0,
            currentPage: Number(this.$state.get("PAGE")),
            lastPage: 0,
            nextPage: 0,
            prevPage: 0,
          },
          data: [],
        };

        break;
      }
      default:
        throw this._assertError("Missing method first get or pagination");
    }

    if (this._isPatternSnakeCase()) {
      const empty = this.$utils.snakeCase(this._resultHandler(emptyData));
      await this.$utils.hookHandle(this.$state.get("HOOKS"), empty);
      this._observer(empty, "selected");
      return empty;
    }

    const empty = this._resultHandler(emptyData);
    await this.$utils.hookHandle(this.$state.get("HOOKS"), empty);
    this._observer(empty, "selected");

    return empty;
  }

  private async _returnResult(type: string, data: any[]) {
    const registry = this.$state.get("REGISTRY");

    if (Object.keys(registry)?.length && registry != null) {
      for (const d of data) {
        for (const name in registry) {
          d[name] = registry[name];
        }
      }
    }

    const functionRelation = this.$state.get("FUNCTION_RELATION");

    if (functionRelation) {
      for (const d of data) {
        for (const r of this.$state.get("RELATION")) {
          d[`$${r.name}`] = async (cb: Function | null) => {
            const query = cb ? cb(new r.model()) : new r.model();
            r.query = query;

            const dataFromRelation = (await this.$relation.load([d], r)) ?? [];
            const relationIsHasOneOrBelongsTo = [
              this.$constants("RELATIONSHIP").hasOne,
              this.$constants("RELATIONSHIP").belongsTo,
            ].some((x) => x === r.relation);

            if (relationIsHasOneOrBelongsTo) return dataFromRelation[0] || null;

            return dataFromRelation || [];
          };
        }
      }
    }

    if (this.$state.get("ONLY")?.length) data = this._showOnly(data);

    let result: any = null;

    let res: Record<string, any>[] = [];

    if (!res.length) res = data;

    switch (type) {
      case "FIRST": {
        result = this._resultHandler(res[0] ?? null);

        break;
      }

      case "FIRST_OR_ERROR": {
        result = this._resultHandler(res[0] ?? null);

        break;
      }

      case "GET": {
        result = this._resultHandler(res);
        break;
      }
      case "PAGINATION": {
        result = await this._pagination(res);
        break;
      }
      default: {
        throw this._assertError("Missing method first get or pagination");
      }
    }

    await this.$utils.hookHandle(this.$state.get("HOOKS"), result);

    await this._observer(result, "selected");

    this._setCache(result);

    return result;
  }

  private _hiddenColumnModel(data: Record<string, any>[]) {
    const hiddens = this.$state.get("HIDDEN");
    for (const hidden of hiddens) {
      for (const objColumn of data) {
        delete objColumn[hidden];
      }
    }

    return data;
  }

  private async _save() {
    const result = this.$state.get("RESULT");

    if (result?.id == null) {
      throw this._assertError(
        `This '$save' must be required the 'id' for the function`
      );
    }

    const update = JSON.parse(
      JSON.stringify({
        ...result,
      })
    );

    return (
      await this.where("id", result.id)
      .update(update)
      .dd()
      .save()
    )
  }

  private async _attach(name: string, dataId: any[], fields?: any) {
    if (!Array.isArray(dataId)) {
      throw this._assertError(`This '${dataId}' is not an array.`);
    }

    const relation: TRelationOptions = this.$state
      .get("RELATION")
      ?.find((data: any) => data.name === name);

    if (!relation) {
      throw this._assertError(`Unknown relation '${name}' in model.`);
    }

    const thisTable = this.$utils.columnRelation(this.constructor.name);

    const relationTable = this._classToTableName(relation.model.name, {
      singular: true,
    });

    const result = this.$state.get("RESULT");

    try {
      const pivotTable = `${thisTable}_${relationTable}`;

      const success = await new DB()
        .table(pivotTable)
        .createMultiple(
          dataId.map((id: number) => {
            return {
              [this._valuePattern(`${relationTable}Id`)]: id,
              [this._valuePattern(`${thisTable}Id`)]: result?.id,
              ...fields,
            };
          })
        )
        .save();

      return success;
    } catch (e: any) {
      const errorTable = e.message;
      const search = errorTable.search("ER_NO_SUCH_TABLE");

      if (!!search) throw this._assertError(e.message);

      try {
        const pivotTable = `${relationTable}_${thisTable}`;
        const success = await new DB()
          .table(pivotTable)
          .createMultiple(
            dataId.map((id: number) => {
              return {
                [this._valuePattern(`${relationTable}Id`)]: id,
                [this._valuePattern(`${thisTable}Id`)]: result?.id,
                ...fields,
              };
            })
          )
          .save();

        return success;
      } catch (e: any) {
        throw this._assertError(e.message);
      }
    }
  }

  private async _detach(name: string, dataId: any[]) {
    if (!Array.isArray(dataId)) {
      throw this._assertError(`This '${dataId}' is not an array.`);
    }

    const relation: any = this.$state
      .get("RELATION")
      .find((data: any) => data.name === name);

    if (!relation) {
      throw this._assertError(`Unknown relation '${name}' in model.`);
    }

    const thisTable = this.$utils.columnRelation(this.constructor.name);

    const relationTable = this._classToTableName(relation.model.name, {
      singular: true,
    });

    const result = this.$state.get("RESULT");

    try {
      const pivotTable = `${thisTable}_${relationTable}`;

      for (const id of dataId) {
        await new DB()
          .table(pivotTable)
          .where(this._valuePattern(`${relationTable}Id`), id)
          .where(this._valuePattern(`${thisTable}Id`), result?.id)
          .delete();
      }

      return true;
    } catch (e: any) {
      const errorTable = e.message;
      const search = errorTable.search("ER_NO_SUCH_TABLE");

      if (!!search) throw this._assertError(e.message);

      try {
        const pivotTable = `${relationTable}_${thisTable}`;

        for (const id of dataId) {
          await new DB()
            .table(pivotTable)
            .where(this._valuePattern(`${relationTable}Id`), id)
            .where(this._valuePattern(`${thisTable}Id`), result?.id)
            .delete();
        }

        return true;
      } catch (e: any) {
        throw this._assertError(e.message);
      }
    }
  }

  private _queryUpdateModel(objects: Record<string, any>) {
    objects = this.$utils.covertDateToDateString(objects);

    if (this.$state.get("TIMESTAMP")) {
      const updatedAt: string = this._valuePattern(
        this.$state.get("TIMESTAMP_FORMAT").UPDATED_AT
      );
      objects = {
        ...objects,
        [updatedAt]:
          objects[updatedAt] === undefined
            ? this.$utils.timestamp()
            : this.$utils.covertDateToDateString(objects[updatedAt]),
      };
    }

    const keyValue = Object.entries(objects).map(([column, value]) => {
      if (
        typeof value === "string" &&
        !value.includes(this.$constants("RAW"))
      ) {
        value = this.$utils.escapeActions(value);
      }
      return `${this.bindColumn(column)} = ${
        value == null || value === this.$constants("NULL")
          ? this.$constants("NULL")
          : this.$utils.checkValueHasRaw(value)
      }`;
    });

    return `${this.$constants("SET")} ${keyValue.join(", ")}`;
  }

  private _queryInsertModel(data: Record<string, any>) {
    this.$utils.covertDateToDateString(data);

    const hasTimestamp = Boolean(this.$state.get("TIMESTAMP"));

    if (hasTimestamp) {
      const format = this.$state.get("TIMESTAMP_FORMAT");
      const createdAt: string = this._valuePattern(String(format?.CREATED_AT));
      const updatedAt: string = this._valuePattern(String(format?.UPDATED_AT));

      data = {
        ...data,
        [createdAt]:
          data[createdAt] === undefined
            ? this.$utils.timestamp()
            : this.$utils.covertDateToDateString(data[createdAt]),
        [updatedAt]:
          data[updatedAt] === undefined
            ? this.$utils.timestamp()
            : this.$utils.covertDateToDateString(data[updatedAt]),
      };
    }

    const hasUUID = data.hasOwnProperty(this.$state.get("UUID_FORMAT"));

    if (this.$state.get("UUID") && !hasUUID) {
      const uuidFormat = this.$state.get("UUID_FORMAT");
      data = {
        [uuidFormat]: this.$utils.generateUUID(),
        ...data,
      };
    }

    const columns: string[] = Object.keys(data)
    .map((c : string) => `\`${this._valuePattern(c).replace(/\`/g, "")}\``);

    const values = Object.values(data).map((value: any) => {
      if (
        typeof value === "string" &&
        !value.includes(this.$constants("RAW"))
      ) {
        value = this.$utils.escapeActions(value);
      }

      if(this.$utils.typeOf(value) === 'object' || this.$utils.typeOf(value) === 'array') {
        value = JSON.stringify(value)
      }

      return `${
        value == null || value === this.$constants("NULL")
          ? this.$constants("NULL")
          : this.$utils.checkValueHasRaw(value)
      }`;
    });

    const sql = [
      `(${columns.join(", ")})`,
      `${this.$constants("VALUES")}`,
      `(${values.join(", ")})`,
    ].join(" ");

    return sql;
  }

  private _queryInsertMultipleModel(data: any[]) {
    let values: string[] = [];

    let columns: string[] = Object.keys([...data][0]).map(
      (column: string) => column
    );

    const hasTimestamp = this.$state.get("TIMESTAMP");

    const format = this.$state.get("TIMESTAMP_FORMAT");

    const newData: Record<string, any>[] = [];

    for (let objects of data) {
      this.$utils.covertDateToDateString(data);

      if (hasTimestamp) {
        const createdAt: string = this._valuePattern(format.CREATED_AT);
        const updatedAt: string = this._valuePattern(format.UPDATED_AT);

        objects = {
          ...objects,
          [createdAt]:
            objects[createdAt] === undefined
              ? this.$utils.timestamp()
              : this.$utils.covertDateToDateString(objects[createdAt]),
          [updatedAt]:
            objects[updatedAt] === undefined
              ? this.$utils.timestamp()
              : this.$utils.covertDateToDateString(objects[updatedAt]),
        };

        columns = [...columns, `\`${createdAt}\``, `\`${updatedAt}\``];
      }

      const hasUUID = objects.hasOwnProperty(this.$state.get("UUID_FORMAT"));

      if (this.$state.get("UUID") && !hasUUID) {
        const uuidFormat = this.$state.get("UUID_FORMAT");

        objects = {
          [uuidFormat]: this.$utils.generateUUID(),
          ...objects,
        };

        columns = [`\`${uuidFormat}\``, ...columns];
      }

      const v: string[] = Object.values(objects).map((value: any) => {
        if (
          typeof value === "string" &&
          !value.includes(this.$constants("RAW"))
        ) {
          value = this.$utils.escapeActions(value);
        }

        if(this.$utils.typeOf(value) === 'object' || this.$utils.typeOf(value) === 'array') {
          value = JSON.stringify(value)
        }

        return `${
          value == null || value === this.$constants("NULL")
            ? this.$constants("NULL")
            : this.$utils.checkValueHasRaw(value)
        }`;
      });

      values = [...values, `(${v.join(",")})`];

      newData.push(objects);
    }

    this.$state.set("DATA", newData);

    return [
      `(${[...new Set(columns.map((c) => `\`${this._valuePattern(c).replace(/\`/g, "")}\`` ))].join(",")})`,
      `${this.$constants("VALUES")}`,
      `${values.join(", ")}`,
    ].join(" ");
  }

  private async _insertNotExistsModel(): Promise<any> {
    this._guardWhereCondition();

    const check = await new Model()
      .copyModel(this, {
        where: true,
        select: true,
        limit: true,
        relations: true,
      })
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .exists();

    if (check) return this._resultHandler(null);

    await this._validateSchema(this.$state.get("DATA"), "insert");

    const result = await this._actionStatement(this._queryBuilder().insert());

    if (!result) return this._resultHandler(null);

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    let resultData = await new Model()
      .copyModel(this, { select: true, relations: true })
      .whereIn("id", result.$meta.insertIds)
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .first();

    if (resultData == null) {
      await this.$utils.wait(500);

      resultData = await new Model()
        .copyModel(this, { select: true, relations: true })
        .whereIn("id", result.$meta.insertIds)
        .bind(this.$pool.get())
        .debug(this.$state.get("DEBUG"))
        .first();
    }

    return this._resultHandler(resultData);
  }

  private async _insertModel() : Promise<any> {
    await this._validateSchema(this.$state.get("DATA"), "insert");
    
    const result = await this._actionStatement(this._queryBuilder().insert());
    
    if (this.$state.get("VOID")) return this._resultHandler(undefined);

    if (!result) return this._resultHandler(null);

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    let resultData = await new Model()
      .copyModel(this, { select: true, relations: true })
      .whereIn("id", result.$meta.insertIds)
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .first();

    if (resultData == null) {
      await this.$utils.wait(1000);

      resultData = await new Model()
        .copyModel(this, { select: true, relations: true })
        .whereIn("id", result.$meta.insertIds)
        .bind(this.$pool.get())
        .debug(this.$state.get("DEBUG"))
        .first();
    }

    await this._observer(resultData, "created");

    return this._resultHandler(resultData);
  }

  private async _createMultipleModel(): Promise<any> {
    const data = this.$state.get("DATA") ?? [];

    for (const v of data) {
      await this._validateSchema(v, "insert");
    }

    const result = await this._actionStatement(this._queryBuilder().insert());

    if (this.$state.get("VOID")) return this._resultHandler(undefined);

    if (!result) return this._resultHandler(null);

    const hasTimestamp = this.$state.get("TIMESTAMP");

    const ids = result.$meta.insertIds

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    const results = await new Model()
      .copyModel(this, { select: true, relations: true, limit: true })
      .bind(this.$pool.get())
      .when(hasTimestamp, (query: Model) => {
        const uuids: string[] = data.map((v: { uuid: string }) => v?.uuid);
        const target = uuids.some((v) => v == null) ? "id" : "uuid";
        return query.whereIn(target, target === "id" ? ids : uuids);
      })
      .when(!hasTimestamp, (query: Model) => {
        return query.whereIn("id", ids);
      })
      .debug(this.$state.get("DEBUG"))
      .get();

    await this._observer(results, "created");

    return this._resultHandler(results);
  }

  private async _updateOrInsertModel(): Promise<
    { [key: string]: any } | { [key: string]: any }[] | null
  > {
    this._guardWhereCondition();

    const check =
      (await new Model()
        .copyModel(this, { select: true, where: true, limit: true })
        .bind(this.$pool.get())
        .debug(this.$state.get("DEBUG"))
        .exists()) || false;

    switch (check) {
      case false: {
        await this._validateSchema(this.$state.get("DATA"), "insert");

        const result = await this._actionStatement(this._queryBuilder().insert());

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(undefined);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        let data = await new Model()
          .copyModel(this, { select: true })
          .bind(this.$pool.get())
          .whereIn("id", result.$meta.insertIds)
          .debug(this.$state.get("DEBUG"))
          .first();

        if (data == null) {
          await this.$utils.wait(1000);

          data = await new Model()
            .copyModel(this, { select: true })
            .bind(this.$pool.get())
            .whereIn("id", result.$meta.insertIds)
            .debug(this.$state.get("DEBUG"))
            .first();
        }

        const resultData = data == null ? null : { ...data, $action: "insert" };

        const r = this._resultHandler(resultData);
        await this._observer(r, "created");

        return r;
      }

      case true: {
        await this._validateSchema(this.$state.get("DATA"), "update");

        const result = await this._actionStatement(this._queryBuilder().update());

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(undefined);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        const data: any[] = await new Model()
          .copyModel(this, { where: true, select: true, limit: true })
          .bind(this.$pool.get())
          .debug(this.$state.get("DEBUG"))
          .get();

        if (data?.length > 1) {
          for (const v of data) v.$action = "update";

          const r = this._resultHandler(data);

          await this._observer(r, "updated");

          return r;
        }

        const resultData = { ...data[0], $action: "update" };

        const r = this._resultHandler(resultData);

        await this._observer(r, "updated");

        return r;
      }
    }
  }

  private async _insertOrSelectModel(): Promise<
    { [key: string]: any } | { [key: string]: any }[] | null
  > {
    this._guardWhereCondition();

    const check =
      (await new Model()
        .copyModel(this, { select: true, where: true, limit: true })
        .bind(this.$pool.get())
        .debug(this.$state.get("DEBUG"))
        .exists()) || false;

    switch (check) {
      case false: {
        await this._validateSchema(this.$state.get("DATA"), "insert");

        const result = await this._actionStatement(this._queryBuilder().insert());

        if (this.$state.get("VOID") || !result)
          return this._resultHandler(undefined);

        await this.$utils.wait(this.$state.get("AFTER_SAVE"));

        let data = await new Model()
          .copyModel(this, { select: true })
          .bind(this.$pool.get())
          .whereIn("id", result.$meta.insertIds)
          .debug(this.$state.get("DEBUG"))
          .first();

        if (data == null) {
          await this.$utils.wait(1000);

          data = await new Model()
            .copyModel(this, { select: true })
            .bind(this.$pool.get())
            .whereIn("id", result.$meta.insertIds)
            .debug(this.$state.get("DEBUG"))
            .first();
        }

        const resultData =
          data == null
            ? null
            : {
                ...data,
                $action: "insert",
              };

        const r = this._resultHandler(resultData);

        await this._observer(r, "created");

        return r;
      }
      case true: {
        if (this.$state.get("VOID")) return this._resultHandler(undefined);

        const data: any[] = await new Model()
          .copyModel(this, { select: true, where: true, limit: true })
          .bind(this.$pool.get())
          .debug(this.$state.get("DEBUG"))
          .get();

        if (data?.length > 1) {
          for (const v of data) v.$action = "select";
          return data;
        }

        const resultData = {
          ...data[0],
          $action: "select",
        };

        return this._resultHandler(resultData);
      }
    }
  }

  private async _updateModel() {
    this._guardWhereCondition();

    await this._validateSchema(this.$state.get("DATA"), "update");

    const result = await this._actionStatement(this._queryBuilder().update());

    if (this.$state.get("VOID") || !result || result == null)
      return this._resultHandler(undefined);

    await this.$utils.wait(this.$state.get("AFTER_SAVE"));

    const data = await new Model()
      .copyModel(this, {
        where: true,
        select: true,
        limit: true,
        orderBy: true,
      })
      .bind(this.$pool.get())
      .debug(this.$state.get("DEBUG"))
      .get();

    if (data?.length > 1) {
      const r = this._resultHandler(data);

      await this._observer(r, "updated");

      return r;
    }

    const resultData = data[0] || null;

    const r = this._resultHandler(resultData);

    await this._observer(r, "updated");

    return r;
  }

  private _assertError(
    condition: boolean | string = true,
    message: string = "error"
  ) {
    if (typeof condition === "string") {
      throw new Error(condition);
    }

    if (condition) throw new Error(message);

    return;
  }

  private _validateMethod(method: string): void {
    const methodChangeStatements = [
      "insert",
      "create",
      "update",
      "updateMultiple",
      "updateMany",
      "updateNotExists",
      "delete",
      "deleteMany",
      "forceDelete",
      "restore",
      "faker",
      "createNotExists",
      "insertNotExists",
      "createOrSelect",
      "insertOrSelect",
      "createOrUpdate",
      "insertOrUpdate",
      "updateOrCreate",
      "updateOrInsert",
      "createMultiple",
      "insertMultiple",
    ];

    switch (method.toLocaleLowerCase()) {
      case "paginate":
      case "pagination":
      case "findOneOrError":
      case "firstOrError":
      case "findOne":
      case "findMany":
      case "first":
      case "get": {
        const methodCallings = this.$logger.get();

        const methodsNotAllowed = methodChangeStatements;

        const findMethodNotAllowed = methodCallings.find(
          (methodCalling: string) => methodsNotAllowed.includes(methodCalling)
        );

        if (
          methodCallings.some((methodCalling: string) =>
            methodsNotAllowed.includes(methodCalling)
          )
        ) {
          throw this._assertError(
            `This method '${method}' can't using the method '${findMethodNotAllowed}'.`
          );
        }

        break;
      }

      case "save": {
        const methodCallings = this.$logger.get();

        const methodsSomeAllowed = methodChangeStatements;

        if (
          !methodCallings.some((methodCalling: string) =>
            methodsSomeAllowed.includes(methodCalling)
          )
        ) {
          throw this._assertError(
            `This ${method} method need some ${methodsSomeAllowed
              .map((v) => `'${v}'`)
              .join(", ")} methods.`
          );
        }

        break;
      }
    }
  }

  private async _checkSchemaOrNextError(
    e: unknown,
    retry = 1,
    originError?: any
  ): Promise<void> {
    const throwError = originError == null ? e : originError;
    try {
      if (retry > 3 || this.$state.get("RETRY") > 3) throw throwError;

      const schemaTable = this.getSchemaModel();

      if (schemaTable == null) return this._stoppedRetry(throwError);

      if (!(e instanceof Error)) return this._stoppedRetry(throwError);

      await this.sync({ force: true })

    } catch (e: unknown) {
      if (retry > 3) {
        throw throwError;
      }

      await this._checkSchemaOrNextError(e, retry + 1, originError);
    }
  }

  private _stoppedRetry(e: unknown) {
    this.$state.set("RETRY", 3);
    throw e;
  }

  private async _observer(
    result: unknown,
    type: "selected" | "created" | "updated" | "deleted"
  ) {

    const observer = this.$state.get("OBSERVER");

    if(observer == null) return;

    const ob = new observer();

    await ob[type](result);
  }

  private _mapReflectMetadata<K extends TR extends object ? TRelationKeys<TR> : string>(): this {

    const table = Reflect.getMetadata(REFLECT_META_TABLE, this.constructor) || null;

    if(table) this.$table = table;

    const observer = Reflect.getMetadata(REFLECT_META_OBSERVER, this.constructor) || null;

    if(observer) this.$observer = observer;

    const uuidIsEnabled = Reflect.getMetadata(REFLECT_META_UUID.enabled, this.constructor) || null;

    if (uuidIsEnabled) {
      this.$uuid = true;
      this.$uuidColumn = Reflect.getMetadata(REFLECT_META_UUID.column, this.constructor) || null;
    }

    const timestamp = Reflect.getMetadata(REFLECT_META_TIMESTAMP.enabled, this.constructor) || null;

    if (timestamp) {
      this.$timestamp = true;
      this.$timestampColumns = Reflect.getMetadata(REFLECT_META_TIMESTAMP.columns, this.constructor) || null;
    }

    const pattern = Reflect.getMetadata(REFLECT_META_PATTERN, this.constructor) || null;
    
    if (pattern) this.$pattern = pattern;

    const softDelete = Reflect.getMetadata(REFLECT_META_SOFT_DELETE.enabled, this.constructor) || null;

    if (softDelete) {
      this.$softDelete = true;
      this.$softDeleteColumn = Reflect.getMetadata(REFLECT_META_SOFT_DELETE.columns, this.constructor) || null;
    }

    const schema = Reflect.getMetadata(REFLECT_META_SCHEMA, this) || null;

    if(schema) this.$schema = schema;

    const validate = Reflect.getMetadata(REFLECT_META_VALIDATE_SCHEMA, this) || null;

    if(validate) this.$validateSchema = validate;

    const hasOnes: TRelationQueryOptionsDecorator[] =
      Reflect.getMetadata(REFLECT_META_RELATIONS.hasOne, this) || [];

    for (const v of hasOnes) {
      this.hasOne({
        ...v,
        name: v.name as K,
        model: v.model(),
        modelPivot: v.modelPivot? v.modelPivot () : undefined
      });
    }
    
    const hasManys: TRelationQueryOptionsDecorator[] =
      Reflect.getMetadata(REFLECT_META_RELATIONS.hasMany, this) || [];

    for (const v of hasManys) {
      this.hasMany({
        ...v,
        name: v.name as K,
        model: v.model(),
        modelPivot: v.modelPivot? v.modelPivot () : undefined
      });
    }

    const belongsTos: TRelationQueryOptionsDecorator[] =
      Reflect.getMetadata(REFLECT_META_RELATIONS.belongsTo, this) || [];

    for (const v of belongsTos) {
      this.belongsTo({
        ...v,
        name: v.name as K,
        model: v.model(),
        modelPivot: v.modelPivot? v.modelPivot () : undefined
      });
    }

    const belongsToManys: TRelationQueryOptionsDecorator[] =
      Reflect.getMetadata(REFLECT_META_RELATIONS.belongsToMany, this) || [];

    for (const v of belongsToManys) {
      this.belongsToMany({
        ...v,
        name: v.name as K,
        model: v.model(),
        modelPivot: v.modelPivot? v.modelPivot () : undefined
      });
    }
    
    return this;
  }

  private _guardWhereCondition() {
    const wheres: string[] = this.$state.get("WHERE");

    if (!wheres.length) {
      throw this._assertError(
        "The statement requires the use of 'where' conditions."
      );
    }

    if (wheres.length === 1 && this.$state.get("SOFT_DELETE")) {
      const deletedAt = this._valuePattern(
        this.$state.get("SOFT_DELETE_FORMAT")
      );

      const softDeleteIsNull = [
        this.bindColumn(`${this.getTableName()}.${deletedAt}`),
        this.$constants("IS_NULL"),
      ].join(" ");

      if (wheres.some((where: string) => where.includes(softDeleteIsNull))) {
        throw this._assertError(
          `The statement is not allowed to use the '${deletedAt}' column as a condition for any action`
        );
      }
    }
  }

  private _isModel(maybeModel: any): boolean {
    try {
      new maybeModel();
      return true;
    } catch (error) {
      return false;
    }
  }

  private _getBlueprintByKey(
    column: string,
    { 
      mapQuery,
      schemaColumns
    }: { mapQuery?: boolean; schemaColumns ?:any } = {}
  ) {
    schemaColumns = schemaColumns ?? this.getSchemaModel();
    if (!schemaColumns) return null;

    const blueprint = schemaColumns[column];
    if (!blueprint) return null;

    if (mapQuery) {
      return blueprint.sql ? blueprint : null;
    }

    return blueprint;
  } 

  private _initialModel(): this {
    this.$state = new StateHandler("model");

    this.meta("MAIN");

    if (this.$pattern != null) this.usePattern(this.$pattern);

    this._makeTableName();

    this.$relation = new RelationHandler(this);

    this._mapReflectMetadata();

    if (globalSettings.debug) this.useDebug();

    if (globalSettings.softDelete) this.useSoftDelete();

    if (globalSettings.uuid) this.useUUID();

    if (globalSettings.timestamp) this.useTimestamp();

    if (globalSettings.logger != null) {
      this.useLogger({
        selected: globalSettings.logger?.selected,
        inserted: globalSettings.logger?.inserted,
        updated: globalSettings.logger?.updated,
        deleted: globalSettings.logger?.deleted,
      });
    }

    if (this.$table != null) this.useTable(this.$table);

    if (this.$uuid != null) this.useUUID(this.$uuidColumn);

    if (this.$timestamp != null) this.useTimestamp(this.$timestampColumns);

    if (this.$softDelete != null) this.useSoftDelete(this.$softDeleteColumn);

    if (this.$validateSchema != null)
      this.useValidateSchema(this.$validateSchema);

    if (this.$observer != null) this.useObserver(this.$observer);

    return this;
  }
}

export { Model };
export default Model;
