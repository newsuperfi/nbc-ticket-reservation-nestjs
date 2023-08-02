import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/security/auth.guard';
import { User } from 'src/domain/users.entity';
import { IRequest } from 'src/commons/interfaces/context';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 회원가입
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.usersService.signUp(createUserDto);
  }

  // 프로필 조회
  @Get('profile')
  @UseGuards(AuthGuard)
  async profile(@Req() req: IRequest, @Res() res: Response) {
    const user = req.user;
    const result = await this.usersService.findById(user.id);
    const profile = {
      id: result.id,
      email: result.email,
      nickname: result.nickname,
      introduction: result.introduction,
      point: result.point,
    };
    return res.json(profile);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.updateUser(data);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
