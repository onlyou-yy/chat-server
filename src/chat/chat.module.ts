import { Module } from '@nestjs/common';
import { ChatEvent } from './chat.event';

@Module({
  providers: [ChatEvent],
  exports: [ChatEvent],
})
export class ChatModule {}
