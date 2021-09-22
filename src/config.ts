import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  database: {
    name: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  },
  postgres: {
    dbName: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    dbName: process.env.MYSQL_DATABASE,
    port: parseInt(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
  },
  apiKey: process.env.API_KEY,
}));
