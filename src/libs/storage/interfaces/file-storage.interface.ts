export interface FileStorageI {
    save(file: Express.Multer.File, destination: string): Promise<string>
    delete(filePath: string): Promise<void>
}