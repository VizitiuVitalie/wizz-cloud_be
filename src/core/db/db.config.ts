import { DatabaseConfig } from '../config/db.config';

export class DbConfig {
  public constructor(public readonly options: DatabaseConfig) {}
}
