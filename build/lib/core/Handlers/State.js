"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHandler = void 0;
const STATE_DEFAULT = {
    PRIMARY_KEY: 'id',
    VOID: false,
    RESULT: null,
    DISTINCT: false,
    PLUCK: '',
    SAVE: '',
    DELETE: '',
    UPDATE: '',
    INSERT: '',
    SELECT: [],
    ONLY: [],
    EXCEPTS: [],
    CHUNK: 0,
    COUNT: '',
    FROM: 'FROM',
    JOIN: [],
    WHERE: [],
    GROUP_BY: [],
    ORDER_BY: [],
    LIMIT: '',
    OFFSET: '',
    HAVING: '',
    TABLE_NAME: '',
    UUID_CUSTOM: '',
    HIDDEN: [],
    DEBUG: false,
    UUID: false,
    PAGE: 1,
    PER_PAGE: 1,
    HOOKS: [],
    RETURN_TYPE: null
};
const STATE_DB = {
    PRIMARY_KEY: 'id',
    VOID: false,
    RESULT: null,
    DISTINCT: false,
    PLUCK: '',
    SAVE: '',
    DELETE: '',
    UPDATE: '',
    INSERT: '',
    SELECT: [],
    ONLY: [],
    EXCEPTS: [],
    CHUNK: 0,
    COUNT: '',
    FROM: 'FROM',
    JOIN: [],
    WHERE: [],
    GROUP_BY: [],
    ORDER_BY: [],
    LIMIT: '',
    OFFSET: '',
    HAVING: '',
    TABLE_NAME: '',
    UUID_CUSTOM: '',
    HIDDEN: [],
    DEBUG: false,
    UUID: false,
    PAGE: 1,
    PER_PAGE: 1,
    HOOKS: [],
    RETURN_TYPE: null
};
const STATE_MODEL = {
    MODEL_NAME: 'MODEL',
    PRIMARY_KEY: 'id',
    VOID: false,
    SELECT: [],
    DELETE: '',
    UPDATE: '',
    INSERT: '',
    ONLY: [],
    EXCEPTS: [],
    CHUNK: 0,
    COUNT: '',
    FROM: 'FROM',
    JOIN: [],
    WHERE: [],
    GROUP_BY: [],
    ORDER_BY: [],
    LIMIT: '',
    OFFSET: '',
    HAVING: '',
    TABLE_NAME: '',
    UUID_FORMAT: 'uuid',
    HIDDEN: [],
    DEBUG: false,
    UUID: false,
    SOFT_DELETE: false,
    SOFT_DELETE_FORMAT: 'deleted_at',
    SOFT_DELETE_RELATIONS: false,
    PAGE: 1,
    PER_PAGE: 1,
    REGISTRY: {},
    RESULT: null,
    PATTERN: 'snake_case',
    DISTINCT: false,
    PLUCK: '',
    SAVE: '',
    HOOKS: [],
    RELATION: [],
    RELATIONS: [],
    RELATIONS_TRASHED: false,
    RELATIONS_EXISTS: false,
    TIMESTAMP: false,
    TIMESTAMP_FORMAT: {
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at'
    },
    LOGGER: false,
    LOGGER_OPTIONS: null,
    TABLE_LOGGER: '$loggers',
    VALIDATE_SCHEMA: false,
    VALIDATE_SCHEMA_DEFINED: null,
    FUNCTION_RELATION: false,
    SCHEMA_TABLE: null,
    RETRY: 0,
    OBSERVER: null,
    DATA: null,
    BEFORE_CREATING_TABLE: null,
    RETURN_TYPE: null
};
class StateHandler {
    constructor(state) {
        this.STATE = {
            currentState: new Map(),
            defaultState: new Map()
        };
        switch (state) {
            case 'db': {
                const currentState = new Map(Object.entries(Object.assign({}, STATE_DB)));
                const defaultState = new Map(Object.entries(Object.assign({}, STATE_DB)));
                this.STATE = { currentState, defaultState };
                return this;
            }
            case 'model': {
                const currentState = new Map(Object.entries(Object.assign({}, STATE_MODEL)));
                const defaultState = new Map(Object.entries(Object.assign({}, STATE_MODEL)));
                this.STATE = { currentState, defaultState };
                return this;
            }
            case 'default': {
                const currentState = new Map(Object.entries(Object.assign({}, STATE_DEFAULT)));
                const defaultState = new Map(Object.entries(Object.assign({}, STATE_DEFAULT)));
                this.STATE = { currentState, defaultState };
                return this;
            }
            default: throw new Error(`Unknown the state : '${state}'`);
        }
    }
    original() {
        return this.STATE.defaultState;
    }
    get(key) {
        if (key == null)
            return this.STATE.currentState;
        key = key.toUpperCase();
        if (!this.STATE.currentState.has(key) && key !== 'DEBUG') {
            return this._assertError(`This state does not have that key '${key}'`);
        }
        return this.STATE.currentState.get(key);
    }
    set(key, value) {
        key = key.toUpperCase();
        if (!this.STATE.currentState.has(key)) {
            return this._assertError(`That key '${key}' can't be set in the state`);
        }
        this.STATE.currentState.set(key, value);
        return;
    }
    clone(data) {
        this.STATE.currentState = new Map(Object.entries(Object.assign({}, data)));
        return;
    }
    reset() {
        this.STATE.currentState.set('INSERT', '');
        this.STATE.currentState.set('UPDATE', '');
        this.STATE.currentState.set('DELETE', '');
        this.STATE.currentState.set('WHERE', []);
        this.STATE.currentState.set('SELECT', []);
        this.STATE.currentState.set('LIMIT', '');
        this.STATE.currentState.set('OFFSET', '');
        this.STATE.currentState.set('GROUP_BY', []);
        this.STATE.currentState.set('ORDER_BY', []);
        this.STATE.currentState.set('HAVING', '');
        this.STATE.currentState.set('JOIN', []);
        this.STATE.currentState.set('SAVE', '');
        this.STATE.currentState.set('RELATIONS', []);
    }
    _assertError(condition = true, message = 'error') {
        if (typeof condition === 'string') {
            throw new Error(condition);
        }
        if (condition)
            throw new Error(message);
        return;
    }
}
exports.StateHandler = StateHandler;
exports.default = StateHandler;
//# sourceMappingURL=State.js.map