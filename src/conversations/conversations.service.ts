import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendNotFoundException } from '../friends/exceptions/FriendNotFound';
import { IFriendsService } from '../friends/friends';
import { Conversation, Message, User } from '../utils/typeorm';
import {
  AccessParams,
  CreateConversationParams,
  GetConversationMessagesParams,
  UpdateConversationParams,
} from '../utils/types';
import { IConversationsService } from './conversations';
import { ConversationExistsException } from './exceptions/ConversationExists';
import { ConversationNotFoundException } from './exceptions/ConversationNotFound';
import { CreateConversationException } from './exceptions/CreateConversation';
import { IUserService } from 'src/user/interfaces/user';
import { UserNotFoundException } from 'src/user/exceptions/UserNotFound';

@Injectable()
export class ConversationsService implements IConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: IUserService,
    private readonly friendsService: IFriendsService,
  ) {}

  async getConversations(id: string): Promise<Conversation[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .leftJoinAndSelect('creator.peer', 'creatorPeer')
      .leftJoinAndSelect('recipient.peer', 'recipientPeer')
      .leftJoinAndSelect('creator.profile', 'creatorProfile')
      .leftJoinAndSelect('recipient.profile', 'recipientProfile')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('conversation.lastMessageSentAt', 'DESC')
      .getMany();
  }

  async findById(id: string) {
    return this.conversationRepository.findOne({
      where: { id },
      relations: [
        'creator',
        'recipient',
        'creator.profile',
        'recipient.profile',
        'lastMessageSent',
      ],
    });
  }

  async isCreated(userId: string, recipientId: string) {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId },
        },
      ],
    });
  }

  async createConversation(creator: User, params: CreateConversationParams) {
    const { username, message: content } = params;
    const recipient = await this.userService.findUser({ username });
    if (!recipient) throw new UserNotFoundException();
    if (creator.id === recipient.id)
      throw new CreateConversationException(
        'Cannot create Conversation with yourself',
      );
    const isFriends = await this.friendsService.isFriends(
      creator.id,
      recipient.id,
    );
    if (!isFriends) throw new FriendNotFoundException();
    const exists = await this.isCreated(creator.id, recipient.id);
    if (exists) throw new ConversationExistsException();
    const newConversation = this.conversationRepository.create({
      creator,
      recipient,
    });
    const conversation =
      await this.conversationRepository.save(newConversation);
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: creator,
    });
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  async hasAccess({ id, userId }: AccessParams) {
    const conversation = await this.findById(id);
    if (!conversation) throw new ConversationNotFoundException();
    return (
      conversation.creator.id === userId || conversation.recipient.id === userId
    );
  }

  save(conversation: Conversation): Promise<Conversation> {
    return this.conversationRepository.save(conversation);
  }

  getMessages({
    id,
    limit,
  }: GetConversationMessagesParams): Promise<Conversation> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id = :id', { id })
      .leftJoinAndSelect('conversation.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne();
  }

  update({ id, lastMessageSent }: UpdateConversationParams) {
    return this.conversationRepository.update(id, { lastMessageSent });
  }
}
