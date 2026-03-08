import { Model }      from '../Model'
import { DB }         from '../DB';
import { Blueprint }  from '../Blueprint';
import { utils }      from '../../utils';
class DBCache {

    private _cacheTable   = '$cache';
    private _maxLength    = 64 * 1024;
    private _db           = () => new DB(this._cacheTable);

    provider () {
        return 'db'
    }

    async all() {
        const rows = await this._db()
        .select('*')
        .orderBy('hash')
        .orderBy('chunk')
        .get()

        const grouped = new Map<number, any[]>()

        for (const row of rows) {

            if (
                Number.isNaN(+row.expiredAt) ||
                Date.now() > +row.expiredAt
            ) {

                await this._db()
                    .where('hash', row.hash)
                    .delete()

                continue
            }

            if (!grouped.has(row.hash))
                grouped.set(row.hash, [])

            grouped.get(row.hash)!.push(row)
        }

        const values:any[] = []

        for (const chunks of grouped.values()) {

            const json = chunks
                .sort((a,b)=>a.chunk-b.chunk)
                .map(c => c.value)
                .join('')

            const parsed = this._safetyJsonParse(json)

            if (Array.isArray(parsed)) {
                values.push(...parsed)
            } else {
                values.push(parsed)
            }
        }

        return values
    }

    async exists (key : string) {
        const hash = utils.hash32(key);
        const cached = await this._db().where('hash',hash).exists()
        
        return cached
    }

    async get(key: string, options: { attempt?: number } = {}): Promise<any> {

        const attempt = options.attempt ?? 0;

        try {

            const hash = utils.hash32(key);

            const rows = await this._db()
                .select('chunk', 'value', 'expiredAt')
                .where('hash', hash)
                .orderBy('chunk')
                .get()

            if (!rows || rows.length === 0) {
                return null
            }

            const now = Date.now()
            const expiredAt = +rows[0].expiredAt

            if (Number.isNaN(expiredAt) || now > expiredAt) {

                await this._db()
                    .where('hash', hash)
                    .deleteMany()

                return null
            }

            const buffers: string[] = []

            for (const row of rows) {
                if (!row.value) continue
                buffers.push(row.value)
            }

            const json = buffers.join('')

            const parsed = this._safetyJsonParse(json)

            return parsed

        } catch (err: any) {

            const message = String(err?.message ?? '')

            if (
                message.toLowerCase().includes("doesn't exist") &&
                attempt < 3
            ) {
                await this._checkTableCacheExists()

                return this.get(key, {
                    ...options,
                    attempt: attempt + 1
                })
            }

            throw err
        }
    }

    async set(key: string, value: any, ms: number): Promise<void> {

        const expiredAt = Date.now() + ms;

        const hash = utils.hash32(key);

        const now = utils.timestamp();

        const json = JSON.stringify(value);

        const CHUNK_SIZE = this._maxLength;

        const chunks: string[] = []

        for (let i = 0; i < json.length; i += CHUNK_SIZE) {
            chunks.push(json.slice(i, i + CHUNK_SIZE))
        }

        const rows = chunks.map((value, i) => ({
            key,
            hash,
            chunk: i,
            value,
            expiredAt,
            createdAt: now,
            updatedAt: now
        }))

        await this._db()
        .where('hash', hash)
        .void()
        .deleteMany()

        await this._db()
        .insertMany(rows)
        .void()
        .save()
        .catch(err => console.log(err))

        return;
    }

    async clear() : Promise<void> {

        await this._db().truncate({ force : true})

        return
    }
    async delete(key: string) : Promise<void> {

        const hash = utils.hash32(key);

        await this._db().where('hash',hash).deleteMany()

        return
    }

    private async _checkTableCacheExists () {

        const table = this._cacheTable;

        const hasCacheTable = await new DB().hasTable(table);
        
        if(hasCacheTable) return;

        const schema = {
            id                  : new Blueprint().int().notNull().primary().autoIncrement(),
            key                 : new Blueprint().varchar(255).notNull(),
            hash                : new Blueprint().bigInt().unsigned().notNull().index(),
            chunk               : new Blueprint().int().default(0).notNull().index(),
            value               : new Blueprint().mediumText().null(),
            expiredAt           : new Blueprint().bigInt().notNull(),
            createdAt           : new Blueprint().timestamp().notNull(),
            updatedAt           : new Blueprint().timestamp().notNull()
        }

        class Cache extends Model {
            protected boot(): void {
                this.useSchema(schema)
                this.useTable(table)
            }
        }

        await new Cache().sync({  force : true , index:true })

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