export interface Relation {
    name: string;
    model: any;
    as?: string;
    localKey?: string | undefined;
    foreignKey?: string | undefined;
    freezeTable?: string | undefined;
    query?: any | undefined;
    relation?: Object | undefined;
}
export interface RelationQuery {
    name?: string;
    model: any;
    as?: string;
    localKey?: string | undefined;
    foreignKey?: string | undefined;
    freezeTable?: string | undefined;
    query?: any | undefined;
    relation?: Object | undefined;
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
    connection?: {
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
    };
}
export interface BackupToFile {
    database: string;
    filePath: string;
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
export interface Transaction {
    query?: [
        {
            table: string;
            id: string;
        }
    ] | undefined;
}
export declare type Pattern = 'snake_case' | 'camelCase';
