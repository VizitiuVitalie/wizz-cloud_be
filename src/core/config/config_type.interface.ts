export interface ConfigType {
    http: {
      port: number;
    };
    db: {
      postgres: {
        user: string;
        port: number;
        host: string;
        database: string;
        password: string;
      };
    };
    jwt: {
      access_secret_key: string;
      refresh_secret_key: string;
    };
    cloud_storage: {
      path: string;
    };
  }
