import { exec } from 'child_process'
export default (cmd : { [x: string]: any }) => {
  const {
    type,
    dir,
    cwd,
    fs
  } = cmd

  try {

    if(dir == null) throw new Error('Not found directory')

    const path = `${cwd}/${dir}`
    const files  = fs.readdirSync(path) ?? []
    if(!files?.length) console.log('this folder is empty')
    const cmd = type === '.js' ? 'node' : 'ts-node'

    for(const _file of files) {
      const run = exec(`${cmd} ${path}/${_file}`);
  
      run?.stdout?.on('data', (data)=>{
        if(data) console.log(data); 
      });
  
      run?.stderr?.on('data', (err)=>{
        if(err) console.error(err);
      });
    }

   }catch(err:any) {
    console.log(err.message)
  }
}