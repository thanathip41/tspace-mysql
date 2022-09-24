import { AbstractDB } from './AbstractDB';
declare class DB extends AbstractDB {
    [x: string]: any;
    constructor(table?: string);
    /**
     * Assign table name
     * @param {string} table table name
     * @return {this} this
     */
    table(table: string): this;
    /**
     * transaction query rollback & commit
     * @return {promise<any>}
     */
    beginTransaction(): Promise<any>;
    private _initialDB;
    private _setupDB;
}
export { DB };
export default DB;
