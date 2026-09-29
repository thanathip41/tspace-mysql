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

    const directory = `${cwd}/${dir}/dump_${+new Date()}.sql`
    new DB()
    .loadEnv(env)
    .dump({
        filePath : directory,
        database : database,
        value    : Boolean(values === true || values === 'true')
    })
    .then(r =>  console.log(`dump database file successfully`))
    .catch(err => console.log(err))
    .finally(() => process.exit(0))
}