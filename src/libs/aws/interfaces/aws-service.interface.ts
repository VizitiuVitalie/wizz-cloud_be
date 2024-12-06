import { Readable } from "stream";

export interface AwsServiceInterface {
    save(file: Express.Multer.File): Promise<string>;
    delete(fileKey: string): Promise<void>;
    generatePublicUrl(fileKey: string): Promise<string>;
    getFileStream(fileKey: string): Promise<Readable>;
}