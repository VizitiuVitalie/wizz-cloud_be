import { Controller, Post, Body, Param, Inject, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { JwtGuard } from '../../shared/jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthServiceInterface) { }

  @Post('register')
  public async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('logout/:id')
  @UseGuards(JwtGuard)
  public async logout(@Param('id') id: number) {
    return this.authService.logout(id);
  }

  @Post('refresh')
  public async refresh(@Headers('authorization') authHeader: string) {
    const refreshToken = authHeader.replace('Bearer ', '');
    return this.authService.refreshSession(refreshToken);
  }
}