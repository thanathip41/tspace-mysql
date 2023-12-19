"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Model = (model, npm, schema) => {
    return `import { Model , Blueprint } from '${npm}'
class ${model} extends Model {
  constructor(){
    super()
    /**
     * 
     * @Configuration registry in your model
     *
     * this.useDebug() 
     * this.useTimestamp({
     *    createdAt : 'created_at',
     *    updatedAt : 'updated_at'
     * }) // runing a timestamp when insert or update
     * this.useSoftDelete('deletedAt') // => default target to column deleted_at 
     * this.usePattern('snake_case') // => default 'snake_case'   
     * this.useUUID('uuid') // => runing a uuid (universally unique identifier) when insert new data
     * this.useRegistry() // => build-in functions registry
     * this.useLoadRelationsInRegistry() // => auto generated results from relationship to results
     * this.useBuiltInRelationFunctions() // => build-in functions relationships to results
     */

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
