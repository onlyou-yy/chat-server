import { Socket } from 'socket.io';
import { User } from './typeorm';
import { Request } from 'express';

export interface IAuthenticatedSocket extends Socket {
  user?: User;
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export interface HttpResponse<T> {
  code: number;
  msg: string;
  data: T;
}
