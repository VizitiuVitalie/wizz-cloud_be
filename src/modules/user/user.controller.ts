import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { UserAdapter } from './user.adapter';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserServiceInterface,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapterInterface,
  ) { }

  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<UserDto> {
    const domain = this.userAdapter.FromCreateUserDtoToDomain(dto);
    const createdDomain = await this.userService.create(domain);

    return this.userAdapter.FromDomainToDto(createdDomain);
  }

  @Get()
  public async findAll(): Promise<UserDto[]> {
    const domain = await this.userService.findAll();

    return domain;
  }

  @Get(':id')
  public async findById(@Param('id') id: number): Promise<UserDto> {
    const domain = await this.userService.findById(id);

    console.log('controller: ', domain);

    if (!domain) {
      throw new HttpException(
        `User with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.userAdapter.FromDomainToDto(domain);
  }

  @Put(':id')
  public async updateById(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDto> {
    const domain = this.userAdapter.FromUpdateUserDtoToDomain(dto, id);

    const updatedDomain = await this.userService.updateById(domain);

    return this.userAdapter.FromDomainToDto(updatedDomain);
  }

  @Delete(':id')
  public async deleteById(@Param('id') id: number): Promise<string> {
    await this.userService.deleteById(id);
    return (`user with id ${id} is deleted`)
  }
}
