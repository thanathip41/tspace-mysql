import { Model }      from '../Model'
import { DB }         from '../DB';
import { Blueprint }  from '../Blueprint';
import { utils }      from '../../utils';

class DBCache {

    private _cacheTable   = 'tspace_cache'
    private _v0x          = 'v0x'
    private _maxAddress   = 10
    private _maxLength    = 100
    private _db           = () => new DB(this._cacheTable)

    provider () {
        return 'db'
    }

    async all () {
        
        const cacheds = await this._db().get()

        const values : any[] = []

        for(const cached of cacheds) {

            for(let i = 0 ; i < this._maxAddress; i++) {
                const find = cached[this._addressNumber(i)]
                if(find == null || find === '') break

                if (
                    Number.isNaN(+cached.expired_at) || 
                    new Date() > new Date(+cached.expired_at)
                ) {

                    await this._db()
                    .where('key',cached.key)
                    .delete()
        
                    continue
                }

                const maybeArray = this._safetyJsonParse(find)
    
                if(Array.isArray(maybeArray)) {
                    values.push(...this._safetyJsonParse(find))
                    continue
                }
    
                values.push(this._safetyJsonParse(find))
            }
        }

        return values
    }

    async exists (key : string) {
        
        const cached = await this._db().where('key',key).exists()
        
        return cached
    }
    async get(key: string) : Promise<any> {

        try {

            const cached = await this._db()
            .where('key',key)
            .first()

            if (!cached) return null

            const now = Date.now();

            const expiredAt = +cached.expired_at;

            if (Number.isNaN(expiredAt) || now > expiredAt) {

                await this._db()
                .where('key',key)
                .deleteMany()

                return null
            }

            const value = this._safetyJsonParse(cached[this._addressNumber(0)])

            if(!Array.isArray(value)) return value

            const values : any[] = []

            for(let i = 0 ; i < this._maxAddress; i++) {
                const find = cached[this._addressNumber(i)]

                if(find == null || find === '') break

                const parsed = this._safetyJsonParse(find)

                if(Array.isArray(parsed)) {
                    values.push(...parsed)
                    continue
                }

                values.push(parsed)
            }

            return values.length === 1 ? values[0] : values;

        } catch (err : any) {

            const message = String(err?.message ?? '')

            if(message.toLocaleLowerCase().includes("doesn't exist")) {
                await this._checkTableCacheExists()
                return await this.get(key)
            }

            throw err

        }
    }
    async set(key: string, value: any, ms: number) : Promise<void> {

        const expiredAt = +new Date() + ms

        if(!Array.isArray(value)) {
            await this._db()
            .create({
                key,
                [this._addressNumber(0)] : JSON.stringify(value),
                expired_at : expiredAt,
                created_at : utils.timestamp(),
                updated_at : utils.timestamp()
            })
            .void()
            .save()
    
            return
        }

        const avg = value.length / this._maxAddress
        const chunked = utils.chunkArray(value, avg > this._maxLength ? avg : this._maxLength)
        const caches : Record<string,any> = {}

        for(const [index , value] of chunked.entries()) {
            caches[this._addressNumber(index)] = JSON.stringify(value)
        }

        await this._db()
        .create({
            key,
            ...caches,
            expired_at : expiredAt,
            created_at : utils.timestamp(),
            updated_at : utils.timestamp()
        })
        .void()
        .save()

        return
    }
    async clear() : Promise<void> {

        await this._db().truncate({ force : true})

        return
    }
    async delete(key: string) : Promise<void> {

        await this._db().where('key',key).delete()

        return
    }

    private _addressNumber (number : number) {

        const index = `0${number}`.slice(-2)
        return `${this._v0x}${index}`
    }

    private async _checkTableCacheExists () {

        const table = this._cacheTable

        const hasTable = await new DB().hasTable(table);
        
        if(hasTable) return;

        let addresses : Record<string,any> = {}

        for(let i = 0; i < this._maxAddress; i++) {
            addresses[this._addressNumber(i)] = new Blueprint().json().null()
        }

        const schema = {
            id                  : new Blueprint().int().notNull().primary().autoIncrement(),
            key                 : new Blueprint().varchar(255).notNull().index(),
            ...addresses,
            expired_at           : new Blueprint().varchar(255).notNull(),
            created_at           : new Blueprint().timestamp().notNull(),
            updated_at           : new Blueprint().timestamp().notNull()
        }

        class Cache extends Model {
            protected boot(): void {
                this.useSchema(schema)
                this.useTable(table)
            }
        }

        await new Cache().sync({ force: true, index:true })

        return
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

export { DBCache }
export default DBCache