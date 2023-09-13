import { Socket } from 'socket.io';

export type TSocketGetEventData<T> = { type: string; data?: T };
export type TSocketPostEventData<T> = {
  eventData: TSocketGetEventData<T>;
  client: Socket;
};
