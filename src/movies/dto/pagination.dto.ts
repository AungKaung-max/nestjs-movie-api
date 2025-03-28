import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDTO {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 0))
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 10;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
