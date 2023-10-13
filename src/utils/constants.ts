import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

/** 服务端接收的事件 */
export enum ServerOnEventType {
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

  FRIEND_REQUEST_ACCEPTED = 'FRIEND_REQUEST_ACCEPTED',
  FRIEND_REQUEST_REJECTED = 'FRIEND_REQUEST_REJECTED',
  FRIEND_REMOVED = 'FRIEND_REMOVED',
}

/** 发送给客户端的事件 */
export enum ClientOnEventType {
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
  CONVERSATIONS = 'conversations',
  EXISTS = 'exists',
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
