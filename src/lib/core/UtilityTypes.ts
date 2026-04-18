import { Blueprint }    from "./Blueprint";
import { Model }        from "./Model";
import { Repository }   from "./Repository";
import type { 
    TDeepExpand,
    TResultResolved,
    TFreezeStringQuery, 
    TIsEnum, 
    TOperatorQuery, 
    TPagination, 
    TRawStringQuery, 
    TRelationKeys, 
    TRelationResults, 
    TSelectionMerger,
    TDeepOmit,
    TConflictKeys
} from "../types";

import type { 
    TColumnsDecorator, 
    TRelationsDecorator, 
} from "../types/decorator";

import type { 
    TRepositoryCreate, 
    TRepositoryCreateMultiple, 
    TRepositoryCreateOrThings, 
    TRepositoryDelete, 
    TRepositoryExcept, 
    TRepositoryExtendType, 
    TRepositoryGroupBy, 
    TRepositoryOrderBy, 
    TRepositoryPrimitiveExtendType, 
    TRepositoryRelation, 
    TRepositoryRequest, 
    TRepositorySelect, 
    TRepositoryUpdate, 
    TRepositoryUpdateMultiple, 
    TRepositoryWhere 
} from "../types/repository";
import { z } from "zod";

/**
 * The 'TSchema' type is used to specify the type of the schema.
 *
 * allowed to additional any key and value.
 *
 * @param {type} T typeof the schema
 * @param {type} S override type in the schema
 * @example
 * import { Blueprint , TSchema , Model } from 'tspace-mysql'
 * const schemaUser = {
 *    id :new Blueprint().int().notNull().primary().autoIncrement(),
 *    uuid :new Blueprint().varchar(50).null(),
 *    email :new Blueprint().varchar(50).null(),
 *    name :new Blueprint().varchar(255).null(),
 *    username : new Blueprint().varchar(255).null(),
 *    password : new Blueprint().varchar(255).null(),
 *    createdAt :new Blueprint().timestamp().null(),
 *    updatedAt :new Blueprint().timestamp().null()
 *   }
 *
 *   type TSchemaUser = TSchema<typeof schemaUser , {
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *
 *   class User<TSchemaUser> {}
 */
export type TSchema<T, S = {}> = {
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U : any;
};
/**
 * The 'TRelation' type is used to specify the type of the relation.
 *
 * The function will merge the schema and relationships in the other model
 * @param {type} R relationships type
 * @example
 * import { Blueprint , TRelation , TSchemaUser , Model } from 'tspace-mysql'
 * const schemaUser = {
 *    id :new Blueprint().int().notNull().primary().autoIncrement(),
 *    uuid :new Blueprint().varchar(50).null(),
 *    email :new Blueprint().varchar(50).null(),
 *    name :new Blueprint().varchar(255).null(),
 *    username : new Blueprint().varchar(255).null(),
 *    password : new Blueprint().varchar(255).null(),
 *    createdAt :new Blueprint().timestamp().null(),
 *    updatedAt :new Blueprint().timestamp().null()
 *   }
 *
 *   type TSchemaUser = SchemaType<typeof schemaUser , {
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *
 *   type TRelationUser =  TRelation<{
 *       phones : TSchemaPhone[]
 *       phone  : TSchemaPhone
 *   }>
 *
 *   class User<TSchemaUser,TRelationUser> {}
 *
 *   new User().find().then((user) => user.phone?.name)
 */
export type TRelation<R> = {
    [K in keyof R]+?: R[K] extends Array<infer A> 
        ? A extends Model 
            ? Array<TSchemaModel<A> & TRelationModel<A>> 
            : Array<A> 
        : R[K] extends Model 
            ? TSchemaModel<R[K]> & TRelationModel<R[K]> 
            : R[K];
} & {
    [K in keyof R as `$${K & string}`]: R[K];
};

