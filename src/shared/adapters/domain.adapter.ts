import { UserDto } from "src/modules/user/dto/user.dto";
import { DomainAdapterInterface } from "../interfaces/domain.adapter.interface";
import { UserDomain } from "src/modules/user/domain/user.domain";
import { UserEntity } from "src/modules/user/entity/user.entity";

export class DomainAdapter implements DomainAdapterInterface<UserDto, UserDomain, UserEntity> {
    
    public FromDtoToDomain(dto: UserDto): UserDomain {
        return {
            id: dto.id,
            fullName: dto.fullName,
            email: dto.email,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        }
    }

    public FromDomainToDto(domain: UserDomain): UserDto {
        
    }

    public FromDomainToEntity(domain: UserDomain): UserEntity {
        
    }

    public FromEntityToDomain(entity: UserEntity): UserDomain {
        
    }
}
