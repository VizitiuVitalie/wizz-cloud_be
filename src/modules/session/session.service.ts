import { Inject, Injectable } from '@nestjs/common';
import { SessionServiceInterface } from './interfaces/session.service.interface';
import { SessionEntity } from './domain/session.entity';
import { SessionRepo } from './session.repo';
import { SessionRepoInterface } from './interfaces/session.repo.interface';

@Injectable()
export class SessionService implements SessionServiceInterface<SessionEntity> {
    public constructor(
        @Inject(SessionRepo) private readonly sessionRepo: SessionRepoInterface<SessionEntity>,
    ) { }
}
