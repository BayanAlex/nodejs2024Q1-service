import { Injectable } from '@nestjs/common';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Favorites } from 'src/favorites/entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';
import { DBErrors } from './database.models';

export class DBError {
  constructor(public code: DBErrors) {}
}

@Injectable()
export class DatabaseService {
  users = new Map<string, User>();
  artists = new Map<string, Artist>();
  tracks = new Map<string, Track>();
  albums = new Map<string, Album>();
  favorites = new Favorites();
}
