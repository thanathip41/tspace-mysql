declare abstract class AbstractDatabase {
    protected _setters: string[];
    protected $utils: Function;
    protected $db: {
        get: Function;
        set: Function;
    };
    protected $logger: {
        get: Function;
        set: (arg: string) => void;
        check: (arg: string) => boolean;
    };
    protected $attributes: {};
    abstract debug(): void;
    abstract dump(): void;
    abstract dd(): void;
    abstract select(...params: string[]): void;
    abstract distinct(...params: string[]): void;
    abstract whereNull(column: string): void;
    abstract whereNotNull(column: string): void;
    abstract where(column: string, operator: string, value: string): void;
    abstract whereSensitive(column: string, operator: string, value: string): void;
    abstract whereId(id: number): void;
    abstract whereUser(id: number): void;
    abstract whereEmail(value: string): void;
    abstract whereGroupStart(column: string, operator: string, value: string): void;
    abstract whereGroupEnd(column: string, operator: string, value: string): void;
    abstract orWhereGroupStart(column: string, operator: string, value: string): void;
    abstract orWhereGroupEnd(column: string, operator: string, value: string): void;
    abstract orWhere(column: string, operator: string, value: string): void;
    abstract whereIn(column: string, arrayValues: Array<any>): void;
    abstract orWhereIn(column: string, arrayValues: Array<any>): void;
    abstract whereNotIn(column: string, arrayValues: Array<any>): void;
    abstract whereSubQuery(column: string, subQuery: string): void;
    abstract whereNotInSubQuery(column: string, subQuery: string): void;
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
    abstract upsert(objects: object): void;
    abstract insertOrUpdate(objects: object): void;
    abstract createOrUpdate(objects: object): void;
    abstract updateOrInsert(objects: object): void;
    abstract updateOrCreate(objects: object): void;
    abstract createMultiple(objects: object): void;
    abstract insertMultiple(objects: object): void;
    abstract except(...params: string[]): void;
    abstract only(...params: string[]): void;
    /**
     *
     * @Execute result
     *
    */
    abstract drop(): Promise<any>;
    abstract truncate(): Promise<any>;
    abstract all(): Promise<any>;
    abstract find(id: number): Promise<any>;
    abstract pagination({ limit, page }: {
        limit: number;
        page: number;
    }): Promise<any>;
    abstract paginate({ limit, page }: {
        limit: number;
        page: number;
    }): Promise<any>;
    abstract first(): Promise<any>;
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
    abstract save(): Promise<any>;
    abstract increment(column: string, value: number): Promise<any>;
    abstract decrement(column: string, value: number): Promise<any>;
    abstract faker(round: number): Promise<any>;
}
export default AbstractDatabase;
