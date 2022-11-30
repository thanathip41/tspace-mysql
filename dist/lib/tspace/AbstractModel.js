"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractModel = void 0;
const Database_1 = __importDefault(require("./Database"));
class AbstractModel extends Database_1.default {
}
exports.AbstractModel = AbstractModel;
exports.default = AbstractModel;
