import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionServiceInterface } from './interfaces/session.service.interface';
import { SessionEntity } from './domain/session.entity';
import { SessionRepo } from './session.repo';
import { SessionRepoInterface } from './interfaces/session.repo.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens } from '../../shared/types/auth-tokens.type';

@Injectable()
export class SessionService implements SessionServiceInterface<AuthTokens, SessionEntity> {
    public constructor(
        @Inject(SessionRepo) private readonly sessionRepo: SessionRepoInterface<AuthTokens, SessionEntity>,
        private readonly jwtService: JwtService,
    ) { }

    public async refreshSession(refreshToken: string): Promise<AuthTokens> {
        const session = await this.sessionRepo.findOneByRefreshToken(refreshToken);
        if (!session) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newAccessToken = this.jwtService.sign({ sub: session.user_id }, { expiresIn: '1h' });
        const newRefreshToken = this.jwtService.sign({ sub: session.user_id }, { expiresIn: '7d' });

        await this.sessionRepo.refreshSession(session.id, newAccessToken, newRefreshToken);

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
}
