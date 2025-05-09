export class UserDomain {
  public id: number;
  public fullName: string;
  public email: string;
  public password: string | null;
  public verified: boolean;
  public verificationCode: string;
  public createdAt: Date;
  public updatedAt: Date;

}
