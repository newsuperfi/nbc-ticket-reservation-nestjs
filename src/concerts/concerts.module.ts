import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from 'src/domain/concets.entity';
import { Concert_date } from 'src/domain/concert_dates.entity';
import { User } from 'src/domain/users.entity';
import { UsersService } from 'src/users/users.service';
import { Concert_Seat } from 'src/domain/seats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Concert]),
    TypeOrmModule.forFeature([Concert_date]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Concert_Seat]),
  ],
  controllers: [ConcertsController],
  providers: [ConcertsService, UsersService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
