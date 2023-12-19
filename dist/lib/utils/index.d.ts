declare const utils: {
    typeOf: (data: any) => string;
    isDate: (data: any) => boolean;
    consoleDebug: (debug?: string) => void;
    faker: (value: string) => string | number | boolean;
    columnRelation: (name: string) => string;
    timestamp: (dateString?: string) => string;
    date: () => string;
    escape: (str: any) => any;
    escapeXSS: (str: any) => any;
    isSubQuery: (subQuery: string) => boolean;
    generateUUID: () => string;
    covertBooleanToNumber: (data: any) => any;
    covertDataToDateIfDate: (data: Record<string, any>) => void;
    snakeCase: (data: any) => any;
    camelCase: (data: any) => any;
    randomString: (length?: number) => string;
    hookHandle: (hooks: Function[], result: any[] | null) => Promise<void>;
};
export { utils };
export default utils;
