import Model from "./core/Model";
export interface Relation<K = any> {
    name: K extends void ? never : K;
    model: new () => Model;
    as?: string | undefined;
    localKey?: string | undefined;
    foreignKey?: string | undefined;
    freezeTable?: string | undefined;
    pivot?: string | undefined;
    query?: any | undefined;
    relation?: Object | undefined;
    exists?: boolean | undefined;
    all?: boolean | undefined;
    trashed?: boolean | undefined;
    count?: boolean | undefined;
    oldVersion?: boolean | undefined;
    modelPivot?: new () => Model | undefined;
}
export interface RelationQuery<K = any> {
    name?: K extends void ? never : K;
    model: new () => Model;
    as?: string | undefined;
    localKey?: string | undefined;
    foreignKey?: string | undefined;
    freezeTable?: string | undefined;
    pivot?: string | undefined;
    query?: any | undefined;
    relation?: Object | undefined;
    exists?: boolean | undefined;
    all?: boolean | undefined;
    trashed?: boolean | undefined;
    count?: boolean | undefined;
    oldVersion?: boolean | undefined;
    modelPivot?: new () => Model | undefined;
}
export interface RelationShip {
    hasOne: string;
    hasMany: string;
    belongsTo: string;
    belongsToMany: string;
}
export interface Pagination {
    meta: {
        total: number;
        limit: number;
        total_page: number;
        current_page: number;
        last_page: number;
        next_page: number;
        prev_page: number;
    };
    data: any[];
}
export interface Backup {
    database: string;
    to?: {
        host: string;
        port: number;
        username: string;
        password: string;
    };
}
export interface BackupToFile {
    database: string;
    filePath: string;
    table?: string;
    connection?: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
}
export interface BackupTableToFile {
    filePath: string;
    table: string;
    connection?: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
}
export interface ConnectionOptions {
    connectionLimit?: number;
    dateStrings?: boolean;
    waitForConnections?: boolean;
    charset?: string;
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
}
export interface PoolCallback {
    query: (sql: string, callback: (err: any, result: any) => void) => void;
    release: () => void;
}
export interface ConnectionTransaction {
    on: (event: PoolEvent, data: any) => void;
    query: (sql: string) => Promise<any>;
    startTransaction: () => Promise<any>;
    commit: () => Promise<any>;
    rollback: () => Promise<any>;
}
export interface Connection {
    on: (event: PoolEvent, data: any) => void;
    query: (sql: string) => Promise<any>;
    connection: () => Promise<ConnectionTransaction>;
}
export interface Options {
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
}
export interface Execute {
    sql: string;
    type: string;
    message?: string;
    options?: {
        [key: string]: any;
    };
}
export type Pattern = 'snake_case' | 'camelCase';
export type ValidateSchema = null | Record<string, NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor | {
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
export type ValidateSchemaDecorator = NumberConstructor | StringConstructor | DateConstructor | BooleanConstructor | {
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
export type NonEmptyArray<T> = [T, ...T[]];
export interface GlobalSetting {
    softDelete?: boolean;
    uuid?: boolean;
    timestamp?: boolean;
    logger?: boolean;
}
export interface Operator {
    equals: string;
    notEquals: string;
    greaterThan: string;
    lessThan: string;
    greaterThanOrEqual: string;
    lessThanOrEqual: string;
    like: string;
    notLike: string;
    in: string;
    notIn: string;
    isNull: string;
    isNotNull: string;
}
export type PoolEvent = 'CONNECTION' | 'RELEASE' | 'QUERY' | 'SLOW_QUERY' | 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
