import Builder    from '../Builder'
import type { 
    TConnection, 
    TConnectionOptions, 
    TConnectionTransaction
} from '../../types'

abstract class AbstractDB extends Builder {

    abstract beginTransaction (): Promise<TConnectionTransaction>
    abstract generateUUID () : string
    abstract raw (sql : string) : string
    abstract escape (sql : string) : string
    abstract escapeXSS (sql : string) : string
    abstract snakeCase (sql : string) : string
    abstract camelCase (sql : string) : string
    abstract JSONObject(object : Record<string,string> , alias : string): string
    abstract jsonObject(object : Record<string,string> , alias : string): string
    abstract constants (constants ?: string) : string | Record<string,any>
    abstract caseUpdate (cases: { when : string , then : string }[]  , final ?: string): string | []
    abstract getConnection (options : TConnectionOptions): Promise<TConnection>
}

export { AbstractDB }
export default AbstractDB
