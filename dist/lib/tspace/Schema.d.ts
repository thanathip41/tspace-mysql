import { Builder } from "./Builder";
declare class Schema extends Builder {
    table: (table: string, schemas: {
        [x: string]: any;
    }) => Promise<void>;
}
export { Schema };
export default Schema;
