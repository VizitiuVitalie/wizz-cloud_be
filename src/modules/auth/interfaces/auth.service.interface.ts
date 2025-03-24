import { RegisterDto, LoginDto } from '../dto/auth.dto';
import { AuthTokens } from '../../../shared/types/auth-tokens.type';
import { VerifyEmailDto } from 'src/libs/email-verification/verify-email.dto';

export interface AuthServiceInterface {
  register(dto: RegisterDto): Promise<{ message: string }>;
  login(dto: LoginDto): Promise<AuthTokens>;
  refreshSession(refreshToken: string): Promise<AuthTokens>;
  logout(accessToken: string): Promise<void>;
  verifyEmail(dto: VerifyEmailDto): Promise<AuthTokens>;
}
