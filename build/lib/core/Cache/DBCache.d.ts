declare class DBCache {
    private _cacheTable;
    private _maxAddress;
    private _maxLength;
    private _c0x0;
    set(key: string, value: any, ms: number): Promise<void>;
    get(key: string): Promise<any>;
    clear(): Promise<void>;
    delete(key: string): Promise<void>;
    private _checkTableCacheIsExists;
}
export { DBCache };
export default DBCache;
