"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6;
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOptionsEnvironment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const environment = () => {
    var _a;
    const NODE_ENV = (_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV;
    const env = path_1.default.join(path_1.default.resolve(), '.env');
    if (NODE_ENV == null)
        return env;
    const envWithEnviroment = path_1.default.join(path_1.default.resolve(), `.env.${NODE_ENV}`);
    if (fs_1.default.existsSync(envWithEnviroment))
        return envWithEnviroment;
    return env;
};
dotenv_1.default.config({ path: environment() });
const ENV = process.env;
const env = {
    HOST: (_b = (_a = ENV.DB_HOST) !== null && _a !== void 0 ? _a : ENV.TSPACE_HOST) !== null && _b !== void 0 ? _b : 'localhost',
    PORT: (_d = (_c = ENV.DB_PORT) !== null && _c !== void 0 ? _c : ENV.TSPACE_PORT) !== null && _d !== void 0 ? _d : 3306,
    USERNAME: (_f = (_e = ENV.DB_USERNAME) !== null && _e !== void 0 ? _e : ENV.TSPACE_USERNAME) !== null && _f !== void 0 ? _f : ENV.DB_USER,
    PASSWORD: (_h = (_g = ENV.DB_PASSWORD) !== null && _g !== void 0 ? _g : ENV.TSPACE_PASSWORD) !== null && _h !== void 0 ? _h : '',
    DATABASE: (_j = ENV.DB_DATABASE) !== null && _j !== void 0 ? _j : ENV.TSPACE_DATABASE,
    CONNECTION_LIMIT: (_l = (_k = ENV.DB_CONNECTION_LIMIT) !== null && _k !== void 0 ? _k : ENV.TSPACE_CONNECTION_LIMIT) !== null && _l !== void 0 ? _l : 151,
    QUEUE_LIMIT: (_o = (_m = ENV.DB_QUEUE_LIMIT) !== null && _m !== void 0 ? _m : ENV.TSPACE_QUEUE_LIMIT) !== null && _o !== void 0 ? _o : 0,
    TIMEOUT: (_q = (_p = ENV.DB_TIMEOUT) !== null && _p !== void 0 ? _p : ENV.TSPACE_TIMEOUT) !== null && _q !== void 0 ? _q : 1000 * 90,
    CHARSET: (_s = (_r = ENV.DB_CHARSET) !== null && _r !== void 0 ? _r : ENV.TSPACE_CHARSET) !== null && _s !== void 0 ? _s : 'utf8mb4',
    CONNECTION_ERROR: (_u = (_t = ENV.DB_CONNECTION_ERROR) !== null && _t !== void 0 ? _t : ENV.TSPACE_CONNECTION_ERROR) !== null && _u !== void 0 ? _u : false,
    CONNECTION_SUCCESS: (_w = (_v = ENV.DB_CONNECTION_SUCCESS) !== null && _v !== void 0 ? _v : ENV.TSPACE_CONNECTION_SUCCESS) !== null && _w !== void 0 ? _w : false,
    WAIT_FOR_CONNECTIONS: (_y = (_x = ENV.DB_WAIT_FOR_CONNECTIONS) !== null && _x !== void 0 ? _x : ENV.TSPACE_WAIT_FOR_CONNECTIONS) !== null && _y !== void 0 ? _y : true,
    DATE_STRINGS: (_0 = (_z = ENV.DB_DATE_STRINGS) !== null && _z !== void 0 ? _z : ENV.TSPACE_DATE_STRINGS) !== null && _0 !== void 0 ? _0 : false,
    KEEP_ALIVE_DELAY: (_2 = (_1 = ENV.DB_KEEP_ALIVE_DELAY) !== null && _1 !== void 0 ? _1 : ENV.TSPACE_KEEP_ALIVE_DELAY) !== null && _2 !== void 0 ? _2 : 0,
    ENABLE_KEEP_ALIVE: (_4 = (_3 = ENV.DB_ENABLE_KEEP_ALIVE) !== null && _3 !== void 0 ? _3 : ENV.TSPACE_ENABLE_KEEP_ALIVE) !== null && _4 !== void 0 ? _4 : true,
    MULTIPLE_STATEMENTS: (_6 = (_5 = ENV.MULTIPLE_STATEMENTS) !== null && _5 !== void 0 ? _5 : ENV.TSPACE_MULTIPLE_STATEMENTS) !== null && _6 !== void 0 ? _6 : false
};
for (const [key, value] of Object.entries(env)) {
    if (value == null || key == null)
        continue;
    if (typeof value === 'string' && ['true', 'false'].some(v => value.toLowerCase() === v)) {
        env[key] = JSON.parse(value.toLowerCase());
        continue;
    }
    if (/^[0-9]+$/.test(value))
        env[key] = +value;
}
const loadOptionsEnvironment = () => {
    const environment = () => {
        var _a;
        const NODE_ENV = (_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV;
        const env = path_1.default.join(path_1.default.resolve(), '.env');
        if (NODE_ENV == null)
            return env;
        const envWithEnviroment = path_1.default.join(path_1.default.resolve(), `.env.${NODE_ENV}`);
        if (fs_1.default.existsSync(envWithEnviroment))
            return envWithEnviroment;
        return env;
    };
    const ENV = dotenv_1.default.config({ path: environment() }).parsed;
    const env = {
        host: (ENV === null || ENV === void 0 ? void 0 : ENV.DB_HOST) || (ENV === null || ENV === void 0 ? void 0 : ENV.TSPACE_HOST),
        port: (ENV === null || ENV === void 0 ? void 0 : ENV.DB_PORT) || (ENV === null || ENV === void 0 ? void 0 : ENV.TSPACE_PORT) || 3306,
        username: (ENV === null || ENV === void 0 ? void 0 : ENV.DB_USERNAME) || (ENV === null || ENV === void 0 ? void 0 : ENV.TSPACE_USERNAME),
        password: (ENV === null || ENV === void 0 ? void 0 : ENV.DB_PASSWORD) || (ENV === null || ENV === void 0 ? void 0 : ENV.TSPACE_PASSWORD) || '',
        database: (ENV === null || ENV === void 0 ? void 0 : ENV.DB_DATABASE) || (ENV === null || ENV === void 0 ? void 0 : ENV.TSPACE_DATABASE),
    };
    for (const [key, value] of Object.entries(env)) {
        if (value == null)
            continue;
        if (typeof value === 'string' && ['true', 'false'].some(v => value.toLowerCase() === v)) {
            env[key] = JSON.parse(value.toLowerCase());
            continue;
        }
        if (/^[0-9]+$/.test(value))
            env[key] = +value;
    }
    return Object.freeze(Object.assign({}, env));
};
exports.loadOptionsEnvironment = loadOptionsEnvironment;
exports.default = Object.freeze(Object.assign({}, env));
//# sourceMappingURL=options.js.map