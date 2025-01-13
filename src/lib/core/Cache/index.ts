import { MemoryCache }  from "./MemoryCache";
import { DBCache }      from "./DBCache";
import { RedisCache }   from "./RedisCache";
import options          from '../../options';

class Cache {
    
    private _driver : MemoryCache | DBCache | RedisCache = new MemoryCache()

    constructor() {

        this._chooseDriver(options.CACHE as 'db' | 'memory' | 'redis')

        return this
    }

    provider () {
        return this._driver.provider()
    }

    /**
     * The 'driver' method is used to pick a driver for the cache
     * 
     * @param {string} driver  'db' | 'memory' | 'redis'
     * @returns {this} this
     */
    driver(driver: 'db' | 'memory' | 'redis'): this {
        
        return this._chooseDriver(driver)
    }

    /**
     * The 'all' method is used get all cache
     * 
     * @returns {Promise<array>} array
     */
    async all<T = any>() : Promise<T[] | any[]> {
        return await this._driver.all()
    }

    /**
     * The 'exists' method is used get all cache
     * 
     * @param {string} key 
     * @returns {Promise<array>} array
     */
    async exists(key : string) : Promise<boolean> {
        try {

            return await this._driver.exists(key)

        } catch (e) {

            return false
        }
    }
    
    /**
     * The 'get' method is used get cache by key
     * @param {string} key
     * @returns {any} any
     */
    async get<T>(key: string) : Promise<T | any> {

        try {

            const cache = await this._driver.get(key)

            if(cache == null || cache === '') return null

            return cache

        } catch (e) {

            return null
        }
    }

    /**
     * The 'set' method is used set the cache
     * 
     * @param {string}  key
     * @param {unknown} value
     * @param {number}  ms
     * @returns {Promise<void>} void
     */
    async set(key: string, value: unknown, ms: number) : Promise<void> {
    
        try {

            await this._driver.set(key, value, ms)
            
            return 

        } catch (e) {

            return
        }
    }

    /**
     * The 'clear' method is used clear all cache
     * 
     * @returns {Promise<void>} void
     */
    async clear() : Promise<void> {
        return await this._driver.clear()
    }

    /**
     * The 'clear' method is used delete cache by key
     * 
     * @returns {Promise<void>} void
     */
    async delete(key: string) : Promise<void> {
        await this._driver.delete(key)
        return
    }

    private _chooseDriver (driver: 'db' | 'memory' | 'redis') {

        if(driver === 'db') {
            this._driver = new DBCache()
            return this
        } 
        
        if(driver != null && driver.includes('redis')) {
            this._driver = new RedisCache(String(options.CACHE))
            return this
        }
       
        this._driver = new MemoryCache()
    
        return this
    }
}

const cacheInstance = new Cache()

export { 
    cacheInstance as Cache , 
    Cache as TCache 
}
export default cacheInstance