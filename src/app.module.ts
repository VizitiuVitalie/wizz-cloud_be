import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './core/config/config';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { StorageModule } from './libs/storage/storage.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Config],
    }),
    UserModule,
    AuthModule,
    SessionModule,
    ContentModule,
    StorageModule,
  ],
})
export class AppModule { }
