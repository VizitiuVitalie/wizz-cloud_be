import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserDomain } from './domain/user.domain';
import { UserRepo } from './user.repo';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { UserEntity } from './domain/user.entity';

@Injectable()
export class UserService implements UserServiceInterface {
  public constructor(
    @Inject(UserRepo)
    private readonly userRepo: UserRepoInterface<UserDomain, UserEntity>,
  ) {}

  public create(domain: UserDomain): Promise<UserDomain> {
    return this.userRepo.save(domain);
  }
}
