import { Group, User } from 'src/utils/typeorm';
import {
  CreateGroupParams,
  FetchGroupsParams,
  AccessParams,
  TransferOwnerParams,
  UpdateGroupDetailsParams,
} from 'src/utils/types';
import { IGroupServices } from '../interfaces/group';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/services/user.service';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { GroupNotFoundException } from '../exceptions/GroupNotFound';
import { GroupOwnerTransferException } from '../exceptions/GroupOwnerTransfer';
import { UserNotFoundException } from 'src/user/exceptions/UserNotFound';
import { generateUUIDV4 } from 'src/utils/helpers';

export class GroupService implements IGroupServices {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly userService: UserService,
    private readonly fileStorage: FileStorageService,
  ) {}
  async createGroup(params: CreateGroupParams) {
    const { creator, users: userIds, title } = params;
    const usersPromise = userIds.map((id) => {
      return this.userService.findUser({ id });
    });
    const users = (await Promise.all(usersPromise)).filter((user) => user);
    users.push(creator);
    const groupParams = { owner: creator, title, users, creator };
    const newGroup = this.groupRepository.create(groupParams);
    return this.groupRepository.save(newGroup);
  }

  getGroups(params: FetchGroupsParams): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id IN (:users)', { users: [params.userId] })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.creator', 'creator')
      .leftJoinAndSelect('group.owner', 'owner')
      .leftJoinAndSelect('group.lastMessageSent', 'lastMessageSent')
      .leftJoinAndSelect('users.profile', 'usersProfile')
      .leftJoinAndSelect('users.presence', 'usersPresence')
      .orderBy('group.lastMessageSentAt', 'DESC')
      .getMany();
  }

  findGroupById(id: string): Promise<Group> {
    return this.groupRepository.findOne({
      where: { id },
      relations: [
        'creator',
        'owner',
        'users',
        'users.presence',
        'users.profile',
        'lastMessageSent',
      ],
    });
  }

  saveGroup(group: Group): Promise<Group> {
    return this.groupRepository.save(group);
  }

  async hasAccess(params: AccessParams): Promise<User> {
    const group = await this.findGroupById(params.id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    return group.users.find((user) => user.id === params.userId);
  }

  async transferGroupOwner({
    groupId,
    userId,
    newOwnerId,
  }: TransferOwnerParams): Promise<Group> {
    const group = await this.findGroupById(groupId);
    if (!group) throw new GroupNotFoundException();
    if (group.owner.id !== userId) {
      throw new GroupOwnerTransferException('Insufficient Permisstions');
    }
    if (group.owner.id === newOwnerId) {
      throw new GroupOwnerTransferException(
        'Cannot transfer owner to yourself',
      );
    }
    const newOwner = await this.userService.findUser({ id: newOwnerId });
    if (!newOwner) {
      throw new UserNotFoundException();
    }
    group.owner = newOwner;
    return this.groupRepository.save(group);
  }

  async updateDetails({
    id,
    title,
    avatar,
  }: UpdateGroupDetailsParams): Promise<Group> {
    const group = await this.findGroupById(id);
    if (!group) {
      throw new GroupNotFoundException();
    }
    if (avatar) {
      const key = generateUUIDV4();
      const filename = `group_avatar_${key}_${avatar.originalname}`;
      const { src } = await this.fileStorage.upload({
        key: filename,
        file: avatar,
      });
      group.avatar = src;
    }
    group.title = title ?? group.title;
    return this.groupRepository.save(group);
  }
}
