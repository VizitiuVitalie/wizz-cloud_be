export class ContentDto {
    id: number;
    userId: number;
    name: string;
    type: string;
    fileKey: string;
    presignedUrl: string;
    contentPath: string;
    size: number;
    createdAt: Date;
    updatedAt: Date;
}