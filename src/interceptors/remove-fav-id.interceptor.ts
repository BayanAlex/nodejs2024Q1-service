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
export class RemoveFavIdInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      tap((data) => {
        if (!data) {
          return;
        }

        const transform = (obj: any) => {
          if (obj && typeof obj === 'object') {
            if (obj.favoritesId !== undefined) {
              obj.favoritesId = undefined;
              return;
            }
            Object.keys(obj).forEach((key) => {
              transform(obj[key]);
            });
          }
        };

        transform(data);
      }),
    );
  }
}
