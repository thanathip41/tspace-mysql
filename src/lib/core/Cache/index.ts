import { MemoryCache } from "./MemoryCache";
import { DBCache } from "./DBCache";
import { RedisCache } from "./RedisCache";
import { Config } from "../../config";

type TCacheDrive = 
  | MemoryCache 
  | DBCache 
  | RedisCache
class Cache {
  private _driver: TCacheDrive = new MemoryCache();

  constructor() {
    this._chooseDriver(Config.CACHE as "db" | "memory" | "redis");

    return this;
  }

  public provider() {
    return this._driver.provider();
  }

  /**
   * The 'driver' method is used to pick a driver for the cache
   *
   * @param {string} driver  'db' | 'memory' | 'redis'
   * @returns {this} this
   */
  public driver(driver: "db" | "memory" | "redis"): this {
    this._chooseDriver(driver);
    return this;
  }

  /**
   * The 'all' method is used get all cache
   *
   * @returns {Promise<array>} array
   */
  public async all<T = any>(): Promise<T[] | any[]> {
    try {
      return await this._driver.all();
    } catch (err: any) {
      console.log(`\n\x1b[31mERROR: Cache ALL failed caused by '${err.message}'\x1b[0m`);
      return []
    }
  }

  /**
   * The 'exists' method is used get all cache
   *
   * @param {string} key
   * @returns {Promise<array>} array
   */
  public async exists(key: string): Promise<boolean> {
    try {
      return await this._driver.exists(key);
    } catch (err:any) {
      console.log(`\n\x1b[31mERROR: Cache EXISTS failed caused by '${err.message}'\x1b[0m`);
      return false;
    }
  }

  /**
   * The 'get' method is used get cache by key
   * @param {string} key
   * @returns {any} any
   */
  public async get<T>(key: string): Promise<T | any> {
    try {
      const cache = await this._driver.get(key);

      if (cache == null || cache === "") return null;

      return cache;
    } catch (err:any) {
      console.log(`\n\x1b[31mERROR: Cache GET failed caused by '${err.message}'\x1b[0m`);
      return null;
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
  public async set(key: string, value: unknown, ms: number): Promise<void> {
    try {
      await this._driver.set(key, value, ms);

      return;
    } catch (err:any) {
      console.log(`\n\x1b[31mERROR: Cache SET failed caused by '${err.message}'\x1b[0m`);
      return;
    }
  }

  /**
   * The 'clear' method is used clear all cache
   *
   * @returns {Promise<void>} void
   */
  public async clear(): Promise<void> {
    try {
      await this._driver.clear();
      return;
    } catch (err:any) {
      console.log(`\n\x1b[31mERROR: Cache CLEAR failed caused by '${err.message}'\x1b[0m`);
      return;
    }
  }

  /**
   * The 'clear' method is used delete cache by key
   *
   * @returns {Promise<void>} void
   */
  public async delete(key: string): Promise<void> {
    try {
      await this._driver.delete(key);
      return;

    } catch (err: any) {
      console.log(`\n\x1b[31mERROR: Cache DELETE failed caused by '${err.message}'\x1b[0m`);
      return;
    }
  }

  private _chooseDriver(driver: "db" | "memory" | "redis") {
    if (driver === "db") {
      this._driver = new DBCache();
      return;
    }

    if (driver != null && driver.includes("redis")) {
      this._driver = new RedisCache(Config.CACHE);
      return;
    }

    this._driver = new MemoryCache();

    return;
  }
}

const cacheInstance = new Cache();

export { cacheInstance as Cache, Cache as TCache };
export default cacheInstance;
