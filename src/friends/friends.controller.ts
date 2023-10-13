import { Controller, Delete, Get, Param } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Routes, ServerOnEventType } from '../utils/constants';
import { AuthUser } from '../utils/decorators';
import { User } from '../utils/typeorm';
import { IFriendsService } from './friends';

@Controller(Routes.FRIENDS)
export class FriendsController {
  constructor(
    private readonly friendsService: IFriendsService,
    private readonly event: EventEmitter2,
  ) {}

  @Get()
  getFriends(@AuthUser() user: User) {
    console.log('Fetching Friends');
    return this.friendsService.getFriends(user.id);
  }

  @Delete(':id/delete')
  async deleteFriend(
    @AuthUser() { id: userId }: User,
    @Param('id') id: string,
  ) {
    const friend = await this.friendsService.deleteFriend({ id, userId });
    this.event.emit(ServerOnEventType.FRIEND_REMOVED, { friend, userId });
    return friend;
  }
}
