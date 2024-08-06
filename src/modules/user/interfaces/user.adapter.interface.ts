import { DomainAdapterInterface } from '../../../shared/interfaces/domain.adapter.interface';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UserDomain } from 'src/modules/user/domain/user.domain';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { createUserDto } from '../dto/create-user.dto';

export interface UserAdapterInterface
  extends DomainAdapterInterface<UserDto, UserDomain, UserEntity> {
  FromCreateUserDtoToDomain(dto: createUserDto): UserDomain;
}

//Cand as avem UserController, noi as vrem s transmitim dto in service sh acolo s ii fashim adapt la domain model UserDomain
//UserDto la noi nu contine password da UserDomain contine, sh cum as fashi adapt fara un parametru nu intaleg.
//El je ii abeazatelinii ca s putem s transmitim in repo Domain cu password s putem corect inscrii datele in bd
//Useru s contina Password hashuit, da asa noi daca as folosim UserDto in controller apu pula shi as avem
//Sh vabshe in controller pentru create user folosim createUserDto ---> cari ari parola
//Da UserAdapteru asteapta di la noi s shii nu createUserDto da prosta UserDto cari ii fara password
