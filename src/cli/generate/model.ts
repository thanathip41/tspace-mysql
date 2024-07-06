const Model = (model: string, npm: string, schema : string) => {
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
`
}

export default Model