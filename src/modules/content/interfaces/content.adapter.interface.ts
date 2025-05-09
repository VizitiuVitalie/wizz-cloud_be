import { DomainAdapterInterface } from '../../../shared/interfaces/domain.adapter.interface';
import { ContentDto } from '../dto/content.dto';
import { ContentDomain } from '../domain/content.domain';
import { ContentEntity } from '../domain/content.entity';
import { CreateContentDto } from '../dto/create-content.dto';

export interface ContentAdapterInterface
  extends DomainAdapterInterface<ContentDto, ContentDomain, ContentEntity> {
    FromCreateContentDtoToDomain(dto: CreateContentDto): ContentDomain;
  }
