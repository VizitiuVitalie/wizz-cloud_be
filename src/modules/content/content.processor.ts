import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ContentService } from './content.service';

@Processor('presignedUrlQueue')
export class PresignedUrlProcessor {
  constructor(private readonly contentService: ContentService) {}

  @Process('updatePresignedUrls')
  async handleUpdatePresignedUrls(job: Job) {
    console.log('Processing job:', job.id);
    await this.contentService.updateAllPresignedUrls();
  }
} 