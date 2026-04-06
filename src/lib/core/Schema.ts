import { z }            from "zod";
import { Builder }      from "./Builder";
import { Model }        from "./Model";
import { Tool }         from "../tool";
import { Blueprint }    from "./Blueprint";
import { QueryBuilder } from "./Driver";
import { T }            from "./UtilityTypes";
import { AlterTable }   from "./Contracts/AlterTable";
class Schema {
  private $db: Builder = new Builder();

  public table = async (
    table: string,
    schemas: Record<string, Blueprint>
  ): Promise<void> => {
    try {
      let columns: Array<any> = [];

      for (const key in schemas) {
        const data = schemas[key];

        const { type, attributes } = this.detectSchema(data);

        if (type == null || attributes == null) continue;

        columns = [
          ...columns,
          `\`${key}\` ${type} ${
            attributes != null && attributes.length
              ? `${attributes.join(" ")}`
              : ""
          }`,
        ];
      }

      const sql: string = [
        `${this.$db["$constants"]("CREATE_TABLE_NOT_EXISTS")}`,
        `${table} (${columns?.join(",")})`,
        `${this.$db["$constants"]("ENGINE")}`,
      ].join(" ");

      await this.$db.rawQuery(sql);

      console.log(`Migrats : '${table}' created successfully`);

      return;
    } catch (err: any) {
      console.log(err.message?.replace(/ER_TABLE_EXISTS_ERROR:/g, ""));
    }
  };

  public static table = async (
    table: string,
    schemas: Record<string, Blueprint>
  ): Promise<void> => {
    return new this().table(table,schemas)
  };

  public createTable = (
    database: string,
    table: string,
    schema: Record<string, any> | string[]
  ) => {
    const query = this.$db["_queryBuilder"]() as QueryBuilder;
    return query.createTable({ database, table, schema });
  };

  public static createTable = (
    database: string,
    table: string,
    schema: Record<string, any> | string[]
  ) => {
    return new this().createTable(database, table, schema);
  };

  public detectSchema(schema: Record<string, any>) {
    try {
      return {
        type: schema?.type ?? schema?._type ?? null,
        attributes: schema?.attributes ?? schema?._attributes ?? null,
      };
    } catch (e) {
      return {
        type: null,
        attributes: null,
      };
    }
  }

  public static detectSchema(schema: Record<string, any>) {
    return new this().detectSchema(schema);
  }

  /**
   *
   * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
   *
   * The schema can define with method 'useSchema'
   * @param    {string} pathFolders directory to models
   * @property {boolean} options.force - forec always check all columns if not exists will be created
   * @property {boolean} options.log   - show log execution with sql statements
   * @property {boolean} options.foreign - check when has a foreign keys will be created
   * @property {boolean} options.changed - check when column is changed attribute will be change attribute
   * @return {Promise<void>}
   * @example
   *
   * - node_modules
   * - app
   *   - Models
   *     - User.ts
   *     - Post.ts
   *
   *  // file User.ts
   *  class User extends Model {
   *      constructor(){
   *          super()
   *          this.hasMany({ name : 'posts' , model : Post })
   *          this.useSchema ({
   *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
   *               uuid        : new Blueprint().varchar(50).null(),
   *               email       : new Blueprint().int().notNull().unique(),
   *               name        : new Blueprint().varchar(255).null(),
   *               created_at  : new Blueprint().timestamp().null(),
   *               updated_at  : new Blueprint().timestamp().null(),
   *               deleted_at  : new Blueprint().timestamp().null()
   *           })
   *       }
   *   }
   *
   *   // file Post.ts
   *   class Post extends Model {
   *      constructor(){
   *          super()
   *          this.hasMany({ name : 'comments' , model : Comment })
   *          this.belongsTo({ name : 'user' , model : User })
   *          this.useSchema ({
   *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
   *               uuid        : new Blueprint().varchar(50).null(),
   *               user_id     : new Blueprint().int().notNull().foreign({ references : 'id' , on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
   *               title       : new Blueprint().varchar(255).null(),
   *               created_at  : new Blueprint().timestamp().null(),
   *               updated_at  : new Blueprint().timestamp().null(),
   *               deleted_at  : new Blueprint().timestamp().null()
   *           })
   *       }
   *   }
   *
   *
   *  await new Schema().sync(`app/Models` , { force : true , log = true, foreign = true , changed = true })
   */
  public async sync(
    pathFolders: string,
    {
      force = false,
      log = false,
      foreign = false,
      changed = false,
      index = false,
    } = {}
  ): Promise<void> {
    const directories = Tool.fs.readdirSync(pathFolders, {
      withFileTypes: true,
    });

    const files: any[] = await Promise.all(
      directories.map((directory) => {
        const newDir = Tool.path.resolve(String(pathFolders), directory.name);
        if (
          directory.isDirectory() &&
          directory.name.toLocaleLowerCase().includes("migrations")
        )
          return null;
        return directory.isDirectory()
          ? Schema.sync(newDir, { force, log, changed })
          : newDir;
      })
    );

    const pathModels = [].concat(...files).filter((d) => d != null || d === "");

    await new Promise((r) => setTimeout(r, 2000));

    const models = await Promise.all(
      pathModels
        .map((pathModel: string) => this._import(pathModel))
        .filter((d) => d != null)
    );

    if (!models.length) return;

    await this.syncExecute({ models, force, log, foreign, changed, index });

    return;
  }

