import { HttpException, HttpStatus } from '@nestjs/common';
import { DBErrors } from 'src/database/database.models';
import { DBError } from 'src/database/database.service';

export function processError(error: DBError, entity: string, id?: string) {
  if (error.code === DBErrors.NOT_FOUND) {
    throw new HttpException(`${entity} not found`, HttpStatus.NOT_FOUND);
  }
  if (error.code === DBErrors.UUID) {
    throw new HttpException(`${id} is not valid UUID`, HttpStatus.BAD_REQUEST);
  }
  if (error.code === DBErrors.PASSWORD) {
    throw new HttpException('Invalid old password', HttpStatus.FORBIDDEN);
  }
}
