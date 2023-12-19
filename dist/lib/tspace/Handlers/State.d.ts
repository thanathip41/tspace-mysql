declare class StateHandler {
    private STATE;
    constructor(constant: Record<string, any>);
    original(): Map<string, any>;
    get(key?: string | null): any;
    set(key: string, value: any): void;
    clone(data: any): void;
    resetState(): void;
    private _assertError;
}
export { StateHandler };
export default StateHandler;
