import { DB }  from "./DB";
import type { 
    TStoreProcedure 
} from "../types";

/**
 *
 * 'StoredProcedure' is a predefined set of SQL statements stored in the database that you can call (execute) by name.
 * @generic {Type} TS
 * @generic {Type} TR
 * @example
    import { StoredProcedure } from 'tspace-mysql'

    type T = {
        AddUser: {
            params: {
                name : string;
                email: string;
            } | [string,string];
            result: {
                fieldCount: number;
                affectedRows: number;
                insertId: number;
                info: string;
                serverStatus: number;
                warningStatus: number;
                changedRows: number;
            }
        };
        GetUser: {
            params: [number];
            result: any[]
        },
        GetUsers: {
            params: [];
            result: any[]
        }
    };

    class MyStore extends StoredProcedure<T> {
        protected boot(): void {

            this.createProcedure({
                name: 'AddUser',
                expression: `
                    CREATE PROCEDURE AddUser(IN name VARCHAR(255), IN email VARCHAR(255))
                    BEGIN
                    INSERT INTO users (name, email) VALUES (name, email);
                    END;
                `,
                synchronize: true
            });

            this.createProcedure({
                name: 'GetUsers',
                expression: `
                    CREATE PROCEDURE GetUsers()
                    BEGIN
                    SELECT * FROM users LIMIT 5;
                    END;
                `,
                synchronize: true
            });

            this.createProcedure({
                name: 'GetUser',
                expression: `
                    CREATE PROCEDURE GetUser(IN userId INT)
                    BEGIN
                    SELECT * FROM users WHERE id = userId LIMIT 1;
                    END;
                `,
                synchronize: true
            })
        }
    }

    const storeProcedure = new MyStoredProcedure()

    storeProcedure.call('AddUser', { name : 'tspace-mysql' , email : 'tspace-mysql@example.com'})
    .then(r => console.log(r))
    .catch(e => console.log(e))

    storeProcedure.call('GetUser',[1])
    .then(r => console.log(r))
    .catch(e => console.log(e))

    storeProcedure.call('GetUsers',[])
    .then(r => console.log(r))
    .catch(e => console.log(e))
 */
class StoredProcedure<T extends Record<string, TStoreProcedure>> {

    private APPLY_STORED: Map<string, () => Promise<void>> = new Map();

    constructor() {
        this.boot()
    }

    /**
     * The 'boot' method is a special method that you can define within a store procedure.
     * @returns {void} void
     */
    protected boot(): void {}

    /**
     * The 'createProcedure' method is used create store procedure.
     * 
     * @param    {object}   object { name, expression, synchronize }
     * @property {string?}  object.name
     * @property {string}   object.expression
     * @property {boolean}  object.synchronize
     * @returns  {void}
     */
    protected createProcedure({ name, expression, synchronize }: {
        name: keyof T & string;
        expression: string;
        synchronize?: boolean;
    }): void {
        const fn = async () => {

            if (synchronize) {
                await DB.query(`DROP PROCEDURE IF EXISTS ${name}`);
            }
            
            await DB.query(expression)
            .catch(err => {
                const message = err.message
               
                const exists = String(message).includes(`PROCEDURE ${name} already exists`)

                if(exists) return;

                console.log(`\n\x1b[31mFAIL QUERY:\x1b[0m \x1b[33m${expression.trim()};\x1b[0m`)

                throw err
                
            })
        };

        this.APPLY_STORED.set(name, fn);
    }

    /**
     * The 'call' method is used create store procedure.
     * 
     * @param    {string}       name
     * @param    {object|array} params
     * @returns  {Promise<any>}
     */
    public async call<K extends keyof T>(
        name: K,
        params: T[K]['params']
    ): Promise<T[K]['result']> {

        const storeProcedure = this.APPLY_STORED.get(name as string);

        if (!storeProcedure) throw new Error(`Stored procedure "${String(name)}" not registered.`);

        await storeProcedure();

        const placeholders: string[] = Object.keys(params).map(key => `:${key}`);
       
        const sql = `CALL ${String(name)}(${placeholders.join(', ')})`;

        const result = await DB.query(sql,params);

        if (Array.isArray(result) && Array.isArray(result[0])) {
            return result[0] as T[K]['result'];
        }

        return result as T[K]['result'];
    }
}

export { StoredProcedure };
export default StoredProcedure;