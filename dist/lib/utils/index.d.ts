declare const _default: {
    consoleDebug: (message?: string | undefined) => void;
    tableName: (name: string) => string;
    faker: (value: string) => string | number | boolean;
    connection: () => Promise<any>;
    columnRelation: (name: string) => string;
    timestamp: () => string;
    date: () => string;
    escape: (str: any) => any;
    escapeSubQuery: (str: any) => any;
    generateUUID: () => string;
    constants: (name?: string | undefined) => string | Object | undefined;
    covertBooleanToNumber: (data: any) => any;
    snakeCase: (obj: any) => any;
    camelCase: (obj: any) => any;
};
export default _default;
