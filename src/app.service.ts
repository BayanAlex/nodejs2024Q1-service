import { Injectable } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';

@Injectable()
export class AppService {
  constructor(private loggingSevice: LoggingService) {
    process.on('unhandledRejection', (reason, promise) => {
      this.loggingSevice.fatal(`Unhandled Rejection:`, promise, reason);
    });

    process.on('uncaughtException', (error, origin) => {
      this.loggingSevice.fatal('Uncaught Exception:', error, origin);
    });
  }
}
