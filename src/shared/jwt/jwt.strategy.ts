import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepo } from 'src/modules/user/user.repo';
import { UserRepoInterface } from 'src/modules/user/interfaces/user.repo.interface';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/domain/user.entity';
import { PayloadType } from 'src/shared/types/payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService,
        @Inject(UserRepo) private readonly userRepo: UserRepoInterface<UserDto, UserEntity>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('jwt.JWT_SECRET'),
        });
    }

    async validate(payload: PayloadType) {
        const user = await this.userRepo.findById(payload.userId);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { id: user.id, fullName: user.fullName, email: user.email };
    }
}