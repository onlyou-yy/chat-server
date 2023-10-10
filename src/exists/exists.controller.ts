import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IConversationsService } from '../conversations/conversations';
import { Routes } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { IUserService } from 'src/user/interfaces/user';

@Controller(Routes.EXISTS)
export class ExistsController {
  constructor(
    private readonly conversationsService: IConversationsService,
    private readonly userService: IUserService,
    private readonly events: EventEmitter2,
  ) {}

  @Get('conversations/:recipientId')
  async checkConversationExists(
    @AuthUser() user: User,
    @Param('recipientId') recipientId: string,
  ) {
    const conversation = await this.conversationsService.isCreated(
      recipientId,
      user.id,
    );
    if (conversation) return conversation;
    const recipient = await this.userService.findUser({ id: recipientId });
    if (!recipient)
      throw new HttpException('Recipient Not Found', HttpStatus.NOT_FOUND);
    const newConversation = await this.conversationsService.createConversation(
      user,
      {
        username: recipient.username,
        message: 'hello',
      },
    );
    this.events.emit('conversation.create', newConversation);
    return newConversation;
  }
}
