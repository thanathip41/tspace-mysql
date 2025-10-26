import { Blueprint }        from '../Blueprint';
import { Builder }          from '../Builder';
import { RelationManager }  from '../RelationManager';
import { Model }            from '../Model';
import type { T }           from '../UtilityTypes';
import type { 
    TPattern, 
    TValidateSchema , 
    TCache, 
    TRelationOptions,
    TRelationQueryOptions
} from '../../types'
abstract class AbstractModel extends Builder {

    protected $cache             !: TCache 
    protected $relation          !: RelationManager
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
    protected abstract boot () : void
    protected abstract hasOne({ name , model , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract hasMany({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract belongsTo({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    protected abstract belongsToMany({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationOptions) : this
    //@ts-ignore
    protected abstract buildMethodRelation<K extends T.RelationKeys<this>>(name : K ,callback ?: Function) : this
    protected abstract hasOneBuilder({ name , model , localKey , foreignKey , freezeTable , as } : TRelationQueryOptions ,callback : Function) : this
    protected abstract hasManyBuilder({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationQueryOptions,callback : Function) : this
    protected abstract belongsToBuilder({ name , model  , localKey , foreignKey , freezeTable , as } : TRelationQueryOptions,callback : Function) : this
    protected abstract belongsToManyBuilder({ name , model  , localKey , foreignKey , freezeTable , as , pivot } : TRelationQueryOptions,callback : Function) : this
    abstract ignoreSoftDelete() : this
    abstract disableSoftDelete() : this
    abstract onlyTrashed() :this
    abstract trashed() : this
    //@ts-ignore
    abstract restore() : Promise<T.Result<this>[]>

    // @ts-ignore
    abstract with<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract withQuery<K extends T.RelationKeys<this>,R extends T.Relations<this>,>(
        nameRelations : K , 
        callback: (
        query: `$${K & string}` extends keyof R
        ? R[`$${K & string}`] extends (infer X)[]
        ? X
        : R[`$${K & string}`] extends Model
            ? R[`$${K & string}`]
            : Model
        : K extends keyof R
        ? R[K] extends (infer X)[]
            ? X
            : R[K] extends Model
            ? R[K]
            : Model
        : Model
    ) => any,
    ) : this
    // @ts-ignore
    abstract withExists<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract withTrashed<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract withAll<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract withCount<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract has<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract relations<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract relationQuery<K extends T.RelationKeys<this>,R extends T.Relations<this>>(
        nameRelations : K , 
        callback: (
            query: `$${K & string}` extends keyof R
            ? R[`$${K & string}`] extends (infer X)[]
            ? X
            : R[`$${K & string}`] extends Model
                ? R[`$${K & string}`]
                : Model
            : K extends keyof R
            ? R[K] extends (infer X)[]
                ? X
                : R[K] extends Model
                ? R[K]
                : Model
            : Model
        ) => any,
    ) : this
    // @ts-ignore
    abstract relationsExists<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract relationsAll<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    // @ts-ignore
    abstract relationsCount<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    //@ts-ignore
    abstract relationsTrashed<K extends T.RelationKeys<this>>(...nameRelations : K[]) : this
    
}

export { AbstractModel }
export default AbstractModel