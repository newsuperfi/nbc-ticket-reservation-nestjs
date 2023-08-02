import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { User } from 'src/domain/users.entity';
import { IRequest } from 'src/commons/interfaces/context';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post() // 공연 예매
  @UseGuards(AuthGuard)
  async reservationConcert(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: IRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const results = await this.reservationsService.concertReservation(
      createReservationDto,
      userId,
    );
    return res.json({ message: '예매에 성공했습니다', results });
  }

  @Get('list') // 예매 내역 조회
  @UseGuards(AuthGuard)
  async reservationList(@Req() req: IRequest, @Res() res: Response) {
    const userId = req.user.id;
    const result = await this.reservationsService.reservationList(userId);
    return res.json(result);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.reservationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReservationDto: UpdateReservationDto,
  // ) {
  //   return this.reservationsService.update(+id, updateReservationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.reservationsService.remove(+id);
  // }
}
