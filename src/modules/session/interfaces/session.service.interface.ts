import { AbstractEntity } from "src/shared/entities/abstract.entity";
import { AuthTokens } from "src/modules/auth/interfaces/auth-tokens.interface";

export interface SessionServiceInterface<T, E extends AbstractEntity> {
    refreshSession(refreshToken: string): Promise<T>;
}