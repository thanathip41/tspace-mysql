declare class DBCache {
    private cacheTable;
    all(): Promise<any[]>;
    set(key: string, value: any, ms: number): Promise<any[] | Record<string, any> | null | undefined>;
    get(key: string): Promise<any>;
    clear(): Promise<void>;
    delete(key: string): Promise<void>;
    private _checkTableCacheIsExists;
}
export { DBCache };
export default DBCache;
