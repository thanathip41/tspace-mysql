import { Model }  from "../../core/Model";
import type { T } from "../../core";

import type { 
  TConnection,
    TConnectionTransaction,
    TNestedBoolean, 
    TRawStringQuery, 
    TRelationKeys, 
    TSchemaKeys 
} from "..";

import type { 
    TColumnsDecorator, 
    TRelationsDecorator 
} from "../decorator";

export type TRepositorySelect<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model = Model
> =
  [unknown, unknown] extends [T, R]
    ? keyof TColumnsDecorator<M> extends never
      ? TNestedBoolean
      : Partial<{
          [K in keyof TColumnsDecorator<M> | keyof TRelationsDecorator<M>]:
            K extends `${string}.${string}` | TRawStringQuery
              ? boolean
              : K extends keyof TRelationsDecorator<M>
                ? M[K] extends (infer U)[]
                  ? U extends Model
                    ? "*" | TRepositorySelect<any, unknown, U>
                    : boolean
                  : M[K] extends Model
                    ? "*" | TRepositorySelect<any, unknown, M[K]>
                    : boolean
                : K extends keyof TColumnsDecorator<M>
                  ? boolean
                  : boolean;
        }>
    : Partial<{
        [K in TSchemaKeys<T> | TRelationKeys<R>]:
          K extends TRelationKeys<R>
            ? K extends TRawStringQuery | `${string}.${string}`
              ? boolean
              : K extends `$${string & K}`
                ? R extends Record<string, any>
                  ? boolean
                  : never
                : R extends Record<string, any>
                  ? R[`$${string & K}`] extends (infer U)[]
                    ? U extends Model
                      ? "*" | TRepositorySelect<T.SchemaModel<U>, T.RelationModel<U>>
                      : never
                    : R[`$${K & string}`] extends Model
                      ? "*" | TRepositorySelect<
                          T.SchemaModel<R[`$${K & string}`]>,
                          T.RelationModel<R[`$${K & string}`]>
                        >
                      : never
                  : never
            : K extends keyof T
              ? boolean
              : never;
      }>;

export type TRepositoryWhere<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model = Model
> =
  [unknown, unknown] extends [T, R]
    ? keyof TColumnsDecorator<M> extends never
      ? Record<string, any>
      : Partial<{
          [K in
            | keyof TColumnsDecorator<M>
            | keyof TRelationsDecorator<M>
            | `${string}.${string}`
            | TRawStringQuery]:
            K extends keyof TRelationsDecorator<M>
              ? TRelationsDecorator<M>[K] extends (infer U)[]
                ? U extends Model
                  ? TRepositoryWhere<any, unknown, U>
                  : never
                : TRelationsDecorator<M>[K] extends Model
                  ? TRepositoryWhere<any, unknown, TRelationsDecorator<M>[K]>
                  : never
              : K extends keyof TColumnsDecorator<M>
                ? TColumnsDecorator<M>[K]
                : never;
        }>
    : Partial<{
        [K in
          | TSchemaKeys<T>
          | TRelationKeys<R>
          | `${string}.${string}`
          | TRawStringQuery]:
          K extends TRelationKeys<R>
            ? K extends `$${string & K}`
              ? R extends Record<string, any>
                ? R[K]
                : never
              : R extends Record<string, any>
                ? R[`$${string & K}`] extends (infer U)[]
                  ? U extends Model
                    ? TRepositoryWhere<T.SchemaModel<U>, T.RelationModel<U>, M>
                    : never
                  : R[`$${K & string}`] extends Model
                    ? TRepositoryWhere<
                        T.SchemaModel<R[`$${K & string}`]>,
                        T.RelationModel<R[`$${K & string}`]>,
                        M
                      >
                    : never
                : never
            : K extends keyof T
              ? T[K]
              : never;
      }>;

