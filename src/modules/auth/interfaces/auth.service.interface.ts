import { AuthDto } from "../dto/auth.dto";
import { AuthTokens } from "./auth-tokens.interface";

export interface AuthServiceInterface {
    register(dto: AuthDto): Promise<any>;
    login(dto: AuthDto): Promise<any>;
    logout(sessionId: number): Promise<void>;
}