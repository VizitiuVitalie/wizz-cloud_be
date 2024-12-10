import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DbConfig } from './db.config';

@Injectable()
export class DbProvider {
  private readonly pool: Pool;

  public constructor(private readonly config: DbConfig) {
    this.pool = new Pool({
      user: this.config.options.postgres.user,
      host: this.config.options.postgres.host || 'localhost',
      database: this.config.options.postgres.database,
      password: this.config.options.postgres.password,
      port: this.config.options.postgres.port,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async query<T>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(text, params);
      return rows;
    } finally {
      client.release();
    }
  }
}
