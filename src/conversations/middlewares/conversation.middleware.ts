import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { IConversationsService } from '../conversations';
import { ConversationNotFoundException } from '../exceptions/ConversationNotFound';
import { AuthenticatedRequest } from 'src/utils/interfaces';

@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(private readonly conversationService: IConversationsService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { id: userId } = req.user;
    const isReadable = await this.conversationService.hasAccess({
      id: userId,
      userId,
    });
    if (isReadable) next();
    else throw new ConversationNotFoundException();
  }
}
