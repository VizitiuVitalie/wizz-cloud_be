import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { AuthTokens } from "src/shared/types/auth-tokens.type";

export interface SessionServiceInterface<T, E extends AbstractEntity> {
    refreshSession(refreshToken: string): Promise<T>;
}