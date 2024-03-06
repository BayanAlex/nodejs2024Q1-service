import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DBError } from 'src/database/database.service';
import { processError } from 'src/utils/errors';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    const result = this.albumsService.findOne(id);
    if (result instanceof DBError) {
      processError(result, 'Album', id);
    }
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    const result = this.albumsService.update(id, updateAlbumDto);
    if (result instanceof DBError) {
      processError(result, 'Album', id);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const result = this.albumsService.remove(id);
    if (result instanceof DBError) {
      processError(result, 'Album', id);
    }
  }
}
