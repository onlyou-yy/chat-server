import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './events/evnets.module';
import { UserModule } from './user/user.module';
import { MysqlModule } from './typeorm/mysql.module';

@Module({
  imports: [WebsocketModule, UserModule, MysqlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
