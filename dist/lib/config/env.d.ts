declare const env: Readonly<{
    DB_HOST: string | undefined;
    DB_PORT: string | undefined;
    DB_USERNAME: string | undefined;
    DB_PASSWORD: string | undefined;
    DB_DATABASE: string | undefined;
    DB_CONNECTION_LIMIT: string | undefined;
    DB_DATE_STRING: string | undefined;
    DB_TIMEOUT: string | undefined;
    DB_QUEUE_LIMIT: string | undefined;
}>;
export { env };
export default env;
