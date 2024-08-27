import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserDomain } from './domain/user.domain';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { UserEntity } from './domain/user.entity';
import { UserRepo } from './user.repo';

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
