import { DB } from '../../lib'

export default (cmd : { [x: string]: any }) => {
  const {
    dir,
    cwd,
    fs,
    env,
    db,
    push,
    generate
  } = cmd

    if(dir) {
        try {
            fs.accessSync(`${cwd}/${dir}`, fs.F_OK, {
                recursive: true
            })
        } catch (e) {
            fs.mkdirSync(`${cwd}/${dir}`, {
                recursive: true
            })
        }
    }

    if(push) {
        const filePath = `${cwd}/${dir}/migrations.sql`

        const sqlString = fs.readFileSync(filePath, 'utf8')

        const sqlStatements : string[] = sqlString.split(';')

        const pushMigration = async (sqlStatements : string[]) => {

            const createTables : { table : string , sql : string}[] = []
            const inserts : { table : string , sql : string}[] = []
        
            for (const sql of sqlStatements) {
                if (sql.trim() === '') continue
        
                const match = sql.match(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+`([^`]+)`/i);
                const createDatabase = match ? match[0] : null;
        
                if(createDatabase) {
                    const result = await new DB()
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
                .rawQuery(c.sql)
                .catch(e => console.log(`Failed to push changes errors: '${e.message}'`))
    
                if(result != null) {
                    console.log(`The table '${c.table}' has been created`)
                }
            }
    
            for(const c of inserts) {
                const result = await new DB()
                .rawQuery(c.sql)
                .catch(e => console.log(`Failed to push changes errors: '${e.message}'`))
    
                if(result != null) {
                    console.log(`The data inserted into the '${c.table}' table has been successful.`)
                }
            }
        }

        pushMigration(sqlStatements)
        .then(_ => console.log(`Migrations are migrating successfully`))
        .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
        .finally(() => process.exit(0))
    }

    if(generate) {
        const directory = `${cwd}/${dir}/migrations.sql`
        new DB()
        .loadEnv(env)
        .backupToFile({
            filePath : directory,
            database : db != null && db != '' ? db : 'db-name'
        })
        .then(_ => console.log(`Migrations are migrating successfully`))
        .catch(e => console.log(`Failed to migrate errors: '${e.message}'`))
        .finally(() => process.exit(0))
    }

    throw new Error("Do you want to generate or push changes ? use '--generate' or '--push")
   
}