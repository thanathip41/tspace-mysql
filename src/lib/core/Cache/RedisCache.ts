import { Tools } from '../../tools'

class RedisCache {
    private _redis : { createClient : Function }  = Tools.import('redis')
    private client : { 
        on : Function 
        quit : Function 
        connect : Function 
        keys : Function 
        get : (v : string) => Promise<any>
        setEx : (key : string , expiredAt : number , value : string) => Promise<void>
        del : (v : string) => Promise<void>
        flushAll : () => Promise<void>
    }

    constructor(url : string) {
        
        this.client = this._redis.createClient({
            url
        })
  
        this.client.on("error", (err : any) => {
            if(err) {
                console.log(err)
                this.client.quit()
            }
        })

        this.client.connect()

    }

    async all () {

        const cacheds = await this.client.keys('*')

        const values : any[] = []

        for(const cached in cacheds) {

            values.push(cached == null 
                ? null 
                : this._safetyJsonParse(cached)
            )
        }

        return values
    }

    async exists (key: string) {

        const cached = await this.client.get(key)

        return cached != null
    }

    async get(key: string) {

        const cached = await this.client.get(key)

        if (cached == null) return null
        
        return this._safetyJsonParse(cached)
    }

    async set(key: string, value: any, ms: number) {

        const expiredAt = Date.now() + ms
           
        await this.client.setEx(key , expiredAt , JSON.stringify(value))

        return
    }

    
    async clear() {

        await this.client.flushAll()

        return
    }

    async delete(key: string) {

        await this.client.del(key)

        return
    }

    private _safetyJsonParse (value : any) {
        try {

            return JSON.parse(value)
            
        } catch (e) {

            return value
        }
    }
}

export { RedisCache }
export default RedisCache