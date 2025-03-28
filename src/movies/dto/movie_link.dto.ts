import { IsNotEmpty } from 'class-validator';

export class CreateVideoLinkDto {
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNotEmpty({ message: 'link is required' })
  link: string;
}
