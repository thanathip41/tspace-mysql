import { Model } from "../Model";
import { T }     from "../UtilityTypes";

/**
 * Builder class for altering an existing database table.
 *
 * This class collects schema modification operations (primary key,
 * unique constraints, indexes, etc.) and executes them sequentially
 * when {@link run} is called.
 *
 * @template M - The model type extending Model.
 */
class AlterTable<M extends Model> {

  private model: M;
  private table: string;
  private queries: (() => Promise<void>)[] = [];
  
  /**
   * Creates a new AlterTable builder.
   *
   * @param {new () => M} model - The model constructor used to resolve the table.
   */
  constructor(model: new () => M) {
    this.model = new model().disabledRetry();
    this.table = this.model.getTableName();
  }

  /**
   * Dumps debugging information from the underlying model.
   *
   * @returns {this} Returns the current builder instance for chaining.
   */
  public dd(): this {
    this.model.dd()
    return this;
  }

  /**
   * Adds a primary key constraint to the table.
   *
   * @template C
   * @param {C} columns - Column names that will form the primary key.
   * @returns {this} Returns the current builder instance for chaining.
   */
  public addPrimary<
    C extends T.ColumnKeys<M>[]
  >(columns: C): this {

    this.queries.push(() => {
      return this.model.addPrimaryKey({ columns, table : this.table });
    });

    return this;
  }

  /**
   * Drops the primary key constraint from the table.
   *
   * @returns {this} Returns the current builder instance for chaining.
   */
  public dropPrimary(): this {
    this.queries.push(() => {
      return this.model.dropPrimaryKey({ table : this.table });
    });

    return this;
  }

  /**
   * Adds a unique constraint to the table.
   *
   * If no name is provided, a default constraint name will be generated
   * in the format: `ux_{table}_{column1_column2...}`.
   *
   * @template C
   * @param {C} columns - Column names included in the unique constraint.
   * @param {string} [name=""] - Optional unique constraint name.
   * @returns {this} Returns the current builder instance for chaining.
   */
  public addUnique<
    C extends T.ColumnKeys<M>[]
  >(columns: C, name: string = ""): this {

    const n = name || `ux_${this.table}_${columns.join("_")}`;

    this.queries.push(() => {
      return this.model.addUnique({ columns, name: n , table : this.table})
    });

    return this;
  }

  /**
   * Drops a unique constraint from the table.
   *
   * @param {string} name - The name of the unique constraint to drop.
   * @returns {this} Returns the current builder instance for chaining.
   */
  public dropUnique(name: string): this {
    this.queries.push(() => {
      return this.model.dropUnique({ name, table : this.table })
    });

    return this;
  }

  /**
   * Adds an index to the table.
   *
   * If no name is provided, a default index name will be generated
   * in the format: `idx_{table}_{column1_column2...}`.
   *
   * @template C
   * @param {C} columns - Column names included in the index.
   * @param {string} [name=""] - Optional index name.
   * @returns {this} Returns the current builder instance for chaining.
   */
  public addIndex<
    C extends T.ColumnKeys<M>[]
  >(columns: C, name: string = ""): this {

    const n = name || `idx_${this.table}_${columns.join("_")}`;

    this.queries.push(() => {
      return this.model.addIndex({ columns, name: n, table : this.table })
    });

    return this;
  }

  /**
   * Drops an index from the table.
   *
   * @param {string} name - The name of the index to drop.
   * @returns {this} Returns the current builder instance for chaining.
   */
  public dropIndex(name: string): this {
    this.queries.push(() => {
      return this.model.dropIndex({ name, table : this.table })
    });

    return this;
  }

