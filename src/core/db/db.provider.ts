import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { DbConfig } from './db.config';

@Injectable()
export class DbProvider {
  private pool: Pool;

  public constructor(private readonly config: DbConfig) {}

  public async query(text: string, params?: any[]) {
    const client = await this.pool.connect();

    try {
      return await client.query(text, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}
