"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = __importDefault(require("./model"));
const pluralize_1 = __importDefault(require("pluralize"));
const lib_1 = require("../../lib");
exports.default = (cmd) => {
    const { dir, cwd, type, fs, env, npm } = cmd;
    if (dir) {
        try {
            fs.accessSync(`${cwd}/${dir}`, fs.F_OK, {
                recursive: true
            });
        }
        catch (e) {
            fs.mkdirSync(`${cwd}/${dir}`, {
                recursive: true
            });
        }
    }
    const snakeCaseToPascal = (data) => {
        let str = data.split('_');
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].slice(0, 1).toUpperCase() + str[i].slice(1, str[i].length);
        }
        return str.join('');
    };
    const formatSchema = (data) => {
        const formattedCode = {};
        for (const field of data) {
            const [key, value] = field.split(":").map((item) => item.trim());
            formattedCode[key] = value;
        }
        return formattedCode;
    };
    new lib_1.DB()
        .loadEnv(env)
        .rawQuery('SHOW TABLES')
        .then(tables => {
        var _a;
        for (let i = 0; i < tables.length; i++) {
            const table = String((_a = Object.values(tables[i])) === null || _a === void 0 ? void 0 : _a.shift());
            const model = snakeCaseToPascal(pluralize_1.default.singular(table));
            new lib_1.DB().loadEnv(env).rawQuery(`SHOW COLUMNS FROM \`${table}\``).then(raws => {
                let schema = [];
                for (const index in raws) {
                    const raw = raws[index];
                    const str = [
                        `${raw.Field} : `,
                        `new Blueprint().${/^[^()]*$/.test(raw.Type)
                            ? raw.Type === 'int unsigned'
                                ? 'int().unsigned()'
                                : `${raw.Type.toLocaleLowerCase()}()`
                            : raw.Type.toLocaleLowerCase()}`,
                        `${raw.Null === 'YES' ? '.null()' : '.notNull()'}`,
                        raw.Key === 'PRI' ? '.primary()' : raw.Key === 'UNI' ? '.unique()' : '',
                        raw.Default != null ? `.default('${raw.Default}')` : '',
                        `${raw.Extra === 'auto_increment' ? '.autoIncrement()' : ''},`
                    ].join('');
                    const isLast = Number(index) + 1 === raws.length;
                    schema.push(isLast ? str.replace(/,\s*$/, "") : str);
                }
                const formattedSchema = formatSchema(schema);
                let str = "this.useSchema({\n";
                for (const formatKey in formattedSchema) {
                    str += `        ${formatKey} : ${formattedSchema[formatKey]} \n`;
                }
                str += "      })";
                const data = (0, model_1.default)(model, npm, `${str}`);
                fs.writeFile(`${cwd}/${dir}/${model}${type !== null && type !== void 0 ? type : '.ts'}`, data, (err) => {
                    if (err)
                        throw err;
                });
                console.log(`Model : '${model}' created successfully`);
            })
                .catch(err => console.log(err));
        }
        console.log('\nGenerate Models has completed');
    })
        .catch(err => console.log(err));
};
