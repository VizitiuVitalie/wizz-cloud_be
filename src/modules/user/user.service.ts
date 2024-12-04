import { Inject, Injectable } from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserDomain } from './domain/user.domain';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { UserEntity } from './domain/user.entity';
import { UserRepo } from './user.repo';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements UserServiceInterface {
  public constructor(
    @Inject(UserRepo)
    private readonly userRepo: UserRepoInterface<UserDomain, UserEntity>,
  ) {}

  public async create(domain: UserDomain): Promise<UserDomain> {
    const hashedPassword = await bcrypt.hash(domain.password, 10);
    domain.password = hashedPassword;
    return this.userRepo.save(domain);
  }

  public async getFullName(userId: number): Promise<string> {
    const fullName = await this.userRepo.getFullName(userId);
    return fullName;
  }

  public async deleteUser(id: number): Promise<void> {
    await this.userRepo.deleteById(id);
  }
}
