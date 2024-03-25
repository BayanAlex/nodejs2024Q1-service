import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppNotFoundException } from 'src/exceptions/exceptions.classes';
import {
  checkUuid,
  processNotFoundException,
} from 'src/exceptions/exceptions.functions';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.album.findMany();
  }

  async findOne(id: string) {
    checkUuid(id);
    const album = await this.prisma.album.findFirst({ where: { id } });
    if (!album) {
      throw new AppNotFoundException('Album');
    }
    return album;
  }

  create(dto: CreateAlbumDto) {
    return this.prisma.album.create({ data: dto });
  }

  async update(id: string, dto: UpdateAlbumDto) {
    checkUuid(id);
    try {
      return await this.prisma.album.update({ where: { id }, data: dto });
    } catch (error) {
      processNotFoundException(error, 'Album');
    }
  }

  async remove(id: string) {
    checkUuid(id);
    try {
      await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      processNotFoundException(error, 'Album');
    }
    return null;
  }
}
