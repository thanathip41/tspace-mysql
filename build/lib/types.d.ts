import Model from "./core/Model";
export type TRelationOptions<K = any> = {
    name: K extends void ? never : K;
    model: new () => Model<any, any>;
    as?: string;
    localKey?: string;
    foreignKey?: string;
    freezeTable?: string;
    pivot?: string;
    query?: any;
    queryPivot?: any;
    relation?: Object;
    exists?: boolean;
    all?: boolean;
    trashed?: boolean;
    count?: boolean;
    oldVersion?: boolean;
    modelPivot?: new () => Model;
};
export type TRelationQueryOptions<K = any> = {
    name?: K extends void ? never : K;
    model: new () => Model<any, any>;
    as?: string;
    localKey?: string;
    foreignKey?: string;
    freezeTable?: string | undefined;
    pivot?: string | undefined;
    query?: any;
    relation?: Object | undefined;
    exists?: boolean;
    all?: boolean;
    trashed?: boolean;
    count?: boolean;
    oldVersion?: boolean;
    modelPivot?: new () => Model;
};
export type TRelationShip = {
    hasOne: string;
    hasMany: string;
    belongsTo: string;
    belongsToMany: string;
};
export type TPagination<K = any[]> = {
    meta: {
        total: number;
        limit: number;
        total_page: number;
        current_page: number;
        last_page: number;
        next_page: number;
        prev_page: number;
    };
    data: K;
};
export type TBackup = {
    database: string;
    to?: {
        host: string;
        port: number;
        username: string;
        password: string;
    };
};
export type TBackupToFile = {
    database?: string;
    filePath: string;
    table?: string;
    connection?: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
};
export type TBackupTableToFile = {
    filePath: string;
    table: string;
    connection?: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
};
export type TConnectionOptions = {
    connectionLimit?: number;
    dateStrings?: boolean;
    waitForConnections?: boolean;
    charset?: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
};
export type TPoolCallback = {
    query: (sql: string, callback: (err: any, result: any) => void) => void;
    release: () => void;
};
export type TConnectionTransaction = {
    on: (event: TPoolEvent, data: any) => void;
    query: (sql: string) => Promise<any>;
    startTransaction: () => Promise<any>;
    commit: () => Promise<any>;
    rollback: () => Promise<any>;
};
export type TConnection = {
    on: (event: TPoolEvent, data: any) => void;
    query: (sql: string) => Promise<any>;
    connection: () => Promise<TConnectionTransaction>;
};
export type TOptions = {
    [key: string]: any;
    connectionLimit?: number;
    dateStrings?: boolean;
    waitForConnections?: boolean;
    charset?: string;
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
};
export type TExecute = {
    sql: string;
    type: string;
    message?: string;
    options?: {
        [key: string]: any;
    };
};
export type TPattern = 'snake_case' | 'camelCase';
export type TValidateSchema = null | Record<string, NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor | {
    type: NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor;
    require?: boolean;
    match?: RegExp;
    length?: number;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    enum?: string[] | number[] | boolean[];
    unique?: boolean;
    json?: boolean;
    fn?: Function;
}>;
export type TValidateSchemaDecorator = NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor | {
    type: NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor;
    require?: boolean;
    match?: RegExp;
    length?: number;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    enum?: string[] | number[] | boolean[];
    unique?: boolean;
    json?: boolean;
    fn?: Function;
};
export type TNonEmptyArray<T> = [T, ...T[]];
export type TGlobalSetting = {
    softDelete?: boolean;
    debug?: boolean;
    uuid?: boolean;
    timestamp?: boolean;
    logger?: {
        selected?: boolean;
        inserted?: boolean;
        updated?: boolean;
        deleted?: boolean;
    };
};
export type TOperator = {
    'eq': string;
    'notEq': string;
    'more': string;
    'less': string;
    'moreOrEq': string;
    'lessOrEq': string;
    'like': string;
    'notLike': string;
    'in': string;
    'notIn': string;
    'isNull': string;
    'isNotNull': string;
    'query': string;
    '|eq': string;
    '|notEq': string;
    '|more': string;
    '|less': string;
    '|moreOrEq': string;
    '|lessOrEq': string;
    '|like': string;
    '|notLike': string;
    '|in': string;
    '|notIn': string;
    '|isNull': string;
    '|isNotNull': string;
    '|query': string;
};
export type TPoolEvent = 'CONNECTION' | 'RELEASE' | 'QUERY' | 'SLOW_QUERY' | 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
export type TRawStringQuery = `$RAW:${string}`;
export type TRepositoryCreate<T extends Record<string, any> = any> = {
    data: Partial<{
        [K in keyof T]: T[K];
    }>;
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};
export type TRepositoryCreateMultiple<T extends Record<string, any> = any> = {
    data: Partial<{
        [K in keyof T]: T[K];
    }>[];
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};
export type TRepositoryCreateOrThings<T extends Record<string, any> = any> = {
    data: Partial<{
        [K in keyof T]: T[K];
    }>;
    where: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    debug?: boolean;
};
export type TRepositoryUpdate<T extends Record<string, any> = any> = {
    data: Partial<{
        [K in keyof T]: T[K];
    }>;
    where: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};
export type TRepositoryUpdateMultiple<T extends Record<string, any> = any> = {
    cases: {
        when: Partial<{
            [K in keyof T]: T[K];
        }>;
        columns: Partial<{
            [K in keyof T]: T[K];
        }>;
    }[];
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};
export type TRepositoryDelete<T extends Record<string, any> = any> = {
    where: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : any;
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};
export type TRegistry = {
    '$save': Function;
    '$attach': Function;
    '$detach': Function;
};
export type TRepositoryRequest<T extends Record<string, any> = any, R = any> = {
    debug?: boolean;
    when?: {
        condition: boolean;
        callback: () => TRepositoryRequest<T, R>;
    };
    select?: '*' | (keyof Partial<T> | `${string}.${string}` | TRawStringQuery | '*')[];
    join?: {
        localKey: `${string}.${string}`;
        referenceKey: `${string}.${string}`;
    }[];
    leftJoin?: {
        localKey: `${string}.${string}`;
        referenceKey: `${string}.${string}`;
    }[];
    rightJoin?: {
        localKey: `${string}.${string}`;
        referenceKey: `${string}.${string}`;
    }[];
    where?: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    whereRaw?: string[];
    whereQuery?: Partial<Record<keyof T | `${string}.${string}`, any>> extends infer K ? K : unknown;
    groupBy?: (keyof Partial<T> | `${string}.${string}` | TRawStringQuery)[] extends infer K ? K : unknown;
    having?: string;
    orderBy?: Partial<Record<keyof T | `${string}.${string}` | TRawStringQuery, 'ASC' | 'DESC'>>;
    limit?: number;
    offset?: number;
    relations?: R extends object ? (keyof R)[] : string[];
    relationsExists?: R extends object ? (keyof R)[] : string[];
    relationQuery?: {
        name: R extends object ? (keyof R) : string;
        callback: () => TRepositoryRequest<any, any>;
    };
};
export type TRepositoryRequestHandler<T extends Record<string, any> = any, R = any> = Partial<TRepositoryRequest<T, R> & {
    instance?: Model;
}>;
export type TRepositoryRequestPagination<T extends Record<string, any> = any, R = any> = Partial<TRepositoryRequest<T, R>> & {
    page?: number;
};
export type TRepositoryRequestAggregate<T extends Record<string, any> = any, R = any> = Partial<Omit<TRepositoryRequest<T, R>, 'relations' | 'relationQuery'>>;
