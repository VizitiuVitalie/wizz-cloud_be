import { AuthDto } from "../dto/auth.dto";
import { AuthTokens } from "./auth-tokens.interface";

export interface AuthServiceInterface {
    register(dto: AuthDto): Promise<AuthTokens>;
    login(dto: AuthDto): Promise<AuthTokens>;
    logout(sessionId: number): Promise<void>;
}