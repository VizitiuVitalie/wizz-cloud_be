import { AbstractEntity } from "src/shared/entities/abstract.entity";

export interface SessionServiceInterface<E extends AbstractEntity> {
    createSession(userId: number): Promise<E>;
    deleteSession(id: number): Promise<void>;
    findSessionByUserId(userId: number): Promise<E>;
    refreshSession(sessionId: number, newAccessToken: string, newRefreshToken: string): Promise<E>;
}