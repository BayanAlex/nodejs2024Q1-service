import { Injectable } from '@nestjs/common';
import { v4 as genUuid } from 'uuid';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
