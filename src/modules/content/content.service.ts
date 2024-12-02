import { Inject, Injectable } from '@nestjs/common';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentRepo } from './content.repo';
import { ContentRepoInterface } from './interfaces/content.repo.interface';
import { ContentDomain } from './domain/content.domain';
import { ContentEntity } from './domain/content.entity';
import * as path from 'path';

@Injectable()
export class ContentService implements ContentServiceInterface {
  constructor(
    @Inject(ContentRepo)
    private readonly contentRepo: ContentRepoInterface<
      ContentDomain,
      ContentEntity
    >,
  ) {}

  private generatePublicUrl(filePath: string): string {
    const fileName = path.basename(filePath);
    return `http://localhost:1222/wizzcloud/files/${fileName}`;
  }

  public async uploadContent(domain: ContentDomain): Promise<ContentDomain> {
    return this.contentRepo.save(domain);
  }

  public async findById(id: number): Promise<ContentDomain | null> {
    const result = await this.contentRepo.findById(id);
    return result;
  }

  public async findByUserId(userId: number): Promise<ContentDomain[]> {
    const contents = await this.contentRepo.findByUserId(userId);

    return contents.map((content) => {
      content.url = this.generatePublicUrl(content.url);
      return content;
    });
  }

  public async update(domain: ContentDomain): Promise<ContentDomain> {
    return this.contentRepo.update(domain);
  }

  public async deleteById(id: number): Promise<void> {
    return this.contentRepo.deleteById(id);
  }
}
