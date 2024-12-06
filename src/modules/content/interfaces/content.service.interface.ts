import { Readable } from 'stream';
import { ContentDomain } from '../domain/content.domain';

export interface ContentServiceInterface {
  uploadContent(domain: ContentDomain, file: Express.Multer.File): Promise<ContentDomain>;
  findById(id: number): Promise<ContentDomain | null>;
  findByUserId(userId: number): Promise<ContentDomain[]>;
  getFileStream(fileUrl: string): Promise<Readable>
  update(domain: ContentDomain): Promise<ContentDomain>;
  deleteById(id: number): Promise<void>;
  deleteUserFiles(userId: number): Promise<void>;
}
