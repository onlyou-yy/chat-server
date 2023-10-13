import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest, IAuthenticatedSocket } from './interfaces';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const SocektUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const socket = <IAuthenticatedSocket>ctx.switchToWs().getClient();
    return socket.user;
  },
);
