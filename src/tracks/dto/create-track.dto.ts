import { IsInt, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  duration: number;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  artistId: string | null;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((_object, value) => value !== null)
  albumId: string | null;
}
