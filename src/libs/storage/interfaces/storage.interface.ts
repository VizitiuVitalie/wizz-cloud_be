import { Readable } from "stream";

export interface StorageInterface {
    save(file: Express.Multer.File): Promise<{ fileKey: string, presignedUrl: string}>;
    delete(fileKey: string): Promise<void>;
    generateLinks(fileKey: string, filePath?: string): Promise<string>;
    getFileStream(fileKey: string): Promise<Readable>;
}
