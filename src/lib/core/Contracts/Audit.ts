import { Model }      from "../Model";
import { Blueprint }  from '../Blueprint';
import type { T }     from "../UtilityTypes";

const schema = {
    id              : Blueprint.int().notNull().primary().autoIncrement(),
    uuid            : Blueprint.varchar(50).null(),
    model           : Blueprint.varchar(100).notNull(),
    query           : Blueprint.longText().notNull(),
    event           : Blueprint.varchar(20).notNull(),
    user_id         : Blueprint.int().notNull(),
    metadata        : Blueprint.json().null(),
    auditable_ids   : Blueprint.longText().null(),
    old_values      : Blueprint.json().null(),
    new_values      : Blueprint.json().null(),
    created_at      : Blueprint.timestamp().null(),
    updated_at      : Blueprint.timestamp().null(),
};

type TS = T.Schema<typeof schema>

class Audit extends Model<TS> {
    protected boot(): void {
        this.useUUID();
        this.useSchema(schema);
        this.useTimestamp();
        this.useTable(this.$state.get("TABLE_AUDIT"));
    }

    static async tracking (instance : Model, { 
        sql, 
        fn
    } : { sql : string; fn : () => Promise<any>}){
        try {

            const selectRegex = /^SELECT\b/i;
            const updateRegex = /^UPDATE\b/i;
            const insertRegex = /^INSERT\b/i;
            const deleteRegex = /^DELETE\b/i;
           
            await new this().sync({ force: true })

            const userId = Number.isNaN(Number(instance['$state'].get('AUDIT'))) 
            ? 0
            : Number(instance['$state'].get('AUDIT'))

            const metadata  = instance['$state'].get('AUDIT_METADATA')

            const modelName = instance['$state'].get("MODEL_NAME")

            const baseQuery = {
                model: modelName,
                query: sql,
                user_id: userId,
                metadata : metadata == null ? null : JSON.stringify(metadata),
            }

            let result = null;

            if (insertRegex.test(sql)) {
                
                result = await fn();
                const values = await new Model()
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

                await new this()
                .table(instance['$state'].get("TABLE_AUDIT"))
                .create({
                    ...baseQuery,
                    event: "INSERTD",
                    auditable_ids: (result.$meta?.insertIds ?? []).length 
                        ? JSON.stringify(result.$meta?.insertIds ?? []) 
                        : null,
                    old_values: null,
                    new_values: values.length
                        ? JSON.stringify(values)
                        : null,
                })
                .void()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .save()
            }

            if (updateRegex.test(sql)) {
        
                const values = await new Model()
                .copyModel(instance, {
                    where: true,
                    orderBy: true,
                    limit: true,
                })
                .disableVoid()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .get();

                result = await fn();

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
                .table(instance['$state'].get("TABLE_AUDIT"))
                .create({
                    ...baseQuery,
                    event: "UPDATED",
                    auditable_ids: values.length 
                    ? JSON.stringify(values.map((v) => v.id)) 
                    : null,
                    old_values: values.length
                    ? JSON.stringify(values)
                    : null,
                    new_values: changed.length
                    ? JSON.stringify(changed)
                    : null,
                })
                .void()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .save()
            }

            if (deleteRegex.test(sql)) {
                let values = await new Model()
                .copyModel(instance, {
                    where: true,
                    orderBy: true,
                    limit: true,
                })
                .disableVoid()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .get();

                result = await fn();

                await new this()
                .table(instance['$state'].get("TABLE_AUDIT"))
                .create({
                    ...baseQuery,
                    event: "DELETED",
                    auditable_ids: values.length 
                        ? JSON.stringify(values.map((v) => v.id)) 
                        : null,
                    old_values: values.length
                        ? JSON.stringify(values)
                        : null,
                    new_values: null
                })
                .void()
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .save()
            }

            if (selectRegex.test(sql)) {

                result = await fn();

                let values = result

                if(Array.isArray(result?.data)) {
                    values = result.data
                } 

                if(!Array.isArray(values)) values = [result]

                await new this()
                .table(instance['$state'].get("TABLE_AUDIT"))
                .create({
                    ...baseQuery,
                    event: "SELECTED",
                    auditable_ids: values.length 
                        ? JSON.stringify(
                            values
                            .map((v: { id: number; }) => v?.id)
                            .filter(Boolean)
                        ) 
                        : null,
                    old_values: values.length
                    ? JSON.stringify(values)
                    : null,
                })
                .bind(instance['$pool'].get())
                .debug(instance['$state'].get('DEBUG'))
                .void()
                .save()
            }

            return result == null ? await fn() : result;

        } catch (e) {}
    }
}

export { Audit }
export default Audit