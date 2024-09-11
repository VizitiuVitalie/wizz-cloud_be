import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './core/config/config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
    }),
    UserModule,
  ],
})
export class AppModule {}
