"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const environment = () => {
    const NODE_ENV = process.env?.NODE_ENV;
    const envWithoutEnviroment = path_1.default.join(path_1.default.resolve(), '.env');
    const envWithEnviroment = path_1.default.join(path_1.default.resolve(), `.env.${NODE_ENV}`);
    if (NODE_ENV == null)
        return envWithoutEnviroment;
    if (fs_1.default.existsSync(envWithEnviroment))
        return envWithEnviroment;
    return envWithoutEnviroment;
};
dotenv_1.default.config({ path: environment() });
const env = Object.freeze({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT,
    DB_DATE_STRING: process.env.DB_DATE_STRING,
    DB_TIMEOUT: process.env.DB_TIMEOUT,
    DB_QUEUE_LIMIT: process.env.DB_QUEUE_LIMIT
});
exports.env = env;
exports.default = env;
