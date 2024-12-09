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
      ACCESS_SECRET_KEY: string;
      REFRESH_SECRET_KEY: string;
    };
    cloud_storage: {
      path: string;
    };
  }
  