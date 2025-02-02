import { Inject, Injectable } from '@nestjs/common';
import { ContentRepoInterface } from './interfaces/content.repo.interface';
import { ContentDomain } from '../content/domain/content.domain';
import { ContentEntity } from '../content/domain/content.entity';
import { DbProvider } from '../../core/db/db.provider';
import { ContentAdapterInterface } from './interfaces/content.adapter.interface';
import { ContentAdapter } from './content.adapter';

@Injectable()
export class ContentRepo
  implements ContentRepoInterface<ContentDomain>
{
  constructor(
    private readonly dbProvider: DbProvider,
    @Inject(ContentAdapter)
    private readonly contentAdapter: ContentAdapterInterface,
  ) {}

  public async save(domain: ContentDomain): Promise<ContentDomain> {
    const [entity] = await this.dbProvider.query<ContentEntity>(
      `INSERT INTO contents (user_id, name, type, file_key, presigned_url, content_path, size, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        domain.userId,
        domain.name,
        domain.type,
        domain.fileKey,
        domain.presignedUrl,
        domain.contentPath,
        domain.size,
        domain.createdAt,
        domain.updatedAt,
      ],
    );

    return this.contentAdapter.FromEntityToDomain(entity);
  }

  public async getUrlsByUserId(userId: number): Promise<{ url: string }[]> {
    const entities = await this.dbProvider.query<{ url: string }>(
      `SELECT presigned_url FROM contents WHERE user_id = $1`,
      [userId],
    );

    return entities;
  }

  public async findAll(): Promise<ContentDomain[]> {
    const entities = await this.dbProvider.query<ContentEntity>(
      `SELECT * FROM contents`,
    );

    return entities.map((entity) =>
      this.contentAdapter.FromEntityToDomain(entity),
    );
  }

  public async findById(id: number): Promise<ContentDomain | null> {
    const [entity] = await this.dbProvider.query<ContentEntity>(
      `SELECT * FROM contents WHERE id = $1 LIMIT 1`,
      [id],
    );

    console.log('repo: ', entity);

    if (!entity) {
      return undefined;
    }

    return this.contentAdapter.FromEntityToDomain(entity);
  }

  public async findByUserId(userId: number): Promise<ContentDomain[]> {
    const entities = await this.dbProvider.query<ContentEntity>(
      `SELECT * FROM contents WHERE user_id = $1`,
      [userId],
    );

    return entities.map((entity) =>
      this.contentAdapter.FromEntityToDomain(entity),
    );
  }

  public async updatePresignedUrl(id: number, presignedUrl: string): Promise<void> {
    const updatedAt = new Date();
    await this.dbProvider.query(
      `UPDATE contents SET presigned_url = $1, updated_at = $2 WHERE id = $3`,
      [presignedUrl, updatedAt, id],
    );
  }

  public async deleteById(id: number): Promise<void> {
    await this.dbProvider.query(`DELETE FROM contents * WHERE id = $1`, [id]);
  }
}
