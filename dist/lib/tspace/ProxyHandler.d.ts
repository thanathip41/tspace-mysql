declare const proxyHandler: {
    set: (self: any, name: string, value: any) => boolean;
    get: (self: {
        [x: string]: any;
        $db: {
            get: (arg: string) => string;
        };
        $logger: {
            get: () => any;
        };
    }, prop: string, value: unknown) => any;
};
export { proxyHandler };
export default proxyHandler;
