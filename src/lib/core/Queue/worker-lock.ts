import type { T }       from "../UtilityTypes";
import { Blueprint }    from "../Blueprint";
import { Model }        from "../Model";

const schema = {
    id         : Blueprint.int().primary().autoIncrement(),
    uuid       : Blueprint.varchar(36).null(),
    name       : Blueprint.varchar(255).notNull(),
    job_id     : Blueprint.int().notNull().unique(),

    unique_key : Blueprint
    .varchar(255)
    .notNull()
    .compositeUnique(["name"]),

    created_at : Blueprint.timestamp().null(),
    updated_at : Blueprint.timestamp().null()
};

class WorkerLock extends Model<T.Schema<typeof schema>> {

    protected boot(): void {
        this.useUUID();
        this.useTimestamp();
        this.useSchema(schema);
        this.useTable(this.$state.get("TABLE_JOB_LOCK"));
    }
}

export { WorkerLock }
export default WorkerLock