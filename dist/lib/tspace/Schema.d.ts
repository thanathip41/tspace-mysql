import { Database } from "./Database";
declare class Schema extends Database {
    table: (table: string, schemas: {
        [x: string]: any;
    }) => Promise<void>;
}
export { Schema };
export default Schema;
