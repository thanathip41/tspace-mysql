const Model = (model: string, npm: string, schema : string) => {
return `import { Model , Blueprint , TSchema , TRelation } from '${npm}'

const schema = ${schema}

type TS = TSchema<typeof schema>

type TR = TRelation<{
  // ... name your relationship
}>

class ${model} extends Model<TS,TR> {
  constructor(){
    super()
    /**
     * 
     * @Schema table
     *  
     */
    this.useSchema(schema)
  }
}

export { ${model} }
export default ${model}
`
}

export default Model