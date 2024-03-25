import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AppInvalidPasswordException,
  AppNotFoundException,
} from 'src/exceptions/exceptions.classes';
import {
  checkUuid,
  processNotFoundException,
} from 'src/exceptions/exceptions.functions';

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

  create(dto: CreateUserDto) {
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

    if (user.password !== dto.oldPassword) {
      throw new AppInvalidPasswordException();
    }

    return this.prisma.user.update({
      where: { id },
      data: { password: dto.newPassword, version: { increment: 1 } },
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
