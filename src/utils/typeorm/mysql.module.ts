import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '.';
import { ConfigModule } from '@nestjs/config';

let envFilePath = '.env.development';
if (process.env.ENVIRONMENT === 'production') envFilePath = '.env.production';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      synchronize: Boolean(+process.env.MYSQL_DB_SYNCHRONIZE),
      entities: entities,
    }),
  ],
})
export class MysqlModule {}
