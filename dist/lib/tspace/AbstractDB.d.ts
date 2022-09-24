import Database from './Database';
declare abstract class AbstractDB extends Database {
    abstract table(tableName: string): void;
    abstract beginTransaction(): Promise<any>;
}
export { AbstractDB };
export default AbstractDB;
