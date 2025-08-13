import { Blueprint } from "../Blueprint";

const STATE_DEFAULT = {
  PRIMARY_KEY: 'id' as string,
  VOID: false as boolean,
  RESULT: null as { id : number } | null,
  DISTINCT: false,
  SAVE: '' as string,
  DELETE: '' as string,
  UPDATE: '' as string,
  INSERT: '' as string,
  SELECT: [] as string[],
  ONLY: [] as string[],
  EXCEPTS: [] as string[],
  FROM: 'FROM' as string,
  JOIN: [] as string[],
  WHERE: [] as string[],
  GROUP_BY: [] as string[],
  ORDER_BY: [] as string[],
  LIMIT: '' as string,
  OFFSET: '' as string,
  HAVING: '' as string,
  TABLE_NAME: '' as string,
  HIDDEN: [] as string[],
  DEBUG: false as boolean,
  CTE: [] as string[],
  PAGE: 1 as number,
  AFTER_SAVE: 100 as number,
  HOOKS: [] as Function[],
  ALIAS: null as string | null,
  RAW_ALIAS: null as string | null,
  UNION: [] as string[],
  UNION_ALL: [] as string[],
} as const

const STATE_DB = {
  ...STATE_DEFAULT,
} as const

const STATE_MODEL = {
  ...STATE_DEFAULT,
  MODEL_NAME: 'MODEL' as string,
  UUID_FORMAT: 'uuid' as string,
  UUID: false as boolean,
  SOFT_DELETE: false as boolean,
  SOFT_DELETE_FORMAT: 'deleted_at' as string,
  SOFT_DELETE_RELATIONS: false as boolean,
  REGISTRY: {} as Record<string, string>,
  PATTERN: 'snake_case' as string,
  RELATION: [] as any[],
  RELATIONS: [] as any[],
  RELATIONS_TRASHED: false,
  RELATIONS_EXISTS: false,
  TIMESTAMP: false,
  TIMESTAMP_FORMAT: {
    CREATED_AT: 'created_at' as string,
    UPDATED_AT: 'updated_at' as string,
  } as const,
  LOGGER: false,
  LOGGER_OPTIONS: null as { 
    selected : boolean;
    inserted : boolean;
    updated  : boolean;
    deleted  : boolean;
  } | null,
  TABLE_LOGGER: '$loggers' as string,
  VALIDATE_SCHEMA: false as boolean,
  VALIDATE_SCHEMA_DEFINED: null as string | null,
  FUNCTION_RELATION: false as boolean,
  SCHEMA_TABLE: null as Record<string, Blueprint> | null,
  RETRY: 0 as number,
  OBSERVER: null as (new () => any) | null,
  DATA: null as any | null,
  BEFORE_CREATING_TABLE: null as Function | null,
  GLOBAL_SCOPE: true,
  GLOBAL_SCOPE_QUERY: null as Function | null,
  QUERIES: [] as string[],
  META: '' as string,
  CACHE: null as { key : string, set : Function , expires: number } | null,
  MIDDLEWARES: [] as Function[],
} as const

type TState = typeof STATE_MODEL & typeof STATE_DB & typeof STATE_DEFAULT

class StateHandler {
    private STATE : { currentState : Map<string,any> , defaultState : Map<string,any> } = {
        currentState : new Map(),
        defaultState : new Map()
    }
    
    constructor(state: 'model' | 'db' | 'default') {

        switch(state) {
            case 'db' : {
                const currentState = new Map<string, any>(Object.entries({ ...STATE_DB }));
                const defaultState = new Map<string, any>(Object.entries({ ...STATE_DB }));

                this.STATE = { currentState, defaultState };

                return this
            }

            case 'model' : {
                const currentState = new Map<string, any>(Object.entries({ ...STATE_MODEL }));
                const defaultState = new Map<string, any>(Object.entries({ ...STATE_MODEL }));

                this.STATE = { currentState, defaultState };

               return this
            }

            case 'default' : {
                const currentState = new Map<string, any>(Object.entries({ ...STATE_DEFAULT }));
                const defaultState = new Map<string, any>(Object.entries({ ...STATE_DEFAULT }));

                this.STATE = { currentState, defaultState };

               return this
            }

            default : throw new Error(`string the state : '${state}'`)
        }
        
    }

    original () : Map<string, any> {
        return  this.STATE.defaultState
    }

    all()  { 
        return this.STATE.currentState 
    }

    get<K extends keyof TState>(key : K)  { 

        if(!this.STATE.currentState.has(key) && key !== 'DEBUG') {
            throw this._assertError(`This state does not have that key '${key}'`)
        }
       
        return this.STATE.currentState.get(key) as TState[K]
    }
    
    set(key: keyof TState, value: any) : void {

        if(!this.STATE.currentState.has(key)) {
            return this._assertError(`That key '${key}' can't be set in the state`)
        }
       
        this.STATE.currentState.set(key , value)

        return
    }

    clone (data : any) : void {
        this.STATE.currentState  = new Map<string , Array<any> | string | boolean>(
            Object.entries({...data})
        )
        return
    }

    reset () : void {
       
        this.STATE.currentState.set('INSERT','') 
        this.STATE.currentState.set('UPDATE','')
        this.STATE.currentState.set('DELETE','')
        this.STATE.currentState.set('SAVE','')
        this.STATE.currentState.set('VOID',false)           
    }

    private _assertError(condition : boolean | string = true , message : string = 'error') : void {

        if(typeof condition === 'string') {
            throw new Error(condition)
        }

        if(condition) throw new Error(message)

        return
    }
}

export { StateHandler}
export default StateHandler