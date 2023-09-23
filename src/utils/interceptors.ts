import {
  BadGatewayException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, map, throwError } from 'rxjs';
import { HttpResponse } from './interfaces';

@Injectable()
export class HttpResTransformInterceptor<T>
  implements NestInterceptor<T, HttpResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => throwError(new BadGatewayException())),
      map((value) => ({ code: 200, msg: 'success', data: value })),
    );
  }
}
