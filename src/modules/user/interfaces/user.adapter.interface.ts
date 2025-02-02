import { DomainAdapterInterface } from '../../../shared/interfaces/domain.adapter.interface';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { UserDomain } from 'src/modules/user/domain/user.domain';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { RegisterDto } from '../../auth/dto/auth.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserAdapterInterface
  extends DomainAdapterInterface<UserDto, UserDomain, UserEntity> {
  FromCreateUserDtoToDomain(dto: CreateUserDto): UserDomain;
  FromUpdateUserDtoToDomain(dto: UpdateUserDto, id: number): UserDomain;
  FromRegisterDtoToDomain(dto: RegisterDto, verificationCode: string): UserDomain
}
