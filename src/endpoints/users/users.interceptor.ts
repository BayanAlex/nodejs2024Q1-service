import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class UsersInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      tap((data) => {
        if (!data) {
          return;
        }

        const transform = (user: any) => {
          if ('createdAt' in user && user.createdAt instanceof Date) {
            user.createdAt = user.createdAt.getTime();
          }
          if ('updatedAt' in user && user.updatedAt instanceof Date) {
            user.updatedAt = user.updatedAt.getTime();
          }
          user.password = undefined;
        };

        if (Array.isArray(data)) {
          data.forEach((user) => transform(user));
        } else {
          transform(data);
        }
      }),
    );
  }
}
