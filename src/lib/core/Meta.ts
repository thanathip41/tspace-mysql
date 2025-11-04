import { type T, Model } from '..';
class ModelMeta<M extends Model> {
    constructor(private model: M) {}

    /**
     * Get the table name of the current model.
     *
     * @returns {string} The table name.
     */
    table(): string {
        return String(this.model.toTableName());
    }

    /**
     * Get a column key from the model schema.
     *
     * @param {T.ColumnKeys<M>} column - The column key.
     * @returns {T.ColumnKeys<M>} The validated column key.
     */
    column(column: T.ColumnKeys<M>): T.ColumnKeys<M> {
        return column;
    }

    /**
     * Build a fully qualified column reference with an optional alias.
     *
     * @param {T.ColumnKeys<M>} column - The column key.
     * @param {{ alias?: string | null }} [options] - Optional alias for the table.
     * @returns {`${string}.${T.ColumnKeys<M>}`} The column reference.
     */
    columnReference(
        column: T.ColumnKeys<M>,
        { alias = null }: { alias?: string | null; } = {}
    ): `${string}.${T.ColumnKeys<M>}` {
        if (alias) return `\`${alias}\`.\`${String(column)}\``;
        return `\`${this.table()}\`.\`${String(column)}\``;
    }

    /**
     * Alias for {@link columnReference}.
     *
     * @param {T.ColumnKeys<M>} column - The column key.
     * @param {{ alias?: string | null }} [options] - Optional alias for the table.
     * @returns {`${string}.${T.ColumnKeys<M>}`} The column reference.
     */
    columnRef(
        column: T.ColumnKeys<M>,
        { alias = null }: { alias?: string | null; } = {}
    ): `${string}.${T.ColumnKeys<M>}` {
        return this.columnReference(column, { alias });
    }

    /**
     * Get all column keys defined in the model schema.
     *
     * @returns {T.ColumnKeys<M>[]} An array of column keys.
     */
    columns(): T.ColumnKeys<M>[] {
        const schemaModel = this.model.getSchemaModel();

        const columns: T.ColumnKeys<M>[] = schemaModel == null
            ? []
            : Object.entries(schemaModel).map(([key]) => key);

        return columns;
    }

    /**
     * Check if a given column exists in the model schema.
     *
     * @param {string} name - The column name to check.
     * @returns {boolean} True if the column exists, false otherwise.
     */
    hasColumn(name: string): boolean {
        const schemaModel = this.model.getSchemaModel();

        const columns: T.ColumnKeys<M>[] = schemaModel == null
            ? []
            : Object.entries(schemaModel).map(([key]) => key);

        return columns.includes(name);
    }

    /**
     * Get the primary key column of the model.
     *
     * @returns {string | undefined} The primary key column, or undefined if not found.
     */
    primaryKey(): string | undefined {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return undefined;

        return Object.entries(schemaModel).find(([key, blueprint]: any) => {
            const attr = blueprint['_attributes'];
            return Array.from(attr).includes(this.model['$constants']('PRIMARY_KEY'))
                ? key
                : undefined;
        })?.[0];
    }

    /**
     * Get all index names defined in the model schema.
     *
     * @returns {string[]} An array of index names.
     */
    indexes(): string[] {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return [];

        return Object.entries(schemaModel)
            .map(([key, blueprint]: any) => {
                const index = blueprint['_index'];
                if (index == null) return undefined;
                if (index === '') return `unknown_index_${key}`;
                return index;
            })
            .filter(v => v != null) as string[];
    }

    /**
     * Get all nullable columns in the model schema.
     *
     * @returns {string[]} An array of nullable column keys.
     */
    nullable(): string[] {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return [];

        return Object.entries(schemaModel)
            .map(([key, blueprint]: any) => {
                const attr = blueprint['_attributes'];
                return Array.from(attr).includes(this.model['$constants']('NULL'))
                    ? key
                    : undefined;
            })
            .filter(v => v != null) as string[];
    }

    /**
     * Get the default values for all columns in the schema.
     *
     * @returns {T.SchemaModel<M> | null} An object of default values, or null if none are defined.
     */
    defaults(): T.Columns<M> | null {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return null;

        const results = Object.fromEntries(
            Object.entries(schemaModel).map(([key, blueprint]) => [key, blueprint['_default']])
        );

        return Object.keys(results).length ? (results as T.Columns<M>) : null;
    }

