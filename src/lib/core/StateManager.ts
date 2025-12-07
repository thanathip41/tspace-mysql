
import { Blueprint } from "./Blueprint";
import type { 
    TSave, 
    TValidateSchema 
} from "../types";

const STATE_DEFAULT = {
  PRIMARY_KEY: 'id' as string,
  VOID: false as boolean,
  DISTINCT: false as boolean,
  SAVE: null as TSave | null,
  DELETE: false as boolean | null,
  UPDATE: null as string[] | null,
  INSERT: null as { columns: string[] , values: string[] } | null,
  SELECT: [] as string[],
  ADD_SELECT: [] as string[],
  ONLY: [] as string[],
  EXCEPTS: [] as string[],
  FROM: [] as string[],
  JOIN: [] as string[],
  WHERE: [] as string[],
  GROUP_BY: [] as string[],
  ORDER_BY: [] as string[],
  LIMIT: null as number | null,
  OFFSET: null as number | null,
  HAVING: null as string | null,
  TABLE_NAME: null as string | null,
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
  ROW_LEVEL_LOCK : null as "FOR_UPDATE" | "FOR_SHARE" | null
} as const

const STATE_DB = {
  ...STATE_DEFAULT,
} as const

const STATE_MODEL = {
    ...STATE_DEFAULT,
    AUDIT : null as number | null,
    AUDIT_METADATA : null as Record<string,any> | null,
    MODEL_NAME: 'model' as string,
    UUID_FORMAT: 'uuid' as string,
    UUID: false as boolean,
    SOFT_DELETE: false as boolean,
    SOFT_DELETE_FORMAT: 'deleted_at' as string,
    SOFT_DELETE_RELATIONS: false as boolean,
    REGISTRY: {} as Record<string, string>,
    PATTERN: 'default' as string,
    RELATION: [] as any[],
    RELATIONS: [] as any[],
    RELATIONS_TRASHED: false as boolean,
    RELATIONS_EXISTS: false as boolean,
    TIMESTAMP: false as boolean,
    TIMESTAMP_FORMAT: {
        CREATED_AT: 'created_at' as string,
        UPDATED_AT: 'updated_at' as string,
    } as const,
    LOGGER: false as boolean,
    LOGGER_OPTIONS: null as { 
        selected : boolean;
        inserted : boolean;
        updated  : boolean;
        deleted  : boolean;
    } | null,
    TABLE_LOGGER: '$loggers' as string,
    TABLE_AUDIT : '$audits' as string,
    VALIDATE_SCHEMA: false as boolean,
    VALIDATE_SCHEMA_DEFINED: null as TValidateSchema | null,
    FUNCTION_RELATION: false as boolean,
    SCHEMA_TABLE: null as Record<string, Blueprint> | null,
    RETRY: 0 as number,
    OBSERVER: null as (new () => any) | null,
    DATA: null as any | null,
    BEFORE_CREATING_TABLE: null as Function | null,
    GLOBAL_SCOPE: true as boolean,
    GLOBAL_SCOPE_QUERY: null as Function | null,
    QUERIES: [] as string[],
    META: null as string | null,
    CACHE: null as { key : string, expires: number } | null,
    MIDDLEWARES: [] as Function[],
    TRANSFORMS : null as Record<string ,{ 
        to : (value: unknown) => any | Promise<any>; 
        from  : (value: unknown) => any | Promise<any> 
    }> | null,
    BEFORE_INSERTS: [] as Function[],
    AFTER_INSERTS: [] as Function[],
    BEFORE_UPDATES: [] as Function[],
    AFTER_UPDATES: [] as Function[],
    BEFORE_REMOVES: [] as Function[],
    AFTER_REMOVES: [] as Function[],
} as const

type State = typeof STATE_MODEL & typeof STATE_DB & typeof STATE_DEFAULT

class StateManager {
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

    get<K extends keyof State>(key : K)  { 

        if(!this.STATE.currentState.has(key) && key !== 'DEBUG') {
            throw this._assertError(`This state does not have that key '${key}'`)
        }
       
        return this.STATE.currentState.get(key) as State[K]
    }
    
    set<K extends keyof State>(key: K, value: State[K]): void {

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
        // the reset state was set only statement query;
        
        this.STATE.currentState.set('INSERT',null) 
        this.STATE.currentState.set('UPDATE',null)
        this.STATE.currentState.set('DELETE',null)
        this.STATE.currentState.set('SAVE',null)
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

export { StateManager}
export default StateManager