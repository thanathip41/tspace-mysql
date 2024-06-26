declare class Cache {
    private _driver;
    constructor();
    driver(driver: 'db' | 'memory' | 'redis'): this;
    set(key: string, value: any, ms: number): Promise<void>;
    get(key: string): Promise<any>;
    clear(): Promise<void>;
    delete(key: string): Promise<void>;
}
export { Cache };
export default Cache;
