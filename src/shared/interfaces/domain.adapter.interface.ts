import { AbstractEntity } from '../entities/abstract.entity';

export interface DomainAdapterInterface<DTO, D, E extends AbstractEntity> {
  FromDtoToDomain(dto: DTO): D;

  FromDomainToDto(domain: D): DTO;

  FromEntityToDomain(entity: E): D;

  FromDomainToEntity(domain: D): E;
}
