import { Blueprint } from ".."
import { CONSTANTS } from "../constants"

const typeOf = (data:any) => Object.prototype.toString.apply(data).slice(8, -1).toLocaleLowerCase() 

const isDate = (data:any) => {
    if(typeOf(data) === 'date') return true
    return false
}

const timestamp = (dateString ?: string | Date) => {
    const d         = dateString == null ? new Date() : new Date(dateString)
    const year      = d.getFullYear()
    const month     = `0${(d.getMonth() + 1)}`.slice(-2)   
    const date      = `0${(d.getDate())}`.slice(-2)
    const hours     = `0${(d.getHours())}`.slice(-2)
    const minutes   = `0${(d.getMinutes())}`.slice(-2)
    const seconds   = `0${(d.getSeconds())}`.slice(-2)

    const ymd = `${[
        year,
        month,
        date
    ].join('-')}`

    const his = `${[
        hours,
        minutes,
        seconds
    ].join(':')}`
        
    return `${ymd} ${his}`
}

const date = (value ?: Date) => {
    const d     = value == null ? new Date() : new Date(value)
    const year  = d.getFullYear() ;
    const month = `0${(d.getMonth() + 1)}`.slice(-2)   
    const date  = `0${(d.getDate())}`.slice(-2)
    const now   = `${year}-${month}-${date}`
        
    return now
}

