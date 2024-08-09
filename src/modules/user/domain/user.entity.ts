import { AbstractEntity } from '../../../shared/entities/abstract.entity';

export class UserEntity extends AbstractEntity {
  public fullName: string;
  public email: string;
  public password: string;
}
