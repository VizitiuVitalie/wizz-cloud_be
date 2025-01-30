import { AbstractEntity } from '../../../shared/entities/abstract.entity';

export class ContentEntity extends AbstractEntity {
  public user_id: number;
  public name: string;
  public type: string;
  public file_key: string;
  public presigned_url: string;
  public content_path: string;
  public size: number;
}