export type TRepositoryOrderBy<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model = Model
> =
  [unknown, unknown] extends [T, R]
    ? keyof TColumnsDecorator<M> extends never
      ? Record<string, "ASC" | "DESC">
      : Partial<{
          [K in keyof TColumnsDecorator<M> | keyof TRelationsDecorator<M>]:
            K extends `${string}.${string}` | TRawStringQuery
              ? "ASC" | "DESC"
              : K extends keyof TRelationsDecorator<M>
                ? M[K] extends (infer U)[]
                  ? U extends Model
                    ? TRepositoryOrderBy<any, unknown, U>
                    : never
                  : M[K] extends Model
                    ? TRepositoryOrderBy<any, unknown, M[K]>
                    : never
                : K extends keyof TColumnsDecorator<M>
                  ? "ASC" | "DESC"
                  : never;
        }>
    : Partial<{
        [K in TSchemaKeys<T> | TRelationKeys<R>]:
          K extends TRelationKeys<R>
            ? K extends TRawStringQuery | `${string}.${string}`
              ? "ASC" | "DESC"
              : K extends `$${string & K}`
                ? R extends Record<string, any>
                  ? "ASC" | "DESC"
                  : never
                : R extends Record<string, any>
                  ? R[`$${string & K}`] extends (infer U)[]
                    ? U extends Model
                      ? TRepositoryOrderBy<T.SchemaModel<U>, T.RelationModel<U>>
                      : never
                    : R[`$${K & string}`] extends Model
                      ? TRepositoryOrderBy<
                          T.SchemaModel<R[`$${K & string}`]>,
                          T.RelationModel<R[`$${K & string}`]>
                        >
                      : never
                  : never
            : K extends keyof T
              ? "ASC" | "DESC"
              : never;
      }>;

export type TRepositoryGroupBy<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model = Model
> =
  [unknown, unknown] extends [T, R]
    ? keyof TColumnsDecorator<M> extends never
      ? Record<string, boolean>
      : Partial<{
          [K in keyof TColumnsDecorator<M> | keyof TRelationsDecorator<M>]:
            K extends `${string}.${string}` | TRawStringQuery
              ? boolean
              : K extends keyof TRelationsDecorator<M>
                ? M[K] extends (infer U)[]
                  ? U extends Model
                    ? "*" | TRepositoryGroupBy<any, unknown, U>
                    : boolean
                  : M[K] extends Model
                    ? "*" | TRepositoryGroupBy<any, unknown, M[K]>
                    : boolean
                : K extends keyof TColumnsDecorator<M>
                  ? boolean
                  : boolean;
        }>
    : Partial<{
        [K in TSchemaKeys<T> | TRelationKeys<R>]:
          K extends TRelationKeys<R>
            ? K extends TRawStringQuery | `${string}.${string}`
              ? boolean
              : K extends `$${string & K}`
                ? R extends Record<string, any>
                  ? boolean
                  : never
                : R extends Record<string, any>
                  ? R[`$${string & K}`] extends (infer U)[]
                    ? U extends Model
                      ? "*" | TRepositoryGroupBy<T.SchemaModel<U>, T.RelationModel<U>>
                      : never
                    : R[`$${K & string}`] extends Model
                      ? "*" | TRepositoryGroupBy<
                          T.SchemaModel<R[`$${K & string}`]>,
                          T.RelationModel<R[`$${K & string}`]>
                        >
                      : never
                  : never
            : K extends keyof T
              ? boolean
              : never;
      }>;

export type TRepositoryRelation<
  R = unknown,
  M extends Model = Model
