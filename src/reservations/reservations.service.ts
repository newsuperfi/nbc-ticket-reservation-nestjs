import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UsersService } from 'src/users/users.service';
import { Reservation } from 'src/domain/reservations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConcertsService } from 'src/concerts/concerts.service';
import { User } from 'src/domain/users.entity';
import { Concert_Seat } from 'src/domain/seats.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Concert_Seat)
    private seatRepository: Repository<Concert_Seat>,

    private usersService: UsersService,
    private concertsService: ConcertsService,
  ) {}

  // 공연 예매
  async concertReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const { concertId, concertDateId, seatId } = createReservationDto;
    const concert = await this.concertsService.concertDetail(concertId);
    const quantity = seatId.length;
    const result = await this.reservationRepository.save({
      ticket_price: concert[0].price,
      total_price: concert[0].price * quantity,
      user: { id: userId },
      concert: { id: concertId },
      concert_date: { id: concertDateId },
    });
    for (let i = 0; i < quantity; i++) {
      let seat = await this.seatRepository.findOneBy({ id: seatId[i] });
      if (seat.state === 'booked')
        throw new BadRequestException('이미 예약된 좌석입니다.');
      await this.seatRepository.save({
        id: seatId[i],
        reservation: { id: result.id },
        state: 'booked',
      });
    }
    const user = await this.usersService.findById(userId);
    user.point = user.point - concert[0].price * quantity;
    await this.usersService.updatePoint(user);
    return result;
  }

  // async reservationList(userId: number) {
  //   const results = await this.reservationRepository.find({
  //     where: { user: { id: userId } },
  //     relations: { concert: true, concert_seats: true },
  //   });
  //   return results;
  // }

  // 예매 목록 조회
  async reservationList(userId: number) {
    const results = await this.reservationRepository
      .createQueryBuilder('reservations')
      .select([
        'reservations',
        'concert.title',
        'concert.artist',
        'concert.location',
        'concert.price',
        'concert_seats.seat_number',
      ])
      .where('reservations.userId = :userId', { userId })
      .leftJoin('reservations.concert', 'concert')
      .leftJoin('reservations.concert_seats', 'concert_seats')
      .getMany();
    return results;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} reservation`;
  // }

  // update(id: number, updateReservationDto: UpdateReservationDto) {
  //   return `This action updates a #${id} reservation`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} reservation`;
  // }
}
