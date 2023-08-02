import { IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  concertId: number;

  @IsNotEmpty()
  concertDateId: number;

  @IsNotEmpty()
  seatId: number[];
}