  /**
   *
   * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
   *
   * The schema can define with method 'useSchema'
   * @param    {string} pathFolders directory to models
   * @type     {object}  options
   * @property {boolean} options.force - forec always check all columns if not exists will be created
   * @property {boolean} options.log   - show log execution with sql statements
   * @property {boolean} options.foreign - check when has a foreign keys will be created
   * @property {boolean} options.changed - check when column is changed attribute will be change attribute
   * @property {boolean} options.index - add columns to index
   * @return {Promise<void>}
   * @example
   *
   * - node_modules
   * - app
   *   - Models
   *     - User.ts
   *     - Post.ts
   *
   *  // file User.ts
   *  class User extends Model {
   *      constructor(){
   *          super()
   *          this.hasMany({ name : 'posts' , model : Post })
   *          this.useSchema ({
   *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
   *               uuid        : new Blueprint().varchar(50).null(),
   *               email       : new Blueprint().int().notNull().unique(),
   *               name        : new Blueprint().varchar(255).null(),
   *               created_at  : new Blueprint().timestamp().null(),
   *               updated_at  : new Blueprint().timestamp().null(),
   *               deleted_at  : new Blueprint().timestamp().null()
   *           })
   *       }
   *   }
   *
   *   // file Post.ts
   *   class Post extends Model {
   *      constructor(){
   *          super()
   *          this.hasMany({ name : 'comments' , model : Comment })
   *          this.belongsTo({ name : 'user' , model : User })
   *          this.useSchema ({
   *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
   *               uuid        : new Blueprint().varchar(50).null(),
   *               user_id     : new Blueprint().int().notNull().foreign({ references : 'id' , on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
   *               title       : new Blueprint().varchar(255).null(),
   *               created_at  : new Blueprint().timestamp().null(),
   *               updated_at  : new Blueprint().timestamp().null(),
   *               deleted_at  : new Blueprint().timestamp().null()
   *           })
   *       }
   *   }
   *
   *
   *  await Schema.sync(`app/Models` , { force : true })
   */
  public static async sync(
    pathFolders: string,
    {
      force = false,
      log = false,
      foreign = false,
      changed = false,
      index = false,
    } = {}
  ): Promise<void> {
    return new this().sync(pathFolders, {
      force,
      log,
      foreign,
      changed,
      index,
    });
  }

