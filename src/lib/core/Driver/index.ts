import { EventEmitter } from 'events'
import { TConstant, TPoolConnected } from "../../types"
import { StateHandler } from "../Handlers/State";
import Tool from '../../tools'
import { CONSTANTS } from '../../constants';

export abstract class BaseDriver extends EventEmitter {

    protected pool !: any
    protected options !: Record<string, any>
    protected MESSAGE_TRX_CLOSED = "The transaction has either been closed"

    protected abstract connect() : TPoolConnected
    protected abstract disconnect() : void
    protected abstract meta(results: any, sql: string) : void
    protected abstract returning(results : any) : any

    protected import (mod : string) {
        return Tool.import(mod)
    }
    protected _detectEventQuery ({ start , sql , results  }:{ start : number , sql : string , results : any[] }) {
        const duration = Date.now() - start
        
        if (duration > 1000 * 12) {
            const maxLength = 8_000

            if (sql.length > maxLength) {
                sql = `${sql.slice(0, maxLength)}.......`
            }

            console.log(this._messageSlowQuery(duration , sql))   
        
            this.emit('slowQuery', {
                sql,
                results,
                execution : duration
            })
        }

        this.emit('query', {
            sql,
            results,
            execution : duration
        })

        this.emit(this._detectQueryType(sql), {
            sql,
            results,
            execution : duration
        })
    }

    protected _messageSlowQuery(duration : number , sql : string) : string {

        const message = `\n\x1b[1m\x1b[31mWARING:\x1b[0m \x1b[1m\x1b[29mSlow query detected: Execution time: ${duration} ms\x1b[0m \n\x1b[33m${sql};\x1b[0m`

        return message
    }

    protected _detectQueryType(query : string) {
        const selectRegex = /^SELECT\b/i
        const updateRegex = /^UPDATE\b/i
        const insertRegex = /^INSERT\b/i
        const deleteRegex = /^DELETE\b/i
      
        if (selectRegex.test(query))  return 'SELECT'
        if (updateRegex.test(query))  return 'UPDATE' 
        if (insertRegex.test(query))  return 'INSERT' 
        if (deleteRegex.test(query))  return 'DELETE'
        
        return ''
    }

    protected _onPoolConnect (pool:any) : void {
    
        const delay = 1000 * 6.5
        
        setTimeout(() => {
            pool.getConnection((err : any , connection:any) : void => {

                if(err) {
                    const message = this._messageError.bind(this)
    
                    process.nextTick(() => {
                        if(String(err.message).includes('Pool is close')) {
                            return
                        }
                        console.log(message(err.message == null || err.message === '' ? err.code : err.message))     
                        if(this.options.CONNECTION_ERROR) return process.exit()
                    })

                    return
                }

                this.emit('connected', connection)
                
                if(this.options.CONNECTION_SUCCESS) {
                    connection.query(`SHOW VARIABLES LIKE 'version%'`, (err: any, results : any[]) => {
                        connection.release()
                        if (err) return
                        const message = [
                            results.find(v => v?.Variable_name === 'version'),
                            results.find(v => v?.Variable_name === 'version_comment')   
                        ].map(v => v?.Value).join(' - ')

                        console.log(this._messageConnected.bind(this)(`${message}`))
                    })
                }
            })
        }, delay)

        return
    }

    protected _messageConnected (message:string) : string {   
        return `
            \x1b[1m\x1b[32m
            Connection established to the database. 
            Version : ${message ?? ''} \x1b[0m
            ------------------------------- \x1b[34m
                HOST     : ${this.options.get('host')}         
                PORT     : ${this.options.get('port')}        
                DATABASE : ${this.options.get('database')}
                USERNAME : ${this.options.get('user')}          
                PASSWORD : ${this.options.get('password')} \x1b[0m 
            -------------------------------
        `
    }

    protected _messageError (message:string) : string {   
        return `
            \x1b[1m\x1b[31m
            Connection lost to database ! \x1b[0m
            ------------------------------- \x1b[33m
                HOST     : ${this.options.get('host')}         
                PORT     : ${this.options.get('port')}        
                DATABASE : ${this.options.get('database')} 
                USERNAME : ${this.options.get('user')}          
                PASSWORD : ${this.options.get('password')} \x1b[0m 
            -------------------------------
            \x1b[1m\x1b[31mError Message 
            : ${message ?? ''} \x1b[0m
        `
    }
}
export abstract class QueryBuilder {
    protected $constants = (name: keyof TConstant): string => {
      if (!CONSTANTS.hasOwnProperty(name))
        throw new Error(`Not found that constant : '${name}'`);

      return CONSTANTS[name] as string
    };
    protected $state!: StateHandler

    constructor(state: StateHandler) {
        this.$state = state
    }

    public abstract select(): string
    public abstract insert(): string
    public abstract update(): string
    public abstract remove(): string

    public abstract any() :string

    public abstract columns ({ database, table } : { 
      database : string; 
      table    : string;
    }) :string

    public abstract schema ({ database, table } : { 
      database : string; 
      table    : string;
    }) :string

    public abstract format(sql: (string | null)[]): string

    protected abstract bindJoin(values: string[]): string | null
    protected abstract bindWhere(values: string[]): string | null
    protected abstract bindOrderBy(values: string[]): string | null
    protected abstract bindGroupBy(values: string[]): string | null
    protected abstract bindSelect(values: string[], opts?: { distinct?: string }): string
    protected abstract bindFrom(args: {
        from: string
        table: string
        alias: string | null
        rawAlias: string | null
    }): string
    protected abstract bindLimit(limit: string | number): string
    protected abstract bindOffset(offset: string): string
    protected abstract bindHaving(having: string): string
}
