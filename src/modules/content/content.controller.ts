import {
  Controller,
  Inject,
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
import { StorageInterface } from '../../libs/storage/interfaces/storage.interface';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentAdapterInterface } from './interfaces/content.adapter.interface';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { CreateContentDto } from './dto/create-content.dto';
import { ContentDto } from './dto/content.dto';
import { JwtGuard } from '../../shared/jwt/jwt.guard';
import { Request, Response } from 'express';
import { UserDto } from '../user/dto/user.dto';
import { AwsService } from 'src/libs/storage/aws/aws.service';

@Controller('content')
export class ContentController {
  constructor(
    @Inject(ContentService)
    private readonly contentService: ContentServiceInterface,
    @Inject(ContentAdapter)
    private readonly contentAdapter: ContentAdapterInterface,
    @Inject(AwsService) private readonly storage: StorageInterface,
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
  public async uploadContent(
    @Param('userId') userId: number,
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Req() req: Request,
  ): Promise<ContentDto[]> {
    const user = req.user as UserDto;

    console.log('controller: ', typeof user.id, typeof userId);

    if (user.id != userId) {
      throw new ForbiddenException(
        'You do not have permission to upload content for this user',
      );
    }

    if (!files?.files?.length) {
      throw new Error('No files uploaded');
    }

    const savedContents: ContentDto[] = [];

    for (const file of files.files) {

      const contentData: CreateContentDto = {
        id: null,
        userId: userId,
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      };
      const domain = this.contentAdapter.FromCreateContentDtoToDomain(contentData);
      const createdDomain = await this.contentService.uploadContent(
        domain,
        file,
      );

      savedContents.push(this.contentAdapter.FromDomainToDto(createdDomain));
    }

    return savedContents;
  }

  @UseGuards(JwtGuard)
  @Get('bucket/id/:id')
  public async getBucketContentById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const content = await this.contentService.findById(id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const user = req.user as UserDto;

    if (content.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to view this content',
      );
    }

    const fileStream = await this.contentService.getFileStream(content.fileKey);
    res.setHeader('Content-Type', content.type);
    fileStream.pipe(res);
  }

  @UseGuards(JwtGuard)
  @Get('bucket/list')
  public async getBucketUserContents(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const user = req.user as UserDto;
    const contents = await this.contentService.findByUserId(user.id);

    if (!contents.length) {
      return res.json([]);
    }

    const files = contents.map((content) => ({
      id: content.id,
      userId: content.userId,
      name: content.name,
      type: content.type,
      fileKey: content.fileKey,
      presignedUrl: content.presignedUrl,
      contentPath: content.contentPath,
      size: content.size,
      createdAt: content.createdAt,
      updatedAt: content.updatedAt,
    }));

    res.json(files);
  }

  @UseGuards(JwtGuard)
  @Get('download/:id')
  public async downloadContent(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const content = await this.contentService.findById(id);
    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const user = req.user as UserDto;
    if (content.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to download this content',
      );
    }

    console.log('hui', content.type);
    
    try {
      const fileStream = await this.contentService.getFileStream(
        content.fileKey,
      );
      res.set({
        'Content-Type': content.type,
        'Content-Disposition': `attachment; filename=${content.name}`,
      });
      fileStream.pipe(res);
    } catch (err) {
      console.error('Error fetching file from S3:', err);
      throw new NotFoundException('File not found in S3 bucket');
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  public async deleteById(
    @Param('id') id: number,
    @Req() req: Request,
  ): Promise<void> {
    const content = await this.contentService.findById(id);
    if (!content) {
      throw new NotFoundException('File not found');
    }

    const user = req.user as UserDto;

    if (content.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this file',
      );
    }

    if (content.fileKey) {
      await this.storage.delete(content.fileKey);
    }

    return this.contentService.deleteById(id);
  }
}
