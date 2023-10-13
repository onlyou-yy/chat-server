import { Socket } from 'socket.io';
import {
  Conversation,
  Friend,
  FriendRequest,
  Group,
  GroupMessage,
  GroupMessageAttachment,
  Message,
  MessageAttachment,
  User,
} from './typeorm';
import { Attachment } from './interfaces';

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
  banner: Attachment;
  avatar: Attachment;
}>;

export type UserProfileFiles = Partial<{
  avatar: Attachment[];
  banner: Attachment[];
}>;

export type UpdateStatusMessageParams = {
  user: User;
  statusMessage: string;
};
export type UserPresenceStatus = 'online' | 'away' | 'offline' | 'dnd';

export type ImagePermission = 'public-read' | 'private';
export type UploadImageParams = {
  key: string;
  file: Attachment;
};

export type UploadMessageAttachmentParams = {
  file: Attachment;
  messageAttachment: MessageAttachment;
};

export type UploadGroupMessageAttachmentParams = {
  file: Attachment;
  messageAttachment: GroupMessageAttachment;
};

export type CreateGroupParams = {
  creator: User;
  title?: string;
  users: string[];
};

export type FetchGroupsParams = {
  userId: string;
};

export type CreateGroupMessageParams = {
  author: User;
  attachments?: Attachment[];
  content: string;
  groupId: string;
};

export type CreateGroupMessageResponse = {
  message: GroupMessage;
  group: Group;
};

export type DeleteGroupMessageParams = {
  userId: string;
  groupId: string;
  messageId: string;
};

export type AddGroupRecipientParams = {
  id: string;
  account: string;
  userId: string;
};

export type RemoveGroupRecipientParams = {
  id: string;
  removeUserId: string;
  issuerId: string;
};

export type AddGroupUserResponse = {
  group: Group;
  user: User;
};

export type RemoveGroupUserResponse = {
  group: Group;
  user: User;
};

export type AccessParams = {
  id: string;
  userId: string;
};

export type TransferOwnerParams = {
  userId: string;
  groupId: string;
  newOwnerId: string;
};

export type LeaveGroupParams = {
  id: string;
  userId: string;
};

export type CheckUserGroupParams = {
  id: string;
  userId: string;
};

export type UpdateGroupDetailsParams = {
  id: string;
  title?: string;
  avatar?: Attachment;
};

export type CreateParticipantParams = {
  id: string;
};

export type CreateMessageParams = {
  id: string;
  content?: string;
  attachments?: Attachment[];
  user: User;
};

export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type FindMessageParams = {
  userId: string;
  conversationId: string;
  messageId: string;
};

export type EditMessageParams = {
  conversationId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type EditGroupMessageParams = {
  groupId: string;
  messageId: string;
  userId: string;
  content: string;
};

export type CreateFriendParams = {
  user: User;
  account: string;
};

export type FriendRequestStatus = 'accepted' | 'pending' | 'rejected';

export type FriendRequestParams = {
  id: string;
  userId: string;
};

export type CancelFriendRequestParams = {
  id: string;
  userId: string;
};

export type DeleteFriendRequestParams = {
  id: string;
  userId: string;
};

export type AcceptFriendRequestResponse = {
  friend: Friend;
  friendRequest: FriendRequest;
};

export type RemoveFriendEventPayload = {
  friend: Friend;
  userId: string;
};

export type CreateConversationParams = {
  username: string;
  message: string;
};

export type GetConversationMessagesParams = {
  id: string;
  limit: number;
};

export type UpdateConversationParams = Partial<{
  id: string;
  lastMessageSent: Message;
}>;

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
