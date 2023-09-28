import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WebsocketAdapter } from './events/events.adapter';
import * as session from 'express-session';
import { DataSource } from 'typeorm';
import { Session } from './utils/typeorm/entities/Session.entity';
import { TypeormStore } from 'connect-typeorm/out';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpResTransformInterceptor } from './utils/interceptors';
import { HttpExceptionFilter } from './utils/filters';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const adapter = new WebsocketAdapter(app);
  const dataSource = app.get(DataSource); //app.get 可以拿到应用中的所有 provider 实例
  const sessionRepository = dataSource.getRepository(Session);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpResTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(adapter);
  app.set('trust proxy', 'loopback');
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      name: process.env.SESSION_NAME,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 86400000, // 1天
        // sameSite: 'none',
        // secure: true,
      },
      store: new TypeormStore().connect(sessionRepository),
    }),
  );

  try {
    const { HTTP_SERVER_PORT, ENVIRONMENT, ENVIRONMENT_MESSAGE } = process.env;
    await app.listen(HTTP_SERVER_PORT, () => {
      console.log(`Running on Port ${HTTP_SERVER_PORT}`);
      console.log(`Running in ${ENVIRONMENT} mode: ${ENVIRONMENT_MESSAGE}`);
    });
  } catch (err) {
    console.log(err);
  }
}
bootstrap();
