import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DbProvider } from '../../core/db/db.provider';
import { UserDomain } from './domain/user.domain';
import { UserEntity } from './domain/user.entity';
import { UserRepoInterface } from './interfaces/user.repo.interface';
import { UserAdapterInterface } from './interfaces/user.adapter.interface';
import { UserAdapter } from './user.adapter';

@Injectable()
export class UserRepo implements UserRepoInterface<UserDomain> {
  constructor(
    private readonly dbProvider: DbProvider,
    @Inject(UserAdapter) private readonly userAdapter: UserAdapterInterface,
  ) {}

  public async save(domain: UserDomain): Promise<UserDomain> {
    try {
      const [entity] = await this.dbProvider.query<UserEntity>(
        `INSERT INTO users (full_name, email, password, verified, verification_code, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          domain.fullName,
          domain.email,
          domain.password,
          domain.verified,
          domain.verificationCode,
          domain.createdAt,
          domain.updatedAt,
        ],
      );

      return this.userAdapter.FromEntityToDomain(entity);
    } catch (error) {
      if (error.code === '23505') { // PostgreSQL error code for unique violation
        throw new BadRequestException('User with this email already exists');
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
    }

  public async getFullName(userId: number): Promise<string> {
    const result = await this.dbProvider.query<{ full_name: string }>(
      `SELECT full_name FROM users WHERE id = $1`,
      [userId],
    );

    return result[0].full_name;
  }

  public async findById(id: number): Promise<UserDomain | null> {
    const [entity] = await this.dbProvider.query<UserEntity>(
      `SELECT * FROM users WHERE id = $1 LIMIT 1`,
      [id],
    );

    console.log('repo: ', entity);

    if (!entity) {
      return null;
    }

    return this.userAdapter.FromEntityToDomain(entity);
  }

  public async findByEmail(email: string): Promise<UserDomain | null> {
    const [entity] = await this.dbProvider.query<UserEntity>(
      `SELECT * FROM users WHERE email = $1 LIMIT 1`,
      [email],
    );

    if (!entity) {
      return null;
    }

    return this.userAdapter.FromEntityToDomain(entity);
  }

  public async findAll(): Promise<UserDomain[] | null> {
    const entities =
      await this.dbProvider.query<UserEntity>(`SELECT * FROM users;`);

    console.log('repo: ', entities);

    if (!entities) {
      return null;
    }

    return entities.map((entity) =>
      this.userAdapter.FromEntityToDomain(entity),
    );
  }

  public async update(domain: UserDomain): Promise<UserDomain> {
    const [updatedEntity] = await this.dbProvider.query<UserEntity>(
      `UPDATE users
       SET full_name = $1,
           email = $2,
           password = $3,
           verified = $4,
            verification_code = $5,
           updated_at = NOW()
       WHERE id = $6
       RETURNING *;`,
      [
        domain.fullName,
        domain.email,
        domain.password,
        domain.verified,
        domain.verificationCode,
        domain.id,
      ],
    );

    return this.userAdapter.FromEntityToDomain(updatedEntity);
  }

  public async deleteById(id: number): Promise<void> {
    await this.dbProvider.query(`DELETE FROM users * WHERE id = $1`, [id]);
  }
}
