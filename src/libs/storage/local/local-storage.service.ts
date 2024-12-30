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

  public async generatePublicUrl(filePath: string): Promise<string> {
    const fileName = path.basename(filePath);
    return `http://localhost:1222/wizzcloud/files/${fileName}`;
  }

  public async save(file: Express.Multer.File): Promise<string> {
    const filePath = path.join(
      this.destination,
      `${file.originalname}-${uuidv4()}`,
    );
    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  public async delete(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }
}
