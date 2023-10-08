import { Injectable } from '@nestjs/common';
import { IUserPresenceService } from '../interfaces/user-presence';
import { UserPresence, User } from 'src/utils/typeorm';
import { UpdateStatusMessageParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPresenceService implements IUserPresenceService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserPresence)
    private readonly presenceRepository: Repository<UserPresence>,
  ) {}
  createPresence(): Promise<UserPresence> {
    const presence = this.presenceRepository.create();
    return this.presenceRepository.save(presence);
  }
  async updateStatus({
    user,
    statusMessage,
  }: UpdateStatusMessageParams): Promise<User> {
    if (!user.presence) {
      console.log('User.presence does not exist. Creating...');
      user.presence = await this.createPresence();
    }
    user.presence.statusMessage = statusMessage;
    return this.userService.saveUser(user);
  }
}
