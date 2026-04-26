import { BaseDriver } from "..";
import { MongodbQueryBuilder } from "./MongodbQueryBuilder";
import type { TConnection, TPoolEvent } from "../../../types";

type MongodbCollection<T> = {
  aggregate: (pipeline: any[], options?: any) => {
    toArray: () => Promise<T[]>;
  };

  insertMany: (docs: Partial<T>[]) => Promise<{
    acknowledged: boolean;
    insertedCount: number;
    insertedIds: Record<number, any>;
  }>;

  updateMany: (
    filter: Partial<T>,
    update: any
  ) => Promise<{
    acknowledged: boolean;
    matchedCount: number;
    modifiedCount: number;
    upsertedCount: number;
    upsertedId: any | null;
  }>;

  deleteMany: (
    filter: Partial<T>
  ) => Promise<{
    acknowledged: boolean;
    deletedCount: number;
  }>;
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
            maxPoolSize: options.connectionLimit ?? 10,
            minPoolSize: Math.max(2, Math.floor((options.connectionLimit ?? 10) / 3)),
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

            console.log(message(err?.message));
            if (this.options.CONNECTION_ERROR) process.exit();
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

    private async _query(pipeline: string): Promise<any> {

        if (this.db == null) {
            await this._connecting;
        }

        if(this.db?.collection == null) {
            throw new Error("Failed to establish a connection to the collection.");
        }

        const { type, collection, args } = this._parseInput(pipeline);

        const col = this.db.collection(collection);

        let results: any;

        switch (type) {
            case 'aggregate':
                results = await col.aggregate(args).toArray();
            break;

            case 'insertMany':
                results = await col.insertMany(args);
            break;

            case 'updateMany':
                results = await col.updateMany(args.filter, args.update);
            break;

            case 'deleteMany':
                results = await col.deleteMany(args);
            break;

            default:
                throw new Error('Unsupported query type');
        }

        this.meta(results, pipeline);

        return this.returning(results);
    }
    private async _connection(): Promise<TConnection> {

        if (this.db == null) {
            await this._connecting;
        }

        const client = this.pool;
        const session = client.startSession();

        let closed = false;
        let inTransaction = false;

        const supportsTransaction =
            (client as any)?.topology?.s?.description?.type !== "Single";

        const ensureOpen = () => {
            if (closed) throw new Error(this.MESSAGE_TRX_CLOSED);
        };

        const query = async (collectionName: string): Promise<any[]> => {
            ensureOpen();

            const start = Date.now();

            const collection = this.db.collection(collectionName);

            let data: any[];

            if (supportsTransaction && inTransaction) {
                data = await collection.aggregate([], { session }).toArray();
            } else {
                data = await collection.aggregate([]).toArray();
            }

            this._detectEventQuery({
                start,
                sql: collectionName,
            });

            this.meta(data, collectionName);

            return this.returning(data);
        };

        const startTransaction = async () => {
            ensureOpen();

            if (!supportsTransaction) {
                throw new Error(
                    "MongoDB is running in standalone mode. Transactions are not supported."
                );
            }

            if (inTransaction) {
                throw new Error("Transaction already started");
            }

            session.startTransaction();
            inTransaction = true;
        };

        const commit = async () => {
            ensureOpen();

            if (supportsTransaction && inTransaction) {
                await session.commitTransaction();
            }

            inTransaction = false;
            await end();
        };

        const rollback = async () => {
            ensureOpen();

            if (supportsTransaction && inTransaction) {
                await session.abortTransaction();
            }

            inTransaction = false;
            await end();
        };

        const end = async () => {
            if (closed) return;

            closed = true;
            await session.endSession();
        };

        return {
            on: (event: TPoolEvent, data: any) => this.on(event, data),

            queryBuilder: MongodbQueryBuilder,

            query,

            startTransaction,
            commit,
            rollback,
            end,
            release: async () => {
                return;
            }
        };
    }
    private async _end(): Promise<void> {
        if (!this.pool) return; 
        await this.pool.close(); 
        this.pool = undefined;  
        console.log("MongoDB connection closed");
    }

    protected meta(results: any, pipeline: string): void {
        if (Array.isArray(results)) return;

        if (results.$meta == null) results.$meta = {};

        const command = this._detectQueryType(pipeline);

        results.$meta = {
            command
        };

        if (command === "INSERT") {
            const insertIds = Object.values(results.insertedIds)

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

    private _parseInput (input: string) {
        
        let match = input.match(
            /db\.([a-zA-Z0-9_]+)\.aggregate\((\[.*\])\)\.toArray\(\)/
        );

        if (match) {
            const [, collection, pipelineStr] = match;
            return {
                type: 'aggregate',
                collection,
                args: JSON.parse(pipelineStr)
            };
        }

        match = input.match(
            /db\.([a-zA-Z0-9_]+)\.insertMany\((\[.*\])\)/
        );

        if (match) {
            const [, collection, docsStr] = match;
            return {
                type: 'insertMany',
                collection,
                args: JSON.parse(docsStr)
            };
        }

        match = input.match(
            /db\.([a-zA-Z0-9_]+)\.updateMany\((\{.*\}),\s*(\{.*\})\)/
        );

        if (match) {
            const [, collection, filterStr, updateStr] = match;
            return {
                type: 'updateMany',
                collection,
                args: {
                    filter: JSON.parse(filterStr),
                    update: JSON.parse(updateStr)
                }
            };
        }

        match = input.match(
            /db\.([a-zA-Z0-9_]+)\.deleteMany\((\{.*\})\)/
        );

        if (match) {
            const [, collection, filterStr] = match;
            return {
                type: 'deleteMany',
                collection,
                args: JSON.parse(filterStr)
            };
        }

        return { type: 'unknown', collection: '', args: null };
    }

    protected _detectQueryType(query: string) {

        const { type } = this._parseInput(query);

        const selectRegex = /^\s*aggregate\b/i;
        const updateRegex = /^\s*updateMany\b/i;
        const insertRegex = /^\s*insertMany\b/i;
        const deleteRegex = /^\s*deleteMany\b/i;

        if (selectRegex.test(type)) return "SELECT";
        if (updateRegex.test(type)) return "UPDATE";
        if (insertRegex.test(type)) return "INSERT";
        if (deleteRegex.test(type)) return "DELETE";

        return "UNKNOWN";
    }
}
