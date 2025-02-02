import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SessionRepo } from './session.repo';
import { DbModule } from 'src/core/db/db.module';
import { JwtConfigModule } from '../../shared/jwt/jwt-config.module';

@Module({
  imports: [
    ConfigModule,
    JwtConfigModule,
    DbModule,
  ],
  providers: [SessionRepo],
  controllers: [],
  exports: [SessionRepo],
})
export class SessionModule {}