import { Injectable, Inject, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepo } from 'src/modules/user/user.repo';
import { UserRepoInterface } from 'src/modules/user/interfaces/user.repo.interface';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { PayloadType } from 'src/shared/types/payload.type';
import { SessionRepo } from '../../modules/session/session.repo';
import { SessionRepoInterface } from '../../modules/session/interfaces/session.repo.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @Inject(UserRepo) private readonly userRepo: UserRepoInterface<UserDto, UserEntity>,
        @Inject(SessionRepo) private readonly sessionRepo: SessionRepoInterface<any, any>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.ACCESS_SECRET_KEY'),
        });
    }

    async validate(payload: PayloadType, context: ExecutionContext) {
        const user = await this.userRepo.findById(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        const request = context.switchToHttp().getRequest();
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

        const session = await this.sessionRepo.findOneByAccessToken(token) || await this.sessionRepo.findOneByRefreshToken(token);
        if (!session) {
            throw new UnauthorizedException('Token not found or revoked');
        }

        return { id: user.id, fullName: user.fullName, email: user.email };
    }
}