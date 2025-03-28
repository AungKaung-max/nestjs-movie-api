import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationDTO {
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => (value ? Number(value) : 0))
  skip?: number = 0;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => (value ? Number(value) : 10))
  limit?: number = 10;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
