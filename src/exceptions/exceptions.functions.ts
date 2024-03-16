import {
  AppInvalidUuidException,
  AppNotFoundException,
} from './exceptions.classes';
import { validate as validateUuid } from 'uuid';

export function checkUuid(id: string) {
  if (!validateUuid(id)) {
    throw new AppInvalidUuidException(id);
  }
}

export function processNotFoundException(error: any, entity: string) {
  if (error?.code === 'P2025') {
    throw new AppNotFoundException(entity);
  }
  throw error;
}
