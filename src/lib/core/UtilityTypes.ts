import { Blueprint }    from "./Blueprint";
import { Model }        from "./Model";
import { Repository }   from "./Repository";
import type { 
    TPagination, 
    TRelationResults, 
    TRepositoryRequest 
} from "../types";

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
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U  : any
}

/**
 * The 'TSchemaStrict' type is used to specify the type of the schema.
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
 *   type TSchemaUser = TSchemaStrict<typeof schemaUser , { 
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *   
 *   class User<TSchemaUser> {}
 */
export type SchemaTypeStrict<T, S = {}> = {
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U : any
}

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
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U  : any
} & { [key : string] : any };

/**
 * The 'SchemaType' type is used to specify the type of the schema.
 * 
 * allowed to additional any key and value.
 * 
 * @param {type} T typeof the schema
 * @param {type} S override type in the schema
 * @example 
 * import { Blueprint , SchemaType , Model } from 'tspace-mysql'
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
 *   class User<TSchemaUser> {}
 */
export type SchemaType<T, S = {}> = {
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U : any
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
      : R[K]
} & {
    [K in keyof R as `$${K & string}`]: R[K];
};

/**
 * The 'TRelation' type is used to specify the type of the relation.
 * @generic {type} R relationships type
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
 */
export type RelationType<R> = {
    [K in keyof R]+?: R[K] extends Array<infer A>
    ? A extends Model
        ? Array<TSchemaModel<A> & TRelationModel<A>>
        : Array<A>
    : R[K] extends Model
      ? TSchemaModel<R[K]> & TRelationModel<R[K]>
      : R[K]
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
export type TResult<M extends Model> = TRelationResults<TRelationModel<M>> & TSchemaModel<M>

/**
 * The 'TResultPaginate' type is used to get type of result from model using paginate , pagination
 * @generic {Model} M Model
 */
export type TResultPaginate<M extends Model> = TPagination<TRelationResults<TRelationModel<M>> & TSchemaModel<M>>

/**
 * The 'TRepository' type is used to get type of repository
 * @generic {Model} M Model
 */
export type TRepository<M extends Model> = TRepositoryRequest<TSchemaModel<M> , TRelationModel<M>>;

/**
 * The 'TypeOfRepository' type is used to return typeof repository
 * @generic {Model} M Model
 */
export type TRepositoryTypeOf<M extends Model> =  ReturnType<typeof Repository<M>>

/**
 * The 'TSchemaKeyOf' type is used to get keyof type TSchemaModel<Model>
 * @generic {Model} M Model
 */
export type TSchemaKeyOf<
    M extends Model , T = TSchemaModel<M>
> = keyof {
    [K in keyof T as string extends K ? never : K]: T[K]
} extends never 
    ? string 
    : keyof {
        [K in keyof T as string extends K ? never : K]: T[K]
    }

export namespace T {
    export type Schema<T, S = {}> = TSchema<T, S>;
    export type SchemaStrict<T, S = {}> = TSchemaStrict<T, S>;
    export type SchemaModel<M extends Model> = TSchemaModel<M>;
    export type KeyOf<M extends Model> = TSchemaKeyOf<M>;
    export type Column<M extends Model> = TSchemaKeyOf<M>;

    export type Relation<R> = TRelation<R>;
    export type RelationModel<M extends Model> = TRelationModel<M>;

    export type Repository<M extends Model> = TRepository<M>;
    export type RepositoryTypeOf<M extends Model> = TRepositoryTypeOf<M>;


    export type Result<
        M extends Model,
        Opts extends { paginate?: boolean } = {}
    > = Opts['paginate'] extends true
        ? TResultPaginate<M>
        : TResult<M>;
        
    export type Results<
        M extends Model,
        Opts extends { paginate?: boolean } = {}
    > = Opts['paginate'] extends true
        ? TResultPaginate<M>
        : TResult<M>;
}