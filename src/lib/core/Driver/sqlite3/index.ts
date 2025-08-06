import BaseDriver from '..';
import type { 
    TConnection, 
    TPoolEvent 
} from "../../../types";

class Sqlite3Driver extends BaseDriver {

    constructor(options: Record<string, any>) {  
        super(options)
    }
    public connect(this: Sqlite3Driver) {
        const sqlite3 = this.import('sqlite3')
       
        const db = new sqlite3.Database(this.options.database);
      
        return {
            on : (event : TPoolEvent , data: any) => {
                return this.on(event,data)
            },
            format: (sql : string) => {
                return sql;
            },
           query : (sql : string) => {
                return new Promise<any[]>((resolve, reject) => {
                    db.all(sql , [] , (err: any, result: any[]) => {
                        if (err) return reject(err)
                        return resolve(result)
                    })
                })
            },
           connection : async () =>  {
                return new Promise<any>((resolve) => {
                    const query = (sql: string) => {
                        return new Promise<any>((resolve, reject) => {
                            db.all(sql)
                            .then((r: any[] | PromiseLike<any[]>) => resolve(r))
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

    public disconnect(): void {
        this.pool.end(() => {
            this.pool = undefined
        })
    }
}

export { Sqlite3Driver }
export default Sqlite3Driver