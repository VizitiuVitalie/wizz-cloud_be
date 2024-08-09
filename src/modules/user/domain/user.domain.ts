export class UserDomain {
  public id: number;
  public fullName: string;
  public email: string;
  public createdAt: Date;
  public updatedAt: Date;

  public password: string | null;
}
