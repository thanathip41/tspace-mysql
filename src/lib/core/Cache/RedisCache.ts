import { Tool } from "../../tool";

class RedisCache {
  private _redis = Tool.redis;
  private client: {
    on: Function;
    quit: Function;
    connect: Function;
    keys: Function;
    get: (v: string) => Promise<any>;
    set: (key: string, value: string, { PX }: { PX: number }) => Promise<void>;
    del: (v: string) => Promise<void>;
    flushAll: () => Promise<void>;
  };

  constructor(url: string) {
    this.client = this._redis.createClient({
      socket: {
        reconnectStrategy: () => false
      },
      url,
    });

    try {

      this.client.on("error", (err: any) => {
        console.log(`\n\x1b[31mERROR: Redis error failed caused by '${err.message}'\x1b[0m`);
      });

      this.client.connect().catch((err: any) => {
        console.log(`\n\x1b[31mERROR: Redis connection failed caused by '${err.message}'\x1b[0m`);
      });

    } catch (err:any) {
      console.log(`\n\x1b[31mERROR: Redis catch caused by '${err.message}'. Please try installing the package using : npm install redis@5.6.0 --save\x1b[0m`);
    }
  }

  provider() {
    return "redis";
  }

  async all() {
    const cacheds = await this.client.keys("*");

    const values: any[] = [];

    for (const cached in cacheds) {
      values.push(cached == null ? null : this._safetyJsonParse(cached));
    }

    return values;
  }

  async exists(key: string) {
    const cached = await this.client.get(key);

    return cached != null;
  }

  async get(key: string) {
   
    const cached = await this.client.get(key);

    if (cached == null) return null;

    return this._safetyJsonParse(cached);
  }

  async set(key: string, value: any, ms: number) {
    await this.client.set(key, JSON.stringify(value), { PX: ms });

    return;
  }

  async clear() {
    await this.client.flushAll();

    return;
  }

  async delete(key: string) {
    await this.client.del(key);

    return;
  }

  private _safetyJsonParse(value: unknown) {
    if (typeof value !== 'string') return value;

    const v = value.trim();

    if (!v || (v[0] !== '{' && v[0] !== '[')) return value;

    try {
        return JSON.parse(v);
    } catch {
        return value;
    }
  }
}

export { RedisCache };
export default RedisCache;
