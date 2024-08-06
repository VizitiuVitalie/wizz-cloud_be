import { AbstractEntity } from '../entities/abstract.entity';

export interface DomainAdapterInterface<DTO, D, E extends AbstractEntity> {
  toDomainFromDto(dto: DTO): D;

  toEntityFromDomain(domain: D): E;

  toDomainFromEntity(entity: E): D;

  toDtoFromDomain(domain: D): DTO;
}
