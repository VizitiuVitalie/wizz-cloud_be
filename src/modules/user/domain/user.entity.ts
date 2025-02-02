import { AbstractEntity } from '../../../shared/entities/abstract.entity';

export class UserEntity extends AbstractEntity {
  public full_name: string;
  public email: string;
  public password: string;
  public verified: boolean;
  public verification_code: string;
}
