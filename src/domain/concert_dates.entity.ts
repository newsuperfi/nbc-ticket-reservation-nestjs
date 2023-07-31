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
}
