import { Tool } from '../tools'
import dotenv from 'dotenv'

const resolveEnvPath = (customEnv ?: string) : string => {
    const NODE_ENV = customEnv ?? process.env?.NODE_ENV;
    const env = Tool.path.join(Tool.path.resolve(), '.env');

    if(NODE_ENV == null) {
        return env;
    }

    const envWithNodeEnv = Tool.path.join(
        Tool.path.resolve(), 
        `.env.${NODE_ENV}`
    );

    if (Tool.fs.existsSync(envWithNodeEnv)) {
        return envWithNodeEnv;
    }

    return env;
}

dotenv.config({ path : resolveEnvPath() })

const ENV = process.env

const rawEnv =  {
    HOST                    : ENV.DB_HOST ?? 'localhost',
    PORT                    : ENV.DB_PORT ?? 3306,
    USERNAME                : ENV.DB_USERNAME ?? ENV.DB_USER,
    PASSWORD                : ENV.DB_PASSWORD ?? '', 
    DATABASE                : ENV.DB_DATABASE, 
    CONNECTION_LIMIT        : ENV.DB_CONNECTION_LIMIT ?? 20,

    DATE_STRINGS            : ENV.DB_DATE_STRINGS ?? false,
  
    CLUSTER                 : ENV.DB_CLUSTER ?? false,
    DRIVER                  : ENV.DB_DRIVER ?? 'mysql2',
    CACHE                   : ENV.DB_CACHE ?? 'memory' as 'memory' | 'db' | 'redis',
    CONNECTION_ERROR        : ENV.DB_CONNECTION_ERROR ?? false,
    CONNECTION_SUCCESS      : ENV.DB_CONNECTION_SUCCESS ?? false,
} as const 

const parseEnv = <T extends object>(env: T): T  => {
    
    const parsed: Record<string,unknown> = {}

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

    return parsed as T
}

const env = parseEnv<typeof rawEnv>(rawEnv)

export const loadOptionsEnv = (customEnv?: string) => {
    
    const pathEnv = resolveEnvPath(customEnv);

    dotenv.config({ path : pathEnv, override: true });

    const ENV = process.env;
 
    const rawEnv =  {
        cluster              : ENV.DB_CLUSTER ?? false,
        driver               : ENV.DB_DRIVER ?? 'mysql2',
        host                 : ENV.DB_HOST,
        port                 : ENV.DB_PORT || 3306,
        username             : ENV.DB_USERNAME,
        password             : ENV.DB_PASSWORD || '', 
        database             : ENV.DB_DATABASE, 
    } as const

    const env = parseEnv<typeof rawEnv>(rawEnv);
    
    return Object.freeze(env) as typeof rawEnv;
}

const Config = Object.freeze(env);

export { Config };
export default Config;