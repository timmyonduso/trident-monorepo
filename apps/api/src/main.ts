import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8000);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
}
bootstrap();
