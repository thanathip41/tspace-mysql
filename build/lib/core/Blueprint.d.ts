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
declare class Blueprint<T = any> {
    private _type;
    private _attributes;
    private _foreignKey;
    private _column;
    private _valueType;
    /**
     * Assign type 'int' in table
     * @static
     * @return {this} this
     */
    static int(_?: number): Blueprint<number>;
    /**
     * Assign type 'int' in table
     * @return {this} this
     */
    int(_?: number): Blueprint<number>;
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {this} this
     */
    static tinyInt(number?: number): Blueprint<number>;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyInt(number?: number): Blueprint<number>;
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {this} this
     */
    static tinyint(number?: number): Blueprint<number>;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {this} this
     */
    tinyint(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {this} this
     */
    static bigInt(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigInt(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {this} this
     */
    static bigint(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {this} this
     */
    bigint(number?: number): Blueprint<number>;
    /**
     * Assign type 'DOUBLE' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    static double(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {this} this
     */
    double(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'FLOAT' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {this} this
     */
    static float(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'FLOAT' in table
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {this} this
     */
    float(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'VARCHAR' in table
     * @static
     * @param {number} length  [length = 191] length of string
     * @return {this} this
     */
    static varchar(length?: number): Blueprint<string>;
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 191] length of string
     * @return {this} this
     */
    varchar(length?: number): Blueprint<string>;
    /**
     * Assign type 'CHAR' in table
     * @static
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    static char(length?: number): Blueprint<string>;
    /**
     * Assign type 'CHAR' in table
     * @param {number} length [length = 1] length of string
     * @return {this} this
     */
    char(length?: number): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {this} this
     */
    static longText(): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longText(): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {this} this
     */
    static longtext(): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @return {this} this
     */
    longtext(): Blueprint<string>;
    /**
     * Assign type 'JSON' in table
     * @static
     * @return {this} this
     */
    static json(): Blueprint<string>;
    /**
     * Assign type 'JSON' in table
     * @return {this} this
     */
    json(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {this} this
     */
    static mediumText(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumText(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {this} this
     */
    static mediumtext(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {this} this
     */
    mediumtext(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {this} this
     */
    static tinyText(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @return {this} this
     */
    tinyText(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {this} this
     */
    static tinytext(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @return {this} this
     */
    tinytext(): Blueprint<string>;
    /**
     * Assign type 'TEXT' in table
     * @static
     * @return {this} this
     */
    static text(): Blueprint<string>;
    /**
     * Assign type 'TEXT' in table
     * @return {this} this
     */
    text(): Blueprint<string>;
    /**
     * Assign type 'ENUM'
     * @static
     * @param {...string} enums n1, n2, n3, ...n
     * @return {this} this
     */
    static enum(...enums: Array<string>): Blueprint<string>;
    /**
     * Assign type 'ENUM'
     * @param {...string} enums n1, n2, n3, ...n
     * @return {this} this
     */
    enum(...enums: Array<string>): Blueprint<string>;
    /**
     * Assign type 'DATE' in table
     * @static
     * @return {this} this
     */
    static date(): Blueprint<Date | string>;
    /**
     * Assign type 'DATE' in table
     * @return {this} this
     */
    date(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {this} this
     */
    static dateTime(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    dateTime(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {this} this
     */
    static datetime(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @return {this} this
     */
    datetime(): Blueprint<Date | string>;
    /**
     * Assign type 'TIMESTAMP' in table
     * @static
     * @return {this} this
     */
    static timestamp(): Blueprint<Date | string>;
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {this} this
     */
    timestamp(): Blueprint<Date | string>;
    /**
     * Assign attributes 'UNSIGNED' in table
     * @return {this} this
     */
    unsigned(): Blueprint<T>;
    /**
     * Assign attributes 'UNIQUE' in table
     * @return {this} this
     */
    unique(): Blueprint<T>;
    /**
     * Assign attributes 'NULL' in table
     * @return {this} this
     */
    null(): Blueprint<T | null>;
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {this} this
     */
    notNull(): Blueprint<T>;
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {this} this
     */
    notnull(): Blueprint<T>;
    /**
     * Assign attributes 'PRIMARY KEY' in table
     * @return {this} this
     */
    primary(): Blueprint<T>;
    /**
     * Assign attributes 'default' in table
     * @param {string | number} value  default value
     * @return {this} this
     */
    default(value: string | number): Blueprint<T>;
    /**
     * Assign attributes 'defaultValue' in table
     * @param {string | number} value  default value
     * @return {this} this
     */
    defaultValue(value: string | number): Blueprint<T>;
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {this} this
     */
    currentTimestamp(): Blueprint<T>;
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {this} this
     */
    currenttimestamp(): Blueprint<T>;
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {this} this
     */
    autoIncrement(): Blueprint<T | null>;
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {this} this
     */
    autoincrement(): Blueprint<T | null>;
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
    }): Blueprint<T>;
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
