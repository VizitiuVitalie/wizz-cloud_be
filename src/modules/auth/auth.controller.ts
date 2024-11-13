import { Controller, Post, Body, Param, Delete, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthServiceInterface } from './interfaces/auth.service.interface';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthServiceInterface) { }

  @Post('register')
  public async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: AuthDto) {
    return this.authService.login(dto)
  }

  @Delete('logout/:bearer')
  public async logout(@Param('bearer') bearer: string) {
    return this.authService.logout(bearer);
  }
}