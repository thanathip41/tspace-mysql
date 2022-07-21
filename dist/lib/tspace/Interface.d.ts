export interface Relation {
    name: string;
    model: any;
    as?: string;
    pk?: string | undefined;
    fk?: string | undefined;
    select?: string | undefined;
    hidden?: string | undefined;
    freezeTable?: string | undefined;
    query?: any | undefined;
    relation?: Object | undefined;
    child?: boolean | undefined;
}
export interface RelationShip {
    hasOne: string;
    hasMany: string;
    belongsTo: string;
    belongsToMany: string;
}
export interface RelationShipChild {
    hasOne: string;
    hasMany: string;
    belongsTo: string;
}
export declare type Pattern = 'snake_case' | 'camelCase';
