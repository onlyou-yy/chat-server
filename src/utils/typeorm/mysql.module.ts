import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '.';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'chat',
      entities: entities,
      // autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class MysqlModule {}
