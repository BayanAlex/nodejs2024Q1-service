export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist

  constructor(albumData: Album) {
    Object.assign(this, albumData);
  }
}