import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Peer, User, UserPresence, UserProfile } from 'src/utils/typeorm';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserPresenceController } from './controllers/user-presence.controller';
import { UserProfileService } from './services/user-profile.service';
import { UserPresenceService } from './services/user-presence.service';

const providers = [UserService, UserProfileService, UserPresenceService];

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPresence, UserProfile, Peer])],
  controllers: [UserController, UserProfileController, UserPresenceController],
  providers: providers,
  exports: providers,
})
export class UserModule {}
