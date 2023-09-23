import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/evnets.module';
import { MysqlModule } from './utils/typeorm/mysql.module';
import { UserModule } from './user/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConnectManagerModule } from './events/manager/connect-manager.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/client',
      rootPath: join(__dirname, '../clientTest'),
    }),
    EventsModule,
    ConnectManagerModule,
    UserModule,
    MysqlModule,
    EventEmitterModule.forRoot(),
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
