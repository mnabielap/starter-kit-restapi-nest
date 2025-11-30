import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security Headers
  app.use(helmet());
  
  // CORS
  app.enableCors();

  // Compression
  app.use(compression());

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not exist in DTO
      transform: true, // Automatically transform payloads to DTO instances
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
    }),
  );

  // API Versioning Prefix
  app.setGlobalPrefix('v1');

  // Swagger Documentation (only in development ideally, but kept here for starter kit)
  if (configService.get('app.env') === 'development') {
    setupSwagger(app);
  }

  const port = configService.get('app.port');
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/v1`);
  logger.log(`Swagger Docs available at: http://localhost:${port}/v1/docs`);
}
bootstrap();