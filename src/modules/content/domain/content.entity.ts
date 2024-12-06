import { AbstractEntity } from '../../../shared/entities/abstract.entity';

export class ContentEntity extends AbstractEntity {
  public user_id: number;
  public name: string;
  public type: string;
  public file_key: string;
  public url: string;
  public size: number;
}
