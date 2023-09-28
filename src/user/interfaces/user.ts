import { User } from 'src/utils/typeorm';
import {
  CreateUserDetail,
  FindUserOptions,
  FindUserParams,
} from 'src/utils/types';

export interface IUserService {
  /**创建用户 */
  createUser(userDetail: CreateUserDetail): Promise<User>;
  /**查找用户 */
  findUser(
    findUserParams: FindUserParams,
    options?: FindUserOptions,
  ): Promise<User>;
  /**更新用户信息 */
  saveUser(user: User): Promise<User>;
  /**搜索用户 */
  searchUsers(query: string): Promise<User[]>;
}
