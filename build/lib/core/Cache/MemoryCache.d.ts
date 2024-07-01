declare class MemoryCache {
    private cache;
    constructor();
    set(key: string, value: any, ms: number): void;
    get(key: string): any;
    clear(): void;
    delete(key: string): void;
}
export { MemoryCache };
export default MemoryCache;
