import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsModule } from '../friends/friends.module';
import { FriendRequestController } from './friend-requests.controller';
import { FriendRequestService } from './friend-requests.service';
import { Friend, FriendRequest } from 'src/utils/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest]),
    UserModule,
    FriendsModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
})
export class FriendRequestsModule {}
