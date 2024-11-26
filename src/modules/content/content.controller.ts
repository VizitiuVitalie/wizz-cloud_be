import {
  Controller,
  Inject,
  Body,
  Post,
  Get,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Req,
  Res,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentAdapterInterface } from './interfaces/content.adapter.interface';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { CreateContentDto } from './dto/create-content.dto';
import { ContentDto } from './dto/content.dto';
import { LocalStorage } from '../../libs/storage/local-storage.service';
import { FileStorageI } from '../../libs/storage/interfaces/file-storage.interface';
import { JwtGuard } from '../../shared/jwt/jwt.guard';
import { Request, Response } from 'express';
import { UserDto } from '../user/dto/user.dto';
import { promises as fs } from 'fs';
import * as path from 'path';


@Controller('content')
export class ContentController {
  constructor(
    @Inject(ContentService)
    private readonly contentService: ContentServiceInterface,
    @Inject(ContentAdapter)
    private readonly contentAdapter: ContentAdapterInterface,
    @Inject(LocalStorage)
    private readonly localStorage: FileStorageI,
  ) { }

  @UseGuards(JwtGuard)
  @Post('/:userId')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (
          ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)
        ) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  )
  public async uploadContent(
    @Param('userId') userId: number,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
  ): Promise<ContentDto[]> {
    if (!files?.files?.length) {
      throw new Error('No files uploaded');
    }

    const savedContents: ContentDto[] = [];

    for (const file of files.files) {
      const fileUrl = await this.localStorage.save(
        file,
        `/home/wizzdev/Desktop/cloud_storage/`,
      );

      const contentData: CreateContentDto = {
        id: null,
        userId: userId,
        url: fileUrl,
        type: file.mimetype,
        size: file.size,
      };

      const domain = this.contentAdapter.FromCreateContentDtoToDomain(contentData);
      const createdDomain = await this.contentService.create(domain);

      savedContents.push(this.contentAdapter.FromDomainToDto(createdDomain));
    }

    return savedContents;
  }

  @UseGuards(JwtGuard)
  @Get('ById/:id')
  public async findById(@Param('id') id: number): Promise<ContentDto | null> {
    return this.contentService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Get('ByUserId/:userId')
  public async findByUserId(@Param('userId') userId: number): Promise<ContentDto[] | null> {
    const content = await this.contentService.findByUserId(userId);
    return content;
  }

  @UseGuards(JwtGuard)
  @Get('download/:id')
  public async downloadContent(@Param('id') id: number, @Req() req: Request, @Res() res: Response): Promise<void> {
    const content = await this.contentService.findById(id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const user = req.user as UserDto;

    if (content.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to download this content');
    }

    const filePath = path.resolve(content.url);

    try {
      await fs.access(filePath); // Проверка существования файла
      res.download(filePath, (err) => {
        if (err) {
          throw new NotFoundException('File not found');
        }
      });
    } catch (err) {
      throw new NotFoundException('File not found');
    }
  }

  @UseGuards(JwtGuard)
  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 1 }], {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (
          ['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)
        ) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    }),
  )
  public async updateContent(
    @Param('id') id: number,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Req() req: Request,
  ): Promise<ContentDto> {
    console.log('Uploaded files:', files); // Логирование загруженных файлов


    if (!files?.files?.length) {
      throw new Error('No files uploaded');
    }

    const content = await this.contentService.findById(id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const user = req.user as UserDto;

    if (content.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to update this content');
    }

    const file = files.files[0];
    const fileUrl = await this.localStorage.save(
      file,
      `/home/wizzdev/Desktop/cloud_storage/`
    );

    content.url = fileUrl;
    content.type = file.mimetype;
    content.size = file.size;
    content.updatedAt = new Date();

    const updatedDomain = await this.contentService.update(content);

    return this.contentAdapter.FromDomainToDto(updatedDomain);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteById(@Param('id') id: number, @Req() req: Request): Promise<void> {
    const content = await this.contentService.findById(id);
    if (!content) {
      throw new NotFoundException('File not found');
    }

    const user = req.user as UserDto;

    if (content.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this file');
    }

    await this.localStorage.delete(content.url);
    return this.contentService.deleteById(id);
  }
}
