import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../shared/jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { DbModule } from 'src/core/db/db.module';
import { SessionRepo } from '../session/session.repo';
import { JwtGuard } from '../../shared/jwt/jwt.guard';
import { JwtConfigModule } from 'src/shared/jwt/jwt-config.module';

@Module({
  imports: [
    DbModule,
    UserModule,
    PassportModule,
    JwtConfigModule,
  ],
  providers: [AuthService, JwtStrategy, JwtGuard, SessionRepo],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
