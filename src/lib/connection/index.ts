import fs      from 'fs'
import path    from 'path'
import { 
    createPool, 
    Pool,
    PoolConnection as TPoolConnection,
    QueryError
} from 'mysql2'
import { EventEmitter } from 'events'
import options , { loadOptionsEnvironment } from '../options'
import { 
    TConnection, 
    TOptions, 
    TPoolCallback,
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
    /**
     * 
     * Get a connection to database
     * @return {Connection} Connection
     * @property {Function} Connection.query
     * @property {Function} Connection.connection
     */
    public connection () : TConnection {

        const pool : Pool = createPool(Object.fromEntries(this.OPTIONS))

        /**
         * After the server is listening, verify that the pool has successfully connected to the database.
         * @protected {Pool} pool
         * @returns {void}
         */
        setTimeout(() => {
            pool.getConnection((err : any , connection : TPoolConnection) : void => {

                if(err == null || !err) {

                    this.emit('CONNECTION' , pool)

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
                   
                    return
                }
    
                const message = this._messageError.bind(this)
    
                process.nextTick(() => {
                    console.log(message(err.message == null || err.message === '' ? err.code : err.message))     
                    if(options.CONNECTION_ERROR) return process.exit()
                })
            })
        },1_000 * 2.5)

        pool.on('release', (connection) => {
            this.emit('RELEASE', connection)
        })

        return {
            on : (event : TPoolEvent , data : any) => {
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
                return new Promise((resolve, reject) => {
                    pool.getConnection((err, connection: TPoolCallback) => {

                        if (err) return reject(err)

                        const query = (sql: string) => {
                            const start : number = Date.now()
                            return new Promise<any[]>((resolve, reject) => {
                                connection.query(sql, (err : QueryError, results: any[]) => {
                                    if (err)  return reject(err)

                                    this._detectEventQuery({start , sql , results })

                                    return resolve(results)
                                })
                            })
                        }

                        const startTransaction = () => query('START TRANSACTION')
                        const commit = () => query('COMMIT')
                        const rollback = () => query('ROLLBACK')
                     
                        return resolve({ 
                            on : (event : TPoolEvent , data : any) => {
                                return this.on(event,data)
                            },
                            query,
                            startTransaction, 
                            commit, 
                            rollback
                        })
                    })
                })
            }
        }
    }

    private _detectEventQuery ({ start , sql , results  }:{ start : number , sql : string , results : any[] }) {
        const duration = Date.now() - start
        
        if (duration > 1000 * 10) {
            const maxLength = 5_000

            if (sql.length > maxLength) {
                sql = `${sql.slice(0, maxLength)}.......`
            }

            console.log(this._messageSlowQuery(duration , sql))   
        
            this.emit('SLOW_QUERY', {
                sql,
                execution : duration
            })
        }

        this.emit('QUERY', {
            sql,
            execution : duration
        })

        this.emit(this._detectQueryType(sql), {
            sql,
            execution : duration
        })
    }

    private _detectQueryType(query : string) {
        const selectRegex = /^SELECT\b/i
        const updateRegex = /^UPDATE\b/i
        const insertRegex = /^INSERT\b/i
        const deleteRegex = /^DELETE\b/i
      
        if (selectRegex.test(query))  return 'SELECT'
        if (updateRegex.test(query))  return 'UPDATE' 
        if (insertRegex.test(query))  return 'INSERT' 
        if (deleteRegex.test(query))  return 'DELETE'
        
        return 'UNKNOWN'
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
                keepAliveInitialDelay   : Number(options.KEEP_ALIVE_DELAY)
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
            const dbOptionsPath = path.join(path.resolve() ,'db.tspace')
            const dbOptionsExists = fs.existsSync(dbOptionsPath)

            if(!dbOptionsExists) return this._defaultOptions()

            const dbOptions : string = fs.readFileSync(dbOptionsPath,'utf8')

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

        const message = `\n\x1b[1m\x1b[31mWARING:\x1b[0m \x1b[1m\x1b[30mSlow query detected: Execution time: ${duration} ms\x1b[0m \n\x1b[33m${sql};\x1b[0m`

        return message
    }
}

/**
 * 
 * Connection to database when service is started
 * @return {Connection} Connection
 * @property {Function} Connection.query
 * @property {Function} Connection.connection
 */
const pool = new PoolConnection().connection()

export { loadOptionsEnvironment }
export { pool as Pool }
export default pool