import { Module } from '@nestjs/common';
import { ContentController } from './content.controller';
import { ContentService } from './content.service'; // Импортируем ContentService
import { ContentAdapter } from './content.adapter'; // Импортируем ContentAdapter
import { StorageModule } from '../storage/storage.module'; // Импорт StorageModule
import { ContentRepo } from './content.repo';
import { DbModule } from 'src/core/db/db.module';

@Module({
  imports: [DbModule, StorageModule], // Импорт StorageModule для работы с файлами
  controllers: [ContentController], // Регистрация контроллера
  providers: [ContentRepo, ContentService, ContentAdapter],
  exports: [ContentService]
})
export class ContentModule {}
