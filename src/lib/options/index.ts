import { Tool } from '../tools'
import dotenv from 'dotenv'

const environment = () : string => {
    const NODE_ENV = process.env?.NODE_ENV
    const env = Tool.path.join(Tool.path.resolve(), '.env')
    
    if(NODE_ENV == null)  return env
    const envWithEnviroment = Tool.path.join(Tool.path.resolve() , `.env.${NODE_ENV}`)
    if (Tool.fs.existsSync(envWithEnviroment)) return envWithEnviroment

    return env
}

dotenv.config({ path : environment() })

const ENV = process.env

const rawEnv =  {
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
    CACHE                   : ENV.DB_CACHE ?? 'memory' as 'memory' | 'db' | 'redis'
} as const 

type RawEnv = typeof rawEnv

const parseEnv = (env: typeof rawEnv): RawEnv => {
    const parsed = {} as Record<string,any>

    for (const [key, value] of Object.entries(env)) {

        if (value == null) continue

        if(value === '') {
            parsed[key] = value
            continue
        }

        if (!isNaN(Number(value))) {
            (parsed)[key] = Number(value)
            continue
        } 
        
        if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
            (parsed)[key] = value.toLowerCase() === 'true'

            continue
        } 

        parsed[key] = value
    }

    return parsed as RawEnv
}

const env = parseEnv(rawEnv)

export const loadOptionsEnvironment = () => {
    const environment = () : string => {
        const NODE_ENV = process.env?.NODE_ENV
        const env = Tool.path.join(Tool.path.resolve(), '.env')

        if(NODE_ENV == null)  return env

        const envWithEnviroment = Tool.path.join(Tool.path.resolve() , `.env.${NODE_ENV}`)

        if (Tool.fs.existsSync(envWithEnviroment)) return envWithEnviroment
    
        return env
    }

    dotenv.config({ path : environment() })

    const ENV = process.env
 
    const rawEnv =  {
        host                 : ENV?.DB_HOST || ENV?.TSPACE_HOST,
        port                 : ENV?.DB_PORT || ENV?.TSPACE_PORT || 3306,
        username             : ENV?.DB_USERNAME || ENV?.TSPACE_USERNAME,
        password             : ENV?.DB_PASSWORD || ENV?.TSPACE_PASSWORD || '', 
        database             : ENV?.DB_DATABASE || ENV?.TSPACE_DATABASE, 
    } as const

    //@ts-ignore
    const env = parseEnv(rawEnv)
    
    return Object.freeze(env) as unknown as typeof rawEnv
}

export default Object.freeze(env)