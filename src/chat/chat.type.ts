import { TSocketPostEventData } from 'src/events/messageData.type';

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
