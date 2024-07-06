import { DB } from '../../lib'

export default (cmd : { [x: string]: any }) => {
  const {
    dir,
    cwd,
    fs,
    values,
    env,
    sql
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

    if(sql == null || sql === '') {
        console.log(`Example tspace-mysql dump:db "table" --dir=app/table`)
        process.exit(0)
    }

    if(!values) {
        const directory = `${cwd}/${dir}/dump-schema_${+new Date()}.sql`
        new DB().loadEnv(env).backupSchemaToFile({
            filePath : directory,
            database : sql
        })
        .then(r => console.log(`dump schema database "${sql}" file successfully`))
        .catch(err => console.log(err))
        .finally(() => process.exit(0))
    }
     
    const directory = `${cwd}/${dir}/dump_${+new Date()}.sql`
    new DB().loadEnv(env)
    .backupToFile({
        filePath : directory,
        database : sql
    })
    .then(r =>  console.log(`dump database "${sql}" file successfully`))
    .catch(err => console.log(err))
    .finally(() => process.exit(0))
}