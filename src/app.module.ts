import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/evnets.module';
import { MysqlModule } from './utils/typeorm/mysql.module';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConnectManagerModule } from './events/manager/connect-manager.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    EventsModule,
    ConnectManagerModule,
    UserModule,
    MysqlModule,
    EventEmitterModule.forRoot(),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
