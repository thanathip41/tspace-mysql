import Database from "./Database";
export declare class Schema extends Database {
    protected timeStamp: Array<string>;
    table: (table: string, schemas: any) => Promise<void>;
}
export declare class Blueprint {
    protected type: string | undefined;
    protected attrbuites: Array<string>;
    private _addType;
    private _addAttrbuite;
    /**
     *
     * @Types
     *
    */
    int(): this;
    tinyInt(n?: number): this;
    bigInt(n?: number): this;
    double(): this;
    float(): this;
    varchar(n?: number): this;
    char(n?: number): this;
    longText(): this;
    mediumText(): this;
    tinyText(): this;
    text(): this;
    enum(...n: Array<string>): this;
    date(): this;
    dateTime(): this;
    timestamp(): this;
    /**
     *
     * @Attrbuites
     *
    */
    unsigned(): this;
    unique(): this;
    null(): this;
    notNull(): this;
    primary(): this;
    default(n: string): this;
    defaultTimestamp(): this;
    autoIncrement(): this;
}
