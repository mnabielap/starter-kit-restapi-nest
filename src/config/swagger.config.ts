import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Starter Kit REST API')
    .setDescription('API Documentation for the NestJS Starter Kit')
    .setVersion('1.0')
    .addBearerAuth() // Adds JWT support to Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);
}