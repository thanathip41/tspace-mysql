"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = ({ model, npm, type }) => {
    switch (type.replace(/./, '').toLocaleLowerCase()) {
        case 'js': {
            return `const { Model } = require('${npm}');

class ${model} extends Model {
  constructor(){
    super()
    /**
     * 
     * //Assign setting global in your model
     * @useMethod
     *
     * this.useDebug() 
     * this.usePrimaryKey('id')
     * this.useTimestamp({
     *    createdAt : 'created_at',
     *    updatedAt : 'updated_at'
     * }) // runing a timestamp when insert or update
    */
  }
}

module.exports = ${model};
module.exports = { ${model} };
`;
        }
        case 'ts': {
            return `import { Model } from '${npm}';

class ${model} extends Model {
  constructor(){
    super()
    /**
     * 
     * //Assign setting global in your model
     * @useMethod
     *
     * this.useDebug() 
     * this.usePrimaryKey('id')
     * this.useTimestamp({
     *    createdAt : 'created_at',
     *    updatedAt : 'updated_at'
     * }) // runing a timestamp when insert or update
    */
  }
}

export { ${model} }
export default ${model}
`;
        }
    }
};
exports.default = Model;
//# sourceMappingURL=model.js.map