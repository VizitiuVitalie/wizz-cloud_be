import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageInterface } from '../interfaces/storage.interface';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class AwsService implements StorageInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.access_key_id'),
        secretAccessKey: this.configService.get<string>('aws.secret_access_key'),
      },
    });
    this.bucketName = this.configService.get<string>('aws.bucket_name');
  }

  public async generateLinks(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    const presignedUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 });
    console.log('presignedUrl in aws.service: ', presignedUrl);
    
    return presignedUrl;
  }

  public async save(file: Express.Multer.File): Promise<{ fileKey: string, presignedUrl: string}> {
    const fileKey = `${uuidv4()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        size: file.size.toString(),
      }
    });
    await this.s3Client.send(command);
    const presignedUrl = await this.generateLinks(fileKey);
    return { fileKey, presignedUrl };
  }

  public async getFileStream(fileKey: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    })
    const response = await this.s3Client.send(command);
    return response.Body as Readable;
  }

  public async delete(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    await this.s3Client.send(command);
  }
}
