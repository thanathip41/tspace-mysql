declare class Logger {
    private SELF;
    private PROP;
    constructor(self: Record<string, any>, prop: string);
    private initialize;
}
export { Logger };
export default Logger;
