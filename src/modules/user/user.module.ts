import { Module } from '@nestjs/common';
import { DbModule } from '../../core/db/db.module';
import { UserAdapter } from './user.adapter';
import { UserController } from './user.controller';
import { UserRepo } from './user.repo';
import { UserService } from './user.service';
import { ContentModule } from '../content/content.module';

@Module({
  imports: [DbModule, ContentModule],
  controllers: [UserController],
  providers: [UserRepo, UserService, UserAdapter],
  exports: [UserService, UserRepo],
})
export class UserModule {}
