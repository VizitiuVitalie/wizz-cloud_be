import { Injectable } from '@nestjs/common';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { UserDomain } from './domain/user.domain';
import { UserEntity } from './entity/user.entity';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { DatabaseProvider } from 'src/database/database.provider';

@Injectable()
export class UserRepo implements UserRepoInterface<UserDomain, UserEntity> {
  constructor(private readonly db_provider: DatabaseProvider) {}

  public async save(domain: UserDomain): Promise<UserDomain> {}
}
