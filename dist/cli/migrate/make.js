"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
exports.default = (formCommand) => {
    const { type, dir, cwd, fs } = formCommand;
    try {
        if (dir == null)
            throw new Error('Not found directory');
        const path = `${cwd}/${dir}`;
        const files = fs.readdirSync(path) ?? [];
        if (!files?.length)
            console.log('this folder is empty');
        const cmd = type === '.js' ? 'node' : 'ts-node';
        for (const _file of files) {
            const run = (0, child_process_1.exec)(`${cmd} ${path}/${_file}`);
            run?.stdout?.on('data', (data) => {
                if (data)
                    console.log(data);
            });
            run?.stderr?.on('data', (err) => {
                if (err)
                    console.error(err);
            });
        }
    }
    catch (err) {
        console.log(err.message);
    }
};
