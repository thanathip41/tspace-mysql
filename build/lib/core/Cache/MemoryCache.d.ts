declare class MemoryCache {
    private cache;
    constructor();
    all(): Map<string, {
        value: any;
        expiredAt: number;
    }>;
    set(key: string, value: any, ms: number): void;
    get(key: string): any;
    clear(): void;
    delete(key: string): void;
}
export { MemoryCache };
export default MemoryCache;
