export class Artist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;

  constructor(artistData: Artist) {
    Object.assign(this, artistData);
  }
}
