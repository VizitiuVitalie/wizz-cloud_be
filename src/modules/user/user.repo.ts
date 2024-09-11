import { Inject, Injectable } from '@nestjs/common';
import { DbProvider } from '../../core/db/db.provider';
import { UserDomain } from './domain/user.domain';
import { UserEntity } from './domain/user.entity';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { UserAdapter } from './user.adapter';

@Injectable()
export class UserRepo implements UserRepoInterface<UserDomain, UserEntity> {
  constructor(
    private readonly dbProvider: DbProvider,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapterInterface,
  ) {}

  public async save(domain: UserDomain): Promise<UserDomain> {
    try {
      const [entity] = await this.dbProvider.query<UserEntity>(
        `INSERT INTO users (full_name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [
          domain.fullName,
          domain.email,
          domain.password,
          domain.createdAt,
          domain.updatedAt,
        ],
      );

      return this.userAdapter.FromEntityToDomain(entity);
    } catch (error) {
      throw error;
    }
  }

  public async findById(id: number): Promise<UserDomain | null> {
    const [entity] = await this.dbProvider.query<UserEntity>(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id],
    );

    console.log('repo: ', entity);

    if (!entity) {
      return null;
    }

    return this.userAdapter.FromEntityToDomain(entity);
  }

  public async updateById(domain: UserDomain): Promise<UserDomain> {
    const [updatedEntity] = await this.dbProvider.query<UserEntity>(
      `UPDATE users
       SET full_name = $1,
           email = $2,
           password = $3,
           updated_at = NOW()
       WHERE id = $4
       RETURNING *;`,
      [domain.fullName, domain.email, domain.password, domain.id],
    );

    return this.userAdapter.FromEntityToDomain(updatedEntity);
  }

  public async deleteById(id: number): Promise<void> {
    await this.dbProvider.query(`DELETE FROM users * WHERE id = $1`, [id]);
  }
}
