import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from './interfaces';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();
    return request.user;
  },
);
