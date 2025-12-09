import { Model } from "../core/Model";
import { TCache as Cache } from '../core/Cache';
import { CONSTANTS } from '../constants';
import { Join } from "../core/Join";
import { QueryBuilder } from "../core/Driver";

export type TCache = Cache;

export type TConstant = typeof CONSTANTS;

export type TRelationOptions<K = any> = {
    name: K;
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
    notExists?: boolean;
    all?: boolean;
    trashed?: boolean;
    count?: boolean;
    oldVersion?: boolean;
    modelPivot?: new () => Model;
};

export type TRelationQueryOptions<K = any> = {
    name : K extends void ? never : K;
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

export type TPagination<K = any> = {
    meta: {
        total: number;
        limit: number;
        count: number;
        current_page: number;
        last_page: number;
        next_page: number;
        prev_page: number;
        currentPage: number;
        lastPage: number;
        nextPage: number;
        prevPage: number;
    };
    data: K[];
};

export type TSave = 
| "INSERT" | "INSERT_MULTIPLE" | "INSERT_NOT_EXISTS" | "INSERT_OR_SELECT"
| "UPDATE"  | "UPDATE_OR_INSERT"

export type TBackup = {
    database: string;
    to?: {
        driver?: TDriver;
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
    [key: string]: any;
    driver?: TDriver;
    host: string;
    port: number;
    database?: string;
    username: string;
    password: string;
};

export type TPoolCallback = {
    query: (sql: string, callback: (err: any, result: any) => void) => void;
    release: () => void;
};

export type TConnectionTransaction = {
    on: (event: TPoolEvent, data: any) => void;
    query: (sql: string) => Promise<any[]>;
    /**
     * The 'startTransaction' method is used when need to started the transaction
     * @returns {Promise<void>}
     */
    startTransaction: () => Promise<void>;
    /**
     * The 'commit' method is used to when need to commit the transactions is successfully
     * @returns {Promise<void>}
     */
    commit: () => Promise<void>;
    /**
     * The 'rollback ' method is used to when the transaction is failed
     * @returns {Promise<void>}
     */
    rollback: () => Promise<void>;
    /**
     * The 'end ' method is used to end the transction
     * @returns {Promise<void>}
     */
    end: () => Promise<void>;
};

export type TConnection = {
    on: (event: TPoolEvent, data: any) => void;
    query: (sql: string) => Promise<any[]>;
    queryBuilder: typeof QueryBuilder;
    startTransaction: () => Promise<void>;
    commit: () => Promise<void>;
    rollback: () => Promise<void>;
    end: () => Promise<void>;
};

export type TPoolConnected = {
    database : () => string;
    on: (event: TPoolEvent, data: (r: any) => any) => void;
    queryBuilder: typeof QueryBuilder;
    query: (sql: string) => Promise<any[]>;
    connection: () => Promise<TConnection>;
};

export type TModelConstructorOrObject = {
    model: new () => Model<any, any>;
    alias?: string;
    key?: string;
    join?: Join;
} | (new () => Model<any, any>);

export type TCreateNewConnection = {
    on: (event: TPoolEvent, data: (r: any) => any) => void;
    query: (sql: string) => Promise<any>;
    connection: () => Promise<TConnectionTransaction>;
};

export type TOptions = {
    [key: string]: any;
    driver?: TDriver;
    host: string;
    port: number;
    database?: string;
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
    fn?: (value: any) => string | null | Promise<string | null>;
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
export type TPoolEvent = 'release' | 'query' | 'slowQuery' | 'select' | 'insert' | 'update' | 'delete';

export type TRawStringQuery = `$RAW:${string}`;

export type TFreezeStringQuery = `$Freeze:${string}`;

export type TOperatorQuery = `$OP:${string}`;

export type TPickColumns<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type TPickRelations<T, K extends keyof T> = {
    [P in K]: T[P];
};

export type TRegistry = {
    '$save'?: Function;
    '$attach'?: Function;
    '$detach'?: Function;
};
export type TSchemaColumns<T> = TSchemaKeys<T> | `${string}.${string}` | TRawStringQuery | TFreezeStringQuery;

export type TSchemaKeys<T> = keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
} extends never ? string : keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
};

export type TRelationResults<T> = T extends Array<infer A> ? TRelationResults<A>[] : T extends object ? {
    [K in keyof T as K extends `$${string}` ? never : K]: TRelationResults<T[K]>;
} : T;

export type TRelationKeys<T> =
  { [K in keyof T as K extends `$${string}` ? never : K]: T[K] } extends infer R
    ? keyof R extends never
      ? string
      : keyof R
    : string;


export type TNestedBoolean = boolean | {
    [key: string]: TNestedBoolean;
};

export type TStoreProcedure = {
    params: (string | number | boolean)[] | Record<string, string | number | boolean>;
    result: unknown;
};
export type TRemoveIndexSignature<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};
export type TLiteralStringKeys<T> = {
    [K in keyof T]: T[K] extends string ? (string extends T[K] ? never : K) : never;
}[keyof T];
export type TLiteralEnumKeys<T> = TLiteralStringKeys<TRemoveIndexSignature<T>>;
export type TDriver = 'pg' | 'postgres' | 'mysql' | 'mysql2' | 'mariadb' | 'mssql' | 'sqlite3';
export type TPoolCusterOptions = {
    writer: {
        host: string;
        user: string;
        password: string;
        database: string;
    };
    readers: {
        host: string;
        user: string;
        password: string;
        database: string;
    }[];
};
type TClusterPool = {
    pool: {
        type: string;
        node: number;
        host: string;
        port: number;
        username: string;
    };
    on: (event: TPoolEvent, data: (r: any) => any) => void;
    queryBuilder: typeof QueryBuilder;
    query: (sql: string) => Promise<any[]>;
    connection: () => Promise<TConnection>;
};
export type TPoolCusterConnected = {
    database?: () => string
    query?: Function | null;
    queryBuilder?: QueryBuilder | null;
    masters: TClusterPool[];
    slaves: TClusterPool[];
};
export type TIsEnum<T> = string extends T ? false : number extends T ? false : boolean extends T ? false : [
    T
] extends [string | number] ? true : false;

export type TLifecycle =
| "beforeInsert"
| "afterInsert"
| "beforeUpdate"
| "afterUpdate"
| "beforeRemove"
| "afterRemove";
