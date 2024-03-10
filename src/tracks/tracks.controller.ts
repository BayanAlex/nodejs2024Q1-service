import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Put,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { processError } from 'src/utils/errors';
import { DBError } from 'src/database/database.service';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.tracksService.create(createTrackDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  findOne(@Param('id') id: string) {
    const result = this.tracksService.findOne(id);
    if (result instanceof DBError) {
      processError(result, 'Track', id);
    }
    return this.tracksService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  update(@Param('id') id: string, @Body() updateTrackDto: UpdateTrackDto) {
    const result = this.tracksService.update(id, updateTrackDto);
    if (result instanceof DBError) {
      processError(result, 'Track', id);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    const result = this.tracksService.remove(id);
    if (result instanceof DBError) {
      processError(result, 'Track', id);
    }
  }
}
