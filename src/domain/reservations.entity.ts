import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './users.entity';
import { Concert } from './concets.entity';
import { Concert_date } from './concert_dates.entity';
import { Concert_Seat } from './seats.entity';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  ticket_price: number;

  @Column({ nullable: false })
  total_price: number;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Concert, (concert) => concert.reservations)
  concert: Concert;

  @ManyToOne(() => Concert_date, (concert_date) => concert_date.reservations, {
    eager: true,
  })
  concert_date: Concert_date;

  @OneToMany(() => Concert_Seat, (concert_seats) => concert_seats.reservation, {
    eager: true,
    // onDelete: 'SET NULL',
  })
  concert_seats: Concert_Seat;
}
