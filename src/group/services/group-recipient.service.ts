import { Group } from 'src/utils/typeorm';
import {
  AddGroupRecipientParams,
  AddGroupUserResponse,
  RemoveGroupRecipientParams,
  RemoveGroupUserResponse,
  LeaveGroupParams,
  CheckUserGroupParams,
} from 'src/utils/types';
import { IGroupRecipientService } from '../interfaces/group-recipients';
import { UserService } from 'src/user/services/user.service';
import { GroupService } from './group.service';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserNotFoundException } from 'src/user/exceptions/UserNotFound';
import { NotGroupOwnerException } from '../exceptions/NotGroupOwner';
import { GroupParticipantNotFound } from '../exceptions/GroupParticipantNotFound';

export class GroupRecipientService implements IGroupRecipientService {
  constructor(
    private readonly userService: UserService,
    private readonly groupService: GroupService,
  ) {}
  async addGroupRecipient({
    id,
    userId,
    account,
  }: AddGroupRecipientParams): Promise<AddGroupUserResponse> {
    const group = await this.groupService.findGroupById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    if (group.owner.id !== userId) {
      throw new HttpException('Insufficient Premissions', HttpStatus.FORBIDDEN);
    }
    const user = await this.userService.findUser({ account });
    if (!user) {
      throw new UserNotFoundException();
    }
    group.users.push(user);
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user };
  }
  async removeGroupRecipient({
    issuerId,
    removeUserId,
    id,
  }: RemoveGroupRecipientParams): Promise<RemoveGroupUserResponse> {
    const userToBeRemoved = await this.userService.findUser({
      id: removeUserId,
    });
    if (!userToBeRemoved) {
      throw new UserNotFoundException();
    }
    const group = await this.groupService.findGroupById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    if (group.owner.id !== issuerId) {
      throw new NotGroupOwnerException();
    }
    if (group.owner.id === removeUserId) {
      throw new HttpException(
        'Cannot remove yourself as owner',
        HttpStatus.BAD_REQUEST,
      );
    }
    group.users = group.users.filter((f) => f.id !== removeUserId);
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user: userToBeRemoved };
  }
  async leaveGroup({ id, userId }: LeaveGroupParams) {
    const group = await this.groupService.findGroupById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    if (group.owner.id === userId) {
      throw new HttpException(
        'Cannot leave group as owner',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.userService.findUser({ id: userId });
    group.users = group.users.filter((f) => f.id !== userId);
    const savedGroup = await this.groupService.saveGroup(group);
    return { group: savedGroup, user };
  }
  async isUserInGroup({ id, userId }: CheckUserGroupParams): Promise<Group> {
    const group = await this.groupService.findGroupById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    const user = group.users.find((f) => f.id === userId);
    if (!user) throw new GroupParticipantNotFound();
    return group;
  }
}
