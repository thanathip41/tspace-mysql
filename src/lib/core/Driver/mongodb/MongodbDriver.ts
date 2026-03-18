import { BaseDriver } from "..";
import { MongodbQueryBuilder } from "./MongodbQueryBuilder";
import type { TConnection, TPoolEvent } from "../../../types";

type MongodbCollection<T> = {
  aggregate: (pipeline: any[]) => {
    toArray: () => Promise<T[]>;
  };
};

type MongodbConnectionOptions = {
  host: string;
  port: number;
  database: string;
  user: string;
  username: string;
  password: string;

  connectionLimit: number;
  connectTimeout: number;
};

export class MongodblDriver extends BaseDriver {
    private db!: { 
        collection: <T>(name: string) => MongodbCollection<T> 
    };

    private _connecting !: Promise<void>;

    constructor(options: Record<string, any>) {
        super();
        this.options = options;
    }
    public connect(this: MongodblDriver) {
        const options = this.options as MongodbConnectionOptions;
        const { MongoClient } = this.import("mongodb");

        const url = `mongodb://${options.user}:${options.password}@${options.host}:${options.port}/${options.database}?authSource=admin`;

        this.pool = new MongoClient(url, {
            maxPoolSize: options.connectionLimit ?? 20,
            minPoolSize: Math.max(2, Math.floor((options.connectionLimit ?? 20) / 3)),
            maxIdleTimeMS: 1000 * 60,
        });

        this._connecting = this.pool
        .connect()
        .then(() => {
            this.db = this.pool.db(options.database);

            if (this.options.CONNECTION_SUCCESS) {
                console.log(this._messageConnected("MongoDB connected"));
            }
        })
        .catch((err: any) => {
            const message = this._messageError.bind(this);

            process.nextTick(() => {
                console.log(message(err?.message));
                if (this.options.CONNECTION_ERROR) process.exit();
            });
        });

        return {
            database: () => options.database,
            on: (event: TPoolEvent, data: any) => this.on(event, data),
            queryBuilder: MongodbQueryBuilder,
            query: async (collection: string) => this._query(collection),
            connection: () => this._connection(),
            end: () => this._end(),
        };
    }

    public disconnect(pool: any): void {
        if (pool == null) return;
        pool?.end(() => {
        pool = undefined;
        });
    }

   private async _query(sql: string): Promise<any[]> {

        const parseInput = (input: string) => {
            const match = input.match(
                /db\.([a-zA-Z0-9_]+)\.aggregate\((\[.*\])\)\.toArray\(\)/
            );

            if (!match) return { collection : '', pipeline : [] };

            const [_, collection, pipelineStr] = match;

            try {
                const pipeline = JSON.parse(pipelineStr);

                return { collection, pipeline };

            } catch {
                return { collection, pipeline : [] };
            }
        }

        if(this.db == null) {
            await this._connecting;
        }

        const start = Date.now();

        const { collection, pipeline } = parseInput(sql)

        const col = this.db.collection(collection);

        const results = await col.aggregate(pipeline).toArray();

        this._detectEventQuery({ start, sql });

        console.log( { results  })
     
        return results;
    }
    private _connection(): Promise<TConnection> {
        let closeTransaction: boolean = false;

        return new Promise((resolve, reject) => {
        this.pool.getConnection((err: any, connection: any) => {
            if (err) return reject(err);

            const query = (sql: string) => {
            const start: number = Date.now();

            return new Promise<any[]>((ok, fail) => {
                if (closeTransaction) {
                return fail(new Error(this.MESSAGE_TRX_CLOSED));
                }

                connection.query(sql, (err: any, results: any[]) => {
                connection.release();

                if (err) {
                    return fail(err);
                }

                this._detectEventQuery({ start, sql });

                this.meta(results, sql);

                return ok(this.returning(results));
                });
            });
            };

            const startTransaction = async () => {
            if (closeTransaction) {
                throw new Error(this.MESSAGE_TRX_CLOSED);
            }

            await query("START TRANSACTION").catch((err) => reject(err));

            return;
            };

            const commit = async () => {
            if (closeTransaction) {
                throw new Error(this.MESSAGE_TRX_CLOSED);
            }
            await query("COMMIT").catch((err) => reject(err));

            await end();

            return;
            };

            const rollback = async () => {
            if (closeTransaction) {
                throw new Error(this.MESSAGE_TRX_CLOSED);
            }

            await query("ROLLBACK").catch((err) => reject(err));

            // when rollback will end of transction
            await end();

            return;
            };

            const end = async () => {
            await new Promise<void>((resolve) =>
                setTimeout(() => {
                if (!closeTransaction) {
                    closeTransaction = true;

                    // After commit the transaction, you can't perform any actions with this transaction.
                    connection.destroy();

                    // After destroying the connection, it will be removed from the connection this.pool.
                    this.pool.end();
                }

                return resolve();
                }, 500),
            );

            return;
            };

            return resolve({
            on: (event: TPoolEvent, data: any) => this.on(event, data),
            query,
            queryBuilder: MongodbQueryBuilder,
            startTransaction,
            commit,
            rollback,
            end,
            });
        });
        });
    }
    private async _end(): Promise<void> {
        if (!this.pool) return; 
        await this.pool.close(); 
        this.pool = undefined;  
        console.log("MongoDB connection closed");
    }

    protected meta(results: any, sql: string): void {
        if (Array.isArray(results)) return;

        if (results.$meta == null) results.$meta = {};

        const command = this._detectQueryType(sql);

        results.$meta = {
        command,
        };

        if (command === "INSERT") {
        const insertIds =
            results.affectedRows <= 1
            ? [results.insertId]
            : [...Array(results.affectedRows)].map(
                (_, i) => results.insertId + i,
                );

        results.$meta = {
            ...results.$meta,
            insertIds,
            affected: true,
        };
        }

        if (command === "UPDATE" || command === "DELETE") {
        results.$meta = {
            ...results.$meta,
            insertIds: [],
            affected: Boolean(results.affectedRows),
        };
        }
    }

    protected returning(results: any) {
        if (Array.isArray(results)) return results;

        return results;
    }
}
