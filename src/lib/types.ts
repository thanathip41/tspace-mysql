import Model                from "./core/Model"
import { TCache as Cache }  from './core/Cache'
import CONSTANTS            from './constants'

export type TCache = Cache

export type TConstant = typeof CONSTANTS

export type TRelationOptions<K = any> = {
    name: K extends void ? never : K;
    model : new () => Model<any,any>, 
    as?: string,
    localKey?: string , 
    foreignKey?: string, 
    freezeTable?: string , 
    pivot?: string , 
    query?: any
    queryPivot ?:any,
    relation? : Object,
    exists ?: boolean,
    notExists ?: boolean,
    all ?: boolean,
    trashed ?: boolean,
    count ?: boolean,
    oldVersion ?: boolean,
    modelPivot ?: new () => Model
}

export type TRelationQueryOptions<K = any> = {
    name ?: K extends void ? never : K;
    model : new () => Model<any,any>, 
    as?: string,
    localKey?: string , 
    foreignKey?: string, 
    freezeTable?: string| undefined , 
    pivot?: string| undefined , 
    query?: any
    relation? : Object| undefined,
    exists ?: boolean,
    all ?: boolean,
    trashed ?: boolean,
    count ?: boolean,
    oldVersion ?: boolean,
    modelPivot ?: new () => Model
}

export type TRelationShip = {
    hasOne : string,
    hasMany : string,
    belongsTo :string,
    belongsToMany: string,
} 

export type TPagination<K = any[]> = {
    meta: {
        total: number,
        limit: number,
        total_page: number,
        current_page: number,
        last_page: number,
        next_page: number,
        prev_page: number,
    },
    data : K
}

export type TBackup = { 
    database : string , 
    to ?: { 
        host: string ,
        port : number , 
        username : string , 
        password : string 
    }
}

export type TBackupToFile = { 
    database ?: string , 
    filePath : string , 
    table    ?: string, 
    connection ?: { 
        host: string ,
        port : number , 
        database : string , 
        username : string , 
        password : string 
    }
}

export type TBackupTableToFile = { 
    filePath : string , 
    table    : string, 
    connection ?: { 
        host: string ,
        port : number , 
        database : string , 
        username : string , 
        password : string 
    }
}

export type TConnectionOptions = { 
    connectionLimit ?: number,
    dateStrings?: boolean,
    waitForConnections ?: boolean,
    charset ?: string,
    host: string, 
    port: number, 
    database : string, 
    username : string, 
    password : string
}

export type TPoolCallback = {
    query: ( sql: string, callback: (err: any, result: any) => void) => void,
    release: () => void
}

export type TConnectionTransaction = {
    on : (event : TPoolEvent , data : any) => void;
    query: (sql: string) => Promise<any[]>;
    startTransaction : () => Promise<void>;
    commit : () => Promise<void>;
    rollback : () => Promise<void>
}

export type TConnection = {
    on : (event : TPoolEvent , data : (r : any) => any) => void
    query: (sql: string) => Promise<any>
    connection : () => Promise<TConnectionTransaction>
}

export type TOptions = {
    [key: string]: any,
    connectionLimit ?: number,
    dateStrings?: boolean,
    waitForConnections ?: boolean,
    charset ?: string,
    host: string, 
    port: number, 
    database : string, 
    user : string, 
    password : string
}

export type TExecute = { 
    sql: string , 
    type: string ,
    message?: string , 
    options?: { [key: string]:any } 
}

export type TPattern = 'snake_case' | 'camelCase'

export type TValidateSchema =  null | Record<string , NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor
| { 
    type :NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor,
    require    ?: boolean
    match      ?: RegExp
    length     ?: number
    minLength  ?: number
    maxLength  ?: number
    min        ?: number
    max        ?: number
    enum       ?: string[] | number[] | boolean[]
    unique     ?: boolean
    json       ?: boolean
    fn         ?: Function
}>

export type TValidateSchemaDecorator = NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor
| { 
    type :NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor,
    require    ?: boolean
    match      ?: RegExp
    length     ?: number
    minLength  ?: number
    maxLength  ?: number
    min        ?: number
    max        ?: number
    enum       ?: string[] | number[] | boolean[]
    unique     ?: boolean
    json       ?: boolean
    fn         ?: Function
}

export type TNonEmptyArray<T> = [T, ...T[]]

export type TGlobalSetting = {
    softDelete  ?: boolean;
    debug       ?: boolean;
    uuid        ?: boolean;
    timestamp   ?: boolean;
    pattern     ?: boolean | ('s')
    logger      ?: {
        selected ?: boolean
        inserted ?: boolean
        updated  ?: boolean
        deleted  ?: boolean
    }
}

