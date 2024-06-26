import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from 'src/logging/logging.service';
import { getRequestLogParams } from './logging.interceptor';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private loggingService: LoggingService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    response.on('close', () => {
      const logParams = getRequestLogParams(request);
      const { statusCode } = response;
      if (!request.route || response.statusCode === StatusCodes.UNAUTHORIZED) {
        this.loggingService.error(...logParams, `Status code: ${statusCode}`);
      }
    });

    next();
  }
}
