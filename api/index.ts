import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';

export default async function handler(req, res) {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.use(compression());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('v1');
  await app.init();

  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
}