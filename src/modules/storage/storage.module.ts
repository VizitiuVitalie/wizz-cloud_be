import { Module } from '@nestjs/common';
import { LocalStorage } from './local-storage.service'; // Локальная реализация хранилища
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from 'src/core/config/multer.config'; // Конфигурация Multer

@Module({
  imports: [
    MulterModule.register(multerConfig), // Регистрация конфигурации для Multer
  ],
  providers: [LocalStorage], // Локальная служба для хранения файлов
  exports: [LocalStorage], // Экспорт для использования в других модулях
})
export class StorageModule {}
