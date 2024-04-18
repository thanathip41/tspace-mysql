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
     * Assign type 'serial' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static serial(_?: number): Blueprint<number>;
    /**
     * Assign type 'serial' in table
     * @return {Blueprint<T>} Blueprint
     */
    serial(_?: number): Blueprint<number>;
    /**
     * Assign type 'INT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static int(_?: number): Blueprint<number>;
    /**
     * Assign type 'INT' in table
     * @return {Blueprint<T>} Blueprint
     */
    int(_?: number): Blueprint<number>;
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    static tinyInt(number?: number): Blueprint<number | boolean>;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    tinyInt(number?: number): Blueprint<number | boolean>;
    /**
     * Assign type 'TINYINT' in table
     * @static
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    static tinyint(number?: number): Blueprint<number | boolean>;
    /**
     * Assign type 'TINYINT' in table
     * @param {number} number
     * @return {Blueprint<T>} Blueprint
     */
    tinyint(number?: number): Blueprint<number | boolean>;
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    static bigInt(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    bigInt(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @static
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    static bigint(number?: number): Blueprint<number>;
    /**
     * Assign type 'BIGINT' in table
     * @param {number} number [number = 10]
     * @return {Blueprint<T>} Blueprint
     */
    bigint(number?: number): Blueprint<number>;
    /**
     * Assign type 'BOOLEAN' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static boolean(): Blueprint<number | boolean>;
    /**
     * Assign type 'BOOLEAN' in table
     * @return {Blueprint<T>} Blueprint
     */
    boolean(): Blueprint<number | boolean>;
    /**
     * Assign type 'DOUBLE' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    static double(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'DOUBLE' in table
     * @param {number} length  between 1-255
     * @param {number} decimal  0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    double(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'FLOAT' in table
     * @static
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    static float(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'FLOAT' in table
     * @param {number} length  between 1-255
     * @param {number} decimal 0.000...n
     * @return {Blueprint<T>} Blueprint
     */
    float(length?: number, decimal?: number): Blueprint<number>;
    /**
     * Assign type 'VARCHAR' in table
     * @static
     * @param {number} length  [length = 191] length of string
     * @return {Blueprint<T>} Blueprint
     */
    static varchar(length?: number): Blueprint<string>;
    /**
     * Assign type 'VARCHAR' in table
     * @param {number} length  [length = 191] length of string
     * @return {Blueprint<T>} Blueprint
     */
    varchar(length?: number): Blueprint<string>;
    /**
     * Assign type 'CHAR' in table
     * @static
     * @param {number} length [length = 1] length of string
     * @return {Blueprint<T>} Blueprint
     */
    static char(length?: number): Blueprint<string>;
    /**
     * Assign type 'CHAR' in table
     * @param {number} length [length = 1] length of string
     * @return {Blueprint<T>} Blueprint
     */
    char(length?: number): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static longText(): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    longText(): Blueprint<string>;
    /**
     * Assign type 'BINARY' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static binary(): Blueprint<string>;
    /**
     * Assign type 'BINARY' in table
     * @return {Blueprint<T>} Blueprint
     */
    binary(): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static longtext(): Blueprint<string>;
    /**
     * Assign type 'LONGTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    longtext(): Blueprint<string>;
    /**
     * Assign type 'JSON' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static json(): Blueprint<string>;
    /**
     * Assign type 'JSON' in table
     * @return {Blueprint<T>} Blueprint
     */
    json(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static mediumText(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    mediumText(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static mediumtext(): Blueprint<string>;
    /**
     * Assign type 'MEDIUMTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    mediumtext(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static tinyText(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    tinyText(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static tinytext(): Blueprint<string>;
    /**
     * Assign type 'TINYTEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    tinytext(): Blueprint<string>;
    /**
     * Assign type 'TEXT' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static text(): Blueprint<string>;
    /**
     * Assign type 'TEXT' in table
     * @return {Blueprint<T>} Blueprint
     */
    text(): Blueprint<string>;
    /**
     * Assign type 'ENUM'
     * @static
     * @param {...string} enums n1, n2, n3, ...n
     * @return {Blueprint<T>} Blueprint
     */
    static enum(...enums: Array<string>): Blueprint<string>;
    /**
     * Assign type 'ENUM'
     * @param {...string} enums n1, n2, n3, ...n
     * @return {Blueprint<T>} Blueprint
     */
    enum(...enums: Array<string>): Blueprint<string>;
    /**
     * Assign type 'DATE' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static date(): Blueprint<Date | string>;
    /**
     * Assign type 'DATE' in table
     * @return {Blueprint<T>} Blueprint
     */
    date(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static dateTime(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @return {Blueprint<T>} Blueprint
     */
    dateTime(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static datetime(): Blueprint<Date | string>;
    /**
     * Assign type 'DATETIME' in table
     * @return {Blueprint<T>} Blueprint
     */
    datetime(): Blueprint<Date | string>;
    /**
     * Assign type 'TIMESTAMP' in table
     * @static
     * @return {Blueprint<T>} Blueprint
     */
    static timestamp(): Blueprint<Date>;
    /**
     * Assign type 'TIMESTAMP' in table
     * @return {Blueprint<T>} Blueprint
     */
    timestamp(): Blueprint<Date>;
    /**
     * Assign attributes 'UNSIGNED' in table
     * @return {Blueprint<T>} Blueprint
     */
    unsigned(): Blueprint<T>;
    /**
     * Assign attributes 'UNIQUE' in table
     * @return {Blueprint<T>} Blueprint
     */
    unique(): Blueprint<T>;
    /**
     * Assign attributes 'NULL' in table
     * @return {Blueprint<T>} Blueprint
     */
    null(): Blueprint<T | null>;
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {Blueprint<T>} Blueprint
     */
    notNull(): Blueprint<T>;
    /**
     * Assign attributes 'NOT NULL' in table
     * @return {Blueprint<T>} Blueprint
     */
    notnull(): Blueprint<T>;
    /**
     * Assign attributes 'PRIMARY KEY' in table
     * @return {Blueprint<T>} Blueprint
     */
    primary(): Blueprint<T>;
    /**
     * Assign attributes 'default' in table
     * @param {string | number} value  default value
     * @return {Blueprint<T>} Blueprint
     */
    default(value: string | number): Blueprint<T>;
    /**
     * Assign attributes 'defaultValue' in table
     * @param {string | number} value  default value
     * @return {Blueprint<T>} Blueprint
     */
    defaultValue(value: string | number): Blueprint<T>;
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {Blueprint<T>} Blueprint
     */
    currentTimestamp(): Blueprint<T>;
    /**
     * Assign attributes 'default currentTimestamp' in table
     * @return {Blueprint<T>} Blueprint
     */
    currenttimestamp(): Blueprint<T>;
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {Blueprint<T>} Blueprint
     */
    autoIncrement(): Blueprint<T>;
    /**
     * Assign attributes 'autoIncrement' in table
     * @return {Blueprint<T>} Blueprint
     */
    autoincrement(): Blueprint<T>;
    /**
     * Assign attributes 'foreign' in table
     * Reference bettwen Column Main to Column Child
     * @param    {object}  property object { key , value , operator }
     * @property {string?}  property.reference
     * @property {Model | string}  property.on
     * @property {string?} property.onDelete
     * @property {string?}  property.onUpdate
     * @return {Blueprint<T>} Blueprint
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
