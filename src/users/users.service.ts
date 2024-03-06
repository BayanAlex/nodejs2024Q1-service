import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DBError, DatabaseService } from 'src/database/database.service';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { User } from './entities/user.entity';
import { DBErrors } from 'src/database/database.models';

@Injectable()
export class UsersService {
  private users = this.database.users;

  constructor(private database: DatabaseService) {}

  findOne(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const user = this.users.get(id);
    if (!user) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    return user;
  }

  findAll() {
    return Array.from(this.users.values());
  }

  create(dto: CreateUserDto) {
    const createdAt = Date.now();
    const user = new User({
      ...dto,
      id: genUuid(),
      version: 1,
      createdAt: createdAt,
      updatedAt: createdAt,
    });
    this.users.set(user.id, user);
    return user;
  }

  update(id: string, dto: UpdatePasswordDto) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const user = this.users.get(id);
    if (!user) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    if (user.password !== dto.oldPassword) {
      return new DBError(DBErrors.PASSWORD);
    }

    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    user.version += 1;
    return user;
  }

  remove(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const user = this.users.get(id);
    if (!user) {
      return new DBError(DBErrors.NOT_FOUND);
    }
    this.users.delete(user.id);

    return null;
  }
}
