import {
  Controller,
  Inject,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UserServiceInterface } from './interfaces/user.service.interface';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { UserAdapter } from './user.adapter';
import { UserService } from './user.service';
import { JwtGuard } from 'src/shared/jwt/jwt.guard';
import { ContentService } from '../content/content.service';
import { ContentServiceInterface } from '../content/interfaces/content.service.interface';
import { UserDto } from './dto/user.dto';

export interface RequestWithUser extends Request {
  user: UserDto;
}

@Controller('user')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserServiceInterface,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapterInterface,
    @Inject(ContentService)
    private readonly contentService: ContentServiceInterface,
  ) {}

  @UseGuards(JwtGuard)
  @Get('fullName/:userId')
  async getFullName(
    @Param('userId') userId: number,
  ): Promise<{ nickname: string }> {
    const fullName = await this.userService.getFullName(userId);
    console.log('nickname: ', fullName);

    return { nickname: fullName };
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteUser(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const user = req.user as UserDto;

    if (Number(user.id) !== Number(id)) {
      throw new ForbiddenException('You do not have permission to delete this account');
    }

    await this.contentService.deleteContents(id);

    await this.userService.deleteUser(id);
  }
}
