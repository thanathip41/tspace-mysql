"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHandler = void 0;
class StateHandler {
    constructor(constant) {
        this.STATE = {
            currentState: new Map(),
            defaultState: new Map()
        };
        const currentState = new Map(Object.entries(Object.assign({}, constant)));
        const defaultState = new Map(Object.entries(Object.assign({}, constant)));
        this.STATE = {
            currentState,
            defaultState
        };
    }
    original() {
        return this.STATE.defaultState;
    }
    get(key) {
        if (key == null)
            return this.STATE.currentState;
        this._assertError(!this.STATE.currentState.has(key) && key !== 'DEBUG', `Can't get this [ ${key} ]`);
        return this.STATE.currentState.get(key.toUpperCase());
    }
    set(key, value) {
        this._assertError(!this.STATE.currentState.has(key), `Can't set this [ ${key} ]`);
        this.STATE.currentState.set(key.toUpperCase(), value);
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
        this.STATE.currentState.set('LIMIT', '');
        this.STATE.currentState.set('OFFSET', '');
        this.STATE.currentState.set('SELECT', []);
        this.STATE.currentState.set('GROUP_BY', '');
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
