"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = (model, npm) => {
    return `import { Model } from '${npm}'
class ${model} extends Model {
  constructor(){
    super()
    /**
     * 
     * Assign setting global in your model
     * @useMethod
     *
     * this.useDebug() // => runing a uuid (universally unique identifier) when insert new data
     * this.usePrimaryKey('id') // => runing a uuid (universally unique identifier) when insert new data
     * this.useTimestamp({ createdAt : 'created_at' , updatedAt : 'updated_at' }) // runing a timestamp when insert or update
     * this.useSoftDelete()
     * this.useDisableSoftDeleteInRelations()
     * this.useTable('Users')
     * this.useTableSingular()
     * this.useTablePlural()
     * this.usePattern('snake_case')   
     * this.useUUID('uuid')
     * this.useRegistry()
    */
  }
}
export { ${model} }
export default ${model}
`;
};
exports.default = Model;
