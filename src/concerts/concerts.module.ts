import { Module } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from 'src/domain/concets.entity';
import { Concert_date } from 'src/domain/concert_dates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Concert]),
    TypeOrmModule.forFeature([Concert_date]),
  ],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
