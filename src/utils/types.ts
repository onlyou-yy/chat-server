import { Socket } from 'socket.io';

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
