declare class RedisCache {
    private client;
    constructor(url: string);
    set(key: string, value: any, ms: number): Promise<void>;
    get(key: string): Promise<any>;
    clear(): Promise<void>;
    delete(key: string): Promise<void>;
}
export { RedisCache };
export default RedisCache;
