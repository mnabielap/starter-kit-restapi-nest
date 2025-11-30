import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config();

const isPostgres = process.env.DB_TYPE === 'postgres';

export const dataSourceOptions: DataSourceOptions = isPostgres
  ? {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'], // Point to compiled JS files
      migrations: ['dist/database/migrations/*.js'],
      synchronize: false,
    }
  : {
      type: 'sqlite',
      database: 'database.sqlite',
      entities: ['dist/**/*.entity.js'], // Point to compiled JS files
      migrations: ['dist/database/migrations/*.js'],
      synchronize: false,
    };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;