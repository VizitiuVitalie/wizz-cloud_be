export class UserDomain {
  public id!: number;
  public fullName: string;
  public email: string;
  public password: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  constructor(
    id: number,
    fullName: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
