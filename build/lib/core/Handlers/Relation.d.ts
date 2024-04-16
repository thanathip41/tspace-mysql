import { TRelationOptions, TRelationQueryOptions } from "../../types";
import { Model } from "../Model";
declare class RelationHandler {
    private MODEL;
    private $constants;
    private $logger;
    constructor(model: Model);
    load(parents: Record<string, any>[], relation: TRelationOptions): Promise<any[]>;
    loadExists(): string;
    apply(nameTRelationOptionss: any[], type: 'all' | 'exists' | 'trashed' | 'count' | 'default'): TRelationOptions[];
    callback(nameTRelationOptions: any, cb: Function): void;
    returnCallback(nameTRelationOptions: any): Model<any, any>;
    hasOne({ name, as, model, localKey, foreignKey, freezeTable }: TRelationOptions): void;
    hasMany({ name, as, model, localKey, foreignKey, freezeTable }: TRelationOptions): void;
    belongsTo({ name, as, model, localKey, foreignKey, freezeTable }: TRelationOptions): void;
    belongsToMany({ name, as, model, localKey, foreignKey, freezeTable, pivot, oldVersion, modelPivot }: TRelationOptions): void;
    hasOneBuilder({ name, as, model, localKey, foreignKey, freezeTable, }: TRelationQueryOptions, callback?: Function): this | undefined;
    hasManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, }: TRelationQueryOptions, callback?: Function): this | undefined;
    belongsToBuilder({ name, as, model, localKey, foreignKey, freezeTable, }: TRelationQueryOptions, callback?: Function): this | undefined;
    belongsToManyBuilder({ name, as, model, localKey, foreignKey, freezeTable, pivot }: TRelationQueryOptions, callback?: Function): this | undefined;
    private _handleTRelationOptionssExists;
    private _relationBuilder;
    private _functionTRelationOptionsName;
    private _relationMapData;
    private _belongsToMany;
    private _valueInTRelationOptions;
    protected _valuePattern(value: string): string;
    private _assertError;
}
export { RelationHandler };
export default RelationHandler;
