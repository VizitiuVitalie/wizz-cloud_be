import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { FileStorageI } from './interfaces/file-storage.interface';

@Injectable()
export class LocalStorage implements FileStorageI {
    public async save(file: Express.Multer.File, destination: string): Promise<string> {
        const filePath = path.join(destination, file.originalname);
        await fs.writeFile(filePath, file.buffer)
        return filePath;
    }
}
