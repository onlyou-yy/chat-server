import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateMessageDto } from './dtos/CreateMessage.dto';
import { IMessageService } from './message';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EditMessageDto } from './dtos/EditMessage.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EmptyMessageException } from './exceptions/EmptyMessage';
import { Routes } from 'src/utils/constants';
import { User } from 'src/utils/typeorm';
import { AuthUser } from 'src/utils/decorators';
import { Attachment } from 'src/utils/interfaces';

@Controller(Routes.MESSAGES)
export class MessageController {
  constructor(
    private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'attachments',
        maxCount: 5,
      },
    ]),
  )
  @Post()
  async createMessage(
    @AuthUser() user: User,
    @UploadedFiles() { attachments }: { attachments: Attachment[] },
    @Param('id', ParseIntPipe) id: string,
    @Body()
    { content }: CreateMessageDto,
  ) {
    if (!attachments && !content) throw new EmptyMessageException();
    const params = { user, id, content, attachments };
    const response = await this.messageService.createMessage(params);
    this.eventEmitter.emit('message.create', response);
    return;
  }

  @Get()
  async getMessagesFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: string,
  ) {
    const messages = await this.messageService.getMessages(id);
    return { id, messages };
  }

  @Delete(':messageId')
  async deleteMessageFromConversation(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) conversationId: string,
    @Param('messageId', ParseIntPipe) messageId: string,
  ) {
    const params = { userId: user.id, conversationId, messageId };
    await this.messageService.deleteMessage(params);
    this.eventEmitter.emit('message.delete', params);
    return { conversationId, messageId };
  }
  // api/conversations/:conversationId/messages/:messageId
  @Patch(':messageId')
  async editMessage(
    @AuthUser() { id: userId }: User,
    @Param('id') conversationId: string,
    @Param('messageId') messageId: string,
    @Body() { content }: EditMessageDto,
  ) {
    const params = { userId, content, conversationId, messageId };
    const message = await this.messageService.editMessage(params);
    this.eventEmitter.emit('message.update', message);
    return message;
  }
}
