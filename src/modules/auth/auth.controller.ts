import { Controller, Post, Body, Param, Delete, Inject, Put } from '@nestjs/common';
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

  @Put('refresh/:refreshToken')
  public async refresh(@Param('refreshToken') refreshToken: string) {
    return this.authService.refreshSession(refreshToken);
  } 

  @Delete('logout/:id')
  public async logout(@Param('id') id: number) {
    return this.authService.logout(id);
  }
}