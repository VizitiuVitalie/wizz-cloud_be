import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './core/config/config';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { StorageModule } from './libs/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    ContentModule,
    StorageModule,
  ],
})
export class AppModule {}
