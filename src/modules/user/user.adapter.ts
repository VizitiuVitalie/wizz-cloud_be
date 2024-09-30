import { UserDomain } from './domain/user.domain';
import { UserEntity } from './domain/user.entity';
import { UserDto } from './dto/user.dto';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserAdapter implements UserAdapterInterface {
  public FromDtoToDomain(dto: UserDto): UserDomain {
    return {
      createdAt: dto.createdAt,
      email: dto.email,
      fullName: dto.fullName,
      id: dto.id,
      password: null,
      updatedAt: undefined,
    };
  }

  public FromDomainToEntity(domain: UserDomain): UserEntity {
    return {
      created_at: domain.createdAt,
      email: domain.email,
      full_name: domain.fullName,
      id: domain.id,
      password: domain.password,
      updated_at: domain.updatedAt,
    };
  }

  public FromDomainToDto(domain: UserDomain): UserDto {
    return {
      id: domain.id,
      fullName: domain.fullName,
      email: domain.email,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  public FromEntityToDomain(entity: UserEntity): UserDomain {
    return {
      id: entity.id,
      fullName: entity.full_name,
      email: entity.email,
      password: entity.password,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    };
  }

  public FromCreateUserDtoToDomain(dto: CreateUserDto): UserDomain {
    return {
      createdAt: new Date(),
      email: dto.email,
      fullName: dto.fullName,
      id: 0,
      password: dto.password,
      updatedAt: new Date(),
    };
  }

  public FromUpdateUserDtoToDomain(dto: UpdateUserDto, id: number): UserDomain {
    return {
      id: id,
      fullName: dto.fullName,
      email: dto.email,
      password: dto.password,
      createdAt: undefined,
      updatedAt: new Date(),
    };
  }
}
