type DbConfigOpts = {
  user: string;
  password: string;
  host: string;
  database: string;
  port: number;
};

export class DbConfig {
  public constructor(public readonly options: DbConfigOpts) {}
}
