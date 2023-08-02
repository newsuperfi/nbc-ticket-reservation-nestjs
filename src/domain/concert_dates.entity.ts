import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Concert } from './concets.entity';
import { Reservation } from './reservations.entity';
import { Concert_Seat } from './seats.entity';
@Entity({ name: 'concert_dates' })
export class Concert_date {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  date: Date;

  @OneToMany(() => Reservation, (reservations) => reservations.concert_date)
  reservations: Reservation;

  @ManyToOne(() => Concert, (concert) => concert.concert_dates)
  concert: Concert;

  @OneToMany(() => Concert_Seat, (concert_seats) => concert_seats.concert_date)
  concert_seats: Concert_Seat;
}
