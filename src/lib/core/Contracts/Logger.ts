import { Model }      from "../Model";
import { Blueprint }  from '../Blueprint';
import { T }          from "../UtilityTypes";
import { AbstractModel } from "../Abstracts/AbstractModel";
import { DB } from "../DB";

const schema = {
    id: new Blueprint().int().notNull().primary().autoIncrement(),
    uuid: new Blueprint().varchar(50).null(),
    model: new Blueprint().varchar(50).null(),
    query: new Blueprint().longText().null(),
    action: new Blueprint().varchar(50).null(),
    data: new Blueprint().json().null(),
    changed: new Blueprint().json().null(),
    created_at: new Blueprint().timestamp().null(),
    updated_at: new Blueprint().timestamp().null(),
};

type TS = T.Schema<typeof schema>

class Logger extends Model<TS> {
    constructor(){
        super()
        this.useUUID();
        this.useSchema(schema);
        this.useTimestamp();
        this.useTable(this.$state.get('TABLE_LOGGER'));
    }

    static async detected (instance : Model, { 
        sql, 
        result,
    } : { sql : string; result : any }) : Promise<void> {
        try {

            const selectRegex = /^SELECT\b/i;
            const updateRegex = /^UPDATE\b/i;
            const insertRegex = /^INSERT\b/i;
            const deleteRegex = /^DELETE\b/i;
            const options = instance['$state'].get("LOGGER_OPTIONS");

            await new this().sync({ force: true })

            if (insertRegex.test(sql) && options?.inserted) {
                    
                const changed = await new Model()
                .copyModel(instance, {
                    select  : true,
                    where   : false,
                    orderBy : true,
                    limit   : true,
                })
                .whereIn("id", result.$meta.insertIds)
                .disableVoid()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .get();

                console.log({
                    sql,
                    formated : JSON.stringify(sql)
                })
                await new this()
                .table(instance['$state'].get("TABLE_LOGGER"))
                .create({
                    model: instance['$state'].get("MODEL_NAME"),
                    query: sql,
                    action: "INSERTD",
                    data: null,
                    changed: changed.length
                    ? JSON.stringify(changed.length === 1 ? changed[0] : changed)
                    : null,
                })
                .void()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .save()

                return result;
            }

            if (updateRegex.test(sql) && options?.updated) {
        
                const data = await new Model()
                .copyModel(instance, {
                    where: true,
                    orderBy: true,
                    limit: true,
                })
                .disableVoid()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .get();

                const changed = await new Model()
                .copyModel(instance, {
                    where: true,
                    orderBy: true,
                    limit: true,
                })
                .disableSoftDelete()
                .disableVoid()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .get();

                await new this()
                .table(instance['$state'].get("TABLE_LOGGER"))
                .create({
                    model: instance['$state'].get("MODEL_NAME"),
                    query: sql,
                    action: "UPDATED",
                    data: data.length
                    ? JSON.stringify(data.length === 1 ? data[0] : data)
                    : null,
                    // data,
                    // changed
                    changed: changed.length
                    ? JSON.stringify(changed.length === 1 ? changed[0] : changed)
                    : null,
                })
                .void()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .save()

            }

            if (deleteRegex.test(sql) && options?.deleted) {
                const data = await new Model()
                .copyModel(instance, {
                    where: true,
                    orderBy: true,
                    limit: true,
                })
                .disableVoid()
                .bind(instance['$pool'].get())
                .get();

            await new this()
                .table(instance['$state'].get("TABLE_LOGGER"))
                .create({
                    model: instance['$state'].get("MODEL_NAME"),
                    query: sql,
                    action: "DELETED",
                    data: data.length
                        ? JSON.stringify(data.length === 1 ? data[0] : data)
                        : null,
                    changed: null
                })
                .bind(instance['$pool'].get())
                .void()
                .save()

            return result;
            }

            if (selectRegex.test(sql) && options?.selected) {
                await new Logger()
                .table(instance['$state'].get("TABLE_LOGGER"))
                .create({
                    model: instance['$state'].get("MODEL_NAME"),
                    query: sql,
                    action: "SELECT",
                    data: result.length
                        ? JSON.stringify(result.length === 1 ? result[0] : result)
                        : null,
                    changed: null
                })
                .bind(instance['$pool'].get())
                .void()
                .save()
            }

            return;
        } catch (e) {

            console.log(e)
        }
    }
}

export { Logger }
export default Logger