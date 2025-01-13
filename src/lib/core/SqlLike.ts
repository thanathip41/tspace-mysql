import { DB } from './DB'
import { Join } from './Join'

class SqlLike  {

    private $db = new DB()
    private $state : Record<string,any[]> = {
        from      : [],
        select    : [],
        join      : [],
        leftJoin  : [],
        rightJoin : [],
        where     : [],
        orderBy   : [],
        groupBy   : [],
        offset    : [],
        limit     : [],
        having    : [],
        insert    : []
    }

    private $returning : Record<string,any> | null = null

    select(...selecteds : string[]) {

        this.$state.select.push(() => this.$db.select(...selecteds))
        
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

    where(column: string | Record<string,any> , operator?: any , value?: any) {
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

    update (table : string) {

        return this
    }

    set (data : Record<string,any>) {

        return this
    }

    insert (table: string) {
        this.from(table)
        return this
    }

    values (values : Record<string,any> | Record<string,any>[]) {
        if(Array.isArray(values)) {
            this.$state.insert.push(() => this.$db.insertMultiple(values))
            return this
        }

        this.$state.insert.push(() => this.$db.insert(values))

        return this
    }

    returning (returning : Record<string,any>) {
        this.$returning = returning
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
            const inserting = await this.$db.rawQuery(this.$db['_queryBuilder']().any())
            const results = await this.$db.where('id', inserting.insertId).get()

            if(this.$returning != null) {
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