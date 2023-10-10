import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendAlreadyExists } from '../friends/exceptions/FriendAlreadyExists';
import { IFriendsService } from '../friends/friends';
import { Friend, FriendRequest } from '../utils/typeorm';
import {
  CancelFriendRequestParams,
  CreateFriendParams,
  FriendRequestParams,
} from '../utils/types';
import { FriendRequestException } from './exceptions/FriendRequest';
import { FriendRequestAcceptedException } from './exceptions/FriendRequestAccepted';
import { FriendRequestNotFoundException } from './exceptions/FriendRequestNotFound';
import { FriendRequestPending } from './exceptions/FriendRequestPending';
import { IFriendRequestService } from './friend-requests';
import { IUserService } from 'src/user/interfaces/user';
import { UserNotFoundException } from 'src/user/exceptions/UserNotFound';

@Injectable()
export class FriendRequestService implements IFriendRequestService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    private readonly userService: IUserService,
    private readonly friendsService: IFriendsService,
  ) {}

  getFriendRequests(id: string): Promise<FriendRequest[]> {
    const status = 'pending';
    return this.friendRequestRepository.find({
      where: [
        { sender: { id }, status },
        { receiver: { id }, status },
      ],
      relations: ['receiver', 'sender', 'receiver.profile', 'sender.profile'],
    });
  }

  async cancel({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    if (friendRequest.sender.id !== userId) throw new FriendRequestException();
    await this.friendRequestRepository.delete(id);
    return friendRequest;
  }

  async create({ user: sender, account }: CreateFriendParams) {
    const receiver = await this.userService.findUser({ account });
    if (!receiver) throw new UserNotFoundException();
    const exists = await this.isPending(sender.id, receiver.id);
    if (exists) throw new FriendRequestPending();
    if (receiver.id === sender.id)
      throw new FriendRequestException('Cannot Add Yourself');
    const isFriends = await this.friendsService.isFriends(
      sender.id,
      receiver.id,
    );
    if (isFriends) throw new FriendAlreadyExists();
    const friend = this.friendRequestRepository.create({
      sender,
      receiver,
      status: 'pending',
    });
    return this.friendRequestRepository.save(friend);
  }

  async accept({ id, userId }: FriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    if (friendRequest.status === 'accepted')
      throw new FriendRequestAcceptedException();
    if (friendRequest.receiver.id !== userId)
      throw new FriendRequestException();
    friendRequest.status = 'accepted';
    const updatedFriendRequest =
      await this.friendRequestRepository.save(friendRequest);
    const newFriend = this.friendRepository.create({
      sender: friendRequest.sender,
      receiver: friendRequest.receiver,
    });
    const friend = await this.friendRepository.save(newFriend);
    return { friend, friendRequest: updatedFriendRequest };
  }

  async reject({ id, userId }: CancelFriendRequestParams) {
    const friendRequest = await this.findById(id);
    if (!friendRequest) throw new FriendRequestNotFoundException();
    if (friendRequest.status === 'accepted')
      throw new FriendRequestAcceptedException();
    if (friendRequest.receiver.id !== userId)
      throw new FriendRequestException();
    friendRequest.status = 'rejected';
    return this.friendRequestRepository.save(friendRequest);
  }

  isPending(userOneId: string, userTwoId: string) {
    return this.friendRequestRepository.findOne({
      where: [
        {
          sender: { id: userOneId },
          receiver: { id: userTwoId },
          status: 'pending',
        },
        {
          sender: { id: userTwoId },
          receiver: { id: userOneId },
          status: 'pending',
        },
      ],
    });
  }

  findById(id: string): Promise<FriendRequest> {
    return this.friendRequestRepository.findOne({
      where: {
        id,
      },
      relations: ['receiver', 'sender'],
    });
  }
}
