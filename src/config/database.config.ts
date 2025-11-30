import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => {
  const isPostgres = process.env.DB_TYPE === 'postgres';
  // Logic: Sync is true if DB_SYNC=true OR if we are NOT in production
  // But on Vercel, usually we want to force sync true initially because running migration is hard
  const shouldSync = process.env.DB_SYNC === 'true' || process.env.NODE_ENV !== 'production';

  // Check if we have a full connection URL (Common in Vercel/Neon)
  const databaseUrl = process.env.DATABASE_URL;

  if (isPostgres) {
    const postgresConfig: TypeOrmModuleOptions = {
      type: 'postgres',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: shouldSync,
      logging: false,
    };

    if (databaseUrl) {
      // Configuration for Vercel/Neon using Connection String
      return {
        ...postgresConfig,
        url: databaseUrl,
        ssl: {
          rejectUnauthorized: false, // Required for Neon/AWS RDS in many cases
        },
      };
    } else {
      // Configuration for Local/Docker using split credentials
      return {
        ...postgresConfig,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      };
    }
  } else {
    // SQLite Configuration
    return {
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: shouldSync,
      logging: process.env.NODE_ENV === 'development',
    };
  }
});