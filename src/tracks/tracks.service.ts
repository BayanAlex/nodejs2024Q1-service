import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DBError, DatabaseService } from 'src/database/database.service';
import { DBErrors } from 'src/database/database.models';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  private tracks = this.database.tracks;

  constructor(private database: DatabaseService) {}

  findAll() {
    return Array.from(this.tracks.values());
  }

  findOne(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const track = this.tracks.get(id);
    if (!track) {
      return new DBError(DBErrors.NOT_FOUND);
    }
    return track;
  }

  create(dto: CreateTrackDto) {
    const track = new Track({
      ...dto,
      id: genUuid(),
    });
    this.tracks.set(track.id, track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const track = this.tracks.get(id);
    if (!track) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    Object.keys(dto).forEach((param) => {
      track[param] = dto[param];
    });
    return track;
  }

  remove(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const track = this.tracks.get(id);
    if (!track) {
      return new DBError(DBErrors.NOT_FOUND);
    }
    this.tracks.delete(track.id);
    return null;
  }
}
