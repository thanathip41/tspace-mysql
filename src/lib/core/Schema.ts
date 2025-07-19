import { Builder } from "./Builder";
import { Model } from "./Model";
import { Tool } from "../tools";
class Schema {
  private $db: Builder = new Builder();

  public table = async (
    table: string,
    schemas: Record<string, any>
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

  public createTable = (table: string, schemas: Record<string, any>) => {
    let columns: Array<any> = [];

    for (const key in schemas) {
      const data = schemas[key];
      
      const { type, attributes } = this.detectSchema(data);

      if (type == null || attributes == null) continue;

      columns = [...columns, `\`${key}\` ${type} ${attributes.join(" ")}`];
    }

    return [
      `${this.$db["$constants"]("CREATE_TABLE_NOT_EXISTS")}`,
      `${table} (${columns.join(", ")})`,
      `${this.$db["$constants"]("ENGINE")}`,
    ].join(" ");
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
    const checkTables = await this.$db.rawQuery(
      this.$db["$constants"]("SHOW_TABLES")
    );

    const existsTables = checkTables.map(
      (c: { [s: string]: unknown } | ArrayLike<unknown>) => Object.values(c)[0]
    );

    for (const model of models) {
      if (model == null) continue;

      const schemaModel = model.getSchemaModel();

      if (!schemaModel) continue;

      const checkTableIsExists = existsTables.some(
        (table: string) => table === model.getTableName()
      );

      if (!checkTableIsExists) {
        const sql = this.createTable(
          `\`${model.getTableName()}\``,
          schemaModel
        );

        await model.debug(log).rawQuery(sql);

        const beforeCreatingTheTable = model["$state"].get(
          "BEFORE_CREATING_TABLE"
        );

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

      const wasChangedColumns = changed
        ? Object.entries(schemaModel)
            .map(([key, value]) => {

              const find = schemaTable.find((t) => t.Field === key);

              if (find == null) return null;

              const typeTable = String(find.Type).toLowerCase()
              const typeSchema = String(value.type).toLowerCase()

              const changed = !typeSchema.startsWith(typeTable);

              if(changed) {
                if(typeSchema === 'boolean' && typeTable === 'tinyint(1)') {
                  return null
                }
              }
              return changed ? key : null;
            })
            .filter((d) => d != null)
        : [];

      if (wasChangedColumns.length) {
        for (const column of wasChangedColumns) {
          if (column == null) continue;

          const { type, attributes } = this.detectSchema(schemaModel[column]);

          if (type == null || attributes == null) continue;

          const sql = [
            this.$db["$constants"]("ALTER_TABLE"),
            `\`${model.getTableName()}\``,
            this.$db["$constants"]("CHANGE"),
            `\`${column}\``,
            `\`${column}\` ${type} ${
              attributes != null && attributes.length
                ? `${attributes
                .filter((v:string) => !['PRIMARY KEY']
                .includes(v)).join(" ")}`
                : ""
            }`,
          ].join(" ");

          await this.$db.debug(log).rawQuery(sql);
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

        if (type == null || findAfterIndex == null || attributes == null)
          continue;

        const sql = [
          this.$db["$constants"]("ALTER_TABLE"),
          `\`${model.getTableName()}\``,
          this.$db["$constants"]("ADD"),
          `\`${column}\` ${type} ${
            attributes != null && attributes.length
              ? `${attributes.join(" ")}`
              : ""
          }`,
          this.$db["$constants"]("AFTER"),
          `\`${findAfterIndex}\``,
        ].join(" ");

        await this.$db.debug(log).rawQuery(sql);
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

      const onReference =
        typeof foreign.on === "string" ? foreign.on : new foreign.on();

      const table =
        typeof onReference === "string"
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
      });
      
      const constants = this.$db["$constants"];

      const sql = [
        constants("ALTER_TABLE"),
        `\`${model.getTableName()}\``,
        constants("ADD_CONSTRAINT"),
        constraintName,
        `${constants("FOREIGN_KEY")}(\`${key}\`)`,
        `${constants("REFERENCES")} \`${table}\`(\`${foreign.references}\`)`,
        `${constants("ON_DELETE")} ${foreign.onDelete}`,
        `${constants("ON_UPDATE")} ${foreign.onUpdate}`,
      ].join(" ");

      try {
        await this.$db.debug(log).rawQuery(sql);
      } catch (e: any) {
        if (typeof onReference === "string") continue;
        const message = String(e.message);

        if (
          message.includes("Duplicate foreign key constraint") || 
          message.includes('Duplicate key on write or update')) {
          continue;
        }
        
        const schemaModelOn = await onReference.getSchemaModel();

        if (!schemaModelOn) continue;

        const tableSql = this.createTable(`\`${table}\``, schemaModelOn);
        await this.$db
          .debug(log)
          .rawQuery(tableSql)
          .catch((e) => console.log(e));
        await this.$db
          .debug(log)
          .rawQuery(sql)
          .catch((e) => console.log(e));
        continue;
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

      const index = name == "" ? `\`idx_${table}(${key})\`` : `\`${name}\``;

      const sql = [
        `${this.$db["$constants"]("CREATE_INDEX")}`,
        `${index}`,
        `${this.$db["$constants"]("ON")}`,
        `${table}(\`${key}\`)`,
      ].join(" ");

      try {
        await this.$db.debug(log).rawQuery(sql);
      } catch (err: any) {
        if (String(err.message).includes("Duplicate key name")) continue;

        const tableSql = this.createTable(`\`${table}\``, schemaModel);

        await this.$db
          .debug(log)
          .rawQuery(tableSql)
          .catch((e) => console.log(e));
        await this.$db
          .debug(log)
          .rawQuery(sql)
          .catch((e) => console.log(e));
        continue;
      }
    }
  }
}

export { Schema };
export default Schema;
