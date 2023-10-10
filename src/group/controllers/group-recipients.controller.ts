import { Controller, Param, Post, Body, Delete } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes } from '../../utils/constants';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { AddGroupRecipientDto } from '../dtos/AddGroupRecipient.dto';
import { IGroupRecipientService } from '../interfaces/group-recipients';

@Controller(Routes.GROUPS_RECIPIENTS)
export class GroupRecipientsController {
  constructor(
    private readonly groupRecipientService: IGroupRecipientService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async addGroupRecipient(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
    @Body() { account }: AddGroupRecipientDto,
  ) {
    const params = { id, userId, account };
    const response = await this.groupRecipientService.addGroupRecipient(params);
    this.eventEmitter.emit('group.user.add', response);
    return response;
  }

  /**
   * Leaves a Group
   * @param user the authenticated User
   * @param groupId the id of the group
   * @returns the updated Group that the user had left
   */
  @Delete('leave')
  async leaveGroup(@AuthUser() user: User, @Param('id') groupId: string) {
    const group = await this.groupRecipientService.leaveGroup({
      id: groupId,
      userId: user.id,
    });
    this.eventEmitter.emit('group.user.leave', { group, userId: user.id });
    return group;
  }

  @Delete(':userId')
  async removeGroupRecipient(
    @AuthUser() { id: issuerId }: User,
    @Param('id') id: string,
    @Param('userId') removeUserId: string,
  ) {
    const params = { issuerId, id, removeUserId };
    const response =
      await this.groupRecipientService.removeGroupRecipient(params);
    this.eventEmitter.emit('group.user.remove', response);
    return response.group;
  }
}
