import { Group, User } from 'src/utils/typeorm';
import {
  AccessParams,
  CreateGroupParams,
  FetchGroupsParams,
  TransferOwnerParams,
  UpdateGroupDetailsParams,
} from 'src/utils/types';

export interface IGroupServices {
  /** 创建组 */
  createGroup(params: CreateGroupParams);
  /** 获取群组 */
  getGroups(params: FetchGroupsParams): Promise<Group[]>;
  /** 通过id查找群组 */
  findGroupById(id: string): Promise<Group>;
  /** 修改群组信息 */
  saveGroup(group: Group): Promise<Group>;
  /** 检查是否在群组中 */
  hasAccess(params: AccessParams): Promise<User | undefined>;
  /** 转让群主 */
  transferGroupOwner(params: TransferOwnerParams): Promise<Group>;
  /** 更新群信息 */
  updateDetails(params: UpdateGroupDetailsParams): Promise<Group>;
}
