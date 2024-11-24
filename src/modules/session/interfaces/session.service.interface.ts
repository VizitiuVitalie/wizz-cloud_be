import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { AuthTokens } from "src/shared/types/auth-tokens.type";

export interface SessionServiceInterface<T, E extends AbstractEntity> {
    createSession(userId: number, deviceId: string): Promise<T>;
    updateSession(session: E, tokens: AuthTokens): Promise<void>;
    refreshSession(refreshToken: string): Promise<T>;
}