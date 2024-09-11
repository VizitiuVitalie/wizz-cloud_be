import { AbstractEntity } from 'src/shared/entities/abstract.entity';

export interface UserRepoInterface<D, E extends AbstractEntity> {
  save(domain: D): Promise<D>;
  findById(id: number): Promise<D | null>;
  updateById(domain: D): Promise<D>;
  deleteById(id: number): Promise<void>;
}
