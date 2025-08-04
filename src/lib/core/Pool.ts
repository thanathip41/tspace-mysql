import { EventEmitter } from 'events'
import { 
    createPool,
    type Pool as TPool,
    type PoolConnection as TPoolConnection,
    QueryError
} from 'mysql2'
import { Tool } from '../tools'
import options , { 
    loadOptionsEnvironment 
} from '../options'

import type { 
    TConnection,
    TCreateNewConnection, 
    TOptions,
    TPoolEvent
} from '../types'

export class PoolConnection extends EventEmitter {
    
    private OPTIONS = this._loadOptions()
     
    /**
     * 
     * @Init a options connection pool
     */
    constructor(options ?: TOptions) {  
        super()
        if(options) {
            this.OPTIONS = new Map<string, number | boolean | string>(
                Object.entries({
                    ...Object.fromEntries(this.OPTIONS), 
                    ...JSON.parse(JSON.stringify(options))
                })
            )
        }
    }

    connected (): TConnection & { format ?: (sql : string) => string } {
        const pool : any = this._connectPool()
        pool.format =  (sql:string) => this.format(sql)
        return pool
    }

    public createNewConnected () : TCreateNewConnection {

        const pool : TPool = createPool(Object.fromEntries(this.OPTIONS))

        return {
            on : (event : TPoolEvent , data) => {
                return this.on(event,data)
            },
            query : (sql : string) => {
                return new Promise<any[]>((resolve, reject)=>{
                    const start : number = Date.now()
                  
                    pool.query(sql , (err : QueryError, results: any[]) => {   
                                  
                        if(err) return reject(err)

                        this._detectEventQuery({
                            start, 
                            sql,
                            results
                        })

                        return resolve(results)
                    })
                })
            },
            connection : () =>  {

                let closeTransction = false;

                return new Promise((resolve, reject) => {
                    pool.getConnection((err, connection : TPoolConnection) => {

                        if (err) return reject(err)

                        const query = (sql: string) => {
                            const start : number = Date.now()
                            return new Promise<any[]>((ok, fail) => {

                                if(closeTransction) {
                                    return fail(new Error('The transaction has either been closed'));
                                }

                                connection.query(sql, (err : QueryError, results: any[]) => {
            
                                    connection.release()
                                   
                                    if (err) {
                                        return fail(err)
                                    }

                                    this._detectEventQuery({ start , sql , results })

                                    return ok(results)
                                })
                            })
                        }

                        const startTransaction = async () => {
                            
                            await query('START TRANSACTION')
                            .catch(err => reject(err))
                            
                            return
                        }

                        const commit = async () => {
                           
                            await query('COMMIT')
                            .catch(err => reject(err))

                            return
                        }

                        const rollback = async () => {
                            
                            await query('ROLLBACK')
                            .catch(err => reject(err))

                            // when rollback will end of transction
                            await end()

                            return
                        }

                        const end = async () => {

                            await new Promise<void>(resolve => setTimeout(() => {
                                // After commit the transaction, you can't perform any actions with this transaction.
                                connection.destroy()

                                // After destroying the connection, it will be removed from the connection pool.
                                pool.end()

                                closeTransction = true

                                return resolve()

                            }, 500))

                            return

                        }
            
                        return resolve({ 
                            on : (event : TPoolEvent , data : any) => this.on(event,data),
                            query,
                            startTransaction, 
                            commit, 
                            rollback,
                            end
                        })
                    })
                })
            }
        }
    }

