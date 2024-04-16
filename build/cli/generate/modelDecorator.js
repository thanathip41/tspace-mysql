"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = (model, npm, schema) => {
    return `import { Model , Blueprint , Column } from '${npm}'

class ${model} extends Model {

${schema}
}
export { ${model} }
export default ${model}
`;
};
exports.default = Model;
//# sourceMappingURL=modelDecorator.js.map