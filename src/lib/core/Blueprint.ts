import { Model } from "./Model";

/**
 * Class 'Blueprint' is used to make the schema for table
 * @example
 *   import { Schema , Blueprint }  from 'tspace-mysql'
import sql from '../../../build/lib/core/SqlLike';
 *   await new Schema().table('users',{ 
 *      id          : Blueprint.int().notNull().primary().autoIncrement(),
 *      name        : Blueprint.varchar(255).default('my name'),
 *      email       : Blueprint.varchar(255).unique(),
 *      json        : Blueprint.json().null(),
 *      verify      : Blueprint.tinyInt(1).notNull(),
 *      created_at  : Blueprint.timestamp().null(),
 *      updated_at  : Blueprint.timestamp().null(),
 *      deleted_at  : Blueprint.timestamp().null()
 *   })
 */
class Blueprint<T = any> {
  private _enum :string[] = [];
  private _type: string = "INT";
  private _attributes: string[] = [];
  private _foreignKey: Record<string, any> | null = null;
  private _index: string | null = null;
  private _column: string | null = null;
  private _sql: {
    select?: string;
    where?: string;
    orderBy?: string;
    groupBy?: string;
  } | null = null;
  private _valueType!:
    | NumberConstructor
    | StringConstructor
    | DateConstructor
    | BooleanConstructor;

  /**
   * Assign type 'virtual' to column
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static virtualColumn(sql:| string | { select?: string; where?: string; orderBy?: string; groupBy?: string }): Blueprint<unknown> {
    return new Blueprint().virtualColumn(sql);
  }

  /**
   * Assign type 'virtual' to column
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  virtualColumn(sql:| string | { select?: string; where?: string; orderBy?: string; groupBy?: string }): Blueprint<unknown> {
    const instance = new Blueprint();
    if (typeof sql === "object" && sql !== null) {
      instance._sql = sql;
      return instance;
    }

    instance._sql = { select: sql, where: sql, orderBy: sql, groupBy: sql };

    return instance;
  }
  /**
   * Assign type 'serial' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static serial(_?: number): Blueprint<number> {
    return new Blueprint<number>().serial(_);
  }

  /**
   * Assign type 'serial' in table
   * @return {Blueprint<T>} Blueprint
   */
  serial(_?: number): Blueprint<number> {
    const instance = new Blueprint<number>();
    instance._addAssignType("SERIAL");
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'INT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static int(_?: number): Blueprint<number> {
    return new Blueprint<number>().int(_);
  }

