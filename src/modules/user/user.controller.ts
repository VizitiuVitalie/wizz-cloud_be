import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { UserAdapter } from './user.adapter';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserServiceInterface,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapterInterface,
  ) {}

  @Post('create')
  public async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    const domain = this.userAdapter.FromCreateUserDtoToDomain(dto);
    const createdDomain = await this.userService.create(domain);

    return this.userAdapter.FromDomainToDto(createdDomain);
  }
}
