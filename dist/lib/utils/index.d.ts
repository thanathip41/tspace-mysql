declare const utils: {
    consoleDebug: (debug?: string) => void;
    faker: (value: string) => string | number | boolean;
    columnRelation: (name: string) => string;
    timestamp: () => string;
    date: () => string;
    escape: (str: any) => any;
    generateUUID: () => string;
    covertBooleanToNumber: (data: any) => any;
    snakeCase: (data: any) => any;
    camelCase: (data: any) => any;
    randomString: (length?: number) => string;
};
export { utils };
export default utils;
