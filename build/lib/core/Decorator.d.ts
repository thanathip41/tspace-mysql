import { RelationQuery, ValidateSchemaDecorator } from "../Interface";
import { Blueprint } from "./Blueprint";
export declare const Table: (name: string) => (constructor: Function) => void;
export declare const TableSingular: () => (constructor: Function) => void;
export declare const TablePlural: () => (constructor: Function) => void;
export declare const Column: (blueprint: () => Blueprint) => (target: any, key: string) => void;
export declare const Validate: (validate: ValidateSchemaDecorator) => (target: any, key: string) => void;
export declare const UUID: (column?: string) => (constructor: Function) => void;
export declare const Observer: (observer: new () => {
    selected: Function;
    created: Function;
    updated: Function;
    deleted: Function;
}) => (constructor: Function) => void;
export declare const Timestamp: (timestampColumns?: {
    createdAt: string;
    updatedAt: string;
}) => (constructor: Function) => void;
export declare const SoftDelete: (column?: string) => (constructor: Function) => void;
export declare const Pattern: (pattern: 'camelCase' | 'snake_case') => (constructor: Function) => void;
export declare const CamelCase: () => (constructor: Function) => void;
export declare const SnakeCase: () => (constructor: Function) => void;
export declare const HasOne: ({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery) => (target: any, key: string) => void;
export declare const HasMany: ({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery) => (target: any, key: string) => void;
export declare const BelongsTo: ({ name, as, model, localKey, foreignKey, freezeTable }: RelationQuery) => (target: any, key: string) => void;
export declare const BelongsToMany: ({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }: RelationQuery) => (target: any, key: string) => void;
