import { AbstractEntity } from "src/shared/entities/abstract.entity";

export interface SessionRepoInterface<T, E extends AbstractEntity> {
    save(session: E): Promise<E>;
    deleteById(id: number): Promise<void>;
    findOneByUserId(userId: number): Promise<E>;
    findOneByAccessToken(token: string): Promise<E>;
    findOneByRefreshToken(refreshToken: string): Promise<E>;
    findOneByUserIdAndDeviceId(userId: number, deviceId: string): Promise<E>;
    updateSession(session: E): Promise<E>;
    refreshSession(sessionId: number, newAccessToken: string, newRefreshToken: string): Promise<T>;
}