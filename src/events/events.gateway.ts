import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat-websocket',
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    console.log('events', data);
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    console.log('identity', data);
    return data;
  }

  @SubscribeMessage('msgtest')
  msgTest(@MessageBody() data: any): WsResponse<number> {
    console.log('msgtest', data);
    return { event: 'msgtest', data: 2 };
  }

  @SubscribeMessage('hello')
  hello(@MessageBody() reqData: { name: string }): string {
    console.log('MyWebSocketGateway', reqData);
    console.log(JSON.stringify(reqData));
    return 'received reqData';
  }
}
