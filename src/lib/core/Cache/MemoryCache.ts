class MemoryCache {
    private cache: Map<string, { value: any, expiredAt: number }>;

    constructor() {
        this.cache = new Map()
    }

    provider () {
        return 'memory'
    }

    async all  () : Promise<any[]> {
        return new Promise((resolve) => {
            const values : any[] = []

            for (const value of this.cache.values()) {
                values.push(value)
            }

            return resolve(values)
        })
    }

    exists(key: string): Promise<boolean> {
        return new Promise((resolve) => {
            const cached = this.cache.get(key)
            return resolve(cached != null)
        });
    }

    async get(key: string): Promise<any> {
        return await new Promise((resolve) => {
            const cached = this.cache.get(key);
    
            if (!cached) {
                return resolve(null);
            }
    
            if (Date.now() > cached.expiredAt) {
                this.cache.delete(key);
                return resolve(null);
            }
    
            return resolve(cached.value);
        });
    }
    
    set(key: string, value: any, ms: number): Promise<void> {
        return new Promise((resolve) => {
            const expiredAt = Date.now() + ms;
    
            this.cache.set(key, { value, expiredAt });
    
            return resolve()
        });
    }
    
    clear(): Promise<void> {
        return new Promise((resolve) => {
            this.cache.clear();
            return resolve()
        });
    }
    
    delete(key: string): Promise<void> {
        return new Promise((resolve) => {
            this.cache.delete(key);
            return resolve()
        })
    }    
}

export { MemoryCache }
export default MemoryCache