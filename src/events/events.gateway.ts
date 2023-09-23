import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectManagerService } from './manager/connect-manager.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TSocketGetEventData, TSocketPostEventData } from './messageData.type';
import { EServerOnEventType } from 'src/utils/event.enum';

@WebSocketGateway({
  namespace: 'chat-websocket',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 15000,
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private eventEmitter: EventEmitter2,
    private connectManager: ConnectManagerService,
  ) {}

  handleConnection(client: Socket) {
    console.log('client connect', client.id);
    this.connectManager.saveSocekt(client);
  }

  handleDisconnect(client: Socket) {
    console.log('client disconnect', client.id);
    this.connectManager.removeSocekt(client.id);
  }

  @SubscribeMessage(EServerOnEventType.EVENT_MESSAGE)
  handleClientMessage(
    @MessageBody()
    eventData: TSocketGetEventData<any>,
    @ConnectedSocket() client: Socket,
  ) {
    const data: TSocketPostEventData<any> = {
      eventData,
      client,
    };
    this.eventEmitter.emit(eventData.type, data);
  }
}
