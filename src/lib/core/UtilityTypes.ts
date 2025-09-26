import { Blueprint }    from "./Blueprint";
import { Model }        from "./Model";
import { Repository }   from "./Repository";
import type { 
    TFreezeStringQuery, 
    TIsEnum, 
    TPagination, 
    TRawStringQuery, 
    TRelationResults 
} from "../types";

import type { 
    TColumnsDecorator, 
    TRelationsDecorator, 
    TResultDecorator 
} from "../types/decorator";

import type { 
    TRepositoryCreate, 
    TRepositoryCreateMultiple, 
    TRepositoryCreateOrThings, 
    TRepositoryDelete, 
    TRepositoryGroupBy, 
    TRepositoryOrderBy, 
    TRepositoryRelation, 
    TRepositoryRequest, 
    TRepositorySelect, 
    TRepositoryUpdate, 
    TRepositoryUpdateMultiple, 
    TRepositoryWhere 
} from "../types/repository";
/**
 * The 'TSchemaStrict' type is used to specify the type of the schema.
 *
 * @param {type} T typeof the schema
 * @param {type} S override type in the schema
 * @example
 * import { Blueprint, TSchema, Model, Schema } from 'tspace-mysql';
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
 *   type TSchemaUser = TSchemaStrict<typeof schemaUser , {
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *
 *   class User<TSchemaUser> {}
 */
export type TSchemaStrict<T, S = {}> = {
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U : any;
};
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
} & {
    [key: string]: any;
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
    [K in keyof R]+?: R[K] extends Array<infer A> ? A extends Model ? Array<TSchemaModel<A> & TRelationModel<A>> : Array<A> : R[K] extends Model ? TSchemaModel<R[K]> & TRelationModel<R[K]> : R[K];
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
export type TSchemaModel<M extends Model> = ReturnType<M['typeOfSchema']>;
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
 * The 'TResultPaginate' type is used to get type of result from model using paginate , pagination
 * @generic {Model} M Model
 */
export type TResultPaginate<M extends Model> = TPagination<TRelationResults<TRelationModel<M>> & TSchemaModel<M>>;

export type TSchemaKeyOf<M extends Model, T = TSchemaModel<M>> = keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
} extends never ? string : keyof {
    [K in keyof T as string extends K ? never : K]: T[K];
};
export declare namespace T {
    // This type is not support any decorator from Model;
    // for mark generic type and set to Model.
    // -----------------------------------------------------
    type Schema<T, S = {}>  = TSchema<T, S>;
    type SchemaStrict<T, S = {}> = TSchemaStrict<T, S>;
    type Relation<R> = TRelation<R>;
    // ------------------------------------------------------

    // --- The type support decorator and self set generic type in model ---
    type SchemaModel<M extends Model> = keyof TColumnsDecorator<M> extends never
        ? TSchemaModel<M>
        : TColumnsDecorator<M>;

    type RelationModel<M extends Model> = keyof TColumnsDecorator<M> extends never
        ? TRelationModel<M>
        : TRelationsDecorator<M>;

    type Repository<M extends Model> = ReturnType<typeof Repository<M>>;

    type Result<M extends Model, K = {}> =
        unknown extends TResult<M>
            ? unknown extends TResultDecorator<M>
                ? Record<K & string, any>
                : {} extends TResultDecorator<M>
                    ? Record<K & string, any>
                    : TResultDecorator<K & M>
            : TResult<K & M>;

    type ResultPaginate<M extends Model, K = {}> = TPagination<Result<M, K>>;

    type Columns<M extends Model> =
        keyof TColumnsDecorator<M> extends never
            ? TSchemaModel<M>
            : TColumnsDecorator<M>;

    type ColumnKeys<M extends Model> =
        | (keyof TColumnsDecorator<M> extends never
            ? TSchemaKeyOf<M>
            : keyof TColumnsDecorator<M>)
        | `${string}.${string}`
        | TRawStringQuery
        | TFreezeStringQuery;

    type ColumnsEnum<M extends Model> =
        keyof TColumnsDecorator<M> extends never
            ? {
                // @ts-ignore
                [K in TSchemaKeyOf<M> as TIsEnum<NonNullable<M[K]>> extends true ? K : never]: NonNullable<M[K]>;
            }
            : {
                [K in keyof TColumnsDecorator<M> as TIsEnum<NonNullable<TColumnsDecorator<M>[K]>> extends true ? K : never]:
                NonNullable<TColumnsDecorator<M>[K]>;
            };

    type ColumnEnumKeys<M extends Model> =
        keyof TColumnsDecorator<M> extends never
            ? {
                // @ts-ignore
                [K in TSchemaKeyOf<M>]: TIsEnum<NonNullable<M[K]>> extends true
                    ? K
                    : never;
              }[TSchemaKeyOf<M>]
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
            ? TSchemaKeyOf<M>
            : keyof TColumnsDecorator<M>)
        | `${string}.${string}`
        | TRawStringQuery
        | TFreezeStringQuery;

    type TSchemaModelWithoutDecorator<M extends Model>   = ReturnType<M['typeOfSchema']>;

    type TRelationModelWithoutDecorator<M extends Model> = ReturnType<M['typeOfRelation']>;

    type WhereOptions<M extends Model> =
        TRepositoryWhere<TSchemaModelWithoutDecorator<M>, TRelationModelWithoutDecorator<M>, M>;

    type SelectOptions<M extends Model> =
        TRepositorySelect<TSchemaModelWithoutDecorator<M>, TRelationModelWithoutDecorator<M>, M>;

    type OrderByOptions<M extends Model> =
        TRepositoryOrderBy<TSchemaModelWithoutDecorator<M>, TRelationModelWithoutDecorator<M>, M>;

    type GroupByOptions<M extends Model> =
        TRepositoryGroupBy<TSchemaModelWithoutDecorator<M>, TRelationModelWithoutDecorator<M>, M>;

    type RelationOptions<M extends Model> =
        TRepositoryRelation<TRelationModelWithoutDecorator<M>, M>;

    type RepositoryOptions<M extends Model> =
        TRepositoryRequest<TSchemaModelWithoutDecorator<M>, TRelationModelWithoutDecorator<M>, M>;

    type RepositoryCreate<M extends Model> = TRepositoryCreate<M>
    type RepositoryCreateMultiple<M extends Model> = TRepositoryCreateMultiple<M>;
    type RepositoryUpdate<M extends Model> = TRepositoryUpdate<M>;
    type RepositoryUpdateMultiple<M extends Model> = TRepositoryUpdateMultiple<M>;
    type RepositoryCreateOrThings<M extends Model> = TRepositoryCreateOrThings<M>;
    type RepositoryDelete<M extends Model>  = TRepositoryDelete<M>;
};