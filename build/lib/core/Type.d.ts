export type SchemaType<TSchema, TSpecific = any> = {
    [K in keyof TSchema]: K extends keyof TSpecific ? TSpecific[K] : any;
};
export type RelationType<T> = {
    [K in keyof T]: T[K];
};
