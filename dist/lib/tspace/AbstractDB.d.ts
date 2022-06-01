import Database from './Database';
declare abstract class AbstractDB extends Database {
    abstract table(tableName: string): void;
    abstract raw(sql: string): Promise<any>;
    abstract beginTransaction(): Promise<any>;
}
export default AbstractDB;
