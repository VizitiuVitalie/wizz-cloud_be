import { Controller, Post, Body, Param, Delete, Inject, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/auth.dto';
import { AuthServiceInterface } from './interfaces/auth.service.interface';
import { LoginDto } from './dto/login.dto';

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

  @Delete('logout/:id')
  public async logout(@Param('id') id: number) {
    return this.authService.logout(id);
  }
}