"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDB = void 0;
const Database_1 = __importDefault(require("./Database"));
class AbstractDB extends Database_1.default {
}
exports.AbstractDB = AbstractDB;
exports.default = AbstractDB;
