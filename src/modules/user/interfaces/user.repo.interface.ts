import { AbstractEntity } from 'src/shared/entities/abstract.entity';

export interface UserRepoInterface<D, E extends AbstractEntity> {
  save(domain: D): Promise<D>;
  getFullName(userId: number): Promise<string>;
  findById(id: number): Promise<D | null>;
  findByEmail(email: string): Promise<D | null>;
  findAll(): Promise<D[] | null>;
  updateById(domain: D): Promise<D>;
  deleteById(id: number): Promise<void>;
}
