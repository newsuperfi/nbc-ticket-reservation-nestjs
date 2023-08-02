import { IsNotEmpty } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  artist: string;

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  location: string;

  introduction: string;
}
