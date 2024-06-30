declare class Cache {
    private _driver;
    constructor();
    driver(driver: 'db' | 'memory'): this;
    all(): Promise<any[] | Map<string, {
        value: any;
        expiredAt: number;
    }>>;
    set(key: string, value: any, ms: number): Promise<void>;
    get(key: string): Promise<any>;
    clear(): Promise<void>;
    delete(key: string): Promise<void>;
}
export { Cache };
export default Cache;
