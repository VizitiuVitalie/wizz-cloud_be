import { DomainAdapterInterface } from '../../../shared/interfaces/domain.adapter.interface';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UserDomain } from 'src/modules/user/domain/user.domain';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

export interface UserAdapterInterface
  extends DomainAdapterInterface<UserDto, UserDomain, UserEntity> {
  FromCreateUserDtoToDomain(dto: CreateUserDto): UserDomain;
}
