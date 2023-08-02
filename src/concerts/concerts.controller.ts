import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IRequest } from 'src/commons/interfaces/context';
import { Response } from 'express';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { CreateSeatsDto } from './dto/create-seats.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post('registration') // 공연 등록
  @UseGuards(AuthGuard)
  async registration(
    @Body() createConcertDto: CreateConcertDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const result = await this.concertsService.registration(
      createConcertDto,
      userId,
    );
    return res.json({ message: '공연 등록에 성공했습니다.', result });
  }

  @Post('registration/dates/:concertId') // 공연 일정 등록
  @UseGuards(AuthGuard)
  async datesRegistration(
    @Body() dates: Date[],
    @Param('concertId') concertId: number,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const results = await this.concertsService.datesRegistration(
      concertId,
      dates,
      userId,
    );
    return res.json({ message: '일정 등록에 성공했습니다.', results });
  }

  @Get('list') // 공연 목록 조회
  list() {
    return this.concertsService.list();
  }

  @Get('detail/:concertId') // 공연 상세 조회
  async concertDetail(
    @Param('concertId') concertId: number,
    @Res() res: Response,
  ) {
    const result = await this.concertsService.concertDetail(concertId);
    // if(!result) throw new
    return res.json({ result });
  }

  @Get('search') // 공연 검색
  async searchConcert(@Query() keywordQuery) {
    const { keyword } = keywordQuery;
    return await this.concertsService.searchConcert(keyword);
  }

  @Post('seatsetting') // 좌석 생성
  @UseGuards(AuthGuard)
  async createSeats(
    @Body() seats: CreateSeatsDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const userId: number = req.user.id;
    const { row, column, concertId, concertDateId } = seats;
    const results = await this.concertsService.createSeats(
      row,
      column,
      concertId,
      concertDateId,
      userId,
    );

    return res.json({
      message: `${row}열에 대한 좌석 입력에 성공했습니다.`,
      results,
    });
  }
}
