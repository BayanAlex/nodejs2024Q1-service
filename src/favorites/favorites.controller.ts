import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { RemoveFavIdInterceptor } from 'src/interceptors/remove-fav-id.interceptor';

@Controller('favs')
@UseInterceptors(RemoveFavIdInterceptor)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  createTrack(@Param('id') id: string) {
    return this.favoritesService.create('Track', id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string) {
    await this.favoritesService.remove('Track', id);
  }

  @Post('artist/:id')
  createArtist(@Param('id') id: string) {
    return this.favoritesService.create('Artist', id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    await this.favoritesService.remove('Artist', id);
  }

  @Post('album/:id')
  createAlbum(@Param('id') id: string) {
    return this.favoritesService.create('Album', id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string) {
    await this.favoritesService.remove('Album', id);
  }
}
