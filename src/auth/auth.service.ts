import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { User } from 'src/domain/users.entity';

import { UsersService } from 'src/users/users.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Payload } from 'src/auth/security/payload.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string; message: string } | undefined> {
    const { email, password } = loginUserDto;
    const user: User = await this.userService.findByEmail(email);
    if (!user)
      throw new BadRequestException({ message: '존재하지 않는 회원입니다.' });
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword)
      throw new UnauthorizedException({ message: ' 비밀번호를 확인해주세요' });

    const payload: Payload = { id: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      message: '로그인에 성공했습니다.',
    };
  }

  async tokenValidateUser(payload: Payload): Promise<User | undefined> {
    return await this.userService.findByEmail(payload.email);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