/**
 * The 'TSchemaModel' type is used to get type of schema in the model
 * @generic {Model} M Model
 * @example
 * import { TSchemaModel } from 'tspace-mysql'
 * import { User } from '../Models/User'
 *
 *  type TSchemaModelOfUser = TSchemaModel<User>
 *   // now you can see the schema like that
 *   {
 *       id : number,
 *       uuid : string | null,
 *       name : string
 *       // ....
 *   }
 *
 */
export type TSchemaModel<M extends Model> =  ReturnType<M['typeOfSchema']>
/**
 * The 'TRelationModel' type is used to get type of schema in the model
 * @generic {Model} M Model
 * @example
 * import { TRelationModel } from 'tspace-mysql'
 * import { User } from '../Models/User
 *
 *  type TRelationModelOfUser = TRelationModel<User>
 *
 *   {
 *       phone : {
 *          id : number,
 *          // ....
 *       }
 *   }
 *
 */
export type TRelationModel<M extends Model> = ReturnType<M['typeOfRelation']>;
/**
 * The 'TResult' type is used to get type of result from model
 * @generic {Model} M Model
 */
export type TResult<M extends Model> = TRelationResults<TRelationModel<M>> & TSchemaModel<M>;

/**
 * The 'TPaginateResult' type is used to get type of result from model using paginate , pagination
 * @generic {Model} M Model
 */
export type TPaginateResult<M extends Model> = TPagination<TRelationResults<TRelationModel<M>> & TSchemaModel<M>>;

export type TSchemaKeyOf<M extends Model, T = TSchemaModel<M>> = keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
} extends never ? string : keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
};

export declare namespace T {
    // This type is not support any decorator from Model;
    // for mark generic type and set to Model.
    // -----------------------------------------------------
    type Schema<T, S = {}>  = T extends Model ? TSchemaModel<T>  :TSchema<T, S>;
    type Relation<R> = TRelation<R>;
    // ------------------------------------------------------

    // --- The type support decorator and self set generic type in model ---
    type SchemaModel<M extends Model> = keyof TColumnsDecorator<M> extends never
        ? TDeepExpand<TSchemaModel<M>>
        : TDeepExpand<TColumnsDecorator<M>>;
 
    type RelationModel<M extends Model> = keyof TColumnsDecorator<M> extends never
        ? TDeepExpand<TRelationModel<M>>
        : TDeepExpand<TRelationsDecorator<M>>;

    type Repository<M extends Model> = ReturnType<typeof Repository<M>>;

    type ResultFiltered<
        M  extends Model,
        S  = undefined,  // selected by columns
        SR = undefined,  // selected by relations
        E  = undefined,  // excepted by omit columns
        SRS = undefined,  // selected by raw select
        G = {}
    > = (
        [S, SR] extends [undefined, undefined]
        
        ?  SRS extends undefined 
            ? E extends undefined 
                ? T.Columns<M> & TRepositoryPrimitiveExtendType<G>  
                : T.Result<M> & TRepositoryPrimitiveExtendType<G> 
            : E extends undefined 
                ? T.Columns<M> & { [ K in keyof SRS ]: any } & TRepositoryPrimitiveExtendType<G>
                : T.Result<M> & { [ K in keyof SRS ]: any } & TRepositoryPrimitiveExtendType<G>
        : TDeepExpand<
            TSelectionMerger<
                SRS extends undefined 
                    ? T.Result<M>
                    : T.Result<M> & { [ K in keyof SRS ]: any }, 
                S extends undefined
                    ? SRS extends undefined 
                        ? { [ K in keyof T.Columns<M> ]: true } // default columns
                        : { [ K in keyof T.Columns<M> ]: true } & { [ K in keyof SRS ]: true }
                    : SRS extends undefined 
                        ? S
                        : S & { [ K in keyof SRS ]: true },
                SR
            >
        > & TRepositoryPrimitiveExtendType<G>
    ) extends infer $Resolved
        ? S extends undefined
            ? E extends undefined
                ? TDeepExpand<$Resolved>
                : TDeepExpand<TDeepOmit<$Resolved,E>>
            : TDeepExpand<$Resolved>
        : never;

