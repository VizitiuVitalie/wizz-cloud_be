import { Module } from '@nestjs/common';
import { StorageModule } from '../../libs/storage/storage.module';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { ContentRepo } from './content.repo';
import { DbModule } from 'src/core/db/db.module';

@Module({
  imports: [DbModule, StorageModule],
  controllers: [ContentController],
  providers: [ContentRepo, ContentService, ContentAdapter],
  exports: [ContentService]
})
export class ContentModule {}
