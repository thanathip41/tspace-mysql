import { DB } from '../../lib'

export default (cmd : { [x: string]: any }) => {
  let {
    dir,
    cwd,
    fs,
    values,
    env
  } = cmd

    const database = `dump-${+new Date()}`

    if(dir == null) dir = 'dump'
    try {
        fs.accessSync(`${cwd}/${dir}`, fs.F_OK, {
            recursive: true
        })
    } catch (e) {
        fs.mkdirSync(`${cwd}/${dir}`, {
            recursive: true
        })
    }

    if(database == null || database === '') {
        console.log(`Example tspace-mysql dump:db "table" --dir=app/table`)
        process.exit(0)
    }

    if(!values) {
        const directory = `${cwd}/${dir}/dump-schema_${+new Date()}.sql`
        new DB().loadEnv(env).backupSchemaToFile({
            filePath : directory,
            database : database
        })
        .then(r => console.log(`dump database file successfully`))
        .catch(err => console.log(err))
        .finally(() => process.exit(0))
        
        return
    }
     
    const directory = `${cwd}/${dir}/dump_${+new Date()}.sql`
    new DB().loadEnv(env)
    .backupToFile({
        filePath : directory,
        database : database
    })
    .then(r =>  console.log(`dump database file successfully`))
    .catch(err => console.log(err))
    .finally(() => process.exit(0))
}