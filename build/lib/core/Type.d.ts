/**
 *
 * @param {type} TSchema typeof the schema
 * @param {type} TSpecific override of the schema
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
 *   type SchemaUserType = SchemaType<typeof schemaUser , {
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *
 *   class User<SchemaUserType> {}
 */
export type SchemaType<TSchema, TSpecific = any> = {
    [K in keyof TSchema]: K extends keyof TSpecific ? TSpecific[K] : any;
};
/**
 *
 * @param {type} T relationships type
 * @example
 * import { Blueprint , RelationType , SchemaUserType , Model } from 'tspace-mysql'
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
 *   type SchemaUserType = SchemaType<typeof schemaUser , {
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *
 *   type RelationUserType =  RelationType<{
 *       phones : SchemaPhoneType[]
 *       phone  : SchemaPhoneType
 *   }>
 *
 *   class User<SchemaUserType,RelationUserType> {}
 */
export type RelationType<T> = {
    [K in keyof T]+?: T[K];
};
