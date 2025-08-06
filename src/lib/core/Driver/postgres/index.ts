import BaseDriver from '..';
import type { 
    TConnection, 
    TPoolEvent 
} from "../../../types";

class PostgresDriver extends BaseDriver {

    constructor(options: Record<string, any>) {  
        super(options)
    }
    public connect(this: PostgresDriver) {
        const pg = this.import('pg');

        this.pool = new pg.Pool({
            host                    : this.options.host,
            port                    : this.options.port,
            database                : this.options.database,
            user                    : this.options.user || this.options.username,
            password                : this.options.password,
            max                     : this.options.connectionLimit,       
            connectionTimeoutMillis : this.options.connectTimeout ?? 0, 
            idleTimeoutMillis       : 30000,                                  
            keepAlive               : this.options.enableKeepAlive ?? true,        
            allowExitOnIdle         : false      
        })

        this.pool.connect((err: any) => {
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
            format: (sql : string) => {
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
            },
            query : (sql : string) => {
                return new Promise<any[]>((resolve, reject)=>{
                    return this.pool.query(sql , (err: any, results: any) => {                                       
                        if(err) return reject(err)
                        const { rows } = results
                        return resolve(rows)
                    })
                })
            },
            connection : () : Promise<TConnection> =>  {
            
                let closeTransction = false;

                return new Promise((resolve, reject) => {
                    this.pool.connect((err: any, connection: any) => {

                        if (err) return reject(err)

                        const query = (sql: string) => {
                            const start : number = Date.now()
                            return new Promise<any[]>((ok, fail) => {

                                if(closeTransction) {
                                    return fail(new Error('The transaction has either been closed'));
                                }

                                connection.query(sql, (err:any, results: any) => {
            
                                    connection.release()
                                    
                                    if (err) {
                                        return fail(err)
                                    }

                                    const { rows } = results

                                    this._detectEventQuery({ start , sql , results: rows })

                                    return ok(rows)
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

                                // After destroying the connection, it will be removed from the connection this.pool.
                                this.pool.end()

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

    public disconnect(): void {
        this.pool.end(() => {
            this.pool = undefined
        })
    }
}

export { PostgresDriver }
export default PostgresDriver