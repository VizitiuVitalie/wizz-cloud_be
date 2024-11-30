import { ContentDomain } from '../domain/content.domain';

export interface ContentServiceInterface {
  uploadContent(domain: ContentDomain): Promise<ContentDomain>;
  findById(id: number): Promise<ContentDomain | null>;
  findByUserId(id: number): Promise<ContentDomain[]>;
  update(domain: ContentDomain): Promise<ContentDomain>;
  deleteById(id: number): Promise<void>;
}
