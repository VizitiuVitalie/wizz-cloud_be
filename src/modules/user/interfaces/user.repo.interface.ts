import { AbstractEntity } from 'src/shared/entities/abstract.entity';

export interface UserRepoInterface<D, E extends AbstractEntity> {
  save(domain: D): Promise<D>;
}
