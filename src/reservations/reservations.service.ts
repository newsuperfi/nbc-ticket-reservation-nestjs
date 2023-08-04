import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { UsersService } from 'src/users/users.service';
import { Reservation } from 'src/domain/reservations.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConcertsService } from 'src/concerts/concerts.service';
import { User } from 'src/domain/users.entity';
import { Concert_Seat } from 'src/domain/seats.entity';
import { Concert } from 'src/domain/concets.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,

    @InjectRepository(Concert_Seat)
    private seatRepository: Repository<Concert_Seat>,

    private usersService: UsersService,
    private concertsService: ConcertsService,

    private dataSourse: DataSource,
  ) {}

  // 공연 예매
  async concertReservation(
    createReservationDto: CreateReservationDto,
    userId: number,
  ) {
    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { concertId, concertDateId, seatId } = createReservationDto;
      const concert = await this.concertsService.concertDetail(concertId);
      const quantity = seatId.length;
      const result = await queryRunner.manager.getRepository(Reservation).save({
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

        await queryRunner.manager.getRepository(Concert_Seat).save({
          id: seatId[i],
          reservation: { id: result.id },
          state: 'booked',
        });
      }
      const user = await this.usersService.findById(userId);
      user.point = user.point - concert[0].price * quantity;
      await this.usersService.updatePoint(user);

      await queryRunner.commitTransaction();
      return { message: '예매에 성공했습니다', result };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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

  async cancelReservation(reservationId) {
    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const reservation = await queryRunner.manager
        .getRepository(Reservation)
        .findOneBy({ id: reservationId });
      console.log(reservation);
      const seats: any = reservation.concert_seats;
      for (let i = 0; i < seats.length; i++) {
        console.log('2222222222');
        const seat = await queryRunner.manager
          .getRepository(Concert_Seat)
          .findOneBy({ id: seats[i].id });
        console.log('좌석', seat);
        if (seat.state === 'unbooked')
          throw new ForbiddenException('예약되지 않은 좌석입니다.');
        seat.state = 'unbooked';
        seat.reservation = null;
        // await seat.save();
        //reservationId를 지워야하는데.. foreignKey라 그런지 없는 타입이라 나온다..
        // const result = await queryRunner.manager
        //   .getRepository(Concert_Seat)
        //   .update({ id: seat.id }, { state: 'unbooked', reservation: null });
        // console.log(result);
      }
      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
