const Model = (model: string, npm: string, schema : string) => {
return `import { Model , Blueprint , Column } from '${npm}'

class ${model} extends Model {

${schema}
}
export { ${model} }
export default ${model}
`
}

export default Model