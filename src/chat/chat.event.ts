import { Injectable } from '@nestjs/common';
import { TChatEventGetData, TChatToData } from './chat.type';
import { ChatHandler } from './chat.interface';
import { OnEvent } from '@nestjs/event-emitter';
import { EClientOnEventType, EServerOnEventType } from 'src/utils/event.enum';
import { ConnectManagerService } from 'src/events/manager/connect-manager.service';

@Injectable()
export class ChatEvent implements ChatHandler {
  constructor(private connectManager: ConnectManagerService) {}

  @OnEvent(EServerOnEventType.CHAT_WITH_SOMEONE)
  talkTosomeone(data: TChatEventGetData): void {
    const { client, eventData } = data;
    const toId = eventData.data.toId;
    const msgData = eventData.data!.data;
    const toData: TChatToData = {
      fromId: client.id,
      toId,
      data: msgData,
    };
    client.to(toId).emit(EClientOnEventType.CLIENT_GET_CHAT_DATA, toData);
  }
  talkAtRoom(data: TChatEventGetData): void {
    console.log(data);
  }
}