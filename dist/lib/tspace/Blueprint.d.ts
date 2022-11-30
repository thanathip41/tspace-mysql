declare class Blueprint {
    protected type: string;
    protected attrbuites: Array<string>;
    /**
     * Assign type 'int' in table
     * @return {this} this
     */
    int(): this;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyInt(number?: number): this;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigInt(number?: number): this;
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    double(length?: number, decimal?: number): this;
    /**
     * Assign type 'FLOAT' in table
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {this} this
     */
    float(length?: number, decimal?: number): this;
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 100] length of string
     * @return {this} this
     */
    varchar(length?: number): this;
    /**
     * Assign type 'CHAR' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    char(length?: number): this;
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longText(): this;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    mediumText(): this;
    /**
     * Assign type 'TINYTEXT' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    tinyText(): this;
    /**
     * Assign type 'TEXT' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    text(): this;
    /**
     * Assign type 'ENUM'
     * @param {...string} enums n1, n2, n3, ...n
     * @return {this} this
     */
    enum(...enums: Array<string>): this;
    /**
     * Assign type 'DATE' in table
     * @return {this} this
     */
    date(): this;
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    dateTime(): this;
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {this} this
     */
    timestamp(): this;
    /**
     * Assign type 'UNSIGNED' in table
     * @return {this} this
     */
    unsigned(): this;
    /**
     * Assign type 'UNIQUE' in table
     * @return {this} this
     */
    unique(): this;
    /**
     * Assign type 'NULL' in table
     * @return {this} this
     */
    null(): this;
    /**
     * Assign type 'NOT NULL' in table
     * @return {this} this
     */
    notNull(): this;
    /**
     * Assign type 'PRIMARY KEY' in table
     * @return {this} this
     */
    primary(): this;
    /**
     * Assign attrbuites 'default' in table
     * @param {string | number} n  default value
     * @return {this} this
     */
    default(n: string | number): this;
    /**
     * Assign attrbuites 'default currentTimestamp' in table
     * @return {this} this
     */
    currentTimestamp(): this;
    /**
     * Assign attrbuites 'autoIncrement' in table
     * @return {this} this
     */
    autoIncrement(): this;
    private _addAssignType;
    private _addAssignAttrbuite;
}
export { Blueprint };
export default Blueprint;