export type TOperator = {
    'eq': string,
    'notEq':string,
    'more': string,
    'less': string,
    'moreOrEq': string,
    'lessOrEq': string,
    'like': string,
    'notLike': string,
    'in': string,
    'notIn': string,
    'isNull': string,
    'isNotNull': string,
    'query': string,
    '|eq': string,
    '|notEq':string,
    '|more': string,
    '|less': string,
    '|moreOrEq': string,
    '|lessOrEq': string,
    '|like': string,
    '|notLike': string,
    '|in': string,
    '|notIn': string,
    '|isNull': string,
    '|isNotNull': string,
    '|query' : string
}

export type TPoolEvent = 'connected' | 'release' | 'query' | 'slowQuery' | 'select' | 'insert' | 'update' | 'delete'

export type TRawStringQuery = `$RAW:${string}`

export type TFreezeStringQuery = `$Freeze:${string}`

export type TRepositoryCreate<T extends Record<string,any> = any> = {
    data: Partial<{ [K in keyof T]:  T[K] | TRawStringQuery |  TFreezeStringQuery }>;
    debug ?: boolean;
    transaction ?: TConnection | TConnectionTransaction;
}

export type TRepositoryCreateMultiple<T extends Record<string,any> = any> = {
    data : Partial<{ [K in keyof T]: T[K] | TRawStringQuery |  TFreezeStringQuery }>[];
    debug ?: boolean;
    transaction ?: TConnection | TConnectionTransaction;
}

export type TRepositoryCreateOrThings<T extends Record<string,any> = any> = {
    data  : Partial<{ [K in keyof T]: T[K] | TRawStringQuery |  TFreezeStringQuery }>;
    where : Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    debug ?: boolean;
}

export type TRepositoryUpdate<T extends Record<string,any> = any> = {
    data  : Partial<{ [K in keyof T]: T[K] | TRawStringQuery |  TFreezeStringQuery }>;
    where : Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    debug ?: boolean;
    transaction ?: TConnection | TConnectionTransaction;
}

export type TRepositoryUpdateMultiple<T extends Record<string,any> = any> = {
    cases: { 
        when : Partial<{ [K in keyof T]: T[K] | TRawStringQuery |  TFreezeStringQuery }>;
        columns : Partial<{ [K in keyof T]: T[K] | TRawStringQuery |  TFreezeStringQuery }>;
    }[]
    debug ?: boolean;
    transaction ?: TConnection | TConnectionTransaction;
}

export type TRepositoryDelete<T extends Record<string,any> = any> = {
    where : Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : any;
    debug ?: boolean;
    transaction ?: TConnection | TConnectionTransaction;
}

export type TPickColumns<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type TPickRelations<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type TRegistry = {
    '$save' ?: Function
    '$attach' ?: Function
    '$detach' ?: Function
}

export type TRepositoryRequest<T extends Record<string, any> = any,R = any> = {
    debug ?: boolean
    when ?: {condition : boolean , callback : () => TRepositoryRequest<T,R>}
    select ?: '*' | (keyof Partial<T> | `${string}.${string}` | TRawStringQuery | '*')[]
    join ?: {localKey : `${string}.${string}` , referenceKey : `${string}.${string}`}[]
    leftJoin?: {localKey : `${string}.${string}` , referenceKey : `${string}.${string}`}[]
    rightJoin ?: {localKey : `${string}.${string}` , referenceKey : `${string}.${string}`}[]
    where?: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    whereRaw ?: string[],
    whereQuery ?: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    groupBy?: (keyof Partial<T> | `${string}.${string}` | TRawStringQuery)[] extends infer K ? K : unknown;
    having ?: string,
    orderBy?: Partial<Record<keyof T | `${string}.${string}` | TRawStringQuery, 'ASC' | 'DESC'>>;
    limit ?: number;
    offset ?: number;
    relations ?: R extends object ? (keyof R)[] : string[];
    relationsExists ?: R extends object ? (keyof R)[] : string[];
    relationQuery ?: { name : R extends object ? (keyof R) : string, callback :() => TRepositoryRequest<any,any> }
}

export type TRepositoryRequestHandler<T extends Record<string, any> = any,R = any> = Partial<TRepositoryRequest<T,R> & { instance ?: Model }>

export type TRepositoryRequestPagination<T extends Record<string, any> = any,R = any> = Partial<TRepositoryRequest<T,R>> & { page ?: number }

export type TRepositoryRequestAggregate<T extends Record<string, any> = any,R = any> = Partial<Omit<TRepositoryRequest<T,R>,'relations' | 'relationQuery'>>