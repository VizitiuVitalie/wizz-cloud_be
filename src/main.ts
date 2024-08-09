import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigEnums } from './core/config/config.enums';
import { HttpConfig } from './core/config/http.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpConfig = app.get(ConfigService).get<HttpConfig>(ConfigEnums.HTTP);

  await app.listen(httpConfig.port, () => {
    console.log(`app is listening on port ${httpConfig.port}`);
  });
}
void bootstrap();
