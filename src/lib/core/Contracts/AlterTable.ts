import { Model } from "../Model";
import { T }     from "../UtilityTypes";

class AlterTable<M extends Model> {
  private model: M;
  private table: string;
  private queries: Function[] = [];

  constructor(model: new () => M) {
    this.model = new model();
    this.table = this.model.getTableName();
  }

  public addPrimary<
    C extends T.ColumnKeys<M, { OnlyColumn: true }>[]
  >(columns: C) {

    this.queries.push(() => {
      return this.model.addPrimaryKey({ columns });
    });

    return this;
  }

  public dropPrimary() {
    this.queries.push(() => {
      return this.model.dropPrimaryKey();
    });

    return this;
  }

  public addUnique<
    C extends T.ColumnKeys<M, { OnlyColumn: true }>[]
  >(columns: C, name: string = "") {

    const n = name || `ux_${this.table}_${columns.join("_")}`;

    this.queries.push(() => {
      this.model.addUnique({ columns, name: n })
    });

    return this;
  }

  dropUnique(name: string) {
    this.queries.push(() => {
      return this.model.dropUnique({ name })
    });

    return this;
  }

  addIndex<
    C extends T.ColumnKeys<M, { OnlyColumn: true }>[]
  >(columns: C, name: string = "") {

    const n = name || `idx_${this.table}_${columns.join("_")}`;

    this.queries.push(() => {
      return this.model.addIndex({ columns, name: n })
    });

    return this;
  }

  dropIndex(name: string) {
    this.queries.push(() => {
      return this.model.dropIndex({ name })
    });

    return this;
  }

  async run() {
    for (const q of this.queries) {
      await q();
    }
  }
};

export { AlterTable };
export default AlterTable;