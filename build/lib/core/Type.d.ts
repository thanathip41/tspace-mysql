/**
 * The 'SchemaType' type is used to specify the type of the schema.
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
 *   type TSchemaUser = SchemaType<typeof schemaUser , {
 *      id : number,
 *      uuid : string,
 *      ........
 *   }>
 *
 *   class User<TSchemaUser> {}
 */
export type SchemaType<TSchema, TSpecific = any> = {
    [K in keyof TSchema]: K extends keyof TSpecific ? TSpecific[K] : any;
};
/**
 * The 'RelationType' type is used to specify the type of the relation.
 * @param {type} TRelation relationships type
 * @example
 * import { Blueprint , RelationType , TSchemaUser , Model } from 'tspace-mysql'
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
 *   type TRelationUser =  RelationType<{
 *       phones : TSchemaPhone[]
 *       phone  : TSchemaPhone
 *   }>
 *
 *   class User<TSchemaUser,TRelationUser> {}
 */
export type RelationType<TRelation> = {
    [K in keyof TRelation]+?: TRelation[K];
};
