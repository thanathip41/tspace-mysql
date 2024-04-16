"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
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
    HOST: ENV.DB_HOST || ENV.TSPACE_HOST || 'localhost',
    PORT: ENV.DB_PORT || ENV.TSPACE_PORT || 3306,
    USERNAME: ENV.DB_USERNAME || ENV.TSPACE_USERNAME || ENV.DB_USER,
    PASSWORD: ENV.DB_PASSWORD || ENV.TSPACE_PASSWORD || '',
    DATABASE: ENV.DB_DATABASE || ENV.TSPACE_DATABASE,
    CONNECTION_LIMIT: ENV.DB_CONNECTION_LIMIT || ENV.TSPACE_CONNECTION_LIMIT || 30,
    QUEUE_LIMIT: ENV.DB_QUEUE_LIMIT || ENV.TSPACE_QUEUE_LIMIT || 0,
    TIMEOUT: ENV.DB_TIMEOUT || ENV.TSPACE_TIMEOUT || 1000 * 60,
    CHARSET: ENV.DB_CHARSET || ENV.TSPACE_CHARSET || 'utf8mb4',
    CONNECTION_ERROR: ENV.DB_CONNECTION_ERROR || ENV.TSPACE_CONNECTION_ERROR || false,
    WAIT_FOR_CONNECTIONS: ENV.DB_WAIT_FOR_CONNECTIONS || ENV.TSPACE_WAIT_FOR_CONNECTIONS || true,
    DATE_STRINGS: ENV.DB_DATE_STRINGS || ENV.TSPACE_DATE_STRINGS || false,
    KEEP_ALIVE_DELAY: ENV.DB_KEEP_ALIVE_DELAY || ENV.TSPACE_KEEP_ALIVE_DELAY || 0,
    ENABLE_KEEP_ALIVE: ENV.DB_ENABLE_KEEP_ALIVE || ENV.TSPACE_ENABLE_KEEP_ALIVE || false,
    MULTIPLE_STATEMENTS: ENV.MULTIPLE_STATEMENTS || ENV.TSPACE_MULTIPLE_STATEMENTS || false
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