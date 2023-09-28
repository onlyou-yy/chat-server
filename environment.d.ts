declare namespace NodeJS {
  export interface ProcessEnv {
    HTTP_SERVER_PORT?: string;
    ENVIRONMENT?: string;
    ENVIRONMENT_MESSAGE?: string;
    MYSQL_DB_HOST?: string;
    MYSQL_DB_PORT?: string;
    MYSQL_DB_USERNAME?: string;
    MYSQL_DB_PASSWORD?: string;
    MYSQL_DB_NAME?: string;
    MYSQL_DB_SYNCHRONIZE?: string;
    JWT_SECRET?: string;
    SESSION_SECRET?: string;
    SESSION_NAME?: string;
  }
}
