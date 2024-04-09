import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from 'src/endpoints/users/dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AppInvalidPasswordException,
  AppNotFoundException,
} from 'src/exceptions/exceptions.classes';
import {
  checkUuid,
  processNotFoundException,
} from 'src/exceptions/exceptions.functions';
import { compare, genSalt, hash } from 'bcrypt';
import 'dotenv/config';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    checkUuid(id);
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new AppNotFoundException('User');
    }
    return user;
  }

  async findUserByLoginAndPassword(login: string, password: string) {
    const users = await this.prisma.user.findMany({ where: { login } });
    if (!users.length) {
      throw new AppNotFoundException('User');
    }

    let foundUser: (typeof users)[number] | null = null;
    for (const user of users) {
      if (await compare(password, user.password)) {
        foundUser = user;
        break;
      }
    }
    if (!foundUser) {
      throw new AppInvalidPasswordException();
    }
    return foundUser;
  }

  async create(dto: CreateUserDto) {
    const salt = await genSalt(+process.env.CRYPT_SALT);
    dto.password = await hash(dto.password, salt);
    return this.prisma.user.create({ data: dto });
  }

  async update(id: string, dto: UpdatePasswordDto) {
    checkUuid(id);
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { password: true },
    });

    if (!user) {
      throw new AppNotFoundException('User');
    }

    if (!(await compare(dto.oldPassword, user.password))) {
      throw new AppInvalidPasswordException();
    }

    const salt = await genSalt(+process.env.CRYPT_SALT);
    return this.prisma.user.update({
      where: { id },
      data: {
        password: await hash(dto.newPassword, salt),
        version: { increment: 1 },
      },
    });
  }

  async remove(id: string) {
    checkUuid(id);
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      processNotFoundException(error, 'User');
    }
    return null;
  }
}
