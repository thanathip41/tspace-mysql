import { LoggerHandler } from "./Logger"

const proxyHandler = {
  set : (self: any, name : string, value : any) => {
    
      if (self.$setters?.includes(name)) throw new Error(`No allow to set this : ${name}`)
    
      self.$attributes = {
          ...self.$attributes,
          [name] : value
      }
      
      return true
  },
  get: (self: { [x: string]: any; $db: { get: (arg: string) => string }; $logger: { get: () => any } } , prop: string , value: unknown) => {
    
    try {
      new LoggerHandler(self , prop)
      
      switch(prop) {
        case 'tableName'  : return self.$db?.get('TABLE_NAME')?.replace(/`/g,'')
        case 'attributes' : return self[`$${prop}`];
        case 'logger'     : return self.$logger?.get();
        case 'result'     : return self.$db?.get('RESULT');
        default           : return Reflect.get(self, prop ,value);
      }
    } catch (e : any) {
      throw new Error(e?.message)
    }
  }
}

export { proxyHandler }
export default proxyHandler