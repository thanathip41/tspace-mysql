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
const perf_hooks_1 = require("perf_hooks");
const lib_1 = require("../lib");
const pattern = 'camelCase';
class User extends lib_1.Model {
    constructor() {
        super();
        this.usePattern(pattern);
        this.useUUID();
        this.useTimestamp();
        this.useSoftDelete();
        this.hasMany({ model: Post, name: 'posts' });
        this.hasOne({ model: Post, name: 'post' });
    }
}
class Post extends lib_1.Model {
    constructor() {
        super();
        this.usePattern(pattern);
        this.useUUID();
        this.useTimestamp();
        this.useSoftDelete();
        this.belongsTo({ name: 'user', model: User });
    }
}
function benchmark(func, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const start = perf_hooks_1.performance.now();
        yield func(...args);
        const end = perf_hooks_1.performance.now();
        return end - start;
    });
}
function averageBenchmark(func, runs, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const benchmarks = [];
        for (let i = 0; i < runs; i++) {
            benchmarks.push(() => benchmark(func, ...args));
        }
        const results = yield Promise.all(benchmarks.map(v => v()));
        const total = results.reduce((acc, time) => acc + time, 0);
        return total / runs;
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const results = yield new User().with('posts').limit(10000).get();
        return results;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const avgTime = yield averageBenchmark(run, 10);
    console.log(`Average execution time : ${avgTime.toFixed(0)} ms`);
}))();
//# sourceMappingURL=benchmark.test.js.map