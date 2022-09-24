import { Relation } from './Interface';
import Database from './Database';
declare abstract class AbstractModel extends Database {
    abstract useDebug(): void;
    abstract useTable(table: string): void;
    abstract useTimestamp(): void;
    abstract useSoftDelete(): void;
    abstract usePattern(pattern: string): void;
    abstract onlyTrashed(): void;
    abstract trashed(): void;
    abstract restore(): void;
    abstract with(...nameRelations: string[]): void;
    abstract withQuery(nameRelations: string, callback: Function): void;
    abstract withExists(...nameRelations: string[]): void;
    abstract hasOne({ name, model, localKey, foreignKey, freezeTable, as }: Relation): void;
    abstract hasMany({ name, model, localKey, foreignKey, freezeTable, as }: Relation): void;
    abstract belongsTo({ name, model, localKey, foreignKey, freezeTable, as }: Relation): void;
    abstract belongsToMany({ name, model, localKey, foreignKey, freezeTable, as }: Relation): void;
}
export { AbstractModel };
export default AbstractModel;