const escape = (v : any , hard = false) => {
    if(typeof v !== 'string') {
        if (Number.isNaN(v)) return 'NaN';
        if (v === Infinity)  return 'Infinity';
        if (v === -Infinity) return '-Infinity';
        return v;
    }
    if(v.includes('$RAW:') && !hard) return v
    return v.replace(/[\0\b\t\n\r\x1a\'\\]/g,"\\'")
}

const escapeActions = (v : any) => {
    if(typeof v !== 'string') {
        if (Number.isNaN(v)) return 'NaN';
        if (v === Infinity)  return 'Infinity';
        if (v === -Infinity) return '-Infinity';
        return v;
    }
    if(v.includes('$RAW:')) return v
    return v.replace(/[\0\b\r\x1a\'\\]/g,"''")
}

const escapeXSS = (str : any) => {
    if(typeof str !== 'string') return str
    return str
    .replace(/[;\\]/gi,'')
    .replace(/on\w+="[^"]+"/gi, '')
    .replace(/\s+(onerror|onload)\s*=/gi, '')
    .replace(/\s+alert*/gi, '')
    .replace(/\([^)]*\) *=>/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}


const columnRelation = (name :string) => {
    const matches : string[] = name?.match(/[A-Z]/g) ?? []

    if(matches.length < 1) return `${name.toLocaleLowerCase()}`

    return name.replace(matches[0] , `_${matches[0].toUpperCase()}`)

}

const generateUUID = () => {
    const date = +new Date()

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16
        r = (date + r)% 16 | 0
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    })
}

const covertBooleanToNumber = (data : any) => {
    if(typeOf(data) === 'boolean') return Number(data)
    return data
}

const covertDateToDateString = (data : any) => {

    const isDate = (d: unknown) => {
        return typeOf(d) === 'date'
    };

    const isISODateString = (s: unknown): boolean => {
        if (typeof s !== 'string') return false;
        const isoRegex = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

        return isoRegex.test(s) && !isNaN(Date.parse(s.replace(' ', 'T')));
    };

    if (isDate(data)) {
        return timestamp(data);
    }

    if (isISODateString(data)) {
        return timestamp(new Date(data));
    }

    if (typeOf(data) === 'object' && data !== null) {
        for (const key in data) {
            const d = data[key];
            
            if (isDate(d)) {
                data[key] = timestamp(d);
                continue
            } 
            
            if (isISODateString(d)) {
                data[key] = timestamp(new Date(d));
            }
        }
    }
    
    return data
}

const snakeCase = (data : any) => {
    try { 

        if (typeof(data) !== "object") return data

        if(typeof data === 'string') {
            return String(data).replace(/([A-Z])/g, (str : string) => `_${str.toLocaleLowerCase()}`)
        }

        Object.entries(data).forEach(([oldName, _]) => {

            const newName = oldName.replace(/([A-Z])/g, (str) => `_${str.toLocaleLowerCase()}`)
    
            if (newName !== oldName) {
                if (data.hasOwnProperty(oldName)) {
                    data = { ...data, 
                        [newName] : data[oldName] 
                    }
                    delete data[oldName]
                }
            }

            if (typeof(data[newName]) === "object" && !(data[newName] instanceof Blueprint)) {

                data[newName] = snakeCase(data[newName])
            }
        })

        return data

    } catch (e) {
        return data
    }
}

const camelCase = (data : any) => {
    try { 

        if (typeof(data) !== "object") {
            return data
        }

        if(typeof data === 'string') {
            return String(data).replace(/(.(_|-|\s)+.)/g, (str : string) => str[0] + (str[str.length-1].toUpperCase()))
        }

        Object.entries(data).forEach(([oldName]) => {

            const newName = oldName.replace(/(.(_|-|\s)+.)/g, (str) => str[0] + (str[str.length-1].toUpperCase()))
    
            if (newName !== oldName) {
                if (data.hasOwnProperty(oldName)) {
                    data = { ...data, 
                        [newName] : data[oldName] 
                    }
                    delete data[oldName]
                }
            }

            if (typeof(data[newName]) === "object" && !(data[newName] instanceof Blueprint)) {
                data[newName] = camelCase(data[newName])
            }
        })

        return data

    } catch (e) { 

        return data
    }
}


const consoleDebug  = (sql ?: string , retry = false) => {
    if(typeof sql !== "string" || sql == null) return;

    const colors = {
        keyword: '\x1b[35m',
        string: '\x1b[32m',
        special: '\x1b[38;2;77;215;240m',
        operator: '\x1b[31m',
        reset: '\x1b[0m'
    };

    const extractKeywords = (obj : Record<string,any>) => {
        return Object.values(obj)
        .flatMap(v => typeof v === 'object' ? [] : v)
        .filter(v => typeof v === 'string')
        .filter(v =>
        !v.startsWith('$') &&              
        !/[a-z][A-Z]/.test(v)
        )
        .map(v => v.toUpperCase());
    }

    const sqlKeywords = extractKeywords(CONSTANTS);

    const colorSQL = (query: string) => {
        return query
        .replace(/'[^']*'/g, m => `${colors.string}${m}${colors.reset}`)
        .replace(/([`"])(?:\\.|(?!\1).)*\1/g, m => `${colors.special}${m}${colors.reset}`)
        .replace(
            new RegExp(`\\b(${sqlKeywords.join('|').replace(/ /g, '\\s+')})\\b`, 'g'),
            (m) => `${colors.keyword}${m}${colors.reset}`
        );
    }

    if(retry) { 
        console.log(`\n\x1b[31mRETRY QUERY:\x1b[0m ${colorSQL(sql.trim())};`)
        return 
    } 

    console.log(`\n\x1b[34mQUERY:\x1b[0m ${colorSQL(sql.trim())};`)
}

const consoleExec  = (startTime : number , endTime : number) => {
    const diffInMilliseconds = endTime - startTime
    const diffInSeconds = diffInMilliseconds / 1000
    console.log(`\x1b[34mDURATION:\x1b[0m \x1b[32m${diffInSeconds} sec\x1b[0m`)
}

const consoleCache  = (provider : string) => {
    console.log(`\n\x1b[34mCACHE:\x1b[0m \x1b[33m${provider}\x1b[0m`)
}

const randomString = (length = 100) => {
    let str = ''
    const salt = 3
    for(let i = 0; i < length / salt; i++) {
      str += Math.random().toString(36).substring(salt)
    }
    return str.toLocaleLowerCase().replace(/'/g,'').slice(-length)
  }

const faker = (value : string) => {

    value = value.toLocaleLowerCase()

    if(!value.search('uuid')) return generateUUID()
    
    if(!value.search('timestamp')) return timestamp()

    if(!value.search('datetime')) return timestamp()

    if(!value.search('date')) return date()

    if(!value.search('tinyint')) return [true,false][Math.round(Math.random())]

    if(!value.search('boolean')) return [true,false][Math.round(Math.random())]

    if(!value.search('longtext')) return randomString(500)

    if(!value.search('text')) return randomString(500)

    if(!value.search('int')) return Number(Math.floor((Math.random() * 999) + 1))

    if(!value.search('float')) return Number((Math.random() * 100).toFixed(2))

    if(!value.search('double')) return Number((Math.random() * 100).toFixed(2))

    if(!value.search('json')) {
        return JSON.stringify({ 
            id :  Number(Math.floor(Math.random() * 1000)) , 
            name : randomString(50)
        })
    }

    if(!value.search('varchar')) {
        const regex = /\d+/g
        const limit = Number(value?.match(regex)?.pop() ?? 255)
        return randomString(limit)
    }

    return 'fake data'
}

const hookHandle =  async (hooks : Function[] , result : any[] | Record<string,any> | null) : Promise<void> => {
    for(const hook of hooks) await hook(result)
    return
}

const chunkArray = <T>(array: T[], length: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += length) {
        chunks.push(array.slice(i, i + length));
    }
    return chunks;
}

const wait = (ms : number) => {
    
    if(ms === 0) return

    return new Promise(ok => setTimeout(ok,Number.isNaN(ms) ? 0 : ms))
}

const softNumber = (n : any) : number =>  {

    const number = Number(n)

    if(number === -1) {
        return 2 ** 31 - 1; // int 32 bit
    }

    if(Number.isNaN(number)) {
        return -1
    }

    return Number.parseInt(`${number}`)
}

const checkValueHasRaw = (value: unknown) => {
    if (typeof value === 'string' && value.includes(CONSTANTS.RAW)) {
      return `${covertBooleanToNumber(value)}`.replace(CONSTANTS.RAW, "");
    }
    return typeof value === 'number' ? value : `'${covertBooleanToNumber(value)}'`;
}

const checkValueHasOp = (str: string) => {
  if (typeof str !== "string") str = String(str);

  if (!str.includes(CONSTANTS.OP) || !str.includes(CONSTANTS.VALUE)) {
    return null;
  }

  const opRegex = new RegExp(`\\${CONSTANTS.OP}\\(([^)]+)\\)`);
  const valueRegex = new RegExp(`\\${CONSTANTS.VALUE}\\((.*)\\)$`);

  const opMatch = str.match(opRegex);
  const valueMatch = str.match(valueRegex);

  const op = opMatch ? opMatch[1] : "";
  const value = valueMatch ? valueMatch[1] : "";

  return {
    op: op,
    value: value,
  };
};

const valueAndOperator = (
    value: string,
    operator: string,
    useDefault = false
  ): any[] => {
    if (useDefault) return [operator, "="];

    if (operator == null) {
      return [[], "="];
    }

    if (operator.toUpperCase() === CONSTANTS.LIKE) {
      operator = operator.toUpperCase();
    }

    return [value, operator];
}

const baseModelTemplate = ({model,schema,imports, relation }: {
    model: string;
    schema: string;
    imports:string;
    relation: {
        types: string;
        useds: string;
    };
}) => {

return `import { 
  type T, 
  Model, 
  Blueprint
} from 'tspace-mysql';
${imports}

const schema = {
${schema}
}

type TS = T.Schema<typeof schema>

type TR = T.Relation<{
${relation.types}
}>

class ${model} extends Model<TS,TR> {
  protected boot () : void {

    this.useSchema(schema);
    
    // -------------------------------------------------
${relation.useds}
  }
}

export { ${model} }
export default ${model}`
}

const decoratorModelTemplate = ({ model,schema,imports}: {
    model: string, 
    schema: string,
    imports:string
}) => {
return `import { 
    Model, 
    Blueprint, 
    Column, 
    HasMany, 
    BelongsTo 
} from 'tspace-mysql';
${imports}

class ${model} extends Model {

${schema}
}

export { ${model} }
export default ${model}`
}

const applyTransforms = async ({ result, transforms , action } : {
    result: any,
    transforms: Record<string, { 
        before?: (v: any) => any | Promise<any>, 
        after?: (v: any) => any | Promise<any> 
    }>
    action : 'before' | 'after'
}) : Promise<void> => {

  if (Array.isArray(result)) {
    const promises = result.map(item => applyTransforms({result: item, transforms , action }))
    await Promise.all(promises);
    return;
  }

  if (result === null || typeof result !== 'object') {
    return;
  }

  for (const key in transforms) {
    if (key in result) {
      const fn = transforms[key][action];
      if (fn) {
        result[key] = await fn(result[key]);
      }
    }
  }

  return;
}

const utils = {
    typeOf,
    isDate,
    consoleDebug,
    consoleExec,
    consoleCache,
    faker,
    columnRelation,
    timestamp,
    date,
    escape,
    escapeActions,
    escapeXSS,
    generateUUID,
    covertBooleanToNumber,
    covertDateToDateString,
    snakeCase,
    camelCase,
    randomString,
    hookHandle,
    chunkArray,
    wait,
    softNumber,
    checkValueHasRaw,
    checkValueHasOp,
    valueAndOperator,

    baseModelTemplate,
    decoratorModelTemplate,
    applyTransforms
}

export type TUtils = typeof utils
export { utils }
export default utils