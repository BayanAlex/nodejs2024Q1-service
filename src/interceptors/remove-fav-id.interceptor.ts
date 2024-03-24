import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class RemoveFavIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
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
