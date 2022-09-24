declare class Blueprint {
    protected type: string;
    protected attrbuites: Array<string>;
    private _addAssignType;
    private _addAssignAttrbuite;
    int(): this;
    /**
     * Assign type
     * @param {number}
     */
    tinyInt(n?: number): this;
    /**
     * Assign type
     * @param {number}
     */
    bigInt(n?: number): this;
    /**
     * Assign type
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     */
    double(length?: number, decimal?: number): this;
    /**
     * Assign type
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     */
    float(length?: number, decimal?: number): this;
    /**
     * Assign type
     * @param {number} length string between 1-255
     */
    varchar(n?: number): this;
    /**
     * Assign type
     * @param {number} length string between 1-255
     */
    char(n?: number): this;
    longText(): this;
    mediumText(): this;
    tinyText(): this;
    text(): this;
    /**
     * Assign type
     * @param {...string} enum n1, n2, n3, ...n
     */
    enum(...enums: Array<string>): this;
    date(): this;
    dateTime(): this;
    timestamp(): this;
    unsigned(): this;
    unique(): this;
    null(): this;
    notNull(): this;
    primary(): this;
    /**
     * Assign attrbuites
     * @param {string | number} default value
     */
    default(n: string | number): this;
    defaultTimestamp(): this;
    autoIncrement(): this;
}
export { Blueprint };
export default Blueprint;
