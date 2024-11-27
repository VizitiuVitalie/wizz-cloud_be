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
}
