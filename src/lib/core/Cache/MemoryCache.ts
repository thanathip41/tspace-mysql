class MemoryCache {
    private cache: Map<string, { value: any, expiredAt: number }>;

    constructor() {
        this.cache = new Map()
    }

    all () {
        const values : any[] = []

        for (const value of this.cache.values()) {
            values.push(value)
        }

        return values
    }

    exists (key : string) {
        const cached = this.cache.get(key)
        return cached != null
    }

    get(key: string) {

        const cached = this.cache.get(key)

        if (!cached) return null

        if (Date.now() > cached.expiredAt) {
            this.cache.delete(key)
            return null
        }

        return cached.value
    }

    set(key: string, value: any, ms: number) {
        
        const expiredAt = Date.now() + ms

        this.cache.set(key, { value, expiredAt })

        return
    }

    clear() {

        this.cache.clear()

        return
    }

    delete(key: string) {

        this.cache.delete(key)

        return
    }
}

export { MemoryCache }
export default MemoryCache