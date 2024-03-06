import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DBError } from 'src/database/database.service';
import { processError } from 'src/utils/errors';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    const result = this.artistsService.findOne(id);
    if (result instanceof DBError) {
      processError(result, 'Artist', id);
    }
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    const result = this.artistsService.update(id, updateArtistDto);
    if (result instanceof DBError) {
      processError(result, 'Artist', id);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const result = this.artistsService.remove(id);
    if (result instanceof DBError) {
      processError(result, 'Artist', id);
    }
  }
}
