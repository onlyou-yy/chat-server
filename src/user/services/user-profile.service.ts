import { Injectable } from '@nestjs/common';
import { IUserProfile } from '../interfaces/user-profile';
import { UserProfile, User } from 'src/utils/typeorm';
import { UpdateUserProfileParams } from 'src/utils/types';

@Injectable()
export class UserProfileService implements IUserProfile {
  createProfile(): Promise<UserProfile> {
    throw new Error('Method not implemented.');
  }
  updateProfile(
    user: User,
    params: UpdateUserProfileParams,
  ): Promise<UserProfile> {
    throw new Error('Method not implemented.');
  }
  createProfileOrUpdate(
    user: User,
    params: UpdateUserProfileParams,
  ): Promise<UserProfile> {
    throw new Error('Method not implemented.');
  }
}
