const Model = (model: string, npm: string, schema : string) => {
return `import { Model , Blueprint , type T } from '${npm}'

const schema = ${schema}

type TS = T.Schema<typeof schema>

type TR = T.Relation<{
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