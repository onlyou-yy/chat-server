import { Socket } from 'socket.io';
import { GroupMessageAttachment, MessageAttachment, User } from './typeorm';

/**创建用户参数 */
export type CreateUserDetail = {
  /** 用户名 */
  username?: string;
  /** 密码 */
  password: string;
  /** 帐号，tel/email */
  account: string;
};

/**查找用户参数，多条件可选 */
export type FindUserParams = Partial<{
  id: string;
  account: string;
  username: string;
}>;

/** 查找用户选项，是否查出全部字段*/
export type FindUserOptions = {
  selectAllField: boolean;
};

export type UpdateUserProfileParams = Partial<{
  about: string;
  banner: Express.Multer.File;
  avatar: Express.Multer.File;
}>;

export type UserProfileFiles = Partial<{
  avatar: Express.Multer.File[];
  banner: Express.Multer.File[];
}>;

export type UpdateStatusMessageParams = {
  user: User;
  statusMessage: string;
};
export type UserPresenceStatus = 'online' | 'away' | 'offline' | 'dnd';

export type ImagePermission = 'public-read' | 'private';
export type UploadImageParams = {
  key: string;
  file: Express.Multer.File;
};

export type UploadMessageAttachmentParams = {
  file: Express.Multer.File;
  messageAttachment: MessageAttachment;
};

export type UploadGroupMessageAttachmentParams = {
  file: Express.Multer.File;
  messageAttachment: GroupMessageAttachment;
};

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

export type TChatToData = {
  fromId: string;
  toId: string;
  data: unknown;
};

export type TChatFromData = {
  toId: string;
  data: unknown;
};

export type TChatEventGetData = TSocketPostEventData<TChatFromData>;

export type TSocketGetEventData<T> = { type: string; data?: T };
export type TSocketPostEventData<T> = {
  eventData: TSocketGetEventData<T>;
  client: Socket;
};
