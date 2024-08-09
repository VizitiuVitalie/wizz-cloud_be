import { UserDomain } from './domain/user.domain';
import { UserEntity } from './domain/user.entity';
import { UserDto } from './dto/user.dto';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

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

  public FromDomainToDto(domain: UserDomain): UserDto {
    return {
      createdAt: domain.createdAt,
      email: domain.email,
      fullName: domain.fullName,
      id: domain.id,
      updatedAt: domain.updatedAt,
    };
  }

  public FromEntityToDomain(entity: UserEntity): UserDomain {
    return {
      createdAt: entity.createdAt,
      email: entity.email,
      fullName: entity.fullName,
      id: entity.id,
      password: entity.password,
      updatedAt: entity.updatedAt,
    };
  }

  public FromDomainToEntity(domain: UserDomain): UserEntity {
    return {
      createdAt: domain.createdAt,
      email: domain.email,
      fullName: domain.fullName,
      id: domain.id,
      password: domain.password,
      updatedAt: domain.updatedAt,
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
}
