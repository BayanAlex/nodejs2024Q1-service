import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  year: number;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;
}
