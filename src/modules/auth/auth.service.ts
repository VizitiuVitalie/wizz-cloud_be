import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserAdapterInterface } from '../user/interfaces/user.adapter.interface';
import { UserAdapter } from '../user/user.adapter';
import { UserRepo } from '../user/user.repo';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UserDomain } from '../user/domain/user.domain';
import { SessionEntity } from '../session/domain/session.entity';
import { UserRepoInterface } from '../user/interfaces/user.repo.interface';
import { SessionRepoInterface } from '../session/interfaces/session.repo.interface';
import { SessionRepo } from '../session/session.repo';
import { AuthTokens } from '../../shared/types/auth-tokens.type';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { PayloadType } from '../../shared/types/payload.type';
import { UserService } from '../user/user.service';
import { UserServiceInterface } from '../user/interfaces/user.service.interface';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/libs/email-verification/email.service';
import { VerifyEmailDto } from 'src/libs/email-verification/verify-email.dto';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject(UserRepo) private readonly userRepo: UserRepoInterface<UserDomain>,
    @Inject(SessionRepo)
    private readonly sessionRepo: SessionRepoInterface<
      AuthTokens,
      SessionEntity
    >,
    @Inject(UserService) private readonly userService: UserServiceInterface,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapterInterface,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private async createSession(
    userId: number,
    deviceId: string,
    tokens: AuthTokens,
  ): Promise<void> {
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

  private async updateSession(
    session: SessionEntity,
    tokens: AuthTokens,
  ): Promise<void> {
    session.access_token = tokens.accessToken;
    session.refresh_token = tokens.refreshToken;
    session.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    session.updated_at = new Date();

    await this.sessionRepo.updateSession(session);
  }

  private validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private createTokens(payload: PayloadType): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.access_secret_key'),
      expiresIn: '2h',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refresh_secret_key'),
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  public async register(dto: RegisterDto): Promise<{ message: string }> {
    if (!this.validateEmail(dto.email)) {
      throw new BadRequestException('Ivalid email format');
    }

    const exist = await this.userRepo.findByEmail(dto.email);
    if (exist) {
      throw new Error('cannot find by email');
    }

    const verificationCode = this.generateVerificationCode();
    await this.emailService.sendVerificationEmail(dto.email, verificationCode);

    const user = this.userAdapter.FromRegisterDtoToDomain(dto, verificationCode)
    await this.userService.create(user);

    return { message: 'Please check your email for verification code' };
  }

  public async verifyEmail({
    email,
    code,
    deviceId,
  }: VerifyEmailDto): Promise<AuthTokens> {
    const user = await this.userRepo.findByEmail(email);
    if (user?.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    user.verified = true;
    user.verificationCode = null;
    await this.userRepo.update(user);

    const tokens = this.createTokens({ userId: user.id });
    await this.createSession(user.id, deviceId, tokens);

    return tokens;
  }

  public async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.verified) {
      throw new ForbiddenException('Email not verified');
    }

    const exist = await this.sessionRepo.findOneByUserIdAndDeviceId(
      user.id,
      dto.deviceId,
    );
    const payload: PayloadType = { userId: user.id };
    const tokens = this.createTokens(payload);

    if (exist) {
      await this.updateSession(exist, tokens);
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
    const tokens = this.createTokens(payload);

    await this.sessionRepo.refreshSession(
      session.id,
      tokens.accessToken,
      tokens.refreshToken,
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  public async logout(accessToken: string): Promise<void> {
    const session = await this.sessionRepo.findOneByAccessToken(accessToken);
    if (!session) {
      throw new ForbiddenException('Session not found');
    }

    await this.sessionRepo.deleteByAccessToken(accessToken);
  }
}
