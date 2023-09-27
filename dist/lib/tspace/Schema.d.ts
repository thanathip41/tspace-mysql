import { Builder } from "./Builder";
declare class Schema extends Builder {
    table: (table: string, schemas: Record<string, any>) => Promise<void>;
    createTable: (table: string, schemas: Record<string, any>) => string;
    /**
     *
     * Sync will check for create or update table or columns with useSchema in your model.
     * @param {string} pathFolders directory to models
     * @property {boolean} options.force - forec to always check columns is exists
     * @property {boolean} options.log   - show log execution with sql statements
     * @property {boolean} options.delay - wait for execution
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
     *               user_id     : new Blueprint().int().notNull(),
     *               title       : new Blueprint().varchar(255).null(),
     *               created_at  : new Blueprint().timestamp().null(),
     *               updated_at  : new Blueprint().timestamp().null(),
     *               deleted_at  : new Blueprint().timestamp().null()
     *           })
     *       }
     *   }
     *
     *  await Schema.sync(`app/Models` , { force : true })
     */
    static sync(pathFolders: string, { force, log, delay }?: {
        force?: boolean | undefined;
        log?: boolean | undefined;
        delay?: number | undefined;
    }): Promise<void>;
    private static _syncExecute;
}
export { Schema };
export default Schema;
