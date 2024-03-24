import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggingService } from './logging.service';
import { catchError, tap } from 'rxjs';
import { Request, Response } from 'express';

export function getRequestLogParams(request: Request) {
  const { method, url, query, body } = request;
  const requestBody = Object.keys(body).length ? body : null;
  const queryParams = Object.keys(query).length ? query : null;
  const logParams: [string, string, any, any, string | null, any] = [
    `Host: ${request.get('Host')}`,
    `Request: ${method} ${url.split('?')[0]}`,
    requestBody ? 'Request body:' : null,
    requestBody,
    queryParams ? 'Query params:' : null,
    queryParams,
  ];
  return logParams;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest<Request>();
    const logParams = getRequestLogParams(request);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        const { statusCode } = response;

        this.loggingService.log(
          ...logParams,
          `Status code: ${statusCode}`,
          data ? 'Response body:' : null,
          data,
        );
      }),
      catchError((error) => {
        const statusCode = error.response.statusCode;
        let logFunc = this.loggingService.error;
        if (statusCode >= 500 && statusCode < 600) {
          logFunc = this.loggingService.fatal;
        }
        logFunc = logFunc.bind(this.loggingService);

        logFunc(
          ...logParams,
          `Status code: ${statusCode}`,
          'Response body:',
          error.response,
        );
        throw error;
      }),
    );
  }
}
