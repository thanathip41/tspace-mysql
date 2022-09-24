declare const _default: {
    consoleDebug: (debug?: string | undefined) => void;
    tableName: (name: string) => string;
    faker: (value: string) => string | number | boolean;
    columnRelation: (name: string) => string;
    timestamp: () => string;
    date: () => string;
    escape: (str: any) => any;
    escapeSubQuery: (str: any) => any;
    generateUUID: () => string;
    covertBooleanToNumber: (data: any) => any;
    snakeCase: (obj: any) => any;
    camelCase: (obj: any) => any;
};
export default _default;
