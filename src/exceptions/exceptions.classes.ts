import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class AppInvalidUuidException extends BadRequestException {
  constructor(id: string) {
    super(`${id} is not valid UUID`);
  }
}

export class AppNotFoundException extends NotFoundException {
  constructor(entity: string) {
    super(`${entity} not found`);
  }
}

export class AppInvalidPasswordException extends ForbiddenException {
  constructor() {
    super('Invalid old password');
  }
}

export class AppUnprocessableEntityException extends UnprocessableEntityException {
  constructor(entity: string) {
    super(`${entity} not found`);
  }
}
