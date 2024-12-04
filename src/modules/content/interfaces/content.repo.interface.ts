import { AbstractEntity } from '../../../shared/entities/abstract.entity';

export interface ContentRepoInterface<D, E extends AbstractEntity> {
  save(domain: D): Promise<D>;
  getUrlsByUserId(userId: number): Promise<any>;
  findById(id: number): Promise<D | null>;
  findByUserId(userId: number): Promise<D[]>;
  update(domain: D): Promise<D>;
  deleteById(id: number): Promise<void>;
}
