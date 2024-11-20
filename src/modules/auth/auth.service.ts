import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from "../user/user.repo";
import { AuthDto } from './dto/auth.dto';
import { UserDomain } from "../user/domain/user.domain";
import { SessionEntity } from "../session/domain/session.entity";
import { UserRepoInterface } from "../user/interfaces/user.repo.interface";
import { UserEntity } from "../user/domain/user.entity";
import { SessionRepoInterface } from "../session/interfaces/session.repo.interface";
import { SessionRepo } from "../session/session.repo";
import { AuthTokens } from "./interfaces/auth-tokens.interface";
import { AuthServiceInterface } from "./interfaces/auth.service.interface";


@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor(
        @Inject(UserRepo) private readonly userRepo: UserRepoInterface<UserDomain, UserEntity>,
        @Inject(SessionRepo) private readonly sessionRepo: SessionRepoInterface<SessionEntity>,
        private readonly jwtService: JwtService,
    ) { }

    public async register(dto: AuthDto): Promise<AuthTokens> {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser: UserDomain = {
            id: null,
            fullName: dto.fullName,
            email: dto.email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const user = await this.userRepo.save(newUser);

        const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

        const session = new SessionEntity();
        session.user_id = user.id;
        session.access_token = accessToken;
        session.refresh_token = refreshToken;
        session.created_at = new Date();
        session.updated_at = new Date();

        await this.sessionRepo.save(session);

        return { accessToken, refreshToken };
    }

    public async login(dto: AuthDto): Promise<AuthTokens> {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const accessToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

        const newSession: SessionEntity = {
            id: null,
            user_id: user.id,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            created_at: new Date(),
            updated_at: new Date(),
        }
        await this.sessionRepo.save(newSession);

        return { accessToken, refreshToken }
    }

    public logout(sessionId: number): Promise<void> {
        return this.sessionRepo.deleteById(sessionId);
    }

    
}