  /**
   * Assign type 'INT' in table
   * @return {Blueprint<T>} Blueprint
   */
  int(_?: number): Blueprint<number> {
    const instance = new Blueprint<number>();
    instance._addAssignType("INT");
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'TINYINT' in table
   * @static
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  static tinyInt(number: number = 1): Blueprint<number | boolean> {
    return new Blueprint<number>().tinyInt(number);
  }

  /**
   * Assign type 'TINYINT' in table
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  tinyInt(number: number = 1): Blueprint<number | boolean> {
    const instance = new Blueprint<number | boolean>();
    instance._addAssignType(`TINYINT(${number})`);
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'TINYINT' in table
   * @static
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  static tinyint(number: number = 1): Blueprint<number | boolean> {
    return new Blueprint<number | boolean>().tinyInt(number);
  }

  /**
   * Assign type 'TINYINT' in table
   * @param {number} number
   * @return {Blueprint<T>} Blueprint
   */
  tinyint(number: number = 1): Blueprint<number | boolean> {
    return new Blueprint<number | boolean>().tinyInt(number);
  }

  /**
   * Assign type 'BIGINT' in table
   * @static
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  static bigInt(number: number = 10): Blueprint<number> {
    return new Blueprint<number>().bigInt(number);
  }

  /**
   * Assign type 'BIGINT' in table
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  bigInt(number: number = 10): Blueprint<number> {
    const instance = new Blueprint<number>();
    instance._addAssignType(`BIGINT(${number})`);
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'BIGINT' in table
   * @static
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  static bigint(number: number = 10): Blueprint<number> {
    return new Blueprint<number>().bigInt(number);
  }

  /**
   * Assign type 'BIGINT' in table
   * @param {number} number [number = 10]
   * @return {Blueprint<T>} Blueprint
   */
  bigint(number: number = 10): Blueprint<number> {
    return new Blueprint<number>().bigInt(number);
  }

  /**
   * Assign type 'BOOLEAN' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static boolean(): Blueprint<number | boolean> {
    return new Blueprint<number | boolean>().boolean();
  }

  /**
   * Assign type 'BOOLEAN' in table
   * @return {Blueprint<T>} Blueprint
   */
  boolean(): Blueprint<number | boolean> {
    const instance = new Blueprint<number | boolean>();
    instance._addAssignType(`BOOLEAN`);
    instance._valueType = Number;
    return instance;
  }

  /**
   * Assign type 'DOUBLE' in table
   * @static
   * @param {number} length  between 1-255
   * @param {number} decimal  0.000...n
   * @return {Blueprint<T>} Blueprint
   */
  static double(length: number = 0, decimal: number = 0): Blueprint<number> {
    return new Blueprint<number>().double(length,decimal);
  }

  /**
   * Assign type 'DOUBLE' in table
   * @param {number} length  between 1-255
   * @param {number} decimal  0.000...n
   * @return {Blueprint<T>} Blueprint
   */
  double(length: number = 0, decimal: number = 0): Blueprint<number> {
    const instance = new Blueprint<number>();

    instance._valueType = Number;

    if (!length || !decimal) {
      instance._addAssignType(`DOUBLE`);
      return instance;
    }

    instance._addAssignType(`DOUBLE(${length},${decimal})`);

    return instance;
  }

  /**
   * Assign type 'FLOAT' in table
   * @static
   * @param {number} length  between 1-255
   * @param {number} decimal 0.000...n
   * @return {Blueprint<T>} Blueprint
   */
  static float(length: number = 0, decimal: number = 0): Blueprint<number> {
    return new Blueprint<number>().float(length,decimal);
  }

  /**
   * Assign type 'FLOAT' in table
   * @param {number} length  between 1-255
   * @param {number} decimal 0.000...n
   * @return {Blueprint<T>} Blueprint
   */
  float(length: number = 0, decimal: number = 0): Blueprint<number> {
    const instance = new Blueprint<number>();
    instance._valueType = Number;

    if (!length || !decimal) {
      instance._addAssignType(`FLOAT`);
      return instance;
    }

    instance._addAssignType(`FLOAT(${length},${decimal})`);

    return instance;
  }

  /**
   * Assign type 'VARCHAR' in table
   * @static
   * @param {number} length  [length = 191] length of string
   * @return {Blueprint<T>} Blueprint
   */
  static varchar(length: number = 191): Blueprint<string> {
    return new Blueprint<string>().varchar(length);
  }

  /**
   * Assign type 'VARCHAR' in table
   * @param {number} length  [length = 191] length of string
   * @return {Blueprint<T>} Blueprint
   */
  varchar(length: number = 191): Blueprint<string> {
    const instance = new Blueprint<string>();

    if (length > 255) length = 255;

    if (length <= 0) length = 1;

    instance._addAssignType(`VARCHAR(${length})`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'CHAR' in table
   * @static
   * @param {number} length [length = 1] length of string
   * @return {Blueprint<T>} Blueprint
   */
  static char(length: number = 1): Blueprint<string> {
    return new Blueprint<string>().char(length);
  }

  /**
   * Assign type 'CHAR' in table
   * @param {number} length [length = 1] length of string
   * @return {Blueprint<T>} Blueprint
   */
  char(length: number = 1): Blueprint<string> {
    const instance = new Blueprint<number>();

    instance._addAssignType(`CHAR(${length})`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'LONGTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static longText(): Blueprint<string> {
    return new Blueprint<string>().longText();
  }

  /**
   * Assign type 'LONGTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  longText(): Blueprint<string> {
    const instance = new Blueprint<number>();

    instance._addAssignType(`LONGTEXT`);

    instance._valueType = String;

    return instance;
  }

   /**
   * Assign type 'LONGTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static longtext(): Blueprint<string> {
    return new Blueprint<string>().longtext();
  }

  /**
   * Assign type 'LONGTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  longtext(): Blueprint<string> {
    const instance = new Blueprint<number>();

    instance._addAssignType(`LONGTEXT`);

    instance._valueType = String;

    return instance;
  }

  /**
   * Assign type 'BINARY' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static binary(): Blueprint<string> {
    return new Blueprint<string>().binary();
  }

  /**
   * Assign type 'BINARY' in table
   * @return {Blueprint<T>} Blueprint
   */
  binary(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`BINARY`);
    instance._valueType = String;
    return instance;
  }
  /**
   * Assign type 'JSON' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static json(): Blueprint<Record<string, any> | string> {
    return new Blueprint<string>().json();
  }

  /**
   * Assign type 'JSON' in table
   * @return {Blueprint<T>} Blueprint
   */
  json(): Blueprint<Record<string, any> | string> {
    const instance = new Blueprint<Record<string, any>>();
    instance._addAssignType(`JSON`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static mediumText(): Blueprint<string> {
    return new Blueprint<string>().mediumText();
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  mediumText(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`MEDIUMTEXT`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static mediumtext(): Blueprint<string> {
    return new Blueprint<string>().mediumText();
  }

  /**
   * Assign type 'MEDIUMTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  mediumtext(): Blueprint<string> {
    return new Blueprint<string>().mediumText();
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static tinyText(): Blueprint<string> {
    return new Blueprint<string>().tinyText();
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  tinyText(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`TINYTEXT`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static tinytext(): Blueprint<string> {
    return new Blueprint<string>().tinyText();
  }

  /**
   * Assign type 'TINYTEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  tinytext(): Blueprint<string> {
    return new Blueprint<string>().tinyText();
  }

  /**
   * Assign type 'TEXT' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static text(): Blueprint<string> {
    return new Blueprint<string>().text();
  }

  /**
   * Assign type 'TEXT' in table
   * @return {Blueprint<T>} Blueprint
   */
  text(): Blueprint<string> {
    const instance = new Blueprint<string>();
    instance._addAssignType(`TEXT`);
    instance._valueType = String;
    return instance;
  }

  /**
   * Assign type 'ENUM'
   * @static
   * @param {...string} enums n1, n2, n3, ...n
   * @return {Blueprint<T>} Blueprint
   */
  static enum<K extends string[]>(...enums: K): Blueprint<K[number]> {
    return new Blueprint<K[number]>().enum(...enums);
  }

  /**
   * Assign type 'ENUM'
   * @param {...string} enums n1, n2, n3, ...n
   * @return {Blueprint<T>} Blueprint
   */
  enum<K extends string[]>(...enums: K): Blueprint<K[number]> {
    const instance = new Blueprint<K[number]>();
    instance._addAssignType(
      `ENUM(${enums.map((e) => `'${e.replace(/'/g, "")}'`)})`
    );
    instance._valueType = String;
    instance._enum = enums
    return instance;
  }

  /**
   * Assign type 'DATE' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static date(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().date();
  }

  /**
   * Assign type 'DATE' in table
   * @return {Blueprint<T>} Blueprint
   */
  date(): Blueprint<Date | string> {
    const instance = new Blueprint<Date | string>();
    instance._addAssignType(`DATE`);
    instance._valueType = Date;

    return instance;
  }

  /**
   * Assign type 'DATETIME' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static dateTime(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().dateTime();
  }

  /**
   * Assign type 'DATETIME' in table
   * @return {Blueprint<T>} Blueprint
   */
  dateTime(): Blueprint<Date | string> {
    const instance = new Blueprint<Date | string>();
    instance._addAssignType(`DATETIME`);
    instance._valueType = Date;
    return instance;
  }

  /**
   * Assign type 'DATETIME' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static datetime(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().dateTime();
  }

  /**
   * Assign type 'DATETIME' in table
   * @return {Blueprint<T>} Blueprint
   */
  datetime(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().dateTime();
  }

  /**
   * Assign type 'TIMESTAMP' in table
   * @static
   * @return {Blueprint<T>} Blueprint
   */
  static timestamp(): Blueprint<Date | string> {
    return new Blueprint<Date | string >().timestamp();
  }

  /**
   * Assign type 'TIMESTAMP' in table
   * @return {Blueprint<T>} Blueprint
   */
  timestamp(): Blueprint<Date | string> {
    const instance = new Blueprint<Date | string>();
    instance._addAssignType(`TIMESTAMP`);
    instance._valueType = Date;
    return instance;
  }

  //---------------------------- attributes ------------------------------------//

  /**
   * Assign attributes 'UNSIGNED' in table
   * @return {Blueprint<T>} Blueprint
   */
  unsigned(): Blueprint<T> {
    this._addAssignAttribute(`UNSIGNED`);
    return this;
  }

  /**
   * Assign attributes 'UNIQUE' in table
   * @return {Blueprint<T>} Blueprint
   */
  unique(): Blueprint<T> {
    this._addAssignAttribute(`UNIQUE`);
    return this;
  }

  /**
   * Assign attributes 'NULL' in table
   * @return {Blueprint<T>} Blueprint
   */
  null(): Blueprint<T | null> {
    this._addAssignAttribute(`NULL`);
    return this;
  }

  /**
   * Assign attributes 'NOT NULL' in table
   * @return {Blueprint<T>} Blueprint
   */
  notNull(): Blueprint<T> {
    this._addAssignAttribute(`NOT NULL`);
    return this as Blueprint<T>;
  }

  /**
   * Assign attributes 'NOT NULL' in table
   * @return {Blueprint<T>} Blueprint
   */
  notnull(): Blueprint<T> {
    this._addAssignAttribute(`NOT NULL`);
    return this;
  }

  /**
   * Assign attributes 'PRIMARY KEY' in table
   * @return {Blueprint<T>} Blueprint
   */
  primary(): Blueprint<T> {
    this._addAssignAttribute(`PRIMARY KEY`);
    return this;
  }

  /**
   * Assign attributes 'default' in table
   * @param {string | number} value  default value
   * @return {Blueprint<T>} Blueprint
   */
  default(value: string | number | boolean): Blueprint<T> {
    if (typeof value === 'boolean') {
      this._addAssignAttribute(`DEFAULT ${value ? 1 : 0}`);
      return this
    }

    if (typeof value === 'number') {
      this._addAssignAttribute(`DEFAULT ${value}`);
      return this
    }

    this._addAssignAttribute(`DEFAULT '${value}'`);
    return this;
  }

  /**
   * Assign attributes 'defaultValue' in table
   * @param {string | number} value  default value
   * @return {Blueprint<T>} Blueprint
   */
  defaultValue(value: string | number | boolean): Blueprint<T> {
    this.default(value)
    return this;
  }

  /**
   * Assign attributes 'default currentTimestamp' in table
   * @return {Blueprint<T>} Blueprint
   */
  currentTimestamp(): Blueprint<T> {
    this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
    return this;
  }

  /**
   * Assign attributes 'default currentTimestamp' in table
   * @return {Blueprint<T>} Blueprint
   */
  currenttimestamp(): Blueprint<T> {
    this._addAssignAttribute(`DEFAULT CURRENT_TIMESTAMP`);
    return this;
  }

  /**
   * Assign attributes 'autoIncrement' in table
   * @return {Blueprint<T>} Blueprint
   */
  autoIncrement(): Blueprint<T> {
    this._addAssignAttribute(`AUTO_INCREMENT`);
    return this;
  }

  /**
   * Assign attributes 'autoIncrement' in table
   * @return {Blueprint<T>} Blueprint
   */
  autoincrement(): Blueprint<T> {
    this._addAssignAttribute(`AUTO_INCREMENT`);
    return this;
  }

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
  foreign({
    references,
    on,
    onDelete,
    onUpdate,
  }: {
    references?: string;
    on: (new () => Model) | string;
    onDelete?: "CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL";
    onUpdate?: "CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL";
  }): Blueprint<T> {
    if (on == null) return this;

    this._foreignKey = {
      references: references == null ? "id" : references,
      on,
      onDelete: onDelete == null ? "CASCADE" : onDelete,
      onUpdate: onUpdate == null ? "CASCADE" : onUpdate,
    };

    return this;
  }

  /**
   * Assign attributes 'index' in table
   * @param {string} name of index
   * @return {Blueprint<T>} Blueprint
   */
  index(name: string = ""): Blueprint<T> {
    this._index = name;
    return this;
  }

  bindColumn(column: string) {
    this._column = column;
    return this;
  }

  get sql() {
    return this._sql;
  }

  get column() {
    return this._column;
  }

  get type() {
    return this._type;
  }

  get attributes() {
    return this._attributes;
  }

  get foreignKey() {
    return this._foreignKey;
  }

  get indexKey() {
    return this._index;
  }
  get valueType() {
    return this._valueType;
  }

  private _addAssignType(type: string) {
    this._type = type;
    return this;
  }

  private _addAssignAttribute(attribute: string) {
    this._attributes = [...this.attributes, attribute];
    return this;
  }
}

export { Blueprint };
export default Blueprint;
