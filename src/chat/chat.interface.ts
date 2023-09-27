import { TChatEventGetData } from 'src/utils/types';

export interface ITalkTo<T> {
  fromId: string;
  toId: string;
  msg: T;
}

export interface ITalkGet<T> {
  id: string;
  msg: T;
}

export interface ChatHandler {
  talkTosomeone(data: TChatEventGetData): void;
  talkAtRoom(data: TChatEventGetData): void;
}
