import { EventEmitter } from 'events'
import { TPoolConnected } from "../../types"
import Tool from '../../tools'

abstract class BaseDriver extends EventEmitter {

    protected pool !: any
    protected options !: Record<string, any>

    constructor(options: Record<string, any>) {  
        super()
        this.options = options
    }
    abstract connect() : TPoolConnected

    abstract disconnect() : void

    protected import (mod : string) {
        return Tool.import(mod)
    }

    protected _detectEventQuery ({ start , sql , results  }:{ start : number , sql : string , results : any[] }) {
        const duration = Date.now() - start
        
        if (duration > 1000 * 10) {
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
      
        if (selectRegex.test(query))  return 'select'
        if (updateRegex.test(query))  return 'update' 
        if (insertRegex.test(query))  return 'insert' 
        if (deleteRegex.test(query))  return 'delete'
        
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

export { BaseDriver }
export default BaseDriver