    /**
     * Get the inferred JavaScript type of a column (based on constructor mapping).
     *
     * @param {T.ColumnKeys<M>} column - The column key.
     * @returns {("number" | "string" | "boolean" | "date" | undefined)} The column type, or undefined if not found.
     */
    columnTypeOf(column: T.ColumnKeys<M>): string | undefined {
        const schemaModel = this.model.getSchemaModel();

        if (!schemaModel) return undefined;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return undefined;

        const blueprint = entry[1];
        const value = blueprint['_valueType'];

        if (value === Number) return "number";
        if (value === String) return "string";
        if (value === Boolean) return "boolean";
        if (value === Date) return "date";

        return undefined;
    }

    /**
     * Get the database type of a column (e.g. varchar, int, etc.).
     *
     * @param {T.ColumnKeys<M>} column - The column key.
     * @returns {string | undefined} The column type, or undefined if not found.
     */
    columnType(column: T.ColumnKeys<M>): string | undefined {
        const schemaModel = this.model.getSchemaModel();

        if (!schemaModel) return undefined;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return undefined;

        const blueprint = entry[1];
        return blueprint['_type'];
    }

    /**
     * Get an enum column as a key-value map.
     *
     * @template C
     * @param {C} column - The column key.
     * @returns {Record<T.Result<M>[C], T.Result<M>[C]> | null} A record mapping each enum value to itself, or null if not defined.
     */
    //@ts-ignore
    enum<C extends T.ColumnEnumKeys<M>>(column: C): Record<T.Result<M>[C], T.Result<M>[C]> | null {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return null;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return null;

        const blueprint = entry[1];
        //@ts-ignore
        const enumValues = blueprint['_enum'] as T.Result<M>[C][];

        return enumValues.reduce((prev, curr) => {
            prev[curr] = curr;
            return prev;
            //@ts-ignore
        }, {} as Record<T.Result<M>[C], T.Result<M>[C]>);
    }

    /**
     * Get all enum values for a given column.
     *
     * @template C
     * @param {C} column - The column key.
     * @returns {T.Result<M>[C][]}
     */
    //@ts-ignore
    enums<C extends T.ColumnEnumKeys<M>>(column: C): T.Result<M>[C][] {
        const schemaModel = this.model.getSchemaModel();

        if (!schemaModel) return [];

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return [];

        const blueprint = entry[1];
        //@ts-ignore
        return blueprint['_enum'] as T.Result<M>[C][];
    }
}


/**
 * The 'Meta' used to get the metadata of a Model works only when a schema is added to the Model.
 * 
 * @example
 *  import { Meta, Model , Blueprint , type T } from 'tspace-mysql';
 *
 *  const schema = {
 *   id        : Blueprint.int().notNull().primary().autoIncrement(),
 *   uuid      : Blueprint.varchar(50).null(),
 *   email     : Blueprint.varchar(255).notNull().index('users.email@index'),
 *   name      : Blueprint.varchar(255).null(),
 *   username  : Blueprint.varchar(255).notNull(),
 *   password  : Blueprint.varchar(255).notNull(),
 *   status    : Blueprint.tinyInt().notNull().default(0),
 *   role      : Blueprint.enum('admin','user').default('user'),
 *   createdAt : Blueprint.timestamp().null(),
 *   updatedAt : Blueprint.timestamp().null()
 *  }
 *
 *  type TS = T.Schema<typeof schema>
 *  
 *  class User extends Model<TS>  {
 *    constructor() {
 *       super()
 *       this.useSchema(schema)
 *    }
 *  }
 * 
 *  const meta          = Meta(User)
 *  // --- get metadata of User ---
 *  const table         = meta.table() // 'users'
 *  const column        = meta.ColumnKeys('id') // id
 *  const columnRef     = meta.ColumnKeysReference('id') // `users`.`id`
 *  const columnTypeOf  = meta.ColumnKeysTypeOf('id') // number
 *  const columnType    = meta.ColumnKeysType('id') // Int
 *  const columns       = meta.ColumnKeyss() // ['id','uuid',...'updatedAt']
 *  const hasColumn     = meta.hasColumn('id') // false
 *  const primaryKey    = meta.primaryKey() // 'id'
 *  const indexes       = meta.indexes() // ['users.email@index']
 *  const nullable      = meta.nullable() // ['uuid','name','createdAt','updatedAt']
 *  const defaults      = meta.defaults() // { id : null, ..., status : 0, role: 'user', ..updatedAt : null  }
 *  const enums         = meta.enums('role') // [ 'admin', 'user' ]
 *  const enumsObj      = meta.enum('role', { asObject: true }) // { admin: 'admin', user: 'user' }
 * 
 */
const Meta = <M extends Model>(model: new () => M) => {
  return new ModelMeta(new model());
}

export { Meta }
export default Meta