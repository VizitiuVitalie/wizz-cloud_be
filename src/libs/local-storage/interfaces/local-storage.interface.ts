export interface LocalStorageServiceI {
    save(file: Express.Multer.File, destination: string): Promise<string>
    delete(filePath: string): Promise<void>
    generatePublicUrl(filePath: string): Promise<string>
}