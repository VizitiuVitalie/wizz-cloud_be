import { DomainAdapterInterface } from '../../../shared/interfaces/domain.adapter.interface';
import { ContentDto } from '../dto/content.dto';
import { ContentDomain } from '../domain/content.domain';
import { ContentEntity } from '../domain/content.entity';

export interface ContentAdapterInterface
  extends DomainAdapterInterface<ContentDto, ContentDomain, ContentEntity> {}
