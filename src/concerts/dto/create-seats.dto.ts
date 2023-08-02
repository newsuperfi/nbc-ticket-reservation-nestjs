import { IsNotEmpty } from 'class-validator';

export class CreateSeatsDto {
  @IsNotEmpty()
  row: string;

  @IsNotEmpty()
  column: number;

  @IsNotEmpty()
  concertId: number;

  @IsNotEmpty()
  concertDateId: number;
}
