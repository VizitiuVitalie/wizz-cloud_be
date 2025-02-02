import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { StorageInterface } from '../interfaces/storage.interface';
import { Readable } from 'stream';

@Injectable()
export class LocalStorageService implements StorageInterface {
  private readonly destination: string;

  public constructor(private readonly configService: ConfigService) {
    this.destination = this.configService.get<string>('cloud_storage.path');
  }

  public getFileStream(): Promise<Readable> {
    throw new Error('Method not implemented.');
  }

  public async generateLinks(filePath: string): Promise<string> {
    const contentPath = path.basename(filePath);
    return contentPath;
  }

  public async save(file: Express.Multer.File): Promise<{ fileKey: string, presignedUrl: string }> { //TODO: разобраться с тем что метод не подходит под оба сторейджа(а именно под локальный проблема с path)
    const fileKey = `${file.originalname}-${uuidv4()}`;
    const filePath = path.join(this.destination, fileKey);
    await fs.writeFile(filePath, file.buffer);
    const presignedUrl = await this.generateLinks(filePath);
    return { fileKey, presignedUrl };
  }

  public async delete(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }
}
