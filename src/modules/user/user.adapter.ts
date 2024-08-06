import { DomainAdapterInterface } from 'src/shared/interfaces/domain.adapter.interface';
import { UserDomain } from './domain/user.domain';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserAdapter implements UserAdapterInterface {
  public toDomainFromDto(dto: UserDto): UserDomain {}
}
