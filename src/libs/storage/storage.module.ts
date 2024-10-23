import { Module } from '@nestjs/common';
import { LocalStorage } from './local-storage.service';

@Module({
  providers: [LocalStorage],
  exports: [LocalStorage],
})
export class StorageModule {}
