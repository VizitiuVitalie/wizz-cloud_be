import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { StorageModule } from '../../libs/local-storage/local-storage.module';
import { ContentRepo } from './content.repo';
import { DbModule } from 'src/core/db/db.module';

@Module({
  imports: [DbModule, StorageModule],
  controllers: [ContentController],
  providers: [ContentRepo, ContentService, ContentAdapter],
  exports: [ContentService]
})
export class ContentModule {}
