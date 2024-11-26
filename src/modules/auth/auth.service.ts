import { ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from "../user/user.repo";
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserDomain } from "../user/domain/user.domain";
import { SessionEntity } from "../session/domain/session.entity";
import { UserRepoInterface } from "../user/interfaces/user.repo.interface";
import { UserEntity } from "../user/domain/user.entity";
import { SessionRepoInterface } from "../session/interfaces/session.repo.interface";
import { SessionRepo } from "../session/session.repo";
import { AuthTokens } from "../../shared/types/auth-tokens.type";
import { AuthServiceInterface } from "./interfaces/auth.service.interface";
import { PayloadType } from "../../shared/types/payload.type";
import { createTokens } from "../../shared/utils/createTokens";
import { UserService } from "../user/user.service";
import { UserServiceInterface } from "../user/interfaces/user.service.interface";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService implements AuthServiceInterface {
    constructor(
        @Inject(UserRepo) private readonly userRepo: UserRepoInterface<UserDomain, UserEntity>,
        @Inject(SessionRepo) private readonly sessionRepo: SessionRepoInterface<AuthTokens, SessionEntity>,
        @Inject(UserService) private readonly userService: UserServiceInterface,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    private async createSession(userId: number, deviceId: string, tokens: AuthTokens): Promise<void> {
        const session = new SessionEntity();
        session.user_id = userId;
        session.device_id = deviceId;
        session.access_token = tokens.accessToken;
        session.refresh_token = tokens.refreshToken;
        session.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        session.created_at = new Date();
        session.updated_at = new Date();

        await this.sessionRepo.save(session);
    }

    private async updateSession(session: SessionEntity, tokens: AuthTokens): Promise<void> {
        session.access_token = tokens.accessToken;
        session.refresh_token = tokens.refreshToken;
        session.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        session.updated_at = new Date();

        await this.sessionRepo.updateSession(session);
    }

    public async register(dto: RegisterDto): Promise<AuthTokens> {

        const newUser: UserDomain = {
            id: null,
            fullName: dto.fullName,
            email: dto.email,
            password: dto.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const user = await this.userService.create(newUser);

        const payload: PayloadType = { userId: user.id };
        const tokens = createTokens(payload, this.jwtService, this.configService);

        await this.createSession(user.id, dto.deviceId, tokens);

        return tokens;
    }

    public async login(dto: LoginDto): Promise<AuthTokens> {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const existingSession = await this.sessionRepo.findOneByUserIdAndDeviceId(user.id, dto.deviceId);
        const payload: PayloadType = { userId: user.id };
        const tokens = createTokens(payload, this.jwtService, this.configService);

        if (existingSession) {
            await this.updateSession(existingSession, tokens);
        } else {
            await this.createSession(user.id, dto.deviceId, tokens);
        }

        return tokens;
    }

    public async refreshSession(refreshToken: string): Promise<AuthTokens> {
        const session = await this.sessionRepo.findOneByRefreshToken(refreshToken);
        if (!session) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const payload: PayloadType = { userId: session.user_id };
        const tokens = createTokens(payload, this.jwtService, this.configService);

        await this.sessionRepo.refreshSession(session.id, tokens.accessToken, tokens.refreshToken);

        return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }

    public async logout(accessToken: string): Promise<void> {
        const session = await this.sessionRepo.findOneByAccessToken(accessToken);
        if (!session) {
            throw new ForbiddenException('Session not found');
        }

        await this.sessionRepo.deleteByAccessToken(accessToken);
    }
}