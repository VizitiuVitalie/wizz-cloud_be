import { RegisterDto, LoginDto } from "../dto/auth.dto";
import { AuthTokens } from "../../../shared/types/auth-tokens.type";

export interface AuthServiceInterface {
    register(dto: RegisterDto): Promise<AuthTokens>;
    login(dto: LoginDto): Promise<AuthTokens>;
    refreshSession(refreshToken: string): Promise<AuthTokens>;
    logout(accessToken: string): Promise<void>;
}