    type PaginateResultFiltered<
        M extends Model,
        K = {}, 
        S = undefined, 
        SR = undefined,
        E = undefined,
        SRS = undefined
    > = TDeepExpand<TPagination<ResultFiltered<M, K, S, SR, E,SRS>>>

    type Result<M extends Model, K = {}> = TDeepExpand<TResultResolved<M, K>> & {
        [customKey : string]: unknown;
    };

    type PaginateResult<M extends Model, K = {}> = TDeepExpand<TPagination<Result<M,K>>>
    
    type InsertResult<M extends Model> = TDeepExpand<TResultResolved<M>>;

    type InsertManyResult<M extends Model> = TDeepExpand<TResultResolved<M>>[];

    type InsertNotExistsResult<M extends Model> = TDeepExpand<TResultResolved<M>> | null

    type UpdateResult<M extends Model> = TDeepExpand<TResultResolved<M>> | null

    type UpdateManyResult<M extends Model> = TDeepExpand<TResultResolved<M>>[]

    type DeleteResult = boolean

    type InsertInput<K, C> = {
        [P in Exclude<K & keyof C, "id" | "_id" | "uuid"> as
            null extends C[P] ? never : P]:
            C[P] extends Date
                ? any
                : C[P] extends Record<string, unknown>
                ? string
                : C[P];
        } & {
        [P in Exclude<K & keyof C, "id" | "_id" | "uuid"> as
            null extends C[P] ? P : never]?:
            C[P] extends Date
                ? any
                : C[P] extends Record<string, unknown>
                ? string
                : C[P];
    };

    type UpdateInput<K, C> = {
        [P in Exclude<K & keyof C, "id" | "_id" | "uuid">]?: 
            C[P] extends Date
            ? any
            : C[P] extends Record<string, unknown>
                ? string
                : C[P];
    };

    type NoConflict<
        R extends readonly PropertyKey[],
        O extends readonly PropertyKey[]
    > = TConflictKeys<R, O> extends never
    ? {}
    : {
        ERROR_DUPLICATE_KEYS: TConflictKeys<R, O>
    };

    type ZodShapeCreate<
        M extends Model,
        O extends T.ColumnKeys<M, { OnlyColumn: true }>[] = [],
        Opt extends T.ColumnKeys<M, { OnlyColumn: true }>[] = []
    > = {
    [K in Extract<
        T.ColumnKeys<M, { OnlyColumn: true }>,
        keyof Columns<M>
    > as
        K extends O[number]
        ? K extends Opt[number]
            ? K
            : never
        : K
    ]:
        K extends Opt[number]
        ? z.ZodOptional<BlueprintToZod<Columns<M>[K]>>
        : BlueprintToZod<Columns<M>[K]>;
    };

    type ZodShapeUpdate<
        M extends Model,
        R extends T.ColumnKeys<M, { OnlyColumn: true }>[] = [],
        O extends T.ColumnKeys<M, { OnlyColumn: true }>[] = []
    > = {
    [K in Extract<
        T.ColumnKeys<M, { OnlyColumn: true }>,
        keyof Columns<M>
    > as
        K extends O[number]
        ? never
        : K
    ]:
        K extends R[number]
        ? BlueprintToZod<Columns<M>[K]>
        : z.ZodOptional<BlueprintToZod<Columns<M>[K]>>;
    };

    type BlueprintToZod<T> =
        T extends number ? z.ZodNumber :
        T extends string ? z.ZodString :
        T extends Date ? z.ZodDate :
        T extends null ? z.ZodNull :
        z.ZodTypeAny;

    type ColumnBlueprints<M extends Model> = {
        [K in keyof Columns<M, { InputQuery : true }>]: Blueprint<Columns<M, { InputQuery : true }>[K]>;
    };

    type Columns<
        M extends Model,
        Options extends { InputQuery?: boolean } = {}
        > = TDeepExpand<
        keyof TColumnsDecorator<M> extends never
            ? {
                [K in keyof TSchemaModel<M>]:
                Options['InputQuery'] extends true
                    ? TSchemaModel<M>[K] | TOperatorQuery | TRawStringQuery | TFreezeStringQuery
                    : TSchemaModel<M>[K]
            }
            : TColumnsDecorator<M,Options>
    >

