import { Injectable } from '@nestjs/common';
import { DbProvider } from '../../core/db/db.provider';
import { UserDomain } from './domain/user.domain';
import { UserEntity } from './domain/user.entity';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { UserRepoInterface } from './interfaces/user.repo.interface';

@Injectable()
export class UserRepo implements UserRepoInterface<UserDomain, UserEntity> {
  constructor(
    private readonly dbProvider: DbProvider,
    private readonly userAdapter: UserAdapterInterface,
  ) {}

  public async save(domain: UserDomain): Promise<UserDomain> {
    const [entity] = await this.dbProvider.query<UserEntity>(
      `INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [domain.fullName, domain.email, domain.password],
    );

    return this.userAdapter.FromEntityToDomain(entity);
  }
}
