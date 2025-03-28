import { IsOptional, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class UpdateVideoDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsArray()
  movie_link?: string[];
}
