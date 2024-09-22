import Model  from './model'
import Table from '../tables/table'
import pluralize from 'pluralize'

export default (cmd : { [x: string]: any }) => {
  const {
    file,
    migrate,
    dir,
    type,
    cwd,
    fs,
    npm
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

  const model = dir ?  `${cwd}/${dir}/${file}${type}` : `${cwd}/${file}${type}`
  const data = Model({ model : file , npm , type });
  fs.writeFile(model, data, (err:any) => {
    if (err) throw err.message;
  });

  console.log(`Model : '${file}' created successfully`);

  if(migrate) {
    const tableName =  pluralize(file.replace(/([A-Z])/g, ( str:string ) => '_' + str.toLowerCase()).slice(1))
    
    const folder = dir ? `${dir}/Migrations` : `/Migrations`
  
    try {
      fs.accessSync(cwd + folder, fs.F_OK, {
        recursive: true
      });
    } catch (e) {
      fs.mkdirSync(cwd + folder, {
        recursive: true
      });
    }

    const folderMigrate =  `${cwd}/${folder}/create_${tableName}_table${type}`;
    const table = Table({ table : tableName , npm , type });
    fs.writeFile(folderMigrate, table, (err:any) => {
      if (err) throw err;
      console.log(`Migration : '${tableName}' created successfully`)
      process.exit(0);
    });
    
  }
}