import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { StorageModule } from '../../libs/local-storage/local-storage.module';
import { ContentRepo } from './content.repo';
import { DbModule } from 'src/core/db/db.module';
import { AwsModule } from 'src/libs/aws/aws.module';

@Module({
  imports: [DbModule, StorageModule, AwsModule],
  controllers: [ContentController],
  providers: [ContentRepo, ContentService, ContentAdapter],
  exports: [ContentService]
})
export class ContentModule {}