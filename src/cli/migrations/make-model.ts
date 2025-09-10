import { DB, Model, Schema } from '../../lib'
import { execSync }  from 'child_process'
import { format } from 'sql-formatter'
import path from 'path'

export default (cmd : Record<string,any>) => {
    const {
      dir,
      cwd,
      fs,
      generate,
      push,
      models,
      env,
      filename
    } = cmd
  
    if(models == null) throw new Error("Cannot find directory to your models please specify the directory : '--models=src/app/models'")
    
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

    const migrations = async (pathFolders : string) => {

        const directories = fs.readdirSync(pathFolders, { withFileTypes: true })
            
        const files : any[] = (await Promise.all(directories.map((directory: { name: string; isDirectory: Function }) => {
            const newDir = path.resolve(String(pathFolders), directory.name)
            if(directory.isDirectory() && directory.name.toLocaleLowerCase().includes('migrations')) return null
            return directory.isDirectory() ? Schema.sync(newDir) : newDir
        })))
      
        let pathModels = [].concat(...files).filter(d => d != null || d === '')
      
        await new Promise(r => setTimeout(r, 1500))

        const isFileTs = pathModels.some(pathModel => /\.ts$/.test(pathModel) && !(/\.d\.ts$/.test(pathModel)))
        const outDirForBuildTs = '__tmp-migrations-ts__'

        if(isFileTs) {

            for(const pathModel of pathModels) {
                
                const command = `tsc "${pathModel}" --outDir ${outDirForBuildTs} --target es6 --esModuleInterop --module commonjs --allowJs`;

                try { execSync(command, { stdio: 'inherit' })} catch (error) {}
            }

            const directories = fs.readdirSync(outDirForBuildTs, { withFileTypes: true })
            
            const files : any[] = (await Promise.all(directories.map((directory: { name: string; isDirectory: Function }) => {
                const newDir = path.resolve(String(outDirForBuildTs), directory.name)
                if(directory.isDirectory() && directory.name.toLocaleLowerCase().includes('migrations')) return null
                return directory.isDirectory() ? Schema.sync(newDir) : newDir
            })))
          
            pathModels = [].concat(...files).filter(d => d != null || d === '')
        }
        
        const models = await Promise.all(pathModels.map((pathModel : string) => _import(pathModel)).filter(d => d != null))

        if(isFileTs) {
            const removeFolderRecursive = (folderPath : string) => {
                if (fs.existsSync(folderPath)) {
                    fs.readdirSync(folderPath).forEach((file: string) => {
                    const curPath = path.join(folderPath, file)
                        if (fs.lstatSync(curPath).isDirectory()) removeFolderRecursive(curPath) 
                        
                        fs.unlinkSync(curPath)
                    })

                    fs.rmdirSync(folderPath)
                }
            }
              
            removeFolderRecursive(outDirForBuildTs)
        }
      
        if(!models.length) return
      
        const createTableQueries : string[] = []
      
        const foreignKeyQueries : string[] = []
      
        for ( const model of models ) {
      
            if(model == null) continue
      
            const schemaModel = model.getSchemaModel()
      
            if(!schemaModel) continue
      
            const createTable = new Schema().createTable(model.database(),`\`${model.getTableName()}\``,schemaModel)
                
            createTableQueries.push(createTable)
      
            const foreignKey = _foreignKey({
                schemaModel,
                model
            })
      
            if(foreignKey == null) continue
      
            foreignKeyQueries.push(foreignKey)
        }
      
        let sql : string[] = [
          `${createTableQueries.map(c => {
            return format(c,{
              language: 'spark',
              tabWidth: 2,
              linesBetweenQueries: 1,
            }) + ";"
          }).join('\n\n')}\n`,
          `${foreignKeyQueries.map(f => `${f};`).join('\n')}`,
        ]
      
        fs.writeFileSync(`${cwd}/${dir}/migrations.sql` , sql.join('\n'))

        return 
    }

    const pushMigration = async (sqlStatements : string[]) => {

        const createTables : { table : string , sql : string}[] = []
        const inserts : { table : string , sql : string}[] = []
    
        for (const sql of sqlStatements) {
            if (sql.trim() === '') continue
    
            const match = sql.match(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+`([^`]+)`/i);
            const createDatabase = match ? match[0] : null;
    
            if(createDatabase) {
                const result = await new DB()
                .loadEnv(env)
                .rawQuery(createDatabase)
                .catch(e => console.log(`Failed to push changes errors: '${e.message}'`))

                if(result != null) {
                    console.log(`The database '${createDatabase}' has been created`)
                }

                continue
            }
    
            const createTableStatements = sql
            .split(';')
            .filter((statement : string) => statement.replace(/--.*\n/g, '').trim().startsWith('CREATE TABLE IF NOT EXISTS'))
            
            const inserttatements = sql
            .split(';')
            .filter((statement : string) => statement.replace(/--.*\n/g, '').trim().startsWith('INSERT INTO'));

            if(!createTableStatements.length && !inserttatements.length) continue
    
            if(createTableStatements.length) {
                const match = createTableStatements.join(' ').match(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+`[^`]+`\.`([^`]+)`/i);
                const table = match ? match[1] : null;
    
                createTables.push({
                    table : table == null ? '' : table,
                    sql : createTableStatements.join(' ')
                })
            }
            
            if(inserttatements.length) {
    
                const match = inserttatements.join(' ').match(/INSERT\s+INTO\s+`[^`]+`\.`([^`]+)`/i);
    
                const table= match ? match[1] : null;
    
                inserts.push({
                    table : table == null ? '' : table,
                    sql : inserttatements.join(' ')
                })
            }     
        }
    
        for(const c of createTables) {
            const result = await new DB()
            .loadEnv(env)
            .rawQuery(c.sql)
            .catch(e => console.log(`Failed to push changes errors: '${e.message}'`))

            if(result != null) {
                console.log(`The table '${c.table}' has been created`)
            }
        }

        for(const c of inserts) {
            const result = await new DB()
            .loadEnv(env)
            .rawQuery(c.sql)
            .catch(e => console.log(`Failed to push changes errors: '${e.message}'`))

            if(result != null) {
                console.log(`The data inserted into the '${c.table}' table has been successful.`)
            }
        }
    }
      
    const _import = async (pathModel : string) => {
        try {
      
            const loadModel = await import(pathModel)
            const model : Model = new loadModel.default()
      
            return model
      
        } catch (err) {
      
           console.log(`Check your 'Model' from path : '${pathModel}' is not instance of Model`)
           
           return null
          
        }
    }
      
    const _foreignKey = ({ schemaModel , model }: { schemaModel : Record<string,any> , model : Model}) => {
      
        for(const key in schemaModel) {
            if(schemaModel[key]?.foreignKey == null) continue
            const foreign = schemaModel[key].foreignKey
           
            if(foreign.on == null) continue
      
            const onReference = typeof foreign.on === "string"  ? foreign.on : new foreign.on
      
            const table = typeof onReference === "string" ? onReference : onReference.getTableName()
      
            const constraintName = `\`${model.getTableName()}(${key})_${table}(${foreign.references})\``
            const sql = [
                "ALTER TABLE",
                `\`${model.getTableName()}\``,
                'ADD CONSTRAINT',
                `${constraintName}`,
                `FOREIGN KEY(\`${key}\`)`,
                `REFERENCES \`${table}\`(\`${foreign.references}\`)`,
                `ON DELETE ${foreign.onDelete} ON UPDATE ${foreign.onUpdate}`
            ].join(' ')
      
           return sql
        }
    }

    if(push == null && generate == null) {
        throw new Error("Do you want to generate or push changes ? use '--generate' or '--push")
    }

    if(push) {
        const filePath = `${cwd}/${dir}/${filename ?? 'migrations.sql' }`

        const sqlString = fs.readFileSync(filePath, 'utf8')

        const sqlStatements : string[] = sqlString.split(';')

        pushMigration(sqlStatements)
        .then(_ => console.log(`Migrations are migrating successfully`))
        .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
        .finally(() => process.exit(0))

        return
    }

    if(generate) {

        migrations(`${cwd}/${models}`)
        .then(_ => console.log(`Migrations are migrating successfully`))
        .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
        .finally(() => process.exit(0))

        return
    }
}