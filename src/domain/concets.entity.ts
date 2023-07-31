import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from './reservations.entity';
import { Concert_date } from './concert_dates.entity';

@Entity({ name: 'concerts' })
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  artist: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  location: string;

  @Column()
  introduction: string;

  @OneToMany(() => Reservation, (reservation) => reservation.concert)
  reservations: Reservation[];

  @OneToMany(() => Concert_date, (concert_dates) => concert_dates.concert)
  concert_dates: Concert_date[];
}
