import {
  Body,
  Controller,
  Patch,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserProfileService } from '../services/user-profile.service';
import { Routes, UserProfileFileFields } from 'src/utils/constants';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/utils/decorators';
import { User } from 'src/utils/typeorm';
import { UpdateUserProfileParams, UserProfileFiles } from 'src/utils/types';
import { UpdateUserProfileDto } from '../dtos/UpdateUserProfile.dto';

@Controller(Routes.USERS_PROFILES)
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Patch()
  @UseInterceptors(FileFieldsInterceptor(UserProfileFileFields))
  async updateUserProfile(
    @AuthUser() user: User,
    @UploadedFiles() files: UserProfileFiles,
    @Body() dto: UpdateUserProfileDto,
  ) {
    const params: UpdateUserProfileParams = {};
    dto.about && (params.about = dto.about);
    files.avatar && (params.avatar = files.avatar[0]);
    files.banner && (params.banner = files.banner[0]);
    return this.userProfileService.createProfileOrUpdate(user, params);
  }
}
