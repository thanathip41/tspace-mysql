import { Builder } from "./Builder";
declare class Schema extends Builder {
    table: (table: string, schemas: Record<string, {
        type: string;
        attrbuites: string[];
    }>) => Promise<void>;
    createTable: (table: string, schemas: Record<string, {
        type: string;
        attrbuites: string[];
    }>) => Promise<any>;
}
export { Schema };
export default Schema;
