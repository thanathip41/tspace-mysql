import { Builder } from "./Builder";
declare class Schema extends Builder {
    table: (table: string, schemas: Record<string, any>) => Promise<void>;
    createTable: (table: string, schemas: Record<string, any>) => string;
    /**
    *
    * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
    *
    * The schema can define with method 'useSchema'
    * @param    {string} pathFolders directory to models
    * @property {boolean} options.force - forec always check all columns if not exists will be created
    * @property {boolean} options.log   - show log execution with sql statements
    * @property {boolean} options.foreign - check when has a foreign keys will be created
    * @property {boolean} options.changed - check when column is changed attribute will be change attribute
    * @return {Promise<void>}
    * @example
    *
    * - node_modules
    * - app
    *   - Models
    *     - User.ts
    *     - Post.ts
    *
    *  // file User.ts
    *  class User extends Model {
    *      constructor(){
    *          super()
    *          this.hasMany({ name : 'posts' , model : Post })
    *          this.useSchema ({
    *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
    *               uuid        : new Blueprint().varchar(50).null(),
    *               email       : new Blueprint().int().notNull().unique(),
    *               name        : new Blueprint().varchar(255).null(),
    *               created_at  : new Blueprint().timestamp().null(),
    *               updated_at  : new Blueprint().timestamp().null(),
    *               deleted_at  : new Blueprint().timestamp().null()
    *           })
    *       }
    *   }
    *
    *   // file Post.ts
    *   class Post extends Model {
    *      constructor(){
    *          super()
    *          this.hasMany({ name : 'comments' , model : Comment })
    *          this.belongsTo({ name : 'user' , model : User })
    *          this.useSchema ({
    *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
    *               uuid        : new Blueprint().varchar(50).null(),
    *               user_id     : new Blueprint().int().notNull().foreign({ references : 'id' , on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
    *               title       : new Blueprint().varchar(255).null(),
    *               created_at  : new Blueprint().timestamp().null(),
    *               updated_at  : new Blueprint().timestamp().null(),
    *               deleted_at  : new Blueprint().timestamp().null()
    *           })
    *       }
    *   }
    *
    *
    *  await new Schema().sync(`app/Models` , { force : true , log = true, foreign = true , changed = true })
    */
    sync(pathFolders: string, { force, log, foreign, changed }?: {
        force?: boolean | undefined;
        log?: boolean | undefined;
        foreign?: boolean | undefined;
        changed?: boolean | undefined;
    }): Promise<void>;
    /**
     *
     * The 'Sync' method is used to check for create or update table or columns with your schema in your model.
     *
     * The schema can define with method 'useSchema'
     * @param    {string} pathFolders directory to models
     * @type     {object}  options
     * @property {boolean} options.force - forec always check all columns if not exists will be created
     * @property {boolean} options.log   - show log execution with sql statements
     * @property {boolean} options.foreign - check when has a foreign keys will be created
     * @property {boolean} options.changed - check when column is changed attribute will be change attribute
     * @return {Promise<void>}
     * @example
     *
     * - node_modules
     * - app
     *   - Models
     *     - User.ts
     *     - Post.ts
     *
     *  // file User.ts
     *  class User extends Model {
     *      constructor(){
     *          super()
     *          this.hasMany({ name : 'posts' , model : Post })
     *          this.useSchema ({
     *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *               uuid        : new Blueprint().varchar(50).null(),
     *               email       : new Blueprint().int().notNull().unique(),
     *               name        : new Blueprint().varchar(255).null(),
     *               created_at  : new Blueprint().timestamp().null(),
     *               updated_at  : new Blueprint().timestamp().null(),
     *               deleted_at  : new Blueprint().timestamp().null()
     *           })
     *       }
     *   }
     *
     *   // file Post.ts
     *   class Post extends Model {
     *      constructor(){
     *          super()
     *          this.hasMany({ name : 'comments' , model : Comment })
     *          this.belongsTo({ name : 'user' , model : User })
     *          this.useSchema ({
     *               id          : new Blueprint().int().notNull().primary().autoIncrement(),
     *               uuid        : new Blueprint().varchar(50).null(),
     *               user_id     : new Blueprint().int().notNull().foreign({ references : 'id' , on : User , onDelete : 'CASCADE' , onUpdate : 'CASCADE' }),
     *               title       : new Blueprint().varchar(255).null(),
     *               created_at  : new Blueprint().timestamp().null(),
     *               updated_at  : new Blueprint().timestamp().null(),
     *               deleted_at  : new Blueprint().timestamp().null()
     *           })
     *       }
     *   }
     *
     *
     *  await Schema.sync(`app/Models` , { force : true })
     */
    static sync(pathFolders: string, { force, log, foreign, changed }?: {
        force?: boolean | undefined;
        log?: boolean | undefined;
        foreign?: boolean | undefined;
        changed?: boolean | undefined;
    }): Promise<void>;
    private _import;
    private _syncExecute;
    private _syncForeignKey;
}
type SchemaType<TSchema, TSpecific = any> = {
    [K in keyof TSchema]: K extends keyof TSpecific ? TSpecific[K] : any;
};
export { Schema, SchemaType };
export default Schema;