  /**
   * The 'validator' method is used Create runtime validator schema from Model definition.
   * 
   * Generates request validation schema compatible with supported adapters.
   *
   *
   * @param {Model} model Model class used to generate validator schema.
   * @type  {object}  options
   * @param {string[]} options.omit
   * @param {string[]} options.optional
   *
   *
   * @example
   *
   * import { Schema } from 'tspace-mysql'
   * import { User } from './User'
   * import { Elysia } from 'elysia'
   *
   * new Elysia()
   * .post('/', ({ body }) => {
   *     return { body }
   * }, {
   * body: Schema
   *   .validator(User)
   *   .create({
   *     omit: ["id", "created_at", "updated_at", "deleted_at"],
   *     optional: ["uuid"]
   *   })
   * })
   * .put('/', ({ body }) => {
   *     return { body }
   * }, {
   *     body: Schema
   *     .validator(User)
   *     .update({  
   *       required: ["id","email"],
   *       omit: ["uuid"]
   *     })
   * })
   * .listen(8000)
   */
  public validator<M extends Model>(model: new () => M) {
    return {
    /**
     * The 'create' method is used Create runtime validator schema from Model definition.
     * 
     * Generates request validation schema compatible with supported adapters.
     *
     * @type  {object}  options
     * @param {string[]} options.omit
     * @param {string[]} options.optional
     *
     *
     * @example
     *
     * import { Schema } from 'tspace-mysql'
     * import { User } from './User'
     * import { Elysia } from 'elysia'
     *
     * new Elysia()
     * .post('/', ({ body }) => {
     *     return { body }
     * }, {
     *   body: Schema
     *   .validator(User)
     *   .create({
     *     omit: ["id", "created_at", "updated_at", "deleted_at"],
     *     optional: ["uuid"]
     *   })
     * .listen(8000)
     */
      create: <
       O extends T.ColumnKeys<M, { OnlyColumn: true }>[] = [], 
       Opt extends T.ColumnKeys<M, { OnlyColumn: true }>[] = []
      >(options?: {
        omit?: O;
        optional?: Opt;
      } & T.NoConflict<O, Opt>) => {
        return this._createValidator(model,options)
      },
      /**
       * The 'update' method is used Create runtime validator schema from Model definition.
       * 
       * Generates request validation schema compatible with supported adapters.
       *
       * @type  {object}  options
       * @param {string[]} options.required
       * @param {string[]} options.omit
       * @example
       *
       * import { Schema } from 'tspace-mysql'
       * import { User } from './User'
       * import { Elysia } from 'elysia'
       *
       * new Elysia()
       * .post('/', ({ body }) => {
       *     return { body }
       * }, {
       *     body: Schema
       *     .validator(User)
       *     .update({  
       *         required: ["id","email"],
       *         omit: ["uuid"]
       *     })
       * })
       * .listen(8000)
       */
      update: <
       R extends T.ColumnKeys<M, { OnlyColumn: true }>[] = [], 
       O extends T.ColumnKeys<M, { OnlyColumn: true }>[] = []
      >(options?: {  required?: R, omit?: O; } & T.NoConflict<R, O>) => {
        return this._updateValidator(model, options)
      }
    }
  }

  /**
   * The 'validator' method is used Create runtime validator schema from Model definition.
   * 
   * Generates request validation schema compatible with supported adapters.
   *
   *
   * @param {Model} model Model class used to generate validator schema.
   * @type  {object}  options
   * @param {string[]} options.omit
   * @param {string[]} options.optional
   *
   *
   * @example
   *
   * import { Schema } from 'tspace-mysql'
   * import { User } from './User'
   * import { Elysia } from 'elysia'
   *
   * new Elysia()
   * .post('/', ({ body }) => {
   *     return { body }
   * }, {
   *     body: Schema.createValidator(User, {
   *         omit: ["id", "created_at", "updated_at", "deleted_at"],
   *         optional: ["uuid"]
   *     })
   * })
   * .listen(8000)
   */
  public static validator<M extends Model>(model: new () => M) {
    return new this().validator(model)
  }

  public alterTable<M extends Model>(model: new () => M) {
    return new AlterTable(model);
  }

  public static alterTable<M extends Model>(model: new () => M) {
    return new this().alterTable(model);
  }

  private _createValidator<
    M extends Model,
    O extends T.ColumnKeys<M, { OnlyColumn: true }>[] = [], 
    Opt extends T.ColumnKeys<M, { OnlyColumn: true }>[] = []
  >(
    model: new () => M,
    options?: {
      omit?: O;
      optional?: Opt;
    }
  ) {

    const schema = new model().getSchemaModel() as T.ColumnBlueprints<M>;

    if(schema == null) {
      throw new Error(`The '${new model().constructor.name}' is missing schema definition.`)
    }

    const shape = {} as Partial<T.ZodShapeCreate<M,O,Opt>>;

    const definition = this._definitionSchema(schema)

    for (const key in definition) {
     
      if (options?.omit?.includes(key)) continue;

      const value = definition[key];

      let schemaValidator: z.ZodTypeAny

      if (Array.isArray(value)) {
        schemaValidator = z.enum(value);
      }

      else if (typeof value === "string" && value.includes("|null")) {
        const base = value.replace("|null", "") as keyof typeof z;
        //@ts-ignore
        schemaValidator = z.nullable(z[base]());
      }

      else {
        //@ts-ignore
        schemaValidator = z[value]();
      }

      if (options?.optional?.includes(key)) {
        schemaValidator = z.optional(schemaValidator);
      }
      // @ts-ignore
      shape[key] = schemaValidator;
    }
   
    return z.object(shape) as unknown as z.ZodObject<T.ZodShapeCreate<M,O,Opt>>;
  }

