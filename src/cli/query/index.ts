import { DB } from '../../lib'
export default (cmd : { [x: string]: any}) => {
  const { sql , env } = cmd
  new DB().loadEnv(env).rawQuery(sql?.replace(/`/g,''))
  .then(result => console.log(result))
  .catch(err => console.log(err))
  .finally(() => process.exit(0))
}