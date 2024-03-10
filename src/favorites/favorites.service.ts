import { Injectable } from '@nestjs/common';
import { DBError, DatabaseService } from 'src/database/database.service';
import { FavoritesResponse } from './entities/favorite.entity';
import { DBErrors } from 'src/database/database.models';
import { validate as validateUuid } from 'uuid';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class FavoritesService {
  private favorites = this.database.favorites;
  private tracks = this.database.tracks;
  private albums = this.database.albums;
  private artists = this.database.artists;

  constructor(private database: DatabaseService) {}

  findAll(): FavoritesResponse {
    const getEntity = <T>(entity: 'tracks' | 'albums' | 'artists') =>
      this.favorites[`${entity}`].map((id) => this[`${entity}`].get(id)) as T[];

    return {
      tracks: getEntity<Track>('tracks'),
      albums: getEntity<Album>('albums'),
      artists: getEntity<Artist>('artists'),
    };
  }

  create(entity: 'track' | 'album' | 'artist', id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const found = this[`${entity}s`].get(id);
    if (!found) {
      return new DBError(DBErrors.UNPROCESSABLE_ENTITY);
    }

    if (!this.favorites[`${entity}s`].includes(id)) {
      this.favorites[`${entity}s`].push(id);
    }

    return null;
  }

  remove(entity: 'track' | 'album' | 'artist', id: string) {
    if (!validateUuid(id)) {
      return new DBError(DBErrors.UUID);
    }

    const index = this.favorites[`${entity}s`].findIndex(
      (curId) => curId === id,
    );
    if (index === -1) {
      return new DBError(DBErrors.NOT_FOUND);
    }

    this.favorites[`${entity}s`].splice(index, 1);
    return null;
  }
}
