import Table from './table'
export default (formCommand : { [x: string]: any}) => {
  const {
    file,
    type,
    cwd,
    dir,
    fs,
    npm
  } = formCommand;
  
  try {
    fs.accessSync(cwd + `/${file}`, fs.F_OK, {
      recursive: true
    });
  } catch (e) {
    fs.mkdirSync(cwd + `/${file}`, {
      recursive: true
    })
  }

  const folderMigrate = dir ?  `${cwd}/${dir}/create_${file}_table${type}` : `${cwd}/create_${file}_table${type}`
  const table = Table({ table : file , npm , type});
  fs.writeFile(folderMigrate, table, (err:any) => {
    if (err) console.log(err.message);
  });
  console.log(`Migration : ${file} created successfully`);
};