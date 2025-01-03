import { Blueprint }        from '../Blueprint'
import { Builder }          from '../Builder'
import { RelationHandler }  from '../Handlers/Relation'
import { Model }            from '../Model'
import type { 
    TPattern, 
    TRelationOptions, 
    TRelationQueryOptions, 
    TValidateSchema , 
    TCache, 
    TRelationKeys
} from '../../types'

abstract class AbstractModel<T,R> extends Builder {

    protected $cache             !: TCache 
    protected $relation          !: RelationHandler
    protected $schema            !: Record<string , Blueprint>
    protected $validateSchema    !: TValidateSchema
    protected $table             !: string
    protected $pattern           !: TPattern
    protected $hasMany           !: TRelationQueryOptions[]
    protected $hasOne            !: TRelationQueryOptions[]
    protected $belongsTo         !: TRelationQueryOptions[]
    protected $belongsToMany     !: TRelationQueryOptions[]
    protected $timestamp         !: boolean
    protected $softDelete        !: boolean
    protected $uuid              !: boolean
    protected $uuidColumn        !: string
    protected $timestampColumns  !: { createdAt : string , updatedAt : string }
    protected $softDeleteColumn  !: string
    protected $observer          !: (new () => { 
        selected: Function,
        created:  Function,
        updated:  Function,
        deleted:  Function 
    })


    protected abstract useUUID(): this
    protected abstract usePrimaryKey(primaryKey: string) : this
    protected abstract useRegistry(): this
    protected abstract useDebug () : this
    protected abstract useTable (table : string) : this
    protected abstract useTablePlural () : this
    protected abstract useTableSingular () : this
    protected abstract useTimestamp () : this
    protected abstract useSoftDelete () : this
    protected abstract useHooks (functions : Function[]) : this
    protected abstract usePattern (pattern : string) : this
    protected abstract useCamelCase (pattern : string) : this
    protected abstract useSnakeCase (pattern : string) : this
    protected abstract useLoadRelationsInRegistry() : this
    protected abstract useBuiltInRelationFunctions () : this
    protected abstract define () : void
    protected abstract hasOne({ name , model , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract hasMany({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract belongsTo({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract belongsToMany({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract buildMethodRelation<K extends R extends object ? TRelationKeys<R> : string>(name : K ,callback ?: Function) : this

    protected abstract hasOneBuilder({ name , model , localKey , foreignKey , freezeTable , as } : TRelationQueryOptions ,callback : Function) : this
    protected abstract hasManyBuilder({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationQueryOptions,callback : Function) : this
    protected abstract belongsToBuilder({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationQueryOptions,callback : Function) : this
    protected abstract belongsToManyBuilder({ name , model  , localKey , foreignKey , freezeTable , as , pivot } : TRelationQueryOptions,callback : Function) : this

    abstract ignoreSoftDelete() : this
    abstract disableSoftDelete() : this
    abstract registry (func : Record<string,Function>) : this

    abstract onlyTrashed() :this
    abstract trashed() : this
    abstract restore() : Promise<T[]>

    abstract with<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract withQuery<K extends R extends object ? TRelationKeys<R> : string, TModel extends Model>(nameRelations : K , callback : (query : TModel) => TModel) : this
    abstract withExists<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract withTrashed<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract withAll<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract withCount<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract has<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract relations<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract relationQuery<K extends R extends object ? TRelationKeys<R> : string, TModel extends Model>(nameRelations : K , callback : (query : TModel) => TModel) : this
    abstract relationsExists<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract relationsAll<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract relationsCount<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    abstract relationsTrashed<K extends R extends object ? TRelationKeys<R> : string>(...nameRelations : K[]) : this
    
}

export { AbstractModel }
export default AbstractModel