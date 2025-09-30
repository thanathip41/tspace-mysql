import { Builder }      from "./Builder";
import { Model }        from "./Model";
import { Tool }         from "../tools";
import { Blueprint}     from "./Blueprint";
import { QueryBuilder } from "./Driver";
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

  public createTable = (database:string, table: string, schema: Record<string, any> | string[]) => {
    const query =  this.$db['_queryBuilder']() as QueryBuilder;
    return query.tableCreating({ database, table , schema })
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

  static detectSchema(schema: Record<string, any>) {
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
  async sync(
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
  static async sync(
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

  private async _import(pathModel: string) {
    try {
      const loadModel = await import(pathModel).catch((_) => {});

      const model: Model = new loadModel.default();

      return model;
    } catch (err: any) {
      console.log(
        `Check your 'Model' from path : '${pathModel}' is not instance of Model`
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
    force: boolean;
    log: boolean;
    foreign: boolean;
    changed: boolean;
    index: boolean;
  }) {
   
    const query =  this.$db['_queryBuilder']() as QueryBuilder;

    const checkTables = await this.$db
    .debug(log)
    .rawQuery(
      query.tables(this.$db.database())
    );
   
    const existsTables = checkTables.map(
      (c: { [s: string]: unknown } | ArrayLike<unknown>) => Object.values(c)[0]
    );

    for (const model of models) {
      if (model == null) continue;

      const query = model['_queryBuilder']() as QueryBuilder;

      let rawSchemaModel = model.getSchemaModel();
      
      if (!rawSchemaModel) continue;

      const schemaModel : Record<string,Blueprint> = {};

      for (const column in rawSchemaModel) {
        const blueprint = rawSchemaModel[column];
        if(blueprint.isVirtual) continue;
        schemaModel[column] = blueprint;
      }

      const checkTableIsExists = existsTables.some(
        (table: string) => table === model.getTableName()
      );
    
      if (!checkTableIsExists) {
        const sql = this.createTable(
          this.$db.database(),
          `\`${model.getTableName()}\``,
          schemaModel
        );

        await model.debug(log).rawQuery(sql);

        const beforeCreatingTheTable = model["$state"]
        .get("BEFORE_CREATING_TABLE");

        if (beforeCreatingTheTable != null) await beforeCreatingTheTable();
      }

      if (foreign) {
        await this._syncForeignKey({
          schemaModel,
          model,
          log,
        });
      }

      if (index) {
        await this._syncIndex({
          schemaModel,
          model,
          log,
        });
      }

      if (!force) continue;

      const schemaTable = await model.getSchema();
      const schemaTableKeys = schemaTable.map(
        (k: { Field: string }) => k.Field
      );
      const schemaModelKeys = Object.keys(schemaModel);

      // Is main matching for postgres
      const isTypeMatch = ({ typeTable, typeSchema } : { typeTable : string, typeSchema : string}) => {
        const mappings: Record<string, (string | RegExp)[]> = {
          integer: ['int', 'integer'],
          boolean: ['boolean', 'tinyint(1)'],
          smallint: ['smallint', 'tinyint(1)'],
          'tinyint(1)': ['boolean'],
          json: ['json'],
          text: ['text', /^longtext$/i],
          'timestamp without time zone': ['timestamp', 'datetime'],
        };

        // Enum in postgres too hard for maping
        // if have value add in Blueprint.enum, The sync column is not supported
        if (/^character varying(\(\d+\))?$/i.test(typeTable) && /^enum\(.+\)$/i.test(typeSchema)) {
          return true;
        }

        if(typeTable.startsWith('character varying')) {
          const typeTableFormated = typeTable.replace('character varying','varchar')
          if(typeTableFormated === typeSchema) return true
          return false
        }
       
        if (typeTable in mappings) {
          return mappings[typeTable].some((pattern) => {
            if (typeof pattern === 'string') {
              return typeSchema.toLowerCase() === pattern.toLowerCase();
            }
            if (pattern instanceof RegExp) {
              return pattern.test(typeSchema.toLowerCase());
            }
            return false;
          });
        }

        if(typeTable === typeSchema) {
          return true;
        }

        return false;
      }

      const wasChangedColumns = changed
        ? Object.entries(schemaModel)
            .map(([key, value]) => {

              const find = schemaTable.find((t) => t.Field === key);

              if (find == null) return null;

              const typeTable = String(find.Type).toLowerCase();

              const typeSchema = String(value.type).toLowerCase();

              const sameType = isTypeMatch({ typeTable, typeSchema }) 

              return sameType ? null : key;
            })
            .filter((d) => d != null)
        : [];

      if (wasChangedColumns.length) {
        for (const column of wasChangedColumns) {
          if (column == null) continue;

          const { type, attributes } = this.detectSchema(schemaModel[column]);

          if (type == null || attributes == null) continue;

          await this.$db
          .debug(log)
          .rawQuery(query.changeColumn({
            table: model.getTableName(),
            type,
            column,
            attributes
          }))
          .catch(err => {
            console.log(
              `\x1b[31mERROR: Failed to change the column '${column}' caused by '${err.message}'\x1b[0m`
            );
          })
        }
      }

      const missingColumns = schemaModelKeys.filter(
        (schemaModelKey) => !schemaTableKeys.includes(schemaModelKey)
      );

      if (!missingColumns.length) continue;

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
        .rawQuery(query.addColumn({
          table: model.getTableName(),
          type,
          column,
          attributes,
          after: findAfterIndex
        }))
        .catch(err => {
          console.log(
            `\x1b[31mERROR: Failed to add the column '${column}' caused by '${err.message}'\x1b[0m`
          );
        })
      }

      await this._syncForeignKey({
        schemaModel,
        model,
        log,
      });
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

      const onReference = typeof foreign.on === "string" 
      ? foreign.on 
      : new foreign.on();

      const table = typeof onReference === "string"
      ? onReference
      : onReference.getTableName();

      const generateConstraintName = ({ modelTable,key, foreignTable, foreignKey }: {
        modelTable: string;
        key: string;
        foreignTable: string;
        foreignKey: string;
      }): string => {

        const MAX_LENGTH = 64;

        const baseName = ['fk',`${modelTable}(${key})`, `${foreignTable}(${foreignKey})`].join('_');
        
        if (baseName.length <= MAX_LENGTH) {
          return `\`${baseName}\``;
        }

        const hash = Buffer.from(baseName).toString('base64').slice(0, 8);

        const shortParts = [
          'fk',
          `${modelTable.slice(0, 16)}(${key.slice(0, 16)})`,
          `${ foreignTable.slice(0, 16)}(${foreignKey.slice(0, 16)})`,
          hash,
        ];

        const shortName = shortParts.join('_').slice(0, MAX_LENGTH);

        return `\`${shortName}\``;
      };

      const constraintName = generateConstraintName({
        modelTable: model.getTableName(),
        key,
        foreignTable: table,
        foreignKey: foreign.references
      }).replace(/`/g,'')
      
      const query = model['_queryBuilder']() as QueryBuilder;

      try {
        const [FK] = await this.$db
        .debug(log)
        .rawQuery(query.hasFK({ 
          database   : this.$db.database(),
          table      : model.getTableName(),
          constraint : constraintName
        }));

        if(FK.IS_EXISTS) continue;

        await this.$db.debug(log)
        .rawQuery(query.createFK(
          {
            table: model.getTableName(),
            tableRef : table,
            key,
            constraint: constraintName,
            foreign: {
              references : foreign.references,
              onDelete: foreign.onDelete,
              onUpdate : foreign.onUpdate
            }
          })
        );
      } catch (e: any) {
        
        const schemaModelOn = await onReference.getSchemaModel();

        if (!schemaModelOn) continue;

        await this.$db
        .debug(log)
        .rawQuery(this.createTable(this.$db.database(), `\`${table}\``, schemaModelOn))
        .catch((err) => {
          console.log(
            `\x1b[31mERROR: Failed to create table '${table}' caused by '${err.message}'\x1b[0m`
          );
        });

        await this.$db
        .debug(log)
        .rawQuery(query.createFK(
          {
            table: model.getTableName(),
            tableRef : table,
            key,
            constraint: constraintName,
            foreign: {
              references  : foreign.references,
              onDelete    : foreign.onDelete,
              onUpdate    : foreign.onUpdate
            }
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

      const index = name == "" ? `idx_${table}(${key})` : name
      
      const query = model['_queryBuilder']() as QueryBuilder;

      try {

        const [INDEX] = await this.$db
        .debug(log)
        .rawQuery(query.hasIndex({ 
          database : this.$db.database(),
          table    : model.getTableName(),
          index    : index
        }));

        if(INDEX.IS_EXISTS) continue;

        await this.$db
        .debug(log)
        .rawQuery(query.createIndex({ 
          table   : model.getTableName(),
          index   : index,
          key     : key
        }));
      } catch (err: any) {

        const tableSql = this.createTable(this.$db.database(),`\`${table}\``, schemaModel);

        await this.$db
        .debug(log)
        .rawQuery(tableSql)
        .catch(err => {
          console.log(
            `\x1b[31mERROR: Failed to create the table '${table}' caused by '${err.message}'\x1b[0m`
          );
        })

        await this.$db
        .debug(log)
        .rawQuery(query.createIndex({ 
          table   : model.getTableName(),
          index   : index,
          key     : key
        }))
        .catch(err => {
          console.log(
            `\x1b[31mERROR: Failed to craete index key '${index}' with name ${key} caused by '${err.message}'\x1b[0m`
          );
        })
      }
    }
  }
}

export { Schema };
export default Schema;
