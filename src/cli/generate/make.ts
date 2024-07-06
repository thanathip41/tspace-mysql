import Model     from './model'
import ModelDecorator from './modelDecorator'
import pluralize from 'pluralize'
import { DB }    from '../../lib'

const snakeCaseToPascal = (data: string ) => {
    let str : string[] = data.split('_')
    for(let i=0; i <str.length;i++) { 
        str[i] = str[i].slice(0,1).toUpperCase() + str[i].slice(1,str[i].length) 
    }
    return str.join('')
}

const formatSchema = (data: string[]) => {
    const formattedCode : Record<string,any> = {}
    for (const field of data) {
        const [key, value] = field.split(":").map((item:string) => item.trim())
        formattedCode[key] = value
    }
    return formattedCode
}

export default (cmd : { [x: string]: any }) => {
    const {
      dir,
      cwd,
      type,
      fs,
      decorator,
      env,
      npm
    } = cmd

    if(dir == null) throw new Error("Cannot find directory please specify the directory : '--dir=${directory}'")
  
    try {
        fs.accessSync(`${cwd}/${dir}`, fs.F_OK, {
            recursive: true
        })
    } catch (e) {
        fs.mkdirSync(`${cwd}/${dir}`, {
            recursive: true
        })
    }

    if(decorator) {

        new DB()
        .loadEnv(env)
        .rawQuery('SHOW TABLES')
        .then(tables => {
        for(let i = 0; i < tables.length; i++) {
            const table : string = String(Object.values(tables[i])?.shift())
            const model = snakeCaseToPascal(pluralize.singular(table))
            new DB().loadEnv(env).rawQuery(`SHOW COLUMNS FROM \`${table}\``).then(raws => {

            let schema : any[] = []
            for(const raw of raws) {

                const schemaColumn = [
                    `@Column(() => `,
                    `new Blueprint().${/^[^()]*$/.test(raw.Type) 
                        ? raw.Type === raw.Type.includes('unsigned') 
                            ? 'int().unsigned()'
                            : `${raw.Type.toLocaleLowerCase()}()` 
                        : raw.Type.toLocaleLowerCase()
                    }`,
                    `${raw.Null === 'YES' ? '.null()' : '.notNull()'}`,
                    raw.Key === 'PRI' ? '.primary()' : raw.Key === 'UNI' ? '.unique()' : '',
                    raw.Default != null ? `.default('${raw.Default}')`  : '',
                    `${raw.Extra === 'auto_increment' ? '.autoIncrement()' : ''}`,
                    `)`
                ] .join('')

                const detectType = (type : string) => {
                    const t = type.toLowerCase()
                    const typeForNumber = ['INT','TINYINT','BIGINT','DOUBLE','FLOAT'].map(r => r.toLowerCase())
                    const typeForDate = ['DATE','DATETIME','TIMESTAMP'].map(r => r.toLowerCase())

                    if (typeForNumber.some(v => t.includes(v))) return 'number'
                    if (typeForDate.some(v => t.includes(v))) return 'Date'

                    return 'string'
                }

                const publicColumn =  `public ${raw.Field} !: ${detectType(raw.Type)}`

                schema.push({
                    schemaColumn,
                    publicColumn
                })
            }

            let str : string= ''

            for(const i in schema) {
                const s = schema[i]

                const isLast = +i === schema.length -1

                str += `    ${s.schemaColumn} \n`
                str += `    ${s.publicColumn} ${isLast ? '' : '\n\n' }`
            }

            const data = ModelDecorator(model,npm,str)

            fs.writeFile(`${cwd}/${dir}/${model}${type ?? '.ts'}`, data, (err:any) => {
                if (err) throw err
            })
            console.log(`Model : '${model}' created successfully`)
            }).catch(err => console.log(err))
        }
            console.log('\nGenerate Models has completed')
        })
        .catch(err => console.log(err))
        .finally(() => process.exit(0))

        return
    }
  
    new DB()
    .loadEnv(env)
    .rawQuery('SHOW TABLES')
    .then(tables => {
        for(let i = 0; i < tables.length; i++) {
            const table : string = String(Object.values(tables[i])?.shift())
            const model = snakeCaseToPascal(pluralize.singular(table))
            new DB().loadEnv(env).rawQuery(`SHOW COLUMNS FROM \`${table}\``).then(raws => {

            let schema : any[] = []
            for(const index in raws) {
                const raw = raws[index]
                const str = [
                    `${raw.Field} : `,
                    `new Blueprint().${/^[^()]*$/.test(raw.Type) 
                        ? raw.Type === raw.Type.includes('unsigned') 
                            ? 'int().unsigned()'
                            : `${raw.Type.toLocaleLowerCase()}()` 
                        : raw.Type.toLocaleLowerCase()
                    }`,
                    `${raw.Null === 'YES' ? '.null()' : '.notNull()'}`,
                    raw.Key === 'PRI' ? '.primary()' : raw.Key === 'UNI' ? '.unique()' : '',
                    raw.Default != null ? `.default('${raw.Default}')`  : '',
                    `${raw.Extra === 'auto_increment' ? '.autoIncrement()' : ''},`
                ].join('')

                const isLast = Number(index) + 1 === raws.length

                schema.push(isLast ? str.replace(/,\s*$/, "") : str)
            }

            const formattedSchema = formatSchema(schema);
        
            let str = "this.useSchema({\n"
            for(const formatKey in formattedSchema) {
            str += `          ${formatKey} : ${formattedSchema[formatKey]} \n`
            }
            str += "        })"

            const data = Model(model,npm,`${str}`)

            fs.writeFile(`${cwd}/${dir}/${model}${type ?? '.ts'}`, data, (err:any) => {
                if (err) throw err
            })
            console.log(`Model : '${model}' created successfully`)
        })
            .catch(err => console.log(err))
        }
        console.log('\nGenerate Models has completed')
    })
    .catch(err => console.log(err))
    .finally(() => process.exit(0))
}