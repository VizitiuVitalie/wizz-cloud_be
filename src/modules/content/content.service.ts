import { Inject, Injectable } from '@nestjs/common';
import { StorageInterface } from '../../libs/storage/interfaces/storage.interface';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentRepo } from './content.repo';
import { ContentRepoInterface } from './interfaces/content.repo.interface';
import { ContentDomain } from './domain/content.domain';
import * as path from 'path';
import * as fs from 'fs/promises';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/libs/storage/aws/aws.service';

@Injectable()
export class ContentService implements ContentServiceInterface {
  private readonly storagePath: string;

  constructor(
    @Inject(ContentRepo)
    private readonly contentRepo: ContentRepoInterface<ContentDomain>,
    @Inject(AwsService) private readonly storage: StorageInterface,
    private readonly configService: ConfigService,
  ) {
    this.storagePath = this.configService.get<string>('cloud_storage.path');
  }

  public async uploadContent(
    domain: ContentDomain,
    file: Express.Multer.File,
  ): Promise<ContentDomain> {
    const fileKey = await this.storage.save(file);
    domain.fileKey = fileKey;
    return this.contentRepo.save(domain);
  }

  public async findById(id: number): Promise<ContentDomain | null> {
    const result = await this.contentRepo.findById(id);
    return result;
  }

  public async findByFileKey(fileKey: string): Promise<ContentDomain | null> {
    return this.contentRepo.findByFileKey(fileKey);
  }

  public async findByUserId(userId: number): Promise<ContentDomain[]> {
    // @TODO --> check
    // const contents = await this.contentRepo.findByUserId(userId);
    //
    // return Promise.all(
    //   contents.map(async (content: ContentDomain) => {
    //     content.url = await this.localStorageService.generatePublicUrl(
    //       content.url,
    //     );
    //     return content;
    //   }),
    // );
  }

  public async update(domain: ContentDomain): Promise<ContentDomain> {
    return this.contentRepo.update(domain);
  }

  public async deleteById(id: number): Promise<void> {
    return this.contentRepo.deleteById(id);
  }

  public async deleteLocalContents(userId: number): Promise<void> {
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

  public async deleteBucketContents(userId: number): Promise<void> {
    const contents = await this.contentRepo.findByUserId(userId);

    for (const content of contents) {
      if (content.fileKey) {
        await this.storage.delete(content.fileKey);
      }
    }
  }

  public async deleteOneFromBucket(fileKey: string): Promise<void> {
    return this.storage.delete(fileKey);
  }

  public async getFileStream(fileUrl: string): Promise<Readable> {
    const fileKey = fileUrl.split('/').pop();
    return this.storage.getFileStream(fileKey);
  }
}
