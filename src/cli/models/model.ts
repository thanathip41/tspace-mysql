const Model = ({ model , npm , type } : { model: string, npm: string , type : string }) => {

  switch (type.replace(/./,'').toLocaleLowerCase()) {

    case 'js' : {
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
`
    }

    case 'ts' : {
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
`
    }
  }
}

export default Model