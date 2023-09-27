import { Conversation } from './entities/Conversation.entity';
import { Friend } from './entities/Friend.entity';
import { FriendRequest } from './entities/FriendRequest.entity';
import { Group } from './entities/Group.entity';
import { GroupMessage } from './entities/GroupMessage.entity';
import { GroupMessageAttachment } from './entities/GroupMessageAttachment.entity';
import { Message } from './entities/Message.entity';
import { MessageAttachment } from './entities/MessageAttachment.entity';
import { Peer } from './entities/Peer.entity';
import { Session } from './entities/Session.entity';
import { User } from './entities/User.entity';
import { UserPresence } from './entities/UserPresence.entity';
import { UserProfile } from './entities/UserProfile.entity';

const entities = [
  User,
  UserProfile,
  UserPresence,
  Conversation,
  FriendRequest,
  Friend,
  Group,
  GroupMessage,
  GroupMessageAttachment,
  Message,
  MessageAttachment,
  Peer,
  Session,
];

export default entities;

export {
  User,
  UserProfile,
  UserPresence,
  Conversation,
  FriendRequest,
  Friend,
  Group,
  GroupMessage,
  GroupMessageAttachment,
  Message,
  MessageAttachment,
  Peer,
  Session,
};
