import {
  Controller,
  Inject,
  Body,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ContentServiceInterface } from './interfaces/content.service.interface';
import { ContentAdapterInterface } from './interfaces/content.adapter.interface';
import { ContentService } from './content.service';
import { ContentAdapter } from './content.adapter';
import { CreateContentDto } from './dto/create-content.dto';
import { ContentDto } from './dto/content.dto';
import { LocalStorage } from '../storage/local-storage.service';
import { FileStorageI } from '../storage/interfaces/file-storage.interface';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async create(
    @Body() dto: CreateContentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ContentDto> {
    // Определяем путь назначения для файла
    const destination = '/home/wizz_dev/Desktop/cloud_storage/' + file.originalname;

    // Сохраняем файл и получаем путь к нему
    const url = await this.localStorage.save(file, destination);

    // Создаём домен с информацией о файле (включая URL)
    const domain = this.contentAdapter.FromCreateContentDtoToDomain({
      ...dto,
      url, // Включаем URL в домен
    });

    // Сохраняем домен в базе данных
    const createdDomain = await this.contentService.create(domain);

    // Возвращаем DTO для клиента
    return this.contentAdapter.FromDomainToDto(createdDomain);
  }

  @Get(':id')
  public async findById(@Param('id') id: number): Promise<ContentDto | null> {
    return this.contentService.findById(id);
  }

  @Get(':user_id')
  public async findByUserId(
    @Param('user_id') userId: number,
  ): Promise<ContentDto | null> {
    return this.contentService.findByUserId(userId);
  }

  @Delete(':id')
  public async deleteById(@Param('id') id: number): Promise<void> {
    return this.contentService.deleteById(id);
  }
}
