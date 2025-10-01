import { Model }    from '../../lib'

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

    new Model()
    .buildModelTemplate({ decorator, env })
    .then(templates => {
        for(const t of templates) {
            fs.writeFileSync(`${cwd}/${dir}/${t.model}${type ?? '.ts'}`, t.template)
            console.log(`Model : '${t.model}' created successfully`)
        }
        console.log('\nGenerate Models has completed')
    })
    .catch(err => console.log(err))
    .finally(() => process.exit(0))
}