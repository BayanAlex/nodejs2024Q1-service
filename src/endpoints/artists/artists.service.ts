import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppNotFoundException } from 'src/exceptions/exceptions.classes';
import {
  checkUuid,
  processNotFoundException,
} from 'src/exceptions/exceptions.functions';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    checkUuid(id);
    const artist = await this.prisma.artist.findFirst({ where: { id } });
    if (!artist) {
      throw new AppNotFoundException('Artist');
    }
    return artist;
  }

  create(dto: CreateArtistDto) {
    return this.prisma.artist.create({ data: dto });
  }

  async update(id: string, dto: UpdateArtistDto) {
    checkUuid(id);
    try {
      return await this.prisma.artist.update({ where: { id }, data: dto });
    } catch (error) {
      processNotFoundException(error, 'Artist');
    }
  }

  async remove(id: string) {
    checkUuid(id);
    try {
      await this.prisma.artist.delete({ where: { id } });
    } catch (error) {
      processNotFoundException(error, 'Artist');
    }
    return null;
  }
}