    private _detectEventQuery ({ start , sql , results  }:{ start : number , sql : string , results : any[] }) {
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

    private _detectQueryType(query : string) {
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

    private _defaultOptions () {
        return new Map<string, number | boolean | string>(
            Object.entries({
                connectionLimit         : Number(options.CONNECTION_LIMIT),
                dateStrings             : Boolean(options.DATE_STRINGS),
                connectTimeout          : Number(options.TIMEOUT),
                waitForConnections      : Boolean(options.WAIT_FOR_CONNECTIONS),
                queueLimit              : Number(options.QUEUE_LIMIT),
                charset                 : String(options.CHARSET),
                host                    : String(options.HOST),
                port                    : Number(options.PORT),
                database                : String(options.DATABASE),
                user                    : String(options.USERNAME),
                password                : String(options.PASSWORD),
                multipleStatements      : Boolean(options.MULTIPLE_STATEMENTS),
                enableKeepAlive         : Boolean(options.ENABLE_KEEP_ALIVE),
                keepAliveInitialDelay   : Number(options.KEEP_ALIVE_DELAY),
                driver                  : String(options.DRIVER ?? 'mysql2')
            })
        )
    }

    private _loadOptions() {
        try { 
            /**
             *  @source data
             *  source db {
             *       host               = localhost
             *       port               = 3306
             *       database           = npm
             *       user               = root
             *       password           =
             *       connectionLimit    = 
             *       dateStrings        = 
             *       connectTimeout     = 
             *       waitForConnections = 
             *       queueLimit         = 
             *       charset            =
             *   }
             */
            const dbOptionsPath = Tool.path.join(Tool.path.resolve() ,'db.tspace')
            const dbOptionsExists = Tool.fs.existsSync(dbOptionsPath)

            if(!dbOptionsExists) return this._defaultOptions()

            const dbOptions : string = Tool.fs.readFileSync(dbOptionsPath,'utf8')

            const options = this._convertStringToObject(dbOptions)

            if(options == null) return this._defaultOptions()

            return new Map<string, number | boolean | string>(Object.entries(options))

        } catch (e) {

            return this._defaultOptions()
        }
    }

    private _convertStringToObject (str : string, target = 'db') : Record<string,any> | null {
        if(str.toLocaleLowerCase().includes('#ignore')) return null
        str = str.trim()
        const sources : string[] = str.split('\n\n')
        if(!sources.length) return null
        const lines : string[] = sources[0].split('\r\n')
        if(!lines.length) return null
        const sourceObj  : Record<string,any> = {}
        let targetKey : string = ''
        for(const line of lines) {
            let [key, value] = line.split('=')
            const sourceKey :any = key.match(/source\s+(\w+)/)
            const sourceKeyClose :any = key.match(/}/g)

            if(sourceKey != null) {
                targetKey = sourceKey[1]
                continue
            }

            if(sourceKeyClose != null && sourceKeyClose.length) {
                targetKey = ''
                continue
            }

            if(key == null || value == null) continue

            key = key.trim()
            value = value.trim()
            if(!sourceObj.hasOwnProperty(targetKey)) sourceObj[targetKey] = {}
            sourceObj[targetKey][key] = value 
        }
      
        return this._covertKeyTypeToCorrectType(sourceObj[target]) || null
    }

    private _covertKeyTypeToCorrectType (data: Record<string,any>) : Record<string,any>  {
        for(const [key, value] of Object.entries(data)) {
            if(value == null) continue
            if(typeof value === 'string' && ['true','false'].some(v => value.toLowerCase() === v)) {
                data[key] = JSON.parse(value.toLowerCase())
                continue
            }
            if(/^[0-9]+$/.test(value)) data[key] = +value
        }
        return data
    }

    private _onPoolConnect (pool : TPool) : void {

        const delay = 1000 * 6.5
       
        setTimeout(() => {
            pool.getConnection((err : any , connection : TPoolConnection) : void => {

                if(err) {
                    const message = this._messageError.bind(this)
    
                    process.nextTick(() => {
                        if(String(err.message).includes('Pool is close')) {
                            return
                        }
                        console.log(message(err.message == null || err.message === '' ? err.code : err.message))     
                        if(options.CONNECTION_ERROR) return process.exit()
                    })

                    return
                }

                this.emit('connected', connection)
                
                if(options.CONNECTION_SUCCESS) {
                    connection.query(`SHOW VARIABLES LIKE 'version%'`, (err, results : any[]) => {
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

    private _messageConnected (message:string) : string {   
        return `
            \x1b[1m\x1b[32m
            Connection established to the database. 
            Version : ${message ?? ''} \x1b[0m
            ------------------------------- \x1b[34m
                HOST     : ${this.OPTIONS.get('host')}         
                PORT     : ${this.OPTIONS.get('port')}        
                DATABASE : ${this.OPTIONS.get('database')}
                USERNAME : ${this.OPTIONS.get('user')}          
                PASSWORD : ${this.OPTIONS.get('password')} \x1b[0m 
            -------------------------------
        `
    }

    private _messageError (message:string) : string {   
        return `
            \x1b[1m\x1b[31m
            Connection lost to database ! \x1b[0m
            ------------------------------- \x1b[33m
                HOST     : ${this.OPTIONS.get('host')}         
                PORT     : ${this.OPTIONS.get('port')}        
                DATABASE : ${this.OPTIONS.get('database')} 
                USERNAME : ${this.OPTIONS.get('user')}          
                PASSWORD : ${this.OPTIONS.get('password')} \x1b[0m 
            -------------------------------
            \x1b[1m\x1b[31mError Message 
            : ${message ?? ''} \x1b[0m
        `
    }

    private _messageSlowQuery(duration : number , sql : string) : string {

        const message = `\n\x1b[1m\x1b[31mWARING:\x1b[0m \x1b[1m\x1b[29mSlow query detected: Execution time: ${duration} ms\x1b[0m \n\x1b[33m${sql};\x1b[0m`

        return message
    }

    private _connectPool (): TConnection {
        const options : Record<string,any> = JSON.parse(JSON.stringify({
            ...Object.fromEntries(this.OPTIONS),
            driver : undefined
        }))
      
        switch (this.driver()) {
            case 'mysql':
            case 'mysql2': {
                const mysql = Tool.import(this.driver())
                const pool = mysql.createPool(options)
                
                /**
                 * After the server is listening, verify that the pool has successfully connected to the database.
                 * @param {Pool} pool
                 * @returns {void}
                 */
                this._onPoolConnect(pool)
                
                pool.on('release', (connection: unknown) => {
                    this.emit('release', connection)
                })
        
                return {
                    on : (event : TPoolEvent , data: any) => {
                        return this.on(event,data)
                    },
                    query : (sql : string) : Promise<any[]> => {
                        return new Promise<any[]>((resolve, reject)=>{
                            return pool.query(sql , (err: any, results: any[]) => {                                        
                                if(err) return reject(err)
                                return resolve(this._result(results))
                            })
                        })
                    },
                    connection : async () =>  {
                        return new Promise((resolve, reject) => {
                            pool.getConnection((err: any, connection : any) => {
        
                                if (err) return reject(err)

                                const query = (sql: string) => {
        
                                    return new Promise<any[]>((ok, fail) => {
                                        connection.query(sql, (err : any, results: any[]) => {
                                            if (err)  return fail(err)
                                            return ok(this._result(results))
                                        })
                                    })
                                }

                                return resolve({ 
                                    on : (event : TPoolEvent , data : any) => this.on(event,data),
                                    query
                                })
                            })
                        })
                    }
                }
            }

            case 'mariadb': {
                const mariadb = Tool.import(this.driver())
                const connectPool = mariadb.createPool(options)
                const pool = connectPool.getConnection().catch((err : any) => {
                    const message = this._messageError.bind(this)
        
                    process.nextTick(() => {
                        console.log(message(err?.message))     
                        return process.exit()
                    })
                })
                
                return {
                    on : (event : TPoolEvent , data: any) => {
                        return this.on(event,data)
                    },
                    query : (sql : string) => {
                        return new Promise<any[]>((resolve, reject)=>{
                            return pool.query(sql)
                            .then((results:any) => resolve(this._result(results)))
                            .catch((err: any) => reject(err))
                        })
                    },
                    connection : async () =>  {
                        const pool = await connectPool.getConnection()
                        return new Promise((resolve) => {
                            const query = (sql: string) => {
                                return new Promise<any[]>((resolve, reject) => {
                                    pool.query(sql)
                                    .then((r: any[] | PromiseLike<any[]>) => resolve(this._result(r)))
                                    .catch((e: any) => reject(e))
                                })
                            }
        
                            return resolve({ 
                                on : (event : TPoolEvent , data : any) => this.on(event,data),
                                query
                            })
                        })
                    }
                }
            }
                
            case 'pg': 
            case 'postgres': {
                const pg = Tool.import('pg')
 
                const pool = new pg.Pool(options)

                pool.connect((err: any) => {
                    if(err == null || !err) return
        
                    const message = this._messageError.bind(this)
        
                    process.nextTick(() => {
                        console.log(message(err?.message))     
                        return process.exit()
                    })
                })

                return {
                    on : (event : TPoolEvent , data: any) => {
                        return this.on(event,data)
                    },
                    query : (sql : string) => {
                        return new Promise<any[]>((resolve, reject)=>{

                            return pool.query(sql , (err: any, results: any[]) => {                                       
                                if(err) return reject(err)
                                return resolve(this._result(results))
                            })
                        })
                    },
                    connection : () =>  {
                        return new Promise((resolve, reject) => {
                            pool.connect((err: any, connection: { query: Function }) => {
         
                                if (err) return reject(err)
        
                                const query = (sql: string) => {
        
                                    return new Promise<any[]>((resolve, reject) => {
                                        connection.query(sql, (err : any, result: any[]) => {
                                            if (err)  return reject(err)
                                            return resolve(this._result(result))
                                        })
                                    })
                                }
    
                                return resolve({ 
                                    on : (event : TPoolEvent , data : any) => this.on(event,data),
                                    query
                                })
                            })
                        })
                    }
                }
            }

            case 'sqlite3': {
                const sqlite3 = Tool.import(this.driver())
                const db = new sqlite3.Database(options.database);

                return {
                    on : (event : TPoolEvent , data: any) => {
                        return this.on(event,data)
                    },
                    query : (sql : string) => {
                        return new Promise((resolve, reject) => {
                            db.all(sql , [] , (err: any, result: any[]) => {
                              if (err) return reject(err)
                              return resolve(result)
                            })
                        })
                    },
                    connection : async () =>  {
                        return new Promise((resolve) => {
                            const query = (sql: string) => {
                                return new Promise<any>((resolve, reject) => {
                                    db.all(sql)
                                    .then((r: any[] | PromiseLike<any[]>) => resolve(this._result(r)))
                                    .catch((e: any) => reject(e))
                                })
                            }
        
                            return resolve({ 
                                on : (event : TPoolEvent , data : any) => this.on(event,data),
                                query
                            })
                        })
                    }
                }
            }

            case 'mssql': {
                const mssql = Tool.import(this.driver())
 
                const createPool = mssql.createPool(options)

                const pool = createPool.connect().catch((err : any) => {
                    const message = this._messageError.bind(this)
        
                    process.nextTick(() => {
                        console.log(message(err?.message))     
                        return process.exit()
                    })
                })

                return {
                    on : (event : TPoolEvent , data: any) => {
                        return this.on(event,data)
                    },
                    query : (sql : string) => {
                        return new Promise<any[]>((resolve, reject)=>{
                            return pool.query(sql , (err: any, results: any[]) => {                                        
                                if(err) return reject(err)
                                return resolve(this._result(results))
                            })
                        })
                    },
                    connection : () =>  {
                        return new Promise((resolve, reject) => {
                            pool.connect((err: any, connection: { query: Function }) => {
         
                                if (err) return reject(err)
        
                                const query = (sql: string) => {
                                    return new Promise<any>((resolve, reject) => {
                                        connection.query(sql, (err : any, result: any[]) => {
                                            if (err)  return reject(err)
                                            return resolve(this._result(result))
                                        })
                                    })
                                }
        
                                return resolve({ 
                                    on : (event : TPoolEvent , data : any) => this.on(event,data),
                                    query
                                })
                            })
                        })
                    }
                }
            }

            default : throw new Error('No default driver specified')
        }
    }

    format(sql : string) {
        switch(this.driver()) {
            case 'pg':
            case 'postgres' : {
                const replaceBackticksWithDoubleQuotes = (sqlString : string) => {

                    const updateRegex = /^UPDATE\b/i
                    const insertRegex = /^INSERT\b/i
                    const deleteRegex = /^DELETE\b/i
                
                    if (
                        insertRegex.test(sqlString) ||
                        updateRegex.test(sqlString) ||
                        deleteRegex.test(sqlString) 
                    )  {
                        const replacedString = sqlString
                        .replace(/`[\w_]+`\.`([\w_]+)`/g, '`$1`')
                        .replace(/`([^`]+)`/g, '"$1"');
                    
                        return replacedString;
                    }

                    const replacedString = sqlString
                    .replace(/`([^`]+)`/g, '"$1"')
                    .replace(/table_schema/gi, 'table_catalog')
                  
                    return replacedString;
                }
                return replaceBackticksWithDoubleQuotes(sql)
            }

            default : return sql
        }
    }
    driver () {
        return String(this.OPTIONS.get('driver') ?? 'mysql2')
    }

    private _result (results : any) {

        switch(this.driver()) {
            case 'pg' : 
            case 'postgres':
            case 'oracle': {
                const { rows } = results
                return rows
            }
            case 'mssql': {
                const { recordset } = results
                return recordset
            }

            default : return results
        }
        
    }
}

/**
 * 
 * Connection to database when service is started
 * 
 * @returns   {Connection} Connection
 * @property  {Function} Connection.query
 * @property  {Function} Connection.connection
 */
const pool = new PoolConnection().connected()

export { loadOptionsEnvironment }
export { pool as Pool }

export default pool