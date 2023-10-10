import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export enum EServerOnEventType {
  /**用户建立连接 */
  CLIENT_CONNECTION = 'connection',
  /**用户断开连接 */
  CLIENT_DISCONNECT = 'disconnect',
  /**广播 */
  BROADCAST = 'broadcast',
  /**收到消息 */
  EVENT_MESSAGE = 'EVENT_MESSAGE',
  /**发送消息 */
  EVENT_SEND = 'EVENT_SEND',

  CHAT_WITH_SOMEONE = 'CHAT_WITH_SOMEONE',
  CHAT_AT_ROOM = 'CHAT_AT_ROOM',
}

export enum EClientOnEventType {
  CLIENT_GET_CHAT_DATA = 'CLIENT_GET_CHAT_DATA',
}

/**路由 */
export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  USERS_PROFILES = 'users/profile',
  USER_PRESENCE = 'users/presence',
  GROUPS = 'groups',
  GROUPS_MESSAGES = 'groups/messages',
  GROUPS_RECIPIENTS = 'groups/recipients',
  MESSAGES = 'messages',
  FRIENDS = 'friends',
  FRIENDS_REQUESTS = 'friends/request',
}

export const UserProfileFileFields: MulterField[] = [
  {
    name: 'banner',
    maxCount: 1,
  },
  {
    name: 'avatar',
    maxCount: 1,
  },
];
