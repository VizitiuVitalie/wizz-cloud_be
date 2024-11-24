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

  public async findById(id: number): Promise<UserDomain | null> {
    const result = await this.userRepo.findById(id);
    console.log('service: ', result);
    return result
  }

  public async findAll(): Promise<UserDomain[] | null> {
    const result = await this.userRepo.findAll();
    return result
  }

  public async updateById(domain: UserDomain): Promise<UserDomain> {
    return this.userRepo.updateById(domain);
  }

  public async deleteById(id: number): Promise<void> {
    await this.userRepo.deleteById(id);
  }
}
