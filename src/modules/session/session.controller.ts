import { Controller, Inject, Post, Body } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionServiceInterface } from "./interfaces/session.service.interface";
import { AuthTokens } from "../../shared/types/auth-tokens.type";
import { SessionEntity } from "./domain/session.entity";
import { RefreshSessionDto } from "./dto/refresh-session.dto";

@Controller('session')
export class SessionController {
    constructor(@Inject(SessionService) private readonly sessionService: SessionServiceInterface<AuthTokens, SessionEntity>) { }

    @Post('refresh')
    public async refreshSession(@Body() dto: RefreshSessionDto) {
        return this.sessionService.refreshSession(dto.refreshToken);
    }
}