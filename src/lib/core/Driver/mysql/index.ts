import BaseDriver from '..';
import type { 
    TConnection, 
    TPoolEvent 
} from "../../../types";

class MysqlDriver extends BaseDriver {

    constructor(options: Record<string, any>) {  
        super(options)
    }
    public connect(this: MysqlDriver) {
        const mysql = this.import('mysql2')
        this.pool = mysql.createPool({
            connectionLimit         : this.options.connectionLimit,
            dateStrings             : this.options.dateStrings,
            connectTimeout          : this.options.connectTimeout,
            waitForConnections      : this.options.waitForConnections,
            queueLimit              : this.options.queueLimit,
            charset                 : this.options.charset,
            host                    : this.options.host,
            port                    : this.options.port,
            database                : this.options.database,
            user                    : this.options.user || this.options.username,
            password                : this.options.password,
            multipleStatements      : this.options.multipleStatements,
            enableKeepAlive         : this.options.enableKeepAlive,
            keepAliveInitialDelay   : this.options.keepAliveInitialDelay,
        })

        this._onPoolConnect(this.pool)

        this.pool.on('release', (connection: unknown) => {
            this.emit('release', connection)
        })
                
        return {
            on : (event : TPoolEvent , data: any) => {
                return this.on(event,data)
            },
            format: (sql : string) => {
                return sql;
            },
            query : (sql : string) : Promise<any[]> => {
                return new Promise<any[]>((resolve, reject)=>{
                    return this.pool.query(sql , (err: any, results: any[]) => {                                        
                        if(err) return reject(err)
                        return resolve(results)
                    })
                })
            },
            connection : () : Promise<TConnection> =>  {
            
                let closeTransction = false;

                return new Promise((resolve, reject) => {
                    this.pool.getConnection((err: any, connection: any) => {

                        if (err) return reject(err)

                        const query = (sql: string) => {
                            const start : number = Date.now()
                            return new Promise<any[]>((ok, fail) => {

                                if(closeTransction) {
                                    return fail(new Error('The transaction has either been closed'));
                                }

                                connection.query(sql, (err:any, results: any[]) => {
            
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

export { MysqlDriver }
export default MysqlDriver