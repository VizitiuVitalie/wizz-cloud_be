import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigEnums } from './core/config/config.enums';
import { HttpConfig } from './core/config/http.config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  };
  app.enableCors(corsOptions);

  const httpConfig = app.get(ConfigService).get<HttpConfig>(ConfigEnums.HTTP);

  app.setGlobalPrefix('wizzcloud');

  await app.listen(httpConfig.port, () => {
    console.log(`app is listening on port ${httpConfig.port}`);
  });
}
void bootstrap();
