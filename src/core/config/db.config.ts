export type DatabaseConfig = {
  postgres: {
    user: string;
    port: number;
    host: string;
    database: string;
    password: string;
  };
};
