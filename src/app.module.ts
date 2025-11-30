import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { envValidationSchema } from './config/env.validation';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    // Configuration Module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envValidationSchema,
    }),

    // Database Module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),

    // Feature Modules
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}