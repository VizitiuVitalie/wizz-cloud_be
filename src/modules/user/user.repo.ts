import { Injectable } from '@nestjs/common';
import { UserDomain } from './domain/user.domain';
import { UserEntity } from './entity/user.entity';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { DatabaseProvider } from 'src/database/database.provider';

@Injectable()
export class UserRepo implements UserRepoInterface<UserDomain, UserEntity> {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  public async save(domain: UserDomain): Promise<UserDomain> {
    try {
      await this.dbProvider.query('BEGIN');

      const entity = this.

      const result = await this.dbProvider.query(
        `INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [domain.fullName, domain.email, domain.password],
      );

      await this.dbProvider.query('COMMIT');
      
      return new UserDomain(
        result.rows[0].id,
        result.rows[0].full_name,
        result.rows[0].email,
        result.rows[0].password,
        result.rows[0].created_at,
        result.rows[0].updated_at,
      )
    } catch (error) {
      await this.dbProvider.query('ROLLBACK');
      console.error('[user.repo].save error:', error);
      throw error;
    }
  }
}
