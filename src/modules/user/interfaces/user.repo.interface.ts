export interface UserRepoInterface<D> {
  save(domain: D): Promise<D>;
  getFullName(userId: number): Promise<string>;
  findById(id: number): Promise<D | null>;
  findByEmail(email: string): Promise<D | null>;
  findAll(): Promise<D[] | null>;
  updateById(domain: D): Promise<D>;
  deleteById(id: number): Promise<void>;
}
