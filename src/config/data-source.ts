import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({
  path: `${__dirname}/env/.${process.env.NODE_ENV}.env`,
});

export const dataSourceOptions: DataSourceOptions = {
  migrationsTableName: 'migration',
  type: 'mysql',
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE_NAME,
  synchronize: process.env.MYSQL_SYNCHRONIZE === 'true',
  migrations: [__dirname + '/../migration/*{.ts,.js}'],
  dropSchema: false,
};

export const dataSourceConfig = new DataSource(dataSourceOptions);
