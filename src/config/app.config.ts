import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: parseInt(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 10),
    refreshExpirationDays: parseInt(process.env.JWT_REFRESH_EXPIRATION_DAYS, 10),
    resetPasswordExpirationMinutes: parseInt(process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES, 10),
    verifyEmailExpirationMinutes: parseInt(process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES, 10),
  },
  email: {
    transport: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
}));