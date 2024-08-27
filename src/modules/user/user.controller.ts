import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';

@Controller('user')
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: UserServiceInterface,
    @Inject('UserAdapterInterface')
    private readonly userAdapter: UserAdapterInterface,
  ) {}

  @Post('create')
  public async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    try {

      const domain = this.userAdapter.FromCreateUserDtoToDomain(dto);

      const createdDomain = await this.userService.create(domain);

      const createdDto = this.userAdapter.FromDomainToDto(createdDomain);

      return createdDto;

    } catch (error) {
      console.error('[UserController.register]:', error);
    }
  }
}
