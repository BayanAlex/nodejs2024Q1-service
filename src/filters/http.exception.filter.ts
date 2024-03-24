import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  AppInvalidPasswordException,
  AppInvalidUuidException,
  AppNotFoundException,
  AppUnprocessableEntityException,
} from 'src/exceptions/exceptions.classes';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception instanceof BadRequestException ||
      exception instanceof NotFoundException ||
      exception instanceof AppInvalidUuidException ||
      exception instanceof AppInvalidPasswordException ||
      exception instanceof AppNotFoundException ||
      exception instanceof AppUnprocessableEntityException
    ) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    response.status(500).json({
      message: 'Unexpected error response',
      error: 'Internal server error',
      statusCode: 500,
    });
  }
}
