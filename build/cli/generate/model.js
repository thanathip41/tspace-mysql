"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = (model, npm, schema) => {
    return `import { Model , Blueprint } from '${npm}'
class ${model} extends Model {
  constructor(){
    super()
    /**
     * 
     * @Schema table
     *  
     */
    ${schema}
  }
}
export { ${model} }
export default ${model}
`;
};
exports.default = Model;
//# sourceMappingURL=model.js.map