export class UserDto {
  public id: number;
  public fullName: string;
  public email: string;
  public verified: boolean;
  public verificationCode: string;
  public createdAt: Date;
  public updatedAt: Date;
}
