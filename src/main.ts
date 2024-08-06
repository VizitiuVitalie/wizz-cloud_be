import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  dotenv.config();

  const port = process.env.PORT;

  const app = await NestFactory.create(AppModule);
  await app.listen(port, () => {
    console.log(`app is listening on port ${port}`);
  });
}
bootstrap();