  private _updateValidator<
    M extends Model,
    R extends T.ColumnKeys<M, { OnlyColumn: true }>[] = [],
    O extends T.ColumnKeys<M, { OnlyColumn: true }>[] = []
  >(
    model: new () => M,
    options?: {
      required?: R;
      omit?: O;
    }
  ) {

    const schema = new model().getSchemaModel();

    if(schema == null) {
      throw new Error(`The '${new model().constructor.name}' is missing schema definition.`)
    }

    const shape = {} as Partial<T.ZodShapeUpdate<M,R,O>>;

    const definition = this._definitionSchema(schema);

    for (const key in definition) {

      const value = definition[key];
      
      let schemaValidator: z.ZodTypeAny;

      if (!options?.required?.includes(key)) {

        const v = Array.isArray(value) ? "enum" : value?.replace("|null", "");
        //@ts-ignore
        schemaValidator = Array.isArray(value) ? z.enum(value) : z[v]();

        schemaValidator = z.nullable(schemaValidator);

        schemaValidator = z.optional(schemaValidator);
        
        // @ts-ignore
        shape[key] = schemaValidator;

        continue;
      }
      
      if (Array.isArray(value)) {
        schemaValidator = z.enum(value);
      }

      else if (typeof value === "string" && value.includes("|null")) {
        const base = value.replace("|null", "");
        //@ts-ignore
        schemaValidator = z.nullable(z[base]());
      }

      else {
        //@ts-ignore
        schemaValidator = z[value]();
      }

      // @ts-ignore
      shape[key] = schemaValidator;
    } 

    return z.object(shape) as unknown as z.ZodObject<T.ZodShapeUpdate<M,R,O>>;

  }

  private _definitionSchema (schema: Record<string, Blueprint<any>>) {

    const typeMap = new Map<any, string>([
      [Number, "number"],
      [String, "string"],
      [Boolean, "boolean"],
      [Date, "date"],
      [Array, "array"],
      [Object, "object"],
    ]);

    let definition: Record<string, any> = {};

    for (const key in schema) {
      const type = schema[key].valueType;
      const isNull = schema[key].isNull;
      const isEnum = schema[key].isEnum;

      definition[key] = typeMap.get(type) ?? "unknown";

      if(isNull) {
        definition[key] = definition[key] + '|null';
      }

      if(isEnum) {
        definition[key] = schema[key].enums;
      }
    }

    return definition;
  }

  private async _import(pathModel: string) {
    try {
      const loadModel = await import(pathModel).catch((_) => {});

      const model: Model = new loadModel.default();

      return model;
    } catch (err) {
      
      console.log(
        `Check your 'Model' from path : '${pathModel}' is not instance of Model, Please export default class with extends Model.`
      );

      return null;
    }
  }

