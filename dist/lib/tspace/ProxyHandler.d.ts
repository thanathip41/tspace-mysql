declare const proxyHandler: {
    set: (self: any, name: string, value: any) => boolean;
    get: (self: any, prop: any, value: any) => any;
};
export { proxyHandler };
export default proxyHandler;
