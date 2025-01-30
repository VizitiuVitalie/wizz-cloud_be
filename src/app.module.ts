import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './core/config/config';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { AuthModule } from './modules/auth/auth.module';
import { SessionModule } from './modules/session/session.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ContentService } from './modules/content/content.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'cloud_storage'),
      serveRoot: '/wizzcloud/files',
    }),
    UserModule,
    AuthModule,
    SessionModule,
    ContentModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly contentService: ContentService) {}

  async onModuleInit() {
    await this.contentService.updateAllPresignedUrls();
  }
}
