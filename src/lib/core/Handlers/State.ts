const STATE_DEFAULT = {
    PRIMARY_KEY : 'id',
    VOID : false,
    RESULT : null,
    DISTINCT : false,
    PLUCK : '',
    SAVE : '',
    DELETE : '',
    UPDATE : '',
    INSERT : '',
    SELECT : [],
    ONLY : [],
    EXCEPTS: [],
    CHUNK : 0,
    COUNT : '',
    FROM : 'FROM',
    JOIN : [],
    WHERE : [],
    GROUP_BY : [],
    ORDER_BY : [],
    LIMIT : '',
    OFFSET : '',
    HAVING : '',
    TABLE_NAME :'',
    HIDDEN:  [],
    DEBUG : false,
    CTE : [],
    PAGE: 1,
    AFTER_SAVE : 0,
    RETURN_TYPE : null,
    HOOKS : [],
    ALIAS : null,
    RAW_ALIAS : null,
} as const

const STATE_DB = {
    ...STATE_DEFAULT
} as const

const STATE_MODEL = {
    ...STATE_DEFAULT,
    MODEL_NAME : 'MODEL',
    UUID_FORMAT : 'uuid',
    UUID : false,
    SOFT_DELETE: false,
    SOFT_DELETE_FORMAT : 'deleted_at',
    SOFT_DELETE_RELATIONS : false,
    REGISTRY : {},
    PATTERN:  'snake_case',
    RELATION: [],
    RELATIONS : [],
    RELATIONS_TRASHED : false,
    RELATIONS_EXISTS : false,
    TIMESTAMP :  false,
    TIMESTAMP_FORMAT : {
        CREATED_AT : 'created_at',
        UPDATED_AT : 'updated_at'
    },
    LOGGER : false,
    LOGGER_OPTIONS : null,
    TABLE_LOGGER : '$loggers',
    VALIDATE_SCHEMA : false,
    VALIDATE_SCHEMA_DEFINED : null,
    FUNCTION_RELATION : false,
    SCHEMA_TABLE : null,
    RETRY : 0,
    OBSERVER : null,
    DATA : null,
    BEFORE_CREATING_TABLE : null,
    RETURN_TYPE : null,
    GLOBAL_SCOPE : true,
    GLOBAL_SCOPE_QUERY : null,
    QUERIES : [],
    META : '',
    CACHE : null
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

            default : throw new Error(`Unknown the state : '${state}'`)
        }
        
    }

    original () : Map<string, any> {
        return  this.STATE.defaultState
    }

    get(key ?: keyof TState)  { 

        if(key == null) return this.STATE.currentState 

        if(!this.STATE.currentState.has(key) && key !== 'DEBUG') {
            return this._assertError(`This state does not have that key '${key}'`)
        }
       
        return this.STATE.currentState.get(key)
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