import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '../types/auth-tokens.type';
import { PayloadType } from '../types/payload.type';
import { ConfigService } from '@nestjs/config';

export function createTokens(payload: PayloadType, jwtService: JwtService, configService: ConfigService): AuthTokens {
    const accessToken = jwtService.sign(payload, {
        secret: configService.get<string>('jwt.ACCESS_SECRET_KEY'),
        expiresIn: '3m',
    });
    const refreshToken = jwtService.sign(payload, {
        secret: configService.get<string>('jwt.REFRESH_SECRET_KEY'),
        expiresIn: '7d',
    });
    return { accessToken, refreshToken };
}