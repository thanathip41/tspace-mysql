import { type T, Model } from '..';
class ModelMeta<M extends Model> {
    constructor(private model: M) {}

    /**
     * 
     * @returns {string}
     */
    table(): string {
        return this.model.toTableName();
    }

    /**
     * 
     * @returns {string}
     */
    column(column: T.Column<M>): T.Column<M> {
        return column;
    }

    /**
     * 
     * @returns {`${string}.${T.Column<M>}`}
     */
    columnReference (column: T.Column<M>) : `${string}.${T.Column<M>}` {
        return `\`${this.table()}\`.\`${String(column)}\``;
    }

    /**
     * 
     * @returns {`${string}.${T.Column<M>}`}
     */
    columnRef (column: T.Column<M>) : `${string}.${T.Column<M>}` {
        return this.columnReference(column);
    }
    
    /**
     * 
     * @returns {string[]}
     */
    columns(): T.Column<M>[] {
        const schemaModel = this.model.getSchemaModel();

        const columns: T.Column<M>[] = schemaModel == null
        ? []
        : Object.entries(schemaModel).map(([key]) => {
            return key
        });

        return columns
    }

    /**
     * 
     * @returns {boolean}
     */
    hasColumn(name: string): boolean {
        const schemaModel = this.model.getSchemaModel();

        const columns : T.Column<M>[] = schemaModel == null
        ? []
        : Object.entries(schemaModel).map(([key]) => {
            return key
        });

        return columns.includes(name);
    }

    /**
     * 
     * @returns {string | undefined}
     */
    primaryKey(): string | undefined {
        const schemaModel = this.model.getSchemaModel();

        if(schemaModel == null) return undefined

        return Object
        .entries(schemaModel)
        .find(([key, blueprint]: any) => {
            const attr = blueprint['_attributes'];

            if(Array.from(attr).includes(this.model['$constants']('PRIMARY_KEY'))) {
                return key;
            }

            return undefined;
        })?.[0];
    }

    /**
     * 
     * @returns {string[]}
     */
    indexes(): string[] {
        const schemaModel = this.model.getSchemaModel();

        if(schemaModel == null) return []

        return Object
        .entries(schemaModel)
        .map(([key, blueprint]: any) => {
            const index = blueprint['_index'];
            if(index == null) return undefined;
            if(index === '') return `unknown_index_${key}`
            return index
        })
        .filter(v => v != null)
    }

    /**
     * 
     * @returns {string[]}
     */
    nullable(): string[] {
        const schemaModel = this.model.getSchemaModel();

        if(schemaModel == null) return []

        return Object
        .entries(schemaModel)
        .map(([key, blueprint]: any) => {
            const attr = blueprint['_attributes'];

            if(Array.from(attr).includes(this.model['$constants']('NULL'))) {
                return key;
            }

            return undefined;
        })
        .filter(v => v != null);
    }

    /**
     * 
     * @returns {T.SchemaModel<M> | null}
     */
    defaults(): T.SchemaModel<M> | null {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return null;

        const results = Object.fromEntries(
            Object.entries(schemaModel).map(([key, blueprint]) => [key, blueprint['_default']])
        );

        return Object.keys(results).length ? (results as T.SchemaModel<M>) : null;
    }

    /**
     * 
     * @param {string} column 
     * @returns {string | undefined}
     */
    columnTypeOf(column: T.Column<M>): string | undefined {
        const schemaModel = this.model.getSchemaModel();

        if (!schemaModel) return undefined;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return undefined;

        const blueprint = entry[1];

        const value = blueprint['_valueType']

        if (value === Number)  return "number";
        if (value === String)  return "string";
        if (value === Boolean) return "boolean";
        if (value === Date)    return "date";

        return undefined; 
    }

    /**
     * 
     * @param {string} column 
     * @returns {string | undefined}
     */
    columnType (column: T.Column<M>): string | undefined {
        const schemaModel = this.model.getSchemaModel();

        if (!schemaModel) return undefined;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return undefined;

        const blueprint = entry[1];
        
        return blueprint['_type'];
    }

    /**
     * 
     * @param {string} column 
     * @returns {Record<T.Result<M>[C], T.Result<M>[C]> | null}
     */
    enums<C extends keyof T.Result<M>>(
        column: C,
        options?: { asObject?: false }
    ): T.Result<M>[C][];
    enums<C extends keyof T.Result<M>>(
        column: C,
        options: { asObject: true }
    ): Record<T.Result<M>[C], T.Result<M>[C]> | null;
    enums<C extends keyof T.Result<M>>(
        column: C,
        options: { asObject?: boolean } = {}
    ): T.Result<M>[C][] | (Record<T.Result<M>[C], T.Result<M>[C]> | null) {

        const schemaModel = this.model.getSchemaModel();

        const asObject = options.asObject ?? false;

        if (!schemaModel) return options.asObject ? null : [];

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return asObject ? null : [];

        const blueprint = entry[1];
        const enumValues = blueprint['_enum'] as T.Result<M>[C][];

        if (asObject) {
            return enumValues.reduce((prev, curr) => {
                prev[curr] = curr;
                return prev;
            }, {} as Record<T.Result<M>[C], T.Result<M>[C]>);
        }

        return enumValues;
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
 *  const column        = meta.column('id') // id
 *  const columnRef     = meta.columnReference('id') // `users`.`id`
 *  const columnTypeOf  = meta.columnTypeOf('id') // number
 *  const columnType    = meta.columnType('id') // Int
 *  const columns       = meta.columns() // ['id','uuid',...'updatedAt']
 *  const hasColumn     = meta.hasColumn('id') // false
 *  const primaryKey    = meta.primaryKey() // 'id'
 *  const indexes       = meta.indexes() // ['users.email@index']
 *  const nullable      = meta.nullable() // ['uuid','name','createdAt','updatedAt']
 *  const defaults      = meta.defaults() // { id : null, ..., status : 0, role: 'user', ..updatedAt : null  }
 *  const enums         = meta.enums('role') // [ 'admin', 'user' ]
 * 
 */
const Meta = <M extends Model>(model: new () => M) => {
  return new ModelMeta(new model());
}

export { Meta }
export default Meta