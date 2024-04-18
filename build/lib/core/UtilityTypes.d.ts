import { TRepositoryRequest } from "../types";
import { Blueprint } from "./Blueprint";
import { Model } from "./Model";
/**
 * The 'TSchema' type is used to specify the type of the schema.
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
 * The 'TSchema' type is used to specify the type of the schema.
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
export type SchemaType<T, S = {}> = {
    [K in keyof T]: K extends keyof S ? S[K] : T[K] extends Blueprint<infer U> ? U : any;
};
/**
 * The 'TRelation' type is used to specify the type of the relation.
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
 */
export type TRelation<R> = {
    [K in keyof R]+?: R[K];
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
    [K in keyof R]+?: R[K];
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
 * The 'SchemaModelType' type is used to get type of schema in the model
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
export type SchemaModelType<M extends Model> = ReturnType<M['typeOfSchema']>;
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
 * The 'TRepository' type is used to get type of repository
 * @generic {Model} M Model
 */
export type TRepository<M extends Model> = TRepositoryRequest<TSchemaModel<M>, TRelationModel<M>>;
