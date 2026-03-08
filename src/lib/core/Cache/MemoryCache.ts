import { utils } from "../../utils";

class MemoryCache {
    private cache: Map<number, { value: any, expiredAt: number }>;

    constructor() {
        this.cache = new Map()
    }

    provider () {
        return 'memory'
    }

    async all () : Promise<any[]> {
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
            const hash = utils.hash32(key);
            const cached = this.cache.get(hash)
            return resolve(cached != null)
        });
    }

    async get(key: string): Promise<any> {
        return await new Promise((resolve) => {
            const hash = utils.hash32(key);
            const cached = this.cache.get(hash);

            if (!cached) {
                return resolve(null);
            }
    
            if (Date.now() > cached.expiredAt) {
                this.cache.delete(hash);
                return resolve(null);
            }
    
            return resolve(cached.value);
        });
    }
    
    async set(key: string, value: any, ms: number): Promise<void> {
        return new Promise((resolve) => {
            const hash = utils.hash32(key);
            const expiredAt = Date.now() + ms;
    
            this.cache.set(hash, { value, expiredAt });
    
            return resolve()
        });
    }
    
    async clear(): Promise<void> {
        return new Promise((resolve) => {
            this.cache.clear();
            return resolve()
        });
    }
    
    async delete(key: string): Promise<void> {
        return new Promise((resolve) => {
            const hash = utils.hash32(key);
            this.cache.delete(hash);
            return resolve()
        })
    }    
}

export { MemoryCache }
export default MemoryCache