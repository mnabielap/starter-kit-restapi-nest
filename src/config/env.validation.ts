import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),

  DB_TYPE: Joi.string().valid('postgres', 'sqlite').default('postgres'),
  DATABASE_URL: Joi.string().allow('').optional(),
  
  DB_HOST: Joi.when('DB_TYPE', {
    is: 'postgres',
    then: Joi.when('DATABASE_URL', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }),
  }),

  DB_PORT: Joi.when('DB_TYPE', {
    is: 'postgres',
    then: Joi.when('DATABASE_URL', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.number().default(5432),
    }),
  }),

  DB_USERNAME: Joi.when('DB_TYPE', {
    is: 'postgres',
    then: Joi.when('DATABASE_URL', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }),
  }),

  DB_PASSWORD: Joi.when('DB_TYPE', {
    is: 'postgres',
    then: Joi.when('DATABASE_URL', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.string().allow('').optional(),
    }),
  }),

  DB_NAME: Joi.when('DB_TYPE', {
    is: 'postgres',
    then: Joi.when('DATABASE_URL', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.string().required(),
    }),
  }),

  DB_SYNC: Joi.boolean().default(false),

  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30),
  JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10),

  SMTP_HOST: Joi.string().optional().allow(''),
  SMTP_PORT: Joi.number().optional().allow(''),
  SMTP_USERNAME: Joi.string().optional().allow(''),
  SMTP_PASSWORD: Joi.string().optional().allow(''),
  EMAIL_FROM: Joi.string().optional().allow(''),
});