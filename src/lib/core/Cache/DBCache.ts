import { DB , Blueprint, Schema } from '..'
import utils  from '../../utils'
import CONSTANTS from '../../constants'

class DBCache {

    private _cacheTable   = '$cache'
    private _v0x          = 'v0x'
    private _maxAddress   = 10
    private _maxLength    = 100
    private _db           = () => new DB(this._cacheTable)

    async all () {
        
        const cacheds = await this._db().get()

        const values : any[] = []

        for(const cached of cacheds) {

            for(let i = 0 ; i < this._maxAddress; i++) {
                const find = cached[this._addressNumber(i)]
                if(find == null || find === '') break

                if (
                    Number.isNaN(+cached.expiredAt) || 
                    new Date() > new Date(+cached.expiredAt)
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

            const cached = await this._db().where('key',key).findOne()

            if (!cached) return null

            if (
                Number.isNaN(+cached.expiredAt) || 
                new Date() > new Date(+cached.expiredAt)
            ) {

                await this._db()
                .where('key',key)
                .delete()

                return null
            }

            const value = this._safetyJsonParse(cached[this._addressNumber(0)])

            if(!Array.isArray(value)) return value

            const values : any[] = []

            for(let i = 0 ; i < this._maxAddress; i++) {
                const find = cached[this._addressNumber(i)]

                if(find == null || find === '') break

                const maybeArray = this._safetyJsonParse(find)

                if(Array.isArray(maybeArray)) {
                    values.push(...this._safetyJsonParse(find))
                    continue
                }

                values.push(this._safetyJsonParse(find))
            }

            return values

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

        const expiredAt = Date.now() + ms

        if(!Array.isArray(value)) {
            await this._db().create({
                key,
                [this._addressNumber(0)] : JSON.stringify(value),
                expiredAt,
                createdAt : utils.timestamp(),
                updatedAt : utils.timestamp()
            })
            .void()
            .save()
    
            return
        }

        const avg = value.length / this._maxAddress
        const chunked = utils.chunkArray(value, avg > this._maxLength ? avg : this._maxLength)
        const cache : Record<string,any> = {}

        for(const [index , value] of chunked.entries()) {
            cache[this._addressNumber(index)] = JSON.stringify(value)
        }

        await this._db().create({
            key,
            ...cache,
            expiredAt,
            createdAt : utils.timestamp(),
            updatedAt : utils.timestamp()
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

        const checkTables = await new DB().rawQuery(`${CONSTANTS.SHOW_TABLES} ${CONSTANTS.LIKE} '${table}'`)
        
        const existsTables = checkTables.map((c: { [s: string]: unknown } | ArrayLike<unknown>) => Object.values(c)[0])[0]

        if(existsTables != null) return

        let address : Record<string,any> = {}

        for(let i = 0; i < this._maxAddress; i++) {
            address[this._addressNumber(i)] = new Blueprint().longText().null()
        }

        const schemaLogger = {
            id                  : new Blueprint().int().notNull().primary().autoIncrement(),
            key                 : new Blueprint().longText().notNull(),
            ...address,
            expiredAt           : new Blueprint().varchar(100).null(),
            createdAt           : new Blueprint().timestamp().null(),
            updatedAt           : new Blueprint().timestamp().null()
        }

        const sql = new Schema().createTable(`\`${table}\``,schemaLogger)

        await new DB().rawQuery(sql)

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

export { DBCache }
export default DBCache