> =
  [unknown] extends [R]
    ? keyof TRelationsDecorator<M> extends never
      ? Record<string, any>
      : Partial<{
          [K in keyof TRelationsDecorator<M>]:
            K extends keyof TRelationsDecorator<M>
              ? TRelationsDecorator<M>[K] extends (infer U)[]
                ? U extends Model
                  ? boolean | (TRepositoryRequest<any, unknown, U> & TRepositoryRelation<unknown, U>)
                  : never
                : TRelationsDecorator<M>[K] extends Model
                  ? boolean | (TRepositoryRequest<any, unknown, TRelationsDecorator<M>[K]> &
                      TRepositoryRelation<unknown, TRelationsDecorator<M>[K]>)
                  : never
              : never;
        }>
    : Partial<{
        [K in TRelationKeys<R>]:
          K extends TRelationKeys<R>
            ? K extends `$${string & K}`
              ? R extends Record<string, any>
                ? boolean
                : never
              : R extends Record<string, any>
                ? R[`$${string & K}`] extends (infer U)[]
                  ? U extends Model
                    ? boolean | (TRepositoryRequest<T.SchemaModel<U>, T.RelationModel<U>> &
                        TRepositoryRelation<T.RelationModel<U>>)
                    : never
                  : R[`$${K & string}`] extends Model
                    ? boolean | (TRepositoryRequest<
                        T.SchemaModel<R[`$${K & string}`]>,
                        T.RelationModel<R[`$${K & string}`]>
                      > &
                        TRepositoryRelation<
                          T.RelationModel<R[`$${K & string}`]>
                        >)
                    : never
                : never
            : never;
      }>;

export type TRepositoryRequest<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model<any, any> = Model<any, any>
> = {
  debug?: boolean;
  cache?: {
    key: string;
    expires: number;
  };
  when?: {
    condition: boolean;
    query: () => TRepositoryRequest<T, R, M>;
  };
  select?: "*" | TRepositorySelect<T, R, M>;
  except?: TRepositorySelect<T, R, M>;
  join?: { localKey: `${string}.${string}`; referenceKey: `${string}.${string}` }[];
  leftJoin?: { localKey: `${string}.${string}`; referenceKey: `${string}.${string}` }[];
  rightJoin?: { localKey: `${string}.${string}`; referenceKey: `${string}.${string}` }[];
  where?: TRepositoryWhere<T, R, M>;
  whereRaw?: string[];
  whereQuery?: TRepositoryWhere<T, R, M>;
  groupBy?: TRepositoryGroupBy<T, R, M>;
  having?: string;
  orderBy?: TRepositoryOrderBy<T, R, M>;
  limit?: number;
  offset?: number;
  relations?: TRepositoryRelation<R, M>;
  relationsExists?: TRepositoryRelation<R, M>;
  model?: (model: M) => M;
  hooks?: Function[];
  audit?: {
    userId: number;
    metadata?: Record<string, any>;
  };
};

export type TRepositoryRequestHandler<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model<any, any> = Model<any, any>
> = Partial<TRepositoryRequest<T, R, M> & { instance?: Model }>;

export type TRepositoryRequestPagination<
  T extends Record<string, any> = any,
  R = unknown,
  M extends Model<any, any> = Model<any, any>
> = Partial<TRepositoryRequest<T, R, M>> & { page?: number };

export type TRepositoryRequestAggregate<
  T extends Record<string, any> = any,
  R = any,
  M extends Model<any, any> = Model<any, any>
> = Partial<Omit<TRepositoryRequest<T, R, M>, "relations" | "relationQuery">>;


export type TRepositoryCreate<M extends Model<any, any> = Model<any, any>> = {
    data: Partial<T.Columns<M>>;
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};

export type TRepositoryCreateMultiple<M extends Model<any, any> = Model<any, any>> = {
    data: Partial<T.Columns<M>>[];
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};

export type TRepositoryCreateOrThings<M extends Model<any, any> = Model<any, any>> = {
    data: Partial<T.Columns<M>>;
    where: T.WhereOptions<M>
    debug?: boolean;
};

export type TRepositoryUpdate<M extends Model<any, any> = Model<any, any>> = {
    data: Partial<T.Columns<M>>;
    where: T.WhereOptions<M>
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};

export type TRepositoryUpdateMultiple<M extends Model<any, any> = Model<any, any>> = {
    cases: {
        when: Partial<T.Columns<M>>;
        columns: Partial<T.Columns<M>>;
    }[];
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};

export type TRepositoryDelete<M extends Model<any, any> = Model<any, any>> = {
    where: T.WhereOptions<M>
    debug?: boolean;
    transaction?: TConnection | TConnectionTransaction;
};
