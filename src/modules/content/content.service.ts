import { Inject, Injectable } from '@nestjs/common';
import { StorageInterface } from '../../libs/storage/interfaces/storage.interface';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentRepo } from './content.repo';
import { ContentRepoInterface } from './interfaces/content.repo.interface';
import { ContentDomain } from './domain/content.domain';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/libs/storage/aws/aws.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ContentService implements ContentServiceInterface {
  private readonly storagePath: string;

  constructor(
    @Inject(ContentRepo)
    private readonly contentRepo: ContentRepoInterface<ContentDomain>,
    @Inject(AwsService) private readonly storage: StorageInterface,
    private readonly configService: ConfigService,
    @InjectQueue('presignedUrlQueue') private readonly presignedUrlQueue: Queue,
  ) {
    this.storagePath = this.configService.get<string>('cloud_storage.path');
    this.schedulePresignedUrlUpdates();
  }

  private async schedulePresignedUrlUpdates() {
    console.log('Scheduling presigned URL updates');
    const repeatableJobs = await this.presignedUrlQueue.getRepeatableJobs();
    if (repeatableJobs.length === 0) {
      await this.presignedUrlQueue.add('updatePresignedUrls', {}, { repeat: { cron: '*/25 * * * *' } }); // Every 25 minutes
    }
  }

  public async uploadContent(domain: ContentDomain, file: Express.Multer.File): Promise<ContentDomain> {
    const fileLinks = await this.storage.save(file);
    domain.fileKey = fileLinks.fileKey;
    domain.presignedUrl = fileLinks.presignedUrl;
    return this.contentRepo.save(domain);
  }

  public async findById(id: number): Promise<ContentDomain | null> {
    const result = await this.contentRepo.findById(id);
    return result;
  }

  public async findByUserId(userId: number): Promise<ContentDomain[]> {
    const contents = await this.contentRepo.findByUserId(userId);
    for (const content of contents) {
      const newPresignedUrl = await this.storage.generateLinks(content.fileKey);
      content.presignedUrl = newPresignedUrl;
    }
    return contents;
  }

  public async updateAllPresignedUrls(): Promise<void> {
    try {
      const contents = await this.contentRepo.findAll();
      console.log('contents in updateAllPresignedUrls: ', contents);
      
      if (contents.length === 0) {
        console.log('No contents to update');
        return;
      }
  
      for (const content of contents) {
        const newPresignedUrl = await this.storage.generateLinks(content.fileKey);
        await this.contentRepo.updatePresignedUrl(content.id, newPresignedUrl);
        console.log(`Updated presignedUrl for content ID ${content.id}`);
      }
    } catch (error) {
      console.error('Error updating presigned URLs:', error);
      // Не пробрасывайте ошибку выше, чтобы не ломать очередь
    }
  }

  public async deleteById(id: number): Promise<void> {
    return this.contentRepo.deleteById(id);
  }

  public async deleteContents(userId: number): Promise<void> {
    const contents = await this.contentRepo.findByUserId(userId);

    for (const content of contents) {
      if (content.fileKey) {
        await this.storage.delete(content.fileKey);
      }
    }
  }

  public async getFileStream(fileKey: string): Promise<Readable> {
    return this.storage.getFileStream(fileKey);
  }
}
