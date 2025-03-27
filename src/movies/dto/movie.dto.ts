import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNotEmpty({ message: 'description is required' })
  description?: string;

  @IsOptional()
  @IsNotEmpty({ message: 'video  is required' })
  video: string;

  @IsNotEmpty({ message: 'user_id is required' })
  user_id: number;
}
