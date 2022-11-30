import { Pagination } from './Interface';
declare abstract class AbstractDatabase {
    protected $setters: string[];
    protected $utils: {
        [key: string]: Function;
    };
    protected $constants: Function;
    protected $db: {
        get: Function;
        set: Function;
        clone: Function;
    };
    protected $pool: {
        get: Function;
        set: Function;
        load: Function;
    };
    protected $logger: {
        get: Function;
        set: (value: string) => void;
        check: (value: string) => boolean;
    };
    protected $attributes: {
        [key: string]: any;
    };
    abstract debug(): void;
    abstract dd(): void;
    abstract select(...params: string[]): void;
    abstract distinct(...params: string[]): void;
    abstract whereNull(column: string): void;
    abstract whereNotNull(column: string): void;
    abstract where(column: string, operator: string, value: string): void;
    abstract whereSensitive(column: string, operator: string, value: string): void;
    abstract whereRaw(sql: string): void;
    abstract whereId(id: number): void;
    abstract whereUser(id: number): void;
    abstract whereEmail(value: string): void;
    abstract whereQuery(callback: Function): void;
    abstract orWhere(column: string, operator: string, value: string): void;
    abstract whereIn(column: string, arrayValues: Array<any>): void;
    abstract orWhereIn(column: string, arrayValues: Array<any>): void;
    abstract whereNotIn(column: string, arrayValues: Array<any>): void;
    abstract whereSubQuery(column: string, subQuery: string): void;
    abstract whereNotSubQuery(column: string, subQuery: string): void;
    abstract orWhereSubQuery(column: string, subQuery: string): void;
    abstract whereBetween(column: string, arrayValue: Array<any>): void;
    abstract having(condition: string): void;
    abstract join(pk: string, fk: string): void;
    abstract rightJoin(pk: string, fk: string): void;
    abstract leftJoin(pk: string, fk: string): void;
    abstract crossJoin(pk: string, fk: string): void;
    abstract orderBy(column: string, order: string): void;
    abstract latest(column: string): void;
    abstract oldest(column: string): void;
    abstract groupBy(column: string): void;
    abstract limit(number: number): void;
    abstract hidden(...columns: string[]): void;
    abstract insert(objects: object): void;
    abstract create(objects: object): void;
    abstract update(objects: object): void;
    abstract insertNotExists(objects: object): void;
    abstract createNotExists(objects: object): void;
    abstract insertOrUpdate(objects: object): void;
    abstract createOrUpdate(objects: object): void;
    abstract updateOrInsert(objects: object): void;
    abstract updateOrCreate(objects: object): void;
    abstract createMultiple(objects: object): void;
    abstract insertMultiple(objects: object): void;
    abstract except(...params: string[]): void;
    abstract only(...params: string[]): void;
    abstract drop(): Promise<any>;
    abstract truncate(): Promise<any>;
    abstract all(): Promise<any>;
    abstract find(id: number): Promise<any>;
    abstract pagination({ limit, page }: {
        limit: number;
        page: number;
    }): Promise<Pagination>;
    abstract paginate({ limit, page }: {
        limit: number;
        page: number;
    }): Promise<Pagination>;
    abstract first(): Promise<any>;
    abstract firstOrError(message: string, options?: {
        [key: string]: any;
    }): Promise<any>;
    abstract findOneOrError(message: string, options?: {
        [key: string]: any;
    }): Promise<any>;
    abstract get(): Promise<any>;
    abstract findOne(): Promise<any>;
    abstract findMany(): Promise<any>;
    abstract getGroupBy(column: string): Promise<any>;
    abstract findManyGroupBy(column: string): Promise<any>;
    abstract toArray(column: string): Promise<any>;
    abstract toJSON(): Promise<any>;
    abstract toSQL(): string;
    abstract toString(): string;
    abstract count(column: string): Promise<any>;
    abstract sum(column: string): Promise<any>;
    abstract avg(column: string): Promise<any>;
    abstract max(column: string): Promise<any>;
    abstract min(column: string): Promise<any>;
    abstract delete(): Promise<any>;
    abstract exists(): Promise<any>;
    abstract save(): Promise<any[] | object | null>;
    abstract increment(column: string, value: number): Promise<any>;
    abstract decrement(column: string, value: number): Promise<any>;
    abstract faker(round: number): Promise<any>;
}
export default AbstractDatabase;
