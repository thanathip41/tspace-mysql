declare class StateHandler {
    private STATE;
    constructor(state: 'model' | 'db' | 'default');
    original(): Map<string, any>;
    get(key?: string): any;
    set(key: string, value: any): void;
    clone(data: any): void;
    reset(): void;
    private _assertError;
}
export { StateHandler };
export default StateHandler;
