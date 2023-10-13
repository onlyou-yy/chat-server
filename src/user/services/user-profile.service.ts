import { Injectable } from '@nestjs/common';
import { IUserProfile } from '../interfaces/user-profile';
import { UserProfile, User } from 'src/utils/typeorm';
import { UpdateUserProfileParams } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateUUIDV4 } from 'src/utils/helpers';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { Attachment } from 'src/utils/interfaces';

@Injectable()
export class UserProfileService implements IUserProfile {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly profileRespository: Repository<UserProfile>,
    private readonly imageStorage: FileStorageService,
  ) {}

  createProfile(): Promise<UserProfile> {
    const profile = this.profileRespository.create();
    return this.profileRespository.save(profile);
  }

  async updateProfile(
    user: User,
    params: UpdateUserProfileParams,
  ): Promise<User> {
    if (params.avatar) {
      user.profile.avatar = await this.updateAssets('avatar', params.avatar);
    }
    if (params.banner) {
      user.profile.banner = await this.updateAssets('banner', params.banner);
    }
    if (params.about) {
      user.profile.about = params.about;
    }
    return this.userRepository.save(user);
  }

  async createProfileOrUpdate(
    user: User,
    params: UpdateUserProfileParams,
  ): Promise<User> {
    if (!user.profile) {
      console.log('User has not profile. Creating....');
      user.profile = await this.createProfile();
      return this.updateProfile(user, params);
    }
    console.log('User has profile');
    return this.updateProfile(user, params);
  }

  async updateAssets(type: string, file: Attachment) {
    const key = generateUUIDV4();
    const filename = `${type}_${key}_${file.originalname}`;
    const { src } = this.imageStorage.upload({ key: filename, file });
    return src;
  }
}
