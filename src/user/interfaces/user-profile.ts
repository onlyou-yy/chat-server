import { User, UserProfile } from 'src/utils/typeorm';
import { UpdateUserProfileParams } from 'src/utils/types';

export interface IUserProfile {
  /** 创建用户其他信息 */
  createProfile(): Promise<UserProfile>;

  /** 更新用户其他信息 */
  updateProfile(user: User, params: UpdateUserProfileParams): Promise<User>;

  createProfileOrUpdate(
    user: User,
    params: UpdateUserProfileParams,
  ): Promise<User>;
}
