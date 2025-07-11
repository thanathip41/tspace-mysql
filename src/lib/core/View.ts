import { Model } from "./Model";
import { DB }    from "./DB";
class View<
  TS extends Record<string, any> = any,
  TR = unknown
> extends Model<TS,TR> {

    createView({ name, expression, synchronize }: { 
        name?: string; 
        expression: string;  
        synchronize?: boolean
     }) {
        const baseTableName = this._classToTableName();
        const patternTableName = this._valuePattern(baseTableName);
        const viewName = name ?? patternTableName;

        const fn = async () => {
            try {

                if(synchronize) {
                    await DB
                    .query(`DROP VIEW IF EXISTS ${viewName};`)
                    .catch(() => null)
                }

                return await DB
                .query(`${this.$constants('CREATE_VIEW')} ${viewName} ${this.$constants('AS')} ${expression};`)

            } catch (err:any) {
                const message = err.message
                const exists = String(message).includes(`Table '${viewName}' already exists`)

                if(exists) return;

                console.log('Fail To Craete View: ',message);
                
                throw err
            }
           
        }

        this.table(viewName);
        this.useMiddleware(fn);

        return this;
    }
}

export { View };
export default View;