  protected async syncExecute({
    models,
    force,
    log,
    foreign,
    changed,
    index,
  }: {
    models: (Model | null)[];
    force   : boolean; // forece will sync table & missing column
    log     : boolean;
    foreign : boolean;
    changed : boolean;
    index   : boolean;
  }) {
    
    const query = this.$db["_queryBuilder"]() as QueryBuilder;

    const rawTables = await this.$db
    .debug(log)
    .rawQuery(query.getTables(this.$db.database()));

    const tables = rawTables.map(
      (c: { [s: string]: unknown } | ArrayLike<unknown>) => Object.values(c)[0]
    );

    for (const model of models) {
      
      if (model == null) continue;

      let rawSchemaModel = model.getSchemaModel();

      if (!rawSchemaModel) continue;

      const schemaModel = Object
      .entries(rawSchemaModel)
      .reduce((prev, [column, blueprint]) => {
          if (!blueprint.isVirtual) {
            prev[model['_valuePattern'](column)] = blueprint;
          }
          return prev;
        },
        {} as Record<string, Blueprint>
      );

      await this._syncTable({
        schemaModel,
        model,
        log,
        tables
      })


      if(force) {
        await this._syncMissingColumn({
          schemaModel,
          model,
          log,
        })
      }

      if (changed) {
        await this._syncChangeColumn({
          schemaModel,
          model,
          log,
        })
      }

      if (index) {
        await this._syncIndex({
          schemaModel,
          model,
          log,
        });
      }

      if (foreign) {
        await this._syncForeignKey({
          schemaModel,
          model,
          log,
        });
      }

      // ---- After sync will calling some function in registry ----
      const onSyncTable = model["$state"].get(
        "ON_SYNC_TABLE"
      );

      if (onSyncTable) {
        await onSyncTable();
      }
    }
    
    return;
  }

