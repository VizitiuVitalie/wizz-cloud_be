import { Module } from '@nestjs/common';
import { DbModule } from '../../core/db/db.module';
import { ContentAdapter } from './content.adapter';

@Module({
  imports: [DbModule],
  controllers: [ContentController],
  providers: [ContentRepo, ContentService, ContentAdapter],
  exports: [ContentService],
})
export class UserModule {}
