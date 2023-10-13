import { OnEvent } from '@nestjs/event-emitter';
import { ConnectManagerService } from 'src/events/manager/connect-manager.service';
import { Conversation } from 'src/utils/typeorm';

export class ConversationEvent {
  constructor(private connectManager: ConnectManagerService) {}
  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: Conversation) {
    const recipientSocket = this.connectManager.getSocekt(payload.recipient.id);
    if (recipientSocket) recipientSocket.emit('onConversation', payload);
  }
}
