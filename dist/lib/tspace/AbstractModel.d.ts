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
    abstract hasOne({ name, model, pk, fk, freezeTable, child }: Relation): void;
    abstract hasMany({ name, model, pk, fk, freezeTable, child }: Relation): void;
    abstract belongsTo({ name, model, pk, fk, freezeTable, child }: Relation): void;
    abstract belongsToMany({ name, model, pk, fk, freezeTable, child }: Relation): void;
}
export default AbstractModel;
