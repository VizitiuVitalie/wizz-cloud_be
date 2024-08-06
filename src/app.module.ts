import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from './database/database.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [DatabaseProvider],
})
export class AppModule {}