  private async _syncForeignKey({
    schemaModel,
    model,
    log,
  }: {
    schemaModel: Record<string, any>;
    model: Model;
    log: boolean;
  }) {

    for (const key in schemaModel) {
      if (schemaModel[key]?.foreignKey == null) continue;
      const foreign = schemaModel[key].foreignKey;

      if (foreign.on == null) continue;

      const onReference =
        typeof foreign.on === "string" ? foreign.on : new foreign.on();

      const table =
        typeof onReference === "string"
          ? onReference
          : onReference.getTableName();

      const generateConstraintName = ({
        modelTable,
        key,
        foreignTable,
        foreignKey,
      }: {
        modelTable: string;
        key: string;
        foreignTable: string;
        foreignKey: string;
      }): string => {
        const MAX_LENGTH = 64;

        const baseName = [
          "fk",
          `${modelTable}(${key})`,
          `${foreignTable}(${foreignKey})`,
        ].join("_");

        if (baseName.length <= MAX_LENGTH) {
          return `\`${baseName}\``;
        }

        const hash = Buffer.from(baseName).toString("base64").slice(0, 8);

        const shortParts = [
          "fk",
          `${modelTable.slice(0, 16)}(${key.slice(0, 16)})`,
          `${foreignTable.slice(0, 16)}(${foreignKey.slice(0, 16)})`,
          hash,
        ];

        const shortName = shortParts.join("_").slice(0, MAX_LENGTH);

        return `\`${shortName}\``;
      };

      const constraintName = generateConstraintName({
        modelTable: model.getTableName(),
        key,
        foreignTable: table,
        foreignKey: foreign.references,
      }).replace(/`/g, "");

      const query = model["_queryBuilder"]() as QueryBuilder;

      try {
        const FK = await this.$db.debug(log)
        .hasFK({
          table: model.getTableName(),
          constraint: constraintName,
        });

        if (FK) continue;

        await this.$db.debug(log).rawQuery(
          query.addFK({
            table: model.getTableName(),
            tableRef: table,
            key,
            constraint: constraintName,
            foreign: {
              references: foreign.references,
              onDelete: foreign.onDelete,
              onUpdate: foreign.onUpdate,
            },
          })
        );
      } catch (e: any) {
        const schemaModelOn = await onReference.getSchemaModel();

        if (!schemaModelOn) continue;

        await this.$db
          .debug(log)
          .rawQuery(
            this.createTable(this.$db.database(), `\`${table}\``, schemaModelOn)
          )
          .catch((err) => {
            console.log(
              `\x1b[31mERROR: Failed to create table '${table}' caused by '${err.message}'\x1b[0m`
            );
          });

        await this.$db
          .debug(log)
          .rawQuery(
            query.addFK({
              table: model.getTableName(),
              tableRef: table,
              key,
              constraint: constraintName,
              foreign: {
                references: foreign.references,
                onDelete: foreign.onDelete,
                onUpdate: foreign.onUpdate,
              },
            })
          )
          .catch((err) => {
            console.log(
              `\x1b[31mERROR: Failed to create foreign key on table '${table}' with constraint ${constraintName}  caused by '${err.message}'\x1b[0m`
            );
          });
      }
    }
  }

  private async _syncIndex({
    schemaModel,
    model,
    log,
  }: {
    schemaModel: Record<string, any>;
    model: Model;
    log: boolean;
  }) {
  
    for (const key in schemaModel) {
      const name = schemaModel[key]?.indexKey;

      if (name == null) continue;

      const table = model.getTableName();

      const index = name == "" ? `idx_${table}(${key})` : name;

      const query = model["_queryBuilder"]() as QueryBuilder;

      try {
        const INDEX = await this.$db.debug(log)
        .hasIndex({
          table: table,
          name: index,
        });

        if (INDEX) continue;

        await this.$db.debug(log).rawQuery(
          query.addIndex({
            table: table,
            name: index,
            columns: [key],
          })
        );
      } catch (err: any) {
        
        await this.$db
          .debug(log)
          .rawQuery(
            query.createTable({
              database: this.$db.database(),
              table   : table,
              schema  : schemaModel
            })
          )
          .catch((err) => {
            console.log(
              `\x1b[31mERROR: Failed to create the table '${table}' caused by '${err.message}'\x1b[0m`
            );
          });

        await this.$db
          .debug(log)
          .rawQuery(
            query.addIndex({
              table: model.getTableName(),
              name: index,
              columns: [key],
            })
          )
          .catch((err) => {
            console.log(
              `\x1b[31mERROR: Failed to craete index key '${index}' with name ${key} caused by '${err.message}'\x1b[0m`
            );
          });
      }
    }

    for (const key in schemaModel) {
      const compositeIndex = schemaModel[key]?.compositeIndexKey;

      if (compositeIndex == null) continue;

      const table = model.getTableName();

      const comebindKey = [key,...compositeIndex.columns]

      const index = compositeIndex.name == "" ? `idx_${table}(${comebindKey})` : compositeIndex.name;

      const query = model["_queryBuilder"]() as QueryBuilder;

      try {
        const INDEX = await this.$db.debug(log)
        .hasIndex({
          table: table,
          name: index,
        });

        if (INDEX) continue;

        await this.$db.debug(log).rawQuery(
          query.addIndex({
            table: table,
            name: index,
            columns: comebindKey,
          })
        );
      } catch (err: any) {
        
        await this.$db
          .debug(log)
          .rawQuery(
            query.createTable({
              database: this.$db.database(),
              table   : table,
              schema  : schemaModel
            })
          )
          .catch((err) => {
            console.log(
              `\x1b[31mERROR: Failed to create the table '${table}' caused by '${err.message}'\x1b[0m`
            );
          });

        const compositeIndex = schemaModel[key]?.compositeIndexKey;

        if (compositeIndex == null) continue;

        const comebindKey = [key,...compositeIndex.columns]

        await this.$db
          .debug(log)
          .rawQuery(
            query.addIndex({
              table: model.getTableName(),
              name: index,
              columns: comebindKey,
            })
          )
          .catch((err) => {
            console.log(
              `\x1b[31mERROR: Failed to craete index key '${index}' with name ${comebindKey} caused by '${err.message}'\x1b[0m`
            );
          });
      }
    }
  }

  private async _syncChangeColumn({
    schemaModel,
    model,
    log,
  }: {
    schemaModel: Record<string, Blueprint>;
    model: Model;
    log: boolean;
  }) {

    const schemaTable = await model.getSchema();

    const query = model["_queryBuilder"]() as QueryBuilder;

    const isChangeType = ({
      typeTable,
      typeSchema,
    }: {
      typeTable: string;
      typeSchema: string;
    }) => {
      const mappings: Record<string, (string | RegExp)[]> = {
        integer: ["int", "integer"],
        boolean: ["boolean", "tinyint(1)"],
        smallint: ["smallint", "tinyint(1)"],
        "tinyint(1)": ["boolean"],
        json: ["json"],
        text: ["text", /^longtext$/i],
        "timestamp without time zone": ["timestamp", "datetime"],
      };
  
      if (typeTable.startsWith("character varying")) {
        const typeTableFormated = typeTable.replace(
          "character varying",
          "varchar"
        );
        if (typeTableFormated === typeSchema) return false;
        return true;
      }

      if (typeTable in mappings) {
        
        return !mappings[typeTable].some((pattern) => {
          
          if (typeof pattern === "string") {
            return typeSchema.toLowerCase() === pattern.toLowerCase();
          }
         
          if (pattern instanceof RegExp) {
            return pattern.test(typeSchema.toLowerCase());
          }

          return false;
        });
      }

      if (typeTable === typeSchema) {
        return false;
      }

      return true;
    };

    const isChangeNullable = ({ nullable , isNull }: { 
      nullable : 'YES' | 'NO'; 
      isNull : boolean 
    }) => {

      if(nullable === 'YES' && isNull) {
        return false;
      }

      if(nullable === 'NO' && !isNull) {
        return false;
      }

      return true;
    }

    const isChangeDefault = ({defaultTable, defaultSchema} : {
      defaultTable  : string | null;
      defaultSchema : string | number | null;
    }) => {

      if(defaultTable == defaultSchema) {
        return false;
      }

      return true;
    }

    const wasChangedColumns = Object.entries(schemaModel)
    .map(([key, value]) => {
      const find = schemaTable.find((t) => t.Field === key);

      if (find == null) return null;

      const typeTable = String(find.Type).toLowerCase();

      const typeSchema = String(value.type).toLowerCase();

      const isChangedType = isChangeType({ typeTable, typeSchema });

      const isChangedNullable = isChangeNullable({ 
        nullable : find.Nullable,
        isNull : value.isNull
      })

      const isChangedDefault = isChangeDefault({
        defaultTable : find.Default,
        defaultSchema : value.defaultValue
      })

      return [
        isChangedType,
        isChangedNullable,
        isChangedDefault
      ].some(v => v) ? key : null
    })
    .filter((d) => d != null)

    if(!wasChangedColumns.length) return;

    for (const column of wasChangedColumns) {

      if (column == null) continue;

      const { type, attributes } = this.detectSchema(schemaModel[column]);

      if (type == null || attributes == null) continue;

      await this.$db
      .debug(log)
      .rawQuery(
        query.changeColumn({
          table: model.getTableName(),
          type,
          column,
          attributes,
        })
      )
      .catch((err) => {
        console.log(
          `\x1b[31mERROR: Failed to change the column '${column}' caused by '${err.message}'\x1b[0m`
        );
      });
    }
  }

  private async _syncMissingColumn({
    schemaModel,
    model,
    log,
  }: {
    schemaModel: Record<string, any>;
    model: Model;
    log: boolean;
  }) {

    const schemaTable = await model.getSchema();

    const query = model["_queryBuilder"]() as QueryBuilder;

    const schemaTableKeys = schemaTable.map(
      (k: { Field: string }) => k.Field
    );

    const schemaModelKeys = Object.keys(schemaModel);

    const missingColumns = schemaModelKeys.filter(
      (schemaModelKey) => !schemaTableKeys.includes(schemaModelKey)
    );

    if (!missingColumns.length) return;

      const entries = Object.entries(schemaModel);

      for (const column of missingColumns) {
        const indexWithColumn = entries.findIndex(([key]) => key === column);

        const findAfterIndex = indexWithColumn
          ? entries[indexWithColumn - 1][0]
          : null;

        const { type, attributes } = this.detectSchema(schemaModel[column]);

        if (type == null || findAfterIndex == null || attributes == null) {
          continue;
        }

        await this.$db
        .debug(log)
        .rawQuery(
          query.addColumn({
            table: model.getTableName(),
            type,
            column,
            attributes,
            after: findAfterIndex,
          })
        )
        .catch((err) => {
          console.log(
            `\x1b[31mERROR: Failed to add the column '${column}' caused by '${err.message}'\x1b[0m`
          );
        });
      }
  }

  private async _syncTable({
    schemaModel,
    model,
    log,
    tables
  }: {
    schemaModel: Record<string, any>;
    model: Model;
    log: boolean;
    tables: string[]
  }) {

    const onCreatedTable = model["$state"].get(
      "ON_CREATED_TABLE"
    );

    const talbeIsExists = tables.some(
      (table: string) => table === model.getTableName()
    );

    if (!talbeIsExists) {
      const sql = this.createTable(
        this.$db.database(),
        `\`${model.getTableName()}\``,
        schemaModel
      );

      await model.debug(log).rawQuery(sql);

      if (onCreatedTable) {
        await onCreatedTable();
      }
    }
  }
}

export { Schema };
export default Schema;
