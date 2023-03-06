import { Pagination } from './Interface';
declare abstract class AbstractDatabase {
    protected $setters: string[];
    protected $utils: {
        [key: string]: Function;
    };
    protected $constants: Function;
    protected $state: {
        original: Function;
        get: Function;
        set: Function;
        clone: Function;
    };
    protected $pool: {
        query: Function;
        set: Function;
        get: Function;
    };
    protected $logger: {
        get: Function;
        set: (value: string) => void;
        check: (value: string) => boolean;
    };
    protected $attributes: {
        [key: string]: any;
    } | null;
    abstract void(): this;
    abstract debug(): this;
    abstract dd(): this;
    abstract select(...columns: string[]): this;
    abstract distinct(...columns: string[]): this;
    abstract whereNull(column: string): this;
    abstract whereNotNull(column: string): this;
    abstract where(column: string, operator: string, value: string): this;
    abstract whereSensitive(column: string, operator: string, value: string): this;
    abstract whereRaw(sql: string): this;
    abstract whereId(id: number): this;
    abstract whereUser(id: number): this;
    abstract whereEmail(value: string): this;
    abstract whereQuery(callback: Function): this;
    abstract orWhere(column: string, operator: string, value: string): this;
    abstract whereIn(column: string, arrayValues: Array<any>): this;
    abstract orWhereIn(column: string, arrayValues: Array<any>): this;
    abstract whereNotIn(column: string, arrayValues: Array<any>): this;
    abstract whereSubQuery(column: string, subQuery: string): this;
    abstract whereNotSubQuery(column: string, subQuery: string): this;
    abstract orWhereSubQuery(column: string, subQuery: string): this;
    abstract whereBetween(column: string, arrayValue: Array<any>): this;
    abstract having(condition: string): this;
    abstract join(pk: string, fk: string): this;
    abstract rightJoin(pk: string, fk: string): this;
    abstract leftJoin(pk: string, fk: string): this;
    abstract crossJoin(pk: string, fk: string): this;
    abstract orderBy(column: string, order: string): this;
    abstract latest(...columns: Array<string>): this;
    abstract oldest(...columns: Array<string>): this;
    abstract groupBy(...columns: string[]): this;
    abstract limit(number: number): this;
    abstract hidden(...columns: string[]): this;
    abstract insert(objects: object): this;
    abstract create(objects: object): this;
    abstract update(objects: object): this;
    abstract insertNotExists(objects: object): this;
    abstract createNotExists(objects: object): this;
    abstract insertOrUpdate(objects: object): this;
    abstract createOrUpdate(objects: object): this;
    abstract updateOrInsert(objects: object): this;
    abstract updateOrCreate(objects: object): this;
    abstract createMultiple(objects: object): this;
    abstract insertMultiple(objects: object): this;
    abstract except(...columns: string[]): this;
    abstract only(...columns: string[]): this;
    abstract drop(): Promise<any>;
    abstract truncate(): Promise<any>;
    abstract all(): Promise<Array<any>>;
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
    abstract count(column: string): Promise<number>;
    abstract sum(column: string): Promise<number>;
    abstract avg(column: string): Promise<number>;
    abstract max(column: string): Promise<number>;
    abstract min(column: string): Promise<number>;
    abstract rawQuery(sql: string): Promise<Array<any>>;
    abstract delete(): Promise<boolean>;
    abstract exists(): Promise<boolean>;
    abstract save(): Promise<{
        [key: string]: any;
    } | Array<any> | null | undefined>;
    abstract increment(column: string, value: number): Promise<any>;
    abstract decrement(column: string, value: number): Promise<any>;
    abstract faker(round: number): Promise<any>;
}
export default AbstractDatabase;
