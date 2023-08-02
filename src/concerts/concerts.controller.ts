import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ConcertsService } from './concerts.service';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { AuthGuard } from 'src/auth/security/auth.guard';

@Controller('concerts')
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Post('registration')
  @UseGuards(AuthGuard)
  async registration(@Body() createConcertDto: CreateConcertDto) {
    return this.concertsService.registration(createConcertDto);
  }

  @Get('list')
  list() {
    return this.concertsService.list();
  }

  @Post('registration/dates/:concertId')
  @UseGuards(AuthGuard)
  async datesRegistration(
    @Body() dates: Date[],
    @Param('concertId') concertId: number,
    @Res() res: Response,
  ) {
    const results = await this.concertsService.datesRegistration(
      concertId,
      dates,
    );
    return res.json({ message: '일정 등록에 성공했습니다.', results });
  }

  @Get('detail/:concertId')
  async concertDetail(
    @Param('concertId') concertId: number,
    @Res() res: Response,
  ) {
    const result = await this.concertsService.concertDetail(concertId);
    // if(!result) throw new
    return res.json({ result });
  }

  @Get('search')
  async searchConcert(@Query() keywordQuery) {
    const { keyword } = keywordQuery;
    return await this.concertsService.searchConcert(keyword);
  }
}
