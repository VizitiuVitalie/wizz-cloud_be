import {
  Controller,
  Inject,
  Body,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
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

@Controller('content')
export class ContentController {
  constructor(
    @Inject(ContentService)
    private readonly contentService: ContentServiceInterface,
    @Inject(ContentAdapter)
    private readonly contentAdapter: ContentAdapterInterface,
    @Inject(LocalStorage)
    private readonly localStorage: FileStorageI,
  ) {}

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
  public async uploadFiles(
    @Param('userId') userId: number,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body() dto: CreateContentDto,
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
  @Delete(':id')
  public async deleteById(@Param('id') id: number): Promise<void> {
    return this.contentService.deleteById(id);
  }
}
