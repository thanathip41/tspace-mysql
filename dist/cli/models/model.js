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
     * this.useDebug() 
     * this.usePrimaryKey('id')
     * this.useTimestamp({
     *    createdAt : 'created_at',
     *    updatedAt : 'updated_at'
     * }) // runing a timestamp when insert or update
     * this.useSoftDelete()
     * this.useTable('users')
     * this.useTableSingular() // 'user'
     * this.useTablePlural() // 'users'
     * this.usePattern('snake_case') // by defalut snake_case
     * this.useUUID('uuid') // => runing a uuid (universally unique identifier) when insert new data
     * this.useRegistry()
     * this.useSchema({
     *   id : Number,
     *   username : String
     *   created_at : Date,
     *   updated_at : Date,
     *  }) // validate type of schema when return result
    */
  }
}
export { ${model} }
export default ${model}
`;
};
exports.default = Model;
