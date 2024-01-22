"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = (model, npm, schema, table) => {
    return `import { Model , Blueprint , Column, Table } from '${npm}'

@Table('${table}')
class ${model} extends Model {

${schema}
}
export { ${model} }
export default ${model}
`;
};
exports.default = Model;
