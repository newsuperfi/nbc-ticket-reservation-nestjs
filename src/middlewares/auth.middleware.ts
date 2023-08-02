import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { Authorization } = req.cookies;
    const { authType, authToken } = (Authorization ?? '').split('');

    if (!authToken || authType !== 'Bearer')
      throw new UnauthorizedException('로그인 후 사용 가능한 기능입니다.');

    try {
      const { email } = this.jwtService.verify(
        authToken,
        'SECRET_KEY' as JwtVerifyOptions,
      );
      const user = await this.usersService.findByEmail(email);
      res.locals.user = user;
      next();
    } catch (err) {
      console.error(err);
    }
  }
}
