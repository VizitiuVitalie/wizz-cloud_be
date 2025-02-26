import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
import { spawn } from 'child_process';
const ffmpegPath = require('ffmpeg-static');

@Injectable()
export class AwsService implements StorageInterface {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly ffmpegTimeout: number;
  private readonly maxFileSize: number;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
    
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    this.ffmpegTimeout = this.configService.get<number>('FFMPEG_TIMEOUT');
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE');
  }

  private async transcodeVideo(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const args = [
        '-hide_banner',
        '-loglevel', 'error',
        '-i', 'pipe:0',
        '-f', 'mp4',
        '-vcodec', 'libx264',
        '-preset', 'ultrafast', // Максимальная скорость
        '-crf', '28',           // Немного ниже качество для скорости
        '-acodec', 'aac',
        '-movflags', 'frag_keyframe+empty_moov',
        '-threads', '2',        // Ограничение потоков
        '-y',
        'pipe:1'
      ];

      const ffmpeg = spawn(ffmpegPath, args, {
        stdio: ['pipe', 'pipe', 'inherit']
      });

      const chunks: Buffer[] = [];
      let timeoutHandle: NodeJS.Timeout;

      const handleTimeout = () => {
        ffmpeg.kill('SIGKILL');
        reject(new Error(`Video processing timeout after ${this.ffmpegTimeout}ms`));
      };

      timeoutHandle = setTimeout(handleTimeout, this.ffmpegTimeout);

      ffmpeg.stdout.on('data', (chunk) => chunks.push(chunk));

      ffmpeg.on('close', (code) => {
        clearTimeout(timeoutHandle);
        if (code === 0) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.stdin.on('error', (error) => {
        if ((error as NodeJS.ErrnoException).code === 'EPIPE') {
          console.warn('FFmpeg input closed early');
        } else {
          clearTimeout(timeoutHandle);
          reject(error);
        }
      });

      ffmpeg.stdin.write(buffer);
      ffmpeg.stdin.end();
    });
  }

  public async generateLinks(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    
    try {
      return await getSignedUrl(this.s3Client, command, { 
        expiresIn: 1800
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate URL');
    }
  }

  public async save(
    file: Express.Multer.File
  ): Promise<{ fileKey: string; presignedUrl: string }> {
    try {
      // 1. Проверка размера файла
      if (file.size > this.maxFileSize) {
        throw new Error(`File size exceeds limit: ${this.maxFileSize} bytes`);
      }

      // 2. Транскодирование видео
      let originalName = file.originalname;
      if (file.mimetype.startsWith('video/')) {
        console.log(`Transcoding video: ${originalName}`);
        const transcodedBuffer = await this.transcodeVideo(file.buffer);
        file.buffer = transcodedBuffer;
        file.mimetype = 'video/mp4';
        originalName = originalName.replace(/\.[^/.]+$/, '.mp4');
      }

      // 3. Загрузка в S3
      const fileKey = `${uuidv4()}-${originalName}`;
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          original_size: file.size.toString(),
          processed_size: file.buffer.length.toString(),
        },
      });

      await this.s3Client.send(uploadCommand);
      return {
        fileKey,
        presignedUrl: await this.generateLinks(fileKey)
      };
      
    } catch (error) {
      console.error(`File processing failed: ${error.message}`);
      throw new InternalServerErrorException(
        error.message.includes('limit') 
          ? error.message 
          : 'File processing failed'
      );
    }
  }

  public async getFileStream(fileKey: string): Promise<Readable> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (error) {
      console.error('File retrieval error:', error);
      throw new InternalServerErrorException('File not found');
    }
  }

  public async delete(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });
      await this.s3Client.send(command);
    } catch (error) {
      console.error('Deletion error:', error);
      throw new InternalServerErrorException('Deletion failed');
    }
  }
}