import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
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
    super('Invalid password');
  }
}

export class AppUnprocessableEntityException extends UnprocessableEntityException {
  constructor(entity: string) {
    super(`${entity} not found`);
  }
}

export class AppUnauthorizedException extends UnauthorizedException {
  constructor() {
    super('Login is needed for this action');
  }
}
