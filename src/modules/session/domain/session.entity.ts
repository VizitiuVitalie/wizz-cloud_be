import { AbstractEntity } from "src/shared/entities/abstract.entity";

export class SessionEntity extends AbstractEntity {
  public user_id: number;
  public access_token: string;
  public refresh_token: string;
  public expires_at: Date;
}