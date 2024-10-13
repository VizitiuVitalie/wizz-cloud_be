import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ContentController],
})
export class ContentModule {}
