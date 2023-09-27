"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.default = (commandInput) => {
    var _a, _b, _c;
    const { type, dir, cwd, fs } = commandInput;
    try {
        if (dir == null)
            throw new Error('Not found directory');
        const path = `${cwd}/${dir}`;
        const files = (_a = fs.readdirSync(path)) !== null && _a !== void 0 ? _a : [];
        if (!(files === null || files === void 0 ? void 0 : files.length))
            console.log('this folder is empty');
        const cmd = type === '.js' ? 'node' : 'ts-node';
        for (const _file of files) {
            const run = (0, child_process_1.exec)(`${cmd} ${path}/${_file}`);
            (_b = run === null || run === void 0 ? void 0 : run.stdout) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
                if (data)
                    console.log(data);
            });
            (_c = run === null || run === void 0 ? void 0 : run.stderr) === null || _c === void 0 ? void 0 : _c.on('data', (err) => {
                if (err)
                    console.error(err);
            });
        }
    }
    catch (err) {
        console.log(err.message);
    }
};
