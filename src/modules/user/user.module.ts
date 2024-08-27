import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepo } from './user.repo';
import { UserAdapter } from './user.adapter';
import { DbProvider } from 'src/core/db/db.provider';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'UserServiceInterface',
      useClass: UserService,
    },
    {
      provide: 'UserRepoInterface',
      useClass: UserRepo,
    },
    {
      provide: 'UserAdapterInterface',
      useClass: UserAdapter,
    },
    DbProvider,
  ],
  exports: [
    UserService,
    UserRepo,
    UserAdapter, // Экспортируйте, если нужно использовать в других модулях
  ],
})
export class UserModule {}
