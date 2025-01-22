import { DB } from './DB'
import { Join } from './Join'

class SqlLike  {

    private $db     = new DB()
    private $action : 'SELECT' | 'INSERT' | 'INSERT_MUTIPLE' | 'UPDATE' | 'DELETE' = 'SELECT'
    private $values : any[] = []
    private $state : Record<string,any[]> = {
        from      : [],
        select    : [],
        distinct  : [],
        join      : [],
        leftJoin  : [],
        rightJoin : [],
        where     : [],
        orderBy   : [],
        groupBy   : [],
        offset    : [],
        limit     : [],
        having    : [],
        insert    : [],
        update    : [],
        delete    : []
    }

    private $returning ?: Record<string,any> | '*' | null = null

    select(...selecteds : string[]) {

        this.$state.select.push(() => this.$db.select(...selecteds))
        
        return this
    }

    distinct () {

        this.$state.distinct.push(() => this.$db.distinct())

        return this
    }

    from (table : string) {
        this.$state.from.push(() => this.$db.from(table))
        return this
    }

    join (localKey: `${string}.${string}` | ((join: Join) => Join) , referenceKey?: `${string}.${string}`) {
        this.$state.join.push(() => this.$db.join(localKey,referenceKey))
        return this
    }

    leftJoin (localKey: `${string}.${string}` | ((join: Join) => Join) , referenceKey?: `${string}.${string}`) {
        this.$state.leftJoin.push(() => this.$db.leftJoin(localKey,referenceKey))
        return this
    }

    rightJoin (localKey: `${string}.${string}` | ((join: Join) => Join) , referenceKey?: `${string}.${string}`) {
        this.$state.rightJoin.push(() => this.$db.rightJoin(localKey,referenceKey))
        return this
    }

    where(column: Record<string,any> , operator?: any , value?: any) {
        this.$state.where.push(() => this.$db.where(column,operator,value))
        return this
    }

    orderBy(column: string , order : 'ASC' | 'asc' | 'DESC' | 'desc' = 'ASC') {
        this.$state.orderBy.push(() => this.$db.orderBy(column,order))
        return this
    }

    groupBy(...columns : string[]) {
        this.$state.groupBy.push(() => this.$db.groupBy(...columns))
        return this
    }

    offset (n: number = 1) {
        this.$state.offset.push(() => this.$db.offset(n))
        return this
    }

    limit(n: number = 1) {
        this.$state.limit.push(() => this.$db.limit(n))
        return this
    }

    having (condition: string) {
        this.$state.having.push(() => this.$db.having(condition))
        return this
    }

    dd () {
        this.$db.dd()
        return this
    }

    delete (table : string) {
        this.$action = 'DELETE'
        this.from(table)

        this.$state.delete.push(() => this.$db.delete())
        return this
    }

    update (table : string) {
        this.$action = 'UPDATE'
        this.from(table)
        return this
    }

    set (values : Record<string,any>) {
       
        this.$state.insert.push(() => this.$db.update(values))

        this.$values = [values]

        return this
    }

    insert (table: string) {
        this.$action = 'INSERT'
        this.from(table)
        return this
    }

    values (values : Record<string,any> | Record<string,any>[]) {
        if(Array.isArray(values)) {
            this.$state.insert.push(() => this.$db.insertMultiple(values))
            this.$values = values
            this.$action = 'INSERT_MUTIPLE'
            return this
        }

        this.$state.insert.push(() => this.$db.insert(values))

        this.$values = [values]

        return this
    }

    returning (returning ?: Record<string,any> | null){
        this.$returning = returning === undefined ? '*' : returning
        return this
    }

    then<TResult1 = string, TResult2 = never>(
        onFulfilled : ((value: any[]) => TResult1 | PromiseLike<TResult1>),
        onRejected  : ((reason: any) => TResult2 | PromiseLike<TResult2>)
    ): Promise<TResult1 | TResult2> {

        Object
        .values(this.$state)
        .forEach(arr => arr.forEach(v => v()))

        const returning = async () => {
            
            let results : any[] = []
            if(this.$action === 'INSERT') {
                const inserting = await this.$db.rawQuery(this.$db['_queryBuilder']().any())
                results = await this.$db.where('id', inserting.insertId).get()
            }

            if(this.$action === 'INSERT_MUTIPLE') {
                const inserting = await this.$db.rawQuery(this.$db['_queryBuilder']().any())
                results = await this.$db
                .whereIn('id',  Array.from({ length: this.$values.length }, (_, i) => inserting.insertId + i))
                .get()
            }

            if(this.$action === 'UPDATE') {
                await this.$db.rawQuery(this.$db['_queryBuilder']().any())
                results = await this.$db.get()
            }

            if(this.$returning != null && this.$returning != '*') {
                for(const r of results) {
                    for(const key in r) {
                       if(!this.$returning[key]) {
                        delete r[key]
                       }
                    }
                }
            }
            
            return results
        }

        return Promise
        .resolve(this.$returning == null 
            ? this.$db.rawQuery(this.$db['_queryBuilder']().any())
            : returning()
        )
        .then(onFulfilled, onRejected)
    }
}

const sql = () => new SqlLike()

export { sql }
export default sql