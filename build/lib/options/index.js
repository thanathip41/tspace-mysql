"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
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
    HOST: (_a = ENV.DB_HOST) !== null && _a !== void 0 ? _a : 'localhost',
    PORT: (_b = ENV.DB_PORT) !== null && _b !== void 0 ? _b : 3306,
    USERNAME: (_c = ENV.DB_USERNAME) !== null && _c !== void 0 ? _c : ENV.DB_USER,
    PASSWORD: (_d = ENV.DB_PASSWORD) !== null && _d !== void 0 ? _d : '',
    DATABASE: ENV.DB_DATABASE,
    CONNECTION_LIMIT: (_e = ENV.DB_CONNECTION_LIMIT) !== null && _e !== void 0 ? _e : 151,
    QUEUE_LIMIT: (_f = ENV.DB_QUEUE_LIMIT) !== null && _f !== void 0 ? _f : 0,
    TIMEOUT: (_g = ENV.DB_TIMEOUT) !== null && _g !== void 0 ? _g : 1000 * 90,
    CHARSET: (_h = ENV.DB_CHARSET) !== null && _h !== void 0 ? _h : 'utf8mb4',
    CONNECTION_ERROR: (_j = ENV.DB_CONNECTION_ERROR) !== null && _j !== void 0 ? _j : false,
    CONNECTION_SUCCESS: (_k = ENV.DB_CONNECTION_SUCCESS) !== null && _k !== void 0 ? _k : false,
    WAIT_FOR_CONNECTIONS: (_l = ENV.DB_WAIT_FOR_CONNECTIONS) !== null && _l !== void 0 ? _l : true,
    DATE_STRINGS: (_m = ENV.DB_DATE_STRINGS) !== null && _m !== void 0 ? _m : false,
    KEEP_ALIVE_DELAY: (_o = ENV.DB_KEEP_ALIVE_DELAY) !== null && _o !== void 0 ? _o : 0,
    ENABLE_KEEP_ALIVE: (_p = ENV.DB_ENABLE_KEEP_ALIVE) !== null && _p !== void 0 ? _p : true,
    MULTIPLE_STATEMENTS: (_q = ENV.DB_MULTIPLE_STATEMENTS) !== null && _q !== void 0 ? _q : false,
    CACHE: ENV.DB_CACHE,
    REDIS_URL: ENV.DB_REDIS_URL
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
//# sourceMappingURL=index.js.map