import { TPagination , TConstant }  from '../../types'
import { StateHandler } from '../Handlers/State'
import { TUtils }       from '../../utils'
import { Join } from '../Join'

abstract class AbstractBuilder {

    protected $setters = [
        '$attributes',
        '$logger',
        '$utils',
        '$constants',
        '$pool',
        '$state',
        '$relation'
    ]

    protected $utils !: TUtils 
    
    protected $constants !: (name ?: keyof TConstant) => any

    protected $state !: StateHandler

    protected $pool: { query : Function , set : Function , get : Function } = {
        query: (sql :string) => {},
        set: (pool : any) => {},
        get: () => {}
    }

    protected $logger : { get: Function , set: (value: string) => void,reset : () => void , check: (value: string) => boolean }  = {
        get: () => {},
        set: (value : string) => {},
        reset: () => {},
        check: (value : string) => true || false
    }
    
    protected $attributes !: Record<string,any> | null 

    abstract void () : this
    abstract debug () : this
    abstract dd () : this
    abstract select (...columns : string[]) : this
    abstract distinct (...columns : string[]) : this
    abstract whereNull(column : string): this
    abstract whereNotNull(column: string): this
    abstract where (column : string , operator: string , value: string): this
    abstract whereSensitive (column : string , operator: string , value: string): this
    abstract whereRaw (sql : string): this
    abstract whereId (id: number): this
    abstract whereUser (id: number): this
    abstract whereEmail (value: string): this
    abstract whereQuery (callback: Function): this
    abstract whereJSON (column : string, { key, value , operator } : { key : string, value : string , operator :string }) : this
    abstract orWhere (column: string , operator: string , value: string): this
    abstract whereIn (column: string , arrayValues:any[]): this
    abstract orWhereIn (column: string , arrayValues:any[]): this
    abstract whereNotIn (column: string , arrayValues: any[]): this
    abstract whereSubQuery (column: string , subQuery: string): this
    abstract whereNotSubQuery (column: string , subQuery: string): this
    abstract orWhereSubQuery (column: string , subQuery: string): this
    abstract whereBetween (column: string , arrayValue: any[]): this
    abstract whereNotBetween (column: string , arrayValue: any[]): this
    abstract having (condition: string) : this
    abstract havingRaw (condition: string) : this
    abstract join (pk: string | ((join: Join) => Join) , fk?: string): this
    abstract rightJoin (pk: string | ((join: Join) => Join) , fk?: string): this
    abstract leftJoin (pk: string | ((join: Join) => Join) , fk?: string): this
    abstract crossJoin (pk: string | ((join: Join) => Join) , fk?: string): this
    abstract joinSubQuery ({ localKey , foreignKey , sql } : { localKey : string; foreignKey : string , sql : string }): this
    abstract orderBy (column: string , order : 'ASC' | 'asc' | 'DESC' | 'desc' ): this
    abstract orderByRaw (column: string , order : 'ASC' | 'asc' | 'DESC' | 'desc' ): this
    abstract latest (...columns: string[]): this
    abstract latestRaw (...columns: string[]): this
    abstract oldest (...columns: string[]): this
    abstract oldestRaw (...columns: string[]): this
    abstract groupBy (...columns : string[]) : this
    abstract groupByRaw (...columns : string[]) : this
    abstract random (): this
    abstract inRandom (): this
    abstract limit (number : number): this
    abstract hidden (...columns: string[]): this
    abstract insert(data: Record<string,any>): this
    abstract create(data: Record<string,any>): this
    abstract update (data: Record<string,any>,updateNotExists ?: string[]): this
    abstract updateMany (data: Record<string,any>,updateNotExists ?: string[]): this
    abstract insertNotExists(data: Record<string,any>) : this
    abstract createNotExists(data: Record<string,any>) : this
    abstract insertOrUpdate (data: Record<string,any>) : this
    abstract createOrUpdate (data: Record<string,any>) : this
    abstract updateOrInsert (data: Record<string,any>) : this
    abstract updateOrCreate (data: Record<string,any>) : this
    abstract createMultiple (data: Record<string,any>[]) : this
    abstract insertMultiple (data: Record<string,any>[]) : this
    abstract except (...columns : string[]) : this
    abstract only (...columns : string[]) : this
    abstract drop (): Promise<any>
    abstract truncate ({ force } : { force : boolean }): Promise<any>
    abstract all (): Promise<any[]>
    abstract find(id :number) : Promise<any>
    abstract pagination({ limit , page } : { limit : number , page : number}): Promise<TPagination>
    abstract paginate({ limit , page} : { limit : number , page : number}): Promise<TPagination>
    abstract first(): Promise<Record<string,any> | null>
    abstract firstOrError(message : string, options ?: Record<string,any> ): Promise<Record<string,any>>
    abstract findOneOrError(message : string, options ?: Record<string,any> ): Promise<Record<string,any>>
    abstract get (): Promise<any[]>
    abstract findOne(): Promise<Record<string,any> | null>
    abstract findMany (): Promise<any[]>
    abstract getGroupBy (column : string,): Promise<Record<string,any[] | null>>
    abstract findGroupBy (column : string,): Promise<Record<string,any[] | null>>
    abstract toArray (column : string,): Promise<any[]>
    abstract toJSON(): Promise<string>
    abstract toSQL(): string
    abstract toString(): string
    abstract count (column : string): Promise<number>
    abstract sum (column : string): Promise<number>
    abstract avg (column : string): Promise<number>
    abstract max (column : string): Promise<number>
    abstract min (column : string): Promise<number>
    abstract rawQuery (sql : string): Promise<any[]>
    abstract delete () : Promise<boolean>
    abstract deleteMany () : Promise<boolean>
    abstract exists () : Promise<boolean>
    abstract save ():  Promise<Record<string,any> | any[] | null | undefined>
    abstract increment (column : string , value : number) : Promise<number>
    abstract decrement (column : string , value : number) : Promise<number>
    abstract faker (round : number , cb ?: Function): Promise<void>
}

export  { AbstractBuilder }
export default AbstractBuilder
