import { ContentDto } from './dto/content.dto';
import { ContentDomain } from './domain/content.domain';
import { ContentEntity } from './domain/content.entity';
import { ContentAdapterInterface } from './interfaces/content.adapter.interface';
import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';

@Injectable()
export class ContentAdapter implements ContentAdapterInterface {
  public FromDtoToDomain(dto: ContentDto): ContentDomain {
    return {
      id: dto.id,
      userId: dto.userId,
      type: dto.type,
      url: dto.url,
      size: dto.size,
      createdAt: dto.createdAt,
      updatedAt: undefined,
    };
  }

  public FromDomainToDto(domain: ContentDomain): ContentDto {
    return {
      id: domain.id,
      userId: domain.userId,
      type: domain.type,
      url: domain.url,
      size: domain.size,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  public FromDomainToEntity(domain: ContentDomain): ContentEntity {
    return {
      id: domain.id,
      user_id: domain.userId,
      type: domain.type,
      url: domain.url,
      size: domain.size,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }

  public FromEntityToDomain(entity: ContentEntity): ContentDomain {
    return {
      id: entity.id,
      userId: entity.user_id,
      type: entity.type,
      url: entity.url,
      size: entity.size,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    };
  }

  public FromCreateContentDtoToDomain(dto: CreateContentDto): ContentDomain {
    return {
      id: dto.id,
      userId: dto.id,
      type: dto.type,
      url: dto.url,
      size: dto.size,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