  /**
   * Adds a foreign key constraint to the table.
   *
   * This method defines a relationship between a column in the current table
   * and a referenced column in another table. If no constraint name is provided,
   * a deterministic name will be automatically generated based on the table
   * and column names.
   *
   * The generated constraint name follows the format:
   * `fk_{table(column)}_{referencedTable(referencedColumn)}`.
   * If the generated name exceeds the database identifier length limit,
   * a shortened version with a hash suffix will be used.
   *
   * @param {Object} params - Foreign key configuration.
   * @param {string} params.column - The column in the current table that will act as the foreign key.
   * @param {string} [params.constraint] - Optional constraint of the foreign key constraint.
   * @param {string} [params.references] - The referenced column in the foreign table. Defaults to `"id"`.
   * @param {(new () => Model) | string} params.on - The referenced table. This can be a Model constructor or a table name string.
   * @param {"CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL"} params.onDelete - Action executed when the referenced row is deleted.
   * @param {"CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL"} params.onUpdate - Action executed when the referenced row is updated.
   *
   * @returns {this} Returns the current builder instance for method chaining.
   *
   * @example
   * await Schema
   *   .alterTable(User)
   *   .addForeignKey({
   *      references: {
   *        on    : User
   *      },
   *      onDelete: 'CASCADE',
   *      onUpdate: 'CASCADE'
   *   })
   *   .run();
   */
  public addForeignKey({ column, name, references, onDelete, onUpdate }: {
    column  : string;
    name    ?: string;
    references: {
      on: (new () => Model) | string,
      column?: string
    },
    onDelete ?: "CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL";
    onUpdate ?: "CASCADE" | "NO ACTION" | "RESTRICT" | "SET NULL";
  }): this {

    const onReference = typeof references.on === "string" ? references.on : new references.on();

    const tableRef = typeof onReference === "string"
    ? onReference
    : onReference.getTableName();

    const generateConstraintName = ({ modelTable, key, foreignTable, foreignKey }: {
      modelTable: string;
      key: string;
      foreignTable: string;
      foreignKey: string;
    }): string => {
      const MAX_LENGTH = 64;

      const baseName = [
        "fk",
        `${modelTable}(${key})`,
        `${foreignTable}(${foreignKey})`,
      ].join("_");

      if (baseName.length <= MAX_LENGTH) {
        return `\`${baseName}\``;
      }

      const hash = Buffer.from(baseName).toString("base64").slice(0, 8);

      const shortParts = [
        "fk",
        `${modelTable.slice(0, 16)}(${key.slice(0, 16)})`,
        `${foreignTable.slice(0, 16)}(${foreignKey.slice(0, 16)})`,
        hash,
      ];

      const shortName = shortParts.join("_").slice(0, MAX_LENGTH);

      return `\`${shortName}\``;
    };

    const constraintName = generateConstraintName({
      modelTable: this.model.getTableName(),
      key: column,
      foreignTable: tableRef,
      foreignKey: references.column ?? "id",
    }).replace(/`/g, "");

    this.queries.push(() => {
      return this.model.addFK({
        table : this.table,
        tableRef,
        key: column,
        constraint : name ?? constraintName,
        foreign: {
          references : references.column ?? "id",
          onDelete   : onDelete ?? "CASCADE",
          onUpdate   : onUpdate ?? "CASCADE"
        }
      })
    });

    return this;
  }

  /**
   * Drops a foreign key constraint from the table.
   *
   * The specified foreign key constraint will be removed from the current table.
   *
   * @param {string} constraint - The name of the foreign key constraint to drop.
   *
   * @returns {this} Returns the current builder instance for method chaining.
   *
   * @example
   * alterTable(User)
   *   .dropForeignKey("fk_users_role_id")
   *   .run();
   */
  public dropForeignKey(constraint: string): this {
    this.queries.push(() => {
      return this.model.dropFK({constraint, table : this.table })
    });

    return this;
  }

  /**
   * Executes all queued schema modification queries sequentially.
   *
   * If a query fails, the error will be logged but execution will
   * continue with the remaining queries.
   *
   * @async
   * @returns {Promise<void>}
   */
  public async run(): Promise<void> {
    for (const query of this.queries) {
      try {
        await query();
      } catch (err: any) {
        console.log(
          `\n\x1b[31mERROR: Failed to Alter table "${this.table}" caused by "${err.message}"\x1b[0m`
        );
      }
    }
  }
};

export { AlterTable };
export default AlterTable;