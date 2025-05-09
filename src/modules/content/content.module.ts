import { Module } from '@nestjs/common';
import { StorageModule } from '../../libs/storage/storage.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { ContentRepo } from './content.repo';
import { DbModule } from 'src/core/db/db.module';
import { BullModule } from '@nestjs/bull';
import { PresignedUrlProcessor } from './content.processor';

@Module({
  imports: [
    DbModule,
    StorageModule,
    BullModule.forRoot({
      redis: {
        host: 'wizzcloud-redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'presignedUrlQueue',
    }),
  ],
  controllers: [ContentController],
  providers: [
    ContentRepo,
    ContentService,
    ContentAdapter,
    PresignedUrlProcessor,
  ],
  exports: [ContentService],
})
export class ContentModule {}
