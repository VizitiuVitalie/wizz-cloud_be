export interface ContentRepoInterface<D> {
  save(domain: D): Promise<D>;
  getUrlsByUserId(userId: number): Promise<{url: string}[]>;
  findAll(): Promise<D[]>;
  findById(id: number): Promise<D | null>;
  findByUserId(userId: number): Promise<D[]>;
  updatePresignedUrl(id: number, presignedUrl: string): Promise<void>;
  deleteById(id: number): Promise<void>;
}
