import { Model } from "./Model";
import { DB }    from "./DB";
class View<
  TS extends Record<string, any> = any,
  TR = unknown
> extends Model<TS,TR> {

    createView({ name, expression }: { name?: string; expression: string }) {
        const baseTableName = this._classToTableName();
        const escapedTableName = `\`${this._valuePattern(baseTableName)}\``;
        const viewName = name ?? escapedTableName;

        const fn = async () => {
            const createViewSQL = [
                this.$constants('CREATE_VIEW'),
                viewName,
                this.$constants('AS'),
                expression
            ].join(' ')

            try {

                return await DB
                .query(createViewSQL)

            } catch (err:any) {
                const exists = String(err.message).includes(`Table '${viewName}' already exists`)

                if(exists) return;

                console.log('Fail To Craete View: ', err.message)
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
