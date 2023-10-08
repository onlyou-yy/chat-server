import { Body, Controller, Patch } from '@nestjs/common';
import { Routes } from 'src/utils/constants';
import { UserPresenceService } from '../services/user-presence.service';
import { AuthUser } from 'src/utils/decorators';
import { UpdatePresenceStatusDto } from '../dtos/UpdatePresenceStatus.dto';
import { User } from 'src/utils/typeorm';

@Controller(Routes.USER_PRESENCE)
export class UserPresenceController {
  constructor(private readonly userPresenceService: UserPresenceService) {}

  @Patch('status')
  updateStatus(
    @AuthUser() user: User,
    @Body() { statusMessage }: UpdatePresenceStatusDto,
  ) {
    return this.userPresenceService.updateStatus({ user, statusMessage });
  }
}
