import { Inject, Injectable } from '@nestjs/common';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentRepo } from './content.repo';
import { ContentRepoInterface } from './interfaces/content.repo.interface';
import { ContentDomain } from './domain/content.domain';
import { ContentEntity } from './domain/content.entity';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/libs/aws/aws.service';
import { LocalStorageService } from 'src/libs/local-storage/local-storage.service';

@Injectable()
export class ContentService implements ContentServiceInterface {
  private readonly storagePath: string;
  constructor(
    @Inject(ContentRepo)
    private readonly contentRepo: ContentRepoInterface<
      ContentDomain,
      ContentEntity
    >,
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
    private readonly LocalStorageService: LocalStorageService,
  ) {
    this.storagePath = this.configService.get<string>('cloud_storage.path');
  }

  public async uploadContent(domain: ContentDomain, file: Express.Multer.File): Promise<ContentDomain> {
    const fileKey = await this.awsService.save(file);
    domain.fileKey = fileKey;
    return this.contentRepo.save(domain);
  }

  public async findById(id: number): Promise<ContentDomain | null> {
    const result = await this.contentRepo.findById(id);
    return result;
  }

  public async findByUserId(userId: number): Promise<ContentDomain[]> {
    const contents = await this.contentRepo.findByUserId(userId);

    return Promise.all(
      contents.map(async (content: ContentDomain) => {
        content.url = await this.LocalStorageService.generatePublicUrl(
          content.url,
        );
        return content;
      }),
    );
  }

  public async update(domain: ContentDomain): Promise<ContentDomain> {
    return this.contentRepo.update(domain);
  }

  public async deleteById(id: number): Promise<void> {
    return this.contentRepo.deleteById(id);
  }

  public async deleteUserFiles(userId: number): Promise<void> {
    const files = await this.contentRepo.getUrlsByUserId(userId);

    if (!files || files.length === 0) {
      console.log(`No files found for user ${userId}`);
      return;
    }

    console.log(`Cloud storage path: ${this.storagePath}`);

    for (const file of files) {
      const filePath = path.resolve(this.storagePath, path.basename(file.url));
      try {
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
      }
    }
  }

  public async getFileStream(fileUrl: string): Promise<Readable> {
    const fileKey = fileUrl.split('/').pop();
    return this.awsService.getFileStream(fileKey);
  }
}
