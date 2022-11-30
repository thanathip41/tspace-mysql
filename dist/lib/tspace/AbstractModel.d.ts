import { Relation, RelationQuery } from './Interface';
import Database from './Database';
declare abstract class AbstractModel extends Database {
    abstract useUUID(): this;
    abstract usePrimaryKey(primaryKey: string): this;
    abstract useRegistry(): this;
    abstract useDebug(): this;
    abstract useTable(table: string): this;
    abstract useTablePlural(): this;
    abstract useTableSingular(): this;
    abstract useTimestamp(): this;
    abstract useSoftDelete(): this;
    abstract usePattern(pattern: string): this;
    abstract onlyTrashed(): Promise<any>;
    abstract trashed(): Promise<any>;
    abstract restore(): Promise<any>;
    abstract ignoreSoftDelete(): this;
    abstract disableSoftDelete(): this;
    abstract registry(func: {
        [key: string]: Function;
    }): this;
    abstract with(...nameRelations: string[]): this;
    abstract withQuery(nameRelations: string, callback: Function): this;
    abstract withExists(...nameRelations: string[]): this;
    abstract hasOne({ name, model, localKey, foreignKey, freezeTable, as }: Relation): this;
    abstract hasMany({ name, model, localKey, foreignKey, freezeTable, as }: Relation): this;
    abstract belongsTo({ name, model, localKey, foreignKey, freezeTable, as }: Relation): this;
    abstract belongsToMany({ name, model, localKey, foreignKey, freezeTable, as }: Relation): this;
    abstract hasOneQuery({ name, model, localKey, foreignKey, freezeTable, as }: RelationQuery, callback: Function): this;
    abstract hasManyQuery({ name, model, localKey, foreignKey, freezeTable, as }: RelationQuery, callback: Function): this;
    abstract belongsToQuery({ name, model, localKey, foreignKey, freezeTable, as }: RelationQuery, callback: Function): this;
    abstract belongsToManyQuery({ name, model, localKey, foreignKey, freezeTable, as }: RelationQuery, callback: Function): this;
}
export { AbstractModel };
export default AbstractModel;
