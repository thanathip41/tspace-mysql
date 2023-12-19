import Model from "./tspace/Model";
export interface Relation {
    name: string;
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
export interface RelationQuery {
    name?: string;
    model: new () => Model;
    as?: string;
    localKey?: string | undefined;
    foreignKey?: string | undefined;
    freezeTable?: string | undefined;
    pivot?: string | undefined;
    query?: any | undefined;
    relation?: Object | undefined;
    exists?: boolean | undefined;
    all?: boolean | undefined;
    trashed?: boolean | undefined;
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
    query: (sql: string) => Promise<any>;
    startTransaction: () => Promise<any>;
    commit: () => Promise<any>;
    rollback: () => Promise<any>;
}
export interface Connection {
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
