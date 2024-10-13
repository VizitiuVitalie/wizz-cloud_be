import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './core/config/config';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
    }),
    UserModule,
    ContentModule,
    StorageModule,
  ],
})
export class AppModule {}
