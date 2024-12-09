export interface ContentRepoInterface<D> {
  save(domain: D): Promise<D>;
  getUrlsByUserId(userId: number): Promise<{url: string}[]>;
  findById(id: number): Promise<D | null>;
  findByUserId(userId: number): Promise<D[]>;
  update(domain: D): Promise<D>;
  deleteById(id: number): Promise<void>;
}
