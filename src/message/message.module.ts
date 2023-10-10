import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation, Message } from '../utils/typeorm';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { FileStorageModule } from 'src/file-storage/file-storage.module';
import { FriendsModule } from 'src/friends/friends.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { MessageAttachmentModule } from 'src/message-attachment/message-attachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    MessageAttachmentModule,
    ConversationsModule,
    FriendsModule,
    FileStorageModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessagesModule {}