    type ColumnKeys<
        M extends Model,
        Options extends { OnlyColumn?: boolean } = {}
    > = (
        keyof TColumnsDecorator<M> extends never
            ? TSchemaKeyOf<M>
            : keyof TColumnsDecorator<M>
        )
    | (
        Options["OnlyColumn"] extends true
            ? never
            : `${string}.${string}` | TRawStringQuery | TFreezeStringQuery
        );

    // ColumnEnumMap does not work with T.Schema,
    // but it works with decorators and T.SchemaStrict.
    type ColumnEnumMap<M extends Model> =
        keyof TColumnsDecorator<M> extends never
            ? {
                [K in keyof TSchemaModel<M> as
                    TIsEnum<NonNullable<TSchemaModel<M>[K]>> extends true
                        ? K
                        : never
                ]: TSchemaModel<M>[K];
            }
            : {
                [K in keyof TColumnsDecorator<M> as
                    TIsEnum<NonNullable<TColumnsDecorator<M>[K]>> extends true
                        ? K
                        : never
                ]: TColumnsDecorator<M>[K];
            };

    // ColumnEnumKeys does not work with T.Schema,
    // but it works with decorators and T.SchemaStrict.
    type ColumnEnumKeys<M extends Model> =
        keyof TColumnsDecorator<M> extends never
            ? {
                [K in keyof TSchemaModel<M>]: TIsEnum<
                    NonNullable<TSchemaModel<M>[K]>
                > extends true
                    ? K
                    : never;
              }[keyof TSchemaModel<M>]
            : {
                [K in keyof TColumnsDecorator<M>]: TIsEnum<
                    NonNullable<TColumnsDecorator<M>[K]>
                > extends true
                    ? K
                    : never;
              }[keyof TColumnsDecorator<M>];

    type Relations<M extends Model> =
        keyof TColumnsDecorator<M> extends never
            ? TRelationModel<M>
            : TRelationsDecorator<M>;
            
    type RelationKeys<M extends Model> =
        | (keyof TColumnsDecorator<M> extends never
            ? TRelationKeys<TRelationModel<M>>
            : keyof TRelationsDecorator<M>)

    type ColumnOptions<M extends Model> = Columns<M , { InputQuery : true }>;

    type WhereOptions<M extends Model> =
        TRepositoryWhere<TSchemaModel<M>, TRelationModel<M>, M>;

    type SelectOptions<M extends Model> =
        TRepositorySelect<TSchemaModel<M>, TRelationModel<M>, M>;

    type ExceptOptions<M extends Model> =
        TRepositoryExcept<TSchemaModel<M>,TRelationModel<M>, M>;

    type OrderByOptions<M extends Model> =
        TRepositoryOrderBy<TSchemaModel<M>, TRelationModel<M>, M>;

    type GroupByOptions<M extends Model> =
        TRepositoryGroupBy<TSchemaModel<M>, TRelationModel<M>, M>;

    type RelationOptions<M extends Model> = 
        TRepositoryRelation<
            TRelationModel<M>, 
            M
        >;

    type RepositoryOptions<
        M extends Model, 
        S = undefined, 
        SR = undefined, 
        E = undefined, 
        SRS = undefined,
        G = undefined
        > = TRepositoryRequest<
            TSchemaModel<M>, 
            TRelationModel<M>, 
            M,
            S,
            SR,
            E,
            SRS,
            G
        >;

    type RepositoryCreate<M extends Model> = TRepositoryCreate<M>
    type RepositoryCreateMultiple<M extends Model> = TRepositoryCreateMultiple<M>;
    type RepositoryUpdate<M extends Model> = TRepositoryUpdate<M>;
    type RepositoryUpdateMultiple<M extends Model> = TRepositoryUpdateMultiple<M>;
    type RepositoryCreateOrThings<M extends Model> = TRepositoryCreateOrThings<M>;
    type RepositoryDelete<M extends Model>  = TRepositoryDelete<M>;

    type RepositoryGenericTypeOptions = TRepositoryExtendType
};