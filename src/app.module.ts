import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Config } from './core/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Config],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
