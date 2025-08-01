import { type T, Model } from '..';

type EnumItem<C extends string, V> = {
  value: V;
  column: C;
};

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
    columns(): string[] {
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
     * @returns {Partial<T.SchemaModel<M>> | null}
     */
    defaults(): Partial<T.SchemaModel<M>> | null {
        const schemaModel = this.model.getSchemaModel();

        if (schemaModel == null) return null;

        const out: Record<string,any> = {};
        const keyword = this.model['$constants']('DEFAULT');

        for (const [key, blueprint] of Object.entries(schemaModel)) {
            const attr = blueprint['_attributes'];

            if (!attr) continue;

            const defaultAttr = Array.from(attr).find(str => str.includes(keyword));

            if (!defaultAttr) continue;

            const match = defaultAttr.match(new RegExp(`${keyword}\\s+(?:'(.*?)'|(\\S+))`));
            
            const rawValue = match?.[1] ?? match?.[2] ?? null;
        
            const value = rawValue !== null ? Number.isNaN(rawValue) ? rawValue : Number(rawValue) : null;

            if(value == null) continue;

            out[key] = value;
        }

        if(!Object.keys(out).length) return null;

        return out as Partial<T.SchemaModel<M>>
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

        return "unknown"; 
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
    enum<C extends T.Column<M>>(column: C): Record<T.Result<M>[C], T.Result<M>[C]> | null {
        const schemaModel = this.model.getSchemaModel();
        if (!schemaModel) return null;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return null;

        const blueprint = entry[1];
        
        const enumValues = blueprint['_enum'] as T.Result<M>[C][];

        return Object.fromEntries(
            enumValues.map((v) => [v, v])
        ) as Record<T.Result<M>[C], T.Result<M>[C]>;
    }
}

/**
 * The 'Meta' used to get the metadata of a Model works only when a schema is added to the Model.
 * 
 * @example
 *  import { Meta } from 'tspace-mysql';
 *  import { User } from './Model/User';
 * 
 *  const meta          = Meta(User)
 *  // --- get metadata of User ---
 *  const table         = meta.table()
 *  const column        = meta.column('id')
 *  const columnRef     = meta.columnReference('id')
 *  const columnTypeOf  = meta.columnTypeOf('id')
 *  const columnType    = meta.columnType('id')
 *  const columns       = meta.columns()
 *  const hasColumn     = meta.hasColumn('id')
 *  const primaryKey    = meta.primaryKey()
 *  const indexes       = meta.indexes()
 *  const nullable      = meta.nullable()
 *  const defaults      = meta.defaults()
 * 
 *  console.log({
 *   table,
 *   column,
 *   columnRef
 *   columnTypeOf,
 *   columnType
 *   columns,
 *   hasColumn,
 *   primaryKey,
 *   indexes,
 *   nullable,
 *   defaults,
 *  })
 */
const Meta = <M extends Model>(model: new () => M) => {
  return new ModelMeta(new model());
}

export { Meta }
export default Meta