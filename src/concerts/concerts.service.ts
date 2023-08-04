import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Concert } from 'src/domain/concets.entity';
import { Repository } from 'typeorm';
import { Concert_date } from 'src/domain/concert_dates.entity';
import { UsersService } from 'src/users/users.service';
import { Concert_Seat } from 'src/domain/seats.entity';
import { CreateSeatsDto } from './dto/create-seats.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private concertRepository: Repository<Concert>,

    @InjectRepository(Concert_date)
    private conDateRepository: Repository<Concert_date>,

    @InjectRepository(Concert_Seat)
    private seatsRepository: Repository<Concert_Seat>,

    private usersService: UsersService,
  ) {}

  // 공연 등록
  async registration(createConcertDto: CreateConcertDto, userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user.is_admin)
      throw new UnauthorizedException('공연 관리자가 아닙니다');
    // const { title, artist, price, location } = createConcertDto;
    // if (!title || !artist || !price || !location)
    // throw new BadRequestException('공연 정보를 모두 입력해주세요');
    return await this.concertRepository.save(createConcertDto);
  }

  list() {
    return this.concertRepository.find();
  }

  // 공연 일정 등록
  async datesRegistration(concertId: number, dates: Date[], userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user.is_admin)
      throw new UnauthorizedException('공연 관리자가 아닙니다');
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

  // 공연정보 상세조회
  async concertDetail(concertId: number) {
    return await this.concertRepository
      .createQueryBuilder('concerts')
      // .select([
      //   'concerts.title',
      //   'concerts.artist',
      //   'concerts.location',
      //   'concert_dates.date',
      //   'concerts.introduction',
      //   'concerts.price',
      //   'concert_seats.seat_number',
      //   'concert_seats.state',
      // ])
      .leftJoinAndSelect('concerts.concert_dates', 'concert_dates')
      .leftJoinAndSelect('concert_dates.concert_seats', 'concert_seats')
      .where('concerts.id = :concertId', { concertId })
      // .andWhere('concert_seats.state = :state', { state: 'unbooked' })
      .getMany();
  }

  // 공연 검색
  async searchConcert(keyword: string) {
    return await this.concertRepository
      .createQueryBuilder('concerts')
      .select()
      .where('concerts.title LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('concerts.artist LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }

  // 공연 좌석 생성
  async createSeats(
    row: string,
    column: number,
    concertId: number,
    concertDateId: number,
    userId: number,
  ) {
    const user = await this.usersService.findById(userId);
    if (!user.is_admin)
      throw new UnauthorizedException('공연 관리자가 아닙니다.');
    let results = [];
    for (let i = 1; i <= column; i++) {
      const seat = await this.seatsRepository.save({
        seat_number: `${row}${i}`,
        concert: { id: concertId },
        concert_date: { id: concertDateId },
      });
      results.push(seat);
    }

    return results;
  }
}
