import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  year: number;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;
}
