import dotenv   from 'dotenv'
import path     from 'path'
import fs       from 'fs'
interface IEnvironment {
    HOST                 ?: string | null,
    PORT                 ?: string | number,
    USERNAME             ?: string | null,
    PASSWORD             ?: string | null,
    DATABASE             ?: string | null,
    CONNECTION_LIMIT     ?: string | number,
    QUEUE_LIMIT          ?: string | number,
    TIMEOUT              ?: string | number,
    CHARSET              ?: string | null,
    CONNECTION_ERROR     ?: string | boolean,
    WAIT_FOR_CONNECTIONS ?: string | boolean,
    DATE_STRINGS         ?: string | boolean,
    KEEP_ALIVE_DELAY     ?: string | number,
    ENABLE_KEEP_ALIVE    ?: string | boolean,
    MULTIPLE_STATEMENTS  ?: string | boolean,
    CACHE                ?: string | null
}

const environment = () : string => {
    const NODE_ENV = process.env?.NODE_ENV
    const env = path.join(path.resolve(), '.env')
    if(NODE_ENV == null)  return env
    const envWithEnviroment = path.join(path.resolve() , `.env.${NODE_ENV}`)
    if (fs.existsSync(envWithEnviroment)) return envWithEnviroment

    return env
}

dotenv.config({ path : environment() })

const ENV = process.env

const env: IEnvironment & Record<string,any> =  {
    HOST                    : ENV.DB_HOST ?? 'localhost',
    PORT                    : ENV.DB_PORT ?? 3306,
    USERNAME                : ENV.DB_USERNAME ?? ENV.DB_USER,
    PASSWORD                : ENV.DB_PASSWORD ?? '', 
    DATABASE                : ENV.DB_DATABASE, 
    CONNECTION_LIMIT        : ENV.DB_CONNECTION_LIMIT ?? 151,
    QUEUE_LIMIT             : ENV.DB_QUEUE_LIMIT ?? 0,
    TIMEOUT                 : ENV.DB_TIMEOUT ?? 1000 * 90,
    CHARSET                 : ENV.DB_CHARSET ?? 'utf8mb4',
    CONNECTION_ERROR        : ENV.DB_CONNECTION_ERROR ?? false,
    CONNECTION_SUCCESS      : ENV.DB_CONNECTION_SUCCESS ?? false,
    WAIT_FOR_CONNECTIONS    : ENV.DB_WAIT_FOR_CONNECTIONS  ??  true,
    DATE_STRINGS            : ENV.DB_DATE_STRINGS ?? false,
    KEEP_ALIVE_DELAY        : ENV.DB_KEEP_ALIVE_DELAY ??  0,
    ENABLE_KEEP_ALIVE       : ENV.DB_ENABLE_KEEP_ALIVE ?? true,
    MULTIPLE_STATEMENTS     : ENV.DB_MULTIPLE_STATEMENTS ??  false,
    CACHE                   : ENV.DB_CACHE
}

for(const [key, value] of Object.entries(env)) {
    if(value == null || key == null) continue
    if(typeof value === 'string' && ['true','false'].some(v => value.toLowerCase() === v)) {
        env[key] = JSON.parse(value.toLowerCase())
        continue
    }
    if(/^[0-9]+$/.test(value)) env[key] = +value
}

export const loadOptionsEnvironment = () => {
    const environment = () : string => {
        const NODE_ENV = process.env?.NODE_ENV
        
        const env = path.join(path.resolve(), '.env')
        
        if(NODE_ENV == null)  return env
        const envWithEnviroment = path.join(path.resolve() , `.env.${NODE_ENV}`)
        if (fs.existsSync(envWithEnviroment)) return envWithEnviroment
    
        return env
    }

    const ENV = dotenv.config({ path : environment() }).parsed
 
    const env: IEnvironment & Record<string,any> =  {
        host                 : ENV?.DB_HOST || ENV?.TSPACE_HOST,
        port                 : ENV?.DB_PORT || ENV?.TSPACE_PORT || 3306,
        username             : ENV?.DB_USERNAME || ENV?.TSPACE_USERNAME,
        password             : ENV?.DB_PASSWORD || ENV?.TSPACE_PASSWORD || '', 
        database             : ENV?.DB_DATABASE || ENV?.TSPACE_DATABASE, 
    }
    
    for(const [key, value] of Object.entries(env)) {
        if(value == null) continue
        if(typeof value === 'string' && ['true','false'].some(v => value.toLowerCase() === v)) {
            env[key] = JSON.parse(value.toLowerCase())
            continue
        }
        if(/^[0-9]+$/.test(value)) env[key] = +value
    }
    return Object.freeze({ ...env })
}

export default Object.freeze({ ...env })