import { AbstractEntity } from 'src/shared/entities/abstract.entity';

export class UserEntity extends AbstractEntity {
  public fullName: string;
  public email: string;
  public password: string;

  constructor(
    id: number,
    fullName: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
