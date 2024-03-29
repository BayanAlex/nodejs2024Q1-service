import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AppNotFoundException,
  AppUnprocessableEntityException,
} from 'src/exceptions/exceptions.classes';
import { checkUuid } from 'src/exceptions/exceptions.functions';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.favorites.findFirst({
      select: { albums: true, artists: true, tracks: true },
    });
  }

  async create(entity: 'Track' | 'Album' | 'Artist', id: string) {
    checkUuid(id);
    const favoritesId = (await this.prisma.favorites.findFirst()).id;
    const updateParams = {
      where: { id },
      data: { favoritesId },
    };

    try {
      switch (entity) {
        case 'Track':
          await this.prisma.track.update(updateParams);
          break;

        case 'Album':
          await this.prisma.album.update(updateParams);
          break;

        case 'Artist':
          await this.prisma.artist.update(updateParams);
          break;
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppUnprocessableEntityException(entity);
      }
    }

    return { message: `${entity} successfully added to favorites` };
  }

  async remove(entity: 'Track' | 'Album' | 'Artist', id: string) {
    checkUuid(id);
    const favoritesId = (await this.prisma.favorites.findFirst()).id;
    const updateParams = {
      where: { id },
      data: { favoritesId: null },
    };

    switch (entity) {
      case 'Track':
        if (!this.prisma.track.findFirst({ where: { id, favoritesId } })) {
          throw new AppNotFoundException(entity);
        }
        await this.prisma.track.update(updateParams);
        break;

      case 'Album':
        if (!this.prisma.album.findFirst({ where: { id, favoritesId } })) {
          throw new AppNotFoundException(entity);
        }
        await this.prisma.album.update(updateParams);
        break;

      case 'Artist':
        if (!this.prisma.artist.findFirst({ where: { id, favoritesId } })) {
          throw new AppNotFoundException(entity);
        }
        await this.prisma.artist.update(updateParams);
        break;
    }

    return null;
  }
}
