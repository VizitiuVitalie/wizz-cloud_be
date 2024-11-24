import { RegisterDto } from "../dto/auth.dto";
import { LoginDto } from "../dto/login.dto";
import { AuthTokens } from "../../../shared/types/auth-tokens.type";

export interface AuthServiceInterface {
    register(dto: RegisterDto): Promise<AuthTokens>;
    login(dto: LoginDto): Promise<AuthTokens>;
    logout(sessionId: number): Promise<void>;
}