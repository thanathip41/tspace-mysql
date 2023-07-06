import Builder from './Builder';
import { Connection, ConnectionOptions } from './Interface';
declare abstract class AbstractDB extends Builder {
    abstract table(tableName: string): void;
    abstract beginTransaction(): Promise<any>;
    abstract makeObject(value: any): Record<string, any> | null;
    abstract makeArray(value: any): Array<any>;
    abstract generateUUID(): string;
    abstract raw(sql: string): string;
    abstract constants(constants?: string): string | {
        [key: string]: any;
    };
    abstract caseUpdate(cases: {
        when: string;
        then: string;
    }[], final?: string): string | [];
    abstract getConnection(options: ConnectionOptions): Connection;
}
export { AbstractDB };
export default AbstractDB;
