import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservations.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: true })
  introduction: string;

  @Column({ default: '1000000' })
  point: number;

  @Column({ default: false })
  is_admin: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}
