import { UserDomain } from '../domain/user.domain';

export interface UserServiceInterface {
  create(domain: UserDomain): Promise<UserDomain>;
  findById(id: number): Promise<UserDomain | null>;
  updateById(domain: UserDomain): Promise<UserDomain>;
  deleteById(id: number): Promise<void>;
}
