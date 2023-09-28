import { IoAdapter } from '@nestjs/platform-socket.io';
import { IAuthenticatedSocket } from 'src/utils/interfaces';
import * as cookie from 'cookie';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { Session } from 'src/utils/typeorm/entities/Session.entity';
import { NestExpressApplication } from '@nestjs/platform-express';

export class WebsocketAdapter extends IoAdapter {
  appService: NestExpressApplication;
  constructor(app: NestExpressApplication) {
    super(app);
    this.appService = app;
  }
  create(port: number, options?: any) {
    const server = super.create(port, options);
    const dataSource = this.appService.get(DataSource);
    server.use(async (socket: IAuthenticatedSocket, next) => {
      console.log('建立连接');
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        console.log('client has no cookie');
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const sessionData = cookie.parse(clientCookie);
      const sessionId = sessionData[process.env.SESSION_NAME];
      if (!sessionId) {
        console.log('sessionId do not exist');
        return next(new Error('Not Authenticated'));
      }
      const signedCookie = cookieParser.signedCookie(
        sessionId,
        process.env.SESSION_SECRET,
      );
      if (!signedCookie) return next(new Error('Error signing cookie'));
      const sessionRepository = dataSource.getRepository(Session);
      const sessionDB = await sessionRepository.findOneBy({ id: signedCookie });
      if (!sessionDB) return next(new Error('No session found'));
      const sessionUserData = JSON.parse(sessionDB.json);
      if (!sessionUserData.user)
        return next(new Error('user object does not exist.'));
      socket.user = sessionUserData.user;
      next();
    });
    return server;
  }
}
