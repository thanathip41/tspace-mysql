import { Model } from "./Model";
/**
 * Make schema for table with Blueprint
 * @example
 *   import { Schema , Blueprint }  from 'tspace-mysql'
 *   await new Schema().table('users',{
 *      id          : new Blueprint().int().notNull().primary().autoIncrement(),
 *      name        : new Blueprint().varchar(255).default('my name'),
 *      email       : new Blueprint().varchar(255).unique(),
 *      json        : new Blueprint().json().null(),
 *      verify      : new Blueprint().tinyInt(1).notNull(),
 *      created_at  : new Blueprint().timestamp().null(),
 *      updated_at  : new Blueprint().timestamp().null(),
 *      deleted_at  : new Blueprint().timestamp().null()
 *   })
 */
declare class Blueprint {
    private _type;
    private _attributes;
    private _foreignKey;
    private _column;
    private _valueType;
    /**
     * Assign type 'int' in table
     * @return {this} this
     */
    int(_?: number): this;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyInt(number?: number): this;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyint(number?: number): this;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigInt(number?: number): this;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigint(number?: number): this;
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
     * @param {number} length  [length = 191] length of string
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
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longtext(): this;
    /**
     * Assign type 'JSON' in table
     * @return {this} this
     */
    json(): this;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumText(): this;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumtext(): this;
    /**
     * Assign type 'TINYTEXT' in table
     * @return {this} this
     */
    tinyText(): this;
    /**
    * Assign type 'TINYTEXT' in table
    * @return {this} this
    */
    tinytext(): this;
    /**
     * Assign type 'TEXT' in table
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
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    datetime(): this;
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {this} this
     */
    timestamp(): this;
    /**
     * Assign attributes 'UNSIGNED' in table
     * @return {this} this
     */
    unsigned(): this;
    /**
     * Assign attributes 'UNIQUE' in table
     * @return {this} this
     */
    unique(): this;
    /**
     * Assign attributes 'NULL' in table
     * @return {this} this
     */
    null(): this;
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {this} this
     */
    notNull(): this;
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {this} this
     */
    notnull(): this;
    /**
     * Assign attributes 'PRIMARY KEY' in table
     * @return {this} this
     */
    primary(): this;
    /**
     * Assign attributes 'default' in table
     * @param {string | number} value  default value
     * @return {this} this
     */
    default(value: string | number): this;
    /**
     * Assign attributes 'defaultValue' in table
     * @param {string | number} value  default value
     * @return {this} this
     */
    defaultValue(value: string | number): this;
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {this} this
     */
    currentTimestamp(): this;
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {this} this
     */
    currenttimestamp(): this;
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {this} this
     */
    autoIncrement(): this;
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {this} this
     */
    autoincrement(): this;
    /**
     * Assign attributes 'foreign' in table
     * Reference bettwen Column Main to Column Child
     * @param    {object}  property object { key , value , operator }
     * @property {string?}  property.reference
     * @property {Model | string}  property.on
     * @property {string?} property.onDelete
     * @property {string?}  property.onUpdate
     * @return {this} this
     */
    foreign({ references, on, onDelete, onUpdate }: {
        references?: string;
        on: (new () => Model) | string;
        onDelete?: 'CASCADE' | 'NO ACTION' | 'RESTRICT' | 'SET NULL';
        onUpdate?: 'CASCADE' | 'NO ACTION' | 'RESTRICT' | 'SET NULL';
    }): this;
    bindColumn(column: string): this;
    get column(): string | null;
    get type(): string;
    get attributes(): string[];
    get foreignKey(): Record<string, any> | null;
    get valueType(): NumberConstructor | StringConstructor | DateConstructor;
    private _addAssignType;
    private _addAssignAttribute;
}
export { Blueprint };
export default Blueprint;
