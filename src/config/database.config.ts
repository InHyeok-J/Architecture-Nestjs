import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  databaseName: process.env.MYSQL_DATABASE_NAME,
  sync: process.env.MYSQL_SYNCHRONIZE,
}));
