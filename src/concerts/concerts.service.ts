import { Injectable } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from 'src/domain/concets.entity';
import { Repository } from 'typeorm';
import { Concert_date } from 'src/domain/concert_dates.entity';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,

    @InjectRepository(Concert_date)
    private conDateRepository: Repository<Concert_date>,
  ) {}

  registration(createConcertDto: CreateConcertDto) {
    return this.concertRepository.save(createConcertDto);
  }

  list() {
    return this.concertRepository.find();
  }

  async datesRegistration(concertId: number, dates: Date[]) {
    const results = [];
    for (let i = 0; i < dates.length; i++) {
      const result = await this.conDateRepository.save({
        date: dates[i]['date'],
        concert: { id: concertId },
      });
      results.push(result);
    }
    return results;
  }

  async concertDetail(concertId: number) {
    return await this.concertRepository.find({
      where: { id: concertId },
      relations: { concert_dates: true }, // 컬럼 제한하려면 쿼리빌더 써야 할 듯.
    });
  }

  async searchConcert(keyword: string) {
    return await this.concertRepository
      .createQueryBuilder('concerts')
      .select()
      .where('concerts.title LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('concerts.artist LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }
}
