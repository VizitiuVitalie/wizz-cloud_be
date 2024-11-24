import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepo } from './session.repo';
import { DbModule } from 'src/core/db/db.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    DbModule,
  ],
  providers: [SessionService, SessionRepo],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}