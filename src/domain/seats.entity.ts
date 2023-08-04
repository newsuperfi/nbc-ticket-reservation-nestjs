import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { User } from './users.entity';
import { Concert } from './concets.entity';
import { Concert_date } from './concert_dates.entity';
import { Reservation } from './reservations.entity';

@Entity({ name: 'concert_seats' })
export class Concert_Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  seat_number: string;

  @Column({ nullable: false, default: 'unbooked' })
  state: string;

  @ManyToOne(() => Concert, (concert) => concert.concert_seats)
  concert: Concert;

  @ManyToOne(() => Concert_date, (concert_date) => concert_date.concert_seats)
  concert_date: Concert_date;

  @ManyToOne(() => Reservation, (reservation) => reservation.concert_seats, {
    onDelete: 'SET NULL',
  })
  reservation: Reservation;
  // @RelationId((concert_seats: Concert_Seat) => concert_seats.reservation)
  // reservationId: number | null;
  // 근데 왜 되는지 모르겠다 ;;

  // @Column()
  // @RelationId((concert_seats: Concert_Seat) => concert_seats.reservation)
  // reservationId: number | null;
}
