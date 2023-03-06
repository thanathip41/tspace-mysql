"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const environment = () => {
    var _a;
    const NODE_ENV = (_a = process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV;
    const env = path_1.default.join(path_1.default.resolve(), '.env');
    const envWithEnviroment = path_1.default.join(path_1.default.resolve(), `.env.${NODE_ENV}`);
    if (NODE_ENV == null)
        return env;
    if (fs_1.default.existsSync(envWithEnviroment))
        return envWithEnviroment;
    return env;
};
dotenv_1.default.config({ path: environment() });
const env = {
    HOST: process.env.DB_HOST || process.env.TSPACE_HOST,
    PORT: process.env.DB_PORT || process.env.TSPACE_PORT || 3306,
    USERNAME: process.env.DB_USERNAME || process.env.TSPACE_USERNAME,
    PASSWORD: process.env.DB_PASSWORD || process.env.TSPACE_PASSWORD || '',
    DATABASE: process.env.DB_DATABASE || process.env.TSPACE_DATABASE,
    CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT || process.env.TSPACE_CONNECTION_LIMIT || 151,
    QUEUE_LIMIT: process.env.DB_QUEUE_LIMIT || process.env.TSPACE_QUEUE_LIMIT || 25,
    TIMEOUT: process.env.DB_TIMEOUT || process.env.TSPACE_TIMEOUT || 1000 * 30,
    CHARSET: process.env.DB_CHARSET || process.env.TSPACE_CHARSET || 'utf8mb4',
    CONNECTION_ERROR: process.env.DB_CONNECTION_ERROR || process.env.TSPACE_CONNECTION_ERROR || true,
    WAIT_FOR_CONNECTIONS: process.env.DB_WAIT_FOR_CONNECTIONS || process.env.TSPACE_WAIT_FOR_CONNECTIONS || true,
    DATE_STRINGS: process.env.DB_DATE_STRINGS || process.env.TSPACE_DATE_STRINGS || true
};
for (const [key, value] of Object.entries(env)) {
    if (value == null)
        continue;
    if (typeof value === 'string' && ['true', 'false'].some(v => value.toLowerCase() === v)) {
        env[key] = JSON.parse(value.toLowerCase());
    }
}
exports.default = Object.freeze(Object.assign({}, env));
