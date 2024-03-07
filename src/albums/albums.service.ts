import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DBError, DatabaseService } from 'src/database/database.service';
import { DBErrors } from 'src/database/database.models';
import { v4 as genUuid, validate as validateUuid } from 'uuid';
import { Album } from './entities/album.entity';

@Injectable()
export class AlbumsService {
  private albums = this.database.albums;

  constructor(private database: DatabaseService) {}

  findAll() {
    return Array.from(this.albums.values());
  }

  findOne(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const album = this.albums.get(id);
    if (!album) {
      return new DBError(DBErrors.NOT_FOUND);
    }
    return album;
  }

  create(dto: CreateAlbumDto) {
    const album = new Album({
      ...dto,
      id: genUuid(),
    });
    this.albums.set(album.id, album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const album = this.albums.get(id);
    if (!album) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    Object.keys(dto).forEach((param) => {
      album[param] = dto[param];
    });
    return album;
  }

  remove(id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const album = this.albums.get(id);
    if (!album) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    Array.from(this.database.tracks.values()).forEach((track) => {
      if (track.albumId === album.id) {
        track.albumId = null;
      }
    });

    const favIndex = this.database.favorites.albums.indexOf(id);
    if (favIndex > -1) {
      this.database.favorites.albums.splice(favIndex, 1);
    }

    this.albums.delete(album.id);
    return null;
  }
}
