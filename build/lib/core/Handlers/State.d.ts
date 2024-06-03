declare const STATE_DEFAULT: {
    readonly PRIMARY_KEY: "id";
    readonly VOID: false;
    readonly RESULT: null;
    readonly DISTINCT: false;
    readonly PLUCK: "";
    readonly SAVE: "";
    readonly DELETE: "";
    readonly UPDATE: "";
    readonly INSERT: "";
    readonly SELECT: readonly [];
    readonly ONLY: readonly [];
    readonly EXCEPTS: readonly [];
    readonly CHUNK: 0;
    readonly COUNT: "";
    readonly FROM: "FROM";
    readonly JOIN: readonly [];
    readonly WHERE: readonly [];
    readonly GROUP_BY: readonly [];
    readonly ORDER_BY: readonly [];
    readonly LIMIT: "";
    readonly OFFSET: "";
    readonly HAVING: "";
    readonly TABLE_NAME: "";
    readonly UUID_CUSTOM: "";
    readonly HIDDEN: readonly [];
    readonly DEBUG: false;
    readonly UUID: false;
    readonly PAGE: 1;
    readonly PER_PAGE: 1;
    readonly HOOKS: readonly [];
    readonly RETURN_TYPE: null;
};
declare const STATE_DB: {
    readonly PRIMARY_KEY: "id";
    readonly VOID: false;
    readonly RESULT: null;
    readonly DISTINCT: false;
    readonly PLUCK: "";
    readonly SAVE: "";
    readonly DELETE: "";
    readonly UPDATE: "";
    readonly INSERT: "";
    readonly SELECT: readonly [];
    readonly ONLY: readonly [];
    readonly EXCEPTS: readonly [];
    readonly CHUNK: 0;
    readonly COUNT: "";
    readonly FROM: "FROM";
    readonly JOIN: readonly [];
    readonly WHERE: readonly [];
    readonly GROUP_BY: readonly [];
    readonly ORDER_BY: readonly [];
    readonly LIMIT: "";
    readonly OFFSET: "";
    readonly HAVING: "";
    readonly TABLE_NAME: "";
    readonly UUID_CUSTOM: "";
    readonly HIDDEN: readonly [];
    readonly DEBUG: false;
    readonly UUID: false;
    readonly PAGE: 1;
    readonly PER_PAGE: 1;
    readonly HOOKS: readonly [];
    readonly RETURN_TYPE: null;
};
declare const STATE_MODEL: {
    readonly MODEL_NAME: "MODEL";
    readonly PRIMARY_KEY: "id";
    readonly VOID: false;
    readonly SELECT: readonly [];
    readonly DELETE: "";
    readonly UPDATE: "";
    readonly INSERT: "";
    readonly ONLY: readonly [];
    readonly EXCEPTS: readonly [];
    readonly CHUNK: 0;
    readonly COUNT: "";
    readonly FROM: "FROM";
    readonly JOIN: readonly [];
    readonly WHERE: readonly [];
    readonly GROUP_BY: readonly [];
    readonly ORDER_BY: readonly [];
    readonly LIMIT: "";
    readonly OFFSET: "";
    readonly HAVING: "";
    readonly TABLE_NAME: "";
    readonly UUID_FORMAT: "uuid";
    readonly HIDDEN: readonly [];
    readonly DEBUG: false;
    readonly UUID: false;
    readonly SOFT_DELETE: false;
    readonly SOFT_DELETE_FORMAT: "deleted_at";
    readonly SOFT_DELETE_RELATIONS: false;
    readonly PAGE: 1;
    readonly PER_PAGE: 1;
    readonly REGISTRY: {};
    readonly RESULT: null;
    readonly PATTERN: "snake_case";
    readonly DISTINCT: false;
    readonly PLUCK: "";
    readonly SAVE: "";
    readonly HOOKS: readonly [];
    readonly RELATION: readonly [];
    readonly RELATIONS: readonly [];
    readonly RELATIONS_TRASHED: false;
    readonly RELATIONS_EXISTS: false;
    readonly TIMESTAMP: false;
    readonly TIMESTAMP_FORMAT: {
        readonly CREATED_AT: "created_at";
        readonly UPDATED_AT: "updated_at";
    };
    readonly LOGGER: false;
    readonly LOGGER_OPTIONS: null;
    readonly TABLE_LOGGER: "$loggers";
    readonly VALIDATE_SCHEMA: false;
    readonly VALIDATE_SCHEMA_DEFINED: null;
    readonly FUNCTION_RELATION: false;
    readonly SCHEMA_TABLE: null;
    readonly RETRY: 0;
    readonly OBSERVER: null;
    readonly DATA: null;
    readonly BEFORE_CREATING_TABLE: null;
    readonly RETURN_TYPE: null;
    readonly GLOBAL_SCOPE: true;
    readonly GLOBAL_SCOPE_QUERY: null;
};
type TState = typeof STATE_MODEL & typeof STATE_DB & typeof STATE_DEFAULT;
declare class StateHandler {
    private STATE;
    constructor(state: 'model' | 'db' | 'default');
    original(): Map<string, any>;
    get(key?: keyof TState): any;
    set(key: keyof TState, value: any): void;
    clone(data: any): void;
    reset(): void;
    private _assertError;
}
export { StateHandler };
export default StateHandler;
