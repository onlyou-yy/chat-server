import { Group, GroupMessage } from 'src/utils/typeorm';
import {
  CreateGroupMessageParams,
  DeleteGroupMessageParams,
  EditGroupMessageParams,
} from 'src/utils/types';
import { IGroupMessageService } from '../interfaces/group-messages';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupService } from './group.service';
import { MessageAttachmentService } from 'src/message-attachment/message-attachment.service';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { UserNotFoundException } from 'src/user/exceptions/UserNotFound';
import { instanceToPlain } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';

export class GroupMessageService implements IGroupMessageService {
  constructor(
    @InjectRepository(GroupMessage)
    private readonly groupMessageRepository: Repository<GroupMessage>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly groupService: GroupService,
    private readonly messageAttachmentService: MessageAttachmentService,
  ) {}
  async createGroupMessage({
    content,
    author,
    attachments,
    groupId,
  }: CreateGroupMessageParams) {
    const group = await this.groupService.findGroupById(groupId);
    if (!group) {
      throw new GroupNotFoundException();
    }
    const findUser = group.users.find((u) => u.id === author.id);
    if (!findUser) throw new UserNotFoundException();
    const groupMessage = this.groupMessageRepository.create({
      content,
      group,
      author: instanceToPlain(author),
      attachments: attachments
        ? await this.messageAttachmentService.createGroupAttachments(
            attachments,
          )
        : [],
    });
    const savedMessage = await this.groupMessageRepository.save(groupMessage);
    group.lastMessageSent = savedMessage;
    const updatedGroup = await this.groupService.saveGroup(group);
    return { message: savedMessage, group: updatedGroup };
  }
  async getGroupMessages(id: string): Promise<GroupMessage[]> {
    return this.groupMessageRepository.find({
      where: { group: { id } },
      relations: ['author', 'attachments', 'author.profile'],
      order: {
        createdAt: 'DESC',
      },
    });
  }
  async deleteGroupMessage(params: DeleteGroupMessageParams) {
    const group = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.id = :groupId', { groupId: params.groupId })
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('group.messages', 'messages')
      .orderBy('messages.createdAt', 'DESC')
      .limit(5)
      .getOne();

    if (!group) throw new GroupNotFoundException();
    const message = await this.groupMessageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
        group: { id: params.groupId },
      },
    });

    if (!message)
      throw new HttpException('Cannot delete message', HttpStatus.BAD_REQUEST);

    if (group.lastMessageSent.id !== message.id)
      return this.groupMessageRepository.delete({ id: message.id });

    const size = group.messages.length;
    const SECOND_MESSAGE_INDEX = 1;
    if (size <= 1) {
      console.log('Last Message Sent is deleted');
      await this.groupRepository.update(
        { id: params.groupId },
        { lastMessageSent: null },
      );
      return this.groupMessageRepository.delete({ id: message.id });
    } else {
      console.log('There are more than 1 message');
      const newLastMessage = group.messages[SECOND_MESSAGE_INDEX];
      await this.groupRepository.update(
        { id: params.groupId },
        { lastMessageSent: newLastMessage },
      );
      return this.groupMessageRepository.delete({ id: message.id });
    }
  }
  async editGroupMessage(
    params: EditGroupMessageParams,
  ): Promise<GroupMessage> {
    const messageDB = await this.groupMessageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: ['group', 'group.creator', 'group.users', 'author'],
    });
    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.content = params.content;
    return this.groupMessageRepository.save(messageDB);
  }
}
