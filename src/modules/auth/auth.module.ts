// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
// import { AuthController } from './auth.controller';
// import { UsersModule } from '../users/users.module'; // если у вас есть users module

// @Module({
//   imports: [
//     UsersModule,
//     PassportModule,
//     JwtModule.register({
//       secret: 'yourSecretKey', // поместите в .env для безопасности
//       signOptions: { expiresIn: '60m' },
//     }),
//   ],
//   providers: [AuthService, JwtStrategy],
//   controllers: [AuthController],
// })
// export class AuthModule { }
