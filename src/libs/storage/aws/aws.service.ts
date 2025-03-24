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

//TODO: better use LAMBDA ffmpeg for transcoding but in my case it's ok for little files

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

  private async repairVideo(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const args = [
        '-err_detect', 'ignore_err',
        '-fflags', '+genpts',
        '-i', 'pipe:0',
        '-c', 'copy',
        '-f', 'mp4',
        'pipe:1'
      ];

      const ffmpeg = spawn(ffmpegPath, args, { stdio: ['pipe', 'pipe', 'pipe'] });
      const chunks: Buffer[] = [];
      let stderr = '';

      ffmpeg.stdout.on('data', chunk => chunks.push(chunk));
      ffmpeg.stderr.on('data', data => stderr += data.toString());

      ffmpeg.on('close', code => {
        code === 0 
          ? resolve(Buffer.concat(chunks))
          : reject(new Error(`Repair failed: ${stderr}`));
      });

      ffmpeg.stdin.write(buffer);
      ffmpeg.stdin.end();
    });
  }

  private async safeTranscode(buffer: Buffer): Promise<{ buffer: Buffer; isRepaired: boolean }> {
    try {
      // first try to transcode
      return { 
        buffer: await this.transcodeVideo(buffer), 
        isRepaired: false 
      };
    } catch (error) {
      console.log('Initial transcode failed, attempting repair...');
      
      try {
        // try to recover
        const repairedBuffer = await this.repairVideo(buffer);
        return {
          buffer: await this.transcodeVideo(repairedBuffer),
          isRepaired: true
        };
      } catch (repairError) {
        console.log('Repair failed, uploading original');
        return { 
          buffer: buffer, 
          isRepaired: false 
        };
      }
    }
  }

  private async transcodeVideo(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const args = [
        '-hide_banner',
        '-loglevel', 'error',
        '-i', 'pipe:0',
        '-f', 'mp4',
        '-vcodec', 'libx264',
        '-preset', 'ultrafast', // fast encoding
        '-crf', '28',           // low quality for better performance
        '-acodec', 'aac',
        '-movflags', 'frag_keyframe+empty_moov',
        '-threads', '2',        // limit CPU usage
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
      // 1. Валидация размера
      if (file.size > this.maxFileSize) {
        throw new Error(`File size exceeds limit: ${this.maxFileSize} bytes`);
      }

      let finalBuffer = file.buffer;
      let originalName = file.originalname;
      let metadata = {
        original_size: file.size.toString(),
        processing_status: 'original'
      };

      // 2. Обработка видео
      if (file.mimetype.startsWith('video/')) {
        try {
          const transcodeResult = await this.safeTranscode(file.buffer);
          
          finalBuffer = transcodeResult.buffer;
          metadata.processing_status = transcodeResult.isRepaired 
            ? 'repaired_and_transcoded' 
            : 'transcoded';

          // Обновляем имя и MIME-тип
          originalName = originalName.replace(/\.[^/.]+$/, '.mp4');
        } catch (error) {
          metadata.processing_status = 'failed_but_uploaded';
          console.error('Full processing failed:', error);
        }
      }

      // 3. Загрузка в S3
      const fileKey = `${uuidv4()}-${originalName}`;
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: finalBuffer,
        ContentType: file.mimetype.startsWith('video/') ? 'video/mp4' : file.mimetype,
        Metadata: metadata,
      }));

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