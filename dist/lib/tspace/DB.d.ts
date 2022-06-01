import AbstractDB from './AbstractDB';
declare class DB extends AbstractDB {
    [x: string]: {};
    constructor();
    table(table: string): this;
    raw(sql: string): Promise<any[]>;
    beginTransaction(): Promise<{
        rollback: () => Promise<boolean>;
        query: never[];
    }>;
    private _initDB;
    private _setupLogger;
    private _setupDB;
}
export default DB;
