import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppNotFoundException } from 'src/exceptions/exceptions.classes';
import {
  checkUuid,
  processNotFoundException,
} from 'src/exceptions/exceptions.functions';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string) {
    checkUuid(id);
    const track = await this.prisma.track.findFirst({ where: { id } });
    if (!track) {
      throw new AppNotFoundException('Track');
    }
    return track;
  }

  create(dto: CreateTrackDto) {
    return this.prisma.track.create({ data: dto });
  }

  async update(id: string, dto: UpdateTrackDto) {
    checkUuid(id);
    try {
      return await this.prisma.track.update({ where: { id }, data: dto });
    } catch (error) {
      processNotFoundException(error, 'Track');
    }
  }

  async remove(id: string) {
    checkUuid(id);
    try {
      await this.prisma.track.delete({ where: { id } });
    } catch (error) {
      processNotFoundException(error, 'Track');
    }
    return null;
  }
}
