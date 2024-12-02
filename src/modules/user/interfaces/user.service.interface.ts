import { UserDomain } from '../domain/user.domain';

export interface UserServiceInterface {
  create(domain: UserDomain): Promise<UserDomain>;
  getFullName(userId: number): Promise<string>;
}
