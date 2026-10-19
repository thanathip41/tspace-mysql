import { DB }           from "./DB";
import { AbstractView } from "./Abstracts/AbstractView";
import { Model } from "./Model";

/**
 *
 * 'View' class represents a database view, similar to a table, but based on a stored SQL query.
 * @generic {Type} TS
 * @generic {Type} TR
 * @example
    import { type T, Blueprint, Model , View , Meta } from 'tspace-mysql'

    const schemaUser = {
        id: Blueprint.int().notNull().primary().autoIncrement(),
        uuid: Blueprint.varchar(50).null().index(),
        name: Blueprint.varchar(191).notNull(),
        email: Blueprint.varchar(191).notNull()
    }

    type TUser = T.Schema<typeof schemaUser>

    class User extends Model<TUser> {
        protected boot(): void {
            this.useCamelCase()
            this.useSchema(schemaUser)
        }
    }

    const schemaPost = {
        id: Blueprint.int().notNull().primary().autoIncrement(),
        uuid: Blueprint.varchar(50).null().index(),
        userId :Blueprint.int().notnull(),
        title: Blueprint.varchar(191).notNull(),
        content: Blueprint.varchar(191).notNull()
    }

    type TPost = T.Schema<typeof schemaPost>

    class Post extends Model<TPost> {
        protected boot(): void {
        this.useSchema(schemaPost)
        }
    }

    const schemaUserPostCountView = {
        id :Blueprint.int().notNull().primary().autoIncrement(),
        userId :Blueprint.int().notnull(),
        name :Blueprint.varchar(255).null(),
        postCount : Blueprint.int().notnull()
    }

    type TSUserPostCountView = T.Schema<typeof schemaUserPostCountView>
    type TRUserPostCountView = T.Relation<{
        user: User
    }>

    class UserPostCountView extends View<TSUserPostCountView,TRUserPostCountView> {
        protected boot(): void {
            this.useCamelCase()
            this.useSchema(schemaUserPostCountView)
            const metaUser = Meta(User)
            const metaPost = Meta(Post)

            this.createView({
                synchronize: true,
                expression : new User()
                .selectRaw(`ROW_NUMBER() OVER (ORDER BY ${metaUser.columnRef('id')}) AS id`)
                .selectRaw(`${metaUser.columnRef('id')} AS userId`)
                .selectRaw(metaUser.columnRef('name'))
                .select(metaUser.columnRef('email'))
                .selectRaw(`COUNT(${metaPost.columnRef('id')}) AS postCount`)
                .leftJoin(metaUser.columnRef('id'),metaPost.columnRef('userId'))
                .groupBy(metaUser.columnRef('id'))
                .groupBy(metaUser.columnRef('name'))
                .toString()
            })

            this.belongsTo({ name : 'user' , model : User })
        }
    }
 */
class View<TS extends Record<string, any> = any,TR = unknown> extends AbstractView<TS,TR>{

    /**
     * The 'createView' method is used create table and stored SQL query.
     * 
     * @param    {object}   object { name, expression, synchronize }
     * @property {string?}  object.name
     * @property {string}   object.expression
     * @property {boolean}  object.synchronize
     * @returns  {void}
     */
    protected createView({ name, expression, synchronize }: { 
        name        ?: string; 
        expression   : Model | DB | string;  
        synchronize ?: boolean;
     }): void {
        const baseViewName = this._classToTableName();
        const patternViewName = this._valuePattern(baseViewName);
        const viewName = name ?? patternViewName;
        const qb = this._queryBuilder();

        let sql = qb.createView({
            name : viewName,
            expression : `${expression}`
        })
       
        const fn = async () => {
           
            if(synchronize) {
                const dropViewSQL = qb.dropView(viewName);

                await DB
                .dd(this.$state.get('DEBUG'))
                .query(dropViewSQL)
            }

            const rawView = await DB
            .dd(this.$state.get('DEBUG'))
            .query(qb.hasView({ name : viewName , database : this.$database }));

            const viewExists = Boolean(rawView[0]?.IS_EXISTS ?? false);

            if(viewExists) return;

            await DB
            .dd(this.$state.get('DEBUG'))
            .query(sql)
        }

        this.table(viewName);
        this.useMiddleware(fn);
    }
}

export { View };
export default View;