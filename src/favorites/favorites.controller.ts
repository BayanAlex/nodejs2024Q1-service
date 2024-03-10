import { Controller, Get, Post, Param, Delete, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { DBError } from 'src/database/database.service';
import { processError } from 'src/utils/errors';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  createTrack(@Param('id') id: string) {
    const result = this.favoritesService.create('track', id);
    if (result instanceof DBError) {
      processError(result, 'Track', id);
    }
    return result;
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    const result = this.favoritesService.remove('track', id);
    if (result instanceof DBError) {
      processError(result, 'Track', id);
    }
    return result;
  }

  @Post('artist/:id')
  createArtist(@Param('id') id: string) {
    const result = this.favoritesService.create('artist', id);
    if (result instanceof DBError) {
      processError(result, 'Artist', id);
    }
    return result;
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    const result = this.favoritesService.remove('artist', id);
    if (result instanceof DBError) {
      processError(result, 'Artist', id);
    }
    return result;
  }

  @Post('album/:id')
  createAlbum(@Param('id') id: string) {
    const result = this.favoritesService.create('album', id);
    if (result instanceof DBError) {
      processError(result, 'Album', id);
    }
    return result;
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    const result = this.favoritesService.remove('album', id);
    if (result instanceof DBError) {
      processError(result, 'Album', id);
    }
    return result;
  }
}
