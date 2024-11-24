import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '../types/auth-tokens.type';
import { PayloadType } from '../types/payload.type';

export function createTokens(jwtService: JwtService, payload: PayloadType): AuthTokens {
    const accessToken = jwtService.sign(payload, { expiresIn: '30s' });
    const refreshToken = jwtService.sign(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}