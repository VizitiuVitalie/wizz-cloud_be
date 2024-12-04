import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { LocalStorageI } from './interfaces/local-storage.interface';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class LocalStorage implements LocalStorageI {
    public async save(file: Express.Multer.File, destination: string): Promise<string> {
        const filePath = path.join(destination, `${file.originalname}-${uuidv4()}`);
        await fs.writeFile(filePath, file.buffer)
        return filePath;
    }

    public async delete(filePath: string): Promise<void> {
        await fs.unlink(filePath);
    }
}
