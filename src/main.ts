import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigEnums } from './core/config/config.enums';
import { HttpConfig } from './core/config/http.config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as fs from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: [
      'http://localhost:3000',
      'https://www.wizz-cloud.com',
      'https://api.wizz-cloud.com',
      'https://wizz-cloud-f8463.web.app',
      'https://wizz-cloud.com'
    ],
    exposedHeaders: ['Content-Type', 'Content-Length', 'Video-Name'],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: 'Content-Type, Authorization',
  };
  app.enableCors(corsOptions);

  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
      );
      res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Cookie',
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      res.status(200).end();
      return;
    }
    next();
  });

  const configService = app.get(ConfigService);
  const httpConfig = configService.get<HttpConfig>(ConfigEnums.HTTP);

  const cloudStoragePath = configService.get<string>('cloud_storage.path');
  const fullPath = join(process.cwd(), cloudStoragePath);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${fullPath}`);
  }

  app.setGlobalPrefix('wizzcloud');

  await app.listen(httpConfig.port, '0.0.0.0', () => {
    console.log(`app is listening on port ${httpConfig.port}`);
  });
}
void bootstrap();
