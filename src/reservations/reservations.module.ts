import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users.entity';
import { Reservation } from 'src/domain/reservations.entity';
import { Concert } from 'src/domain/concets.entity';
import { ConcertsService } from 'src/concerts/concerts.service';
import { Concert_date } from 'src/domain/concert_dates.entity';
import { Concert_Seat } from 'src/domain/seats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    TypeOrmModule.forFeature([Concert]),
    TypeOrmModule.forFeature([Concert_date]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Concert_Seat]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ConcertsService, UsersService],
})
export class ReservationsModule {}
