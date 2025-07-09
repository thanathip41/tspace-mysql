import { type T, Model } from '..';

class ModelMeta<M extends Model> {
    constructor(private model: M) {}
    table() {
        return this.model.toTableName();
    }

    column(column: T.Column<M>) {
        return column;
    }

    columnReference (column: T.Column<M>) : `${string}.${T.Column<M>}` {
        return `\`${this.table()}\`.\`${String(column)}\``;
    }
    
    columns() {
        const schemaModel = this.model.getSchemaModel();

        const columns: T.Column<M>[] = schemaModel == null
        ? []
        : Object.entries(schemaModel).map(([key]) => {
            return key
        });

        return columns
    }

    hasColumn(name: string) {
        const schemaModel = this.model.getSchemaModel();

        const columns : T.Column<M>[] = schemaModel == null
        ? []
        : Object.entries(schemaModel).map(([key]) => {
            return key
        });

        return columns.includes(name);
    }

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

            const value = defaultAttr.match(new RegExp(`${keyword}\\s+'(.*?)'`))?.[1] ?? null;

            out[key] = value;
        }

        return out as Partial<T.SchemaModel<M>>
    }

    columnTypeOf(column: T.Column<M>) {
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

    columnType (column: T.Column<M>): string | undefined {
        const schemaModel = this.model.getSchemaModel();
        if (!schemaModel) return undefined;

        const entry = Object.entries(schemaModel).find(([key]) => key === column);

        if (!entry) return undefined;

        const blueprint = entry[1];
        
        return blueprint['_type'];
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