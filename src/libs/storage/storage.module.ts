import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsService } from './aws/aws.service';
import { LocalStorageService } from './local/local-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [AwsService, LocalStorageService],
  exports: [AwsService, LocalStorageService],
})
export class StorageModule {}
