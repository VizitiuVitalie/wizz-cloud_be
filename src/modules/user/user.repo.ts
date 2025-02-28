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
    @Inject(UserAdapter)
    private readonly userAdapter: UserAdapterInterface,
  ) {}

  public async save(domain: UserDomain): Promise<UserDomain> {
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
  }
}
