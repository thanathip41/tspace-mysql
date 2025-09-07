import { Model }      from "../Model";
import { Blueprint }   from '../Blueprint';
import { T }          from "../UtilityTypes";

const schema = {
    id: new Blueprint().int().notNull().primary().autoIncrement(),
    model: new Blueprint().varchar(100).null(),
    user_id: new Blueprint().int().notNull(),
    query: new Blueprint().longText().null(),
    event: new Blueprint().varchar(20).null(),
    auditable_id: new Blueprint().int().notNull(),
    old_values : new Blueprint().json().null(),
    new_values: new Blueprint().json().null(),
    changed: new Blueprint().json().null(),
    created_at: new Blueprint().timestamp().null(),
    updated_at: new Blueprint().timestamp().null(),
};

type TS = T.Schema<typeof schema>

class Audit extends Model<TS> {
    protected boot(): void {
        this.useSchema(schema)
        this.useTimestamp()
    }
}

export { Audit }
export default Audit