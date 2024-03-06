import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { Artist } from './entities/artist.entity';
import { DBError, DatabaseService } from 'src/database/database.service';
import { DBErrors } from 'src/database/database.models';

@Injectable()
export class ArtistsService {
  private artists = this.database.artists;

  constructor(private database: DatabaseService) {}

  findAll() {
    return Array.from(this.artists.values());
  }

  findOne(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const artist = this.artists.get(id);
    if (!artist) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    return artist;
  }

  create(dto: CreateArtistDto) {
    const artist = new Artist({
      ...dto,
      id: genUuid(),
    });
    this.artists.set(artist.id, artist);
    return artist;
  }

  update(id: string, dto: UpdateArtistDto) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const artist = this.artists.get(id);
    if (!artist) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    Object.keys(dto).forEach((param) => {
      artist[param] = dto[param];
    });
    return artist;
  }

  remove(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const artist = this.artists.get(id);
    if (!artist) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    Array.from(this.database.albums.values()).forEach((album) => {
      if (album.artistId === artist.id) {
        album.artistId = null;
      }
    });

    Array.from(this.database.tracks.values()).forEach((track) => {
      if (track.artistId === artist.id) {
        track.artistId = null;
      }
    });

    this.artists.delete(artist.id);
    return null;
  }
}
