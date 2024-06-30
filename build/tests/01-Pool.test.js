"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const lib_1 = require("../lib");
(0, mocha_1.describe)('Testing Pool', function () {
    /* ##################################################### */
    (0, mocha_1.it)('Pool: It is connected?', function () {
        return __awaiter(this, void 0, void 0, function* () {
            (0, chai_1.expect)(lib_1.Pool).to.have.an('object');
            (0, chai_1.expect)(lib_1.Pool).to.have.property('query');
            (0, chai_1.expect)(lib_1.Pool).to.have.property('connection');
            (0, chai_1.expect)(lib_1.Pool.connection).to.be.a('function');
            (0, chai_1.expect)(lib_1.Pool.query).to.be.a('function');
            const query = yield lib_1.Pool.query('SELECT 1 as ping');
            (0, chai_1.expect)(query).to.be.an('array');
            (0, chai_1.expect)(query.length).to.be.equal(1);
            (0, chai_1.expect)(query[0].ping).to.be.equal(1);
            const connect = yield lib_1.Pool.connection();
            (0, chai_1.expect)(connect).to.be.an('object');
            (0, chai_1.expect)(connect).to.have.property('query');
            (0, chai_1.expect)(connect).to.have.property('startTransaction');
            (0, chai_1.expect)(connect).to.have.property('commit');
            (0, chai_1.expect)(connect).to.have.property('rollback');
            (0, chai_1.expect)(connect.startTransaction).to.be.a('function');
            (0, chai_1.expect)(connect.commit).to.be.a('function');
            (0, chai_1.expect)(connect.rollback).to.be.a('function');
            (0, chai_1.expect)(connect.query).to.be.an('function');
            const connectQuery = yield connect.query('SELECT 1 as ping');
            (0, chai_1.expect)(connectQuery).to.be.an('array');
            (0, chai_1.expect)(connectQuery[0].ping).to.be.equal(1);
        });
    });
    /* ###################################################### */
});
//# sourceMappingURL=01-Pool.test.js.map