import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UsersService } from 'src/users/users.service';
import { Reservation } from 'src/domain/reservations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertsService } from 'src/concerts/concerts.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private concertsService: ConcertsService,
  ) {}

  async reservationConcert(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const { concertId, concertDateId, quantity } = createReservationDto;
    const concert = await this.concertsService.concertDetail(concertId);
    return await this.reservationRepository.save({
      ticket_price: concert[0].price,
      quantity,
      total_price: concert[0].price * quantity,
      user: { id: userId },
      concert: { id: concertId },
      concert_date: { id: concertDateId },
    });
  }

  findAll() {
    return `This action returns all reservations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
