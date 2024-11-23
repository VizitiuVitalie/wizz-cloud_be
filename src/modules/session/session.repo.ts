import { Inject, Injectable } from '@nestjs/common';
import { DbProvider } from 'src/core/db/db.provider';
import { SessionEntity } from './domain/session.entity';
import { SessionRepoInterface } from './interfaces/session.repo.interface';

@Injectable()
export class SessionRepo implements SessionRepoInterface<SessionEntity> {
    constructor(private readonly dbProvider: DbProvider) { }

    public async save(session: SessionEntity): Promise<SessionEntity> {
        const [entity] = await this.dbProvider.query<SessionEntity>(
            `INSERT INTO sessions (user_id, access_token, refresh_token, expires_at, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                session.user_id,
                session.access_token,
                session.refresh_token,
                session.expires_at,
                session.created_at,
                session.updated_at,
            ],
        )

        return entity
    }

    public async findOneByUserId(userId: number): Promise<SessionEntity> {
        const [entity] = await this.dbProvider.query<SessionEntity>(
            `SELECT * FROM sessions WHERE user_id = $1 LIMIT 1`,
            [userId],
        )

        return entity
    }

    public async findOneByRefreshToken(refreshToken: string): Promise<SessionEntity> {
        const [entity] = await this.dbProvider.query<SessionEntity>(
            `SELECT * FROM sessions WHERE refresh_token = $1 LIMIT 1`,
            [refreshToken],
        )

        return entity
    }

    public async refreshSession(sessionId: number, newAccessToken: string, newRefreshToken: string): Promise<SessionEntity> {
        const [entity] = await this.dbProvider.query<SessionEntity>(
            `UPDATE sessions SET access_token = $1, refresh_token = $2, updated_at = $3 WHERE id = $4 RETURNING *`,
            [newAccessToken, newRefreshToken, new Date(), sessionId],
        )

        return entity
    }


    public async deleteById(id: number): Promise<void> {
        await this.dbProvider.query(
            `DELETE FROM sessions WHERE id = $1`,
            [id],
        )
    }
}