import { TOperatorQuery } from "..";
import { Model }          from "../../core/Model";

export type TRelationQueryDecoratorOptions<K = any> = {
    name?: K extends void ? never : K;
    model: () => new () => Model<any, any>;
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
    modelPivot?:() => new () => Model<any, any>;
};

export type TColumnsDecorator<T, O extends {
    type: "original" | "any";
} = {
    type: "original";
}> = {
    [K in keyof T as T[K] extends string | number | null | boolean | Date ? K : never]: O["type"] extends "any" ? T[K] | TOperatorQuery : T[K];
};

export type TRelationsDecorator<T> = Pick<T, {
    [K in keyof T]: T[K] extends Model | Model[] ? K : never;
}[keyof T]>;

export type TResultDecorator<M extends Model> = {
    [K in keyof M as M[K] extends Function ? never : K]-?: M[K] extends string | number | boolean | Date ? M[K] : M[K] extends Model ? TResultDecorator<M[K]> | undefined : M[K] extends Array<infer U> ? U extends Model ? TResultDecorator<U>[] | undefined : M[K] : M[K];
};