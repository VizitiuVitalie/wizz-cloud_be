import { ContentDomain } from '../domain/content.domain';

export interface ContentServiceInterface {
  create(domain: ContentDomain): Promise<ContentDomain>;
  findById(id: number): Promise<ContentDomain | null>;
  findByUserId(userId: number): Promise<ContentDomain[] | null>;
  update(domain: ContentDomain): Promise<ContentDomain>;
  deleteById(id: number): Promise<void>;
}
